'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { posts, categories } from '@/data/blogPosts';

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const featured = posts.filter((p) => p.featured);
  const nonFeatured = posts.filter((p) => !p.featured);
  const filteredNonFeatured =
    activeCategory === 'All' ? nonFeatured : posts.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 w-80 h-80 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-10 w-64 h-64 bg-purple-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <span className="inline-block bg-white/20 text-white text-sm font-semibold px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
            📚 Knowledge Hub
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Blog &amp; <span className="text-indigo-300">Resources</span>
          </h1>
          <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
            Expert guides, scholarship alerts, visa tips, and student stories — everything you need to navigate your international education journey.
          </p>
        </div>
      </section>

      {/* Featured Posts */}
      {activeCategory === 'All' && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Articles</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {featured.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all group cursor-pointer block"
                >
                  <div className="bg-gradient-to-br from-indigo-100 to-purple-100 h-48 flex items-center justify-center text-7xl">
                    {post.emoji}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-medium">{post.category}</span>
                      <span className="text-xs text-gray-400">{post.readTime}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {post.author.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-800">{post.author}</p>
                          <p className="text-xs text-gray-400">{post.date}</p>
                        </div>
                      </div>
                      <span className="text-sm text-indigo-600 font-semibold group-hover:underline">Read more →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Category Filter + All Posts */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {/* Categories */}
          <div className="flex flex-wrap gap-3 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeCategory === cat
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Posts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNonFeatured.length === 0 ? (
              <p className="text-gray-500 col-span-full text-center py-12">
                No articles in this category yet — check back soon.
              </p>
            ) : (
              filteredNonFeatured.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all group cursor-pointer block"
                >
                  <div className="bg-gradient-to-br from-gray-50 to-indigo-50 h-36 flex items-center justify-center text-5xl">
                    {post.emoji}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium">{post.category}</span>
                      <span className="text-xs text-gray-400">{post.readTime}</span>
                    </div>
                    <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {post.author.charAt(0)}
                        </div>
                        <p className="text-xs text-gray-500">{post.author} · {post.date}</p>
                      </div>
                      <span className="text-xs text-indigo-600 font-semibold group-hover:underline">Read →</span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 bg-indigo-900 text-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="text-5xl mb-6">📩</div>
          <h2 className="text-4xl font-bold mb-4">Stay Informed</h2>
          <p className="text-indigo-200 text-lg mb-8">
            Get the latest scholarship alerts, application deadlines, and study abroad tips delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-5 py-3 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <button className="bg-white text-indigo-900 px-6 py-3 rounded-full font-bold hover:bg-indigo-50 transition-all whitespace-nowrap">
              Subscribe
            </button>
          </div>
          <p className="text-indigo-400 text-xs mt-4">No spam. Unsubscribe anytime.</p>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
