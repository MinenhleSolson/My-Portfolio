"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaArrowLeft, FaClock, FaCalendar, FaShare, FaTwitter, FaLinkedin, FaLink } from "react-icons/fa6";
import { getPublishedBlogPostBySlug } from "@/hooks/useSupabaseData";
import { BlogPost } from "@/lib/types";
import ReactMarkdown from "react-markdown";
import toast from "react-hot-toast";

// Format date helper
const formatDate = (timestamp: string | undefined) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    month: "long",
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

export default function BlogPostPage() {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("slug");

    if (!slug) {
      setLoading(false);
      return;
    }

    const fetchPost = async () => {
      try {
        setPost(await getPublishedBlogPostBySlug(slug));
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, []);

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = post?.title || "";

    switch (platform) {
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
          "_blank"
        );
        break;
      case "linkedin":
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
          "_blank"
        );
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
        break;
    }
    setShowShareMenu(false);
  };

  if (loading) {
    return (
      <main className="relative bg-slate-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-5 sm:px-10 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-slate-200 rounded w-1/4" />
            <div className="h-12 bg-slate-200 rounded w-3/4" />
            <div className="h-64 bg-slate-200 rounded-2xl" />
            <div className="space-y-4">
              <div className="h-4 bg-slate-200 rounded" />
              <div className="h-4 bg-slate-200 rounded" />
              <div className="h-4 bg-slate-200 rounded w-3/4" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="relative bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="text-8xl mb-6 block">404</span>
          <h1 className="text-3xl font-bold text-slate-800 mb-4">Post Not Found</h1>
          <p className="text-slate-500 mb-8">
            The blog post you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple text-white rounded-xl font-medium hover:shadow-lg transition-all"
          >
            <FaArrowLeft />
            Back to Blog
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="relative bg-slate-50 min-h-screen">
      {/* Background gradients */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl" />
      </div>

      <article className="max-w-4xl mx-auto px-5 sm:px-10 py-12">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-purple transition-colors mb-8"
          >
            <FaArrowLeft />
            Back to Blog
          </Link>
        </motion.div>

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-xs font-medium bg-purple/10 text-purple rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-2">
              <FaCalendar className="text-purple" />
              {formatDate(post.createdAt)}
            </span>
            <span className="flex items-center gap-2">
              <FaClock className="text-purple" />
              {getReadingTime(post.content)}
            </span>
            {/* Share button */}
            <div className="relative ml-auto">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl hover:border-purple transition-colors"
              >
                <FaShare className="text-purple" />
                Share
              </button>
              {showShareMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-50"
                >
                  <button
                    onClick={() => handleShare("twitter")}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 w-full text-left"
                  >
                    <FaTwitter className="text-blue-400" />
                    Twitter
                  </button>
                  <button
                    onClick={() => handleShare("linkedin")}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 w-full text-left"
                  >
                    <FaLinkedin className="text-blue-600" />
                    LinkedIn
                  </button>
                  <button
                    onClick={() => handleShare("copy")}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 w-full text-left"
                  >
                    <FaLink className="text-slate-500" />
                    Copy Link
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </motion.header>

        {/* Cover Image */}
        {post.coverImage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-10 rounded-2xl overflow-hidden shadow-lg"
          >
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-auto max-h-[500px] object-cover"
            />
          </motion.div>
        )}

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="prose prose-lg max-w-none prose-slate prose-headings:text-slate-800 prose-a:text-purple prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-pre:bg-slate-900 prose-pre:text-slate-100"
        >
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </motion.div>

        {/* Footer divider */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="border-t border-slate-200 mt-16 pt-10"
        >
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <p className="text-slate-500 text-sm">Thanks for reading!</p>
              <p className="text-slate-800 font-medium">
                Share this article if you found it helpful.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleShare("twitter")}
                className="p-3 bg-white border border-slate-200 rounded-xl hover:border-blue-400 hover:text-blue-400 transition-colors"
              >
                <FaTwitter />
              </button>
              <button
                onClick={() => handleShare("linkedin")}
                className="p-3 bg-white border border-slate-200 rounded-xl hover:border-blue-600 hover:text-blue-600 transition-colors"
              >
                <FaLinkedin />
              </button>
              <button
                onClick={() => handleShare("copy")}
                className="p-3 bg-white border border-slate-200 rounded-xl hover:border-purple hover:text-purple transition-colors"
              >
                <FaLink />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Back to blog */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 text-center"
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple to-blue-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple/25 transition-all"
          >
            <FaArrowLeft />
            Explore More Posts
          </Link>
        </motion.div>
      </article>
    </main>
  );
}
