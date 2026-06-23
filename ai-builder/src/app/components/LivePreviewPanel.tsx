import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, Play, Terminal as TerminalIcon, Eye, ExternalLink, Globe } from 'lucide-react';

interface LivePreviewPanelProps {
  previewUrl: string | null;
  terminalLogs: string;
  onRunTerminalCommand: (command: string) => Promise<void>;
  isExecutingCommand: boolean;
}

export default function LivePreviewPanel({
  previewUrl,
  terminalLogs,
  onRunTerminalCommand,
  isExecutingCommand,
}: LivePreviewPanelProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'terminal'>('preview');
  const [iframeKey, setIframeKey] = useState(0);
  const [terminalInput, setTerminalInput] = useState('');
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const handleRefresh = () => {
    setIframeKey((prev) => prev + 1);
  };

  const handleTerminalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim() || isExecutingCommand) return;
    const cmd = terminalInput;
    setTerminalInput('');
    await onRunTerminalCommand(cmd);
  };

  // Auto scroll terminal to bottom
  useEffect(() => {
    if (activeTab === 'terminal') {
      terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLogs, activeTab]);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#080810] border-l border-white/10 select-none overflow-hidden">
      {/* Header Tabs */}
      <div className="flex items-center justify-between px-4 py-2 bg-black-base border-b border-white/10 shrink-0">
        <div className="flex items-center gap-1.5 p-1 bg-white/5 rounded-lg border border-white/5">
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'preview'
                ? 'bg-[#132523] text-teal-400 border border-teal-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live Preview</span>
          </button>
          <button
            onClick={() => setActiveTab('terminal')}
            className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'terminal'
                ? 'bg-[#132523] text-teal-400 border border-teal-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <TerminalIcon className="w-3.5 h-3.5" />
            <span>Terminal Logs</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'preview' && previewUrl && (
            <>
              <button
                onClick={handleRefresh}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                title="Refresh Preview"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <a
                href={previewUrl}
                target="_blank"
                rel="noreferrer"
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                title="Open in New Tab"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </>
          )}
        </div>
      </div>

      {/* Content Viewport */}
      <div className="flex-1 min-h-0 bg-black-base relative overflow-hidden flex flex-col">
        {activeTab === 'preview' ? (
          <div className="flex-1 flex flex-col h-full">
            {previewUrl ? (
              <div className="flex-1 flex flex-col h-full">
                {/* Simulated browser address bar */}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/2 border-b border-white/5 text-xs text-slate-400 shrink-0 font-mono">
                  <Globe className="w-3.5 h-3.5 text-slate-500" />
                  <span className="truncate flex-1 select-all">{previewUrl}</span>
                </div>
                {/* iframe */}
                <iframe
                  key={iframeKey}
                  src={previewUrl}
                  title="Live Preview"
                  className="flex-1 w-full border-none bg-white"
                  sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
                />
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500 font-sans p-6 text-center">
                <Globe className="w-12 h-12 text-slate-700 mb-3 animate-pulse" />
                <h3 className="text-sm font-semibold text-slate-300 mb-1">Starting Sandbox Dev Server...</h3>
                <p className="text-xs max-w-xs leading-relaxed text-slate-400">
                  Ephemeral VM container initializing. This starts the React-Vite environment and will display your preview in a few seconds.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Terminal Viewport */}
            <div className="flex-1 overflow-y-auto p-4 font-mono text-xs text-slate-300 space-y-1 select-text bg-[#030307]">
              {terminalLogs.split('\n').map((line, idx) => {
                let colorClass = 'text-slate-300';
                if (line.startsWith('$')) {
                  colorClass = 'text-teal-400 font-semibold';
                } else if (line.startsWith('[error]') || line.startsWith('[stderr]')) {
                  colorClass = 'text-red-400';
                } else if (line.startsWith('Command completed') || line.startsWith('Exit code')) {
                  colorClass = 'text-slate-400 italic';
                }
                return (
                  <div key={idx} className={`${colorClass} whitespace-pre-wrap break-all`}>
                    {line}
                  </div>
                );
              })}
              <div ref={terminalEndRef} />
            </div>

            {/* Terminal input console */}
            <form
              onSubmit={handleTerminalSubmit}
              className="flex items-center gap-2 p-2 bg-[#080810] border-t border-white/10 shrink-0 font-mono text-xs"
            >
              <span className="text-teal-400 font-bold select-none shrink-0">$</span>
              <input
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                disabled={isExecutingCommand}
                placeholder={isExecutingCommand ? 'Command running in sandbox...' : 'npm run build'}
                className="flex-1 bg-transparent text-slate-200 border-none outline-none disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isExecutingCommand || !terminalInput.trim()}
                className="p-1.5 rounded text-teal-400 hover:text-white disabled:opacity-50 hover:bg-white/5 transition-all shrink-0"
              >
                <Play className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
