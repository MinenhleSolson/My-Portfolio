"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { companies, testimonials as staticTestimonials } from "@/data";
import { useTestimonials } from "@/hooks/useFirestoreData";
import { InfiniteMovingCards } from "./ui/InfiniteCards";

const techCategories: Record<string, string> = {
  MongoDB: "Database",
  Firebase: "Backend",
  Kotlin: "Language",
  Swift: "Language",
  Java: "Language",
  TypeScript: "Language",
  "javascript.": "Language",
  graphql: "API",
  react: "Frontend",
  php: "Language",
  angular: "Frontend",
  node: "Runtime",
  mysql: "Database",
  "laravel.": "Framework",
};

const techColors: Record<
  string,
  { gradient: string; glow: string; badge: string }
> = {
  MongoDB: {
    gradient: "from-green-400 to-emerald-600",
    glow: "shadow-green-500/25",
    badge: "bg-green-500/10 text-green-400 ring-green-500/20",
  },
  Firebase: {
    gradient: "from-amber-400 to-orange-500",
    glow: "shadow-orange-500/25",
    badge: "bg-orange-500/10 text-orange-400 ring-orange-500/20",
  },
  Kotlin: {
    gradient: "from-violet-400 to-purple-600",
    glow: "shadow-violet-500/25",
    badge: "bg-violet-500/10 text-violet-400 ring-violet-500/20",
  },
  Swift: {
    gradient: "from-orange-400 to-red-500",
    glow: "shadow-orange-500/25",
    badge: "bg-orange-500/10 text-orange-400 ring-orange-500/20",
  },
  Java: {
    gradient: "from-red-400 to-orange-600",
    glow: "shadow-red-500/25",
    badge: "bg-red-500/10 text-red-400 ring-red-500/20",
  },
  TypeScript: {
    gradient: "from-blue-400 to-blue-600",
    glow: "shadow-blue-500/25",
    badge: "bg-blue-500/10 text-blue-400 ring-blue-500/20",
  },
  "javascript.": {
    gradient: "from-yellow-300 to-yellow-500",
    glow: "shadow-yellow-500/25",
    badge: "bg-yellow-500/10 text-yellow-400 ring-yellow-500/20",
  },
  graphql: {
    gradient: "from-pink-400 to-pink-600",
    glow: "shadow-pink-500/25",
    badge: "bg-pink-500/10 text-pink-400 ring-pink-500/20",
  },
  react: {
    gradient: "from-cyan-400 to-cyan-600",
    glow: "shadow-cyan-500/25",
    badge: "bg-cyan-500/10 text-cyan-400 ring-cyan-500/20",
  },
  php: {
    gradient: "from-indigo-400 to-indigo-600",
    glow: "shadow-indigo-500/25",
    badge: "bg-indigo-500/10 text-indigo-400 ring-indigo-500/20",
  },
  angular: {
    gradient: "from-red-400 to-red-600",
    glow: "shadow-red-500/25",
    badge: "bg-red-500/10 text-red-400 ring-red-500/20",
  },
  node: {
    gradient: "from-green-400 to-lime-500",
    glow: "shadow-lime-500/25",
    badge: "bg-lime-500/10 text-lime-400 ring-lime-500/20",
  },
  mysql: {
    gradient: "from-sky-400 to-blue-500",
    glow: "shadow-sky-500/25",
    badge: "bg-sky-500/10 text-sky-400 ring-sky-500/20",
  },
  "laravel.": {
    gradient: "from-rose-400 to-red-500",
    glow: "shadow-rose-500/25",
    badge: "bg-rose-500/10 text-rose-400 ring-rose-500/20",
  },
};

const defaultColor = {
  gradient: "from-purple to-violet-600",
  glow: "shadow-purple/25",
  badge: "bg-purple/10 text-purple-light ring-purple/20",
};

const displayName = (name: string) => name.replace(/\.$/, "");

const Clients = () => {
  const { data: firebaseTestimonials, loading } = useTestimonials();
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  // Use Firebase data if available, otherwise fall back to static data
  const testimonials =
    firebaseTestimonials.length > 0 ? firebaseTestimonials : staticTestimonials;

  return (
    <section id="testimonials" className="py-20">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="heading text-slate-800 dark:text-white"
      >
        Kind words from
        <span className="text-purple dark:text-purple-light">
          {" "}
          Satisfied Clients
        </span>
      </motion.h1>

      <div className="flex flex-col items-center max-lg:mt-10">
        <div className="h-[50vh] md:h-[30rem] rounded-md flex flex-col antialiased items-center justify-center relative overflow-hidden">
          <InfiniteMovingCards
            items={testimonials}
            direction="right"
            speed="slow"
          />
        </div>

        {/* Tech Stack / Companies */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-5xl mt-10"
        >
          <div className="text-center mb-10">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-sm uppercase tracking-[0.3em] text-purple dark:text-purple-light font-medium"
            >
              Technologies
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mt-2"
            >
              My Tech Arsenal
            </motion.h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5 px-4">
            {companies.map((company, idx) => {
              const colors = techColors[company.name] || defaultColor;
              const isHovered = hoveredId === company.id;

              return (
                <motion.div
                  key={company.id}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.4,
                    delay: idx * 0.06,
                    ease: [0.21, 0.47, 0.32, 0.98],
                  }}
                  onHoverStart={() => setHoveredId(company.id)}
                  onHoverEnd={() => setHoveredId(null)}
                  className="group relative"
                >
                  {/* Gradient border glow */}
                  <div
                    className={`absolute -inset-[1px] rounded-2xl bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-100 blur-[1px] transition-all duration-500`}
                  />

                  {/* Card */}
                  <div
                    className={`relative flex flex-col items-center justify-center gap-3 p-5 md:p-6 rounded-2xl
                      bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl
                      border border-slate-200/60 dark:border-white/[0.08]
                      group-hover:border-transparent
                      transition-all duration-500 ease-out
                      group-hover:${colors.glow} group-hover:shadow-2xl
                      h-full
                    `}
                  >
                    {/* Floating icon */}
                    <motion.div
                      animate={
                        isHovered ? { y: -4, scale: 1.15 } : { y: 0, scale: 1 }
                      }
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                      className="relative"
                    >
                      {/* Icon glow backdrop */}
                      <div
                        className={`absolute inset-0 rounded-full bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-20 blur-xl scale-150 transition-opacity duration-500`}
                      />
                      <img
                        src={company.img}
                        alt={company.name}
                        className="w-10 h-10 md:w-12 md:h-12 object-contain relative z-10 drop-shadow-sm group-hover:drop-shadow-lg transition-all duration-300"
                      />
                    </motion.div>

                    {/* Name */}
                    <span className="text-xs md:text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors duration-300 text-center">
                      {displayName(company.name)}
                    </span>

                    {/* Category badge */}
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full ring-1 ${colors.badge}
                        opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0
                        transition-all duration-300 ease-out`}
                    >
                      {techCategories[company.name] || "Tool"}
                    </span>

                    {/* Subtle inner shine on hover */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Clients;
