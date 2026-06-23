"use client";

import { useIDEStore } from "@/app/sandbox/store";
import { X } from "lucide-react";
import Editor, { useMonaco } from "@monaco-editor/react";
import { useEffect, useRef } from "react";

export default function EditorPanel() {
  const { openFiles, activeFile, fileContents, setActiveFile, closeFile, updateFileContent, sandboxId, streamingFile } = useIDEStore();
  const monaco = useMonaco();
  const timerRef = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    if (monaco) {
      monaco.editor.defineTheme('velvet-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [],
        colors: {
          'editor.background': '#080505',
          'editor.foreground': '#f5e8d8',
          'editorLineNumber.foreground': '#3d2010',
          'editorLineNumber.activeForeground': '#c94a0a',
          'editor.lineHighlightBackground': '#120b0820',
          'editorCursor.foreground': '#e85d0a',
          'editor.selectionBackground': '#c94a0a30',
          'editorIndentGuide.background': '#1c100a',
          'scrollbarSlider.background': '#251408'
        }
      });
      monaco.editor.setTheme('velvet-dark');
    }
  }, [monaco]);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined && activeFile) {
      updateFileContent(activeFile, value);
      
      // Debounce save to E2B sandbox
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

  if (openFiles.length === 0 || !activeFile) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center bg-[#080505]">
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-[rgba(201,74,10,0.05)] border border-[rgba(201,74,10,0.1)] mb-4">
          <span className="text-[#e85d0a] text-2xl font-bold opacity-30">V</span>
        </div>
        <span className="text-[13px] text-[#5a3820]">Select a file to edit</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 bg-[#080505] overflow-hidden min-h-0">
      <div className="flex items-end h-[36px] bg-[#0a0605] border-b border-[rgba(201,74,10,0.08)] overflow-x-auto overflow-y-hidden no-scrollbar shrink-0">
        {openFiles.map(path => {
          const isActive = activeFile === path;
          const fileName = path.split('/').pop() || path;
          return (
            <div
              key={path}
              onClick={() => setActiveFile(path)}
              className={`group flex items-center h-[36px] px-4 gap-2 text-[12px] cursor-pointer border-r border-[rgba(201,74,10,0.06)] relative min-w-fit ${
                isActive 
                  ? "text-[#f5e8d8] bg-[#080505] border-t border-t-[#e85d0a]" 
                  : "text-[#5a3820] hover:text-[#a08060] bg-transparent border-t border-t-transparent"
              }`}
            >
              {isActive && (
                <div className="absolute top-0 left-0 w-full h-px bg-[#e85d0a]"></div>
              )}
              <span className="truncate">{fileName}</span>
              
              {streamingFile === path ? (
                <div className="w-1.5 h-1.5 rounded-full bg-[#e85d0a] animate-pulse ml-1"></div>
              ) : (
                <button 
                  onClick={(e) => { e.stopPropagation(); closeFile(path); }}
                  className={`flex items-center justify-center w-4 h-4 rounded-full transition-colors ${
                    isActive ? "opacity-100 text-[#a08060] hover:text-[#e85d0a]" : "opacity-0 group-hover:opacity-100 text-[#5a3820] hover:text-[#e85d0a]"
                  }`}
                >
                  <X size={12} />
                </button>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="flex-1 min-h-0 relative">
        <Editor
          height="100%"
          language={getLanguage(activeFile)}
          theme="velvet-dark"
          value={fileContents[activeFile] || ''}
          onChange={handleEditorChange}
          options={{
            fontSize: 13,
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
            padding: { top: 16 }
          }}
        />
      </div>
    </div>
  );
}
