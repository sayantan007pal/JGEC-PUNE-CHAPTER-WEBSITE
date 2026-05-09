import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import BlogFormWrapper from "@/components/blog/BlogFormWrapper";

export const metadata: Metadata = {
  title: "Write a Blog | JGEC Alumni Pune",
  description: "Share your story with the JGEC alumni community",
};

export default function WriteBlogPage() {
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
        <h1 className="text-3xl font-bold">Write a New Blog</h1>
        <p className="text-muted-foreground mt-2">
          Share your experiences, insights, and stories with the JGEC alumni community.
          Your blog will be reviewed before publishing.
        </p>
      </div>

      {/* Form */}
      <BlogFormWrapper mode="create" />
    </div>
  );
}
