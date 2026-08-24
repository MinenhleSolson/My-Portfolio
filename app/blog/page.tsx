"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaArrowLeft, FaArrowRight, FaClock, FaCalendar, FaMagnifyingGlass } from "react-icons/fa6";
import { useBlogPosts } from "@/hooks/useSupabaseData";
import { BlogPost } from "@/lib/types";

// Format date helper
const formatDate = (timestamp: string | undefined) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// Calculate reading time
const getReadingTime = (content: string) => {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
};

// Blog card component
const BlogCard = ({ post, index }: { post: BlogPost; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Link href={`/blog/post?slug=${encodeURIComponent(post.slug)}`}>
        <div className="group relative bg-white rounded-2xl overflow-hidden border border-slate-200/50 hover:border-purple/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple/10">
          {/* Cover Image */}
          <div className="relative h-48 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple/20 to-blue-500/20 z-10 group-hover:opacity-80 transition-opacity" />
            {post.coverImage ? (
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple/30 to-blue-500/30 flex items-center justify-center">
                <span className="text-4xl opacity-50">📝</span>
              </div>
            )}
            {/* Tags overlay */}
            <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2">
              {post.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs font-medium bg-white/90 backdrop-blur-sm text-purple rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Meta info */}
            <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
              <span className="flex items-center gap-1">
                <FaCalendar className="text-purple/70" />
                {formatDate(post.createdAt)}
              </span>
              <span className="flex items-center gap-1">
                <FaClock className="text-purple/70" />
                {getReadingTime(post.content)}
              </span>
            </div>

            {/* Title */}
            <h3 className="font-bold text-lg text-slate-800 mb-2 line-clamp-2 group-hover:text-purple transition-colors">
              {post.title}
            </h3>

            {/* Excerpt */}
            <p className="text-slate-500 text-sm line-clamp-3 mb-4">
              {post.excerpt}
            </p>

            {/* Read more */}
            <div className="flex items-center gap-2 text-purple text-sm font-medium group-hover:gap-3 transition-all">
              Read Article
              <FaArrowRight className="text-xs" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default function BlogPage() {
  const { data: posts, loading } = useBlogPosts(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Get all unique tags
  const allTags = Array.from(new Set(posts.flatMap((post) => post.tags)));

  // Filter posts
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || post.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  return (
    <main className="relative bg-slate-50 min-h-screen">
      {/* Background gradients */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-violet-400/15 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-10 py-12">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-purple transition-colors mb-8"
          >
            <FaArrowLeft />
            Back to Home
          </Link>
        </motion.div>

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            All <span className="text-purple">Blog Posts</span>
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Explore insights, tutorials, and thoughts on web development, design, and technology
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-10 space-y-4"
        >
          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <FaMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-purple focus:ring-2 focus:ring-purple/20 outline-none transition-all"
            />
          </div>

          {/* Tags */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  !selectedTag
                    ? "bg-purple text-white"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-purple"
                }`}
              >
                All
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedTag === tag
                      ? "bg-purple text-white"
                      : "bg-white text-slate-600 border border-slate-200 hover:border-purple"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Posts Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl h-80 animate-pulse border border-slate-200/50"
              >
                <div className="h-48 bg-slate-200 rounded-t-2xl" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-4 bg-slate-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <span className="text-6xl mb-4 block">📭</span>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No posts found</h3>
            <p className="text-slate-500">
              {searchQuery || selectedTag
                ? "Try adjusting your search or filter"
                : "Check back later for new content!"}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <BlogCard key={post.id} post={post} index={index} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
