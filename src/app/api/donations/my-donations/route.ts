import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Donation from "@/models/Donation";
import { getAuthFromCookie } from "@/lib/auth";

const VALID_STATUSES = ["initiated", "pending", "verified", "rejected"];

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthFromCookie();
    if (!auth) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const limit = Math.min(
      50,
      Math.max(1, Number(searchParams.get("limit") ?? 10)),
    );
    const statusParam = searchParams.get("status") ?? "all";

    const filter: Record<string, unknown> = { userId: auth.userId };
    if (statusParam !== "all" && VALID_STATUSES.includes(statusParam)) {
      filter.status = statusParam;
    }

    const [donations, total] = await Promise.all([
      Donation.find(filter)
        .select(
          "amount donationCategory paymentRequestRef status utr proofSubmittedAt verificationDate donorMessage createdAt",
        )
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Donation.countDocuments(filter),
    ]);

    return NextResponse.json({
      donations,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("[MY_DONATIONS] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch donations." },
      { status: 500 },
    );
  }
}
