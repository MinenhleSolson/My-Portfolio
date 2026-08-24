"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import { FaPlus, FaEdit, FaTrash, FaImage, FaBriefcase } from "react-icons/fa";
import {
  useExperience,
  addDocument,
  updateDocument,
  deleteDocument,
  uploadImage,
} from "@/hooks/useSupabaseData";
import { WorkExperience } from "@/lib/types";

export default function ExperiencePage() {
  const { data: experiences, loading } = useExperience();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<WorkExperience | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [expTitle, setExpTitle] = useState("");
  const [desc, setDesc] = useState("");
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
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".svg", ".webp"] },
    maxFiles: 1,
  });

  const openModal = (item?: WorkExperience) => {
    if (item) {
      setEditingItem(item);
      setExpTitle(item.title);
      setDesc(item.desc);
      setImagePreview(item.thumbnail);
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingItem(null);
    setExpTitle("");
    setDesc("");
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
        imageUrl = await uploadImage(image, "experience");
      }

      const data = {
        title: expTitle,
        desc,
        thumbnail: imageUrl,
        className: "md:col-span-2",
        order: editingItem?.order ?? experiences.length,
      };

      if (editingItem) {
        await updateDocument("workExperience", editingItem.id, data);
        toast.success("Experience updated!");
      } else {
        await addDocument("workExperience", data);
        toast.success("Experience added!");
      }

      closeModal();
    } catch (error: any) {
      toast.error(error.message || "Failed to save");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this experience?")) {
      try {
        await deleteDocument("workExperience", id);
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
          <h1 className="text-3xl font-bold text-slate-800">Work Experience</h1>
          <p className="text-slate-500">Manage your work history</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple text-white rounded-xl hover:shadow-lg transition-all"
        >
          <FaPlus /> Add Experience
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500">Loading...</div>
      ) : experiences.length === 0 ? (
        <div className="text-center py-12 bg-white/80 rounded-2xl border border-slate-200/50">
          <p className="text-slate-500">No experience entries yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {experiences.map((item) => (
            <motion.div
              key={item.id}
              layout
              className="bg-white/80 backdrop-blur-lg rounded-2xl border border-slate-200/50 p-6 shadow-sm hover:shadow-lg transition-all flex items-center gap-6"
            >
              {item.thumbnail && (
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-20 h-20 rounded-xl object-cover"
                />
              )}
              <div className="flex-1">
                <h3 className="font-bold text-slate-800 text-lg">{item.title}</h3>
                <p className="text-slate-500 text-sm mt-1 line-clamp-2">{item.desc}</p>
              </div>
              <div className="flex gap-2">
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
              className="bg-white rounded-2xl w-full max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-800">
                  {editingItem ? "Edit Experience" : "Add Experience"}
                </h2>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Thumbnail</label>
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer ${
                      isDragActive ? "border-purple bg-purple/5" : "border-slate-200 hover:border-purple"
                    }`}
                  >
                    <input {...getInputProps()} />
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-20 h-20 mx-auto rounded-xl object-cover"
                      />
                    ) : (
                      <FaImage className="mx-auto text-2xl text-slate-400" />
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={expTitle}
                    onChange={(e) => setExpTitle(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple/50 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <textarea
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple/50 outline-none resize-none"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={closeModal} className="flex-1 px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50">
                    Cancel
                  </button>
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
