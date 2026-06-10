"use client";

import * as React from "react";
import { motion } from "framer-motion";

interface TestimonialCardProps {
  handleShuffle: () => void;
  testimonial: string;
  position: "front" | "middle" | "back";
  id: number;
  author: string;
}

export function TestimonialCard({
  handleShuffle,
  testimonial,
  position,
  id,
  author,
}: TestimonialCardProps) {
  const dragRef = React.useRef(0);
  const isFront = position === "front";

  // Unsplash portrait photos — stable URLs that are guaranteed to exist
  const avatarUrls: Record<number, string> = {
    1: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop&crop=face",
    2: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop&crop=face",
    3: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=128&h=128&fit=crop&crop=face",
  };

  return (
    <motion.div
      style={{
        zIndex:
          position === "front" ? "2" : position === "middle" ? "1" : "0",
      }}
      animate={{
        rotate:
          position === "front"
            ? "-6deg"
            : position === "middle"
              ? "0deg"
              : "6deg",
        x:
          position === "front"
            ? "0%"
            : position === "middle"
              ? "33%"
              : "66%",
      }}
      drag={true}
      dragElastic={0.35}
      dragListener={isFront}
      dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
      onDragStart={(e: any) => {
        dragRef.current = e.clientX;
      }}
      onDragEnd={(e: any) => {
        if (dragRef.current - e.clientX > 150) {
          handleShuffle();
        }
        dragRef.current = 0;
      }}
      transition={{ duration: 0.35 }}
      className={`absolute left-0 top-0 grid h-[450px] w-[350px] select-none place-content-center space-y-6 rounded-2xl border border-white/10 bg-black-card/60 p-8 shadow-2xl backdrop-blur-md ${isFront ? "cursor-grab active:cursor-grabbing" : ""
        }`}
    >
      {/* Subtle red glow on front card */}
      {isFront && (
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-linear-to-bg from-red-vivid/5 via-transparent to-transparent" />
      )}

      <img
        src={avatarUrls[id] || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&fit=crop&crop=face`}
        alt={`Avatar of ${author}`}
        className="pointer-events-none mx-auto h-24 w-24 rounded-full border-2 border-white/10 bg-slate-800 object-cover ring-2 ring-red-vivid/20"
      />

      {/* Quote mark */}
      <div className="relative">
        <span className="absolute -top-4 left-0 font-display text-5xl leading-none text-red-vivid/30 select-none">
          &ldquo;
        </span>
        <p className="pt-4 text-center text-sm font-light italic leading-relaxed text-slate-300">
          {testimonial}
        </p>
      </div>

      <div className="flex flex-col items-center gap-1">
        <span className="h-px w-8 bg-red-vivid/40" />
        <span className="text-center text-xs font-semibold tracking-wider text-red-vivid">
          {author}
        </span>
      </div>
    </motion.div>
  );
}
