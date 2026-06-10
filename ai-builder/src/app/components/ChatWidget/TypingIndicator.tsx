"use client";

import React from "react";
import { motion } from "framer-motion";

export function TypingIndicator() {
  const dotVariants = {
    animate: (i: number) => ({
      y: [0, -5, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        repeatType: "loop" as const,
        delay: i * 0.15,
        ease: "easeInOut" as const,
      },
    }),
  };

  return (
    <div className="flex items-center gap-1.5 bg-black-surface border border-white/5 rounded-tr-2xl rounded-br-2xl rounded-bl-2xl px-4 py-3.5 w-16 h-10 select-none">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-[#666666]"
          custom={i}
          variants={dotVariants}
          animate="animate"
        />
      ))}
    </div>
  );
}
