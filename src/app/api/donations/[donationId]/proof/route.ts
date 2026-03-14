import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Donation from "@/models/Donation";
import User from "@/models/User";
import { deleteFromCloudinary, uploadToCloudinary } from "@/lib/cloudinary";
import { MAX_PHOTO_SIZE } from "@/constants/user";
import { getAuthFromCookie } from "@/lib/auth";
import {
  sendDonationProofReceivedEmailToAdmins,
  sendDonationProofReceivedEmailToDonor,
} from "@/lib/email";

const UPI_ID_PATTERN = /^[a-zA-Z0-9._-]{2,256}@[a-zA-Z]{2,64}$/;

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ donationId: string }> },
) {
  let proofImagePublicId: string | undefined;
  try {
    const auth = await getAuthFromCookie();
    if (!auth) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { donationId } = await params;

    await dbConnect();

    const donation = await Donation.findById(donationId);
    if (!donation) {
      return NextResponse.json(
        { error: "Donation Record not found" },
        { status: 404 },
      );
    }
    if (donation.userId.toString() !== auth.userId) {
      return NextResponse.json(
        { error: "Forbidden: You are not the owner of this donation" },
        { status: 403 },
      );
    }
    if (donation.status !== "initiated") {
      return NextResponse.json(
        {
          error: `Proof can only be submitted for an initiated payment. This donation is already '${donation.status}'.`,
        },
        { status: 409 },
      );
    }

    const formData = await request.formData();
    const getString = (key: string): string =>
      (formData.get(key) as string | null)?.trim() ?? "";

    const utr = getString("utr");
    const payeeUpi = getString("payeeUpi");
    const donorMessage = getString("donorMessage");
    const proofImageFile = formData.get("proofImage") as File | null;

    if (!utr) {
      return NextResponse.json({ error: "UTR is required" }, { status: 400 });
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
        {
          error: `Proof image must be ${MAX_PHOTO_SIZE / (1024 * 1024)} MB or smaller`,
        },
        { status: 400 },
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

    // Update the donation record to pending with proof details
    donation.utr = utr;
    if (payeeUpi) donation.payeeUpi = payeeUpi;
    if (donorMessage) donation.donorMessage = donorMessage;
    donation.proofImageUrl = cloudinaryUpload.secure_url;
    donation.proofImagePublicId = cloudinaryUpload.public_id;
    donation.proofSubmittedAt = new Date();
    donation.status = "pending";
    await donation.save();

    // Email first 3 admins (sorted by account creation — earliest admins first)
    const adminUsers = await User.find({ authRole: "admin" })
      .sort({ createdAt: 1 })
      .limit(3)
      .select("email")
      .lean();

    const adminEmails = adminUsers
      .map((a) => {
        const email = (a as { email?: unknown }).email;
        return typeof email === "string" ? email : "";
      })
      .filter(Boolean);

    if (adminEmails.length > 0) {
      try {
        await sendDonationProofReceivedEmailToAdmins(adminEmails, {
          donorName: donorUser.fullName,
          donorEmail: donorUser.email,
          amount: donation.amount,
          donationCategory: donation.donationCategory,
          utr,
          payeeUpi: payeeUpi || undefined,
          upiId: donation.upiId,
          upiPayeeName: donation.upiPayeeName,
          donationId: donation._id.toString(),
          paymentRequestRef: donation.paymentRequestRef,
          proofImageUrl: cloudinaryUpload.secure_url,
          donorMessage: donorMessage || undefined,
        });
      } catch (emailError) {
        console.error("[DONATIONS_PROOF] Failed to notify admins:", emailError);
      }
    } else {
      console.warn("[DONATIONS_PROOF] No admin users found for notification.");
    }

    // Confirmation email to donor
    try {
      await sendDonationProofReceivedEmailToDonor(donorUser.email, {
        donorName: donorUser.fullName,
        amount: donation.amount,
        donationCategory: donation.donationCategory,
        donationId: donation._id.toString(),
        paymentRequestRef: donation.paymentRequestRef,
      });
    } catch (emailError) {
      console.error("[DONATIONS_PROOF] Failed to email donor:", emailError);
    }

    return NextResponse.json(
      {
        message:
          "Donation proof submitted successfully. It will be manually verified.",
        donationId: donation._id.toString(),
      },
      { status: 200 },
    );
  } catch (error) {
    if (proofImagePublicId) {
      try {
        await deleteFromCloudinary(proofImagePublicId);
      } catch (cleanupError) {
        console.error(
          "[DONATIONS_PROOF] Failed to cleanup proof image:",
          cleanupError,
        );
      }
    }
    console.error("[DONATIONS_PROOF] Error:", error);
    if (error instanceof Error && error.name === "ValidationError") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to submit donation proof." },
      { status: 500 },
    );
  }
}
