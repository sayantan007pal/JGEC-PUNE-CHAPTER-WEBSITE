import { MetadataRoute } from "next";
import dbConnect from "@/lib/mongodb";
import Blog from "@/models/Blog";

export const revalidate = 3600;

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.jgecpune.in";

const staticPages: MetadataRoute.Sitemap = [
  {
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 1,
  },
  {
    url: `${baseUrl}/about`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    url: `${baseUrl}/events`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    url: `${baseUrl}/alumni-corner`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    url: `${baseUrl}/blogs`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    url: `${baseUrl}/benefits`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    url: `${baseUrl}/gallery`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  },
  {
    url: `${baseUrl}/contact`,
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 0.6,
  },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let blogPages: MetadataRoute.Sitemap = [];

  try {
    await dbConnect();

    const blogs = await Blog.find({ status: "published" })
      .select("slug updatedAt publishedAt")
      .lean<Array<{ slug: string; updatedAt?: Date; publishedAt?: Date }>>();

    blogPages = blogs.map((blog) => ({
      url: `${baseUrl}/blogs/${blog.slug}`,
      lastModified: blog.updatedAt ?? blog.publishedAt ?? new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch (error) {
    console.error("[SITEMAP] Failed to fetch published blogs:", error);
  }

  return [...staticPages, ...blogPages];
}
