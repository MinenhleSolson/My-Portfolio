"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { FaPlus, FaEdit, FaTrash, FaCode } from "react-icons/fa";
import {
  useSkills,
  addDocument,
  updateDocument,
  deleteDocument,
} from "@/hooks/useFirestoreData";
import { Skill } from "@/lib/types";

const categories = [
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backend" },
  { value: "tools", label: "Tools" },
  { value: "other", label: "Other" },
];

export default function SkillsPage() {
  const { data: skills, loading } = useSkills();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Skill | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [category, setCategory] = useState<"frontend" | "backend" | "tools" | "other">("frontend");
  const [proficiency, setProficiency] = useState(80);
  const [icon, setIcon] = useState("");

  const openModal = (item?: Skill) => {
    if (item) {
      setEditingItem(item);
      setName(item.name);
      setCategory(item.category);
      setProficiency(item.proficiency);
      setIcon(item.icon);
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingItem(null);
    setName("");
    setCategory("frontend");
    setProficiency(80);
    setIcon("");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = {
        name,
        category,
        proficiency,
        icon,
        order: editingItem?.order ?? skills.length,
      };

      if (editingItem) {
        await updateDocument("skills", editingItem.id, data);
        toast.success("Skill updated!");
      } else {
        await addDocument("skills", data);
        toast.success("Skill added!");
      }

      closeModal();
    } catch (error: any) {
      toast.error(error.message || "Failed to save");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this skill?")) {
      try {
        await deleteDocument("skills", id);
        toast.success("Deleted!");
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  };

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Skills</h1>
          <p className="text-slate-500">Manage your technical skills</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple text-white rounded-xl hover:shadow-lg transition-all"
        >
          <FaPlus /> Add Skill
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500">Loading...</div>
      ) : skills.length === 0 ? (
        <div className="text-center py-12 bg-white/80 rounded-2xl border border-slate-200/50">
          <p className="text-slate-500">No skills yet</p>
        </div>
      ) : (
        <div className="space-y-8">
          {categories.map((cat) => {
            const catSkills = groupedSkills[cat.value] || [];
            if (catSkills.length === 0) return null;
            
            return (
              <div key={cat.value}>
                <h2 className="text-lg font-bold text-slate-700 mb-4">{cat.label}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {catSkills.map((skill) => (
                    <motion.div
                      key={skill.id}
                      layout
                      className="bg-white/80 backdrop-blur-lg rounded-xl border border-slate-200/50 p-4 shadow-sm hover:shadow-lg transition-all"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        {skill.icon && <img src={skill.icon} alt={skill.name} className="w-8 h-8" />}
                        <span className="font-semibold text-slate-800">{skill.name}</span>
                      </div>
                      <div className="mb-3">
                        <div className="flex justify-between text-sm text-slate-500 mb-1">
                          <span>Proficiency</span>
                          <span>{skill.proficiency}%</span>
                        </div>
                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-purple rounded-full"
                            style={{ width: `${skill.proficiency}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openModal(skill)}
                          className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <FaEdit /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(skill.id)}
                          className="flex items-center gap-1 px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <FaTrash /> Delete
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
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
              className="bg-white rounded-2xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-800">
                  {editingItem ? "Edit Skill" : "Add Skill"}
                </h2>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple/50 outline-none"
                    placeholder="React, Node.js, etc."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple/50 outline-none"
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Proficiency: {proficiency}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={proficiency}
                    onChange={(e) => setProficiency(Number(e.target.value))}
                    className="w-full accent-purple"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Icon Path</label>
                  <input
                    type="text"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple/50 outline-none"
                    placeholder="/react.svg"
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
