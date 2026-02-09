"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import { FaPlus, FaEdit, FaTrash, FaImage, FaEye, FaEyeSlash } from "react-icons/fa";
import {
  useBlogPosts,
  addDocument,
  updateDocument,
  deleteDocument,
  uploadImage,
} from "@/hooks/useFirestoreData";
import { BlogPost } from "@/lib/types";
import { Timestamp } from "firebase/firestore";

export default function BlogPage() {
  const { data: posts, loading } = useBlogPosts(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BlogPost | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [blogTitle, setBlogTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [published, setPublished] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    maxFiles: 1,
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const openModal = (item?: BlogPost) => {
    if (item) {
      setEditingItem(item);
      setBlogTitle(item.title);
      setSlug(item.slug);
      setExcerpt(item.excerpt);
      setContent(item.content);
      setTags(item.tags.join(", "));
      setPublished(item.published);
      setImagePreview(item.coverImage);
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingItem(null);
    setBlogTitle("");
    setSlug("");
    setExcerpt("");
    setContent("");
    setTags("");
    setPublished(false);
    setImage(null);
    setImagePreview("");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrl = imagePreview;
      if (image) {
        imageUrl = await uploadImage(image, "blog");
      }

      const data = {
        title: blogTitle,
        slug: slug || generateSlug(blogTitle),
        excerpt,
        content,
        coverImage: imageUrl,
        tags: tags.split(",").map((s) => s.trim()).filter(Boolean),
        published,
        order: editingItem?.order ?? posts.length,
        updatedAt: Timestamp.now(),
      };

      if (editingItem) {
        await updateDocument("blogPosts", editingItem.id, data);
        toast.success("Post updated!");
      } else {
        await addDocument("blogPosts", data);
        toast.success("Post created!");
      }

      closeModal();
    } catch (error: any) {
      toast.error(error.message || "Failed to save");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this post?")) {
      try {
        await deleteDocument("blogPosts", id);
        toast.success("Deleted!");
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  };

  const togglePublish = async (post: BlogPost) => {
    try {
      await updateDocument("blogPosts", post.id, { published: !post.published });
      toast.success(post.published ? "Unpublished" : "Published!");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Blog Posts</h1>
          <p className="text-slate-500">Manage your blog articles</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple text-white rounded-xl hover:shadow-lg transition-all"
        >
          <FaPlus /> New Post
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500">Loading...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 bg-white/80 rounded-2xl border border-slate-200/50">
          <p className="text-slate-500">No blog posts yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <motion.div
              key={post.id}
              layout
              className="bg-white/80 backdrop-blur-lg rounded-2xl border border-slate-200/50 p-6 shadow-sm hover:shadow-lg transition-all flex items-center gap-6"
            >
              {post.coverImage && (
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-slate-800 text-lg truncate">{post.title}</h3>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${post.published ? "bg-green-100 text-green-600" : "bg-slate-100 text-slate-600"}`}>
                    {post.published ? "Published" : "Draft"}
                  </span>
                </div>
                <p className="text-slate-500 text-sm line-clamp-1">{post.excerpt}</p>
                <div className="flex gap-1 mt-2">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => togglePublish(post)}
                  className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg ${post.published ? "text-slate-600 hover:bg-slate-50" : "text-green-600 hover:bg-green-50"}`}
                >
                  {post.published ? <FaEyeSlash /> : <FaEye />}
                </button>
                <button
                  onClick={() => openModal(post)}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <FaTrash />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-800">
                  {editingItem ? "Edit Post" : "New Post"}
                </h2>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Cover Image</label>
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer ${isDragActive ? "border-purple bg-purple/5" : "border-slate-200 hover:border-purple"}`}
                  >
                    <input {...getInputProps()} />
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
                    ) : (
                      <FaImage className="mx-auto text-2xl text-slate-400" />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={blogTitle}
                      onChange={(e) => {
                        setBlogTitle(e.target.value);
                        if (!editingItem) setSlug(generateSlug(e.target.value));
                      }}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple/50 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Slug</label>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple/50 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Excerpt</label>
                  <textarea
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    rows={2}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple/50 outline-none resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Content (Markdown)</label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={8}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple/50 outline-none resize-none font-mono text-sm"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Tags (comma-separated)</label>
                    <input
                      type="text"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple/50 outline-none"
                      placeholder="react, nextjs, tutorial"
                    />
                  </div>
                  <div className="flex items-center gap-3 pt-6">
                    <input
                      type="checkbox"
                      id="published"
                      checked={published}
                      onChange={(e) => setPublished(e.target.checked)}
                      className="w-4 h-4 accent-purple"
                    />
                    <label htmlFor="published" className="text-sm font-medium text-slate-700">
                      Publish immediately
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={closeModal} className="flex-1 px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple text-white rounded-xl disabled:opacity-50">
                    {isSubmitting ? "Saving..." : "Save"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
