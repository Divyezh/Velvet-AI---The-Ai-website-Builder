"use client";

import { useIDEStore } from "@/app/sandbox/store";
import { useEffect, useRef, useState } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { WebLinksAddon } from "@xterm/addon-web-links";
import { Plus, Trash2 } from "lucide-react";
import "@xterm/xterm/css/xterm.css";

export default function TerminalPanel() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { terminalLines, sandboxId, activeTerminalTab, setActiveTerminalTab } = useIDEStore();
  const [height, setHeight] = useState(220);
  const isDragging = useRef(false);
  const xtermInstance = useRef<Terminal | null>(null);
  const fitAddon = useRef<FitAddon | null>(null);
  const processedLinesCount = useRef(0);

  useEffect(() => {
    if (!terminalRef.current) return;

    const term = new Terminal({
      theme: {
        background: '#030202',
        foreground: '#d4b896',
        cursor: '#e85d0a',
        cursorAccent: '#030202',
        selectionBackground: 'rgba(201,74,10,0.3)',
        black: '#030202',
        red: '#e85d0a',
        green: '#22c55e',
        yellow: '#f0a040',
        blue: '#4ec9b0',
        magenta: '#c586c0',
        cyan: '#9cdcfe',
        white: '#d4b896',
        brightBlack: '#5a3820',
        brightRed: '#ff7040',
        brightGreen: '#4ade80',
        brightYellow: '#fbbf24',
        brightWhite: '#f5e8d8',
      },
      fontSize: 12,
      fontFamily: '"JetBrains Mono", "Fira Code", monospace',
      fontWeight: '400',
      lineHeight: 1.5,
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

    const handleResize = () => fit.fit();
    window.addEventListener('resize', handleResize);

    // Initial lines if any
    if (terminalLines.length > 0) {
      terminalLines.forEach(line => term.writeln(line));
      processedLinesCount.current = terminalLines.length;
    }

    let inputBuffer = '';
    term.onData(async (data) => {
      // Very basic manual terminal implementation for demo
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
  }, []); // Mount once

  useEffect(() => {
    // Append new lines from store (AI generation output)
    if (xtermInstance.current && terminalLines.length > processedLinesCount.current) {
      const newLines = terminalLines.slice(processedLinesCount.current);
      newLines.forEach(line => xtermInstance.current!.writeln(line));
      processedLinesCount.current = terminalLines.length;
    }
  }, [terminalLines]);

  useEffect(() => {
    if (fitAddon.current) {
      // Need a small timeout to allow DOM layout
      setTimeout(() => fitAddon.current?.fit(), 50);
    }
  }, [height]);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    const containerRect = containerRef.current.parentElement!.getBoundingClientRect();
    const newHeight = containerRect.bottom - e.clientY;
    if (newHeight > 100 && newHeight < containerRect.height - 100) {
      setHeight(newHeight);
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
      className="flex flex-col shrink-0 bg-[#030202] border-t border-[rgba(201,74,10,0.1)] relative"
      style={{ height: `${height}px` }}
    >
      {/* RESIZE HANDLE */}
      <div 
        className="absolute top-[-2px] left-0 right-0 h-1 cursor-row-resize bg-transparent hover:bg-[rgba(201,74,10,0.2)] active:bg-[#e85d0a] z-10 transition-colors"
        onMouseDown={handleMouseDown}
      ></div>

      {/* TAB BAR */}
      <div className="flex items-center justify-between h-[32px] bg-[#0a0605] border-b border-[rgba(201,74,10,0.08)] px-3">
        <div className="flex items-center gap-1 h-full pt-1">
          <div 
            onClick={() => setActiveTerminalTab(1)}
            className={`flex items-center gap-2 h-full px-3.5 text-[12px] font-medium rounded-t-md cursor-pointer transition-colors ${
              activeTerminalTab === 1 ? "bg-[#120b08] text-[#f5e8d8]" : "text-[#5a3820] hover:text-[#a08060]"
            }`}
          >
            Terminal 1
          </div>
          
          <button className="flex items-center justify-center w-[22px] h-[22px] rounded text-[#5a3820] hover:text-[#e85d0a] ml-1 transition-colors">
            <Plus size={14} />
          </button>
          <button className="flex items-center justify-center w-5 h-5 rounded text-[#5a3820] hover:text-[#e85d0a] transition-colors">
            <Trash2 size={12} />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 text-[11px]">
            <span className="text-[#5a3820] hover:text-[#a08060] cursor-pointer">Bolt</span>
            <span className="text-[#5a3820] hover:text-[#a08060] cursor-pointer">Publish Output</span>
            <span className="text-[#f5e8d8] underline decoration-[#e85d0a] underline-offset-4 cursor-pointer">Terminal</span>
          </div>
          <div className="w-px h-3 bg-[rgba(201,74,10,0.2)]"></div>
          <span className="text-[10px] font-semibold text-[#5a3820] tracking-widest uppercase">TERMINAL — E2B MicroVM</span>
        </div>
      </div>

      {/* TERMINAL CONTENT */}
      <div className="flex-1 w-full overflow-hidden p-2" ref={terminalRef}></div>
    </div>
  );
}
