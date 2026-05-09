"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { BlogCard } from "@/components/blog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Trophy, PenLine, ChevronLeft, ChevronRight, X } from "lucide-react";
import apiClient from "@/lib/axios";
import Link from "next/link";

interface Blog {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  featuredImageUrl?: string;
  tags: string[];
  isBestOfMonth: boolean;
  monthYear?: string;
  publishedAt: string;
  author?: {
    name: string;
    imageUrl?: string;
  };
}

interface BlogsResponse {
  blogs: Blog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

function BlogsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [bestOfMonth, setBestOfMonth] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
    totalPages: 1,
  });

  const page = parseInt(searchParams.get("page") || "1", 10);
  const tag = searchParams.get("tag") || "";
  const search = searchParams.get("search") || "";

  const [searchInput, setSearchInput] = useState(search);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", "9");
      if (tag) params.set("tag", tag);
      if (search) params.set("search", search);

      const { data } = await apiClient.get<BlogsResponse>(`/api/blogs?${params.toString()}`);
      setBlogs(data.blogs);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
    } finally {
      setLoading(false);
    }
  }, [page, tag, search]);

  const fetchBestOfMonth = useCallback(async () => {
    try {
      const { data } = await apiClient.get<BlogsResponse>("/api/blogs?bestOfMonth=true&limit=1");
      setBestOfMonth(data.blogs[0] || null);
    } catch (error) {
      console.error("Failed to fetch best of month:", error);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
    if (page === 1 && !tag && !search) {
      fetchBestOfMonth();
    }
  }, [fetchBlogs, fetchBestOfMonth, page, tag, search]);

  const updateSearchParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page"); // Reset to page 1
    router.push(`/blogs?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateSearchParams("search", searchInput);
  };

  const clearFilters = () => {
    setSearchInput("");
    router.push("/blogs");
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-accent/5 to-transparent">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Member Blogs</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Stories, experiences, and insights from our alumni community. Share your journey
              and inspire fellow JGECians!
            </p>
            <Link href="/dashboard/my-blogs">
              <Button size="lg" className="gap-2">
                <PenLine className="w-4 h-4" />
                Write Your Blog
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Best of Month Feature (only on first page without filters) */}
      {bestOfMonth && page === 1 && !tag && !search && (
        <section className="py-8 bg-yellow-500/5">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <h2 className="text-xl font-semibold">Blog of the Month</h2>
            </div>
            <div className="max-w-md">
              <BlogCard blog={bestOfMonth} />
            </div>
          </div>
        </section>
      )}

      {/* Search and Filters */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search blogs..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit" variant="secondary">
                Search
              </Button>
            </form>

            {/* Active Filters */}
            {(tag || search) && (
              <div className="flex items-center gap-2 flex-wrap">
                {tag && (
                  <Badge variant="secondary" className="gap-1">
                    Tag: {tag}
                    <button
                      onClick={() => updateSearchParams("tag", "")}
                      className="hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {search && (
                  <Badge variant="secondary" className="gap-1">
                    Search: {search}
                    <button
                      onClick={() => updateSearchParams("search", "")}
                      className="hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear all
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Blogs Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-48 w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground mb-4">No blogs found</p>
              {(tag || search) && (
                <Button variant="outline" onClick={clearFilters}>
                  Clear filters
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map((blog) => (
                  <BlogCard key={blog._id} blog={blog} />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => {
                      const params = new URLSearchParams(searchParams.toString());
                      params.set("page", String(page - 1));
                      router.push(`/blogs?${params.toString()}`);
                    }}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground px-4">
                    Page {page} of {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= pagination.totalPages}
                    onClick={() => {
                      const params = new URLSearchParams(searchParams.toString());
                      params.set("page", String(page + 1));
                      router.push(`/blogs?${params.toString()}`);
                    }}
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export default function BlogsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
        </div>
      }
    >
      <BlogsContent />
    </Suspense>
  );
}
