"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import heroBg from "../assets/Generated image 1.png";

// ── STACK ICONS (SVG inline, neutral color, hover mars-orange) ──
const stacks = [
  { name: "React",      icon: "⚛", color: "#61dafb" },
  { name: "Next.js",    icon: "▲", color: "#ffffff" },
  { name: "Vite",       icon: "⚡", color: "#646cff" },
  { name: "Vue",        icon: "◈", color: "#42b883" },
  { name: "Angular",    icon: "Ⓐ", color: "#dd0031" },
  { name: "TypeScript", icon: "TS", color: "#3178c6" },
  { name: "Svelte",     icon: "✦", color: "#ff3e00" },
  { name: "Remix",      icon: "R", color: "#ffffff"  },
  { name: "Astro",      icon: "✶", color: "#ff5d01" },
  { name: "Nuxt",       icon: "N", color: "#00dc82" },
];

const exampleChips = [
  "Build a todo app in React using Tailwind",
  "Create a mobile app landing page",
  "Build a simple blog using Astro",
  "Create a cookie consent form using Material UI",
  "Make a space invaders game",
  "Make a Tic Tac Toe game in html, css and js only",
];

const actionButtons = [
  {
    label: "Import Chat",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
  {
    label: "Import Folder",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
        <line x1="12" y1="11" x2="12" y2="17"/>
        <polyline points="9,14 12,17 15,14"/>
      </svg>
    ),
  },
  {
    label: "Clone a repo",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/>
        <path d="M6 21V9a9 9 0 0 0 9 9"/>
      </svg>
    ),
  },
];

export default function HomePage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files as FileList)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // auto-grow textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  }, [prompt]);

  function handleChip(chip: string) {
    setPrompt(chip);
    textareaRef.current?.focus();
  }

  function handleStack(stack: string) {
    setPrompt(`Build a ${stack} app — `);
    textareaRef.current?.focus();
  }

  async function handleSubmit() {
    if (!prompt.trim() || isSubmitting) return;
    setIsSubmitting(true);
    const encoded = encodeURIComponent(prompt.trim());
    router.push(`/sandbox?prompt=${encoded}`);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg:            #060404;
          --surface:       #120b08;
          --elevated:      #1c100a;
          --border:        rgba(201,74,10,0.15);
          --border-dim:    rgba(201,74,10,0.08);
          --accent:        #e85d0a;
          --accent-dim:    #c94a0a;
          --accent-glow:   rgba(232,93,10,0.25);
          --text:          #f5e8d8;
          --text-2:        #a08060;
          --text-3:        #5a3820;
          --font-display:  'Space Grotesk', sans-serif;
          --font-body:     'Inter', sans-serif;
          --font-mono:     'JetBrains Mono', monospace;
        }

        html, body { height: 100%; overflow-x: hidden; }

        .home-root {
          min-height: 100vh;
          background: transparent;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-family: var(--font-body);
          position: relative;
          overflow: hidden;
          padding: 80px 24px 40px;
        }

        /* ── BACKGROUND IMAGE ── */
        .bg-image {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: url('${heroBg.src}');
          background-size: cover;
          background-position: top center;
          background-repeat: no-repeat;
          pointer-events: none;
          z-index: 0;
          opacity: 0.6;
        }
        
        .bg-overlay {
          position: fixed;
          inset: 0;
          background: linear-gradient(to bottom, transparent 0%, rgba(6,4,4,0.6) 50%, rgba(6,4,4,1) 100%);
          z-index: 0;
          pointer-events: none;
        }

        /* Atmosphere rim */
        .mars-rim {
          position: fixed;
          top: calc(48vh - 1px);
          left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg,
            transparent 0%, rgba(240,112,48,0.25) 20%,
            rgba(240,112,48,0.7) 50%,
            rgba(240,112,48,0.25) 80%, transparent 100%
          );
          box-shadow: 0 0 24px 6px rgba(240,112,48,0.18);
          pointer-events: none;
          z-index: 0;
        }

        /* Center ambient glow */
        .mars-glow {
          position: fixed;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 700px; height: 400px;
          background: radial-gradient(ellipse, rgba(201,74,10,0.08) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
          animation: glowPulse 6s ease-in-out infinite;
        }

        @keyframes glowPulse {
          0%, 100% { opacity: 0.6; }
          50%       { opacity: 1; }
        }

        /* ── CONTENT ── */
        .content {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 720px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
        }

        /* Logo */
        .logo {
          font-family: var(--font-display);
          font-size: 18px;
          font-weight: 700;
          color: var(--text);
          letter-spacing: -0.01em;
          margin-bottom: 48px;
          opacity: 0;
          animation: fadeUp 0.6s ease forwards;
          animation-delay: 0.1s;
        }
        .logo span { color: var(--accent); }

        /* Headline */
        .headline {
          font-family: var(--font-display);
          font-size: clamp(40px, 7vw, 72px);
          font-weight: 700;
          color: var(--text);
          text-align: center;
          line-height: 1.05;
          letter-spacing: -0.02em;
          margin-bottom: 16px;
          opacity: 0;
          animation: fadeUp 0.7s ease forwards;
          animation-delay: 0.2s;
        }

        .subline {
          font-family: var(--font-body);
          font-size: 17px;
          font-weight: 300;
          color: var(--text-2);
          text-align: center;
          line-height: 1.6;
          margin-bottom: 40px;
          opacity: 0;
          animation: fadeUp 0.7s ease forwards;
          animation-delay: 0.35s;
        }

        /* ── PROMPT BOX ── */
        .prompt-box {
          width: 100%;
          background: rgba(18, 11, 8, 0.85);
          border: 1px solid var(--border);
          border-radius: 18px;
          backdrop-filter: blur(16px);
          overflow: hidden;
          box-shadow:
            0 8px 40px rgba(0,0,0,0.6),
            0 0 0 1px rgba(201,74,10,0.06);
          transition: border-color 300ms, box-shadow 300ms;
          opacity: 0;
          animation: fadeUp 0.7s ease forwards;
          animation-delay: 0.45s;
        }

        .prompt-box:focus-within {
          border-color: rgba(201,74,10,0.4);
          box-shadow:
            0 8px 40px rgba(0,0,0,0.7),
            0 0 30px rgba(201,74,10,0.12),
            0 0 0 1px rgba(201,74,10,0.18);
        }

        .files-preview {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          padding: 16px 20px 0;
        }

        .file-chip {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(201, 74, 10, 0.15);
          border: 1px solid rgba(201, 74, 10, 0.3);
          border-radius: 8px;
          padding: 6px 10px;
          font-family: var(--font-body);
          font-size: 13px;
          color: var(--text);
        }

        .file-name {
          max-width: 150px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .file-remove {
          background: transparent;
          border: none;
          color: var(--text-2);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2px;
          border-radius: 4px;
          transition: background 150ms;
        }

        .file-remove:hover {
          background: rgba(255, 255, 255, 0.1);
          color: var(--text);
        }

        /* Textarea */
        .prompt-textarea {
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          resize: none;
          color: var(--text);
          font-family: var(--font-body);
          font-size: 15px;
          font-weight: 400;
          line-height: 1.6;
          padding: 20px 20px 4px;
          min-height: 80px;
          max-height: 200px;
          overflow-y: auto;
        }

        .prompt-textarea::placeholder {
          color: var(--text-3);
        }

        .prompt-textarea::-webkit-scrollbar { width: 3px; }
        .prompt-textarea::-webkit-scrollbar-thumb { background: var(--elevated); border-radius: 99px; }

        /* Bottom bar of prompt box */
        .prompt-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px 16px;
          gap: 8px;
        }

        .prompt-actions-left {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .icon-btn {
          width: 32px; height: 32px;
          border-radius: 8px;
          background: transparent;
          border: none;
          color: var(--text-3);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: all 150ms ease;
        }
        .icon-btn:hover { background: rgba(201,74,10,0.1); color: var(--text-2); }
        .icon-btn svg { width: 16px; height: 16px; }

        /* Enhance prompt AI button */
        .enhance-btn {
          display: flex; align-items: center; gap: 6px;
          background: transparent;
          border: 1px solid var(--border-dim);
          border-radius: 8px;
          color: var(--text-3);
          font: 500 12px var(--font-body);
          padding: 5px 10px;
          cursor: pointer;
          transition: all 150ms;
        }
        .enhance-btn:hover { border-color: var(--border); color: var(--text-2); background: rgba(201,74,10,0.06); }

        /* Send button */
        .send-btn {
          width: 36px; height: 36px;
          border-radius: 10px;
          border: none;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: all 200ms ease;
          flex-shrink: 0;
        }

        .send-btn.active {
          background: linear-gradient(135deg, var(--accent-dim), var(--accent));
          box-shadow: 0 4px 16px rgba(201,74,10,0.45);
          color: #fff;
        }

        .send-btn.active:hover {
          filter: brightness(1.12);
          transform: scale(1.05);
        }

        .send-btn.inactive {
          background: var(--elevated);
          color: var(--text-3);
          cursor: not-allowed;
        }

        .send-btn svg { width: 16px; height: 16px; }

        /* ── ACTION BUTTONS ── */
        .action-row {
          display: flex;
          gap: 10px;
          margin-top: 20px;
          flex-wrap: wrap;
          justify-content: center;
          opacity: 0;
          animation: fadeUp 0.7s ease forwards;
          animation-delay: 0.55s;
        }

        .action-btn {
          display: flex; align-items: center; gap: 8px;
          background: rgba(18,11,8,0.7);
          border: 1px solid rgba(201,74,10,0.12);
          border-radius: 10px;
          color: var(--text-2);
          font: 500 13px var(--font-body);
          padding: 10px 18px;
          cursor: pointer;
          backdrop-filter: blur(8px);
          transition: all 200ms ease;
        }
        .action-btn:hover {
          border-color: rgba(201,74,10,0.3);
          color: var(--text);
          background: rgba(201,74,10,0.08);
        }
        .action-btn svg { color: var(--text-3); transition: color 200ms; }
        .action-btn:hover svg { color: var(--accent); }

        /* ── EXAMPLE CHIPS ── */
        .chips-label {
          font: 400 13px var(--font-body);
          color: var(--text-3);
          margin-top: 28px;
          margin-bottom: 10px;
          text-align: center;
          opacity: 0;
          animation: fadeUp 0.7s ease forwards;
          animation-delay: 0.65s;
        }

        .chips-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: center;
          max-width: 680px;
          opacity: 0;
          animation: fadeUp 0.7s ease forwards;
          animation-delay: 0.72s;
        }

        .chip {
          background: rgba(18,11,8,0.6);
          border: 1px solid rgba(201,74,10,0.1);
          border-radius: 999px;
          color: var(--text-2);
          font: 400 12px var(--font-body);
          padding: 6px 14px;
          cursor: pointer;
          backdrop-filter: blur(8px);
          transition: all 200ms ease;
          white-space: nowrap;
        }
        .chip:hover {
          border-color: rgba(201,74,10,0.35);
          color: var(--text);
          background: rgba(201,74,10,0.08);
        }

        /* ── STACK SECTION ── */
        .stack-label {
          font: 400 13px var(--font-body);
          color: var(--text-3);
          margin-top: 32px;
          text-align: center;
          opacity: 0;
          animation: fadeUp 0.7s ease forwards;
          animation-delay: 0.8s;
        }

        .stack-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          justify-content: center;
          margin-top: 14px;
          max-width: 480px;
          opacity: 0;
          animation: fadeUp 0.7s ease forwards;
          animation-delay: 0.88s;
        }

        .stack-btn {
          width: 56px; height: 56px;
          border-radius: 14px;
          background: rgba(18,11,8,0.85);
          border: 1px solid rgba(201,74,10,0.15);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          font: 700 24px var(--font-mono);
          transition: all 200ms ease;
          backdrop-filter: blur(8px);
          position: relative;
        }
        .stack-btn:hover {
          border-color: rgba(201,74,10,0.5);
          background: rgba(201,74,10,0.12);
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.6);
        }

        /* Tooltip */
        .stack-btn::after {
          content: attr(data-name);
          position: absolute;
          bottom: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
          background: var(--elevated);
          border: 1px solid var(--border-dim);
          border-radius: 6px;
          padding: 4px 10px;
          font: 500 11px var(--font-body);
          color: var(--text-2);
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition: opacity 150ms;
        }
        .stack-btn:hover::after { opacity: 1; }

        /* ── ANIMATIONS ── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(201,74,10,0.3);
          border-top-color: var(--accent);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        /* Mobile */
        @media (max-width: 600px) {
          .home-root { padding: 60px 16px 40px; }
          .action-row { flex-direction: column; align-items: stretch; }
          .action-btn { justify-content: center; }
          .chips-row { gap: 6px; }
          .chip { font-size: 11px; padding: 5px 12px; }
        }
      `}</style>

      {/* Background Image */}
      <div className="bg-image" />
      <div className="bg-overlay" />
      <div className="mars-glow" />

      <main className="home-root">
        <div className="content">

          {/* Logo */}
          <div className="logo">VELVET<span>.AI</span></div>

          {/* Headline */}
          <h1 className="headline">Where ideas begin</h1>
          <p className="subline">
            Bring ideas to life in seconds or get help on existing projects.
          </p>

          {/* Prompt Box */}
          <div className="prompt-box">
            <input 
              type="file" 
              multiple 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              style={{ display: 'none' }} 
            />
            {files.length > 0 && (
              <div className="files-preview">
                {files.map((file, i) => (
                  <div key={i} className="file-chip" title={file.name}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                      <polyline points="13 2 13 9 20 9"></polyline>
                    </svg>
                    <span className="file-name">{file.name}</span>
                    <button className="file-remove" onClick={() => removeFile(i)} title="Remove file">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
            <textarea
              ref={textareaRef}
              className="prompt-textarea"
              placeholder="How can Velvet help you today?"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={3}
            />
            <div className="prompt-bottom">
              <div className="prompt-actions-left">
                {/* Attachment */}
                <button className="icon-btn" title="Attach file" onClick={() => fileInputRef.current?.click()}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                  </svg>
                </button>
                {/* Enhance */}
                <button className="enhance-btn" title="Enhance prompt with AI">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                  </svg>
                  Enhance
                </button>
              </div>

              {/* Send */}
              <button
                className={`send-btn ${prompt.trim() && !isSubmitting ? "active" : "inactive"}`}
                onClick={handleSubmit}
                disabled={!prompt.trim() || isSubmitting}
              >
                {isSubmitting ? (
                  <div className="spinner" />
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="19" x2="12" y2="5"/>
                    <polyline points="5,12 12,5 19,12"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-row">
            {actionButtons.map(btn => (
              <button key={btn.label} className="action-btn">
                {btn.icon}
                {btn.label}
              </button>
            ))}
          </div>

          {/* Example Chips */}
          <div className="chips-row" style={{ marginTop: "28px" }}>
            {exampleChips.map(chip => (
              <button key={chip} className="chip" onClick={() => handleChip(chip)}>
                {chip}
              </button>
            ))}
          </div>

          {/* Stack */}
          <p className="stack-label">or start a blank app with your favorite stack</p>
          <div className="stack-grid">
            {stacks.map(s => (
              <button
                key={s.name}
                className="stack-btn"
                data-name={s.name}
                onClick={() => handleStack(s.name)}
                title={s.name}
                style={{ color: s.color }}
              >
                {s.icon}
              </button>
            ))}
          </div>

        </div>
      </main>
    </>
  );
}
