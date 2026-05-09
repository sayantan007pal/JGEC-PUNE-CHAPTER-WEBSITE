import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import ContactMessage from "@/models/ContactMessage";
import User from "@/models/User";
import { getAuthFromCookie } from "@/lib/auth";

const VALID_STATUSES = ["all", "unread", "read", "resolved"];

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthFromCookie();
    if (!auth) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await dbConnect();

    // Check if user is admin
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
      Math.max(1, Number(searchParams.get("limit") ?? 15))
    );
    const statusParam = searchParams.get("status") ?? "all";

    // Build filter
    const filter: Record<string, unknown> = {};
    if (statusParam !== "all" && VALID_STATUSES.includes(statusParam)) {
      filter.status = statusParam;
    }

    // Fetch messages and counts
    const [messages, total, unreadCount] = await Promise.all([
      ContactMessage.find(filter)
        .select("-__v")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      ContactMessage.countDocuments(filter),
      ContactMessage.countDocuments({ status: "unread" }),
    ]);

    return NextResponse.json({
      messages,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      unreadCount,
    });
  } catch (error) {
    console.error("[ADMIN_CONTACT] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch contact messages." },
      { status: 500 }
    );
  }
}
