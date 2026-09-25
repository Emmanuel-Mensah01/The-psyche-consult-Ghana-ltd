import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { posts, getPostBySlug, getRelatedPosts } from '@/data/blogPosts';
import type { ContentBlock } from '@/data/blogPosts';

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) {
    return { title: 'Article Not Found | The Psyche Consult Ghana Ltd' };
  }
  return {
    title: `${post.title} | The Psyche Consult Ghana Ltd`,
    description: post.excerpt,
  };
}

function ContentBlockRenderer({ block, index }: { block: ContentBlock; index: number }) {
  switch (block.type) {
    case 'h2':
      return (
        <h2 key={index} className="text-2xl font-bold text-gray-900 mt-10 mb-4">
          {block.text}
        </h2>
      );
    case 'list':
      return (
        <ul key={index} className="space-y-3 mb-6 pl-1">
          {block.items?.map((item, i) => (
            <li key={i} className="flex gap-3 text-gray-700 leading-relaxed">
              <span className="text-indigo-600 font-bold mt-1 flex-shrink-0">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case 'tip':
      return (
        <div
          key={index}
          className="my-8 rounded-2xl border border-indigo-100 bg-indigo-50 px-6 py-5 flex gap-4"
        >
          <span className="text-2xl flex-shrink-0">💡</span>
          <p className="text-indigo-900 text-sm leading-relaxed font-medium">{block.text}</p>
        </div>
      );
    case 'p':
    default:
      return (
        <p key={index} className="text-gray-700 leading-relaxed mb-6 text-lg">
          {block.text}
        </p>
      );
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const related = getRelatedPosts(post!, 3);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Header */}
      <section className="relative pt-32 pb-16 bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 w-80 h-80 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-10 w-64 h-64 bg-purple-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6">
          {/* Breadcrumb — clear path back to Home and Blog from any article */}
          <nav className="flex items-center gap-2 text-sm text-indigo-200 mb-8 flex-wrap">
            <Link href="/" className="hover:text-white transition-colors font-medium">
              Home
            </Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-white transition-colors font-medium">
              Blog
            </Link>
            <span>/</span>
            <span className="text-white truncate">{post!.title}</span>
          </nav>

          <span className="inline-block bg-white/20 text-white text-sm font-semibold px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
            {post!.category}
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {post!.title}
          </h1>
          <div className="flex items-center gap-3 text-indigo-100 text-sm flex-wrap">
            <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-white text-sm font-bold backdrop-blur-sm">
              {post!.author.charAt(0)}
            </div>
            <span className="font-medium">{post!.author}</span>
            <span className="opacity-60">· {post!.authorRole}</span>
            <span className="opacity-60">·</span>
            <span>{post!.date}</span>
            <span className="opacity-60">·</span>
            <span>{post!.readTime}</span>
          </div>
        </div>
      </section>

      {/* Article body */}
      <article className="max-w-4xl mx-auto px-6 py-14">
        <div className="text-6xl mb-8">{post!.emoji}</div>
        {post!.content.map((block, i) => (
          <ContentBlockRenderer key={i} block={block} index={i} />
        ))}

        {/* Back to blog — explicit, always visible at end of article */}
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-800 transition-colors"
          >
            ← Back to all articles
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-500 font-medium hover:text-gray-800 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </article>

      {/* CTA */}
      <section className="py-16 bg-indigo-900 text-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Study Abroad Journey?</h2>
          <p className="text-indigo-200 mb-8">
            Book a free consultation with our expert counsellors and get a plan built around your specific goals.
          </p>
          <Link
            href="/booking"
            className="inline-block bg-white text-indigo-900 px-8 py-3 rounded-full font-bold hover:bg-indigo-50 transition-all"
          >
            Book Free Consultation
          </Link>
        </div>
      </section>

      {/* Related articles */}
      {related.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">More Articles You Might Like</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {related.map((rp) => (
                <Link
                  key={rp.id}
                  href={`/blog/${rp.slug}`}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all group block"
                >
                  <div className="bg-gradient-to-br from-gray-50 to-indigo-50 h-32 flex items-center justify-center text-5xl">
                    {rp.emoji}
                  </div>
                  <div className="p-5">
                    <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium">
                      {rp.category}
                    </span>
                    <h3 className="text-base font-bold text-gray-900 mt-3 mb-2 group-hover:text-indigo-600 transition-colors leading-snug">
                      {rp.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{rp.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
