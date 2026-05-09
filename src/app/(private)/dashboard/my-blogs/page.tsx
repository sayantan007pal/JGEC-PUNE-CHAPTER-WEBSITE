"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  PenLine,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Trash2,
  Edit,
  Eye,
  Trophy,
  Calendar,
  Loader2,
} from "lucide-react";
import apiClient from "@/lib/axios";
import { formatDistanceToNow } from "date-fns";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImageUrl?: string;
  status: "draft" | "pending_review" | "published" | "rejected";
  isBestOfMonth: boolean;
  monthYear?: string;
  reviewNotes?: string;
  publishedAt?: string;
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface BlogsResponse {
  blogs: Blog[];
}

const statusConfig = {
  draft: {
    label: "Draft",
    icon: FileText,
    variant: "secondary" as const,
    color: "text-muted-foreground",
  },
  pending_review: {
    label: "Pending Review",
    icon: Clock,
    variant: "default" as const,
    color: "text-yellow-600",
  },
  published: {
    label: "Published",
    icon: CheckCircle,
    variant: "default" as const,
    color: "text-green-600",
  },
  rejected: {
    label: "Needs Revision",
    icon: XCircle,
    variant: "destructive" as const,
    color: "text-red-600",
  },
};

export default function MyBlogsPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = activeTab !== "all" ? `?status=${activeTab}` : "";
      const { data } = await apiClient.get<BlogsResponse>(`/api/blogs/my-blogs${params}`);
      setBlogs(data.blogs);
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
      toast.error("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleDelete = async (blogId: string) => {
    setDeletingId(blogId);
    try {
      await apiClient.delete("/api/blogs", { data: { blogId } });
      toast.success("Blog deleted");
      setBlogs((prev) => prev.filter((b) => b._id !== blogId));
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete blog");
    } finally {
      setDeletingId(null);
    }
  };

  const BlogCardSkeleton = () => (
    <Card>
      <CardHeader className="pb-3">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-6 w-3/4 mt-2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-9 w-full" />
      </CardFooter>
    </Card>
  );

  const renderBlogCard = (blog: Blog) => {
    const config = statusConfig[blog.status];
    const StatusIcon = config.icon;
    const canEdit = ["draft", "rejected"].includes(blog.status);
    const canDelete = ["draft", "rejected"].includes(blog.status);
    const canView = blog.status === "published";

    return (
      <Card key={blog._id} className="flex flex-col">
        {/* Featured Image */}
        {blog.featuredImageUrl && (
          <div className="relative h-40 overflow-hidden rounded-t-lg">
            <Image
              src={blog.featuredImageUrl}
              alt={blog.title}
              fill
              className="object-cover"
            />
            {blog.isBestOfMonth && (
              <Badge className="absolute top-2 left-2 bg-yellow-500 text-yellow-950 gap-1">
                <Trophy className="w-3 h-3" />
                Best of Month
              </Badge>
            )}
          </div>
        )}

        <CardHeader className="pb-2">
          {/* Status Badge */}
          <div className="flex items-center gap-2 mb-2">
            <Badge variant={config.variant} className="gap-1">
              <StatusIcon className="w-3 h-3" />
              {config.label}
            </Badge>
            {!blog.featuredImageUrl && blog.isBestOfMonth && (
              <Badge className="bg-yellow-500 text-yellow-950 gap-1">
                <Trophy className="w-3 h-3" />
                Best
              </Badge>
            )}
          </div>

          <CardTitle className="text-lg line-clamp-2">{blog.title}</CardTitle>
          <CardDescription className="line-clamp-2">{blog.excerpt}</CardDescription>
        </CardHeader>

        <CardContent className="flex-1 pb-2">
          {/* Review Notes for Rejected */}
          {blog.status === "rejected" && blog.reviewNotes && (
            <div className="bg-destructive/10 rounded-lg p-3 mb-3">
              <p className="text-xs font-medium text-destructive mb-1">Feedback:</p>
              <p className="text-sm text-muted-foreground">{blog.reviewNotes}</p>
            </div>
          )}

          {/* Dates */}
          <div className="text-xs text-muted-foreground space-y-1">
            {blog.publishedAt && (
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Published {formatDistanceToNow(new Date(blog.publishedAt), { addSuffix: true })}
              </div>
            )}
            {blog.submittedAt && blog.status === "pending_review" && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Submitted {formatDistanceToNow(new Date(blog.submittedAt), { addSuffix: true })}
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Updated {formatDistanceToNow(new Date(blog.updatedAt), { addSuffix: true })}
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-2 border-t gap-2 flex-wrap">
          {canEdit && (
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={() => router.push(`/dashboard/my-blogs/edit/${blog._id}`)}
            >
              <Edit className="w-3 h-3" />
              Edit
            </Button>
          )}

          {canView && (
            <Link href={`/blogs/${blog.slug}`}>
              <Button variant="outline" size="sm" className="gap-1">
                <Eye className="w-3 h-3" />
                View
              </Button>
            </Link>
          )}

          {canDelete && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive gap-1"
                  disabled={deletingId === blog._id}
                >
                  {deletingId === blog._id ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Trash2 className="w-3 h-3" />
                  )}
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Blog?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete &quot;{blog.title}&quot;. This action cannot be
                    undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDelete(blog._id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Blogs</h1>
          <p className="text-muted-foreground mt-1">
            Manage your blog posts and track their status
          </p>
        </div>
        <Link href="/dashboard/my-blogs/write">
          <Button className="gap-2">
            <PenLine className="w-4 h-4" />
            Write New Blog
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
          <TabsTrigger value="pending_review">Pending</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <BlogCardSkeleton key={i} />
              ))}
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-16 bg-secondary/20 rounded-xl">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No blogs found</h3>
              <p className="text-muted-foreground mb-4">
                {activeTab === "all"
                  ? "You haven't written any blogs yet."
                  : `You don't have any ${activeTab.replace("_", " ")} blogs.`}
              </p>
              <Link href="/dashboard/my-blogs/write">
                <Button className="gap-2">
                  <PenLine className="w-4 h-4" />
                  Write Your First Blog
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map(renderBlogCard)}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
