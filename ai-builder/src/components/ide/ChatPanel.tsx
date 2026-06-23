"use client";

import { useIDEStore } from "@/app/sandbox/store";
import { Message, PlanStep } from "@/types/ide";
import { FileCode, History, Plus, Sparkles, ChevronDown, Paperclip, ArrowUp, Loader2, CheckCircle2, Circle, AlertTriangle } from "lucide-react";
import { useEffect } from "react";
import { parseStream } from "@/lib/stream";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ChatPanel() {
  const { 
    messages, inputValue, setInputValue, addMessage, updateLastMessage, 
    sandboxId, sandboxStatus, setGenerating, isGenerating,
    setGeneratingPhase, setToolsUsed, setPlanSteps, setActiveView,
    updateFileContent, setStreamingFile, addTerminalLine, setPreviewUrl
  } = useIDEStore();

  const submitPrompt = async (promptText: string) => {
    if (!promptText.trim() || isGenerating || sandboxStatus !== "ready" || !sandboxId) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: promptText };
    addMessage(userMessage);
    
    setInputValue("");
    
    const agentMsgId = (Date.now() + 1).toString();
    addMessage({ id: agentMsgId, role: 'assistant', content: '', isGenerating: true, phase: 'Analyzing prompt...', toolsUsed: 0, planSteps: [] });
    
    setGenerating(true);

    try {
      const response = await fetch('/api/sandbox/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText, sandboxId })
      });

      let currentPlan: PlanStep[] = [];

      await parseStream(response, (event) => {
        if (event.type === "thinking") {
          updateLastMessage({ phase: event.phase, toolsUsed: event.toolsUsed });
        } else if (event.type === "plan") {
          currentPlan = event.steps.map((text: string, i: number) => ({
            id: i.toString(),
            text,
            status: i === event.current ? 'current' : 'pending'
          }));
          updateLastMessage({ planSteps: currentPlan });
        } else if (event.type === "plan_update") {
          currentPlan = currentPlan.map((step, i) => ({
            ...step,
            status: i < event.current ? 'done' : i === event.current ? 'current' : 'pending'
          }));
          updateLastMessage({ planSteps: currentPlan });
        } else if (event.type === "file_start") {
          setStreamingFile(event.path);
        } else if (event.type === "file_chunk") {
           // Not doing character by character here to keep simple, just wait for file_done
        } else if (event.type === "file_done") {
          updateFileContent(event.path, event.fullContent);
          setStreamingFile(null);
        } else if (event.type === "terminal_cmd") {
          addTerminalLine(`$ ${event.cmd}`);
        } else if (event.type === "terminal_out") {
          addTerminalLine(event.line);
        } else if (event.type === "terminal_done") {
          addTerminalLine(`\nCommand completed with exit code ${event.exitCode}\n`);
        } else if (event.type === "server_start") {
          setPreviewUrl(event.url);
        } else if (event.type === "error") {
          updateLastMessage({ isGenerating: false, isError: true, content: event.message });
          setGenerating(false);
        } else if (event.type === "done") {
          updateLastMessage({ 
            isGenerating: false, 
            content: `I've successfully created the app based on your prompt! I modified ${event.filesCreated.length} files. The server is running and the preview is ready.`
          });
          setGenerating(false);
          setActiveView("app");
        }
      });
    } catch (e: any) {
      updateLastMessage({ isGenerating: false, isError: true, content: e.message || 'Network error' });
      setGenerating(false);
    }
  };

  const handleSend = () => submitPrompt(inputValue);

  useEffect(() => {
    if (sandboxStatus === "ready" && !isGenerating && messages.length === 0 && sandboxId) {
      const searchParams = new URLSearchParams(window.location.search);
      const urlPrompt = searchParams.get('prompt');
      if (urlPrompt) {
        submitPrompt(urlPrompt);
        // Clear the URL param so it doesn't re-trigger on reload
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [sandboxStatus, isGenerating, messages.length, sandboxId]);

  return (
    <div className="flex flex-col w-[320px] shrink-0 bg-[#0a0605] border-r border-[rgba(201,74,10,0.08)] h-full overflow-hidden">
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 h-[52px] border-b border-[rgba(201,74,10,0.08)] shrink-0">
        <div className="flex items-center gap-2 max-w-[60%]">
          <FileCode size={14} className="text-[#e85d0a] shrink-0" />
          <span className="text-[12px] font-medium text-[#a08060] truncate">current-session</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-[#5a3820] hover:text-[#a08060]">
            <History size={16} />
          </button>
          <button className="flex items-center gap-1 px-2.5 py-1 text-[12px] font-medium text-[#5a3820] hover:text-[#f5e8d8] hover:bg-[rgba(201,74,10,0.06)] rounded-md transition-all">
            <Plus size={14} /> New chat
          </button>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <Sparkles size={32} className="text-[#e85d0a] opacity-50 mb-3" />
            <h3 className="text-[14px] font-medium text-[#5a3820]">No prompt messages yet</h3>
            <p className="text-[12px] text-[#5a3820] mt-2 leading-relaxed max-w-[200px]">
              Describe what you want to build. VELVET will generate all files automatically.
            </p>
          </div>
        ) : (
          messages.map(msg => (
            <div key={msg.id} className={`flex flex-col w-full ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              {msg.role === 'user' ? (
                <div className="max-w-[85%] bg-[#120b08] border border-[rgba(201,74,10,0.15)] rounded-[16px_16px_4px_16px] p-3 text-[13px] text-[#f5e8d8] leading-relaxed">
                  {msg.content}
                </div>
              ) : (
                <div className="w-full flex flex-col">
                  {msg.isGenerating ? (
                    <div className="flex flex-col">
                      <div className="text-[10px] font-semibold text-[#e85d0a] tracking-[0.15em] mb-2">VELVET AGENT</div>
                      
                      <div className="flex items-center gap-2.5 bg-[rgba(201,74,10,0.06)] border border-[rgba(201,74,10,0.12)] rounded-[4px_16px_16px_16px] p-3.5 mb-2">
                        <Loader2 size={18} className="text-[#e85d0a] animate-spin" />
                        <span className="text-[13px] text-[#a08060]">{msg.phase || 'Analyzing prompt...'}</span>
                      </div>
                      
                      {msg.toolsUsed !== undefined && (
                        <div className="text-[11px] text-[#5a3820] mb-3 ml-1">Called {msg.toolsUsed} tools</div>
                      )}

                      {msg.planSteps && msg.planSteps.length > 0 && (
                        <div className="flex flex-col gap-1.5 ml-1 mt-1">
                          {msg.planSteps.map(step => (
                            <div key={step.id} className="flex items-center gap-2">
                              {step.status === 'done' ? <CheckCircle2 size={14} className="text-[#a08060]" /> : 
                               step.status === 'current' ? <Loader2 size={14} className="text-[#f5e8d8] animate-spin" /> : 
                               <Circle size={14} className="text-[#5a3820]" />}
                              <span className={`text-[13px] ${step.status === 'done' ? 'text-[#a08060] line-through decoration-[rgba(160,128,96,0.3)]' : step.status === 'current' ? 'text-[#f5e8d8]' : 'text-[#5a3820]'}`}>
                                {step.text}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : msg.isError ? (
                     <div className="flex flex-col">
                      <div className="text-[10px] font-semibold text-[#e85d0a] tracking-[0.15em] mb-2">VELVET AGENT</div>
                      <div className="flex items-start gap-2 bg-[rgba(232,74,10,0.06)] border border-[rgba(232,74,10,0.3)] rounded-[4px_16px_16px_16px] p-4 text-[13px] text-[#f5e8d8]">
                        <AlertTriangle size={16} className="text-[#e85d0a] shrink-0 mt-0.5" />
                        <span>{msg.content}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      <div className="text-[10px] font-semibold text-[#e85d0a] tracking-[0.15em] mb-2">VELVET AGENT</div>
                      <div className="prose prose-invert prose-sm max-w-none bg-[rgba(201,74,10,0.04)] border border-[rgba(201,74,10,0.08)] rounded-[4px_16px_16px_16px] p-4">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* INPUT */}
      <div className="shrink-0 border-t border-[rgba(201,74,10,0.08)] p-3 bg-[#0a0605]">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Ask Velvet anything..."
          className="w-full min-h-[72px] max-h-[200px] bg-[#120b08] border border-[rgba(201,74,10,0.15)] rounded-xl text-[13px] text-[#f5e8d8] p-3 placeholder:text-[#5a3820] focus:border-[rgba(201,74,10,0.4)] focus:ring-[3px] focus:ring-[rgba(201,74,10,0.08)] focus:outline-none resize-none transition-all"
        />
        
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 bg-[#1c100a] border border-[rgba(201,74,10,0.12)] hover:border-[rgba(201,74,10,0.35)] rounded-full px-3 py-1 text-[12px] font-medium text-[#a08060] transition-colors">
              <Sparkles size={12} className="text-[#e85d0a]" />
              Agent
              <ChevronDown size={10} className="ml-1" />
            </button>
            <div className="flex items-center gap-1 bg-[#1c100a] border border-[rgba(201,74,10,0.12)] rounded-full px-2.5 py-1 text-[11px] font-medium text-[#5a3820]">
              ⚡ Auto
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="text-[#5a3820] hover:text-[#a08060] p-1.5 transition-colors">
              <Paperclip size={18} />
            </button>
            
            <button 
              onClick={handleSend}
              disabled={!inputValue.trim() || isGenerating || sandboxStatus !== "ready"}
              className={`flex items-center justify-center w-8 h-8 rounded-full transition-all ${
                inputValue.trim() && !isGenerating && sandboxStatus === "ready"
                  ? "bg-[#e85d0a] text-white shadow-[0_2px_12px_rgba(201,74,10,0.4)] hover:brightness-110 hover:scale-[1.05]" 
                  : "bg-[#1c100a] text-[#5a3820] cursor-not-allowed"
              }`}
            >
              {sandboxStatus === "creating" ? <Loader2 size={14} className="animate-spin" /> : <ArrowUp size={14} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
