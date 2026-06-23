"use client";

import { useEffect, useRef } from "react";
import { useIDEStore } from "./store";
import TopBar from "@/components/ide/TopBar";
import IconBar from "@/components/ide/IconBar";
import ChatPanel from "@/components/ide/ChatPanel";
import FileExplorer from "@/components/ide/FileExplorer";
import EditorPanel from "@/components/ide/EditorPanel";
import TerminalPanel from "@/components/ide/TerminalPanel";
import PreviewPanel from "@/components/ide/PreviewPanel";
import StatusBar from "@/components/ide/StatusBar";

export default function SandboxPage() {
  const { 
    setSandboxId, setPreviewUrl, setSandboxStatus, 
    activeView, activeIconPanel, setFileTree 
  } = useIDEStore();
  
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const initSandbox = async () => {
      try {
        const res = await fetch("/api/sandbox/create", { method: "POST" });
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

  return (
    <>
      <TopBar />
      <div className="ide-body-container">
        <IconBar />
        <ChatPanel />
        {activeIconPanel === "explorer" && <FileExplorer />}
        
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex-1 min-h-0 flex relative">
            {activeView === "code" ? (
              <div className="w-full h-full flex flex-col">
                <EditorPanel />
              </div>
            ) : (
              <PreviewPanel />
            )}
          </div>
          <TerminalPanel />
        </div>
      </div>
      <StatusBar />
    </>
  );
}
