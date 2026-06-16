"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import chatgptIcon from "@/assets/chatgpt-icon.svg";
import claudeIcon from "@/assets/claude-ai-icon.svg";
import deepseekIcon from "@/assets/deepseek-logo-icon.svg";
import qwenIcon from "@/assets/Qwen_logo.svg";

const ChatGptIcon = ({ className, style }: any) => (
  <Image src={chatgptIcon} alt="ChatGPT" className={className} style={style} />
);

const ClaudeIcon = ({ className, style }: any) => (
  <Image src={claudeIcon} alt="Claude" className={className} style={style} />
);

const DeepSeekIcon = ({ className, style }: any) => (
  <Image src={deepseekIcon} alt="DeepSeek" className={className} style={style} />
);

const QwenIcon = ({ className, style }: any) => (
  <Image src={qwenIcon} alt="Qwen" className={className} style={style} />
);

const LOGOS = [
  { id: "chatgpt", Icon: ChatGptIcon, name: "ChatGPT", color: "#10a37f" },
  { id: "claude", Icon: ClaudeIcon, name: "Claude", color: "#d97757" },
  { id: "deepseek", Icon: DeepSeekIcon, name: "DeepSeek", color: "#4b96ff" },
  { id: "qwen", Icon: QwenIcon, name: "Qwen", color: "#9c27b0" },
];

const LOGO_POSITIONS = [
  // Top Left Area
  { top: "10%", left: "15%", depth: 0, delay: 0, duration: 5 },
  { top: "25%", left: "5%", depth: 2, delay: 1.5, duration: 6 },
  { top: "35%", left: "20%", depth: 1, delay: 3, duration: 7 },
  
  // Bottom Left Area
  { top: "65%", left: "15%", depth: 2, delay: 2, duration: 4.5 },
  { top: "80%", left: "5%", depth: 0, delay: 4, duration: 6.5 },
  { top: "85%", left: "25%", depth: 1, delay: 1, duration: 5.5 },

  // Top Right Area
  { top: "15%", left: "85%", depth: 1, delay: 0.5, duration: 5.5 },
  { top: "25%", left: "75%", depth: 0, delay: 2.5, duration: 7 },
  { top: "5%", left: "65%", depth: 2, delay: 4.5, duration: 6 },

  // Bottom Right Area
  { top: "70%", left: "80%", depth: 0, delay: 3.5, duration: 6.5 },
  { top: "85%", left: "90%", depth: 1, delay: 1.5, duration: 5 },
  { top: "85%", left: "65%", depth: 2, delay: 5, duration: 7.5 },
];

const SCATTERED_LOGOS = LOGO_POSITIONS.map((pos, i) => {
  const logo = LOGOS[i % LOGOS.length];
  return { ...pos, ...logo, uniqueId: `${logo.id}-${i}` };
});

function LogoCard({ item, springX, springY }: any) {
  const { depth, top, left, delay, duration } = item;
  const baseScale = depth === 0 ? 1 : depth === 1 ? 0.8 : 0.6;
  const maxOpacity = depth === 0 ? 1 : depth === 1 ? 0.4 : 0.2;
  const minOpacity = 0.15;
  const blurValue = depth === 0 ? "blur(0px)" : depth === 1 ? "blur(4px)" : "blur(8px)";
  
  const parallaxFactor = depth === 0 ? 30 : depth === 1 ? 15 : 5;
  const x = useTransform(springX, [-0.5, 0.5], [-parallaxFactor, parallaxFactor]);
  const y = useTransform(springY, [-0.5, 0.5], [-parallaxFactor, parallaxFactor]);

  return (
    <motion.div
      style={{ x, y, top, left }}
      className="absolute shrink-0"
    >
      <motion.div
        whileHover={{
          scale: 1.1 / baseScale,
          opacity: 1,
          filter: "blur(0px)",
          zIndex: 50,
          transition: { duration: 0.3, type: "spring", stiffness: 300, damping: 20 }
        }}
        initial={{ opacity: minOpacity, filter: blurValue }}
        animate={{ 
          opacity: [minOpacity, maxOpacity, minOpacity],
          scale: [baseScale * 0.98, baseScale * 1, baseScale * 0.98] 
        }}
        transition={{
          duration,
          delay,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="relative group w-[100px] h-[100px] sm:w-[180px] sm:h-[180px] rounded-[32px] border border-white/5 bg-white/2 backdrop-blur-md flex items-center justify-center cursor-pointer pointer-events-auto shadow-[0_4px_30px_rgba(0,0,0,0.1)]"
      >
        <div 
          className="absolute inset-0 rounded-[32px] transition-all duration-500 blur-xl opacity-0 group-hover:opacity-60"
          style={{ backgroundColor: item.color }}
        />
        <div className="absolute inset-0 rounded-[32px] border border-white/5 group-hover:border-white/30 group-hover:bg-white/10 transition-colors duration-500" />
        <item.Icon className="w-14 h-14 sm:w-24 sm:h-24 relative z-10 transition-transform duration-500 group-hover:scale-110 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] group-hover:drop-shadow-[0_0_25px_rgba(255,255,255,0.8)]" style={{ color: item.color }} />
      </motion.div>
    </motion.div>
  );
}

const Particles = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);
  if (!isMounted) return null;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {Array.from({ length: 30 }).map((_, i) => {
        const size = Math.random() * 4 + 1;
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const duration = 5 + Math.random() * 10;
        const delay = Math.random() * 5;
        const maxOpacity = Math.random() * 0.8 + 0.2;

        return (
          <motion.div
            key={i}
            className="absolute rounded-full bg-emerald-400/40"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${left}%`,
              top: `${top}%`,
            }}
            animate={{
              y: [0, -100 - Math.random() * 100],
              opacity: [0, maxOpacity, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration,
              repeat: Infinity,
              delay,
              ease: "linear",
            }}
          />
        );
      })}
    </div>
  );
};

export function AnimatedLogosBackground() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mouseX.set(e.clientX / innerWidth - 0.5);
      mouseY.set(e.clientY / innerHeight - 0.5);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1200px] h-[650px] overflow-hidden rounded-[40px] z-10 pointer-events-none flex items-center justify-center">
      
      {/* Center glowing green spotlight */}
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full mix-blend-screen pointer-events-none"
        style={{
          background: "radial-gradient(circle at center, rgba(16,185,129,0.2) 0%, rgba(132,204,22,0.05) 40%, transparent 70%)",
          filter: "blur(50px)",
        }}
        animate={{
          scale: [0.95, 1.05, 0.95],
          opacity: [0.6, 0.8, 0.6],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Additional intense core glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full mix-blend-screen pointer-events-none"
        style={{
          background: "radial-gradient(circle at center, rgba(16,185,129,0.3) 0%, transparent 60%)",
          filter: "blur(40px)",
        }}
      />

      <Particles />

      {/* Fixed Static Logos Layout */}
      <div className="absolute inset-0 pointer-events-none">
        {SCATTERED_LOGOS.map((item, i) => (
          <LogoCard key={item.uniqueId} item={item} springX={springX} springY={springY} />
        ))}
      </div>
    </div>
  );
}
