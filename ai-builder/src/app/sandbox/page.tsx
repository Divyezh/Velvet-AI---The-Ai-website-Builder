"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FileEntry } from "@/lib/e2b";

import Explorer from "../components/Explorer";
import CodeEditor from "../components/CodeEditor";
import LivePreviewPanel from "../components/LivePreviewPanel";

import {
  Paperclip,
  Mic,
  ArrowUp,
  FileDown,
  ChevronDown,
  Sparkles,
  Zap,
  ArrowLeft,
  Plus,
  Loader2,
  RefreshCw,
  Globe,
  Settings,
  X
} from "lucide-react";

export default function SandboxPageWrapper() {
  return (
    <Suspense fallback={<div className="h-screen bg-black flex items-center justify-center text-white font-sans text-sm">Initializing builder...</div>}>
      <SandboxPage />
    </Suspense>
  );
}

let sandboxInitializing = false;

function AgentMessage({ message }: { message: any }) {
  if (message.status === "generating") {
    return (
      <div style={{ display:"flex", alignItems:"center", gap:8,
        background:"#1a1a1a", borderRadius:12, padding:"10px 16px",
        border:"1px solid rgba(255,255,255,0.07)" }}>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{
          width:16, height:16, borderRadius:"50%",
          border:"2px solid #333",
          borderTopColor:"#e8232a",
          animation:"spin 0.8s linear infinite",
          flexShrink:0
        }}/>
        <span style={{ color:"#888", fontSize:13, fontFamily:"Inter" }}>
          Generating layout...
        </span>
      </div>
    );
  }

  if (message.status === "done") {
    return (
      <div style={{ display:"flex", alignItems:"center", gap:8,
        background:"rgba(34,197,94,0.08)", borderRadius:12, padding:"10px 16px",
        border:"1px solid rgba(34,197,94,0.2)" }}>
        <span style={{ color:"#22c55e", fontSize:13 }}>
          {message.content}
        </span>
      </div>
    );
  }

  if (message.status === "error") {
    return (
      <div style={{ display:"flex", alignItems:"center", gap:8,
        background:"rgba(232,35,42,0.08)", borderRadius:12, padding:"10px 16px",
        border:"1px solid rgba(232,35,42,0.2)" }}>
        <span style={{ color:"#e8232a", fontSize:13 }}>
          {message.content}
        </span>
      </div>
    );
  }

  return (
    <div style={{ background:"#1a1a1a", borderRadius:12, padding:"10px 16px",
      border:"1px solid rgba(255,255,255,0.07)", color:"#ccc", fontSize:13 }}>
      {message.content}
    </div>
  );
}

function SandboxPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activePrompt, setActivePrompt] = useState("");
  const [heroPrompt, setHeroPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState("Claude 3.5 Sonnet");
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [showWorkspace, setShowWorkspace] = useState(true);

  // Sandbox states
  const [sandboxId, setSandboxId] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [activeFileContent, setActiveFileContent] = useState<string>("");
  const [editorValue, setEditorValue] = useState<string>("");
  const [isSavingFile, setIsSavingFile] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string>("System Initialized.\n");
  const [isExecutingTerminal, setIsExecutingTerminal] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Idle");

  // Chat states
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant'; content: string; status?: 'generating' | 'done' | 'error' }[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isAgentGenerating, setIsAgentGenerating] = useState(false);
  const [isInitializingSandbox, setIsInitializingSandbox] = useState(false);

  const submittingRef = React.useRef(false);
  const sandboxRef = React.useRef<any>(null);
  const initializingRef = React.useRef(false);

  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'app' | 'code'>('code');
  const [terminalInput, setTerminalInput] = useState('');
  const terminalEndRef = React.useRef<HTMLDivElement>(null);

  // Settings
  const [showSettings, setShowSettings] = useState(false);
  const [apiKeys, setApiKeys] = useState({ anthropicKey: '', openaiKey: '', nvidiaKey: '' });

  useEffect(() => {
    const saved = localStorage.getItem('velvet_api_keys');
    if (saved) {
      try { setApiKeys(JSON.parse(saved)); } catch (e) { }
    }
  }, []);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('velvet_api_keys', JSON.stringify(apiKeys));
    setShowSettings(false);
  };

  const handleTerminalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim() || isExecutingTerminal) return;
    const cmd = terminalInput;
    setTerminalInput('');
    await handleRunTerminalCommand(cmd);
  };

  useEffect(() => {
    if (showWorkspace) {
      terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLogs, showWorkspace]);

  const initSandbox = async (initialPromptToRun?: string) => {
    if (sandboxRef.current || initializingRef.current) return;
    initializingRef.current = true;
    setIsInitializingSandbox(true);
    setStatusMessage("Creating E2B Sandbox microVM...");
    setTerminalLogs((prev) => prev + "Creating fresh E2B Sandbox instance...\n");

    try {
      const res = await fetch("/api/sandbox", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (data.success && data.sandboxId) {
        sandboxRef.current = { sandboxId: data.sandboxId };
        setSandboxId(data.sandboxId);
        setPreviewUrl(data.previewUrl);
        setTerminalLogs((prev) => prev + `Sandbox created successfully. ID: ${data.sandboxId}\nPreview URL: ${data.previewUrl}\n`);
        setStatusMessage("Vite server starting in background...");

        setTimeout(async () => {
          await refreshFilesList(data.sandboxId);
          setStatusMessage("Sandbox Active");
          setTerminalLogs((prev) => prev + "Filesystem sync completed.\n");

          if (initialPromptToRun) {
            await submitAgentPrompt(initialPromptToRun, data.sandboxId);
          }
        }, 3000);
      } else {
        throw new Error(data.error || "Failed to initialize sandbox");
      }
    } catch (error: any) {
      console.error(error);
      setTerminalLogs((prev) => prev + `[error] Initialization failed: ${error.message}\n`);
      setStatusMessage("Failed to initialize");
    } finally {
      initializingRef.current = false;
      setIsInitializingSandbox(false);
    }
  };

  const refreshFilesList = async (id?: string) => {
    const activeId = id || sandboxId;
    if (!activeId) return;
    try {
      const res = await fetch(`/api/sandbox/files?sandboxId=${activeId}`);
      const data = await res.json();
      if (data.success) {
        setFiles(data.files || []);
      }
    } catch (err) {
      console.error("Error fetching files:", err);
    }
  };

  const handleSelectFile = async (path: string) => {
    if (!sandboxId) return;
    try {
      setStatusMessage(`Reading file: ${path.split('/').pop()}...`);
      const res = await fetch(`/api/sandbox/files?sandboxId=${sandboxId}&action=read&path=${path}`);
      const data = await res.json();
      if (data.success) {
        setActiveFile(path);
        setActiveFileContent(data.content);
        setEditorValue(data.content);
      }
      setStatusMessage("Sandbox Active");
    } catch (err: any) {
      console.error("Error reading file:", err);
      setStatusMessage("Error reading file");
    }
  };

  const handleSaveFile = async () => {
    if (!sandboxId || !activeFile) return;
    setIsSavingFile(true);
    try {
      const res = await fetch("/api/sandbox/files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sandboxId,
          action: "write",
          path: activeFile,
          content: editorValue,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActiveFileContent(editorValue);
        setTerminalLogs((prev) => prev + `[system] Saved file: ${activeFile.replace('/home/user/app/', '')}\n`);
      }
    } catch (err: any) {
      console.error("Error saving file:", err);
      setTerminalLogs((prev) => prev + `[error] Failed to save file ${activeFile}: ${err.message}\n`);
    } finally {
      setIsSavingFile(false);
    }
  };

  const handleCreateFile = async (path: string) => {
    if (!sandboxId) return;
    try {
      const res = await fetch("/api/sandbox/files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sandboxId,
          action: "write",
          path,
          content: "",
        }),
      });
      const data = await res.json();
      if (data.success) {
        await refreshFilesList();
        await handleSelectFile(path);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateDir = async (path: string) => {
    if (!sandboxId) return;
    try {
      const res = await fetch("/api/sandbox/files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sandboxId,
          action: "create_dir",
          path,
        }),
      });
      const data = await res.json();
      if (data.success) {
        await refreshFilesList();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteFile = async (path: string) => {
    if (!sandboxId) return;
    try {
      const res = await fetch("/api/sandbox/files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sandboxId,
          action: "delete",
          path,
        }),
      });
      const data = await res.json();
      if (data.success) {
        if (activeFile === path) {
          setActiveFile(null);
          setActiveFileContent("");
          setEditorValue("");
        }
        await refreshFilesList();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRunTerminalCommand = async (command: string) => {
    if (!sandboxId) return;
    setIsExecutingTerminal(true);
    try {
      const res = await fetch("/api/sandbox/terminal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sandboxId,
          command,
        }),
      });

      if (!res.body) return;
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        setTerminalLogs((prev) => prev + text);
      }
    } catch (err: any) {
      console.error(err);
      setTerminalLogs((prev) => prev + `[error] Command execution failed: ${err.message}\n`);
    } finally {
      setIsExecutingTerminal(false);
      await refreshFilesList();
    }
  };

  const isSyncingRef = React.useRef(false);

  async function writeToSandbox(files: Record<string, string>, activeId: string) {
    if (isSyncingRef.current) {
      console.log("Sync already running, skipping duplicate");
      return;
    }
    isSyncingRef.current = true;
    try {
      for (const [path, content] of Object.entries(files)) {
        await fetch("/api/sandbox/files", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sandboxId: activeId,
            action: "write",
            path: path.startsWith('/') ? path : `/home/user/app/${path}`,
            content,
          }),
        });
      }
      setTerminalLogs(prev => prev + "Filesystem sync completed.\n");
    } finally {
      isSyncingRef.current = false;
    }
  }

  const isGeneratingRef = React.useRef(false);

  const submitAgentPrompt = async (promptText: string, currentSbxId?: string) => {
    const activeId = currentSbxId || sandboxId;
    if (!activeId || !promptText.trim() || isGeneratingRef.current) return;
    isGeneratingRef.current = true;

    const userMsgId = `user-${Date.now()}`;
    setChatMessages((prev) => [...prev, { role: "user", content: promptText, id: userMsgId } as any]);
    setIsAgentGenerating(true);
    setStatusMessage("AI Agent thinking...");

    const agentMsgId = `agent-${Date.now()}`;
    setChatMessages((prev) => [...prev, { role: "assistant", content: "Generating layout...", status: "generating", id: agentMsgId } as any]);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptText }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error ?? `API error ${response.status}`);
      }

      const { files } = await response.json();

      if (!files || Object.keys(files).length === 0) {
        throw new Error("AI returned no files");
      }

      await writeToSandbox(files, activeId);

      try {
        await fetch("/api/sandbox/terminal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sandboxId: activeId,
            command: "touch /home/user/app/src/App.tsx",
          }),
        });
      } catch (_) {}

      setPreviewUrl(`https://5173-${activeId}.e2b.app`);
      setActiveWorkspaceTab('app');

      setStatusMessage("Sandbox Active");
      setChatMessages(prev => prev.map(m =>
        (m as any).id === agentMsgId
          ? { ...m, status: "done", content: "✓ React app generated successfully!" }
          : m
      ));

    } catch (err: any) {
      console.error(err);
      setTerminalLogs((prev) => prev + `[error] Generation failed: ${err.message}\n`);
      setStatusMessage("Agent Error");
      
      setChatMessages(prev => prev.map(m =>
        (m as any).id === agentMsgId
          ? { ...m, status: "error", content: `✗ Error: ${err.message}` }
          : m
      ));
    } finally {
      isGeneratingRef.current = false;
      setIsAgentGenerating(false);
      await refreshFilesList(activeId);
    }
  };

  useEffect(() => {
    const promptParam = searchParams.get("prompt");
    if (promptParam) {
      setActivePrompt(promptParam);
      initSandbox(promptParam);
    } else {
      initSandbox();
    }
  }, []);

  return (
    <div key="workspace-view" className="flex flex-col h-screen bg-[#0A0A0A] text-white font-sans overflow-hidden">
      <div className="grow flex min-h-0 overflow-hidden">
        {/* Chat Panel */}
        <div className="w-[380px] shrink-0 bg-[#080810] border-r border-white/10 flex flex-col justify-between overflow-hidden">
          <div className="p-3 border-b border-white/10 flex items-center justify-between shrink-0 select-none">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
              <span className="text-sm font-semibold tracking-wide text-slate-200">velvet AI</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button onClick={() => setShowSettings(true)} className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-md transition-colors">
                <Settings className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setChatMessages([]);
                  setChatInput("");
                  setSandboxId(null);
                  setPreviewUrl(null);
                  setFiles([]);
                  setActiveFile(null);
                  initSandbox();
                }}
                disabled={isInitializingSandbox}
                className="flex items-center gap-1 px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md text-xs font-semibold text-slate-300 transition-colors disabled:opacity-50"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New chat</span>
              </button>
            </div>
          </div>

          <div className="grow overflow-y-auto p-4 space-y-4">
            {chatMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 select-none">
                <Sparkles className="w-8 h-8 text-indigo-500 mb-2 animate-pulse" />
                <p className="text-xs font-medium text-slate-300">No prompt messages yet</p>
                <p className="text-[11px] text-slate-500 max-w-xs mt-1">
                  Describe what features or components you want inside your Vite web application.
                </p>
              </div>
            ) : (
              chatMessages.map((msg, index) => {
                const isUser = msg.role === 'user';
                return (
                  <div key={index} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-fade-in`}>
                    <div className={`text-[10px] font-semibold mb-1 text-slate-500 font-mono uppercase tracking-wider select-none`}>
                      {isUser ? 'User' : 'Velvet Agent'}
                    </div>
                    {isUser ? (
                      <div className="rounded-2xl px-4 py-3 text-sm max-w-[90%] leading-relaxed bg-[#1e1e24] text-indigo-100 border border-indigo-500/10">
                        {msg.content}
                      </div>
                    ) : (
                      <AgentMessage message={msg} />
                    )}
                  </div>
                );
              })
            )}
          </div>

          <div className="p-3 bg-[#080810]/50 border-t border-white/10 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
              className="w-full bg-[#111] border border-white/10 rounded-xl p-3 flex flex-col gap-3 shadow-lg"
            >
              <textarea
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!chatInput.trim() || isAgentGenerating || !sandboxId) return;
                    const txt = chatInput;
                    setChatInput("");
                    submitAgentPrompt(txt);
                  }
                }}
                disabled={isAgentGenerating || !sandboxId}
                placeholder={!sandboxId ? "Sandbox starting..." : "Ask Velvet anything..."}
                rows={2}
                className="w-full bg-transparent resize-none border-none text-white placeholder-white/20 focus:outline-none font-sans text-xs md:text-sm leading-relaxed"
              />
              <div className="flex items-center justify-between border-t border-white/5 pt-2 select-none">
                <div className="flex items-center gap-1.5">
                  <button type="button" className="flex items-center gap-1 px-2.5 py-1 bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-[10px] rounded-lg transition-colors border border-white/10">
                    <Sparkles className="w-3 h-3 text-indigo-400" />
                    <span>Agent</span>
                    <ChevronDown className="w-2.5 h-2.5 text-white/40" />
                  </button>
                  <button type="button" className="p-1 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                    <Paperclip className="w-3.5 h-3.5" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    if (!chatInput.trim() || isAgentGenerating || !sandboxId) return;
                    const txt = chatInput;
                    setChatInput("");
                    submitAgentPrompt(txt);
                  }}
                  disabled={isAgentGenerating || !chatInput.trim() || !sandboxId}
                  className="w-7 h-7 rounded-full bg-indigo-500 hover:bg-indigo-600 disabled:bg-white/5 disabled:text-slate-600 text-white flex items-center justify-center transition-all cursor-pointer"
                >
                  {isAgentGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Workspace Area */}
        <div className="grow flex flex-col bg-black-deep overflow-hidden min-w-0">
          <div className="grow flex flex-col min-h-0 overflow-hidden">
            <div className="h-[48px] bg-[#080810] border-b border-white/10 px-4 flex items-center justify-between shrink-0 z-10 select-none">
              <div className="flex items-center gap-1 animate-fade-in">
                <button onClick={() => setActiveWorkspaceTab('app')} className={`px-4 py-1.5 rounded text-xs font-semibold tracking-wide transition-colors ${activeWorkspaceTab === 'app' ? 'bg-white/10 text-white font-bold' : 'text-slate-400 hover:text-white'}`}>App</button>
                <button onClick={() => setActiveWorkspaceTab('code')} className={`px-4 py-1.5 rounded text-xs font-semibold tracking-wide transition-colors ${activeWorkspaceTab === 'code' ? 'bg-white/10 text-white font-bold' : 'text-slate-400 hover:text-white'}`}>Code</button>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/5">
                  <span className={`w-2 h-2 rounded-full ${sandboxId ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                  <span className="text-[10px] font-mono text-slate-300 uppercase truncate max-w-[120px]">{statusMessage}</span>
                </div>
                {sandboxId && <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">ID: {sandboxId.substring(0, 8)}...</span>}
                <button onClick={() => refreshFilesList()} disabled={!sandboxId} className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-30"><RefreshCw className="w-3.5 h-3.5" /></button>
                <button onClick={() => router.push('/')} className="flex items-center gap-1.5 px-3 py-1 bg-[#1e1e24] border border-indigo-500/20 text-indigo-400 text-xs font-medium rounded-md hover:text-white hover:bg-indigo-500/20 transition-all cursor-pointer">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Exit</span>
                </button>
              </div>
            </div>

            <div className="grow min-h-0 relative overflow-hidden flex flex-col">
              {activeWorkspaceTab === 'app' ? (
                <div className="flex-1 flex flex-col h-full bg-black-deep">
                  {previewUrl ? (
                    <div className="flex-1 flex flex-col h-full">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-[#080810]/40 border-b border-white/5 text-xs text-slate-400 shrink-0 font-mono select-all">
                        <Globe className="w-3.5 h-3.5 text-slate-500" />
                        <span className="truncate flex-1">{previewUrl}</span>
                      </div>
                      <iframe src={previewUrl} className="grow w-full border-none bg-white" sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation" />
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-500 font-sans p-6 text-center select-none">
                      <Globe className="w-12 h-12 text-slate-700 mb-3 animate-pulse" />
                      <h3 className="text-sm font-semibold text-slate-300 mb-1">Starting Sandbox Dev Server...</h3>
                      <p className="text-xs max-w-xs leading-relaxed text-slate-400">Ephemeral VM container initializing. This starts the React-Vite environment and will display your preview in a few seconds.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grow flex overflow-hidden h-full">
                  <div className="w-56 shrink-0 h-full border-r border-white/10 bg-[#0A0A0A]">
                    <Explorer files={files} activeFile={activeFile} onSelectFile={handleSelectFile} onCreateFile={handleCreateFile} onCreateDir={handleCreateDir} onDeleteFile={handleDeleteFile} />
                  </div>
                  <div className="grow h-full bg-[#0d0d0d] relative">
                    {activeFile ? (
                      <CodeEditor filePath={activeFile} value={editorValue} onChange={setEditorValue} onSave={handleSaveFile} isSaving={isSavingFile} />
                    ) : (
                      <div className="h-full flex items-center justify-center text-slate-600 text-sm font-mono select-none">Select a file to edit</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="h-[200px] shrink-0 bg-black-base border-t border-white/10 flex flex-col font-mono text-[11px] z-20">
              <div className="px-3 py-1.5 border-b border-white/5 text-slate-500 flex items-center justify-between select-none">
                <span>TERMINAL — E2B MicroVM</span>
              </div>
              <div className="grow overflow-y-auto p-3 text-slate-400 leading-relaxed whitespace-pre-wrap">
                {terminalLogs}
                {isExecutingTerminal && <span className="animate-pulse">_</span>}
                <div ref={terminalEndRef} />
              </div>
              <form onSubmit={handleTerminalSubmit} className="flex items-center px-3 py-2 border-t border-white/5 bg-[#080810]">
                <span className="text-emerald-500 mr-2">❯</span>
                <input type="text" value={terminalInput} onChange={(e) => setTerminalInput(e.target.value)} disabled={isExecutingTerminal || !sandboxId} placeholder={!sandboxId ? "Sandbox starting..." : "Enter command..."} className="grow bg-transparent border-none text-white focus:outline-none placeholder-slate-700" spellCheck={false} />
              </form>
            </div>
          </div>
        </div>
      </div>

      {showSettings && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in p-4">
          <div className="bg-[#0A0A0A] border border-white/10 rounded-xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <Settings className="w-4 h-4 text-indigo-400" />
                API Configuration
              </h2>
              <button onClick={() => setShowSettings(false)} className="text-slate-500 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSettings} className="p-4 space-y-4 flex flex-col">
              <p className="text-xs text-slate-400 leading-relaxed">
                Provide your API keys to use VELVET AI. Keys are stored locally in your browser.
              </p>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Anthropic API Key</label>
                  <input type="password" value={apiKeys.anthropicKey} onChange={e => setApiKeys(prev => ({ ...prev, anthropicKey: e.target.value }))} placeholder="sk-ant-..." className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">OpenAI API Key (Optional)</label>
                  <input type="password" value={apiKeys.openaiKey} onChange={e => setApiKeys(prev => ({ ...prev, openaiKey: e.target.value }))} placeholder="sk-..." className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">NVIDIA API Key (Optional)</label>
                  <input type="password" value={apiKeys.nvidiaKey} onChange={e => setApiKeys(prev => ({ ...prev, nvidiaKey: e.target.value }))} placeholder="nvapi-..." className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors" />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button type="button" onClick={() => setShowSettings(false)} className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-500 text-white hover:bg-indigo-600 transition-colors">
                  Save Keys
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
