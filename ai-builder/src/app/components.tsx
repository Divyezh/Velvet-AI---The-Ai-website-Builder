"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Sparkles,
  Pencil,
  Rocket,
  Check,
  ArrowRight,
  Laptop,
  Smartphone,
  Tablet,
  Star,
  Globe,
  RefreshCw,
  Download,
  Copy,
  FileCode,
  X,
  ArrowLeft,
  Code2
} from "lucide-react";
import { BuilderChatbox } from "./components/BuilderChatbox";
import { motion } from "framer-motion";
import { TestimonialCard } from "./components/ui/testimonial-cards";

// Types
export interface BuilderState {
  prompt: string;
  template: "saas" | "portfolio" | "cafe" | "agency";
  theme: "dark" | "light";
  accent: "red" | "emerald" | "sky" | "gold";
  typography: "display" | "sans";
  siteName: string;
  siteDescription: string;
}

// Helper SVG Triangle Logo
function TriangleLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
    >
      <polygon points="12 2, 2 22, 22 22" />
    </svg>
  );
}

// 1. NAVBAR COMPONENT
export function Navbar({ onStartGenerate }: { onStartGenerate: () => void }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleBuilderClick = (e: React.MouseEvent) => {
    if (typeof window !== "undefined" && window.location.pathname === "/") {
      e.preventDefault();
      onStartGenerate();
    }
  };

  return (
    <header
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-5xl transition-all duration-300 ${scrolled
        ? "bg-[#dce9f5]/85 border border-white/50 backdrop-blur-md py-3 px-6 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)]"
        : "bg-[#dce9f5]/70 border border-white/40 backdrop-blur-md py-4 px-6 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.04)]"
        }`}
    >
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 group cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
        >
          <TriangleLogo className="w-5 h-5 text-slate-800 group-hover:text-red-vivid transition-colors" />
          <span className="font-display text-2xl tracking-wider text-slate-800">
            velvet<span className="text-red-vivid">.ai</span>
          </span>
        </Link>

        {/* Nav links center */}
        <nav className="hidden md:flex items-center gap-8">
          <div className="relative py-1 group">
            <Link
              href="/?builder=true"
              onClick={handleBuilderClick}
              className="text-red-vivid hover:text-slate-800 text-xs font-bold tracking-[0.08em] transition-colors duration-200 block"
            >
              BUILDER
            </Link>
            <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-red-vivid scale-x-100 origin-left transition-transform duration-250 ease-out" />
          </div>

          {[
            { name: "PRICING", href: "/#pricing" },
            { name: "FAQ", href: "/faq" },
            { name: "TERMS", href: "/terms" },
            { name: "PRIVACY", href: "/privacy" },
          ].map((item) => (
            <div key={item.name} className="relative py-1 group">
              <Link
                href={item.href}
                className="relative py-1 text-slate-600 hover:text-black text-xs font-semibold tracking-[0.08em] transition-colors duration-200 block cursor-pointer"
              >
                <span>{item.name}</span>
              </Link>
              <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-slate-800 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-250 ease-out" />
            </div>
          ))}
        </nav>

        {/* Right Action buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/?builder=true"
            onClick={handleBuilderClick}
            className="hidden sm:block px-4 py-2 bg-slate-900 hover:bg-black text-white font-semibold text-xs rounded-xl tracking-wide transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-sm border border-slate-800/10 text-center"
          >
            Get Started
          </Link>
          <Link
            href="/?builder=true"
            onClick={handleBuilderClick}
            className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:border-slate-800 transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center text-xs font-bold text-slate-700 hover:text-black cursor-pointer shadow-sm text-center"
          >
            D
          </Link>
        </div>
      </div>
    </header>
  );
}

// 2. HOW IT WORKS (3 steps)
export function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Describe Your Website",
      desc: "Type a single prompt explaining your brand, color ideas, and layout needs in plain English.",
      icon: <Pencil className="w-4 h-4 text-white" />,
    },
    {
      num: "02",
      title: "AI Builds It Instantly",
      desc: "Our engine writes semantic code, crafts layouts, compiles custom assets, and designs typography instantly.",
      icon: <Sparkles className="w-4 h-4 text-white" />,
    },
    {
      num: "03",
      title: "Publish & Go Live",
      desc: "One click hosts your site on global CDNs with custom domains, automatic SSL, and lightspeed speeds.",
      icon: <Rocket className="w-4 h-4 text-white" />,
    },
  ];

  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden bg-[#fafafc] border-t border-slate-100 gsap-pinned-steps-container">
      <div className="max-w-6xl mx-auto px-6 relative z-10 flex flex-col lg:flex-row gap-16">

        {/* Left Side: Title Pins */}
        <div className="lg:w-1/3 flex flex-col justify-start lg:sticky lg:top-32 h-fit">
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-500 border border-slate-200 px-3 py-1 rounded-full bg-white shadow-sm w-fit">
            Process
          </span>
          <h2 className="font-display text-4xl md:text-6xl text-slate-900 mt-4 mb-4 tracking-wider uppercase">
            Fluid <span className="text-red-vivid">Aesthetic Compiler</span>
          </h2>
          <p className="text-slate-500 font-sans font-light text-sm md:text-base leading-relaxed">
            A frictionless pipeline from your raw imagination to global production in under 30 seconds.
          </p>

          {/* SVG timeline drawing connector */}
          <div className="hidden lg:block w-full h-20 mt-12 gsap-svg-line overflow-visible">
            <svg className="w-full h-full overflow-visible" fill="none" viewBox="0 0 200 40">
              <path
                d="M10,10 C50,40 100,0 190,30"
                stroke="rgba(232,35,42,0.2)"
                strokeWidth="2"
                strokeDasharray="6 4"
                className="gsap-timeline-path"
              />
            </svg>
          </div>
        </div>

        {/* Right Side: Steps Scroll & Highlight */}
        <div className="lg:w-2/3 flex flex-col gap-8">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className={`gsap-step-${idx + 1} bg-white border border-slate-200/80 p-8 flex flex-col items-start relative z-10 rounded-2xl transition-all duration-300 group hover:border-red-vivid/40 hover:shadow-[0_12px_36px_rgba(232,35,42,0.06)]`}
            >
              {/* Ghost background number */}
              <span className="absolute right-4 bottom-2 font-display text-7xl text-slate-100 font-bold select-none z-0 group-hover:text-red-vivid/5 transition-colors">
                {step.num}
              </span>

              <div className="flex justify-between items-center w-full mb-6 relative z-10">
                <div className="w-10 h-10 rounded-full bg-red-vivid flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(232,35,42,0.2)]">
                  {step.icon}
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2 font-sans relative z-10">
                {step.title}
              </h3>
              <p className="text-slate-500 font-sans text-xs font-light leading-relaxed relative z-10">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

// 3. BENTO GRID (Features)
export function FeaturesGrid() {
  const features = [
    {
      title: "AI App Builder",
      label: "Autonomous Synthesis",
      desc: "Turn your ideas into production-ready web applications instantly. Describe your app structure, functionality, and styling in natural language and watch the AI compiler write clean, structured code.",
      badge: "✦ Core Core Engine",
      widget: (
        <div className="w-full max-w-sm bg-white/5 border border-white/10 rounded-2xl p-5 shadow-2xl backdrop-blur-md select-none hover:-translate-y-1 hover:border-white/20 transition-all duration-300">
          <div className="flex items-center gap-1.5 pb-3 border-b border-white/5 mb-4">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          </div>
          <div className="bg-white/5 border border-white/5 rounded-xl p-3 mb-3.5">
            <span className="text-[10px] text-slate-400 font-mono block mb-1 uppercase">Prompt Input</span>
            <p className="text-xs text-white font-sans font-light leading-relaxed">
              "Create a sleek dark analytics dashboard for developer telemetry"
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[9px] font-mono text-slate-400">
              <span>COMPILING COMPONENTS</span>
              <span className="text-green-400 animate-pulse">active</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="h-10 bg-white/5 border border-white/5 rounded-lg flex flex-col justify-center items-center p-1 text-center">
                <span className="text-[8px] font-mono text-slate-500">SIDEBAR</span>
                <span className="text-[9px] text-white font-semibold">✓ Ready</span>
              </div>
              <div className="col-span-2 h-10 bg-red-vivid/10 border border-red-vivid/20 rounded-lg flex flex-col justify-center items-center p-1 text-center">
                <span className="text-[8px] font-mono text-red-vivid">CHARTS</span>
                <span className="text-[9px] text-red-vivid font-semibold">Generating...</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Real-time Preview",
      label: "Visual Sync",
      desc: "Watch your changes happen live. The integrated compiler renders your app side-by-side with your code editor in real-time, allowing you to preview layout adjustments, themes, and interactions instantly.",
      badge: "● Live Rendering",
      widget: (
        <div className="w-full max-w-sm bg-white/5 border border-white/10 rounded-2xl p-5 shadow-2xl backdrop-blur-md select-none hover:-translate-y-1 hover:border-white/20 transition-all duration-300">
          <div className="grid grid-cols-2 gap-3 h-[140px]">
            <div className="bg-black/40 border border-white/5 rounded-xl p-3 font-mono text-[8px] text-slate-400 overflow-hidden flex flex-col gap-1.5 text-left">
              <div className="flex items-center justify-between text-[7px] text-slate-500 border-b border-white/5 pb-1">
                <span>INDEX.HTML</span>
                <span className="text-blue-400">EDITING</span>
              </div>
              <div className="space-y-1 leading-normal font-light">
                <div><span className="text-purple-400">&lt;div</span> <span className="text-orange-400">class</span>=<span className="text-emerald-400">"card"</span><span className="text-purple-400">&gt;</span></div>
                <div className="pl-2"><span className="text-purple-400">&lt;h1&gt;</span><span className="text-white">Sage Coffee</span><span className="text-purple-400">&lt;/h1&gt;</span></div>
                <div className="pl-2"><span className="text-purple-400">&lt;p&gt;</span><span className="text-white">Slow roast...</span><span className="text-purple-400">&lt;/p&gt;</span></div>
                <div><span className="text-purple-400">&lt;/div&gt;</span></div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-3 flex flex-col justify-between text-left shadow-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-tr from-amber-500/5 to-emerald-500/5 pointer-events-none" />
              <div className="flex justify-between items-center text-[7px] font-semibold text-stone-400 border-b pb-1.5">
                <span className="italic font-serif text-stone-800">Sage & Bean</span>
                <span>Menu</span>
              </div>
              <div className="my-auto">
                <h4 className="font-serif italic font-bold text-[10px] text-stone-800 leading-tight">Sage Coffee</h4>
                <p className="text-[7px] text-stone-500 leading-normal mt-0.5">Slow roasted organic coffee beans served with cardamoms.</p>
              </div>
              <div className="text-[7px] font-bold text-center bg-stone-900 text-white rounded-md py-1">Order Online</div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "One-click Deployment",
      label: "Edge Execution",
      desc: "Ship your application to edge networks globally with a single click. Velvet configures and deploys static assets instantly, ensuring ultra-low latency, custom domain routing, and automated SSL.",
      badge: "✓ Edge Global",
      widget: (
        <div className="w-full max-w-sm bg-white/5 border border-white/10 rounded-2xl p-5 shadow-2xl backdrop-blur-md select-none hover:-translate-y-1 hover:border-white/20 transition-all duration-300">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
              <span className="text-[10px] font-mono tracking-wider text-slate-400">DEPLOYMENT STATUS</span>
              <span className="flex items-center gap-1 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full px-2 py-0.5 text-[8px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                LIVE
              </span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-slate-400">Project Endpoint</span>
                <span className="font-mono text-white text-[10px]">velvet-telemetry-cf2a.ai</span>
              </div>
              <div className="bg-black/30 border border-white/5 rounded-xl p-3 font-mono text-[9px] text-slate-400 space-y-1 text-left leading-normal font-light">
                <div className="text-emerald-400">✓ Optimization pass completed (0.4s)</div>
                <div className="text-emerald-400">✓ Assets uploaded to Global CDN edge routes</div>
                <div className="text-white flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-blue-400 animate-ping" />
                  Active routing propagation...
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Multi-model AI Support",
      label: "Dynamic Compiler Backends",
      desc: "Harness the power of leading LLMs. Toggle dynamically between Gemini 3.5, Claude 3.5 Sonnet, and GPT-4o to compile code, refine styles, or optimize layouts based on your preference.",
      badge: "✦ Model Choice",
      widget: (
        <div className="w-full max-w-sm bg-white/5 border border-white/10 rounded-2xl p-5 shadow-2xl backdrop-blur-md select-none hover:-translate-y-1 hover:border-white/20 transition-all duration-300">
          <div className="flex flex-col gap-2.5 text-left">
            <span className="text-[10px] font-mono tracking-wider text-slate-400 border-b border-white/5 pb-2.5 block">
              SELECT COMPILER BACKEND
            </span>
            <div className="space-y-2">
              <div className="flex items-center justify-between bg-white/10 border border-white/20 rounded-xl px-3.5 py-2.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-semibold text-white">Gemini 3.5 Flash</span>
                </div>
                <span className="text-[9px] bg-red-vivid/20 border border-red-vivid/30 text-red-vivid rounded-full px-2 py-0.5 font-bold uppercase tracking-wider">
                  ACTIVE
                </span>
              </div>
              <div className="flex items-center justify-between bg-white/5 border border-white/5 rounded-xl px-3.5 py-2.5 opacity-60">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-400/80" />
                  <span className="text-xs font-semibold text-slate-300">Claude 3.5 Sonnet</span>
                </div>
              </div>
              <div className="flex items-center justify-between bg-white/5 border border-white/5 rounded-xl px-3.5 py-2.5 opacity-60">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                  <span className="text-xs font-semibold text-slate-300">GPT-4o</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <section id="features" className="py-28 relative overflow-hidden bg-[#09090b] text-white border-t border-b border-white/10">
      {/* Decorative background grid and lighting */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_60%,transparent_100%)] opacity-[0.02] pointer-events-none" />
      
      {/* Background glow effects */}
      <div
        className="absolute pointer-events-none opacity-20"
        style={{
          position: "absolute",
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "800px",
          height: "400px",
          background: "radial-gradient(circle, rgba(232,35,42,0.15) 0%, transparent 70%)",
          borderRadius: "9999px",
          filter: "blur(60px)",
        }}
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-24">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#888888] border border-white/10 px-3 py-1 rounded-full bg-white/5 shadow-sm">
            Capabilities
          </span>
          <h2 className="font-display text-4xl md:text-6xl text-white mt-5 mb-4 tracking-wider uppercase">
            Bespoke <span className="text-red-vivid">AI features</span>
          </h2>
          <p className="text-slate-400 font-sans font-light text-sm md:text-base leading-relaxed">
            Experience complete design and compile autonomy with our core platform features.
          </p>
        </div>

        {/* Alternating Feature Blocks */}
        <div className="flex flex-col gap-28 md:gap-36 gsap-stagger-container">
          {features.map((feat, i) => (
            <div
              key={feat.title}
              className={`flex flex-col ${
                i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              } items-center gap-12 md:gap-20 w-full gsap-stagger-item`}
            >
              {/* Text Info Column */}
              <div className="w-full md:w-1/2 flex flex-col items-start text-left">
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.22em] text-red-vivid mb-3 block">
                  {feat.label}
                </span>
                <h3 className="text-2xl md:text-4xl font-display uppercase tracking-wide text-white mb-4">
                  {feat.title}
                </h3>
                <p className="text-slate-400 font-sans text-sm md:text-base font-light leading-relaxed mb-6">
                  {feat.desc}
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/5 rounded-full text-[10px] font-mono text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-vivid" />
                  {feat.badge}
                </div>
              </div>

              {/* UI Preview Card Column */}
              <div className="w-full md:w-1/2 flex justify-center items-center">
                {feat.widget}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// 4. PREVIEW MOCKUPS (The actual site templates shown in the builder sandbox)
export function SaasMockup({ state }: { state: BuilderState }) {
  const isDark = state.theme === "dark";

  return (
    <div
      className={`w-full h-full font-sans transition-colors duration-300 ${isDark ? "bg-black-base text-slate-100" : "bg-[#f9fafb] text-slate-800"
        } p-6 flex flex-col gap-6 overflow-y-auto`}
    >
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4 border-white/5">
        <span className={`font-serif italic text-lg ${isDark ? "text-white" : "text-black"}`}>
          {state.siteName || "aura.io"}
        </span>
        <button
          className={`text-xs px-3.5 py-1.5 rounded-full font-medium ${isDark ? "bg-red-vivid text-white" : "bg-black text-white"
            }`}
        >
          Get Started
        </button>
      </div>

      {/* Hero content */}
      <div className="text-center py-6">
        <h1
          className={`text-2xl md:text-3xl ${state.typography === "display" ? "font-display tracking-wide uppercase" : "font-sans font-bold"
            } mb-3`}
        >
          {state.siteDescription || "Simplify your team operations."}
        </h1>
        <p className={`text-xs max-w-sm mx-auto ${isDark ? "text-slate-400" : "text-slate-500"} mb-4`}>
          The luxury SaaS solution for project management, metric aggregation, and direct pipeline automation.
        </p>
        <div className="flex gap-2 justify-center">
          <span className="w-3 h-3 rounded-full bg-red-vivid"></span>
          <span className="w-3 h-3 rounded-full bg-slate-500"></span>
        </div>
      </div>

      {/* Mini dashboard grid */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Active Users", value: "24.8k", change: "+12%" },
          { label: "Revenue", value: "$41,000", change: "+4%" },
          { label: "Conversion", value: "3.48%", change: "+24%" },
        ].map((stat, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg border ${isDark ? "bg-black-surface/40 border-white/5" : "bg-white border-slate-200"
              }`}
          >
            <span className="text-[10px] text-slate-400 block mb-1">{stat.label}</span>
            <span className={`text-sm font-semibold block ${isDark ? "text-white" : "text-black"}`}>
              {stat.value}
            </span>
            <span className="text-[9px] text-green-stat font-medium">{stat.change}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PortfolioMockup({ state }: { state: BuilderState }) {
  const isDark = state.theme === "dark";
  return (
    <div
      className={`w-full h-full transition-colors duration-300 ${isDark ? "bg-black text-[#eee]" : "bg-white text-[#111]"
        } p-8 flex flex-col justify-between overflow-y-auto`}
    >
      <div className="flex justify-between items-center text-xs font-mono uppercase tracking-wider mb-6 opacity-70">
        <span>{state.siteName || "elena vance"}</span>
        <span>©2026 // Designer</span>
      </div>

      <div className="my-auto max-w-sm">
        <h1
          className={`text-2xl md:text-3xl ${state.typography === "display" ? "font-display tracking-wide uppercase" : "font-sans font-medium"
            } leading-tight mb-4`}
        >
          {state.siteDescription || "Design is the structural integrity of digital things."}
        </h1>
        <p className="text-xs font-mono opacity-60 leading-relaxed mb-6">
          Focused on minimal interactive layouts, CSS grids, and luxury software design. Currently partner at Velvet.
        </p>
        <a href="#" className="inline-flex items-center gap-2 text-xs font-mono uppercase border-b pb-1">
          View Selected Work <ArrowRight className="w-3 h-3" />
        </a>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-slate-500/10">
        <div>
          <span className="text-[9px] font-mono opacity-50 block uppercase">Previously</span>
          <span className="text-xs font-medium">Lead Designer at Stripe</span>
        </div>
        <div>
          <span className="text-[9px] font-mono opacity-50 block uppercase">Focus</span>
          <span className="text-xs font-medium">Bespoke Design Systems</span>
        </div>
      </div>
    </div>
  );
}

export function CafeMockup({ state }: { state: BuilderState }) {
  const isDark = state.theme === "dark";
  return (
    <div
      className={`w-full h-full transition-colors duration-300 ${isDark ? "bg-[#1d1f19] text-[#e8e4db]" : "bg-[#FAF8F5] text-[#2c2b29]"
        } p-6 flex flex-col justify-between overflow-y-auto`}
    >
      {/* Navbar */}
      <div className="flex justify-between items-center border-b pb-4 border-stone-500/10">
        <span className="font-serif italic font-semibold text-lg">
          {state.siteName || "Sage & Bean"}
        </span>
        <div className="flex gap-4 text-xs font-sans font-light">
          <span>Menu</span>
          <span>Locations</span>
        </div>
      </div>

      {/* Main heading */}
      <div className="text-center py-8 max-w-sm mx-auto">
        <h1
          className={`text-2xl md:text-3xl ${state.typography === "display" ? "font-display tracking-wide uppercase" : "font-sans font-extrabold"
            } leading-snug mb-4`}
        >
          {state.siteDescription || "Slow roasted. Organic. Served with intention."}
        </h1>
        <span className="text-xs uppercase tracking-widest px-3 py-1 border border-stone-500/30 rounded-full font-light">
          Order Online
        </span>
      </div>

      {/* Items list */}
      <div className="grid grid-cols-2 gap-4 text-xs font-sans border-t pt-4 border-stone-500/10">
        <div>
          <span className="font-medium block">Matcha Rose Latte</span>
          <span className="opacity-60 text-[10px]">Stone-ground Uji matcha, rose infusion</span>
        </div>
        <div>
          <span className="font-medium block">Cardamom Bun</span>
          <span className="opacity-60 text-[10px]">Overnight sourdough, Swedish pearls</span>
        </div>
      </div>
    </div>
  );
}

export function AgencyMockup({ state }: { state: BuilderState }) {
  const isDark = state.theme === "dark";
  return (
    <div
      className={`w-full h-full transition-colors duration-300 ${isDark ? "bg-[#0c0d12] text-slate-100" : "bg-[#f8fafc] text-slate-900"
        } p-8 flex flex-col justify-between overflow-y-auto`}
    >
      <div className="flex justify-between items-center text-xs font-bold tracking-widest mb-6">
        <span>{state.siteName || "NEXUS // CORE"}</span>
        <span className="w-2 h-2 rounded-full bg-rose-500"></span>
      </div>

      <div>
        <span className="text-xs text-rose-500 font-mono tracking-wider mb-2 block">// CAPABILITIES</span>
        <h1
          className={`text-3xl md:text-4xl ${state.typography === "display" ? "font-display tracking-wide uppercase" : "font-sans font-black tracking-tight"
            } leading-none mb-6`}
        >
          {state.siteDescription || "Designing heavy gravity systems."}
        </h1>
        <div className="grid grid-cols-2 gap-4 text-xs opacity-75 font-sans">
          <div className="p-3 bg-slate-500/5 rounded-lg border border-slate-500/10">
            <span className="font-semibold block mb-1">01 / Interaction</span>
            Interactive graphics, WebGL builds, high-fidelity mockups.
          </div>
          <div className="p-3 bg-slate-500/5 rounded-lg border border-slate-500/10">
            <span className="font-semibold block mb-1">02 / Branding</span>
            Developing cohesive premium brands for emerging AI teams.
          </div>
        </div>
      </div>

      <button className="w-full mt-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs rounded-md transition-colors">
        Initiate Project Build
      </button>
    </div>
  );
}

interface BuilderPreviewProps {
  initialPrompt?: string;
}

export function BuilderPreview({ initialPrompt = "" }: BuilderPreviewProps) {
  const [prompt, setPrompt] = useState("");
  const [html, setHtml] = useState("");
  const [isCompiling, setIsCompiling] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isCodeReview, setIsCodeReview] = useState(false);
  const [previewMode, setPreviewMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Trigger generation if initialPrompt is passed from the hero
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim().length >= 5) {
      setPrompt(initialPrompt);
      handleGenerate(initialPrompt);
    }
  }, [initialPrompt]);

  // Clean up timers and abort fetch on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, []);

  const handleGenerate = async (promptToUse: string) => {
    if (!promptToUse.trim()) return;
    if (promptToUse.trim().length < 5) {
      setError("Prompt too short. Please enter at least 5 characters.");
      return;
    }

    // Cancel any previous requests/timers
    if (abortControllerRef.current) abortControllerRef.current.abort();
    if (timerRef.current) clearInterval(timerRef.current);

    setIsCompiling(true);
    setError(null);
    setHtml("");
    setElapsedTime(0);

    // Start timer
    const startTime = Date.now();
    timerRef.current = setInterval(() => {
      setElapsedTime(parseFloat(((Date.now() - startTime) / 1000).toFixed(1)));
    }, 100);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: promptToUse }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed with status ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No readable stream received from API.");
      }

      const decoder = new TextDecoder();
      let done = false;
      let accumulatedHtml = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value);
          accumulatedHtml += chunk;
          setHtml(accumulatedHtml);
        }
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setError(err.message || "An unexpected error occurred during generation.");
      }
    } finally {
      setIsCompiling(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "generated-website.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Helper to determine status messages during build
  const getBuildStatusMessage = () => {
    if (!isCompiling) return "";
    if (elapsedTime < 3) return "Establishing connection with Qwen Coder model...";
    if (elapsedTime < 7) return "Analyzing request requirements & structure...";
    if (elapsedTime < 14) return "Generating semantic HTML & layouts...";
    if (elapsedTime < 25) return "Styling layout assets with custom CSS styles...";
    return "Polishing client-side scripting and fonts...";
  };

  return (
    <section id="builder-demo" className="py-24 bg-[#f8fafc] border-t border-b border-slate-100 relative overflow-hidden">
      {/* Decorative background grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">

        {/* Workspace Title Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-xl">
            <span className="text-[10px] font-mono font-bold tracking-[0.22em] text-blue-500 uppercase block mb-3">
              VELVET WORKSPACE
            </span>
            <h2 className="font-display text-3xl md:text-5xl text-slate-800 leading-tight uppercase">
              Web <span className="font-serif italic font-normal text-slate-600" style={{ fontFamily: 'Georgia, serif' }}>sandbox</span> preview
            </h2>
            <p className="text-slate-500 text-sm font-sans font-light leading-relaxed mt-3">
              Describe your website requirements, and watch our compiler assemble standard-compliant layouts, style rules, and scripts in real-time.
            </p>
          </div>

          {/* Quick suggestions/templates tags row */}
          <div className="flex flex-wrap gap-2 text-xs font-sans font-semibold">
            <span className="text-slate-400 self-center mr-1">Try:</span>
            {[
              "Personal trainer bio page",
              "SaaS dashboard with stats table",
              "Local pizza restaurant with menu",
              "Minimal design agency portfolio"
            ].map((tag) => (
              <button
                key={tag}
                disabled={isCompiling}
                onClick={() => {
                  setPrompt(tag);
                  handleGenerate(tag);
                }}
                className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 rounded-lg cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* PROMPT INPUT BAR */}
        <div className="w-full bg-white border border-slate-200/80 rounded-2xl p-3 flex items-center gap-3 shadow-[0_12px_30px_rgba(0,0,0,0.03)] hover:border-slate-300 transition-colors mb-8">
          <div className="flex-1 flex items-center gap-2 px-2">
            <Globe className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isCompiling) {
                  handleGenerate(prompt);
                }
              }}
              placeholder="What website do you want to generate? (e.g. A gorgeous aesthetic page for a coffee shop)"
              className="w-full bg-transparent border-none text-slate-700 placeholder-slate-400 focus:outline-none text-sm font-sans leading-relaxed"
              disabled={isCompiling}
            />
          </div>
          <button
            onClick={() => handleGenerate(prompt)}
            disabled={isCompiling || !prompt.trim()}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-200 text-white disabled:text-slate-400 font-sans font-bold text-xs rounded-xl shadow-md disabled:shadow-none hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:cursor-not-allowed transition-all"
          >
            {isCompiling ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Build Site</span>
              </>
            )}
          </button>
        </div>

        {/* WORKSPACE CONTROL CONTAINER */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_15px_50px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col min-h-[680px]">

          {/* Dashboard Header Bar */}
          <div className="bg-slate-50 border-b border-slate-200/60 px-6 py-4 flex flex-wrap items-center justify-between gap-4">

            {/* Status indicator */}
            <div className="flex items-center gap-3">
              <span className={`w-2.5 h-2.5 rounded-full ${isCompiling
                ? "bg-blue-500 animate-pulse"
                : error
                  ? "bg-rose-500"
                  : html
                    ? "bg-emerald-500"
                    : "bg-slate-300"
                }`} />
              <div className="flex flex-col text-left">
                <span className="text-xs font-sans font-bold text-slate-700 uppercase tracking-wider">
                  {isCompiling
                    ? `Generating site (${elapsedTime.toFixed(1)}s)`
                    : error
                      ? "Error occurred"
                      : html
                        ? "Workspace live"
                        : "Workspace idle"
                  }
                </span>
                {isCompiling && (
                  <span className="text-[10px] text-slate-400 font-sans mt-0.5 animate-pulse">
                    {getBuildStatusMessage()}
                  </span>
                )}
              </div>
            </div>

            {/* Responsive Mode Controls */}
            {html && !error && (
              <div className="flex items-center bg-slate-200/50 border border-slate-200 rounded-xl p-1 gap-1">
                {[
                  { id: "desktop", label: "Desktop", icon: Laptop },
                  { id: "tablet", label: "Tablet", icon: Tablet },
                  { id: "mobile", label: "Mobile", icon: Smartphone }
                ].map((mode) => {
                  const Icon = mode.icon;
                  return (
                    <button
                      key={mode.id}
                      onClick={() => setPreviewMode(mode.id as any)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${previewMode === mode.id
                        ? "bg-white text-slate-800 shadow-sm border border-slate-200/40"
                        : "text-slate-500 hover:text-slate-800 hover:bg-white/40"
                        }`}
                      title={`${mode.label} View`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{mode.label}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Right side actions */}
            <div className="flex items-center gap-2">
              {html && !error && (
                <>
                  <button
                    onClick={() => setIsCodeReview(!isCodeReview)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border cursor-pointer transition-all ${isCodeReview
                      ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>{isCodeReview ? "Close Editor" : "Edit Code"}</span>
                  </button>

                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-semibold cursor-pointer transition-all"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy HTML</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold cursor-pointer transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </>
              )}
            </div>

          </div>

          {/* MAIN PREVIEW / COMPILER WINDOW CONTAINER */}
          <div className="flex-1 flex flex-col bg-slate-100 relative min-h-[500px]">
            {error ? (
              /* Error State Screen */
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-white text-center">
                <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center mb-4 text-rose-500">
                  <X className="w-6 h-6 stroke-[2.5]" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 font-sans mb-2">Compilation Failed</h3>
                <p className="text-slate-500 text-sm max-w-md leading-relaxed font-sans mb-6">
                  {error}
                </p>
                <button
                  onClick={() => handleGenerate(prompt)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-all cursor-pointer"
                >
                  Retry Build
                </button>
              </div>
            ) : isCodeReview && html ? (
              /* Code review split layout */
              <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 min-h-[500px]">
                {/* Source Code text editor */}
                <div className="flex flex-col h-full bg-[#0b0f19] relative min-h-[250px] lg:min-h-0">
                  <div className="bg-[#111827] border-b border-slate-800/80 px-4 py-2 flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">
                      HTML/CSS Source (Editable)
                    </span>
                    <span className="text-[9px] font-mono text-slate-500">
                      Changes render instantly
                    </span>
                  </div>
                  <textarea
                    value={html}
                    onChange={(e) => setHtml(e.target.value)}
                    className="flex-1 w-full bg-[#0f172a] text-slate-200 p-4 font-mono text-xs focus:outline-none resize-none leading-relaxed overflow-y-auto min-h-[300px]"
                    spellCheck="false"
                  />
                </div>

                {/* Rendered Live Website Frame */}
                <div className="flex-1 flex flex-col h-full min-h-[250px] lg:min-h-0 bg-slate-100 p-4 justify-center items-center">
                  <div className="w-full h-full bg-white rounded-xl shadow-sm border border-slate-200/50 overflow-hidden">
                    <iframe
                      srcDoc={html}
                      title="Live Stream Sandbox Preview"
                      className="w-full h-full border-none bg-white"
                      sandbox="allow-scripts"
                    />
                  </div>
                </div>
              </div>
            ) : html ? (
              /* Regular workspace layout with optional sizing modes */
              <div className="flex-1 flex justify-center items-center p-6 bg-slate-100 min-h-[500px]">
                <div
                  className="w-full h-full bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden transition-all duration-300 flex flex-col relative"
                  style={{
                    maxWidth:
                      previewMode === "mobile"
                        ? "375px"
                        : previewMode === "tablet"
                          ? "768px"
                          : "100%",
                    height: "580px",
                  }}
                >
                  {/* Phone Bezel/Mockup header if in mobile mode */}
                  {previewMode === "mobile" && (
                    <div className="bg-slate-50 border-b border-slate-200/80 py-2.5 px-4 flex justify-between items-center text-[10px] font-mono text-slate-400 select-none shrink-0">
                      <span>LTE 4G</span>
                      <span className="font-bold text-slate-600">12:00 PM</span>
                      <span>100%</span>
                    </div>
                  )}
                  {/* Tablet Bezel/Mockup header if in tablet mode */}
                  {previewMode === "tablet" && (
                    <div className="bg-slate-50 border-b border-slate-200/80 py-2 px-4 flex gap-1.5 items-center shrink-0">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                      <div className="bg-white border border-slate-200/60 rounded-md text-[10px] text-slate-400 px-6 py-0.5 text-center flex-1 mx-8 font-sans max-w-sm truncate">
                        preview.velvet.ai/live-sandbox
                      </div>
                    </div>
                  )}

                  {/* Embedded Iframe Preview */}
                  <iframe
                    srcDoc={html}
                    title="Live Stream Sandbox Preview"
                    className="w-full flex-1 border-none bg-white"
                    sandbox="allow-scripts"
                  />
                </div>
              </div>
            ) : (
              /* Empty state workspace screen */
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-white text-center">

                {isCompiling ? (
                  /* Loading Compile State Screen */
                  <div className="space-y-6 max-w-sm flex flex-col items-center animate-fade-up">
                    <div className="relative flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin" />
                      <Sparkles className="w-6 h-6 text-blue-500 absolute animate-pulse" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-base font-bold text-slate-800 font-sans">
                        Assembling code block...
                      </h3>
                      <p className="text-slate-400 text-xs font-sans max-w-xs leading-relaxed">
                        Compiling semantic structure, layouts, styles and interactivity weights.
                      </p>
                    </div>
                    {/* Tiny stats feedback block */}
                    <div className="bg-slate-50 border border-slate-200/60 rounded-xl px-4 py-2 font-mono text-[10px] text-slate-400">
                      TIME ELAPSED: {elapsedTime.toFixed(1)}s
                    </div>
                  </div>
                ) : (
                  /* Static Empty State Screen */
                  <div className="space-y-6 max-w-md flex flex-col items-center animate-fade-up">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500 shadow-sm">
                      <Code2 className="w-7 h-7" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-slate-800 font-sans">
                        Your Sandbox is ready
                      </h3>
                      <p className="text-slate-500 text-sm font-sans font-light max-w-sm leading-relaxed">
                        Enter a description of the site you want in the prompt input above to compile and view your web project.
                      </p>
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}

// 6. TESTIMONIALS COMPONENT — interactive drag-to-shuffle card stack

const TESTIMONIALS = [
  {
    id: 1,
    testimonial:
      "Velvet.ai completely shifted our prototyping speed. We spun up 5 landing variants in minutes. The markup was beautiful.",
    author: "Marcus Aurel · Lead Dev at Vesper",
  },
  {
    id: 2,
    testimonial:
      "I described my boutique in a simple paragraph, and Velvet gave me a layout with perfectly balanced tones and fonts. Breathtaking.",
    author: "Celine Zhang · Founder, Bloom Floral",
  },
  {
    id: 3,
    testimonial:
      "I've tried all the AI builders. Velvet is the only one that outputs custom systems that don't feel like stock templates.",
    author: "Devon Thorne · Product Lead, Aether",
  },
];

export function Testimonials() {
  const [positions, setPositions] = useState<Array<"front" | "middle" | "back">>(
    ["front", "middle", "back"]
  );

  const handleShuffle = () => {
    setPositions((prev) => {
      const next = [...prev] as Array<"front" | "middle" | "back">;
      next.unshift(next.pop()!);
      return next;
    });
  };

  return (
    <section
      id="showcase"
      className="py-28 relative overflow-hidden bg-[#07070a] border-t border-white/5"
    >
      {/* Subtle radial glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(232,35,42,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Section header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-20">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#888] border border-white/10 px-3 py-1 rounded-full bg-white/5 shadow-sm">
            Testimonials
          </span>
          <h2 className="font-display text-4xl md:text-6xl text-white mt-5 mb-4 tracking-wider uppercase">
            Validated by{" "}
            <span className="text-red-vivid">creative minds</span>
          </h2>
          <p className="text-slate-400 font-sans font-light text-sm md:text-base leading-relaxed">
            See how modern creators and web engineers use Velvet.ai to rapidly
            deploy high-end online experiences.
          </p>
        </div>

        {/* Card stack + instructions */}
        <div className="flex flex-col items-center gap-10">
          {/* Drag hint */}
          <p className="text-xs text-slate-500 font-mono tracking-widest uppercase select-none">
            ← drag the front card to shuffle
          </p>

          {/* Card stack */}
          <div className="relative h-[450px] w-[350px]">
            {TESTIMONIALS.map((t, index) => (
              <TestimonialCard
                key={t.id}
                {...t}
                handleShuffle={handleShuffle}
                position={positions[index]}
              />
            ))}
          </div>

          {/* Dot indicators */}
          <div className="flex gap-2 mt-4">
            {TESTIMONIALS.map((_, i) => (
              <span
                key={i}
                className={`block rounded-full transition-all duration-300 ${
                  positions[0] === (["front", "middle", "back"][i] as "front" | "middle" | "back")
                    ? "w-5 h-1.5 bg-red-vivid"
                    : "w-1.5 h-1.5 bg-white/20"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


// 7. PRICING COMPONENT
export function Pricing() {
  const [annual, setAnnual] = useState(false);

  const plans = [
    {
      name: "Starter",
      price: annual ? 0 : 0,
      desc: "Perfect for testing ideas and launching personal portfolios.",
      features: [
        "1 Generated Website",
        "Velvet sub-domain deployment",
        "Standard layout engine rules",
        "Responsive design exports",
      ],
      cta: "Start Free",
      highlight: false,
    },
    {
      name: "Pro Designer",
      price: annual ? 16 : 24,
      desc: "Bespoke hosting, custom domains, and unlocked AI dials.",
      features: [
        "Unlimited Generated Websites",
        "Connect Custom Domains",
        "Remove Velvet Branding pill",
        "High-priority compilation speeds",
        "Unified Light / Dark theme toggles",
      ],
      cta: "Go Pro Now",
      highlight: true,
    },
    {
      name: "Enterprise Studio",
      price: annual ? 64 : 89,
      desc: "For studios managing multiple brand sites and custom integrations.",
      features: [
        "All Pro capabilities",
        "Collaborative workspaces (5 seats)",
        "Raw HTML/Next.js export files",
        "Dedicated compile server cores",
        "SSL custom verification paths",
      ],
      cta: "Contact Sales",
      highlight: false,
    },
  ];

  return (
    <section id="pricing" className="py-24 relative overflow-hidden bg-[#fafafc] border-t border-slate-100">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12 animate-fade-up">
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-500 border border-slate-200 px-3 py-1 rounded-full bg-white shadow-sm">
            Pricing plans
          </span>
          <h2 className="font-display text-4xl md:text-6xl text-slate-900 mt-4 mb-4 tracking-wider uppercase">
            Fair Tiers For <span className="text-red-vivid">Every Scale</span>
          </h2>

          {/* Annual Toggle */}
          <div className="inline-flex items-center gap-3 bg-white border border-slate-200 p-1.5 rounded-full mt-4 shadow-sm">
            <button
              onClick={() => setAnnual(false)}
              className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all cursor-pointer ${!annual ? "bg-slate-900 text-white shadow-sm" : "text-slate-400 hover:text-slate-800"
                }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all cursor-pointer ${annual ? "bg-slate-900 text-white shadow-sm" : "text-slate-400 hover:text-slate-800"
                }`}
            >
              Annually <span className="text-[10px] text-green-stat font-extrabold ml-1">Save 30%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto gsap-stagger-container">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`bg-white border rounded-2xl p-8 flex flex-col justify-between gap-8 relative transition-all duration-300 gsap-stagger-item ${plan.highlight
                ? "border-red-vivid shadow-[0_15px_45px_rgba(232,35,42,0.08)] scale-[1.02]"
                : "border-slate-200 hover:border-slate-300 shadow-sm"
                }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-red-vivid text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-md">
                  Most Popular
                </span>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 font-sans">{plan.name}</h3>
                  <p className="text-xs text-slate-400 font-sans font-light mt-1.5 leading-relaxed">
                    {plan.desc}
                  </p>
                </div>

                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-display text-slate-800">$</span>
                  <span className="text-5xl font-display text-slate-800 tracking-tight">{plan.price}</span>
                  <span className="text-xs text-slate-400 font-sans font-light">/ month</span>
                </div>

                {/* Features list */}
                <ul className="space-y-3 pt-6 border-t border-slate-100">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-3 text-xs text-slate-500 font-sans font-light">
                      <Check className="w-3.5 h-3.5 text-red-vivid mt-0.5 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {plan.highlight ? (
                <button className="w-full py-3 bg-red-vivid hover:bg-red-mid text-white text-xs font-semibold rounded-full tracking-wider transition-all duration-300 shadow-[0_4px_20px_rgba(232,35,42,0.15)] cursor-pointer">
                  {plan.cta}
                </button>
              ) : (
                <button className="w-full py-3 bg-transparent hover:bg-slate-50 text-slate-600 border border-slate-300 text-xs font-semibold rounded-full tracking-wider transition-all duration-300 cursor-pointer">
                  {plan.cta}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// 8. FOOTER COMPONENT
export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 pt-20 pb-10 relative overflow-hidden text-slate-900">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-16">
          {/* Logo & Info */}
          <div className="col-span-2 space-y-4">
            <span className="font-display text-2xl tracking-wider text-slate-800">
              velvet<span className="text-red-vivid">.ai</span>
            </span>
            <p className="text-slate-500 font-sans font-light text-xs max-w-xs leading-relaxed">
              Bespoke digital design compiler. Velvet creates and deploys premium SaaS, portfolio, and creative storefronts using artificial intelligence.
            </p>
            {/* Social Icons row */}
            <div className="flex flex-wrap gap-2 pt-2">
              {/* Twitter/X */}
              <a
                href="#"
                aria-label="X (formerly Twitter)"
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:text-black hover:bg-slate-200 transition-colors shadow-sm"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              {/* LinkedIn */}
              <a
                href="#"
                aria-label="LinkedIn"
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:text-black hover:bg-slate-200 transition-colors shadow-sm"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              {/* Discord */}
              <a
                href="#"
                aria-label="Discord"
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:text-black hover:bg-slate-200 transition-colors shadow-sm"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.195.373.289a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z" />
                </svg>
              </a>
              {/* Reddit */}
              <a
                href="#"
                aria-label="Reddit"
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:text-black hover:bg-slate-200 transition-colors shadow-sm"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-.765 1.151c.056.122.094.253.112.394 1.13.075 2.16.488 2.87 1.125.132-.075.28-.122.44-.122.47 0 .85.38.85.85a.843.843 0 0 1-.582.806c.01.122.01.244.01.375 0 2.625-3.11 4.753-6.93 4.753-3.83 0-6.94-2.128-6.94-4.753 0-.131 0-.253.01-.375a.853.853 0 0 1-.58-.806c0-.47.38-.85.85-.85.16 0 .307.047.439.122.712-.637 1.743-1.05 2.876-1.125.018-.14.056-.272.112-.394a1.25 1.25 0 0 1-.764-1.15c0-.689.56-1.25 1.25-1.25.468 0 .872.262 1.087.647.787-.272 1.706-.44 2.7-.488l.618-2.91 1.987.422c.046-.28.28-.5.57-.5zm-7.668 4.763c-.806 0-1.462.656-1.462 1.462 0 .806.656 1.462 1.462 1.462.806 0 1.462-.656 1.462-1.462 0-.806-.656-1.462-1.462-1.462zm5.337 0c-.806 0-1.462.656-1.462 1.462 0 .806.656 1.462 1.462 1.462.806 0 1.462-.656 1.462-1.462 0-.806-.656-1.462-1.462-1.462zm-5.074 4.303a4.896 4.896 0 0 0 4.81 0c.131-.038.272.037.31.168.037.132-.038.272-.169.31a5.432 5.432 0 0 1-5.113 0c-.13-.038-.206-.178-.168-.31.037-.13.178-.206.31-.168z" />
                </svg>
              </a>
              {/* Instagram */}
              <a
                href="#"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:text-black hover:bg-slate-200 transition-colors shadow-sm"
              >
                <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              {/* YouTube */}
              <a
                href="#"
                aria-label="YouTube"
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:text-black hover:bg-slate-200 transition-colors shadow-sm"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links columns */}
          {[
            {
              title: "Product",
              links: [
                { label: "AI Compiler", href: "#" },
                { label: "Live Editor", href: "#" },
                { label: "Pricing Plans", href: "/#pricing" },
                { label: "Deploy Specs", href: "#" }
              ],
            },
            {
              title: "Company",
              links: [
                { label: "About Us", href: "#" },
                { label: "Work with us", href: "#" },
                { label: "Design Ethics", href: "#" },
                { label: "Brand Kit", href: "#" }
              ],
            },
            {
              title: "Resources",
              links: [
                { label: "FAQ", href: "/faq" },
                { label: "Documentation", href: "#" },
                { label: "Community Forum", href: "#" },
                { label: "Status Panel", href: "#" }
              ],
            },
            {
              title: "Legal",
              links: [
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Use", href: "/terms" },
                { label: "GDPR Compliance", href: "#" },
                { label: "Cookies", href: "#" }
              ],
            },
          ].map((col, idx) => (
            <div key={idx} className="col-span-1 space-y-4">
              <h4 className="text-[10px] font-bold tracking-widest uppercase text-slate-800">
                {col.title}
              </h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-slate-500 hover:text-black text-xs font-sans font-light transition-colors"
                    >
                      {col.title === "Legal" && link.label === "Terms of Use" ? "Terms of Service" : link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
          <span className="text-[10px] font-mono text-slate-400">
            © 2026 Velvet Technology Corp. All rights reserved.
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            Designed and built by Velvet.
          </span>
        </div>

        {/* Giant brand watermark text at bottom */}
        <div className="mt-8 w-full select-none pointer-events-none text-center relative z-0">
          <h2 className="text-[22vw] font-display font-extrabold tracking-[0.05em]leading-none bg-linear-to-t from-red-500/60 via-rose-500/20 to-transparent bg-clip-text text-transparent uppercase -mb-10 md:-mb-20">
            VELVET.AI
          </h2>
        </div>
      </div>
    </footer>
  );
}
