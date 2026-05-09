"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, X, Upload, Image as ImageIcon, Send, Save } from "lucide-react";
import apiClient from "@/lib/axios";
import Image from "next/image";

// Dynamic import to avoid SSR issues with Tiptap
const TiptapEditor = dynamic(() => import("./TiptapEditor"), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] bg-secondary/30 rounded-xl animate-pulse flex items-center justify-center">
      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
    </div>
  ),
});

interface BlogFormProps {
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
  mode: "create" | "edit";
}

export default function BlogForm({ initialData, mode }: BlogFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState<object | null>(initialData?.content || null);
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [featuredImageUrl, setFeaturedImageUrl] = useState(initialData?.featuredImageUrl || "");
  const [featuredImagePublicId, setFeaturedImagePublicId] = useState(
    initialData?.featuredImagePublicId || ""
  );
  const [contentImagePublicIds, setContentImagePublicIds] = useState<string[]>(
    initialData?.contentImagePublicIds || []
  );

  const handleContentImageUpload = useCallback((publicId: string) => {
    setContentImagePublicIds((prev) => [...prev, publicId]);
  }, []);

  const handleAddTag = useCallback(() => {
    const newTag = tagInput.trim().toLowerCase();
    if (newTag && tags.length < 5 && !tags.includes(newTag)) {
      setTags((prev) => [...prev, newTag]);
      setTagInput("");
    }
  }, [tagInput, tags]);

  const handleRemoveTag = useCallback((tagToRemove: string) => {
    setTags((prev) => prev.filter((t) => t !== tagToRemove));
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleAddTag();
      }
    },
    [handleAddTag]
  );

  const handleFeaturedImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Invalid file type. Allowed: JPEG, PNG, GIF, WebP");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size exceeds 5MB limit");
        return;
      }

      setUploadingImage(true);

      try {
        const formData = new FormData();
        formData.append("image", file);

        const { data } = await apiClient.post<{ url: string; publicId: string }>(
          "/api/blogs/upload-image",
          formData
        );

        setFeaturedImageUrl(data.url);
        setFeaturedImagePublicId(data.publicId);
        toast.success("Featured image uploaded");
      } catch (error) {
        console.error("Image upload failed:", error);
        toast.error("Failed to upload image");
      } finally {
        setUploadingImage(false);
        e.target.value = "";
      }
    },
    []
  );

  const removeFeaturedImage = useCallback(() => {
    setFeaturedImageUrl("");
    setFeaturedImagePublicId("");
  }, []);

  const validateForm = useCallback(() => {
    if (!title.trim()) {
      toast.error("Title is required");
      return false;
    }
    if (title.length > 200) {
      toast.error("Title must be 200 characters or less");
      return false;
    }
    if (!content) {
      toast.error("Content is required");
      return false;
    }
    if (!excerpt.trim()) {
      toast.error("Excerpt is required");
      return false;
    }
    if (excerpt.length > 500) {
      toast.error("Excerpt must be 500 characters or less");
      return false;
    }
    return true;
  }, [title, content, excerpt]);

  const handleSaveDraft = useCallback(async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const payload = {
        ...(initialData?._id && { blogId: initialData._id }),
        title,
        content,
        excerpt,
        tags,
        featuredImageUrl: featuredImageUrl || undefined,
        featuredImagePublicId: featuredImagePublicId || undefined,
        contentImagePublicIds,
      };

      const { data } = await apiClient.post("/api/blogs", payload);

      toast.success(mode === "create" ? "Draft saved!" : "Blog updated!");
      router.push(`/dashboard/my-blogs`);
      router.refresh();
    } catch (error: unknown) {
      console.error("Save failed:", error);
      const message =
        error instanceof Error ? error.message : "Failed to save blog";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [
    validateForm,
    initialData,
    title,
    content,
    excerpt,
    tags,
    featuredImageUrl,
    featuredImagePublicId,
    contentImagePublicIds,
    mode,
    router,
  ]);

  const handleSubmitForReview = useCallback(async () => {
    if (!validateForm()) return;

    // First save
    setSubmitting(true);

    try {
      const payload = {
        ...(initialData?._id && { blogId: initialData._id }),
        title,
        content,
        excerpt,
        tags,
        featuredImageUrl: featuredImageUrl || undefined,
        featuredImagePublicId: featuredImagePublicId || undefined,
        contentImagePublicIds,
      };

      const { data: savedBlog } = await apiClient.post("/api/blogs", payload);

      // Then submit
      await apiClient.post(`/api/blogs/submit/${savedBlog.blog._id}`);

      toast.success("Blog submitted for review!");
      router.push("/dashboard/my-blogs");
      router.refresh();
    } catch (error: unknown) {
      console.error("Submit failed:", error);
      const axiosError = error as { response?: { data?: { error?: string } } };
      const message = axiosError.response?.data?.error || "Failed to submit blog";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }, [
    validateForm,
    initialData,
    title,
    content,
    excerpt,
    tags,
    featuredImageUrl,
    featuredImagePublicId,
    contentImagePublicIds,
    router,
  ]);

  const canEdit = !initialData?.status || ["draft", "rejected"].includes(initialData.status);

  return (
    <div className="space-y-6">
      {/* Title */}
      <Card>
        <CardHeader>
          <CardTitle>Blog Title</CardTitle>
          <CardDescription>
            A catchy title that captures your blog&apos;s essence
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your blog title..."
            maxLength={200}
            disabled={!canEdit}
          />
          <p className="text-xs text-muted-foreground mt-1 text-right">
            {title.length}/200
          </p>
        </CardContent>
      </Card>

      {/* Featured Image */}
      <Card>
        <CardHeader>
          <CardTitle>Featured Image</CardTitle>
          <CardDescription>
            An eye-catching image for your blog (optional)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {featuredImageUrl ? (
            <div className="relative">
              <Image
                src={featuredImageUrl}
                alt="Featured"
                width={800}
                height={400}
                className="w-full h-48 object-cover rounded-lg"
              />
              {canEdit && (
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={removeFeaturedImage}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-input rounded-lg cursor-pointer hover:border-accent transition-colors">
              {uploadingImage ? (
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              ) : (
                <>
                  <ImageIcon className="w-8 h-8 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">
                    Click to upload featured image
                  </span>
                  <span className="text-xs text-muted-foreground mt-1">
                    Max 5MB • JPEG, PNG, GIF, WebP
                  </span>
                </>
              )}
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="hidden"
                onChange={handleFeaturedImageUpload}
                disabled={!canEdit || uploadingImage}
              />
            </label>
          )}
        </CardContent>
      </Card>

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle>Content</CardTitle>
          <CardDescription>
            Write your blog using the rich text editor below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TiptapEditor
            content={content}
            onChange={setContent}
            onImageUpload={handleContentImageUpload}
            placeholder="Start writing your amazing blog..."
            editable={canEdit}
          />
        </CardContent>
      </Card>

      {/* Excerpt */}
      <Card>
        <CardHeader>
          <CardTitle>Excerpt</CardTitle>
          <CardDescription>
            A brief summary shown on the blog listing page
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Write a short summary of your blog..."
            rows={3}
            maxLength={500}
            disabled={!canEdit}
          />
          <p className="text-xs text-muted-foreground mt-1 text-right">
            {excerpt.length}/500
          </p>
        </CardContent>
      </Card>

      {/* Tags */}
      <Card>
        <CardHeader>
          <CardTitle>Tags</CardTitle>
          <CardDescription>
            Add up to 5 tags to help readers find your blog
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="gap-1">
                {tag}
                {canEdit && (
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </Badge>
            ))}
          </div>
          {canEdit && tags.length < 5 && (
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a tag and press Enter"
                maxLength={30}
              />
              <Button type="button" variant="outline" onClick={handleAddTag}>
                Add
              </Button>
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-2">
            {tags.length}/5 tags
          </p>
        </CardContent>
      </Card>

      {/* Actions */}
      {canEdit && (
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <Button
            variant="outline"
            onClick={handleSaveDraft}
            disabled={loading || submitting}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Draft
          </Button>
          <Button onClick={handleSubmitForReview} disabled={loading || submitting}>
            {submitting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Send className="w-4 h-4 mr-2" />
            )}
            Submit for Review
          </Button>
        </div>
      )}
    </div>
  );
}
