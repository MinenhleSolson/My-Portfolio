"use client";

import { navItems } from "@/data";
import Hero from "@/components/Hero";
import Grid from "@/components/Grid";
import Footer from "@/components/Footer";
import Clients from "@/components/Clients";
import Approach from "@/components/Approach";
import Experience from "@/components/Experience";
import RecentProjects from "@/components/RecentProjects";
import Skills from "@/components/Skills";
import ContactForm from "@/components/ContactForm";
import Blog from "@/components/Blog";
import { FloatingNav } from "@/components/ui/FloatingNavbar";
import BackToTop from "@/components/ui/BackToTop";

const Home = () => {
  return (
    <main className="relative bg-slate-50 dark:bg-black-100 flex justify-center items-center flex-col overflow-hidden mx-auto">
      {/* Gradient background overlay */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-violet-400/15 rounded-full blur-3xl" />
      </div>
      
      {/* Floating Nav */}
      <div className="max-w-7xl w-full sm:px-10 px-5">
        <FloatingNav navItems={navItems} />
      </div>

      {/* Hero Section - Contained */}
      <div className="max-w-7xl w-full sm:px-10 px-5">
        <Hero />
      </div>

      {/* Grid/About Section - Full Width Dark */}
      <Grid />

      {/* Skills Section - Contained Light */}
      <div className="max-w-7xl w-full sm:px-10 px-5">
        <Skills />
      </div>

      {/* Projects Section - Contained Light */}
      <div className="max-w-7xl w-full sm:px-10 px-5">
        <RecentProjects />
      </div>

      {/* Clients/Testimonials Section - Contained Light */}
      <div className="max-w-7xl w-full sm:px-10 px-5">
        <Clients />
      </div>

      {/* Blog Section - Contained Light */}
      <div className="max-w-7xl w-full sm:px-10 px-5">
        <Blog />
      </div>

      {/* Experience Section - Full Width Dark */}
      <Experience />

      {/* Approach Section - Full Width Dark */}
      <Approach />

      {/* Contact Form Section - Contained Light */}
      <div className="max-w-7xl w-full sm:px-10 px-5">
        <ContactForm />
      </div>

      {/* Footer Section - Full Width Dark */}
      <Footer />

      {/* Back to Top Button */}
      <BackToTop />
    </main>
  );
};

export default Home;


