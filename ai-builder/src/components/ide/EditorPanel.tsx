"use client";

import { useIDEStore } from "@/app/sandbox/store";
import { X, FileCode, Search, Terminal } from "lucide-react";
import Editor, { useMonaco } from "@monaco-editor/react";
import { useEffect, useRef } from "react";

export default function EditorPanel() {
  const { openFiles, activeFile, fileContents, setActiveFile, closeFile, updateFileContent, sandboxId, streamingFile, activeView, previewUrl } = useIDEStore();
  const monaco = useMonaco();
  const timerRef = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    if (monaco) {
      monaco.editor.defineTheme('velvet-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'comment', foreground: '5a3820', fontStyle: 'italic' },
          { token: 'keyword', foreground: 'FF6B00', fontStyle: 'bold' },
          { token: 'string', foreground: 'a08060' },
          { token: 'number', foreground: 'd4b896' },
          { token: 'type', foreground: 'f5e8d8' },
        ],
        colors: {
          'editor.background': '#111111',
          'editor.foreground': '#f5e8d8',
          'editorLineNumber.foreground': '#5a3820',
          'editorLineNumber.activeForeground': '#FF6B00',
          'editor.lineHighlightBackground': '#171717',
          'editorCursor.foreground': '#FF6B00',
          'editor.selectionBackground': 'rgba(255, 107, 0, 0.25)',
          'editorIndentGuide.background': '#171717',
          'editorIndentGuide.activeBackground': '#FF6B00',
          'scrollbarSlider.background': '#0A0A0A',
          'scrollbarSlider.hoverBackground': '#171717',
          'scrollbarSlider.activeBackground': '#FF6B00',
        }
      });
      monaco.editor.setTheme('velvet-dark');
    }
  }, [monaco]);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined && activeFile) {
      updateFileContent(activeFile, value);
      
      // Debounce saving modifications
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        fetch('/api/sandbox/file', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sandboxId, path: activeFile, content: value })
        }).catch(console.error);
      }, 500);
    }
  };

  const getLanguage = (path: string) => {
    if (path.endsWith('.tsx') || path.endsWith('.ts')) return 'typescript';
    if (path.endsWith('.jsx') || path.endsWith('.js')) return 'javascript';
    if (path.endsWith('.css')) return 'css';
    if (path.endsWith('.json')) return 'json';
    if (path.endsWith('.md')) return 'markdown';
    if (path.endsWith('.html')) return 'html';
    return 'plaintext';
  };

  if (activeView === "app") {
    return previewUrl ? (
      <iframe
        key={previewUrl}
        src={previewUrl}
        className="w-full h-full border-none bg-white"
        sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups"
        title="App Preview"
      />
    ) : (
      // Loading / sandbox starting state (what we see in screenshot)
      <div className="flex flex-col flex-1 items-center justify-center bg-[#111111] select-none text-center p-10 gap-5">
        {/* Orange spinner */}
        <div className="w-12 h-12 border-3 border-[rgba(201,74,10,0.2)] border-t-[#e85d0a] rounded-full animate-spin" />
        <div>
          <div className="font-semibold text-[16px] text-[#f5e8d8] mb-3">
            Starting Developer Sandbox...
          </div>
          <div className="text-[13px] text-[#a08060] max-w-[320px] leading-relaxed mx-auto">
            Provisioning Velvet Virtual Machine, installing NPM packages,
            and launching live server. This takes about 10-15 seconds.
          </div>
        </div>
      </div>
    );
  }

  if (openFiles.length === 0 || !activeFile) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center bg-[#111111] border-l border-[rgba(255,107,0,0.05)] select-none">
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-[rgba(255,107,0,0.02)] border border-[rgba(255,107,0,0.08)] mb-4">
          <FileCode size={30} className="text-[#FF6B00] opacity-35" />
        </div>
        <div className="text-[15px] font-semibold text-[#f5e8d8] mb-1">No files open in editor</div>
        <div className="text-[12px] text-[#a08060] max-w-[260px] text-center">Select files from explorer side panel to begin editing.</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 bg-[#111111] overflow-hidden min-h-0 relative">
      {/* Tab bar header */}
      <div className="flex items-end h-[38px] bg-[#0A0A0A] border-b border-[rgba(255,107,0,0.08)] overflow-x-auto overflow-y-hidden no-scrollbar shrink-0 select-none">
        {openFiles.map(path => {
          const isActive = activeFile === path;
          const fileName = path.split('/').pop() || path;
          return (
            <div
              key={path}
              onClick={() => setActiveFile(path)}
              className={`group flex items-center h-[38px] px-3.5 gap-2 text-[12px] cursor-pointer border-r border-[rgba(255,107,0,0.05)] relative min-w-fit transition-all duration-150 ${
                isActive 
                  ? "text-[#f5e8d8] bg-[#111111] font-medium" 
                  : "text-[#a08060] hover:text-[#f5e8d8] bg-transparent"
              }`}
            >
              {isActive && (
                <div className="absolute top-0 left-0 w-full h-[2px] bg-[#FF6B00]"></div>
              )}
              <span className="truncate max-w-[120px]">{fileName}</span>
              
              {streamingFile === path ? (
                <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] animate-pulse ml-1"></div>
              ) : (
                <button 
                  onClick={(e) => { e.stopPropagation(); closeFile(path); }}
                  className={`flex items-center justify-center w-4 h-4 rounded-full transition-all duration-100 ${
                    isActive ? "opacity-100 text-[#a08060] hover:text-[#FF6B00]" : "opacity-0 group-hover:opacity-100 text-[#5a3820] hover:text-[#FF6B00]"
                  }`}
                >
                  <X size={11} />
                </button>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Editor component */}
      <div className="flex-1 min-h-0 relative bg-[#111111]">
        <Editor
          height="100%"
          language={getLanguage(activeFile)}
          theme="velvet-dark"
          value={fileContents[activeFile] || ''}
          onChange={handleEditorChange}
          options={{
            fontSize: 12,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            fontLigatures: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: "on",
            automaticLayout: true,
            lineNumbers: "on",
            renderWhitespace: "selection",
            tabSize: 2,
            smoothScrolling: true,
            padding: { top: 12, bottom: 12 }
          }}
        />
      </div>
    </div>
  );
}
