import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/data/blogs";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    "",
    "/journey",
    "/scholarship",
    "/study-abroad",
    "/about",
    "/achievements",
    "/gallery",
    "/blog",
  ].map(
    (path): MetadataRoute.Sitemap[number] => ({
      url: `${SITE_URL}${path}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: path === "" ? 1 : 0.7,
    })
  );

  const blogPages = BLOG_POSTS.map(
    (post): MetadataRoute.Sitemap[number] => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.publishedAt),
      changeFrequency: "monthly",
      priority: 0.6,
    })
  );

  return [...staticPages, ...blogPages];
}