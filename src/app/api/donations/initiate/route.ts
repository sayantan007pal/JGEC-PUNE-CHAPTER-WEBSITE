import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getAuthFromCookie } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Donation, { type DonationCategory } from "@/models/Donation";

const VALID_CATEGORIES: DonationCategory[] = [
  "scholarship",
  "infrastructure",
  "innovation",
  "alumni_activities",
  "general",
];

function createPaymentRequestRef(): string {
  return `DON-${Date.now()}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
}

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthFromCookie();
    if (!auth) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const parsedAmount = Number(body.amount);

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json(
        { error: "Amount must be a number greater than 0" },
        { status: 400 },
      );
    }

    const donationCategory: DonationCategory = VALID_CATEGORIES.includes(
      body.donationCategory,
    )
      ? (body.donationCategory as DonationCategory)
      : "general";

    const upiId = process.env.UPI_ID?.trim();
    const upiPayeeName = process.env.UPI_PAYEE_NAME?.trim();
    if (!upiId || !upiPayeeName) {
      return NextResponse.json(
        {
          error:
            "Donation service is not configured. Missing UPI_ID or UPI_PAYEE_NAME.",
        },
        { status: 500 },
      );
    }

    const paymentRequestRef = createPaymentRequestRef();
    const notePrefix = process.env.UPI_NOTE_PREFIX?.trim() || "JGEC Donation";
    const note = `${notePrefix} (${paymentRequestRef})`;

    const query = new URLSearchParams({
      pa: upiId,
      pn: upiPayeeName,
      am: parsedAmount.toFixed(2),
      cu: "INR",
      tn: note,
      tr: paymentRequestRef,
    });

    const upiUrl = `upi://pay?${query.toString()}`;

    // Persist the initiated record so proof can reference it later
    await dbConnect();
    const donation = await Donation.create({
      userId: auth.userId,
      amount: parsedAmount,
      donationCategory,
      paymentRequestRef,
      payment_type: "upi",
      validation_type: "manual",
      upiId,
      upiPayeeName,
      status: "initiated",
      isVerified: false,
    });

    return NextResponse.json(
      {
        donationId: donation._id.toString(),
        upiUrl,
        qrValue: upiUrl,
        paymentRequestRef,
        amount: parsedAmount,
        donationCategory,
        payment_type: "upi",
        validation_type: "manual",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[DONATIONS_INITIATE] Error:", error);
    return NextResponse.json(
      { error: "Failed to initiate donation payment." },
      { status: 500 },
    );
  }
}
