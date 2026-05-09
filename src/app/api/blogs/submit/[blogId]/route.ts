import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Blog from "@/models/Blog";
import User from "@/models/User";
import { getAuthFromCookie } from "@/lib/auth";
import {
  sendBlogSubmittedToAuthor,
  sendBlogSubmittedToAdmins,
} from "@/lib/email";

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

    const { blogId } = await params;

    const blog = await Blog.findById(blogId).populate(
      "authorId",
      "fullName email"
    );
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // Can only submit own blogs
    if (blog.authorId?._id?.toString() !== auth.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Can only submit drafts or rejected blogs
    if (blog.status !== "draft" && blog.status !== "rejected") {
      return NextResponse.json(
        { error: "Can only submit draft or rejected blogs for review" },
        { status: 409 }
      );
    }

    // Rate limiting: Max 3 submissions per day
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const submissionsToday = await Blog.countDocuments({
      authorId: auth.userId,
      submittedAt: { $gte: today },
    });

    if (submissionsToday >= 3) {
      return NextResponse.json(
        { error: "You can only submit 3 blogs per day. Please try again tomorrow." },
        { status: 429 }
      );
    }

    // Update status
    blog.status = "pending_review";
    blog.submittedAt = new Date();
    blog.reviewNotes = undefined;
    blog.reviewedBy = undefined;
    await blog.save();

    // Send emails
    const author = blog.authorId as unknown as { fullName: string; email: string };

    try {
      // Send copy to author
      await sendBlogSubmittedToAuthor(author.email, {
        authorName: author.fullName,
        blogTitle: blog.title,
        blogExcerpt: blog.excerpt,
      });
    } catch (emailError) {
      console.error("[BLOG_SUBMIT] Failed to email author:", emailError);
    }

    try {
      // Notify admins
      const admins = await User.find({ authRole: "admin" }).select("email").lean();
      const adminEmails = admins.map((a) => (a as { email: string }).email);
      if (adminEmails.length > 0) {
        await sendBlogSubmittedToAdmins(adminEmails, {
          authorName: author.fullName,
          authorEmail: author.email,
          blogTitle: blog.title,
          blogId: blog._id.toString(),
        });
      }
    } catch (emailError) {
      console.error("[BLOG_SUBMIT] Failed to notify admins:", emailError);
    }

    return NextResponse.json({
      message: "Blog submitted for review",
      blogId: blog._id.toString(),
      status: blog.status,
    });
  } catch (error) {
    console.error("[BLOG_SUBMIT] Error:", error);
    return NextResponse.json(
      { error: "Failed to submit blog." },
      { status: 500 }
    );
  }
}
