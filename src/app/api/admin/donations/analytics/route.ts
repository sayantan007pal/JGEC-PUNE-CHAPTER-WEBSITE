import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Donation from "@/models/Donation";
import User from "@/models/User";
import { getAuthFromCookie } from "@/lib/auth";

export async function GET() {
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

    const [
      totalDonations,
      verifiedCount,
      pendingCount,
      rejectedCount,
      initiatedCount,
      verifiedAmountAgg,
      byCategoryAgg,
      byMonthAgg,
      recentPendingRaw,
    ] = await Promise.all([
      Donation.countDocuments({}),
      Donation.countDocuments({ status: "verified" }),
      Donation.countDocuments({ status: "pending" }),
      Donation.countDocuments({ status: "rejected" }),
      Donation.countDocuments({ status: "initiated" }),
      Donation.aggregate([
        { $match: { status: "verified" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Donation.aggregate([
        {
          $group: {
            _id: "$donationCategory",
            count: { $sum: 1 },
            totalAmount: {
              $sum: { $cond: [{ $eq: ["$status", "verified"] }, "$amount", 0] },
            },
          },
        },
        { $sort: { totalAmount: -1 } },
      ]),
      Donation.aggregate([
        { $match: { status: { $in: ["pending", "verified", "rejected"] } } },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            count: { $sum: 1 },
            totalAmount: {
              $sum: { $cond: [{ $eq: ["$status", "verified"] }, "$amount", 0] },
            },
          },
        },
        { $sort: { "_id.year": -1, "_id.month": -1 } },
        { $limit: 12 },
      ]),
      Donation.find({ status: "pending" })
        .populate("userId", "fullName email")
        .select(
          "amount donationCategory paymentRequestRef proofSubmittedAt createdAt",
        )
        .sort({ proofSubmittedAt: 1 })
        .limit(5)
        .lean(),
    ]);

    const totalVerifiedAmount =
      (verifiedAmountAgg[0] as { total?: number } | undefined)?.total ?? 0;

    const byCategory = (
      byCategoryAgg as { _id: string; count: number; totalAmount: number }[]
    ).map((c) => ({
      category: c._id,
      count: c.count,
      totalAmount: c.totalAmount,
    }));

    // Reverse so oldest month is first (chronological order)
    const byMonth = (
      byMonthAgg as {
        _id: { year: number; month: number };
        count: number;
        totalAmount: number;
      }[]
    )
      .map((m) => ({
        month: `${m._id.year}-${String(m._id.month).padStart(2, "0")}`,
        count: m.count,
        totalAmount: m.totalAmount,
      }))
      .reverse();

    const recentPending = recentPendingRaw.map((d) => {
      const raw = d as Record<string, unknown>;
      const { userId, ...rest } = raw;
      return { ...rest, donor: userId };
    });

    return NextResponse.json({
      overview: {
        totalDonations,
        totalVerifiedAmount,
        pendingCount,
        verifiedCount,
        rejectedCount,
        initiatedCount,
      },
      byCategory,
      byMonth,
      recentPending,
    });
  } catch (error) {
    console.error("[ADMIN_ANALYTICS] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics." },
      { status: 500 },
    );
  }
}
