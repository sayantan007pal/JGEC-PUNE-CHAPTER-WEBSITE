import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Donation from "@/models/Donation";
import User from "@/models/User";
import { getAuthFromCookie } from "@/lib/auth";
import {
  sendDonationVerifiedEmail,
  sendDonationRejectedEmail,
} from "@/lib/email";
import mongoose from "mongoose";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ donationId: string }> },
) {
  try {
    const auth = await getAuthFromCookie();
    if (!auth) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await dbConnect();

    const adminUser = await User.findById(auth.userId)
      .select("authRole")
      .lean();
    if (
      !adminUser ||
      (adminUser as { authRole?: string }).authRole !== "admin"
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { donationId } = await params;
    const body = await request.json();
    const action: string = body.action;
    const notes: string | undefined = body.notes;

    if (action !== "verify" && action !== "reject") {
      return NextResponse.json(
        { error: "Action must be 'verify' or 'reject'" },
        { status: 400 },
      );
    }

    const donation = await Donation.findById(donationId).populate(
      "userId",
      "fullName email",
    );
    if (!donation) {
      return NextResponse.json(
        { error: "Donation not found" },
        { status: 404 },
      );
    }

    if (donation.status !== "pending") {
      return NextResponse.json(
        {
          error: `Cannot action a '${donation.status}' donation. Only pending donations can be verified or rejected.`,
        },
        { status: 409 },
      );
    }

    donation.status = action === "verify" ? "verified" : "rejected";
    donation.isVerified = action === "verify";
    donation.verifiedBy = new mongoose.Types.ObjectId(auth.userId);
    donation.verificationDate = new Date();
    if (notes?.trim()) donation.verificationNotes = notes.trim();
    await donation.save();

    // Notify the donor
    const donor = donation.userId as unknown as {
      fullName: string;
      email: string;
    };
    try {
      if (action === "verify") {
        await sendDonationVerifiedEmail(donor.email, {
          donorName: donor.fullName,
          amount: donation.amount,
          donationCategory: donation.donationCategory,
          donationId: donation._id.toString(),
          paymentRequestRef: donation.paymentRequestRef,
        });
      } else {
        await sendDonationRejectedEmail(donor.email, {
          donorName: donor.fullName,
          amount: donation.amount,
          donationCategory: donation.donationCategory,
          donationId: donation._id.toString(),
          paymentRequestRef: donation.paymentRequestRef,
          rejectionNotes: notes?.trim() || undefined,
        });
      }
    } catch (emailError) {
      console.error("[ADMIN_ACTION] Failed to email donor:", emailError);
    }

    return NextResponse.json({
      message: `Donation successfully ${action === "verify" ? "verified" : "rejected"}.`,
      donationId: donation._id.toString(),
      status: donation.status,
    });
  } catch (error) {
    console.error("[ADMIN_ACTION] Error:", error);
    return NextResponse.json(
      { error: "Failed to process donation action." },
      { status: 500 },
    );
  }
}
