"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  FaProjectDiagram,
  FaQuoteLeft,
  FaBriefcase,
  FaBlog,
  FaCog,
  FaSignOutAlt,
  FaEnvelope,
  FaCode,
} from "react-icons/fa";
import {
  useProjects,
  useTestimonials,
  useExperience,
  useBlogPosts,
  useContactSubmissions,
} from "@/hooks/useFirestoreData";

const menuItems = [
  { name: "Projects", icon: FaProjectDiagram, href: "/admin/dashboard/projects" },
  { name: "Testimonials", icon: FaQuoteLeft, href: "/admin/dashboard/testimonials" },
  { name: "Experience", icon: FaBriefcase, href: "/admin/dashboard/experience" },
  { name: "Blog Posts", icon: FaBlog, href: "/admin/dashboard/blog" },
  { name: "Skills", icon: FaCode, href: "/admin/dashboard/skills" },
  { name: "Messages", icon: FaEnvelope, href: "/admin/dashboard/messages" },
  { name: "Settings", icon: FaCog, href: "/admin/dashboard/settings" },
];

export default function AdminDashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const { data: projects, loading: projectsLoading } = useProjects();
  const { data: testimonials, loading: testimonialsLoading } = useTestimonials();
  const { data: experience, loading: experienceLoading } = useExperience();
  const { data: blogPosts, loading: blogLoading } = useBlogPosts(false);
  const { data: messages, loading: messagesLoading } = useContactSubmissions();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/admin");
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    await logout();
    router.push("/admin");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple"></div>
      </div>
    );
  }

  if (!user) return null;

  const stats = [
    { name: "Projects", count: projects.length, loading: projectsLoading, color: "from-blue-500 to-cyan-500" },
    { name: "Testimonials", count: testimonials.length, loading: testimonialsLoading, color: "from-purple to-pink-500" },
    { name: "Experience", count: experience.length, loading: experienceLoading, color: "from-orange-500 to-amber-500" },
    { name: "Blog Posts", count: blogPosts.length, loading: blogLoading, color: "from-green-500 to-emerald-500" },
  ];

  const unreadMessages = messages.filter((m) => !m.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-2xl font-bold gradient-text">
              Portfolio CMS
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">{user.email}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-slate-800">Welcome back! 👋</h1>
          <p className="text-slate-500 mt-1">Manage your portfolio content from here.</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-slate-200/50 shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center text-white font-bold text-xl mb-4`}>
                {stat.loading ? "..." : stat.count}
              </div>
              <h3 className="text-lg font-semibold text-slate-800">{stat.name}</h3>
              <p className="text-sm text-slate-500">Total items</p>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-slate-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {menuItems.map((item, idx) => (
              <Link
                key={item.name}
                href={item.href}
                className="bg-white/80 backdrop-blur-lg rounded-xl p-4 border border-slate-200/50 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col items-center gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple flex items-center justify-center text-white">
                  <item.icon />
                </div>
                <span className="text-sm font-medium text-slate-700">{item.name}</span>
                {item.name === "Messages" && unreadMessages > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadMessages}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-xl font-bold text-slate-800 mb-4">Recent Messages</h2>
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl border border-slate-200/50 shadow-sm overflow-hidden">
            {messagesLoading ? (
              <div className="p-8 text-center text-slate-500">Loading...</div>
            ) : messages.length === 0 ? (
              <div className="p-8 text-center text-slate-500">No messages yet</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {messages.slice(0, 5).map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-4 hover:bg-slate-50 transition-colors ${!msg.read ? "bg-blue-50/50" : ""}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-slate-800">{msg.name}</p>
                        <p className="text-sm text-slate-500">{msg.email}</p>
                        <p className="text-sm text-slate-600 mt-1 line-clamp-1">{msg.message}</p>
                      </div>
                      {!msg.read && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">New</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
