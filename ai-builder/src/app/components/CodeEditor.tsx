import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Save, FileCode, Check } from 'lucide-react';

// Dynamically import Monaco Editor to prevent SSR issues in Next.js
const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface CodeEditorProps {
  filePath: string | null;
  value: string;
  onChange: (val: string) => void;
  onSave: () => Promise<void>;
  isSaving: boolean;
}

export default function CodeEditor({
  filePath,
  value,
  onChange,
  onSave,
  isSaving,
}: CodeEditorProps) {
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Map file extension to Monaco language mode
  const getLanguage = (path: string | null) => {
    if (!path) return 'plaintext';
    const ext = path.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'ts':
      case 'tsx':
        return 'typescript';
      case 'js':
      case 'jsx':
        return 'javascript';
      case 'json':
        return 'json';
      case 'html':
        return 'html';
      case 'css':
        return 'css';
      default:
        return 'plaintext';
    }
  };

  useEffect(() => {
    if (isSaving) {
      setSaveSuccess(false);
    }
  }, [isSaving]);

  const handleSaveClick = async () => {
    await onSave();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  if (!filePath) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-black-base text-slate-500 font-sans">
        <FileCode className="w-12 h-12 text-slate-700 mb-3 animate-pulse" />
        <p className="text-sm">Select a file from the explorer to start editing</p>
      </div>
    );
  }

  const filename = filePath.split('/').pop() || '';

  return (
    <div className="flex-1 flex flex-col h-full bg-black-base overflow-hidden">
      {/* Tab bar header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#080810] border-b border-white/10 shrink-0 select-none">
        <div className="flex items-center gap-2">
          <FileCode className="w-4 h-4 text-teal-400 shrink-0" />
          <span className="text-xs font-mono text-slate-300 font-medium">{filename}</span>
          <span className="text-[10px] text-slate-500 font-mono hidden md:inline truncate max-w-xs">
            ({filePath.replace('/home/user/app/', '')})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveClick}
            disabled={isSaving}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium border transition-all ${
              saveSuccess
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-200 hover:text-white disabled:opacity-50'
            }`}
          >
            {saveSuccess ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>{isSaving ? 'Saving...' : 'Save (Ctrl+S)'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor viewport */}
      <div className="flex-1 overflow-hidden relative">
        <Editor
          height="100%"
          language={getLanguage(filePath)}
          theme="vs-dark"
          value={value}
          onChange={(val) => onChange(val || '')}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            scrollbar: {
              vertical: 'visible',
              horizontal: 'visible',
            },
            padding: { top: 12 },
          }}
          onMount={(editor, monaco) => {
            // Bind Save command (Ctrl+S or Cmd+S)
            editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
              handleSaveClick();
            });
          }}
        />
      </div>
    </div>
  );
}
