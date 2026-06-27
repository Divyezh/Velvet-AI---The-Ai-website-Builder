"use client";

import { useEffect, useRef, useState } from "react";
import { useIDEStore } from "./store";
import TopBar from "@/components/ide/TopBar";
import IconBar from "@/components/ide/IconBar";
import ChatPanel from "@/components/ide/ChatPanel";
import FileExplorer from "@/components/ide/FileExplorer";
import EditorPanel from "@/components/ide/EditorPanel";
import dynamic from "next/dynamic";
const TerminalPanel = dynamic(() => import("@/components/ide/TerminalPanel"), {
  ssr: false,
});
import PreviewPanel from "@/components/ide/PreviewPanel";
import StatusBar from "@/components/ide/StatusBar";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Menu, MessageSquare, Code, Play } from "lucide-react";
import ToastContainer from "@/components/ide/Toast";

export default function SandboxPage() {
  const { 
    setSandboxId, setPreviewUrl, setSandboxStatus, 
    activeIconPanel, setFileTree 
  } = useIDEStore();
  
  const initRef = useRef(false);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [workspaceWidth, setWorkspaceWidth] = useState(480);
  const [mobileTab, setMobileTab] = useState<"chat" | "workspace" | "preview">("workspace");

  const isResizing = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const initSandbox = async () => {
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const urlSandboxId = searchParams.get('sandboxId') || undefined;

        const res = await fetch("/api/sandbox/create", { 
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ sandboxId: urlSandboxId })
        });
        const data = await res.json();
        
        if (data.sandboxId) {
          setSandboxId(data.sandboxId);
          setPreviewUrl(data.previewUrl);
          if (data.fileTree) setFileTree(data.fileTree);
          setSandboxStatus("ready");
        } else {
          setSandboxStatus("error");
        }
      } catch (err) {
        console.error("Failed to init sandbox:", err);
        setSandboxStatus("error");
      }
    };

    initSandbox();
  }, [setSandboxId, setPreviewUrl, setSandboxStatus, setFileTree]);

  // Handle center panel resizing
  const startResize = (e: React.MouseEvent) => {
    isResizing.current = true;
    document.addEventListener("mousemove", handleResize);
    document.addEventListener("mouseup", stopResize);
  };

  const handleResize = (e: MouseEvent) => {
    if (!isResizing.current) return;
    const newWidth = e.clientX - (isChatOpen ? 320 : 0);
    if (newWidth > 380 && newWidth < 800) {
      setWorkspaceWidth(newWidth);
    }
  };

  const stopResize = () => {
    isResizing.current = false;
    document.removeEventListener("mousemove", handleResize);
    document.removeEventListener("mouseup", stopResize);
  };

  return (
    <div className="flex flex-col h-screen bg-[#0A0A0A] text-[#f5e8d8] overflow-hidden select-none font-sans relative">
      {/* Background radial gradient glow for atmospheric look */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(255,107,0,0.03),transparent_70%)] pointer-events-none z-0" />
      
      <TopBar />
      
      {/* Mobile view Tab Bar */}
      <div className="md:hidden flex border-b border-[rgba(255,107,0,0.1)] bg-[#111111] h-10 divide-x divide-[rgba(255,107,0,0.1)] z-10 shrink-0">
        <button 
          onClick={() => setMobileTab("chat")}
          className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold ${mobileTab === "chat" ? "bg-[rgba(255,107,0,0.1)] text-[#FF6B00]" : "text-[#a08060]"}`}
        >
          <MessageSquare size={14} /> Chat
        </button>
        <button 
          onClick={() => setMobileTab("workspace")}
          className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold ${mobileTab === "workspace" ? "bg-[rgba(255,107,0,0.1)] text-[#FF6B00]" : "text-[#a08060]"}`}
        >
          <Code size={14} /> Workspace
        </button>
        <button 
          onClick={() => setMobileTab("preview")}
          className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold ${mobileTab === "preview" ? "bg-[rgba(255,107,0,0.1)] text-[#FF6B00]" : "text-[#a08060]"}`}
        >
          <Play size={14} /> Preview
        </button>
      </div>

      {/* Main Body container */}
      <div className="flex-1 flex min-h-0 relative z-10">
        
        {/* LEFT COLUMN: CHAT PANEL (Stretches all the way to the bottom) */}
        <AnimatePresence initial={false}>
          {isChatOpen && (
            <motion.div 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: "tween", duration: 0.25 }}
              className="hidden md:flex flex-col shrink-0 border-r border-[rgba(255,107,0,0.1)] bg-[#0A0A0A] h-full overflow-hidden"
            >
              <ChatPanel />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile View Chat Panel */}
        {mobileTab === "chat" && (
          <div className="md:hidden flex flex-col w-full h-full bg-[#0A0A0A]">
            <ChatPanel />
          </div>
        )}

        {/* Collapsible toggle bar for Chat Panel (Desktop/Tablet) */}
        <div className="hidden md:flex items-center justify-center w-3 h-full cursor-pointer hover:bg-[rgba(255,107,0,0.03)] border-r border-[rgba(255,107,0,0.05)] transition-colors group relative"
          onClick={() => setIsChatOpen(!isChatOpen)}
        >
          <button className="flex items-center justify-center w-4 h-8 rounded-r bg-[#111111] border border-l-0 border-[rgba(255,107,0,0.15)] text-[#a08060] group-hover:text-[#FF6B00] transition-colors absolute left-0 z-30">
            {isChatOpen ? <ChevronLeft size={10} /> : <ChevronRight size={10} />}
          </button>
        </div>

        {/* RIGHT SIDE SECTION: WORKSPACE, PREVIEW, AND TERMINAL */}
        <div className="flex-1 flex flex-col min-w-0 h-full">
          
          {/* Workspace + Preview row */}
          <div className="flex-1 flex min-h-0 relative">
            
            {/* CENTER COLUMN: WORKSPACE PANEL */}
            <div 
              className={`hidden md:flex flex-col shrink-0 bg-[#111111] border-r border-[rgba(255,107,0,0.1)] h-full overflow-hidden relative`}
              style={{ width: `${workspaceWidth}px` }}
            >
              <div className="flex flex-1 min-h-0">
                {/* Extension Bar / Icon Bar on the left */}
                <IconBar />
                
                {/* File Explorer */}
                <AnimatePresence initial={false}>
                  {activeIconPanel === "explorer" && (
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 220, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ type: "tween", duration: 0.2 }}
                      className="border-r border-[rgba(255,107,0,0.08)] bg-[#0A0A0A] h-full overflow-hidden"
                    >
                      <FileExplorer />
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Editor */}
                <div className="flex-1 flex flex-col min-w-0 bg-[#111111]">
                  <EditorPanel />
                </div>
              </div>

              {/* Resize handle between Workspace and Preview */}
              <div 
                className="absolute right-[-3px] top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-[#FF6B00] active:bg-[#FF6B00] transition-colors z-30"
                onMouseDown={startResize}
              />
            </div>

            {/* Mobile View Workspace Panel */}
            {mobileTab === "workspace" && (
              <div className="md:hidden flex flex-1 min-h-0 bg-[#111111]">
                <IconBar />
                {activeIconPanel === "explorer" && <FileExplorer />}
                <div className="flex-1 flex flex-col min-w-0 bg-[#111111]">
                  <EditorPanel />
                </div>
              </div>
            )}

            {/* RIGHT COLUMN: PREVIEW PANEL */}
            <div className={`hidden md:flex flex-col flex-1 min-w-0 h-full overflow-hidden bg-[#0A0A0A]`}>
              <div className="flex-1 min-h-0 flex relative">
                <PreviewPanel />
              </div>
            </div>

            {/* Mobile View Preview Panel */}
            {mobileTab === "preview" && (
              <div className="md:hidden flex flex-1 min-h-0 bg-[#0A0A0A]">
                <PreviewPanel />
              </div>
            )}

          </div>

          {/* BOTTOM PANEL: TERMINAL (Positioned under workspace and preview only!) */}
          <div className="w-full shrink-0 z-20">
            <TerminalPanel />
          </div>

        </div>

      </div>

      <StatusBar />
      <ToastContainer />
    </div>
  );
}
