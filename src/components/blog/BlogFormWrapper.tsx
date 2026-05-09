"use client";

import dynamic from "next/dynamic";

const BlogForm = dynamic(() => import("./BlogForm"), {
  ssr: false,
  loading: () => (
    <div className="space-y-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-32 bg-secondary/30 rounded-xl animate-pulse" />
      ))}
    </div>
  ),
});

interface BlogFormWrapperProps {
  mode: "create" | "edit";
  initialData?: {
    _id?: string;
    title?: string;
    content?: object;
    excerpt?: string;
    tags?: string[];
    featuredImageUrl?: string;
    featuredImagePublicId?: string;
    contentImagePublicIds?: string[];
    status?: string;
  };
}

export default function BlogFormWrapper({ mode, initialData }: BlogFormWrapperProps) {
  return <BlogForm mode={mode} initialData={initialData} />;
}
