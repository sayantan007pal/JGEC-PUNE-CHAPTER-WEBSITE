import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Blog from "@/models/Blog";
import User from "@/models/User";
import { getAuthFromCookie } from "@/lib/auth";
import { nanoid } from "nanoid";

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

// GET - List published blogs (public)
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") ?? 12)));
    const tag = searchParams.get("tag");
    const search = searchParams.get("search");

    const filter: Record<string, unknown> = { status: "published" };

    if (tag) {
      filter.tags = tag.toLowerCase();
    }

    if (search) {
      filter.$text = { $search: search };
    }

    // Get best of month for current/previous month
    const now = new Date();
    const currentMonthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    const [blogs, total, bestOfMonth] = await Promise.all([
      Blog.find(filter)
        .populate("authorId", "fullName photoLink department passingYear")
        .select("-content -contentImagePublicIds -__v")
        .sort({ publishedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Blog.countDocuments(filter),
      Blog.findOne({ isBestOfMonth: true, status: "published" })
        .populate("authorId", "fullName photoLink department passingYear")
        .select("-content -contentImagePublicIds -__v")
        .sort({ monthYear: -1 })
        .lean(),
    ]);

    // Rename authorId → author, normalize field names for client
    const formattedBlogs = blogs.map((b) => {
      const { authorId, ...rest } = b as Record<string, unknown>;
      const a = authorId as Record<string, unknown> | null;
      return {
        ...rest,
        author: a
          ? { name: a.fullName, imageUrl: a.photoLink, department: a.department, passingYear: a.passingYear }
          : { name: "Former Member" },
      };
    });

    const formattedBest = bestOfMonth
      ? (() => {
          const { authorId, ...rest } = bestOfMonth as Record<string, unknown>;
          const a = authorId as Record<string, unknown> | null;
          return {
            ...rest,
            author: a
              ? { name: a.fullName, imageUrl: a.photoLink, department: a.department, passingYear: a.passingYear }
              : { name: "Former Member" },
          };
        })()
      : null;

    return NextResponse.json({
      blogs: formattedBlogs,
      bestOfMonth: formattedBest,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("[BLOGS_GET] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch blogs." },
      { status: 500 }
    );
  }
}

// POST - Create or update draft (authenticated users)
export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthFromCookie();
    if (!auth) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await dbConnect();

    const user = await User.findById(auth.userId).select("fullName isEmailVerified").lean();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (!(user as { isEmailVerified?: boolean }).isEmailVerified) {
      return NextResponse.json(
        { error: "Please verify your email first" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { blogId, title, content, tags, featuredImageUrl, featuredImagePublicId } = body;

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

    // Check content size (max 100KB)
    const contentSize = Buffer.byteLength(JSON.stringify(content), "utf8");
    if (contentSize > 100 * 1024) {
      return NextResponse.json(
        { error: "Content exceeds maximum size of 100KB" },
        { status: 400 }
      );
    }

    const cleanTags = Array.isArray(tags)
      ? tags
          .map((t: string) => t.trim().slice(0, 50))
          .filter((t: string) => t.length > 0)
          .slice(0, 5)
      : [];

    const excerpt = extractTextFromContent(content);

    // Update existing draft
    if (blogId) {
      const blog = await Blog.findById(blogId);
      if (!blog) {
        return NextResponse.json({ error: "Blog not found" }, { status: 404 });
      }

      // Can only edit own blogs
      if (blog.authorId?.toString() !== auth.userId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      // Can only edit drafts or rejected blogs
      if (blog.status !== "draft" && blog.status !== "rejected") {
        return NextResponse.json(
          { error: "Can only edit draft or rejected blogs" },
          { status: 409 }
        );
      }

      // If editing a rejected blog, reset to draft
      if (blog.status === "rejected") {
        blog.status = "draft";
        blog.reviewNotes = undefined;
        blog.reviewedBy = undefined;
      }

      blog.title = title.trim();
      blog.content = content;
      blog.excerpt = excerpt;
      blog.tags = cleanTags;
      if (featuredImageUrl) blog.featuredImageUrl = featuredImageUrl;
      if (featuredImagePublicId) blog.featuredImagePublicId = featuredImagePublicId;
      blog.version += 1;

      await blog.save();

      return NextResponse.json({
        message: "Blog saved",
        blogId: blog._id.toString(),
        slug: blog.slug,
        status: blog.status,
      });
    }

    // Create new draft
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
      status: "draft",
    });

    return NextResponse.json({
      message: "Blog created",
      blogId: newBlog._id.toString(),
      slug: newBlog.slug,
      status: newBlog.status,
    });
  } catch (error) {
    console.error("[BLOGS_POST] Error:", error);
    return NextResponse.json(
      { error: "Failed to save blog." },
      { status: 500 }
    );
  }
}

// DELETE - Delete own draft or rejected blog
export async function DELETE(request: NextRequest) {
  try {
    const auth = await getAuthFromCookie();
    if (!auth) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const blogId = searchParams.get("blogId");

    if (!blogId) {
      return NextResponse.json({ error: "blogId is required" }, { status: 400 });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // Can only delete own blogs
    if (blog.authorId?.toString() !== auth.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Can only delete drafts or rejected
    if (blog.status !== "draft" && blog.status !== "rejected") {
      return NextResponse.json(
        { error: "Can only delete draft or rejected blogs" },
        { status: 409 }
      );
    }

    // Delete images from Cloudinary
    const { deleteFromCloudinary } = await import("@/lib/cloudinary");
    const publicIdsToDelete = [
      blog.featuredImagePublicId,
      ...blog.contentImagePublicIds,
    ].filter(Boolean) as string[];

    await Promise.all(
      publicIdsToDelete.map((id) =>
        deleteFromCloudinary(id).catch((err) =>
          console.error(`Failed to delete image ${id}:`, err)
        )
      )
    );

    await blog.deleteOne();

    return NextResponse.json({ message: "Blog deleted" });
  } catch (error) {
    console.error("[BLOGS_DELETE] Error:", error);
    return NextResponse.json(
      { error: "Failed to delete blog." },
      { status: 500 }
    );
  }
}
