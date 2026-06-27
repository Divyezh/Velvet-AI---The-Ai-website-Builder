
const qwenClient = {
  async chat(messages: any[], system: string, maxTokens = 8000) {
    const res = await fetch(
      "https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.QWEN_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "qwen-plus",
          messages: [{ role: "system", content: system }, ...messages],
          max_tokens: maxTokens,
          temperature: 0.2,
          stream: false,
        }),
      }
    );
    if (!res.ok) throw new Error(`Qwen API ${res.status}: ${await res.text()}`);
    const data = await res.json();
    return data?.choices?.[0]?.message?.content ?? "";
  },
};

// ── DETECT INTENT FROM USER PROMPT ──
export type Intent =
  | "generate_project"   // build a new app
  | "generate_component" // add a component to existing
  | "run_command"        // user wants terminal cmd
  | "explain_files"      // user uploaded files, wants analysis
  | "modify_existing"    // edit existing generated code
  | "ask_question"       // general question, no code needed
  | "unknown";

export interface IntentResult {
  intent: Intent;
  framework: string | null;       // "react" | "nextjs" | "vue" | "svelte" | "astro" | null
  projectType: string | null;     // "todo" | "dashboard" | "saas" | "blog" etc.
  commands: string[];             // shell commands to run
  hasFileContext: boolean;        // user uploaded files
  confidence: number;             // 0-1
  summary: string;                // one-line description
}

export async function detectIntent(
  prompt: string,
  uploadedFiles?: UploadedFile[]
): Promise<IntentResult> {
  const hasFiles = uploadedFiles && uploadedFiles.length > 0;

  const raw = await qwenClient.chat(
    [{ role: "user", content: prompt }],
    `You are an intent classifier for an AI code generator called VELVET.AI.
Analyze the user's prompt and return ONLY a JSON object — no markdown, no explanation.

JSON shape:
{
  "intent": "generate_project" | "generate_component" | "run_command" | "explain_files" | "modify_existing" | "ask_question",
  "framework": "react" | "nextjs" | "vue" | "svelte" | "astro" | "vanilla" | null,
  "projectType": "todo" | "dashboard" | "saas-landing" | "blog" | "ecommerce" | "portfolio" | "game" | "tool" | "other" | null,
  "commands": ["npm install X", "npx create-vite@latest ..."],
  "hasFileContext": ${hasFiles},
  "confidence": 0.95,
  "summary": "Build a React todo app with Tailwind CSS"
}

Rules:
- If user mentions a framework explicitly → detect it
- If user says "create", "build", "make", "generate" → generate_project
- If user says "add", "create a component", "add a section" → generate_component
- If user says "run", "install", "execute" → run_command
- If files are uploaded and user asks about them → explain_files
- If user says "change", "fix", "update", "refactor" → modify_existing
- commands array: include ONLY the shell commands needed BEFORE code generation
  e.g. ["npx create-vite@latest . --template react-ts", "npm install -D tailwindcss"]
  For pure React/Vite projects that just need new files: commands = []
- Return ONLY valid JSON`,
    1000
  );

  try {
    const cleaned = raw.replace(/```json\s*/gi, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return {
      intent: "generate_project",
      framework: "react",
      projectType: "other",
      commands: [],
      hasFileContext: hasFiles ?? false,
      confidence: 0.5,
      summary: prompt.slice(0, 80),
    };
  }
}

// ── SCAN UPLOADED FILES ──
export interface UploadedFile {
  name: string;
  content: string;
  type: string; // "tsx" | "css" | "json" | "md" | "txt" | "image" etc.
  size: number;
}

export interface FileAnalysis {
  framework: string;
  techStack: string[];
  existingComponents: string[];
  colorScheme: string[];
  dependencies: string[];
  patterns: string[];          // coding patterns detected
  issues: string[];            // problems found
  suggestions: string[];       // what AI would improve
  summary: string;
}

export async function scanUploadedFiles(files: UploadedFile[]): Promise<FileAnalysis> {
  const fileContext = files.map(f => `
=== FILE: ${f.name} (${f.type}) ===
${f.content.slice(0, 3000)}${f.content.length > 3000 ? "\n... [truncated]" : ""}
`).join("\n");

  const raw = await qwenClient.chat(
    [{ role: "user", content: `Analyze these files:\n${fileContext}` }],
    `You are a senior code analyst. Scan the provided files and return ONLY a JSON object.

JSON shape:
{
  "framework": "react" | "nextjs" | "vue" | "vanilla" | "unknown",
  "techStack": ["TypeScript", "Tailwind CSS", "Framer Motion"],
  "existingComponents": ["Navbar", "HeroSection", "PricingCard"],
  "colorScheme": ["#060404", "#e85d0a", "#f5e8d8"],
  "dependencies": ["framer-motion", "lucide-react"],
  "patterns": ["functional components", "custom hooks", "CSS modules"],
  "issues": ["missing error boundaries", "no loading states", "inline styles"],
  "suggestions": ["extract magic numbers to CSS vars", "add TypeScript strict mode"],
  "summary": "A Next.js 14 app with Mars theme, uses Tailwind, missing mobile nav"
}

Be precise. Only list what you actually find in the files.`,
    2000
  );

  try {
    const cleaned = raw.replace(/```json\s*/gi, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return {
      framework: "unknown",
      techStack: [],
      existingComponents: [],
      colorScheme: [],
      dependencies: [],
      patterns: [],
      issues: [],
      suggestions: [],
      summary: "Could not fully analyze files",
    };
  }
}

// ── BUILD COMMANDS FOR FRAMEWORK ──
export function buildCommands(
  intent: IntentResult,
  sandboxRootPath = "/app"
): string[] {
  const { framework, commands } = intent;

  // If the AI already gave us specific commands, use those
  if (commands.length > 0) return commands;

  // Auto-build based on framework
  const base = sandboxRootPath;

  const frameworkCommands: Record<string, string[]> = {
    react: [
      `cd ${base} && npm create vite@latest web --template react-ts --yes`,
      `cd ${base}/web && npm install`,
      `cd ${base}/web && npm install -D tailwindcss postcss autoprefixer`,
      `cd ${base}/web && npx tailwindcss init -p`,
      `cd ${base}/web && npm install lucide-react`,
    ],
    nextjs: [
      `cd ${base} && npx create-next-app@latest web --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*" --yes`,
      `cd ${base}/web && npm install lucide-react framer-motion`,
    ],
    vue: [
      `cd ${base} && npm create vue@latest web -- --typescript --tailwind --yes`,
      `cd ${base}/web && npm install`,
    ],
    svelte: [
      `cd ${base} && npm create svelte@latest web`,
      `cd ${base}/web && npm install`,
      `cd ${base}/web && npx svelte-add@latest tailwindcss`,
    ],
    astro: [
      `cd ${base} && npm create astro@latest web -- --template minimal --yes`,
      `cd ${base}/web && npm install`,
      `cd ${base}/web && npx astro add tailwind --yes`,
    ],
    vanilla: [
      `cd ${base} && npm create vite@latest web --template vanilla-ts --yes`,
      `cd ${base}/web && npm install`,
    ],
  };

  return frameworkCommands[framework ?? "react"] ?? frameworkCommands.react;
}

// ── MASTER GENERATION FUNCTION ──
export interface GenerationPlan {
  steps: string[];
  files: Record<string, string>;
  devCommand: string;
  previewPort: number;
}

export async function generateCode(
  prompt: string,
  intent: IntentResult,
  fileAnalysis?: FileAnalysis,
  existingFiles?: Record<string, string>
): Promise<GenerationPlan> {
  // Build rich context for the AI
  const fileContext = fileAnalysis
    ? `\nEXISTING PROJECT CONTEXT:\n${JSON.stringify(fileAnalysis, null, 2)}`
    : "";

  const existingCode = existingFiles
    ? `\nEXISTING FILES:\n${Object.entries(existingFiles)
        .slice(0, 5)
        .map(([p, c]) => `// ${p}\n${c.slice(0, 1500)}`)
        .join("\n\n")}`
    : "";

  const framework = intent.framework ?? "react";
  const systemPrompt = buildSystemPrompt(framework, fileAnalysis);

  const raw = await qwenClient.chat(
    [{
      role: "user",
      content: `${prompt}${fileContext}${existingCode}`,
    }],
    systemPrompt,
    12000
  );

  return parseGenerationResponse(raw, framework);
}

function parseGenerationResponse(raw: string, framework: string): GenerationPlan {
  const cleaned = raw
    .replace(/^```json\s*/gim, "")
    .replace(/^```\s*/gim, "")
    .replace(/\s*```$/gim, "")
    .trim();

  try {
    const parsed = JSON.parse(cleaned);
    return {
      steps: parsed.plan ?? ["Generating your app..."],
      files: parsed.files ?? {},
      devCommand: parsed.devCommand ?? getDevCommand(framework),
      previewPort: parsed.previewPort ?? 5173,
    };
  } catch {
    // Fallback: extract code blocks
    const files: Record<string, string> = {};
    const matches = [...raw.matchAll(/\/\/ FILE: ([^\n]+)\n([\s\S]*?)(?=\/\/ FILE:|$)/g)];
    for (const [, path, content] of matches) {
      files[path.trim()] = content.trim();
    }
    return {
      steps: ["Building your project..."],
      files,
      devCommand: getDevCommand(framework),
      previewPort: 5173,
    };
  }
}

function getDevCommand(framework: string): string {
  const cmds: Record<string, string> = {
    react: "cd /app/web && npm run dev -- --host 0.0.0.0 --port 5173",
    nextjs: "cd /app/web && npm run dev -- --hostname 0.0.0.0 --port 3001",
    vue: "cd /app/web && npm run dev -- --host 0.0.0.0 --port 5173",
    svelte: "cd /app/web && npm run dev -- --host 0.0.0.0 --port 5173",
    astro: "cd /app/web && npm run dev -- --host 0.0.0.0 --port 4321",
    vanilla: "cd /app/web && npm run dev -- --host 0.0.0.0 --port 5173",
  };
  return cmds[framework] ?? cmds.react;
}

// ── SYSTEM PROMPT BUILDER (adapts per framework + file context) ──
function buildSystemPrompt(framework: string, analysis?: FileAnalysis): string {
  const colorContext = analysis?.colorScheme.length
    ? `\nUSER'S EXISTING COLOR SCHEME: ${analysis.colorScheme.join(", ")} — match this palette.`
    : "";

  const techContext = analysis?.techStack.length
    ? `\nUSER'S TECH STACK: ${analysis.techStack.join(", ")} — use the same tech.`
    : "";

  const issueContext = analysis?.issues.length
    ? `\nFIX THESE ISSUES FROM THEIR EXISTING CODE: ${analysis.issues.join(", ")}`
    : "";

  const frameworkRules: Record<string, string> = {
    react: `Stack: Vite + React 18 + TypeScript + Tailwind CSS + lucide-react
Files go in: web/src/
Entry: web/src/main.tsx → web/src/App.tsx
Components: web/src/components/ComponentName.tsx
Styles: web/src/index.css (global), per-component Tailwind classes inline
Do NOT include: package.json, vite.config.ts, index.html (already scaffolded)`,

    nextjs: `Stack: Next.js 14 App Router + TypeScript + Tailwind CSS + lucide-react
Files go in: web/app/ and web/components/
Add "use client" at top of any component with hooks or interactivity
Do NOT include: package.json, next.config.js, tailwind.config.js (already scaffolded)`,

    vue: `Stack: Vue 3 + TypeScript + Vite + Tailwind CSS
Files: web/src/components/*.vue, web/src/App.vue
Use Composition API (<script setup lang="ts">)`,

    svelte: `Stack: SvelteKit + TypeScript + Tailwind CSS
Files: web/src/routes/+page.svelte, web/src/lib/components/*.svelte`,

    astro: `Stack: Astro + TypeScript + Tailwind CSS
Files: web/src/pages/index.astro, web/src/components/*.astro`,

    vanilla: `Stack: Vanilla TypeScript + Vite
Files: web/src/main.ts, web/src/style.css`,
  };

  return `You are VELVET AGENT — a world-class senior full-stack engineer.
You generate complete, production-ready code from plain English descriptions.
Every app you build looks like it was designed by a $500/hr product designer and
built by a staff engineer at Linear or Vercel.${colorContext}${techContext}${issueContext}

FRAMEWORK: ${framework.toUpperCase()}
${frameworkRules[framework] ?? frameworkRules.react}

OUTPUT FORMAT:
Return ONLY a valid JSON object. Nothing else. No markdown fences. No explanation.
Start with { and end with }.

{
  "plan": [
    "Set up component architecture",
    "Build core UI with Tailwind",
    "Add interactivity and state",
    "Wire up localStorage persistence",
    "Polish animations and transitions"
  ],
  "files": {
    "web/src/App.tsx": "complete file content here",
    "web/src/index.css": "complete CSS here",
    "web/src/components/Header.tsx": "complete component here"
  },
  "devCommand": "cd /app/web && npm run dev -- --host 0.0.0.0 --port 5173",
  "previewPort": 5173
}

QUALITY RULES — every app must pass all of these:
✓ FUNCTIONAL: every button, form, and input actually works
✓ BEAUTIFUL: professional design matching user's color scheme or a great default
✓ TYPED: TypeScript interfaces for all props and state — no implicit any
✓ RESPONSIVE: mobile-first, tested at 375px and 1200px breakpoints
✓ ACCESSIBLE: aria labels on all icon buttons, focus rings visible
✓ PERSISTENT: localStorage for any user data that should survive refresh
✓ STATES: loading, empty, and error states for all async operations
✓ ANIMATED: CSS transitions on all interactive elements (200ms ease)
✓ SPLIT: components in separate files when > 80 lines

DESIGN DEFAULTS (use unless user specifies otherwise):
- Dark theme: bg #060404, surface #120b08, accent #e85d0a
- Font: Inter (body), Space Grotesk (headings)
- Border radius: 8px small, 12px medium, 16px large, 999px pills
- Spacing: 8px grid (8, 16, 24, 32, 48, 64px)
- Box shadows: 0 4px 24px rgba(0,0,0,0.4)
- Import Google Fonts via @import in CSS

CRITICAL:
✗ Never output placeholder text like "// TODO" or "// implement here"
✗ Never import packages not in the available list
✗ Never leave any function empty — implement everything
✗ Never use inline styles when a Tailwind class exists
✓ Every component file must have its TypeScript interface defined above it
✓ Return ONLY the JSON. The entire response is the JSON object.`;
}

export default qwenClient;
