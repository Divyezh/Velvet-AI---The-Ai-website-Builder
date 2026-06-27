"use client";

import { useIDEStore } from "@/app/sandbox/store";
import { Message, PlanStep, FileNode } from "@/types/ide";
import { 
  FileCode, History, Plus, Sparkles, ChevronDown, 
  Paperclip, ArrowUp, Loader2, CheckCircle2, 
  Circle, AlertTriangle, Cpu, HelpCircle, Terminal 
} from "lucide-react";
import { useEffect, useState, useRef, useCallback } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const models = [
  { id: "qwen-3-next", name: "Qwen-3 Next (Default)", icon: Cpu, speed: "Free", desc: "Qwen3 Next Instruct Free" },
  { id: "gemini-3.5-flash", name: "Gemini 3.5 Flash", icon: Cpu, speed: "Fast", desc: "Best for fast iterations" },
  { id: "gemini-3.5-pro", name: "Gemini 3.5 Pro", icon: Cpu, speed: "Precise", desc: "For complex architectures" },
  { id: "gpt-4o", name: "GPT-4o", icon: Cpu, speed: "Smart", desc: "Strong overall coding model" },
  { id: "claude-3.5-sonnet", name: "Claude 3.5 Sonnet", icon: Cpu, speed: "Elite", desc: "Premium code generation" },
];

export default function ChatPanel() {
  const { 
    messages, inputValue, setInputValue, addMessage, 
    sandboxId, sandboxStatus, setGenerating, isGenerating,
    setActiveView, updateFileContent, setStreamingFile, 
    addTerminalLine, setPreviewUrl, setActiveFile, setFileTree, fileTree
  } = useIDEStore();

  const [activeModel, setActiveModel] = useState(models[0]);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [agenticMode, setAgenticMode] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isGeneratingRef = useRef(false);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Local helper functions for FIX 2
  const updateMessage = useCallback((id: string, updatesOrFn: any) => {
    useIDEStore.setState((state) => {
      const index = state.messages.findIndex(m => m.id === id);
      if (index === -1) return {};
      const newMessages = [...state.messages];
      const prevMsg = newMessages[index];
      const updates = typeof updatesOrFn === 'function' ? updatesOrFn(prevMsg) : updatesOrFn;
      
      const mappedUpdates: Partial<Message> = {};
      if (updates.role) mappedUpdates.role = updates.role === 'agent' ? 'assistant' : updates.role;
      if (updates.text !== undefined) mappedUpdates.content = updates.text;
      if (updates.status === 'thinking' || updates.status === 'planning') {
        mappedUpdates.isGenerating = true;
        if (updates.text !== undefined) mappedUpdates.phase = updates.text;
      } else if (updates.status === 'done' || updates.status === 'error') {
        mappedUpdates.isGenerating = false;
        if (updates.status === 'error') mappedUpdates.isError = true;
      }
      if (updates.planSteps !== undefined) {
        mappedUpdates.planSteps = updates.planSteps.map((step: any, idx: number) => ({
          id: idx.toString(),
          text: step.label || step.text,
          status: step.done ? 'done' : step.active ? 'current' : 'pending'
        }));
      }
      newMessages[index] = { ...prevMsg, ...mappedUpdates, ...updates };
      return { messages: newMessages };
    });
  }, []);

  const appendFileContent = useCallback((path: string, chunk: string) => {
    useIDEStore.setState((state) => ({
      fileContents: {
        ...state.fileContents,
        [path]: (state.fileContents[path] || "") + chunk
      }
    }));
  }, []);

  const setFileContent = useCallback((path: string, content: string) => {
    updateFileContent(path, content);
  }, [updateFileContent]);

  const refreshFileTree = useCallback(() => {
    if (!sandboxId) return;
    fetch(`/api/sandbox/files?sandboxId=${sandboxId}`)
      .then(res => res.json())
      .then(data => {
        if (data.tree) setFileTree(data.tree);
      })
      .catch(console.error);
  }, [sandboxId, setFileTree]);

  const appendTerminalLine = useCallback((line: string) => {
    addTerminalLine(line);
  }, [addTerminalLine]);

  function insertIntoTree(tree: FileNode[], parts: string[], fullPath: string): FileNode[] {
    const [head, ...rest] = parts;
    const existing = tree.find(n => n.name === head);

    if (rest.length === 0) {
      // It's a file
      if (existing) return tree;
      return [...tree, { name: head, path: fullPath, type: "file" }];
    }

    // It's a directory
    if (existing && (existing.type === "folder" || existing.type === "dir" as any)) {
      return tree.map(n =>
        n.name === head
          ? { ...n, children: insertIntoTree(n.children ?? [], rest, fullPath) }
          : n
      );
    }

    return [
      ...tree,
      {
        name: head,
        path: parts.slice(0, -rest.length).join("/"),
        type: "folder",
        children: insertIntoTree([], rest, fullPath),
      } as any,
    ];
  }

  function addFileToTree(filePath: string, content: string) {
    useIDEStore.setState(prev => ({
      fileContents: { ...prev.fileContents, [filePath]: content }
    }));
    setFileTree(insertIntoTree(useIDEStore.getState().fileTree, filePath.split("/"), filePath));
  }

  function handleStreamEvent(event: any, agentId: string) {
    switch (event.type) {

      case "thinking":
        updateMessage(agentId, { status: "thinking", text: event.phase });
        break;

      case "plan_start":
        updateMessage(agentId, {
          status: "planning",
          text: "Building your project...",
          planSteps: event.steps.map((s: string) => ({ label: s, done: false, active: false })),
        });
        break;

      case "plan_step":
        updateMessage(agentId, (prev: any) => ({
          planSteps: prev.planSteps?.map((s: any, i: number) => ({
            ...s,
            done: i < event.index,
            active: i === event.index,
          })),
        }));
        break;

      case "file_start":
        // Add to file tree immediately (as "streaming" state)
        setStreamingFile(event.path);
        addFileToTree(event.path, "");
        // Auto-open in editor
        setActiveFile(event.path);
        setActiveView("code");
        break;

      case "file_chunk":
        // Append chunk to file content in state
        appendFileContent(event.path, event.content);
        break;

      case "file_done":
        // Set complete content
        setFileContent(event.path, event.fullContent);
        setStreamingFile(null);
        // Refresh file tree
        refreshFileTree();
        break;

      case "terminal_cmd":
        appendTerminalLine(`\x1b[38;2;232;93;10m$ ${event.cmd}\x1b[0m`);
        break;

      case "terminal_out":
        appendTerminalLine(event.line);
        break;

      case "terminal_done":
        appendTerminalLine(
          event.exitCode === 0
            ? `\x1b[32m✓ Command completed\x1b[0m`
            : `\x1b[31m✗ Exit code: ${event.exitCode}\x1b[0m`
        );
        break;

      case "server_ready":
        setPreviewUrl(event.url);
        appendTerminalLine(`\x1b[32m⚡ Live URL: ${event.url}\x1b[0m`);
        break;

      case "done":
        setPreviewUrl(event.previewUrl);
        updateMessage(agentId, {
          status: "done",
          text: `✓ Project generated! ${event.filesCreated?.length ?? 0} files created.`,
        });
        // Auto-switch to App view
        setTimeout(() => setActiveView("app"), 1000);
        break;

      case "error":
        updateMessage(agentId, { status: "error", text: `✗ ${event.message}` });
        break;
    }
  }

  async function handleGenerate(prompt: string) {
    if (isGeneratingRef.current || !sandboxId) return;
    isGeneratingRef.current = true;
    setGenerating(true);

    // Add user message
    addMessage({ id: Date.now().toString(), role: "user", content: prompt });

    // Add agent "thinking" message
    const agentId = `agent-${Date.now()}`;
    addMessage({ id: agentId, role: "assistant", content: "Analyzing your request...", isGenerating: true, phase: "Analyzing your request..." });

    try {
      const response = await fetch("/api/sandbox/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, sandboxId }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error ?? `HTTP ${response.status}`);
      }

      if (!response.body) throw new Error("No response stream");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? ""; // keep incomplete line

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;
          try {
            const event = JSON.parse(trimmed);
            handleStreamEvent(event, agentId);
          } catch {
            // skip malformed lines
          }
        }
      }

    } catch (err: any) {
      updateMessage(agentId, { status: "error", text: `Error: ${err.message}` });
    } finally {
      isGeneratingRef.current = false;
      setGenerating(false);
    }
  }

  const handleSend = () => {
    if (inputValue.trim()) {
      handleGenerate(inputValue);
      setInputValue("");
    }
  };

  useEffect(() => {
    if (sandboxStatus === "ready" && !isGeneratingRef.current && messages.length === 0 && sandboxId) {
      const searchParams = new URLSearchParams(window.location.search);
      const urlPrompt = searchParams.get('prompt');
      if (urlPrompt) {
        handleGenerate(urlPrompt);
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [sandboxStatus, messages.length, sandboxId]);

  return (
    <div className="flex flex-col w-full h-full bg-[#0A0A0A] border-r border-[rgba(255,107,0,0.1)] overflow-hidden">
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 h-[52px] border-b border-[rgba(255,107,0,0.08)] shrink-0 bg-[#111111]">
        <div className="flex items-center gap-2 max-w-[60%]">
          <Sparkles size={14} className="text-[#FF6B00] shrink-0" />
          <span className="text-[12px] font-bold tracking-wide text-[#f5e8d8] uppercase">Velvet Agent</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className="text-[#a08060] hover:text-[#FF6B00] p-1.5 rounded-md hover:bg-[rgba(255,107,0,0.06)] transition-all relative"
            title="Conversation History"
          >
            <History size={15} />
          </button>
          <button 
            onClick={() => useIDEStore.getState().setInputValue("")}
            className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold text-[#a08060] hover:text-[#f5e8d8] hover:bg-[rgba(255,107,0,0.08)] rounded-md transition-all border border-[rgba(255,107,0,0.1)]"
          >
            <Plus size={12} /> New chat
          </button>
        </div>
      </div>

      {/* CONVERSATION HISTORY DRAWER PANEL (POP-OVER) */}
      {showHistory && (
        <div className="bg-[#111111] border-b border-[rgba(255,107,0,0.1)] p-3 flex flex-col gap-2 z-20">
          <div className="text-[10px] font-bold text-[#FF6B00] tracking-widest uppercase mb-1">Previous Conversations</div>
          <div className="text-xs text-[#a08060] hover:text-white p-2 rounded bg-[#0A0A0A] cursor-pointer border border-[rgba(255,107,0,0.05)] transition-colors">
            Create an interactive landing page
          </div>
          <div className="text-xs text-[#a08060] hover:text-white p-2 rounded bg-[#0A0A0A] cursor-pointer border border-[rgba(255,107,0,0.05)] transition-colors">
            Build Tic Tac Toe with Framer Motion
          </div>
        </div>
      )}

      {/* MESSAGES CONTAINER */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-[#FF6B00] rounded-full blur-md opacity-20 animate-pulse" />
              <Sparkles size={36} className="text-[#FF6B00] relative z-10" />
            </div>
            <h3 className="text-base font-bold text-[#f5e8d8] tracking-wide">Ready to construct your project</h3>
            <p className="text-xs text-[#a08060] mt-2 leading-relaxed max-w-[220px]">
              Describe the features, layout, or components you need. Velvet Agent handles the codebase development.
            </p>
          </div>
        ) : (
          messages.map(msg => (
            <div key={msg.id} className={`flex flex-col w-full ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              {msg.role === 'user' ? (
                <div className="max-w-[90%] bg-[#171717] border border-[rgba(255,107,0,0.15)] rounded-[16px_16px_4px_16px] p-3 text-[13px] text-[#f5e8d8] leading-relaxed shadow-lg">
                  {msg.content}
                </div>
              ) : (
                <div className="w-full flex flex-col">
                  <div className="text-[10px] font-bold text-[#FF6B00] tracking-[0.15em] mb-1.5 uppercase">VELVET AGENT</div>
                  
                  {msg.isGenerating ? (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2.5 bg-[rgba(255,107,0,0.04)] border border-[rgba(255,107,0,0.1)] rounded-[4px_16px_16px_16px] p-3">
                        <Loader2 size={16} className="text-[#FF6B00] animate-spin shrink-0" />
                        <span className="text-[13px] text-[#a08060] font-medium">{msg.phase || 'Thinking...'}</span>
                      </div>
                      
                      {msg.planSteps && msg.planSteps.length > 0 && (
                        <div className="flex flex-col gap-2 bg-[#111111] p-3 rounded-lg border border-[rgba(255,107,0,0.05)]">
                          {msg.planSteps.map(step => (
                            <div key={step.id} className="flex items-center gap-2">
                              {step.status === 'done' ? (
                                <CheckCircle2 size={13} className="text-[#22c55e]" />
                              ) : step.status === 'current' ? (
                                <Loader2 size={13} className="text-[#FF6B00] animate-spin" />
                              ) : (
                                <Circle size={13} className="text-[#5a3820]" />
                              )}
                              <span className={`text-[12px] ${step.status === 'done' ? 'text-[#a08060] line-through' : step.status === 'current' ? 'text-[#f5e8d8] font-medium' : 'text-[#5a3820]'}`}>
                                {step.text}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : msg.isError ? (
                    <div className="flex items-start gap-2 bg-[rgba(255,0,0,0.05)] border border-red-500/20 rounded-[4px_16px_16px_16px] p-3 text-[13px] text-red-400">
                      <AlertTriangle size={15} className="text-red-500 shrink-0 mt-0.5" />
                      <span>{msg.content}</span>
                    </div>
                  ) : (
                    <div className="prose prose-invert prose-sm max-w-none bg-[rgba(255,107,0,0.02)] border border-[rgba(255,107,0,0.06)] rounded-[4px_16px_16px_16px] p-4 text-[13px] leading-relaxed text-[#f5e8d8] shadow-md">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* FOOTER: INPUT & MODEL SELECTOR */}
      <div className="shrink-0 border-t border-[rgba(255,107,0,0.08)] p-3 bg-[#111111] relative">
        {/* Model dropdown options */}
        {showModelDropdown && (
          <div className="absolute bottom-[105%] left-3 right-3 bg-[#171717] border border-[rgba(255,107,0,0.15)] rounded-lg shadow-2xl p-1 z-30 flex flex-col gap-0.5">
            {models.map(m => (
              <button
                key={m.id}
                onClick={() => {
                  setActiveModel(m);
                  setShowModelDropdown(false);
                }}
                className={`flex items-center justify-between w-full p-2 rounded-md text-left transition-colors ${
                  activeModel.id === m.id ? "bg-[rgba(255,107,0,0.1)] text-[#FF6B00]" : "text-[#a08060] hover:bg-[rgba(255,107,0,0.05)] hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2">
                  <m.icon size={14} className={activeModel.id === m.id ? "text-[#FF6B00]" : "text-[#a08060]"} />
                  <div>
                    <div className="text-xs font-bold">{m.name}</div>
                    <div className="text-[10px] text-[#5a3820]">{m.desc}</div>
                  </div>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#0A0A0A] border border-[rgba(255,107,0,0.1)] font-semibold">{m.speed}</span>
              </button>
            ))}
          </div>
        )}

        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Ask Velvet Agent to build, edit or test files..."
          className="w-full min-h-[72px] max-h-[160px] bg-[#0A0A0A] border border-[rgba(255,107,0,0.12)] rounded-lg text-[13px] text-[#f5e8d8] p-2.5 placeholder:text-[#5a3820] focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] focus:outline-none resize-none transition-all"
        />
        
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1.5">
            {/* Model Toggle Button */}
            <button 
              onClick={() => setShowModelDropdown(!showModelDropdown)}
              className="flex items-center gap-1.5 bg-[#0A0A0A] border border-[rgba(255,107,0,0.1)] hover:border-[#FF6B00] rounded-md px-2.5 py-1 text-[11px] font-semibold text-[#a08060] transition-colors"
            >
              <Cpu size={12} className="text-[#FF6B00]" />
              <span className="truncate max-w-[90px]">{activeModel.name.split(" ")[0]}</span>
              <ChevronDown size={10} className="text-[#5a3820]" />
            </button>

            <button 
              onClick={() => setAgenticMode(!agenticMode)}
              className={`flex items-center gap-1.5 border rounded-md px-2 py-1 text-[10px] font-semibold transition-colors ${
                agenticMode 
                  ? "bg-[rgba(201,74,10,0.12)] border-[rgba(201,74,10,0.3)] text-[#e85d0a]" 
                  : "bg-[#171717] border-[rgba(255,107,0,0.08)] text-[#a08060]"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${agenticMode ? "bg-green-500 animate-pulse" : "bg-gray-500"}`} />
              ⚡ Agentic Mode
            </button>
          </div>
          
          <div className="flex items-center gap-1.5">
            <button className="text-[#a08060] hover:text-[#FF6B00] p-1.5 hover:bg-[rgba(255,107,0,0.06)] rounded transition-colors" title="Attach context file">
              <Paperclip size={16} />
            </button>
            
            <button 
              onClick={handleSend}
              disabled={!inputValue.trim() || isGeneratingRef.current}
              className={`flex items-center justify-center w-7.5 h-7.5 rounded-md transition-all ${
                inputValue.trim() && !isGeneratingRef.current
                  ? "bg-[#FF6B00] text-white shadow-[0_2px_10px_rgba(255,107,0,0.3)] hover:brightness-110" 
                  : "bg-[#0A0A0A] border border-[rgba(255,107,0,0.08)] text-[#5a3820] cursor-not-allowed"
              }`}
            >
              {isGeneratingRef.current ? <Loader2 size={13} className="animate-spin" /> : <ArrowUp size={14} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

