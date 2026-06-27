"use client";
import { useState, useCallback } from "react";

interface Toast { id: number; message: string; type: "success" | "error" | "info"; }

let toastFn: ((msg: string, type?: Toast["type"]) => void) | null = null;

export function useToast() {
  return { toast: (msg: string, type: Toast["type"] = "info") => toastFn?.(msg, type) };
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  toastFn = useCallback((message: string, type: Toast["type"] = "info") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);

  return (
    <div style={{ position: "fixed", bottom: 32, right: 32, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8 }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background: t.type === "error" ? "rgba(232,93,10,0.15)" : "var(--elevated)",
          border: `1px solid ${t.type === "error" ? "rgba(232,93,10,0.4)" : "var(--border)"}`,
          borderRadius: 10, padding: "10px 16px",
          font: "500 13px var(--font-body)",
          color: t.type === "success" ? "var(--green)" : t.type === "error" ? "var(--accent)" : "var(--text)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
          backdropFilter: "blur(12px)",
        }}>
          {t.message}
        </div>
      ))}
    </div>
  );
}
