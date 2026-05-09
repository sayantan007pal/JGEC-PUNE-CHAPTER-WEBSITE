import { notFound, redirect } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { getAuthFromCookie } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";
import BlogFormWrapper from "@/components/blog/BlogFormWrapper";

interface PageProps {
  params: Promise<{ blogId: string }>;
}

async function getBlog(blogId: string, userId: string) {
  await connectDB();

  const blog = await Blog.findOne({
    _id: blogId,
    authorId: userId,
    status: { $in: ["draft", "rejected"] },
  }).lean();

  if (!blog) return null;

  return {
    _id: blog._id.toString(),
    title: blog.title,
    content: blog.content,
    excerpt: blog.excerpt,
    tags: blog.tags,
    featuredImageUrl: blog.featuredImageUrl,
    featuredImagePublicId: blog.featuredImagePublicId,
    contentImagePublicIds: blog.contentImagePublicIds,
    status: blog.status,
  };
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Edit Blog | JGEC Alumni Pune",
    description: "Edit your blog post",
  };
}

export default async function EditBlogPage({ params }: PageProps) {
  const { blogId } = await params;

  const auth = await getAuthFromCookie();
  if (!auth) {
    redirect("/login");
  }

  const blog = await getBlog(blogId, auth.userId);

  if (!blog) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link href="/dashboard/my-blogs">
          <Button variant="ghost" size="sm" className="gap-2 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to My Blogs
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Edit Blog</h1>
        <p className="text-muted-foreground mt-2">
          {blog.status === "rejected"
            ? "Your blog was returned for revision. Make changes and resubmit for review."
            : "Continue working on your draft and submit when ready."}
        </p>
      </div>

      {/* Form */}
      <BlogFormWrapper mode="edit" initialData={blog} />
    </div>
  );
}
