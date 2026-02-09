"use client";

import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FaEnvelope, FaCheck, FaTrash } from "react-icons/fa";
import {
  useContactSubmissions,
  updateDocument,
  deleteDocument,
} from "@/hooks/useFirestoreData";

export default function MessagesPage() {
  const { data: messages, loading } = useContactSubmissions();

  const markAsRead = async (id: string) => {
    try {
      await updateDocument("contactSubmissions", id, { read: true });
      toast.success("Marked as read");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this message?")) {
      try {
        await deleteDocument("contactSubmissions", id);
        toast.success("Deleted!");
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  };

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Messages</h1>
          <p className="text-slate-500">
            {unreadCount > 0 ? `${unreadCount} unread messages` : "Contact form submissions"}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500">Loading...</div>
      ) : messages.length === 0 ? (
        <div className="text-center py-12 bg-white/80 rounded-2xl border border-slate-200/50">
          <FaEnvelope className="mx-auto text-4xl text-slate-300 mb-4" />
          <p className="text-slate-500">No messages yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              layout
              className={`bg-white/80 backdrop-blur-lg rounded-2xl border p-6 shadow-sm hover:shadow-lg transition-all ${
                msg.read ? "border-slate-200/50" : "border-blue-200 bg-blue-50/50"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-slate-800">{msg.name}</h3>
                    {!msg.read && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded-full">
                        New
                      </span>
                    )}
                  </div>
                  <a
                    href={`mailto:${msg.email}`}
                    className="text-sm text-purple hover:underline"
                  >
                    {msg.email}
                  </a>
                  <p className="text-slate-600 mt-3 whitespace-pre-wrap">{msg.message}</p>
                  <p className="text-xs text-slate-400 mt-3">
                    {msg.createdAt?.toDate?.()?.toLocaleDateString() || "Unknown date"}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  {!msg.read && (
                    <button
                      onClick={() => markAsRead(msg.id)}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm text-green-600 hover:bg-green-50 rounded-lg"
                      title="Mark as read"
                    >
                      <FaCheck />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(msg.id)}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
