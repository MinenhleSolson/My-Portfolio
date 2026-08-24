"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import { FaPlus, FaEdit, FaTrash, FaImage, FaQuoteLeft } from "react-icons/fa";
import {
  useTestimonials,
  addDocument,
  updateDocument,
  deleteDocument,
  uploadImage,
} from "@/hooks/useSupabaseData";
import { Testimonial } from "@/lib/types";

export default function TestimonialsPage() {
  const { data: testimonials, loading } = useTestimonials();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [quote, setQuote] = useState("");
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
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

  const openModal = (item?: Testimonial) => {
    if (item) {
      setEditingItem(item);
      setQuote(item.quote);
      setName(item.name);
      setTitle(item.title);
      setImagePreview(item.image);
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingItem(null);
    setQuote("");
    setName("");
    setTitle("");
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
        imageUrl = await uploadImage(image, "testimonials");
      }

      const data = {
        quote,
        name,
        title,
        image: imageUrl,
        order: editingItem?.order ?? testimonials.length,
      };

      if (editingItem) {
        await updateDocument("testimonials", editingItem.id, data);
        toast.success("Testimonial updated!");
      } else {
        await addDocument("testimonials", data);
        toast.success("Testimonial added!");
      }

      closeModal();
    } catch (error: any) {
      toast.error(error.message || "Failed to save");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this testimonial?")) {
      try {
        await deleteDocument("testimonials", id);
        toast.success("Deleted!");
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Testimonials</h1>
          <p className="text-slate-500">Manage client testimonials</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple text-white rounded-xl hover:shadow-lg transition-all"
        >
          <FaPlus /> Add Testimonial
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500">Loading...</div>
      ) : testimonials.length === 0 ? (
        <div className="text-center py-12 bg-white/80 rounded-2xl border border-slate-200/50">
          <p className="text-slate-500">No testimonials yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((item) => (
            <motion.div
              key={item.id}
              layout
              className="bg-white/80 backdrop-blur-lg rounded-2xl border border-slate-200/50 p-6 shadow-sm hover:shadow-lg transition-all"
            >
              <FaQuoteLeft className="text-purple/30 text-3xl mb-4" />
              <p className="text-slate-600 italic line-clamp-3">&ldquo;{item.quote}&rdquo;</p>
              <div className="flex items-center gap-3 mt-4">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="font-semibold text-slate-800">{item.name}</p>
                  <p className="text-sm text-slate-500">{item.title}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
                <button
                  onClick={() => openModal(item)}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <FaEdit /> Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <FaTrash /> Delete
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
              className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-800">
                  {editingItem ? "Edit Testimonial" : "Add Testimonial"}
                </h2>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Client Photo
                  </label>
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
                      isDragActive ? "border-purple bg-purple/5" : "border-slate-200 hover:border-purple"
                    }`}
                  >
                    <input {...getInputProps()} />
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-24 h-24 mx-auto rounded-full object-cover"
                      />
                    ) : (
                      <div className="py-4">
                        <FaImage className="mx-auto text-2xl text-slate-400 mb-2" />
                        <p className="text-sm text-slate-500">Upload photo</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Client Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple/50 focus:border-purple outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Title / Role</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple/50 focus:border-purple outline-none"
                    placeholder="CEO of Company"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Quote</label>
                  <textarea
                    value={quote}
                    onChange={(e) => setQuote(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple/50 focus:border-purple outline-none resize-none"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple text-white rounded-xl disabled:opacity-50"
                  >
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
