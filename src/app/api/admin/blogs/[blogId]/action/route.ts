import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Blog from "@/models/Blog";
import User from "@/models/User";
import { getAuthFromCookie } from "@/lib/auth";
import {
  sendBlogPublishedToAuthor,
  sendBlogRejectedToAuthor,
  sendBlogBestOfMonthToAuthor,
} from "@/lib/email";
import mongoose from "mongoose";

type ActionType = "publish" | "reject" | "mark_best";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ blogId: string }> }
) {
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

    const { blogId } = await params;
    const body = await request.json();
    const action: ActionType = body.action;
    const notes: string | undefined = body.notes;

    if (!["publish", "reject", "mark_best"].includes(action)) {
      return NextResponse.json(
        { error: "Action must be 'publish', 'reject', or 'mark_best'" },
        { status: 400 }
      );
    }

    const blog = await Blog.findById(blogId).populate("authorId", "fullName email");
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    const author = blog.authorId as unknown as { fullName: string; email: string } | null;

    // Handle different actions
    if (action === "publish") {
      if (blog.status !== "pending_review") {
        return NextResponse.json(
          { error: `Cannot publish a '${blog.status}' blog. Only pending_review blogs can be published.` },
          { status: 409 }
        );
      }

      blog.status = "published";
      blog.reviewedBy = new mongoose.Types.ObjectId(auth.userId);
      blog.publishedAt = new Date();
      if (notes?.trim()) blog.reviewNotes = notes.trim();
      await blog.save();

      // Notify author
      if (author?.email) {
        try {
          const blogUrl = `${process.env.NEXT_PUBLIC_BASE_URL || ""}/blogs/${blog.slug}`;
          await sendBlogPublishedToAuthor(author.email, {
            authorName: author.fullName,
            blogTitle: blog.title,
            blogUrl,
          });
        } catch (emailError) {
          console.error("[BLOG_ACTION] Failed to email author:", emailError);
        }
      }

      return NextResponse.json({
        message: "Blog published successfully",
        blogId: blog._id.toString(),
        status: blog.status,
      });
    }

    if (action === "reject") {
      if (blog.status !== "pending_review") {
        return NextResponse.json(
          { error: `Cannot reject a '${blog.status}' blog. Only pending_review blogs can be rejected.` },
          { status: 409 }
        );
      }

      if (!notes?.trim()) {
        return NextResponse.json(
          { error: "Rejection notes are required" },
          { status: 400 }
        );
      }

      blog.status = "rejected";
      blog.reviewedBy = new mongoose.Types.ObjectId(auth.userId);
      blog.reviewNotes = notes.trim();
      await blog.save();

      // Notify author
      if (author?.email) {
        try {
          await sendBlogRejectedToAuthor(author.email, {
            authorName: author.fullName,
            blogTitle: blog.title,
            rejectionNotes: notes.trim(),
          });
        } catch (emailError) {
          console.error("[BLOG_ACTION] Failed to email author:", emailError);
        }
      }

      return NextResponse.json({
        message: "Blog rejected",
        blogId: blog._id.toString(),
        status: blog.status,
      });
    }

    if (action === "mark_best") {
      if (blog.status !== "published") {
        return NextResponse.json(
          { error: "Can only mark published blogs as Best of Month" },
          { status: 409 }
        );
      }

      // Get current month-year
      const now = new Date();
      const monthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

      // Auto-unmark previous best of month for same month
      await Blog.updateMany(
        { isBestOfMonth: true, monthYear },
        { $set: { isBestOfMonth: false } }
      );

      blog.isBestOfMonth = true;
      blog.monthYear = monthYear;
      await blog.save();

      // Notify author
      if (author?.email) {
        try {
          await sendBlogBestOfMonthToAuthor(author.email, {
            authorName: author.fullName,
            blogTitle: blog.title,
            monthYear,
          });
        } catch (emailError) {
          console.error("[BLOG_ACTION] Failed to email author:", emailError);
        }
      }

      return NextResponse.json({
        message: "Blog marked as Best of Month",
        blogId: blog._id.toString(),
        monthYear,
      });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    console.error("[ADMIN_BLOG_ACTION] Error:", error);
    return NextResponse.json(
      { error: "Failed to process blog action." },
      { status: 500 }
    );
  }
}

// GET - Get single blog content for admin preview
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ blogId: string }> }
) {
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

    const { blogId } = await params;

    const blog = await Blog.findById(blogId)
      .populate("authorId", "fullName email photoLink department passingYear")
      .lean();

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    const { authorId, ...rest } = blog as Record<string, unknown>;

    return NextResponse.json({
      blog: { ...rest, author: authorId || { fullName: "Former Member", email: "" } },
    });
  } catch (error) {
    console.error("[ADMIN_BLOG_GET] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog." },
      { status: 500 }
    );
  }
}
