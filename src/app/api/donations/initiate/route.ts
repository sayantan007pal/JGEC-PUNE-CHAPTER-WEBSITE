import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getAuthFromCookie } from "@/lib/auth";

function createPaymentRequestRef(): string {
  return `DON-${Date.now()}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
}

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthFromCookie();
    if (!auth) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { amount } = await request.json();
    const parsedAmount = Number(amount);

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json(
        { error: "Amount must be a number greater than 0" },
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

    return NextResponse.json(
      {
        upiUrl,
        qrValue: upiUrl,
        paymentRequestRef,
        amount: parsedAmount,
        payment_type: "upi",
        validation_type: "manual",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[DONATIONS_INITIATE] Error:", error);
    return NextResponse.json(
      { error: "Failed to initiate donation payment." },
      { status: 500 },
    );
  }
}
