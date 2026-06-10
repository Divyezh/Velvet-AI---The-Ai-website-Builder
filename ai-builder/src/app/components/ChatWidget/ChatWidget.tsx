"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, Paperclip, Smile, X, Minus, Sparkles } from "lucide-react";
import { ChatMessage, ChatWidgetProps } from "./chat.types";
import { ChatBubble } from "./ChatBubble";
import { TypingIndicator } from "./TypingIndicator";

export default function ChatWidget({
  initialMessage,
  placeholder = "Ask anything...",
  assistantName = "AI Assistant",
  onSend,
}: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setUnreadCount(0);
      // Autofocus input on desktop
      if (window.innerWidth > 768) {
        inputRef.current?.focus();
      }
    }
  }, [isOpen, messages, isTyping]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Collapsed notification trigger simulation (unreads)
  useEffect(() => {
    // Show an initial suggestion count after 5 seconds if chat is closed
    const timer = setTimeout(() => {
      if (!isOpen && messages.length === 0) {
        setUnreadCount(1);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [isOpen, messages]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    // 1. Add User Message
    const userMsg: ChatMessage = {
      id: Math.random().toString(36).substring(7),
      role: "user",
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");

    // 2. Trigger Typing Indicator
    setIsTyping(true);

    // 3. Simulate AI delay responses
    setTimeout(async () => {
      let aiResponse = "";
      
      if (onSend) {
        try {
          aiResponse = await onSend(text);
        } catch {
          aiResponse = "Apologies, I encountered an issue compiling that request.";
        }
      } else {
        // Fallback default prompt router
        const userPrompt = text.toLowerCase();
        if (userPrompt.includes("start") || userPrompt.includes("build") || userPrompt.includes("get started")) {
          aiResponse = "Great! To compile a website instantly, write a prompt in the input block on the hero section above or in the builder playground, then click 'Regenerate Site'.";
        } else if (userPrompt.includes("price") || userPrompt.includes("pricing") || userPrompt.includes("cost")) {
          aiResponse = "We offer 3 tiers: Starter ($0), Pro Designer ($24/mo), and Enterprise Studio ($89/mo). Pro Designer unlocks unlimited websites, custom domains, and light/dark theme logic.";
        } else if (userPrompt.includes("feature") || userPrompt.includes("capability") || userPrompt.includes("what can")) {
          aiResponse = "Velvet compiles custom CSS layouts, typography sets (featuring Bebas Neue display titles), responsive grid systems, privacy-first visitor analytics, and edge deployment endpoints.";
        } else {
          aiResponse = "I am your design compilation assistant. Feel free to ask about builder layouts, custom domains, pricing packages, or prompt tips!";
        }
      }

      const assistantMsg: ChatMessage = {
        id: Math.random().toString(36).substring(7),
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);

      // Trigger unread counter if closed
      if (!isOpen) {
        setUnreadCount((c) => c + 1);
      }
    }, 1200);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    // Auto-grow textarea
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 100)}px`;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  return (
    <>
      {/* 1. COLLAPSED TRIGGER BUTTON */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            aria-label="Open chat support"
            className="fixed bottom-7 right-7 w-14 h-14 rounded-full bg-red-vivid text-white flex items-center justify-center cursor-pointer shadow-[0_8px_32px_rgba(232,35,42,0.45)] hover:scale-108 active:scale-95 transition-all duration-300 z-50 group"
          >
            {/* Pulsing ring animation */}
            <motion.span
              animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
              className="absolute inset-0 rounded-full bg-red-vivid/40 pointer-events-none"
            />
            
            <MessageSquare className="w-6 h-6 relative z-10" />

            {/* Unread Badge */}
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 rounded-full bg-white text-red-vivid text-xs font-bold flex items-center justify-center shadow-lg border border-red-vivid z-20">
                {unreadCount}
              </span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* 2. CHAT PANEL WIDGET */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" as const }}
            role="dialog"
            aria-modal="true"
            aria-label="AI chat assistant"
            className="fixed bottom-0 right-0 md:bottom-24 md:right-7 w-full h-full md:w-[380px] md:h-[560px] bg-black-card border border-white/5 md:rounded-2xl overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.85),0_0_0_1px_rgba(232,35,42,0.06)] flex flex-col z-50 origin-bottom-right"
          >
            {/* Brand red accent stripe */}
            <div className="h-[2px] w-full bg-red-vivid"></div>

            {/* PANEL HEADER */}
            <div className="h-16 bg-linear-to-r from-[#1a0608] to-[#150404] border-b border-white/5 flex items-center justify-between px-4">
              <div className="flex items-center gap-2.5">
                {/* Glowing Green Online Status indicator */}
                <div className="relative w-2.5 h-2.5 shrink-0">
                  <motion.span
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="absolute inset-0 rounded-full bg-green-stat"
                  />
                  <span className="absolute inset-0 rounded-full bg-green-stat/40 animate-ping"></span>
                </div>
                <div>
                  <h4 className="text-[14px] font-semibold text-white tracking-wide">{assistantName}</h4>
                  <p className="text-[11px] text-[#666666] font-light">Online · Typically replies instantly</p>
                </div>
              </div>

              {/* Header Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Minimize chat"
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-neutral-800 transition-colors flex items-center justify-center text-[#999999] hover:text-white"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Close chat"
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-red-vivid/15 transition-colors flex items-center justify-center text-[#999999] hover:text-red-vivid"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* MESSAGES AREA */}
            <div className="flex-1 overflow-y-auto p-5 bg-black-card space-y-4 no-scrollbar">
              
              {/* Permanent Welcome Header block at scroll top */}
              <div className="flex flex-col items-center text-center py-6 border-b border-white/5 mb-6">
                <div className="w-12 h-12 rounded-full bg-black-surface border border-white/10 flex items-center justify-center shadow shadow-black mb-4">
                  <Sparkles className="w-6 h-6 text-red-vivid animate-pulse" />
                </div>
                <h2 className="text-base font-semibold text-white font-sans">How can I help you?</h2>
                <p className="text-xs text-[#666666] font-light mt-1 max-w-[240px] leading-relaxed">
                  Ask me anything about building or customizing your website.
                </p>

                {/* Suggestions quick replies */}
                {messages.length === 0 && (
                  <div className="flex flex-col gap-2.5 mt-6 w-full px-4">
                    {[
                      { text: "Get started →" },
                      { text: "See pricing →" },
                      { text: "View features →" },
                    ].map((chip, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSuggestionClick(chip.text)}
                        className="w-full text-left bg-black-surface border border-white/10 text-[#aaaaaa] hover:text-white hover:border-red-vivid text-xs py-2.5 px-4 rounded-xl transition-all duration-200 border-l-2 border-l-white/10 hover:border-l-red-vivid hover:bg-red-vivid/5"
                      >
                        {chip.text}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Chat Thread Bubbles */}
              {messages.map((msg) => (
                <ChatBubble key={msg.id} message={msg} />
              ))}

              {/* Simulated typing indicator bubble */}
              {isTyping && (
                <div className="flex w-full gap-2.5 items-start justify-start animate-fade-up">
                  <div className="w-7 h-7 rounded-full bg-black-surface border border-white/10 flex items-center justify-center shrink-0 shadow shadow-black/50">
                    <Sparkles className="w-3.5 h-3.5 text-red-vivid" />
                  </div>
                  <TypingIndicator />
                </div>
              )}

              {/* Anchor block for auto-scroll */}
              <div ref={messagesEndRef} />
            </div>

            {/* INPUT AREA */}
            <div className="bg-[#0d0d0d] border-t border-white/5 p-3 flex items-end gap-2.5 relative">
              {/* Optional icons left */}
              <div className="flex gap-1 mb-1.5 text-neutral-600">
                <button className="p-1 hover:text-white transition-colors" aria-label="Attach file">
                  <Paperclip className="w-4 h-4" />
                </button>
                <button className="p-1 hover:text-white transition-colors" aria-label="Select emoji">
                  <Smile className="w-4 h-4" />
                </button>
              </div>

              {/* Textarea Input */}
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                rows={1}
                className="flex-1 bg-black-surface border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-red-vivid/50 focus:shadow-[0_0_0_3px_rgba(232,35,42,0.08)] resize-none max-h-[100px] font-sans font-light leading-relaxed transition-all"
              />

              {/* Send Button */}
              <button
                onClick={() => handleSendMessage(inputValue)}
                disabled={!inputValue.trim()}
                aria-label="Send message"
                className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                  inputValue.trim()
                    ? "bg-red-vivid text-white cursor-pointer hover:bg-red-mid hover:scale-105 shadow-[0_4px_16px_rgba(232,35,42,0.4)]"
                    : "bg-black-surface text-neutral-600 cursor-not-allowed"
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
