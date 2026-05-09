import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { getAuthFromCookie } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthFromCookie();
    if (!auth) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") ?? 10)));
    const status = searchParams.get("status");

    const filter: Record<string, unknown> = { authorId: auth.userId };
    const validStatuses = ["draft", "pending_review", "published", "rejected"];
    if (status && validStatuses.includes(status)) {
      filter.status = status;
    }

    const [blogs, total] = await Promise.all([
      Blog.find(filter)
        .select("-content -contentImagePublicIds -__v")
        .sort({ updatedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Blog.countDocuments(filter),
    ]);

    return NextResponse.json({
      blogs,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("[MY_BLOGS_GET] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch your blogs." },
      { status: 500 }
    );
  }
}
