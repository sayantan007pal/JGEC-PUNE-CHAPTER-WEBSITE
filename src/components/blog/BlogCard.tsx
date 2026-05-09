"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Trophy, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface BlogCardProps {
  blog: {
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
  };
}

export default function BlogCard({ blog }: BlogCardProps) {
  const publishedDate = new Date(blog.publishedAt);
  const timeAgo = formatDistanceToNow(publishedDate, { addSuffix: true });

  // Format month/year for "Best of" badge
  const formatBestOfMonth = (monthYear?: string) => {
    if (!monthYear) return "";
    const [year, month] = monthYear.split("-");
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    return `${monthNames[parseInt(month, 10) - 1]} ${year}`;
  };

  return (
    <Link href={`/blogs/${blog.slug}`} className="group block">
      <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-accent/50 group-hover:-translate-y-1">
        {/* Featured Image */}
        <div className="relative aspect-video overflow-hidden bg-secondary">
          {blog.featuredImageUrl ? (
            <Image
              src={blog.featuredImageUrl}
              alt={blog.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <User className="w-12 h-12" />
            </div>
          )}
          {/* Best of Month Badge */}
          {blog.isBestOfMonth && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-yellow-500/90 text-yellow-950 hover:bg-yellow-500 gap-1">
                <Trophy className="w-3 h-3" />
                Best of {formatBestOfMonth(blog.monthYear)}
              </Badge>
            </div>
          )}
        </div>

        <CardHeader className="pb-2">
          {/* Tags */}
          {blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {blog.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {blog.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{blog.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Title */}
          <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-accent transition-colors">
            {blog.title}
          </h3>
        </CardHeader>

        <CardContent className="pb-2">
          <p className="text-muted-foreground text-sm line-clamp-2">{blog.excerpt}</p>
        </CardContent>

        <CardFooter className="pt-2 border-t">
          <div className="flex items-center justify-between w-full text-sm">
            {/* Author */}
            <div className="flex items-center gap-2">
              <Avatar className="w-6 h-6">
                {blog.author?.imageUrl ? (
                  <AvatarImage src={blog.author.imageUrl} alt={blog.author.name} />
                ) : null}
                <AvatarFallback className="text-xs">
                  {blog.author?.name?.charAt(0)?.toUpperCase() || "A"}
                </AvatarFallback>
              </Avatar>
              <span className="text-muted-foreground truncate max-w-[100px]">
                {blog.author?.name || "Anonymous"}
              </span>
            </div>

            {/* Date */}
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="w-3 h-3" />
              <span className="text-xs">{timeAgo}</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
