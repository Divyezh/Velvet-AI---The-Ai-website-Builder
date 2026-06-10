"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Smartphone, Bot, Plus, Mic, ArrowUp, Shuffle } from "lucide-react";

export interface SuggestionItem {
  title: string;
  gradient: string; // Tailwind gradient colors e.g. "from-purple-500 to-blue-500"
  prompt: string;
}

// Pool of starting prompt suggestions
const SUGGESTION_POOL: SuggestionItem[] = [
  {
    title: "CRM for a salon",
    gradient: "from-purple-500 via-pink-500 to-blue-500",
    prompt: "A sleek dark CRM dashboard for a luxury beauty salon. Include appointment scheduling calendars, customer list tables, staff roster grids, active membership analytics charts, and a reservation booking widget."
  },
  {
    title: "Digital menu for a coffee shop",
    gradient: "from-green-500 via-yellow-500 to-red-500",
    prompt: "An elegant, warm-toned digital menu page for a specialty cafe. Clean typography, categories for handbrew options, bakery grid cards with descriptions and pricing, and checkout mockup."
  },
  {
    title: "Client gallery for a wedding photographer",
    gradient: "from-emerald-400 to-teal-600",
    prompt: "A clean high-fidelity client photography archive. Light theme, large serif typography, photo grids with interactive filter buttons, photographer biography, client testimonies, and session booking form."
  },
  {
    title: "SaaS dashboard for developer metrics",
    gradient: "from-indigo-500 to-purple-600",
    prompt: "A modern developer metrics tracking SaaS landing page. Dark theme, neon purple and indigo accents, live interactive telemetry graphs, database connections setup list, and pricing tier cards."
  },
  {
    title: "High-fidelity typography portfolio",
    gradient: "from-cyan-400 to-pink-500",
    prompt: "A minimal personal resume website styled with Bebas Neue and high contrast layout. Large headlines, horizontal scroll case study slider, client logotypes grid, and clean email contact fields."
  },
  {
    title: "Organic food delivery app",
    gradient: "from-amber-400 to-emerald-500",
    prompt: "A vibrant storefront website for a local organic farm delivery service. Bright, crisp card grids showing fresh vegetable bundles, custom subscription delivery schedules widget, and chef's recipe spotlight section."
  },
  {
    title: "Neon Brutalist Web3 startup",
    gradient: "from-rose-500 to-orange-500",
    prompt: "A heavy-contrast, cyber brutalist landing page for a Web3 compiler engine. Maximum border sizes, neon pink overlays, pulsating server statuses, raw terminal logs box, and build trigger actions."
  },
  {
    title: "Minimalist travel blog page",
    gradient: "from-blue-400 to-indigo-600",
    prompt: "A clean reader-friendly travel blog page. Light paper background theme, featured full-screen hero banner, latest posts grid with categories search filter, author bio widget, and newsletter signup box."
  }
];

interface BuilderChatboxProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  isGenerating: boolean;
  placeholder?: string;
  mode: "web" | "mobile";
  onModeChange?: (mode: "web" | "mobile") => void;
  layout?: "centered" | "sidebar";
}

export function BuilderChatbox({
  value,
  onChange,
  onSubmit,
  isGenerating,
  placeholder = "Describe your idea we will bring it to life..",
  mode,
  onModeChange,
  layout = "centered"
}: BuilderChatboxProps) {
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);

  // Select 3 random suggestions initially
  useEffect(() => {
    shuffleSuggestions();
  }, []);

  const shuffleSuggestions = () => {
    // Shuffle pool and slice top 3
    const shuffled = [...SUGGESTION_POOL].sort(() => 0.5 - Math.random());
    setSuggestions(shuffled.slice(0, 3));
  };

  const handleSuggestionClick = (prompt: string) => {
    onChange(prompt);
  };

  const isSidebar = layout === "sidebar";

  return (
    <div className={`w-full flex flex-col ${isSidebar ? "gap-3" : "gap-5 max-w-4xl mx-auto"} font-sans`}>
      {/* TABS HEADER */}
      <div className="flex items-end">
        <div className="flex bg-transparent">
          {/* Web App Tab */}
          <button
            type="button"
            disabled={isGenerating}
            onClick={() => onModeChange?.("web")}
            className={`flex items-center gap-2 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-t-xl transition-all duration-300 border-t border-x ${
              mode === "web"
                ? "bg-[#131316] text-white border-white/10 border-b-[#131316] z-10"
                : "bg-transparent text-[#666666] hover:text-neutral-300 border-transparent border-b-white/5 cursor-pointer"
            }`}
          >
            <Globe className={`w-4 h-4 ${mode === "web" ? "text-red-vivid" : "text-[#555]"}`} />
            <span>Web App</span>
          </button>

          {/* Mobile App Tab */}
          <button
            type="button"
            disabled={isGenerating}
            onClick={() => onModeChange?.("mobile")}
            className={`flex items-center gap-2 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-t-xl transition-all duration-300 border-t border-x ${
              mode === "mobile"
                ? "bg-[#131316] text-white border-white/10 border-b-[#131316] z-10"
                : "bg-transparent text-[#666666] hover:text-neutral-300 border-transparent border-b-white/5 cursor-pointer"
            }`}
          >
            <Smartphone className={`w-4 h-4 ${mode === "mobile" ? "text-red-vivid" : "text-[#555]"}`} />
            <span>Mobile App</span>
          </button>
        </div>

        {/* Muted line trailing the tabs */}
        <div className="flex-1 h-px bg-white/5 border-b border-white/5 self-end"></div>
      </div>

      {/* CHAT INPUT CONTAINER BOX */}
      <div
        className={`relative flex flex-col justify-between bg-[#131316] border border-white/10 rounded-b-2xl rounded-tr-2xl transition-all duration-300 ${
          isSidebar
            ? "p-4 min-h-[140px]"
            : "p-6 min-h-[180px] shadow-[0_24px_60px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.02)]"
        } focus-within:border-red-vivid/40 focus-within:shadow-[0_0_32px_rgba(232,35,42,0.08)]`}
      >
        <div className="flex items-start gap-4">
          {/* Main prompt input textarea */}
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={isGenerating}
            placeholder={placeholder}
            className={`flex-1 bg-transparent text-white placeholder-white/25 focus:outline-none resize-none font-sans font-light leading-relaxed transition-all ${
              isSidebar ? "text-xs h-20" : "text-base h-28"
            }`}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && value.trim().length >= 5 && !isGenerating) {
                e.preventDefault();
                onSubmit();
              }
            }}
          />

          {/* Green AI Assistant status badge */}
          <div className="flex items-center gap-1.5 bg-black/40 border border-white/5 rounded-full px-2.5 py-1 shrink-0 select-none">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <Bot className="w-3.5 h-3.5 text-green-400" />
          </div>
        </div>

        {/* BOTTOM CONTROLS ROW */}
        <div className="flex items-center justify-between mt-4 border-t border-white/5 pt-4">
          {/* Left Action: Plus Icon */}
          <button
            type="button"
            disabled={isGenerating}
            className="p-2 rounded-lg bg-white/5 border border-white/5 text-[#888888] hover:text-white hover:border-white/10 hover:bg-white/10 active:scale-95 transition-all duration-200 cursor-pointer"
            title="Attach references"
          >
            <Plus className="w-4 h-4" />
          </button>

          {/* Right Actions: Mic + Send Button */}
          <div className="flex items-center gap-3 bg-black/40 border border-white/5 rounded-full px-3 py-1.5">
            {/* Microphone/Voice Button */}
            <button
              type="button"
              disabled={isGenerating}
              className="p-1.5 text-[#888888] hover:text-white hover:scale-105 active:scale-95 transition-all cursor-pointer"
              title="Voice Prompt"
            >
              <Mic className="w-4 h-4" />
            </button>

            {/* Separator line */}
            <div className="w-px h-4 bg-white/10"></div>

            {/* Submit Arrow Button */}
            <button
              type="button"
              onClick={onSubmit}
              disabled={isGenerating || !value.trim() || value.length < 5}
              className={`p-2 rounded-full flex items-center justify-center transition-all ${
                value.trim().length >= 5 && !isGenerating
                  ? "bg-white/10 text-white hover:bg-red-vivid hover:text-white hover:scale-105 active:scale-95 cursor-pointer shadow-[0_0_12px_rgba(232,35,42,0.2)]"
                  : "bg-white/5 text-[#444444] cursor-not-allowed"
              }`}
              title="Submit prompt to compile"
            >
              <ArrowUp className="w-3.5 h-3.5 stroke-[3px]" />
            </button>
          </div>
        </div>
      </div>

      {/* SUGGESTIONS / STARTERS SECTION */}
      {suggestions.length > 0 && (
        <div className={`flex flex-col items-center gap-3 w-full text-center ${isSidebar ? "mt-1.5" : "mt-4"}`}>
          {/* Shuffle header */}
          <div className="flex items-center justify-center gap-1.5 text-[#666666] text-xs font-medium select-none">
            <span>Not sure where to start? Try these</span>
            <button
              type="button"
              onClick={shuffleSuggestions}
              disabled={isGenerating}
              className="p-1 hover:text-white cursor-pointer active:rotate-180 transition-all duration-200"
              title="Shuffle starting prompts"
            >
              <Shuffle className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Pill chips */}
          <div className="flex flex-wrap justify-center gap-2.5 max-w-2xl px-2">
            {suggestions.map((item, idx) => (
              <button
                key={idx}
                type="button"
                disabled={isGenerating}
                onClick={() => handleSuggestionClick(item.prompt)}
                className="flex items-center gap-2.5 bg-black-surface/50 border border-white/5 hover:border-red-vivid/30 hover:bg-[#131316] text-[#888888] hover:text-white text-xs py-2 px-3.5 rounded-full transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer group"
              >
                {/* Gradient color dot */}
                <span className={`w-3.5 h-3.5 rounded-full bg-linear-to-tr ${item.gradient} transition-transform duration-300 group-hover:scale-110`} />
                <span className="truncate max-w-[220px] font-sans font-light">{item.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
