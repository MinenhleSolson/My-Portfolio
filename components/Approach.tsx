"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";

import { CanvasRevealEffect } from "./ui/CanvasRevealEffect";

const Approach = () => {
  return (
    <section className="w-full">
      {/* Dark themed full-width container for My Approach section */}
      <div className="w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 lg:py-20 px-5 sm:px-10">
        <div className="max-w-7xl mx-auto">
          <motion.h1 
            className="heading text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            My <span className="text-purple-light">Approach</span>
          </motion.h1>
          
          <div className="my-20 flex flex-col lg:flex-row items-center justify-center w-full gap-4">
            <Card
              title="Planning & Strategy"
              icon={<AceternityIcon order="Phase 1" />}
              des="We'll collaborate to map out your website's goals, target audience, 
              and key functionalities. We'll discuss things like site structure, 
              navigation, and content requirements."
            >
              <CanvasRevealEffect
                animationSpeed={5.1}
                containerClassName="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl overflow-hidden"
              />
            </Card>
            <Card
              title="Development & Progress Update"
              icon={<AceternityIcon order="Phase 2" />}
              des="Once we agree on the plan, I cue my playlist and dive into
              coding. From initial sketches to polished code, I keep you updated
              every step of the way."
            >
              <CanvasRevealEffect
                animationSpeed={3}
                containerClassName="bg-gradient-to-br from-purple to-pink-500 rounded-3xl overflow-hidden"
                colors={[
                  [255, 166, 158],
                  [221, 255, 247],
                ]}
                dotSize={2}
              />
            </Card>
            <Card
              title="Development & Launch"
              icon={<AceternityIcon order="Phase 3" />}
              des="This is where the magic happens! Based on the approved design, 
              I'll translate everything into functional code, building your Website or Application
              from the ground up."
            >
              <CanvasRevealEffect
                animationSpeed={3}
                containerClassName="bg-gradient-to-br from-violet-500 to-indigo-600 rounded-3xl overflow-hidden"
                colors={[[125, 211, 252]]}
              />
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Approach;

const Card = ({
  title,
  icon,
  children,
  des,
}: {
  title: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
  des: string;
}) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="border group/canvas-card flex items-center justify-center
       max-w-sm w-full mx-auto p-4 relative lg:h-[35rem] rounded-3xl
       border-white/10 bg-slate-800/60 backdrop-blur-sm
       hover:shadow-xl hover:shadow-purple-light/20 transition-all duration-300"
    >
      <Icon className="absolute h-10 w-10 -top-3 -left-3 text-slate-500 opacity-30" />
      <Icon className="absolute h-10 w-10 -bottom-3 -left-3 text-slate-500 opacity-30" />
      <Icon className="absolute h-10 w-10 -top-3 -right-3 text-slate-500 opacity-30" />
      <Icon className="absolute h-10 w-10 -bottom-3 -right-3 text-slate-500 opacity-30" />

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full w-full absolute inset-0"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-20 px-10">
        <div
          className="text-center group-hover/canvas-card:-translate-y-4 absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] 
        group-hover/canvas-card:opacity-0 transition duration-200 min-w-40 mx-auto flex items-center justify-center"
        >
          {icon}
        </div>
        <h2
          className="text-white text-center text-3xl opacity-0 group-hover/canvas-card:opacity-100
         relative z-10 mt-4 font-bold group-hover/canvas-card:text-white 
         group-hover/canvas-card:-translate-y-2 transition duration-200"
        >
          {title}
        </h2>
        <p
          className="text-sm opacity-0 group-hover/canvas-card:opacity-100
         relative z-10 mt-4 group-hover/canvas-card:text-white text-center
         group-hover/canvas-card:-translate-y-2 transition duration-200 text-slate-400"
        >
          {des}
        </p>
      </div>
    </motion.div>
  );
};

const AceternityIcon = ({ order }: { order: string }) => {
  return (
    <div>
      <button className="relative inline-flex overflow-hidden rounded-full p-[1px] ">
        <span
          className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite]
         bg-[conic-gradient(from_90deg_at_50%_50%,#3B82F6_0%,#8B5CF6_50%,#3B82F6_100%)]"
        />
        <span
          className="inline-flex h-full w-full cursor-pointer items-center 
        justify-center rounded-full bg-slate-800 px-5 py-2 text-purple-light backdrop-blur-3xl font-bold text-2xl"
        >
          {order}
        </span>
      </button>
    </div>
  );
};

export const Icon = ({ className, ...rest }: any) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={className}
      {...rest}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
  );
};

