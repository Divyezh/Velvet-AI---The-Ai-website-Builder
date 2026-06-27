"use client";

import { useIDEStore } from "@/app/sandbox/store";
import { useEffect, useRef, useState } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { WebLinksAddon } from "@xterm/addon-web-links";
import { Plus, Trash2, Maximize2, Minimize2, Check, RefreshCw } from "lucide-react";
import "@xterm/xterm/css/xterm.css";

const terminalTabs = [
  { id: "terminal", label: "Terminal" },
  { id: "build", label: "Build Logs" },
  { id: "ai", label: "AI Actions" },
  { id: "deploy", label: "Deploy Logs" }
];

export default function TerminalPanel() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { terminalLines, sandboxId, previewUrl } = useIDEStore();
  const [height, setHeight] = useState(250);
  const [activeTab, setActiveTab] = useState("terminal");
  const [isMinimized, setIsMinimized] = useState(false);
  const isDragging = useRef(false);
  const xtermInstance = useRef<Terminal | null>(null);
  const fitAddon = useRef<FitAddon | null>(null);
  const processedLinesCount = useRef(0);

  const buildLogs: string[] = [];
  const aiActions: string[] = [];

  // Initialize xterm
  useEffect(() => {
    if (!terminalRef.current || isMinimized || activeTab !== "terminal") return;

    const term = new Terminal({
      theme: {
        background: '#0A0A0A',
        foreground: '#f5e8d8',
        cursor: '#FF6B00',
        cursorAccent: '#0A0A0A',
        selectionBackground: 'rgba(255,107,0,0.25)',
        black: '#0A0A0A',
        red: '#FF6B00',
        green: '#22c55e',
        yellow: '#f0a040',
        blue: '#4ec9b0',
        magenta: '#c586c0',
        cyan: '#9cdcfe',
        white: '#f5e8d8',
        brightBlack: '#5a3820',
        brightRed: '#FF6B00',
        brightGreen: '#22c55e',
        brightYellow: '#fbbf24',
        brightWhite: '#f5e8d8',
      },
      fontSize: 12,
      fontFamily: '"JetBrains Mono", "Fira Code", monospace',
      fontWeight: '400',
      lineHeight: 1.4,
      cursorBlink: true,
      cursorStyle: 'block',
      scrollback: 2000,
      allowTransparency: true,
    });

    const fit = new FitAddon();
    term.loadAddon(fit);
    term.loadAddon(new WebLinksAddon());
    
    term.open(terminalRef.current);
    fit.fit();
    
    xtermInstance.current = term;
    fitAddon.current = fit;

    const handleResize = () => {
      try {
        fit.fit();
      } catch (e) {}
    };
    window.addEventListener('resize', handleResize);

    // Populate initial terminal buffer
    if (terminalLines.length > 0) {
      terminalLines.forEach(line => term.writeln(line));
      processedLinesCount.current = terminalLines.length;
    } else {
      term.writeln("\x1b[33m⚡ Velvet AI MicroVM Environment Connected.\x1b[0m");
      term.writeln("\x1b[32m$ npm run dev\x1b[0m started. Live URL available in preview.\n");
    }

    let inputBuffer = '';
    term.onData(async (data) => {
      term.write(data);
      if (data === '\r') {
        term.write('\n');
        if (inputBuffer.trim() && sandboxId) {
          try {
             fetch('/api/sandbox/terminal', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ sandboxId, command: inputBuffer.trim() })
             }).then(async res => {
               if (res.body) {
                 const reader = res.body.getReader();
                 const decoder = new TextDecoder();
                 while (true) {
                   const { done, value } = await reader.read();
                   if (done) break;
                   term.write(decoder.decode(value).replace(/\n/g, '\r\n'));
                 }
               }
             });
          } catch(e) {}
        }
        inputBuffer = '';
      } else if (data === '\u007F') { // Backspace
        if (inputBuffer.length > 0) {
          inputBuffer = inputBuffer.slice(0, -1);
          term.write('\b \b');
        }
      } else {
        inputBuffer += data;
      }
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      term.dispose();
    };
  }, [activeTab, isMinimized]);

  // Append new streaming output lines
  useEffect(() => {
    if (activeTab === "terminal" && xtermInstance.current && terminalLines.length > processedLinesCount.current) {
      const newLines = terminalLines.slice(processedLinesCount.current);
      newLines.forEach(line => xtermInstance.current!.writeln(line));
      processedLinesCount.current = terminalLines.length;
    }
  }, [terminalLines, activeTab]);

  useEffect(() => {
    if (fitAddon.current && !isMinimized && activeTab === "terminal") {
      setTimeout(() => {
        try {
          fitAddon.current?.fit();
        } catch (e) {}
      }, 50);
    }
  }, [height, isMinimized, activeTab]);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    const parentNode = containerRef.current.parentElement;
    if (!parentNode) return;
    const containerRect = parentNode.getBoundingClientRect();
    const newHeight = containerRect.bottom - e.clientY;
    if (newHeight > 60 && newHeight < containerRect.height - 150) {
      setHeight(newHeight);
      if (isMinimized) setIsMinimized(false);
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  return (
    <div 
      ref={containerRef}
      className="flex flex-col w-full bg-[#0A0A0A] border-t border-[rgba(255,107,0,0.1)] relative"
      style={{ height: isMinimized ? "32px" : `${height}px` }}
    >
      {/* RESIZE HANDLE */}
      <div 
        className="absolute top-[-2px] left-0 right-0 h-1 cursor-row-resize bg-transparent hover:bg-[#FF6B00] active:bg-[#FF6B00] z-10 transition-colors"
        onMouseDown={handleMouseDown}
      ></div>

      {/* TERMINAL HEADER TABS */}
      <div className="flex items-center justify-between h-[32px] bg-[#0A0A0A] border-b border-[rgba(255,107,0,0.08)] px-3 select-none">
        <div className="flex items-center gap-1 h-full pt-1">
          {terminalTabs.map(tab => (
            <div 
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                if (isMinimized) setIsMinimized(false);
              }}
              className={`flex items-center justify-center h-full px-3.5 text-[11.5px] font-semibold rounded-t-md cursor-pointer transition-colors ${
                activeTab === tab.id && !isMinimized 
                  ? "bg-[#111111] text-[#FF6B00] border-t border-t-[#FF6B00]" 
                  : "text-[#a08060] hover:text-[#f5e8d8]"
              }`}
            >
              {tab.label}
            </div>
          ))}
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-semibold text-[#5a3820] tracking-widest uppercase">
            {activeTab === "terminal" ? "E2B Linux MicroVM" : `${activeTab.toUpperCase()} PANEL`}
          </span>
          <div className="w-px h-3 bg-[rgba(255,107,0,0.15)]"></div>
          
          <button 
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-[#a08060] hover:text-[#FF6B00] transition-colors p-0.5"
            title={isMinimized ? "Expand Terminal" : "Minimize Terminal"}
          >
            {isMinimized ? <Maximize2 size={12} /> : <Minimize2 size={12} />}
          </button>
        </div>
      </div>

      {/* TERMINAL CONTENT SCREEN */}
      {!isMinimized && (
        <div className="flex-1 w-full overflow-hidden bg-[#0A0A0A] flex flex-col min-h-0">
          {activeTab === "terminal" && <div className="flex-1 w-full overflow-hidden p-2" ref={terminalRef}></div>}
          {activeTab === "build" && (
            <div style={{ flex: 1, padding: "12px 16px", fontFamily: "monospace", fontSize: 12, color: "var(--text-2)", overflowY: "auto" }}>
              {buildLogs.length === 0
                ? <span style={{ color: "var(--text-3)" }}>No build logs yet.</span>
                : buildLogs.map((l, i) => <div key={i}>{l}</div>)}
            </div>
          )}
          {activeTab === "ai" && (
            <div style={{ flex: 1, padding: "12px 16px", fontFamily: "monospace", fontSize: 12, color: "var(--text-2)", overflowY: "auto" }}>
              {aiActions.length === 0
                ? <span style={{ color: "var(--text-3)" }}>AI actions will appear here during generation.</span>
                : aiActions.map((a, i) => <div key={i}>{a}</div>)}
            </div>
          )}
          {activeTab === "deploy" && (
            <div style={{ flex: 1, padding: "12px 16px", fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-2)" }}>
              {previewUrl
                ? <>
                    <div style={{ color: "var(--green)" }}>✓ Deployed</div>
                    <div style={{ marginTop: 8 }}>
                      <a href={previewUrl} target="_blank" rel="noreferrer"
                        style={{ color: "var(--accent)", textDecoration: "underline" }}>
                        {previewUrl}
                      </a>
                    </div>
                  </>
                : <span style={{ color: "var(--text-3)" }}>No deployment yet. Generate a project first.</span>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
