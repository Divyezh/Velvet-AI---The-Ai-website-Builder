"use client";
import { useState, useRef, useCallback } from "react";

interface Props {
  onFilesUploaded: (files: UploadedFileUI[]) => void;
}

export interface UploadedFileUI {
  name: string;
  type: string;
  size: number;
  content: string;
  preview: string;
  analysis?: any;
}

export default function FileUploadZone({ onFilesUploaded }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileUI[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(async (fileList: FileList) => {
    setIsUploading(true);
    const formData = new FormData();
    Array.from(fileList).forEach(f => formData.append("files", f));

    try {
      const res = await fetch("/api/sandbox/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (data.success) {
        const files: UploadedFileUI[] = data.files;
        setUploadedFiles(prev => [...prev, ...files]);
        onFilesUploaded(files);
      }
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setIsUploading(false);
    }
  }, [onFilesUploaded]);

  return (
    <div style={{ position: "relative" }}>
      {/* Hidden input */}
      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".tsx,.ts,.jsx,.js,.css,.html,.json,.md,.txt,.env"
        style={{ display: "none" }}
        onChange={e => e.target.files && handleFiles(e.target.files)}
      />

      {/* Trigger button (the paperclip icon in chat input) */}
      <button
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
        title="Attach files"
        style={{
          width: 32, height: 32,
          borderRadius: 8,
          background: "transparent",
          border: "none",
          color: isUploading ? "var(--accent)" : "var(--text-3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer",
          transition: "all 150ms",
        }}
      >
        {isUploading ? (
          <div style={{
            width: 14, height: 14,
            border: "2px solid rgba(201,74,10,0.3)",
            borderTopColor: "var(--accent)",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }} />
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
          </svg>
        )}
      </button>

      {/* Uploaded files chips (shown above input) */}
      {uploadedFiles.length > 0 && (
        <div style={{
          display: "flex", flexWrap: "wrap", gap: 6,
          padding: "8px 12px 0",
        }}>
          {uploadedFiles.map((f, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "rgba(201,74,10,0.1)",
              border: "1px solid rgba(201,74,10,0.25)",
              borderRadius: 6, padding: "3px 10px",
              font: "500 11px var(--font-body)",
              color: "var(--text-2)",
            }}>
              <span style={{ color: "var(--accent)", fontSize: 10 }}>●</span>
              {f.name}
              <button
                onClick={() => setUploadedFiles(prev => prev.filter((_, j) => j !== i))}
                style={{ background: "none", border: "none", color: "var(--text-3)", cursor: "pointer", padding: 0, fontSize: 14 }}
              >×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
