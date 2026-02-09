"use client";

import { FaLocationArrow } from "react-icons/fa6";
import { motion } from "framer-motion";
import Image from "next/image";

import MagicButton from "./MagicButton";
import { Spotlight } from "./ui/Spotlight";
import { TextGenerateEffect } from "./ui/TextGenerateEffect";
import { useSiteSettings } from "@/hooks/useFirestoreData";

const Hero = () => {
  const { data: siteSettings, loading } = useSiteSettings();
  
  // Use Firebase data if available, otherwise fall back to static content
  const heroTagline = siteSettings?.heroTagline || "Transforming Ideas into Engaging User Experiences";
  const heroSubtitle = siteSettings?.heroSubtitle || "Hi! I'm Minenhle, a Developer based in South Africa.";

  return (
    <div className="pb-20 pt-36 relative">
      {/**
       *  UI: Spotlights - adjusted for light mode
       */}
      <div>
        <Spotlight
          className="-top-40 -left-10 md:-left-32 md:-top-20 h-screen"
          fill="rgba(59, 130, 246, 0.3)"
        />
        <Spotlight
          className="h-[80vh] w-[50vw] top-10 left-full"
          fill="rgba(139, 92, 246, 0.4)"
        />
        <Spotlight 
          className="left-80 top-28 h-[80vh] w-[50vw]" 
          fill="rgba(99, 102, 241, 0.3)" 
        />
      </div>

      {/**
       *  UI: grid background
       */}
      <div
        className="h-screen w-full dark:bg-black-100 bg-transparent bg-grid-slate-200/[0.4] dark:bg-grid-white/[0.03]
       absolute top-0 left-0 flex items-center justify-center"
      >
        {/* Radial gradient for the container to give a faded look */}
        <div
          className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black-100
         bg-slate-50 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"
        />
      </div>

      <div className="flex justify-center relative my-20 z-10">
        <div className="max-w-[89vw] md:max-w-4xl lg:max-w-[75vw] flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16">
          {/* Profile Image Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative flex-shrink-0"
          >
            {/* Gradient glow behind image */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-violet-500 rounded-full blur-2xl opacity-40 scale-110" />
            
            {/* Profile image container */}
            <motion.div
              animate={{ 
                y: [0, -10, 0],
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="relative"
            >
              <div className="relative w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl">
                <Image
                  src="/me.jpg"
                  alt="Minenhle Cele"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              
              {/* Decorative ring */}
              <div className="absolute -inset-3 border-2 border-purple/30 dark:border-purple-light/30 rounded-full animate-pulse" />
            </motion.div>
          </motion.div>

          {/* Text Content Section */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="uppercase tracking-widest text-xs text-slate-600 dark:text-blue-100"
            >
              Full-Stack Developer
            </motion.p>

            <TextGenerateEffect
              words={heroTagline}
              className="text-[32px] md:text-4xl lg:text-5xl xl:text-6xl text-slate-800 dark:text-white"
            />

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="md:tracking-wider mb-6 text-sm md:text-lg lg:text-xl text-slate-600 dark:text-white-100"
            >
              {heroSubtitle.includes("Minenhle") ? (
                <>
                  Hi! I&apos;m <span className="font-semibold gradient-text">Minenhle</span>, a Developer based in South Africa.
                </>
              ) : (
                heroSubtitle
              )}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <a href="#about">
                <MagicButton
                  title="About Me"
                  icon={<FaLocationArrow />}
                  position="right"
                />
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

