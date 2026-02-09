"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaProjectDiagram,
  FaQuoteLeft,
  FaBriefcase,
  FaBlog,
  FaCog,
  FaSignOutAlt,
  FaEnvelope,
  FaCode,
  FaHome,
  FaArrowLeft,
} from "react-icons/fa";

const sidebarItems = [
  { name: "Dashboard", icon: FaHome, href: "/admin/dashboard" },
  { name: "Projects", icon: FaProjectDiagram, href: "/admin/dashboard/projects" },
  { name: "Testimonials", icon: FaQuoteLeft, href: "/admin/dashboard/testimonials" },
  { name: "Experience", icon: FaBriefcase, href: "/admin/dashboard/experience" },
  { name: "Blog Posts", icon: FaBlog, href: "/admin/dashboard/blog" },
  { name: "Skills", icon: FaCode, href: "/admin/dashboard/skills" },
  { name: "Messages", icon: FaEnvelope, href: "/admin/dashboard/messages" },
  { name: "Settings", icon: FaCog, href: "/admin/dashboard/settings" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white/80 backdrop-blur-lg border-r border-slate-200/50 fixed h-full z-40">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold gradient-text">
            <FaArrowLeft className="text-sm" />
            Portfolio CMS
          </Link>
        </div>
        
        <nav className="px-3 py-4 space-y-1">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-purple text-white shadow-lg"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <item.icon className="text-lg" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200/50">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
          >
            <FaSignOutAlt />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-8"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
