"use client";

import { useIDEStore } from "@/app/sandbox/store";
import { ArrowLeft, Eye, Code, Plus, Settings, Share, User } from "lucide-react";
import Link from "next/link";

export default function TopBar() {
  const { activeView, setActiveView } = useIDEStore();

  return (
    <div className="flex items-center justify-between px-4 h-12 shrink-0 bg-[#0a0605] border-b border-[rgba(201,74,10,0.1)] z-50">
      {/* LEFT SECTION */}
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center justify-center w-7 h-7 rounded-full bg-[#1c100a] text-[#a08060] hover:text-[#f5e8d8] hover:bg-[rgba(201,74,10,0.1)] transition-colors">
          <ArrowLeft size={16} />
        </Link>
        <div className="text-[14px] font-medium text-[#f5e8d8] outline-none" contentEditable suppressContentEditableWarning>
          full stack
        </div>
        <div className="w-2 h-2 rounded-full bg-[#e85d0a] animate-pulse" title="Unsaved changes" style={{ display: 'none' }}></div>
      </div>

      {/* CENTER SECTION */}
      <div className="flex items-center gap-2">
        <div className="flex items-center bg-[#120b08] border border-[rgba(201,74,10,0.12)] rounded-full p-[3px]">
          <button
            onClick={() => setActiveView("app")}
            className={`flex items-center gap-1.5 px-4 py-1 rounded-full text-sm font-medium transition-colors ${
              activeView === "app" ? "bg-[#1c100a] text-[#f5e8d8]" : "text-[#5a3820] hover:text-[#a08060] bg-transparent"
            }`}
          >
            <Eye size={14} /> App
          </button>
          <button
            onClick={() => setActiveView("code")}
            className={`flex items-center gap-1.5 px-4 py-1 rounded-full text-sm font-medium transition-colors ${
              activeView === "code" ? "bg-[#1c100a] text-[#f5e8d8]" : "text-[#5a3820] hover:text-[#a08060] bg-transparent"
            }`}
          >
            <Code size={14} /> Code
          </button>
          <button className="text-[#5a3820] hover:text-[#e85d0a] px-2">
            <Plus size={16} />
          </button>
        </div>
        <div className="w-px h-4 bg-[rgba(201,74,10,0.1)] mx-1"></div>
        <button className="text-[#5a3820] hover:text-[#a08060]">
          <Settings size={18} />
        </button>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-4">
        <button className="text-[#5a3820] hover:text-[#f5e8d8] flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
        </button>
        <button className="text-[#5a3820] hover:text-[#f5e8d8]">
          <Share size={20} />
        </button>
        <button className="bg-linear-to-br from-[#c94a0a] to-[#e85d0a] text-white rounded-lg px-[18px] py-[6px] text-[13px] font-semibold shadow-[0_2px_12px_rgba(201,74,10,0.35)] hover:brightness-110 hover:scale-[1.01] transition-all">
          Deploy
        </button>
        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-[#1c100a] border border-[rgba(201,74,10,0.12)] text-[12px] font-semibold text-[#e85d0a]">
          V
        </div>
      </div>
    </div>
  );
}
