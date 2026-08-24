"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FaSave, FaPlus, FaTrash } from "react-icons/fa";
import { useSiteSettings, updateSiteSettings } from "@/hooks/useSupabaseData";
import { NavItem, SocialLink } from "@/lib/types";

export default function SettingsPage() {
  const { data: settings, loading } = useSiteSettings();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [email, setEmail] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [aboutText, setAboutText] = useState("");
  const [heroTagline, setHeroTagline] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [socialMedia, setSocialMedia] = useState<SocialLink[]>([]);

  useEffect(() => {
    if (settings) {
      setEmail(settings.email || "");
      setResumeUrl(settings.resumeUrl || "");
      setAboutText(settings.aboutText || "");
      setHeroTagline(settings.heroTagline || "");
      setHeroSubtitle(settings.heroSubtitle || "");
      setNavItems(settings.navItems || []);
      setSocialMedia(settings.socialMedia || []);
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await updateSiteSettings({
        email,
        resumeUrl,
        aboutText,
        heroTagline,
        heroSubtitle,
        navItems,
        socialMedia,
      });
      toast.success("Settings saved!");
    } catch (error: any) {
      toast.error(error.message || "Failed to save");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addNavItem = () => {
    setNavItems([...navItems, { name: "", link: "" }]);
  };

  const updateNavItem = (index: number, field: string, value: string) => {
    const updated = [...navItems];
    (updated[index] as any)[field] = value;
    setNavItems(updated);
  };

  const removeNavItem = (index: number) => {
    setNavItems(navItems.filter((_, i) => i !== index));
  };

  const addSocialLink = () => {
    setSocialMedia([
      ...socialMedia,
      { id: Date.now(), img: "", link: "" },
    ]);
  };

  const updateSocialLink = (index: number, field: string, value: string) => {
    const updated = [...socialMedia];
    (updated[index] as any)[field] = value;
    setSocialMedia(updated);
  };

  const removeSocialLink = (index: number) => {
    setSocialMedia(socialMedia.filter((_, i) => i !== index));
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-500">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Site Settings</h1>
          <p className="text-slate-500">Configure your portfolio settings</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
        {/* General Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-lg rounded-2xl border border-slate-200/50 p-6"
        >
          <h2 className="text-lg font-bold text-slate-800 mb-4">General</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Contact Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple/50 outline-none"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Resume URL
              </label>
              <input
                type="url"
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple/50 outline-none"
                placeholder="https://drive.google.com/..."
              />
            </div>
          </div>
        </motion.div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-lg rounded-2xl border border-slate-200/50 p-6"
        >
          <h2 className="text-lg font-bold text-slate-800 mb-4">Hero Section</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Tagline
              </label>
              <input
                type="text"
                value={heroTagline}
                onChange={(e) => setHeroTagline(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple/50 outline-none"
                placeholder="Transforming Ideas into Engaging User Experiences"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Subtitle
              </label>
              <input
                type="text"
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple/50 outline-none"
                placeholder="Hi! I'm Minenhle, a Developer based in South Africa."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">About Text</label>
              <textarea
                value={aboutText}
                onChange={(e) => setAboutText(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple/50 outline-none resize-none"
              />
            </div>
          </div>
        </motion.div>

        {/* Navigation Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-lg rounded-2xl border border-slate-200/50 p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-slate-800">Navigation Items</h2>
            <button
              type="button"
              onClick={addNavItem}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-purple hover:bg-purple/10 rounded-lg"
            >
              <FaPlus /> Add
            </button>
          </div>
          <div className="space-y-3">
            {navItems.map((item, idx) => (
              <div key={idx} className="flex gap-3">
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => updateNavItem(idx, "name", e.target.value)}
                  className="flex-1 px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple/50 outline-none"
                  placeholder="Name"
                />
                <input
                  type="text"
                  value={item.link}
                  onChange={(e) => updateNavItem(idx, "link", e.target.value)}
                  className="flex-1 px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple/50 outline-none"
                  placeholder="#section"
                />
                <button
                  type="button"
                  onClick={() => removeNavItem(idx)}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-xl"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
            {navItems.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-4">No navigation items</p>
            )}
          </div>
        </motion.div>

        {/* Social Media Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-lg rounded-2xl border border-slate-200/50 p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-slate-800">Social Media Links</h2>
            <button
              type="button"
              onClick={addSocialLink}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-purple hover:bg-purple/10 rounded-lg"
            >
              <FaPlus /> Add
            </button>
          </div>
          <div className="space-y-3">
            {socialMedia.map((item, idx) => (
              <div key={idx} className="flex gap-3">
                <input
                  type="text"
                  value={item.img}
                  onChange={(e) => updateSocialLink(idx, "img", e.target.value)}
                  className="w-1/3 px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple/50 outline-none"
                  placeholder="Icon path (/git.svg)"
                />
                <input
                  type="url"
                  value={item.link}
                  onChange={(e) => updateSocialLink(idx, "link", e.target.value)}
                  className="flex-1 px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple/50 outline-none"
                  placeholder="https://github.com/..."
                />
                <button
                  type="button"
                  onClick={() => removeSocialLink(idx)}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-xl"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
          >
            <FaSave /> {isSubmitting ? "Saving..." : "Save Settings"}
          </button>
        </motion.div>
      </form>
    </div>
  );
}
