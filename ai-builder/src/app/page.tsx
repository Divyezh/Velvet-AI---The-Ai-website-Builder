"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import {
  Navbar,
  FeaturesGrid,
  Pricing,
  Footer
} from "./components";
import Explorer from "./components/Explorer";
import CodeEditor from "./components/CodeEditor";
import LivePreviewPanel from "./components/LivePreviewPanel";
import { FileEntry } from "@/lib/e2b";
import { TestimonialCard } from "./components/ui/testimonial-cards";
import { HeroWave } from "./components/ui/ai-input-hero";
import {
  Paperclip,
  Mic,
  ArrowUp,
  FileDown,
  ChevronDown,
  Sparkles,
  Zap,
  ArrowLeft,
  Pencil,
  Rocket,
  Send,
  Loader2,
  RefreshCw,
  Plus,
  Play,
  Globe
} from "lucide-react";

const SHUFFLE_TESTIMONIALS = [
  {
    id: 1,
    testimonial: "Velvet.ai completely shifted our prototyping speed. We spun up 5 landing variants in minutes. The markup was beautiful.",
    author: "Marcus Aurel · Lead Dev at Vesper",
  },
  {
    id: 2,
    testimonial: "I described my boutique in a simple paragraph, and Velvet gave me a layout with perfectly balanced tones and fonts. Breathtaking.",
    author: "Celine Zhang · Founder, Bloom Floral",
  },
  {
    id: 3,
    testimonial: "I've tried all the AI builders. Velvet is the only one that outputs custom systems that don't feel like stock templates.",
    author: "Devon Thorne · Product Lead, Aether",
  },
];

function ShuffleTestimonials() {
  const [positions, setPositions] = useState<Array<"front" | "middle" | "back">>(
    ["front", "middle", "back"]
  );

  const handleShuffle = () => {
    setPositions((prev) => {
      const next = [...prev] as Array<"front" | "middle" | "back">;
      next.unshift(next.pop()!);
      return next;
    });
  };

  return (
    <section id="testimonials" className="bg-black-base py-28 px-6 border-b border-white/5 relative overflow-hidden">
      {/* Radial glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(232,35,42,0.05) 0%, transparent 70%)" }}
      />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="border border-[#2a2a2a] rounded-full px-4 py-1.5 text-xs text-[#888] font-inter font-medium tracking-widest inline-block"
          >
            SHOWCASE
          </motion.span>

          <div className="mt-6 flex flex-col gap-1.5 items-center select-none">
            <div className="overflow-hidden h-[85px] relative">
              <motion.span
                initial={{ y: "100%" }}
                whileInView={{ y: "0%" }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="font-bebas text-6xl md:text-7xl text-white block"
              >
                VALIDATED BY
              </motion.span>
            </div>
            <div className="overflow-hidden h-[85px] relative">
              <motion.span
                initial={{ y: "100%" }}
                whileInView={{ y: "0%" }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                className="font-bebas text-6xl md:text-7xl text-red-vivid block"
              >
                CREATIVE MINDS
              </motion.span>
            </div>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="font-inter text-base text-[#888] mt-4 max-w-[520px] mx-auto"
          >
            See how modern creators and web engineers use Velvet.ai to rapidly deploy high-end online experiences.
          </motion.p>
        </div>

        {/* Drag hint */}
        <p className="text-center text-xs text-[#555] font-inter tracking-widest uppercase mb-6 select-none">
          ← drag the front card left to shuffle
        </p>

        {/* Card stack */}
        <div className="flex justify-center">
          <div className="relative h-[450px] w-[350px] md:ml-[175px]">
            {SHUFFLE_TESTIMONIALS.map((t, index) => (
              <TestimonialCard
                key={t.id}
                {...t}
                handleShuffle={handleShuffle}
                position={positions[index]}
              />
            ))}
          </div>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-[470px] md:mt-[500px]">
          {SHUFFLE_TESTIMONIALS.map((_, i) => (
            <span
              key={i}
              className={`block rounded-full transition-all duration-300 ${positions[i] === "front"
                ? "w-5 h-1.5 bg-red-vivid"
                : "w-1.5 h-1.5 bg-white/20"
                }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const router = useRouter();
  const [activePrompt, setActivePrompt] = useState("");
  const [heroPrompt, setHeroPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState("Gemini 3.5 Flash");
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [showWorkspace, setShowWorkspace] = useState(false);

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
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isAgentGenerating, setIsAgentGenerating] = useState(false);
  const [isInitializingSandbox, setIsInitializingSandbox] = useState(false);

  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'app' | 'code'>('code');
  const [terminalInput, setTerminalInput] = useState('');
  const terminalEndRef = React.useRef<HTMLDivElement>(null);

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
        setSandboxId(data.sandboxId);
        setPreviewUrl(data.previewUrl);
        setTerminalLogs((prev) => prev + `Sandbox created successfully. ID: ${data.sandboxId}\nPreview URL: ${data.previewUrl}\n`);
        setStatusMessage("Vite server starting in background...");

        // Wait 3 seconds and load files
        setTimeout(async () => {
          await refreshFilesList(data.sandboxId);
          setStatusMessage("Sandbox Active");
          setTerminalLogs((prev) => prev + "Filesystem sync completed.\n");

          // If there is an initial prompt, run it automatically!
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

  const submitAgentPrompt = async (promptText: string, currentSbxId?: string) => {
    const activeId = currentSbxId || sandboxId;
    if (!activeId || !promptText.trim()) return;

    const newUserMsg = { role: "user" as const, content: promptText };
    setChatMessages((prev) => [...prev, newUserMsg]);
    setIsAgentGenerating(true);
    setStatusMessage("AI Agent thinking...");

    const newAssistantMsg = { role: "assistant" as const, content: "" };
    setChatMessages((prev) => [...prev, newAssistantMsg]);

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptText,
          history: chatMessages,
          sandboxId: activeId,
        }),
      });

      if (!res.body) throw new Error("No response body received from Agent API");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const data = JSON.parse(line);

            if (data.type === "text") {
              setChatMessages((prev) => {
                const next = [...prev];
                const last = next[next.length - 1];
                if (last && last.role === "assistant") {
                  last.content += data.content;
                }
                return next;
              });
            } else if (data.type === "status") {
              setStatusMessage(data.content);
              setTerminalLogs((prev) => prev + `[status] ${data.content}\n`);
            } else if (data.type === "terminal") {
              setTerminalLogs((prev) => prev + data.content);
            } else if (data.type === "file_written") {
              await refreshFilesList(activeId);
            } else if (data.type === "error") {
              setTerminalLogs((prev) => prev + `[error] Agent error: ${data.content}\n`);
              setStatusMessage("Agent Error");
            } else if (data.type === "done") {
              setStatusMessage("Sandbox Active");
              setTerminalLogs((prev) => prev + "AI Agent completed operations.\n");
            }
          } catch (e) {
            // Incomplete line
          }
        }
      }
    } catch (err: any) {
      console.error(err);
      setTerminalLogs((prev) => prev + `[error] Agent execution failed: ${err.message}\n`);
      setStatusMessage("Agent Error");
    } finally {
      setIsAgentGenerating(false);
      await refreshFilesList(activeId);
    }
  };

  const handleHeroSubmit = () => {
    if (!heroPrompt.trim()) return;
    setActivePrompt(heroPrompt);
    setShowWorkspace(true);
  };

  useEffect(() => {
    if (showWorkspace && !sandboxId) {
      initSandbox(activePrompt);
    }
  }, [showWorkspace]);

  useEffect(() => {
    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Initialize Lenis smooth scroll
    const lenis = new Lenis();

    lenis.on("scroll", ScrollTrigger.update);

    const handleTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(handleTicker);
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      const staggerContainers = document.querySelectorAll(".gsap-stagger-container");
      staggerContainers.forEach((container) => {
        gsap.fromTo(
          container.querySelectorAll(".gsap-stagger-item"),
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: container,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    });

    return () => {
      lenis.destroy();
      gsap.ticker.remove(handleTicker);
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("builder") === "true") {
        setShowWorkspace(true);
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  if (showWorkspace) {
    return (
      <div key="workspace-view" className="flex flex-col h-screen bg-[blackbase] text-white font-sans overflow-hidden">
        {/* Main Split Layout */}
        <div className="grow flex min-h-0 overflow-hidden">

          {/* LEFT COLUMN: Chat Panel */}
          <div className="w-[380px] shrink-0 bg-[#080810] border-r border-white/10 flex flex-col justify-between overflow-hidden">
            {/* Chat Header */}
            <div className="p-3 border-b border-white/10 flex items-center justify-between shrink-0 select-none">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-vivid" />
                <span className="text-sm font-semibold tracking-wide text-slate-200">full stack</span>
              </div>
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

            {/* Chat Message Scroll */}
            <div className="grow overflow-y-auto p-4 space-y-4">
              {chatMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 select-none">
                  <Sparkles className="w-8 h-8 text-red-vivid mb-2 animate-pulse" />
                  <p className="text-xs font-medium text-slate-300">No prompt messages yet</p>
                  <p className="text-[11px] text-slate-500 max-w-xs mt-1">
                    Describe what features or components you want inside your Vite web application.
                  </p>
                </div>
              ) : (
                chatMessages.map((msg, index) => {
                  const isUser = msg.role === 'user';
                  return (
                    <div
                      key={index}
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-fade-in`}
                    >
                      <div className={`text-[10px] font-semibold mb-1 text-slate-500 font-mono uppercase tracking-wider select-none`}>
                        {isUser ? 'User' : 'Velvet Agent'}
                      </div>
                      <div
                        className={`rounded-2xl px-4 py-3 text-sm max-w-[90%] leading-relaxed ${isUser
                          ? 'bg-[#132523] text-teal-100 border border-teal-500/10'
                          : 'bg-white/5 text-slate-200 border border-white/5 font-light whitespace-pre-wrap'
                          }`}
                      >
                        {msg.content || (
                          <div className="flex items-center gap-2 text-slate-400 font-mono text-xs">
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-400" />
                            <span>Generating layout...</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Chat Input Widget */}
            <div className="p-3 bg-[#080810]/50 border-t border-white/10 shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!chatInput.trim() || isAgentGenerating) return;
                  const txt = chatInput;
                  setChatInput("");
                  submitAgentPrompt(txt);
                }}
                className="w-full bg-black-base border border-white/10 rounded-xl p-3 flex flex-col gap-3 shadow-lg"
              >
                <textarea
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  disabled={isAgentGenerating || !sandboxId}
                  placeholder={!sandboxId ? "Sandbox starting..." : "Ask Velvet anything..."}
                  rows={2}
                  className="w-full bg-transparent resize-none border-none text-white placeholder-white/20 focus:outline-none font-sans text-xs md:text-sm leading-relaxed"
                />

                <div className="flex items-center justify-between border-t border-white/5 pt-2 select-none">
                  {/* Selectors */}
                  <div className="flex items-center gap-1.5">
                    <button type="button" className="flex items-center gap-1 px-2.5 py-1 bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-[10px] rounded-lg transition-colors border border-white/10">
                      <Sparkles className="w-3 h-3 text-indigo-400" />
                      <span>Agent</span>
                      <ChevronDown className="w-2.5 h-2.5 text-white/40" />
                    </button>
                    <button type="button" className="flex items-center gap-1 px-2.5 py-1 bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-[10px] rounded-lg transition-colors border border-white/10">
                      <Zap className="w-3 h-3 text-amber-500 fill-amber-500/10" />
                      <span>Auto</span>
                      <ChevronDown className="w-2.5 h-2.5 text-white/40" />
                    </button>
                    <button type="button" className="p-1 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                      <Paperclip className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Send button */}
                  <button
                    type="submit"
                    disabled={isAgentGenerating || !chatInput.trim() || !sandboxId}
                    className="w-7 h-7 rounded-full bg-red-vivid hover:bg-red-mid disabled:bg-white/5 disabled:text-slate-600 text-white flex items-center justify-center transition-all cursor-pointer"
                  >
                    {isAgentGenerating ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* RIGHT COLUMN: WORKSPACE AREA */}
          <div className="grow flex flex-col bg-black-base overflow-hidden min-w-0">

            {/* Workspace Column split: TOP Content, BOTTOM Terminal */}
            <div className="grow flex flex-col min-h-0 overflow-hidden">

              {/* Workspace Header Tabs */}
              <div className="h-[48px] bg-[#080810] border-b border-white/10 px-4 flex items-center justify-between shrink-0 z-10 select-none">
                <div className="flex items-center gap-1 animate-fade-in">
                  <button
                    onClick={() => setActiveWorkspaceTab('app')}
                    className={`px-4 py-1.5 rounded text-xs font-semibold tracking-wide transition-colors ${activeWorkspaceTab === 'app'
                      ? 'bg-white/10 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                      }`}
                  >
                    App
                  </button>
                  <button
                    onClick={() => setActiveWorkspaceTab('code')}
                    className={`px-4 py-1.5 rounded text-xs font-semibold tracking-wide transition-colors ${activeWorkspaceTab === 'code'
                      ? 'bg-white/10 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                      }`}
                  >
                    Code
                  </button>
                  <button className="p-1.5 text-slate-500 rounded hover:text-slate-300">
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Right side options: Deploy / State */}
                <div className="flex items-center gap-3">
                  {/* Status Indicator */}
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/5">
                    <span className={`w-2 h-2 rounded-full ${sandboxId ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                    <span className="text-[10px] font-mono text-slate-300 uppercase truncate max-w-[120px]">
                      {statusMessage}
                    </span>
                  </div>

                  {sandboxId && (
                    <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">
                      ID: {sandboxId.substring(0, 8)}...
                    </span>
                  )}

                  <button
                    onClick={() => refreshFilesList()}
                    disabled={!sandboxId}
                    className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-30"
                    title="Sync Workspace Tree"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      setShowWorkspace(false);
                      setActivePrompt("");
                      setHeroPrompt("");
                      setSandboxId(null);
                      setPreviewUrl(null);
                      setFiles([]);
                      setActiveFile(null);
                      setChatMessages([]);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1 bg-[#132523] border border-teal-500/20 text-teal-400 text-xs font-medium rounded-md hover:text-white hover:bg-teal-500/20 transition-all cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Exit</span>
                  </button>
                </div>
              </div>

              {/* Workspace Content Block */}
              <div className="grow min-h-0 bg-black-base relative overflow-hidden flex flex-col">
                {activeWorkspaceTab === 'app' ? (
                  <div className="flex-1 flex flex-col h-full bg-black-base">
                    {previewUrl ? (
                      <div className="flex-1 flex flex-col h-full">
                        {/* simulated URL bar */}
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#080810]/40 border-b border-white/5 text-xs text-slate-400 shrink-0 font-mono select-all">
                          <Globe className="w-3.5 h-3.5 text-slate-500" />
                          <span className="truncate flex-1">{previewUrl}</span>
                        </div>
                        <iframe
                          src={previewUrl}
                          title="Sandbox Web Preview"
                          className="grow w-full border-none bg-white"
                          sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
                        />
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center text-slate-500 font-sans p-6 text-center select-none">
                        <Globe className="w-12 h-12 text-slate-700 mb-3 animate-pulse" />
                        <h3 className="text-sm font-semibold text-slate-300 mb-1">Starting Sandbox Dev Server...</h3>
                        <p className="text-xs max-w-xs leading-relaxed text-slate-400">
                          Ephemeral VM container initializing. This starts the React-Vite environment and will display your preview in a few seconds.
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="grow flex overflow-hidden h-full">
                    {/* Explorer Left */}
                    <div className="w-56 shrink-0 h-full border-r border-white/10">
                      <Explorer
                        files={files}
                        activeFile={activeFile}
                        onSelectFile={handleSelectFile}
                        onCreateFile={handleCreateFile}
                        onCreateDir={handleCreateDir}
                        onDeleteFile={handleDeleteFile}
                      />
                    </div>
                    {/* Monaco Editor Right */}
                    <div className="flex-1 h-full flex flex-col">
                      <CodeEditor
                        filePath={activeFile}
                        value={editorValue}
                        onChange={setEditorValue}
                        onSave={handleSaveFile}
                        isSaving={isSavingFile}
                      />
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* BOTTOM DOCKED TERMINAL */}
            <div className="h-64 shrink-0 bg-[#030307] border-t border-white/10 flex flex-col overflow-hidden">
              {/* Terminal tabs */}
              <div className="flex items-center justify-between px-4 py-1.5 bg-[#080810]/70 border-b border-white/10 shrink-0 select-none">
                <div className="flex items-center gap-1">
                  <button className="flex items-center gap-1 px-3 py-0.5 text-[10px] font-mono font-bold rounded bg-[#132523] text-teal-400 border border-teal-500/10">
                    <span>Terminal 1</span>
                  </button>
                  <button className="flex items-center gap-1 px-3 py-0.5 text-[10px] font-mono rounded text-slate-500 hover:text-slate-300">
                    <span>Terminal 2</span>
                  </button>
                  <button className="p-0.5 text-slate-500 hover:text-slate-300 rounded hover:bg-white/5">
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {isExecutingTerminal && (
                  <div className="flex items-center gap-1.5 text-[10px] text-teal-400 font-mono">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Executing...</span>
                  </div>
                )}
              </div>

              {/* Terminal content */}
              <div className="flex-1 overflow-y-auto p-4 font-mono text-[11px] text-slate-300 space-y-1 select-text scrollbar-thin">
                {terminalLogs.split('\n').map((line, idx) => {
                  let colorClass = 'text-slate-300';
                  if (line.startsWith('$') || line.startsWith('vm:')) {
                    colorClass = 'text-teal-400 font-semibold';
                  } else if (line.startsWith('[error]') || line.startsWith('[stderr]')) {
                    colorClass = 'text-red-400';
                  } else if (line.startsWith('Command completed') || line.startsWith('Exit code') || line.startsWith('[status]')) {
                    colorClass = 'text-slate-500 italic';
                  }
                  return (
                    <div key={idx} className={`${colorClass} whitespace-pre-wrap break-all`}>
                      {line}
                    </div>
                  );
                })}
                <div ref={terminalEndRef} />
              </div>

              {/* Terminal prompt input */}
              <form
                onSubmit={handleTerminalSubmit}
                className="flex items-center gap-2 p-2 bg-[#080810] border-t border-white/10 shrink-0 font-mono text-xs"
              >
                <span className="text-teal-400 font-bold select-none shrink-0">vm:user/app#</span>
                <input
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  disabled={isExecutingTerminal || !sandboxId}
                  placeholder={isExecutingTerminal ? 'Command executing in sandbox...' : 'npm install canvas-confetti'}
                  className="flex-1 bg-transparent text-slate-200 border-none outline-none disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isExecutingTerminal || !terminalInput.trim() || !sandboxId}
                  className="p-1 rounded text-teal-400 hover:text-white disabled:opacity-30 hover:bg-white/5 transition-all shrink-0"
                >
                  <Play className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div key="landing-view" className="flex flex-col min-h-screen bg-black-base text-white font-sans overflow-x-hidden relative" style={{ backgroundColor: "#050505" }}>
      {/* Dynamic Font and Style Injection for Dark Navbar/Theme Overrides */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600&display=swap');
        
        /* Lenis Smooth Scrolling Styles */
        html.lenis, html.lenis body {
          height: auto;
        }
        .lenis.lenis-smooth {
          scroll-behavior: auto !important;
        }
        .lenis.lenis-smooth [data-lenis-prevent] {
          overscroll-behavior: contain;
        }
        .lenis.lenis-stopped {
          overflow: hidden;
        }
        .lenis.lenis-scrolling iframe {
          pointer-events: none;
        }

        .font-bebas {
          font-family: 'Bebas Neue', sans-serif;
        }
        .font-inter {
          font-family: 'Inter', sans-serif;
        }
        
        /* Navbar Dark Theme Overrides */
        header {
          background: rgba(17, 17, 17, 0.75) !important;
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
          backdrop-filter: blur(12px) !important;
        }
        header span.text-slate-800, header a.text-slate-800 {
          color: #ffffff !important;
        }
        header a.text-slate-600 {
          color: #aaaaaa !important;
        }
        header a.text-slate-600:hover, header a.text-red-vivid:hover {
          color: #ffffff !important;
        }
        header a.text-red-vivid {
          color: #e8232a !important;
        }
        header a.bg-slate-900 {
          background-color: #e8232a !important;
          border-color: rgba(232, 35, 42, 0.2) !important;
          color: white !important;
        }
        header a.bg-slate-900:hover {
          background-color: #c41c22 !important;
        }
        header div.border-slate-200 {
          border-color: rgba(255, 255, 255, 0.1) !important;
          background-color: rgba(255, 255, 255, 0.05) !important;
          color: white !important;
        }

        /* Pricing Section Override */
        #pricing {
          background-color: #070707 !important;
          border-color: rgba(255, 255, 255, 0.08) !important;
          color: white !important;
        }
        #pricing h2, #pricing h3, #pricing span, #pricing .text-slate-800 {
          color: white !important;
        }
        #pricing p, #pricing li, #pricing span.text-slate-400, #pricing .text-slate-500 {
          color: #888888 !important;
        }
        #pricing .bg-white {
          background-color: #111111 !important;
          border-color: rgba(255, 255, 255, 0.08) !important;
        }
        #pricing .border-slate-200 {
          border-color: rgba(255, 255, 255, 0.08) !important;
        }
        #pricing button.bg-transparent {
          border-color: rgba(255, 255, 255, 0.15) !important;
          color: white !important;
        }
        #pricing button.bg-transparent:hover {
          background-color: rgba(255, 255, 255, 0.05) !important;
        }
        #pricing .border-t-slate-100, #pricing .border-slate-100 {
          border-color: rgba(255, 255, 255, 0.08) !important;
        }
        #pricing .bg-slate-100 {
          background-color: rgba(255, 255, 255, 0.05) !important;
        }

        /* Footer Section Override */
        footer {
          background-color: #050505 !important;
          border-top: 1px solid rgba(255, 255, 255, 0.08) !important;
          color: #888888 !important;
        }
        footer h2, footer h3, footer h4, footer a, footer span, footer .text-slate-900, footer .text-slate-800 {
          color: white !important;
        }
        footer a:hover {
          color: #e8232a !important;
        }
        footer p, footer .text-slate-500, footer .text-slate-400 {
          color: #888888 !important;
        }
        footer .border-slate-100, footer .border-t {
          border-color: rgba(255, 255, 255, 0.08) !important;
        }
      `}</style>

      {/* Navbar handled inside HeroWave */}

      {/* SECTION 1 — HERO with Animated Wave */}
      <HeroWave className="min-h-screen relative overflow-hidden bg-black-base">
        <div className="flex flex-col items-center justify-center pt-36 pb-20 px-6 w-full h-full relative z-10">
          {/* Background shapes & lighting */}
        {/* Left shape */}
        <motion.div
          initial={{ x: -140, opacity: 0 }}
          animate={{ x: 0, opacity: 0.85 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="absolute top-0 left-0 w-[420px] h-[520px] pointer-events-none z-0"
          style={{
            background: "linear-gradient(135deg, #c41c22 0%, #8b1016 45%, transparent 75%)",
            clipPath: "polygon(0 0, 72% 0, 100% 35%, 55% 100%, 0 100%)",
          }}
        >
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, 1.8, 0] }}
            transition={{ duration: 6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            className="w-full h-full"
            style={{ willChange: "transform" }}
          />
        </motion.div>

        {/* Right shape */}
        <motion.div
          initial={{ x: 140, opacity: 0 }}
          animate={{ x: 0, opacity: 0.85 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="absolute top-0 right-0 w-[420px] h-[520px] pointer-events-none z-0"
          style={{
            background: "linear-gradient(225deg, #c41c22 0%, #8b1016 45%, transparent 75%)",
            clipPath: "polygon(28% 0, 100% 0, 100% 100%, 45% 100%, 0 35%)",
          }}
        >
          <motion.div
            animate={{ y: [0, -14, 0], rotate: [0, -1.8, 0] }}
            transition={{ duration: 7, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            className="w-full h-full"
            style={{ willChange: "transform" }}
          />
        </motion.div>

        {/* Glow behind left shape */}
        <motion.div
          animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.85, 1.1, 0.85] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-80px] left-[-80px] w-[500px] h-[500px] rounded-full pointer-events-none z-0"
          style={{
            background: "radial-gradient(circle, rgba(232,35,42,0.18) 0%, transparent 65%)",
          }}
        />

        {/* Glow behind right shape */}
        <motion.div
          animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.85, 1.1, 0.85] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[-80px] right-[-80px] w-[500px] h-[500px] rounded-full pointer-events-none z-0"
          style={{
            background: "radial-gradient(circle, rgba(232,35,42,0.18) 0%, transparent 65%)",
          }}
        />

        {/* Hero Content */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.12,
                delayChildren: 0.5,
              },
            },
          }}
          className="max-w-[760px] mx-auto text-center px-6 relative z-10 flex flex-col items-center"
        >
          {/* 1. Badge pill */}
          <motion.div
            variants={{
              hidden: { y: 24, opacity: 0 },
              visible: { y: 0, opacity: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
            }}
            className="inline-flex items-center gap-2.5 bg-white/5 border border-white/12 rounded-full px-5 py-2 font-inter text-xs text-[#aaaaaa]"
          >
            <span className="flex items-center gap-1.5 select-none">
              <span className="w-2 h-2 rounded-full bg-red-vivid/50" />
              <span className="w-2 h-2 rounded-full bg-red-vivid/80" />
              <span className="w-2 h-2 rounded-full bg-red-vivid" />
            </span>
            <span>40+ Positive Reviews</span>
          </motion.div>

          {/* 2. Subheading */}
          <motion.h2
            variants={{
              hidden: { y: 24, opacity: 0 },
              visible: { y: 0, opacity: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
            }}
            className="font-bebas text-2xl sm:text-3xl lg:text-4xl text-[#666666] tracking-[0.12em] mt-5"
          >
            STAY IN CONTROL
          </motion.h2>

          {/* 3. Main heading */}
          <motion.h1
            variants={{
              hidden: { y: 24, opacity: 0 },
              visible: { y: 0, opacity: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
            }}
            className="font-bebas text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-white tracking-[0.03em] leading-[0.95] mt-2 select-none"
          >
            Build your websites with Velvet AI
          </motion.h1>

          {/* 4. Subtitle */}
          <motion.p
            variants={{
              hidden: { y: 24, opacity: 0 },
              visible: { y: 0, opacity: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
            }}
            className="font-inter font-light text-base text-[#888888] max-w-[560px] mx-auto mt-5 leading-[1.75]"
          >
            Unlock next-level performance with AI-powered website creation. Build every page,
            customize every section, and launch with real-time intelligence that turns your
            vision into reality.
          </motion.p>

          {/* Chatbox Input Widget (Preserved starting screen chatbox styled in dark mode) */}
          <motion.div
            variants={{
              hidden: { y: 24, opacity: 0 },
              visible: { y: 0, opacity: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
            }}
            className="w-full max-w-2xl mt-8"
          >
            <div className="w-full bg-black-card border border-white/10 rounded-2xl p-4 flex flex-col gap-4 shadow-[0_24px_60px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.02)] text-left hover:border-white/20 transition-all duration-300">
              <textarea
                value={heroPrompt}
                onChange={(e) => setHeroPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleHeroSubmit();
                  }
                }}
                placeholder="Make a marketplace for freelance designers..."
                rows={3}
                className="w-full bg-transparent resize-none border-none text-white placeholder-white/25 focus:outline-none font-inter font-light text-sm md:text-base leading-relaxed"
              />
              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/5 pt-3.5">
                <div className="flex flex-wrap items-center gap-2">
                  <button className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer" aria-label="Attach file">
                    <Paperclip className="w-4 h-4" />
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-xs rounded-lg transition-colors cursor-pointer border border-white/10">
                    <FileDown className="w-3.5 h-3.5 text-white/40" />
                    <span>Import</span>
                    <ChevronDown className="w-3 h-3 text-white/40" />
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-xs rounded-lg transition-colors cursor-pointer border border-white/10">
                    <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500/10" />
                    <span>Auto</span>
                    <ChevronDown className="w-3 h-3 text-white/40" />
                  </button>

                  {/* Model Selector Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-xs rounded-lg transition-colors cursor-pointer border border-white/10"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{selectedModel}</span>
                      <ChevronDown className="w-3 h-3 text-white/40" />
                    </button>

                    {isModelDropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-20" onClick={() => setIsModelDropdownOpen(false)} />
                        <div className="absolute left-0 mt-1.5 w-48 bg-black-card border border-white/10 rounded-xl shadow-2xl py-1.5 z-30 animate-fade-up">
                          {["Gemini 3.5 Flash", "Claude 3.5 Sonnet", "GPT-4o"].map((model) => (
                            <button
                              key={model}
                              onClick={() => {
                                setSelectedModel(model);
                                setIsModelDropdownOpen(false);
                              }}
                              className={`w-full text-left px-4 py-2 text-xs font-sans hover:bg-white/5 transition-colors block cursor-pointer ${selectedModel === model ? "text-red-500 font-bold bg-red-500/10" : "text-slate-300"
                                }`}
                            >
                              {model}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer" aria-label="Voice input">
                    <Mic className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleHeroSubmit}
                    className="w-8 h-8 rounded-full bg-red-vivid hover:bg-red-mid text-white flex items-center justify-center transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer"
                    aria-label="Submit prompt to compiler"
                  >
                    <ArrowUp className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 5. CTA Button */}
          <motion.button
            variants={{
              hidden: { y: 24, opacity: 0 },
              visible: { y: 0, opacity: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
            }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            onClick={() => {
              if (heroPrompt.trim()) {
                handleHeroSubmit();
              } else {
                setShowWorkspace(true);
              }
            }}
            className="mt-8 inline-flex items-center gap-2 bg-transparent border-none text-white font-inter font-medium text-[17px] cursor-pointer tracking-wide group"
          >
            <span>start build</span>
            <span className="w-5 h-5 border border-white/25 rounded-full flex items-center justify-center text-xs text-white/70 group-hover:border-white group-hover:text-white group-hover:translate-x-1 transition-all duration-200">
              →
            </span>
          </motion.button>
        </motion.div>

        {/* Dashboard Preview Card */}
        <div className="w-full relative z-10 px-6 mt-16 mb-[-80px]">
          <motion.div
            initial={{ y: 60, opacity: 0, scale: 0.97 }}
            whileInView={{ y: 0, opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[860px] w-full mx-auto"
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="bg-black-card border border-white/7 rounded-2xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.8),0_0_0_1px_rgba(232,35,42,0.04)]"
            >
              {/* Header Bar */}
              <div className="h-[52px] bg-[#0d0d0d] border-b border-[#1e1e1e] px-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 bg-red-vivid rounded-[6px] text-white flex items-center justify-center font-bold text-base select-none">
                    V
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-inter font-semibold text-xs text-white">Welcome back, Divyesh</span>
                    <span className="font-inter font-normal text-[10px] text-[#666]">Statistics overview</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    disabled
                    placeholder="Search assets..."
                    className="bg-black-surface border border-[#2a2a2a] rounded-lg px-3 w-[180px] h-[30px] text-xs text-[#555] font-light placeholder-[#555] focus:outline-none"
                  />
                  <button className="w-6 h-6 flex items-center justify-center text-[#555] hover:text-white" disabled>
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" /></svg>
                  </button>
                  <button className="w-6 h-6 flex items-center justify-center text-[#555] hover:text-white" disabled>
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /></svg>
                  </button>
                </div>
              </div>

              {/* Stats Row */}
              <div className="p-4 md:p-5 flex flex-col md:flex-row gap-3">
                {/* Card 1 */}
                <div className="bg-[#161616] border border-[#222222] rounded-xl p-4 flex-1 flex flex-col gap-1.5 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-[#666] font-inter">New subscribers</span>
                    <span className="bg-green-stat/10 text-green-stat text-[10px] font-bold rounded px-1.5 py-0.5 font-mono">+10% ↑</span>
                  </div>
                  <span className="font-bebas text-3xl md:text-4xl text-white">1,324</span>
                  <span className="text-[10px] text-[#555] font-inter">People</span>
                </div>
                {/* Card 2 */}
                <div className="bg-[#161616] border border-[#222222] rounded-xl p-4 flex-1 flex flex-col gap-1.5 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-[#666] font-inter">Total views</span>
                    <span className="bg-green-stat/10 text-green-stat text-[10px] font-bold rounded px-1.5 py-0.5 font-mono">+5% ↑</span>
                  </div>
                  <span className="font-bebas text-3xl md:text-4xl text-white">12.1M</span>
                  <span className="text-[10px] text-[#555] font-inter">Views</span>
                </div>
                {/* Card 3 */}
                <div className="bg-[#161616] border border-[#222222] rounded-xl p-4 flex-1 flex flex-col gap-1.5 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-[#666] font-inter">Engagement rate</span>
                    <span className="bg-green-stat/10 text-green-stat text-[10px] font-bold rounded px-1.5 py-0.5 font-mono">+12% ↑</span>
                  </div>
                  <span className="font-bebas text-3xl md:text-4xl text-white">56%</span>
                  <span className="text-[10px] text-[#555] font-inter">percent</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        </div>
      </HeroWave>

      {/* SECTION 2 — PROCESS (HOW IT WORKS) */}
      <section id="process" className="bg-[#070707] pt-[140px] pb-24 px-6 border-b border-white/5">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-16 items-start">

          {/* Left Column */}
          <div className="flex flex-col items-start text-left">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="border border-[#2a2a2a] rounded-full px-4 py-1.5 text-xs text-[#888] font-inter font-medium tracking-widest inline-block"
            >
              PROCESS
            </motion.span>

            {/* Heading line reveal */}
            <div className="mt-6 flex flex-col gap-1.5 select-none">
              <div className="overflow-hidden h-[85px] relative">
                <motion.span
                  initial={{ y: "100%" }}
                  whileInView={{ y: "0%" }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="font-bebas text-7xl text-white block"
                >
                  FLUID
                </motion.span>
              </div>
              <div className="overflow-hidden h-[85px] relative">
                <motion.span
                  initial={{ y: "100%" }}
                  whileInView={{ y: "0%" }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                  className="font-bebas text-7xl text-red-vivid block"
                >
                  AESTHETIC
                </motion.span>
              </div>
              <div className="overflow-hidden h-[85px] relative">
                <motion.span
                  initial={{ y: "100%" }}
                  whileInView={{ y: "0%" }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                  className="font-bebas text-7xl text-red-vivid block"
                >
                  COMPILER
                </motion.span>
              </div>
            </div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="font-inter font-light text-base text-[#888] leading-[1.75] mt-5 max-w-[320px]"
            >
              A frictionless pipeline from your raw imagination to global production in under 30 seconds.
            </motion.p>
          </div>

          {/* Right Column */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.15,
                },
              },
            }}
            className="flex flex-col gap-4 w-full"
          >
            {/* Card 1 */}
            <motion.div
              variants={{
                hidden: { y: 40, opacity: 0 },
                visible: { y: 0, opacity: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
              }}
              whileHover={{ y: -6, borderColor: "rgba(232, 35, 42, 0.3)", boxShadow: "0 16px 48px rgba(0,0,0,0.6)" }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="bg-black-card border border-white/7 rounded-2xl p-7 flex gap-5 items-start relative overflow-hidden text-left"
            >
              <div className="absolute bottom-2 right-4 font-bebas text-8xl text-white/3 select-none pointer-events-none leading-none">
                01
              </div>
              <div className="w-11 h-11 rounded-xl bg-red-vivid/12 border border-red-vivid/20 flex items-center justify-center shrink-0">
                <Pencil className="w-5 h-5 text-red-vivid" />
              </div>
              <div>
                <h4 className="font-inter font-semibold text-[17px] text-white">Describe Your Website</h4>
                <p className="font-inter text-xs text-[#888] leading-[1.7] mt-1.5 max-w-[420px]">
                  Type a single prompt explaining your brand, color ideas, and layout needs in plain English.
                </p>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              variants={{
                hidden: { y: 40, opacity: 0 },
                visible: { y: 0, opacity: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
              }}
              whileHover={{ y: -6, borderColor: "rgba(232, 35, 42, 0.3)", boxShadow: "0 16px 48px rgba(0,0,0,0.6)" }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="bg-black-card border border-white/7 rounded-2xl p-7 flex gap-5 items-start relative overflow-hidden text-left"
            >
              <div className="absolute bottom-2 right-4 font-bebas text-8xl text-white/3 select-none pointer-events-none leading-none">
                02
              </div>
              <div className="w-11 h-11 rounded-xl bg-red-vivid/12 border border-red-vivid/20 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-red-vivid" />
              </div>
              <div>
                <h4 className="font-inter font-semibold text-[17px] text-white">AI Builds It Instantly</h4>
                <p className="font-inter text-xs text-[#888] leading-[1.7] mt-1.5 max-w-[420px]">
                  Our engine writes semantic code, crafts layouts, compiles custom assets, and designs typography instantly.
                </p>
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              variants={{
                hidden: { y: 40, opacity: 0 },
                visible: { y: 0, opacity: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
              }}
              whileHover={{ y: -6, borderColor: "rgba(232, 35, 42, 0.3)", boxShadow: "0 16px 48px rgba(0,0,0,0.6)" }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="bg-black-card border border-white/7 rounded-2xl p-7 flex gap-5 items-start relative overflow-hidden text-left"
            >
              <div className="absolute bottom-2 right-4 font-bebas text-8xl text-white/3 select-none pointer-events-none leading-none">
                03
              </div>
              <div className="w-11 h-11 rounded-xl bg-red-vivid/12 border border-red-vivid/20 flex items-center justify-center shrink-0">
                <Rocket className="w-5 h-5 text-red-vivid" />
              </div>
              <div>
                <h4 className="font-inter font-semibold text-[17px] text-white">Publish & Go Live</h4>
                <p className="font-inter text-xs text-[#888] leading-[1.7] mt-1.5 max-w-[420px]">
                  One click hosts your site on global CDNs with custom domains, automatic SSL, and lightspeed speeds.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 3 — ALTERNATING FEATURES (Capabilities) */}
      <FeaturesGrid />

      {/* SECTION 4 — TESTIMONIALS (drag-to-shuffle card stack) */}
      <ShuffleTestimonials />

      {/* SECTION 5 — PRICING */}
      <Pricing />

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
