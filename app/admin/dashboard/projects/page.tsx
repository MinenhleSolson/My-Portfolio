"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import { FaPlus, FaEdit, FaTrash, FaExternalLinkAlt, FaImage } from "react-icons/fa";
import {
  useProjects,
  addDocument,
  updateDocument,
  deleteDocument,
  uploadImage,
} from "@/hooks/useSupabaseData";
import { Project } from "@/lib/types";

export default function ProjectsPage() {
  const { data: projects, loading } = useProjects();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [iconLists, setIconLists] = useState("");
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

  const openModal = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setTitle(project.title);
      setDescription(project.des);
      setLink(project.link);
      setIconLists(project.iconLists.join(", "));
      setImagePreview(project.img);
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingProject(null);
    setTitle("");
    setDescription("");
    setLink("");
    setIconLists("");
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

      // Upload new image if provided
      if (image) {
        imageUrl = await uploadImage(image, "projects");
      }

      const projectData = {
        title,
        des: description,
        link,
        img: imageUrl,
        iconLists: iconLists.split(",").map((s) => s.trim()).filter(Boolean),
        order: editingProject?.order ?? projects.length,
      };

      if (editingProject) {
        await updateDocument("projects", editingProject.id, projectData);
        toast.success("Project updated!");
      } else {
        await addDocument("projects", projectData);
        toast.success("Project added!");
      }

      closeModal();
    } catch (error: any) {
      toast.error(error.message || "Failed to save project");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteDocument("projects", id);
        toast.success("Project deleted!");
      } catch (error: any) {
        toast.error(error.message || "Failed to delete project");
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Projects</h1>
          <p className="text-slate-500">Manage your portfolio projects</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple text-white rounded-xl hover:shadow-lg transition-all"
        >
          <FaPlus /> Add Project
        </button>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="text-center py-12 text-slate-500">Loading...</div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12 bg-white/80 rounded-2xl border border-slate-200/50">
          <p className="text-slate-500 mb-4">No projects yet</p>
          <button
            onClick={() => openModal()}
            className="text-purple hover:underline"
          >
            Add your first project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/80 backdrop-blur-lg rounded-2xl border border-slate-200/50 overflow-hidden shadow-sm hover:shadow-lg transition-all"
            >
              <div className="h-40 bg-slate-100 relative">
                {project.img && (
                  <img
                    src={project.img}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-slate-800 text-lg">{project.title}</h3>
                <p className="text-sm text-slate-500 line-clamp-2 mt-1">{project.des}</p>
                <div className="flex items-center gap-2 mt-4">
                  <button
                    onClick={() => openModal(project)}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <FaTrash /> Delete
                  </button>
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors ml-auto"
                  >
                    <FaExternalLinkAlt /> View
                  </a>
                </div>
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
                  {editingProject ? "Edit Project" : "Add Project"}
                </h2>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Project Image
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
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="py-4">
                        <FaImage className="mx-auto text-3xl text-slate-400 mb-2" />
                        <p className="text-sm text-slate-500">
                          Drag & drop an image, or click to select
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple/50 focus:border-purple outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple/50 focus:border-purple outline-none resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Project URL
                  </label>
                  <input
                    type="url"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple/50 focus:border-purple outline-none"
                    placeholder="https://..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Tech Stack Icons (comma-separated paths)
                  </label>
                  <input
                    type="text"
                    value={iconLists}
                    onChange={(e) => setIconLists(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple/50 focus:border-purple outline-none"
                    placeholder="/react.svg, /next.svg, /ts.svg"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? "Saving..." : editingProject ? "Update" : "Add"}
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
