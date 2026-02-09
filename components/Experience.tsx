"use client";

import React from "react";
import { motion } from "framer-motion";

import { workExperience as staticWorkExperience } from "@/data";
import { useExperience } from "@/hooks/useFirestoreData";
import { Button } from "./ui/MovingBorders";

const Experience = () => {
  const { data: firebaseExperience, loading } = useExperience();
  
  // Use Firebase data if available, otherwise fall back to static data
  const workExperience = firebaseExperience.length > 0 ? firebaseExperience : staticWorkExperience;
  return (
    <section className="w-full">
      {/* Dark themed full-width container for Work Experience section */}
      <div className="w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 lg:py-20 px-5 sm:px-10">
        <div className="max-w-7xl mx-auto">
          <motion.h1 
            className="heading text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            My <span className="text-purple-light">work experience</span>
          </motion.h1>

          <div className="w-full mt-12 grid lg:grid-cols-2 grid-cols-1 gap-6">
            {workExperience.map((card: any, idx: number) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Button
                  duration={Math.floor(Math.random() * 10000) + 10000}
                  borderRadius="1.75rem"
                  style={{
                    background: "linear-gradient(135deg, rgba(30,41,59,0.9) 0%, rgba(51,65,85,0.9) 100%)",
                    borderRadius: `calc(1.75rem* 0.96)`,
                  }}
                  className="flex-1 text-white border-white/10"
                >
                  <div className="flex lg:flex-row flex-col lg:items-center p-3 py-6 md:p-5 lg:p-10 gap-2">
                    <img
                      src={card.thumbnail}
                      alt={card.thumbnail}
                      className="lg:w-32 md:w-20 w-16"
                    />
                    <div className="lg:ms-5">
                      <h1 className="text-start text-xl md:text-2xl font-bold text-white">
                        {card.title}
                      </h1>
                      <p className="text-start text-slate-300 mt-3 font-semibold">
                        {card.desc}
                      </p>
                    </div>
                  </div>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;

