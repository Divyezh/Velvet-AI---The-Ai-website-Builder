"use client";

import { useIDEStore } from "@/app/sandbox/store";
import { GitBranch, RefreshCw, XCircle, AlertTriangle, Radio } from "lucide-react";

export default function StatusBar() {
  const { sandboxStatus } = useIDEStore();

  return (
    <div className="flex items-center h-6 shrink-0 bg-[#0c0705] border-t border-[rgba(201,74,10,0.08)] px-3 gap-4 z-50">
      {/* Left items */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-[#5a3820] hover:text-[#a08060] cursor-pointer transition-colors">
          <GitBranch size={12} />
          <span className="text-[11px]">master</span>
        </div>
        
        <button className="text-[#5a3820] hover:text-[#a08060] transition-colors">
          <RefreshCw size={12} />
        </button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-[#5a3820] cursor-pointer hover:text-[#a08060] transition-colors">
            <XCircle size={12} />
            <span className="text-[11px]">0</span>
          </div>
          <div className="flex items-center gap-1 text-[#5a3820] cursor-pointer hover:text-[#a08060] transition-colors">
            <AlertTriangle size={12} />
            <span className="text-[11px]">0</span>
          </div>
        </div>

        <div 
          className="flex items-center gap-1.5 text-[#5a3820]"
          title={sandboxStatus === "ready" ? "Connected" : "Starting development server..."}
        >
          <Radio size={12} className={sandboxStatus === "ready" ? "text-[#22c55e]" : "text-[#e85d0a]"} />
          <span className="text-[11px]">{sandboxStatus === "ready" ? "Connected" : "Starting..."}</span>
        </div>
      </div>

      {/* Right items */}
      <div className="flex items-center gap-4 ml-auto">
        <span className="text-[11px] text-[#5a3820] cursor-pointer hover:text-[#a08060] transition-colors">UTF-8</span>
        <span className="text-[11px] text-[#5a3820] cursor-pointer hover:text-[#a08060] transition-colors">Ln 1, Col 1</span>
        <span className="text-[11px] text-[#5a3820] cursor-pointer hover:text-[#a08060] transition-colors">TypeScript</span>
      </div>
    </div>
  );
}
