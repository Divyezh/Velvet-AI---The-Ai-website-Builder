import { getE2BSandbox } from '@/lib/e2b-sandbox';
import OpenAI from 'openai';

const VELVET_AGENT_SYSTEM_PROMPT = `
You are VELVET AGENT — a world-class senior full-stack engineer.
You build complete, production-ready React + TypeScript + Tailwind applications
from plain English descriptions. You think like a staff engineer at Vercel or Linear.

OUTPUT FORMAT:
Return ONLY a valid JSON object. No markdown. No explanation. No text before or after.
Start with { and end with }.

{
  "plan": [
    "Set up Vite + React + TypeScript project",
    "Build component architecture",
    "Add interactivity and state management",
    "Style with Tailwind CSS",
    "Add localStorage persistence"
  ],
  "files": {
    "apps/web/src/App.tsx": "...complete file content...",
    "apps/web/src/index.css": "...complete file content...",
    "apps/web/src/components/Header.tsx": "...",
    "apps/web/src/components/MainContent.tsx": "...",
    "apps/web/tailwind.config.js": "..."
  },
  "commands": [
    "cd /app/apps/web && npm install -D tailwindcss postcss autoprefixer",
    "cd /app/apps/web && npx tailwindcss init -p"
  ],
  "devCommand": "cd /app/apps/web && npm run dev -- --host 0.0.0.0 --port 5173"
}

RULES:
1. Always include a plan array (3-6 steps describing what you're building)
2. Always include apps/web/src/App.tsx and apps/web/src/index.css
3. Split into components when a component exceeds 100 lines
4. Use TypeScript interfaces for all props and state
5. Use Tailwind CSS for all styling (add config if needed)
6. Only import: react, react-dom, lucide-react (pre-installed)
7. For routing: use useState to toggle views — no react-router-dom
8. For data: use localStorage for persistence, fetch() for APIs
9. For icons: lucide-react only
10. Make it ACTUALLY WORK end-to-end — no placeholder TODO comments

QUALITY BAR:
- Every app must look like it was designed by a senior product designer
- Dark theme for tech apps, appropriate theme for consumer apps  
- Every button must do something real
- Empty states must be beautiful and helpful
- Loading states must exist for all async operations
- Error states must exist and show actionable messages
- Mobile responsive by default
`;

export async function POST(req: Request) {
  const { prompt, sandboxId } = await req.json();

  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    async start(controller) {
      const emit = (event: any) => {
        controller.enqueue(encoder.encode(JSON.stringify(event) + '\n'));
      };

      try {
        emit({ type: "thinking", phase: "Analyzing prompt", toolsUsed: 0 });

        const openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY || 'mock',
          baseURL: process.env.OPENAI_BASE_URL || undefined,
        });

        emit({ type: "thinking", phase: "Planning project structure...", toolsUsed: 1 });

        let resultText = '';
        if (process.env.OPENAI_API_KEY) {
          const response = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL || "gpt-4o",
            messages: [
              { role: "system", content: VELVET_AGENT_SYSTEM_PROMPT },
              { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" }
          });
          resultText = response.choices[0].message.content || '{}';
        } else {
          // Mock response if no API key
          resultText = JSON.stringify({
            plan: ["Set up project", "Build UI", "Deploy"],
            files: {
              "apps/web/src/App.tsx": "export default function App() { return <div className='p-10 text-white'>Hello World</div> }",
              "apps/web/src/index.css": "@tailwind base;\n@tailwind components;\n@tailwind utilities;\nbody { background: #000; }"
            },
            commands: [],
            devCommand: "cd /app/apps/web && npm run dev -- --host 0.0.0.0 --port 5173"
          });
        }

        const data = JSON.parse(resultText);

        emit({ type: "plan", steps: data.plan, current: 0 });

        const sandbox = await getE2BSandbox(sandboxId);
        
        emit({ type: "thinking", phase: "Generating files...", toolsUsed: 2 });
        emit({ type: "plan_update", current: 1 });

        const filesCreated = [];
        for (const [path, content] of Object.entries(data.files || {})) {
          emit({ type: "file_start", path });
          // Ensure directory exists
          const dir = path.split('/').slice(0, -1).join('/');
          await sandbox.commands.run(`mkdir -p /app/${dir}`);
          
          await sandbox.files.write(`/app/${path}`, content as string);
          
          filesCreated.push(path);
          emit({ type: "file_done", path, fullContent: content });
        }

        emit({ type: "thinking", phase: "Installing dependencies...", toolsUsed: 3 });
        emit({ type: "plan_update", current: 2 });

        for (const cmd of (data.commands || [])) {
          emit({ type: "terminal_cmd", cmd });
          const exec = await sandbox.commands.run(cmd);
          if (exec.stdout) {
            const lines = exec.stdout.split('\n');
            for (const line of lines) if (line) emit({ type: "terminal_out", line });
          }
          if (exec.stderr) {
             const lines = exec.stderr.split('\n');
             for (const line of lines) if (line) emit({ type: "terminal_out", line });
          }
          emit({ type: "terminal_done", cmd, exitCode: exec.exitCode });
        }

        emit({ type: "thinking", phase: "Starting dev server...", toolsUsed: 4 });
        emit({ type: "plan_update", current: data.plan.length - 1 });
        
        // We already started it in create, but we can restart or just trigger a reload
        
        emit({ type: "server_start", url: `https://5173-${sandbox.sandboxId}.e2b.dev` });
        emit({ type: "done", previewUrl: `https://5173-${sandbox.sandboxId}.e2b.dev`, filesCreated });
        
        controller.close();
      } catch (error: any) {
        console.error("Generation error:", error);
        emit({ type: "error", message: error.message || "Unknown error", recoverable: true });
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'application/x-ndjson',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
