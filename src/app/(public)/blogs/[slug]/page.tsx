import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BlogCard } from "@/components/blog";
import BlogContent from "@/components/blog/BlogContent";
import { Calendar, Trophy, ArrowLeft, User, Clock } from "lucide-react";
import { format } from "date-fns";
import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";
import UserModel from "@/models/User";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getBlog(slug: string) {
  await connectDB();

  const blog = await Blog.findOne({ slug, status: "published" })
    .select("title slug content excerpt tags featuredImageUrl isBestOfMonth monthYear publishedAt authorId")
    .lean();

  if (!blog) return null;

  const author = await UserModel.findById(blog.authorId)
    .select("fullName photoLink")
    .lean();

  // Get related blogs by tags
  const relatedBlogs = await Blog.find({
    _id: { $ne: blog._id },
    status: "published",
    tags: { $in: blog.tags },
  })
    .select("title slug excerpt featuredImageUrl tags isBestOfMonth monthYear publishedAt authorId")
    .sort({ publishedAt: -1 })
    .limit(3)
    .lean();

  // Get authors for related blogs
  const authorIds = relatedBlogs.map((b) => b.authorId).filter(Boolean);
  const authors = await UserModel.find({ _id: { $in: authorIds } })
    .select("fullName photoLink")
    .lean();
  const authorMap = new Map(authors.map((a) => [a._id.toString(), { name: a.fullName, imageUrl: a.photoLink }]));

  return {
    blog: {
      ...blog,
      _id: blog._id.toString(),
      authorId: blog.authorId?.toString() || "",
      publishedAt: blog.publishedAt?.toISOString() || new Date().toISOString(),
      author: author
        ? { name: author.fullName, imageUrl: author.photoLink }
        : { name: "Anonymous" },
    },
    relatedBlogs: relatedBlogs.map((b) => ({
      ...b,
      _id: b._id.toString(),
      authorId: b.authorId?.toString() || "",
      publishedAt: b.publishedAt?.toISOString() || new Date().toISOString(),
      author: b.authorId ? (authorMap.get(b.authorId.toString()) || { name: "Anonymous" }) : { name: "Anonymous" },
    })),
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getBlog(slug);

  if (!data) {
    return {
      title: "Blog Not Found",
    };
  }

  return {
    title: `${data.blog.title} | JGEC Alumni Pune`,
    description: data.blog.excerpt,
    openGraph: {
      title: data.blog.title,
      description: data.blog.excerpt,
      type: "article",
      publishedTime: data.blog.publishedAt,
      images: data.blog.featuredImageUrl ? [data.blog.featuredImageUrl] : [],
    },
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getBlog(slug);

  if (!data) {
    notFound();
  }

  const { blog, relatedBlogs } = data;
  const publishedDate = new Date(blog.publishedAt);

  // Calculate reading time (rough estimate: 200 words per minute)
  const wordCount = JSON.stringify(blog.content).split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  // Format month/year for "Best of" badge
  const formatBestOfMonth = (monthYear?: string) => {
    if (!monthYear) return "";
    const [year, month] = monthYear.split("-");
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ];
    return `${monthNames[parseInt(month, 10) - 1]} ${year}`;
  };

  return (
    <div className="min-h-screen">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <Link href="/blogs">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Blogs
          </Button>
        </Link>
      </div>

      {/* Hero Section */}
      <article className="container mx-auto px-4 max-w-4xl">
        {/* Best of Month Badge */}
        {blog.isBestOfMonth && (
          <div className="mb-4">
            <Badge className="bg-yellow-500/90 text-yellow-950 hover:bg-yellow-500 gap-1 text-sm px-3 py-1">
              <Trophy className="w-4 h-4" />
              Best Blog of {formatBestOfMonth(blog.monthYear)}
            </Badge>
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
          {blog.title}
        </h1>

        {/* Author & Meta */}
        <div className="flex flex-wrap items-center gap-4 mb-8 text-muted-foreground">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              {blog.author?.imageUrl ? (
                <AvatarImage src={blog.author.imageUrl} alt={blog.author.name} />
              ) : null}
              <AvatarFallback>
                <User className="w-5 h-5" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-foreground">{blog.author?.name}</p>
              <p className="text-sm">JGEC Alumni</p>
            </div>
          </div>

          <Separator orientation="vertical" className="h-8 hidden sm:block" />

          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{format(publishedDate, "MMMM d, yyyy")}</span>
          </div>

          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{readingTime} min read</span>
          </div>
        </div>

        {/* Featured Image */}
        {blog.featuredImageUrl && (
          <div className="relative aspect-video rounded-xl overflow-hidden mb-8 bg-secondary">
            <Image
              src={blog.featuredImageUrl}
              alt={blog.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Tags */}
        {blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {blog.tags.map((tag) => (
              <Link key={tag} href={`/blogs?tag=${encodeURIComponent(tag)}`}>
                <Badge variant="secondary" className="hover:bg-accent hover:text-accent-foreground">
                  {tag}
                </Badge>
              </Link>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="mb-12">
          <BlogContent content={blog.content} />
        </div>

        <Separator className="my-12" />

        {/* Author Bio */}
        <div className="bg-secondary/30 rounded-xl p-6 mb-12">
          <div className="flex items-start gap-4">
            <Avatar className="w-16 h-16">
              {blog.author?.imageUrl ? (
                <AvatarImage src={blog.author.imageUrl} alt={blog.author.name} />
              ) : null}
              <AvatarFallback className="text-xl">
                <User className="w-8 h-8" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg mb-1">
                Written by {blog.author?.name}
              </h3>
              <p className="text-muted-foreground text-sm mb-3">
                JGEC Alumni Member
              </p>
              <p className="text-muted-foreground">
                Thank you for reading! Want to share your story too?
              </p>
              <Link href="/dashboard/my-blogs" className="inline-block mt-3">
                <Button variant="outline" size="sm">
                  Write Your Blog
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </article>

      {/* Related Blogs */}
      {relatedBlogs.length > 0 && (
        <section className="bg-secondary/20 py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Related Blogs</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedBlogs.map((relatedBlog) => (
                <BlogCard key={relatedBlog._id} blog={relatedBlog} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
