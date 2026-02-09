"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React from "react";

export const MagicButton = ({
  title,
  icon,
  position,
  handleClick,
  otherClasses,
}: {
  title: string;
  icon: React.ReactNode;
  position: string;
  handleClick?: () => void;
  otherClasses?: string;
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative inline-flex h-12 w-full md:w-60 overflow-hidden rounded-xl p-[2px] focus:outline-none group",
        otherClasses
      )}
      onClick={handleClick}
    >
      {/* Animated gradient border */}
      <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#3B82F6_0%,#8B5CF6_50%,#3B82F6_100%)]" />
      
      {/* Button content */}
      <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-xl bg-white dark:bg-slate-950 px-7 text-sm font-medium text-slate-700 dark:text-white backdrop-blur-3xl gap-2 transition-all duration-300 group-hover:bg-slate-50 dark:group-hover:bg-slate-900">
        {position === "left" && icon}
        <span className="font-semibold">{title}</span>
        {position === "right" && icon}
      </span>
    </motion.button>
  );
};

export default MagicButton;
