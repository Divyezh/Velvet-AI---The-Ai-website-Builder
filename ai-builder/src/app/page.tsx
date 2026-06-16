"use client";

import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  Paperclip, 
  ArrowUp, 
  ChevronDown,
  Sparkles
} from "lucide-react";
import { 
  HeroPreview, 
  AlternatingFeatures, 
  MetricsSection, 
  Testimonials, 
  CTA, 
  Footer 
} from "./components";
import { AnimatedLogosBackground } from "./components/ui/animated-logos-bg";
import { Navbar } from "@/app/components/Navbar";

export default function Home() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState("Claude 3.5 Sonnet");
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);

  const handleSubmit = () => {
    if (!prompt.trim()) return;
    router.push(`/sandbox?prompt=${encodeURIComponent(prompt)}`);
  };

  // Global mouse tracking for background glow
  const mouseX = useMotionValue(typeof window !== "undefined" ? window.innerWidth / 2 : 0);
  const mouseY = useMotionValue(typeof window !== "undefined" ? window.innerHeight / 2 : 0);

  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <main className="min-h-screen bg-[#0A0A0A] font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 z-10 flex flex-col items-center text-center">
        {/* Dynamic Animated Logos Background */}
        <AnimatedLogosBackground />
        
        {/* Hero Content Wrapper */}
        <div className="relative z-20 flex flex-col items-center w-full">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-indigo-300 mb-8"
        >
          <Sparkles className="w-3.5 h-3.5" />
          AI-Powered Full-Stack Builder
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-semibold text-white tracking-tight mb-6 max-w-4xl"
        >
          Build production-ready <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-emerald-400">
            apps with AI
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="text-lg text-slate-400 max-w-2xl mb-12"
        >
          Generate, edit, preview and deploy modern applications using GPT, Claude and Gemini.
        </motion.p>

        {/* Prompt Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
          className="w-full max-w-3xl relative"
        >
          <div className="absolute -inset-1 bg-linear-to-r from-indigo-500/20 to-emerald-500/20 rounded-2xl blur-xl opacity-50" />
          <div className="bg-[#111] border border-white/10 rounded-2xl p-4 flex flex-col shadow-2xl relative z-10 transition-all hover:border-white/20">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              placeholder="What do you want to build?"
              className="w-full bg-transparent text-white text-lg placeholder-slate-500 resize-none outline-none min-h-[120px]"
            />
            
            <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-2">
              <div className="flex items-center gap-3">
                <button className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                  <Paperclip className="w-5 h-5" />
                </button>
                
                {/* Model Selector */}
                <div className="relative">
                  <button 
                    onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-slate-300 font-medium transition-colors border border-white/5"
                  >
                    {selectedModel}
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  </button>
                  
                  {isModelDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-20" onClick={() => setIsModelDropdownOpen(false)} />
                      <div className="absolute left-0 top-full mt-2 w-48 bg-[#1A1A1A] border border-white/10 rounded-xl shadow-xl py-2 z-30">
                        {["Claude 3.5 Sonnet", "GPT-4o", "Gemini 1.5 Pro"].map(m => (
                          <button
                            key={m}
                            onClick={() => { setSelectedModel(m); setIsModelDropdownOpen(false); }}
                            className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <button 
                onClick={handleSubmit}
                className="w-10 h-10 rounded-full bg-white text-black hover:bg-slate-200 flex items-center justify-center transition-colors"
              >
                <ArrowUp className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Suggested Prompts */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-2 mt-8"
        >
          {["SaaS Dashboard", "CRM Platform", "AI Agent", "Portfolio Website", "Mobile App"].map(chip => (
            <button
              key={chip}
              onClick={() => {
                const text = `Build a modern ${chip} with authentication and a database...`;
                setPrompt(text);
                router.push(`/sandbox?prompt=${encodeURIComponent(text)}`);
              }}
              className="px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs text-slate-400 hover:text-white hover:border-white/20 transition-all"
            >
              {chip}
            </button>
          ))}
        </motion.div>
        </div>
      </section>

      {/* Interactive Product Preview */}
      <section className="relative z-10 px-6 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <HeroPreview />
        </motion.div>
      </section>

      {/* Trusted By Marquee */}
      <section className="py-16 border-y border-white/5 bg-[#0A0A0A] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-xs font-semibold text-slate-500 uppercase tracking-widest mb-10">
            Trusted by innovative teams worldwide
          </p>
          <div className="flex items-center" style={{ maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}>
            <motion.div
              animate={{ x: [0, -1000] }}
              transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
              className="flex items-center gap-24 min-w-max"
            >
              {[...Array(2)].map((_, i) => (
                <React.Fragment key={i}>
                  <span className="text-2xl font-bold text-slate-400/50">OpenAI</span>
                  <span className="text-2xl font-bold text-slate-400/50">GitHub</span>
                  <span className="text-2xl font-bold text-slate-400/50">Vercel</span>
                  <span className="text-2xl font-bold text-slate-400/50">Stripe</span>
                  <span className="text-2xl font-bold text-slate-400/50">Supabase</span>
                  <span className="text-2xl font-bold text-slate-400/50">Notion</span>
                </React.Fragment>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Remainder of the sections */}
      <AlternatingFeatures />
      <MetricsSection />
      <Testimonials />
      <CTA />
      <Footer />

    </main>
  );
}
