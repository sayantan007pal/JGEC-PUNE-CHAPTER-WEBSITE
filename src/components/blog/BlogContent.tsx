"use client";

import dynamic from "next/dynamic";

const BlogRenderer = dynamic(() => import("./BlogRenderer"), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-secondary rounded w-3/4"></div>
      <div className="h-4 bg-secondary rounded w-full"></div>
      <div className="h-4 bg-secondary rounded w-5/6"></div>
    </div>
  ),
});

interface BlogContentProps {
  content: object;
}

export default function BlogContent({ content }: BlogContentProps) {
  return <BlogRenderer content={content} />;
}
