"use client";

import { useIDEStore } from "@/app/sandbox/store";
import { 
  Loader2, Monitor, Tablet, Smartphone, RotateCw, 
  ExternalLink, Rocket, RefreshCw, Check 
} from "lucide-react";
import { useState, useRef } from "react";

export default function PreviewPanel() {
  const { previewUrl, sandboxStatus } = useIDEStore();
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [key, setKey] = useState(0); // For forcing iframe reloads
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploySuccess, setDeploySuccess] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleRefresh = () => {
    setKey(prev => prev + 1);
  };

  const handleOpenNewTab = () => {
    if (previewUrl) {
      window.open(previewUrl, "_blank");
    }
  };

  const handleDeploy = () => {
    setIsDeploying(true);
    // Simulate deployment delay
    setTimeout(() => {
      setIsDeploying(false);
      setDeploySuccess(true);
      setTimeout(() => setDeploySuccess(false), 3000);
    }, 2500);
  };

  if (sandboxStatus === "creating" || !previewUrl) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center bg-[#0A0A0A] select-none text-center px-6">
        <div className="relative mb-5">
          <div className="absolute inset-0 bg-[#FF6B00] rounded-full blur-xl opacity-10 animate-pulse" />
          <Loader2 size={36} className="text-[#FF6B00] animate-spin relative z-10" />
        </div>
        <div className="text-[16px] text-[#f5e8d8] font-semibold tracking-wide mb-3">Starting Developer Sandbox...</div>
        <div className="text-[13px] text-[#a08060] leading-relaxed max-w-[320px] mx-auto">
          Provisioning Velvet Virtual Machine, installing NPM packages, and launching live server. This takes about 10-15 seconds.
        </div>
      </div>
    );
  }

  // Device sizes map
  const deviceWidths = {
    desktop: "w-full h-full",
    tablet: "w-[768px] h-[92%] border border-[rgba(255,107,0,0.15)] rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)]",
    mobile: "w-[375px] h-[85%] border border-[rgba(255,107,0,0.15)] rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
  };

  return (
    <div className="flex-1 w-full h-full flex flex-col bg-[#111111] overflow-hidden select-none">
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between h-[38px] bg-[#0A0A0A] border-b border-[rgba(255,107,0,0.08)] px-3 shrink-0">
        
        {/* Left: Device toggles */}
        <div className="flex items-center gap-1 bg-[#111111] border border-[rgba(255,107,0,0.08)] p-[2px] rounded-md">
          <button
            onClick={() => setDevice("desktop")}
            className={`p-1 rounded transition-colors ${device === "desktop" ? "bg-[rgba(255,107,0,0.1)] text-[#FF6B00]" : "text-[#a08060] hover:text-[#f5e8d8]"}`}
            title="Desktop Mode"
          >
            <Monitor size={13} />
          </button>
          <button
            onClick={() => setDevice("tablet")}
            className={`p-1 rounded transition-colors ${device === "tablet" ? "bg-[rgba(255,107,0,0.1)] text-[#FF6B00]" : "text-[#a08060] hover:text-[#f5e8d8]"}`}
            title="Tablet Mode"
          >
            <Tablet size={13} />
          </button>
          <button
            onClick={() => setDevice("mobile")}
            className={`p-1 rounded transition-colors ${device === "mobile" ? "bg-[rgba(255,107,0,0.1)] text-[#FF6B00]" : "text-[#a08060] hover:text-[#f5e8d8]"}`}
            title="Mobile Mode"
          >
            <Smartphone size={13} />
          </button>
        </div>

        {/* Center: Address Bar (read-only link representation) */}
        <div className="hidden sm:flex items-center gap-2 bg-[#111111] border border-[rgba(255,107,0,0.05)] rounded-md px-3 py-1 max-w-[40%] truncate text-[11px] text-[#a08060] font-mono select-all">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
          {previewUrl}
        </div>

        {/* Right: Iframe actions & Deploy */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="p-1.5 rounded-md text-[#a08060] hover:text-[#FF6B00] hover:bg-[rgba(255,107,0,0.05)] transition-all"
            title="Refresh Live App"
          >
            <RotateCw size={13} />
          </button>
          <button
            onClick={handleOpenNewTab}
            className="p-1.5 rounded-md text-[#a08060] hover:text-[#FF6B00] hover:bg-[rgba(255,107,0,0.05)] transition-all"
            title="Open in new window"
          >
            <ExternalLink size={13} />
          </button>
          <div className="w-px h-3.5 bg-[rgba(255,107,0,0.15)] mx-1"></div>
          <button
            onClick={handleDeploy}
            disabled={isDeploying}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-bold shadow-md transition-all ${
              deploySuccess 
                ? "bg-[#22c55e] text-white" 
                : "bg-[#FF6B00] text-white hover:brightness-110 hover:shadow-[0_0_10px_rgba(255,107,0,0.2)]"
            }`}
          >
            {isDeploying ? (
              <>
                <Loader2 size={11} className="animate-spin" /> Deploying...
              </>
            ) : deploySuccess ? (
              <>
                <Check size={11} /> Live
              </>
            ) : (
              <>
                <Rocket size={11} /> Deploy App
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preview Frame Wrapper */}
      <div className="flex-1 flex items-center justify-center p-4 bg-[#171717] overflow-hidden relative">
        <div className={`transition-all duration-300 ease-in-out bg-white flex items-center justify-center ${deviceWidths[device]}`}>
          <iframe
            key={key}
            ref={iframeRef}
            src={previewUrl}
            className="w-full h-full border-none bg-white"
            sandbox="allow-scripts allow-same-origin allow-forms allow-modals"
            allow="clipboard-read; clipboard-write"
          />
        </div>
      </div>
    </div>
  );
}
