import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, CalendarDays, Clock3 } from "lucide-react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { BLOG_POSTS, getBlogPost, type BlogBlock } from "@/data/blogs";
import { appUrl } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) {
    return { title: "Article not found — Orion Education" };
  }
  return {
    title: `${post.title} — Orion Education Blog`,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: appUrl(`/blog/${post.slug}`) },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: appUrl(`/blog/${post.slug}`),
      siteName: "Orion Education",
      locale: "en_IN",
      publishedTime: post.publishedAt,
      authors: [post.author],
    },
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function Block({ block }: { block: BlogBlock }) {
  switch (block.type) {
    case "h2":
      return (
        <h2 className="mt-8 font-display text-xl font-bold text-surface-900 sm:text-2xl">
          {block.text}
        </h2>
      );
    case "ul":
      return (
        <ul className="mt-4 space-y-2">
          {(block.items || []).map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm leading-relaxed text-surface-700">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
              {item}
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className="mt-4 space-y-2">
          {(block.items || []).map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-surface-700">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
                {i + 1}
              </span>
              {item}
            </li>
          ))}
        </ol>
      );
    case "quote":
      return (
        <blockquote className="mt-6 rounded-2xl border-l-4 border-gold-500 bg-gold-50 p-4 text-sm font-medium leading-relaxed text-brand-950">
          {block.text}
        </blockquote>
      );
    default:
      return <p className="mt-4 text-[15px] leading-relaxed text-surface-700">{block.text}</p>;
  }
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    keywords: post.keywords.join(", "),
    datePublished: post.publishedAt,
    inLanguage: "en-IN",
    author: { "@type": "Organization", name: post.author },
    publisher: { "@type": "Organization", name: "Orion Education" },
    mainEntityOfPage: appUrl(`/blog/${post.slug}`),
  };

  const index = BLOG_POSTS.findIndex((p) => p.slug === post.slug);
  const next = BLOG_POSTS[(index + 1) % BLOG_POSTS.length];

  return (
    <div className="flex min-h-screen flex-col bg-surface-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />
      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold-700 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> All articles
          </Link>

          <header className="mt-6">
            <div className="flex items-center gap-3">
              <Badge variant="gold" className="bg-gold-100 text-gold-700">{post.category}</Badge>
              <span className="flex items-center gap-1.5 text-xs text-surface-500">
                <Clock3 className="h-3.5 w-3.5" /> {post.readingMinutes} min read
              </span>
              <span className="flex items-center gap-1.5 text-xs text-surface-500">
                <CalendarDays className="h-3.5 w-3.5" /> {formatDate(post.publishedAt)}
              </span>
            </div>
            <h1 className="mt-4 font-display text-2xl font-black leading-tight text-surface-900 sm:text-3xl">
              {post.title}
            </h1>
            <p className="mt-3 text-base leading-relaxed text-surface-600">{post.description}</p>
            <div className="mt-5 flex items-center gap-2 text-sm text-surface-500">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                <BookOpen className="h-4 w-4" strokeWidth={1.75} />
              </span>
              By Orion Education Team
            </div>
          </header>

          <div className="mt-8 border-t border-surface-200 pt-1">
            {post.content.map((block, i) => (
              <Block key={i} block={block} />
            ))}
          </div>
        </article>

        <div className="border-t border-surface-200 bg-white">
          <div className="mx-auto flex max-w-3xl flex-col items-start justify-between gap-4 px-4 py-8 sm:flex-row sm:items-center sm:px-6 lg:px-8">
            <div>
              <p className="font-display text-base font-bold text-surface-900">Keep reading</p>
              <p className="mt-1 text-sm text-surface-500">{next.title}</p>
            </div>
            <Link
              href={`/blog/${next.slug}`}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-brand-950 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-900"
            >
              Next article <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}