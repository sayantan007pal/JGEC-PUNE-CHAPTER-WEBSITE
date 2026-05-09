import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Blog from "@/models/Blog";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await dbConnect();

    const { slug } = await params;

    const blog = await Blog.findOne({ slug, status: "published" })
      .populate("authorId", "fullName photoLink department passingYear email")
      .lean();

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // Rename authorId → author
    const { authorId, ...rest } = blog as Record<string, unknown>;

    // Get related blogs by tags
    const blogTags = (blog as { tags?: string[] }).tags || [];
    let relatedBlogs: object[] = [];
    if (blogTags.length > 0) {
      const related = await Blog.find({
        status: "published",
        _id: { $ne: (blog as { _id: object })._id },
        tags: { $in: blogTags },
      })
        .populate("authorId", "fullName photoLink")
        .select("title slug excerpt featuredImageUrl authorId publishedAt")
        .sort({ publishedAt: -1 })
        .limit(3)
        .lean();

      relatedBlogs = related.map((b) => {
        const { authorId: aId, ...bRest } = b as Record<string, unknown>;
        return { ...bRest, author: aId || { fullName: "Former Member" } };
      });
    }

    return NextResponse.json({
      blog: { ...rest, author: authorId || { fullName: "Former Member", email: "" } },
      relatedBlogs,
    });
  } catch (error) {
    console.error("[BLOG_SLUG_GET] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog." },
      { status: 500 }
    );
  }
}
