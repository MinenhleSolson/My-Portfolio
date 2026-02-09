"use client";

import { motion } from "framer-motion";
import { useSkills } from "@/hooks/useFirestoreData";
import { skills as staticSkills, companies } from "@/data";

// Fallback to static data if Firebase is not configured
const useSkillsWithFallback = () => {
  const { data, loading, error } = useSkills();
  
  // If we have Firebase data, use it
  if (!loading && data.length > 0) {
    return { data, loading: false };
  }
  
  // Otherwise, use static data
  return { 
    data: staticSkills || [], 
    loading: false 
  };
};

const Skills = () => {
  const { data: skills, loading } = useSkillsWithFallback();

  const categories = [
    { value: "frontend", label: "Frontend", color: "from-blue-500 to-cyan-500" },
    { value: "backend", label: "Backend", color: "from-green-500 to-emerald-500" },
    { value: "tools", label: "Tools & DevOps", color: "from-purple to-pink-500" },
    { value: "other", label: "Other", color: "from-orange-500 to-amber-500" },
  ];

  // Use companies as fallback skills if no Firebase skills
  const displaySkills = skills.length > 0 ? skills : companies.map((c, i) => ({
    id: String(c.id),
    name: c.name,
    category: i < 4 ? "frontend" : i < 7 ? "backend" : "tools",
    proficiency: 85 - (i * 5),
    icon: c.img,
    order: i,
  }));

  const groupedSkills = displaySkills.reduce((acc: any, skill: any) => {
    const cat = skill.category || "other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  return (
    <section id="skills" className="py-20">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="heading text-slate-800 dark:text-white"
      >
        Technical <span className="text-purple dark:text-purple-light">Skills</span>
      </motion.h1>

      <div className="mt-12 space-y-12">
        {categories.map((category, catIdx) => {
          const catSkills = groupedSkills[category.value] || [];
          if (catSkills.length === 0) return null;

          return (
            <motion.div
              key={category.value}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: catIdx * 0.1 }}
            >
              <h2 className="text-xl font-bold text-slate-700 dark:text-white-100 mb-6 flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full bg-gradient-to-r ${category.color}`}></span>
                {category.label}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {catSkills.map((skill: any, idx: number) => (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ y: -5 }}
                    className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-xl border border-slate-200/50 dark:border-slate-700/50 p-4 shadow-sm hover:shadow-lg transition-all"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      {skill.icon && (
                        <img 
                          src={skill.icon} 
                          alt={skill.name} 
                          className="w-8 h-8 object-contain"
                        />
                      )}
                      <span className="font-semibold text-slate-800 dark:text-white">
                        {skill.name}
                      </span>
                    </div>
                    <div className="relative h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.proficiency || 80}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`absolute inset-y-0 left-0 bg-gradient-to-r ${category.color} rounded-full`}
                      />
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 text-right">
                      {skill.proficiency || 80}%
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default Skills;
