import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Donation from "@/models/Donation";
import User from "@/models/User";
import { deleteFromCloudinary, uploadToCloudinary } from "@/lib/cloudinary";
import { MAX_PHOTO_SIZE } from "@/constants/user";
import { getAuthFromCookie } from "@/lib/auth";
import { sendDonationNotificationEmailToAdmins } from "@/lib/email";

const UPI_ID_PATTERN = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;

export async function POST(request: NextRequest) {
  let proofImagePublicId: string | undefined;
  try {
    const auth = await getAuthFromCookie();
    if (!auth) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await dbConnect();

    const formData = await request.formData();
    const readOnlyFields = [
      "payment_type",
      "validation_type",
      "isVerified",
      "upiId",
      "upiPayeeName",
    ];
    const attemptedOverride = readOnlyFields.find((key) => formData.has(key));
    if (attemptedOverride) {
      return NextResponse.json(
        { error: `Field '${attemptedOverride}' is server-controlled.` },
        { status: 400 },
      );
    }

    const getString = (key: string): string =>
      (formData.get(key) as string | null)?.trim() ?? "";

    const amountRaw = getString("amount");
    const paymentRequestRef = getString("paymentRequestRef");
    const utr = getString("utr");
    const payeeUpi = getString("payeeUpi");
    const donorMessage = getString("donorMessage");
    const proofImageFile = formData.get("proofImage") as File | null;

    if (!amountRaw || !paymentRequestRef || !utr) {
      return NextResponse.json(
        { error: "amount, paymentRequestRef, and utr are required" },
        { status: 400 },
      );
    }

    const amount = Number(amountRaw);
    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        { error: "Amount must be a number greater than 0" },
        { status: 400 },
      );
    }

    if (utr.length < 6 || utr.length > 50) {
      return NextResponse.json(
        { error: "UTR must be between 6 and 50 characters" },
        { status: 400 },
      );
    }

    if (payeeUpi && !UPI_ID_PATTERN.test(payeeUpi)) {
      return NextResponse.json(
        { error: "Invalid payeeUpi format" },
        { status: 400 },
      );
    }

    if (!proofImageFile || proofImageFile.size === 0) {
      return NextResponse.json(
        { error: "Payment proof image is required" },
        { status: 400 },
      );
    }
    if (!proofImageFile.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Uploaded payment proof must be an image" },
        { status: 400 },
      );
    }
    if (proofImageFile.size > MAX_PHOTO_SIZE) {
      return NextResponse.json(
        { error: `Proof image must be ${MAX_PHOTO_SIZE / (1024 * 1024)} MB or smaller` },
        { status: 400 },
      );
    }

    const upiId = process.env.UPI_ID?.trim();
    const upiPayeeName = process.env.UPI_PAYEE_NAME?.trim();
    if (!upiId || !upiPayeeName) {
      return NextResponse.json(
        { error: "Donation service is not configured. Missing UPI_ID or UPI_PAYEE_NAME." },
        { status: 500 },
      );
    }

    const donorUser = await User.findById(auth.userId).select("fullName email");
    if (!donorUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const cloudinaryUpload = await uploadToCloudinary(
      proofImageFile,
      `${donorUser.fullName}_donation_proof`,
    );
    proofImagePublicId = cloudinaryUpload.public_id;

    const donation = await Donation.create({
      userId: donorUser._id,
      amount,
      utr,
      payeeUpi: payeeUpi || undefined,
      paymentRequestRef,
      payment_type: "upi",
      validation_type: "manual",
      isVerified: false,
      upiId,
      upiPayeeName,
      proofImageUrl: cloudinaryUpload.secure_url,
      proofImagePublicId,
      donorMessage: donorMessage || undefined,
    });

    const adminUsers = await User.find({ authRole: "admin" }).select("email").lean();
    const adminEmails = adminUsers
      .map((admin) => {
        const email = (admin as { email?: unknown }).email;
        return typeof email === "string" ? email : "";
      })
      .filter(Boolean);

    if (adminEmails.length === 0) {
      console.warn("[DONATIONS] Donation saved but no admin users found for notification.");
    } else {
      try {
        await sendDonationNotificationEmailToAdmins(adminEmails, {
          donorName: donorUser.fullName,
          donorEmail: donorUser.email,
          amount,
          utr,
          payeeUpi: payeeUpi || undefined,
          upiId,
          upiPayeeName,
          paymentType: "upi",
          validationType: "manual",
          manualValidationRequired: true,
          donationId: donation._id.toString(),
          paymentRequestRef,
          proofImageUrl: cloudinaryUpload.secure_url,
          donorMessage: donorMessage || undefined,
        });
      } catch (emailError) {
        console.error("[DONATIONS] Failed to notify admins via email:", emailError);
      }
    }

    return NextResponse.json(
      {
        message: "Donation submitted successfully. It will be manually verified.",
        donationId: donation._id.toString(),
      },
      { status: 201 },
    );
  } catch (error) {
    if (proofImagePublicId) {
      try {
        await deleteFromCloudinary(proofImagePublicId);
      } catch (cleanupError) {
        console.error("[DONATIONS] Failed to cleanup proof image:", cleanupError);
      }
    }

    console.error("[DONATIONS] Error:", error);
    if (error instanceof Error && error.name === "ValidationError") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to submit donation." },
      { status: 500 },
    );
  }
}
