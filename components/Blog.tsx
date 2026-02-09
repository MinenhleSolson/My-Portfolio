"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaArrowRight, FaClock, FaCalendar } from "react-icons/fa6";
import { useBlogPosts } from "@/hooks/useFirestoreData";
import { BlogPost } from "@/lib/types";
import { Timestamp } from "firebase/firestore";

// Format date helper
const formatDate = (timestamp: Timestamp | undefined) => {
  if (!timestamp) return "Recently";
  try {
    const date = timestamp.toDate();
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "Recently";
  }
};

// Calculate reading time
const getReadingTime = (content: string | undefined) => {
  if (!content) return "1 min read";
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
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/blog/${post.slug || post.id}`}>
        <div className="group relative bg-white dark:bg-black-200 rounded-2xl overflow-hidden border border-slate-200/50 dark:border-white/[0.1] hover:border-purple/50 dark:hover:border-purple/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple/10">
          {/* Cover Image */}
          <div className="relative h-48 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple/20 to-blue-500/20 z-10 group-hover:opacity-80 transition-opacity" />
            {post.coverImage ? (
              <img
                src={post.coverImage}
                alt={post.title || "Blog post"}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple/30 to-blue-500/30 flex items-center justify-center">
                <span className="text-4xl opacity-50">📝</span>
              </div>
            )}
            {/* Tags overlay */}
            <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2">
              {(post.tags || []).slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs font-medium bg-white/90 dark:bg-black/70 backdrop-blur-sm text-purple dark:text-purple-light rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Meta info */}
            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-3">
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
            <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-2 line-clamp-2 group-hover:text-purple dark:group-hover:text-purple-light transition-colors">
              {post.title || "Untitled Post"}
            </h3>

            {/* Excerpt */}
            <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-3 mb-4">
              {post.excerpt || "Click to read more..."}
            </p>

            {/* Read more */}
            <div className="flex items-center gap-2 text-purple dark:text-purple-light text-sm font-medium group-hover:gap-3 transition-all">
              Read Article
              <FaArrowRight className="text-xs" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const Blog = () => {
  const { data: posts, loading, error } = useBlogPosts(true);

  // Debug logging
  useEffect(() => {
    console.log("Blog posts data:", posts);
    console.log("Blog loading:", loading);
    console.log("Blog error:", error);
  }, [posts, loading, error]);

  return (
    <div className="py-20" id="blog">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="heading text-slate-800 dark:text-white">
          Latest from the{" "}
          <span className="text-purple dark:text-purple-light">Blog</span>
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-4 max-w-2xl mx-auto">
          Insights, tutorials, and thoughts on web development, design, and technology
        </p>
      </motion.div>

      {/* Error State */}
      {error && (
        <div className="text-center py-10 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-200 dark:border-red-800 mb-8">
          <p className="text-red-600 dark:text-red-400">Error loading blog posts. Please check the console for details.</p>
        </div>
      )}

      {/* Blog Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-black-200 rounded-2xl h-80 animate-pulse border border-slate-200/50 dark:border-white/[0.1]"
            >
              <div className="h-48 bg-slate-200 dark:bg-slate-700 rounded-t-2xl" />
              <div className="p-6 space-y-3">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-black-200 rounded-2xl border border-slate-200/50 dark:border-white/[0.1]">
          <span className="text-5xl mb-4 block">📝</span>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No blog posts yet</h3>
          <p className="text-slate-500 dark:text-slate-400">
            Check back soon for new content!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.slice(0, 6).map((post, index) => (
            <BlogCard key={post.id} post={post} index={index} />
          ))}
        </div>
      )}

      {/* View All Link */}
      {posts.length > 6 && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple to-blue-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple/25 transition-all"
          >
            View All Posts
            <FaArrowRight />
          </Link>
        </motion.div>
      )}
    </div>
  );
};

export default Blog;

