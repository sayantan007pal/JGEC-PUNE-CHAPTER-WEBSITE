import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Blog from "@/models/Blog";
import User from "@/models/User";
import { getAuthFromCookie } from "@/lib/auth";
import { nanoid } from "nanoid";

const VALID_STATUSES = ["all", "draft", "pending_review", "published", "rejected"];

// Helper to generate slug from title
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Helper to extract text from Tiptap JSON for excerpt
function extractTextFromContent(content: object): string {
  const text: string[] = [];

  function traverse(node: Record<string, unknown>) {
    if (node.type === "text" && typeof node.text === "string") {
      text.push(node.text);
    }
    if (Array.isArray(node.content)) {
      node.content.forEach((child) => traverse(child as Record<string, unknown>));
    }
  }

  traverse(content as Record<string, unknown>);
  return text.join(" ").slice(0, 300);
}

// GET - List all blogs with filters (admin only)
export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthFromCookie();
    if (!auth) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await dbConnect();

    const adminUser = await User.findById(auth.userId).select("authRole").lean();
    if (!adminUser || (adminUser as { authRole?: string }).authRole !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") ?? 15)));
    const statusParam = searchParams.get("status") ?? "pending_review";

    const filter: Record<string, unknown> = {};
    if (statusParam !== "all" && VALID_STATUSES.includes(statusParam)) {
      filter.status = statusParam;
    }

    const [rawBlogs, total] = await Promise.all([
      Blog.find(filter)
        .populate("authorId", "fullName email photoLink department passingYear")
        .select("-content -contentImagePublicIds -__v")
        .sort({ updatedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Blog.countDocuments(filter),
    ]);

    // Rename authorId → author
    const blogs = rawBlogs.map((b) => {
      const { authorId, ...rest } = b as Record<string, unknown>;
      return { ...rest, author: authorId || { fullName: "Former Member", email: "" } };
    });

    return NextResponse.json({
      blogs,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("[ADMIN_BLOGS_GET] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch blogs." },
      { status: 500 }
    );
  }
}

// POST - Admin creates and publishes directly
export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthFromCookie();
    if (!auth) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await dbConnect();

    const adminUser = await User.findById(auth.userId).select("authRole fullName").lean();
    if (!adminUser || (adminUser as { authRole?: string }).authRole !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { title, content, tags, featuredImageUrl, featuredImagePublicId, publishDirectly } = body;

    // Validation
    if (!title || typeof title !== "string" || title.trim().length < 5) {
      return NextResponse.json(
        { error: "Title must be at least 5 characters" },
        { status: 400 }
      );
    }

    if (title.trim().length > 200) {
      return NextResponse.json(
        { error: "Title cannot exceed 200 characters" },
        { status: 400 }
      );
    }

    if (!content || typeof content !== "object") {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    const cleanTags = Array.isArray(tags)
      ? tags
          .map((t: string) => t.trim().toLowerCase().slice(0, 30))
          .filter((t: string) => t.length > 0)
          .slice(0, 5)
      : [];

    const excerpt = extractTextFromContent(content);
    const slug = `${slugify(title.trim())}-${nanoid(6)}`;

    const newBlog = await Blog.create({
      authorId: auth.userId,
      title: title.trim(),
      slug,
      content,
      excerpt,
      tags: cleanTags,
      featuredImageUrl,
      featuredImagePublicId,
      status: publishDirectly ? "published" : "draft",
      publishedAt: publishDirectly ? new Date() : undefined,
    });

    return NextResponse.json({
      message: publishDirectly ? "Blog published" : "Blog saved as draft",
      blogId: newBlog._id.toString(),
      slug: newBlog.slug,
      status: newBlog.status,
    });
  } catch (error) {
    console.error("[ADMIN_BLOGS_POST] Error:", error);
    return NextResponse.json(
      { error: "Failed to create blog." },
      { status: 500 }
    );
  }
}
