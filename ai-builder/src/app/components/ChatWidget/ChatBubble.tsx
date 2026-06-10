"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChatMessage } from "./chat.types";
import { Sparkles } from "lucide-react";

interface ChatBubbleProps {
  message: ChatMessage;
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isAssistant = message.role === "assistant";
  
  // Format timestamp (e.g., "10:23 AM")
  const formattedTime = message.timestamp.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const bubbleVariants = isAssistant
    ? {
        initial: { opacity: 0, y: 10, x: -12 },
        animate: { opacity: 1, y: 0, x: 0, transition: { duration: 0.2, ease: "easeOut" as const } },
      }
    : {
        initial: { opacity: 0, y: 10, x: 12 },
        animate: { opacity: 1, y: 0, x: 0, transition: { duration: 0.2, ease: "easeOut" as const } },
      };

  return (
    <motion.div
      variants={bubbleVariants}
      initial="initial"
      animate="animate"
      className={`flex w-full gap-2.5 mb-4 ${
        isAssistant ? "justify-start" : "justify-end"
      }`}
    >
      {/* Assistant Avatar */}
      {isAssistant && (
        <div className="w-7 h-7 rounded-full bg-black-surface border border-white/10 flex items-center justify-center shrink-0 shadow shadow-black/50">
          <Sparkles className="w-3.5 h-3.5 text-red-vivid" />
        </div>
      )}

      {/* Bubble + Meta */}
      <div className={`flex flex-col max-w-[80%] ${isAssistant ? "items-start" : "items-end"}`}>
        <div
          className={`px-3.5 py-3 text-sm leading-relaxed ${
            isAssistant
              ? "bg-black-surface border border-white/5 text-[#e0e0e0] rounded-tr-2xl rounded-br-2xl rounded-bl-2xl font-light"
              : "bg-red-vivid text-white rounded-tl-2xl rounded-bl-2xl rounded-br-sm font-medium"
          }`}
        >
          {message.content}
        </div>
        
        {/* Timestamp */}
        <span className="text-[10px] text-neutral-600 mt-1.5 font-mono px-1">
          {formattedTime}
        </span>
      </div>
    </motion.div>
  );
}
