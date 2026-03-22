import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Donation from "@/models/Donation";
import User from "@/models/User";
import { getAuthFromCookie } from "@/lib/auth";

const VALID_STATUSES = ["all", "initiated", "pending", "verified", "rejected"];
const VALID_CATEGORIES = [
  "all",
  "scholarship",
  "infrastructure",
  "innovation",
  "alumni_activities",
  "general",
];

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const limit = Math.min(
      50,
      Math.max(1, Number(searchParams.get("limit") ?? 10)),
    );
    const statusParam = searchParams.get("status") ?? "pending";
    const categoryParam = searchParams.get("category") ?? "all";

    const filter: Record<string, unknown> = {};
    if (statusParam !== "all" && VALID_STATUSES.includes(statusParam)) {
      filter.status = statusParam;
    }
    if (categoryParam !== "all" && VALID_CATEGORIES.includes(categoryParam)) {
      filter.donationCategory = categoryParam;
    }

    const [rawDonations, total] = await Promise.all([
      Donation.find(filter)
        .populate("userId", "fullName email passingYear department")
        .select("-__v")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Donation.countDocuments(filter),
    ]);

    // Rename userId → donor for cleaner API response
    const donations = rawDonations.map((d) => {
      const raw = d as Record<string, unknown>;
      const { userId, ...rest } = raw;
      return { ...rest, donor: userId };
    });

    return NextResponse.json({
      donations,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("[ADMIN_DONATIONS] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch donations." },
      { status: 500 },
    );
  }
}
