import { NextResponse } from 'next/server';
import { createOrConnectSandbox, writeFile } from '@/lib/e2b';

const STARTER_FILES = {
  '/home/user/app/package.json': `{
  "name": "vite-react-tailwind",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --host 0.0.0.0 --port 5173",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "lucide-react": "^0.395.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.4",
    "typescript": "^5.2.2",
    "vite": "^5.3.1"
  }
}`,
  '/home/user/app/vite.config.ts': `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true
  }
});`,
  '/home/user/app/tailwind.config.js': `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`,
  '/home/user/app/postcss.config.js': `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`,
  '/home/user/app/index.html': `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>AI Website Preview</title>
  </head>
  <body class="bg-slate-950 text-white">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,
  '/home/user/app/src/main.tsx': `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`,
  '/home/user/app/src/index.css': `@tailwind base;
@tailwind components;
@tailwind utilities;`,
  '/home/user/app/src/App.tsx': `import React from 'react';
import { Sparkles, Code, Terminal, Eye } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-` + `to-br from-[#080810] to-[#121225] text-white flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-2xl text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm">
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span>Sandbox Ready</span>
        </div>
        
        <h1 className="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-` + `to-r from-teal-300 to-emerald-400">
          E2B AI Coding Sandbox
        </h1>
        
        <p className="text-slate-400 text-lg max-w-lg mx-auto">
          Your isolated development environment is active. The AI agent can now generate and modify files, install packages, and update this live preview in real-time.
        </p>

        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center gap-2 hover:bg-white/10 transition-colors">
            <Code className="w-6 h-6 text-teal-400" />
            <span className="text-sm font-semibold">Write Code</span>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center gap-2 hover:bg-white/10 transition-colors">
            <Terminal className="w-6 h-6 text-emerald-400" />
            <span className="text-sm font-semibold">Run Command</span>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center gap-2 hover:bg-white/10 transition-colors">
            <Eye className="w-6 h-6 text-blue-400" />
            <span className="text-sm font-semibold">Live Preview</span>
          </div>
        </div>
      </div>
    </div>
  );
}`
};

// Extend route timeout to 60 seconds (default is too short for E2B sandbox creation + file writes)
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { sandboxId } = await req.json().catch(() => ({}));

    // If sandboxId is specified, connect. If not, create a new one.
    const isNew = !sandboxId;
    const sandbox = await createOrConnectSandbox(sandboxId);

    if (isNew) {
      console.log('Initializing starter files in sandbox:', sandbox.sandboxId);

      // Create directory tree first with one command
      await sandbox.commands.run('mkdir -p /home/user/app/src');

      // Write all starter files in parallel to avoid sequential timeout
      console.log('Writing', Object.keys(STARTER_FILES).length, 'starter files in parallel...');
      await Promise.all(
        Object.entries(STARTER_FILES).map(([filePath, content]) =>
          sandbox.files.write(filePath, content)
        )
      );
      console.log('All starter files written successfully.');

      // Start npm install && npm run dev in the background
      console.log('Running npm install && npm run dev in background...');
      await sandbox.commands.run('npm install && npm run dev', {
        cwd: '/home/user/app',
        background: true
      });
    }

    // Get the preview URL mapped from Vite port 5173
    const previewUrlHost = sandbox.getHost(5173);
    const previewUrl = `https://${previewUrlHost}`;

    return NextResponse.json({
      success: true,
      sandboxId: sandbox.sandboxId,
      previewUrl,
    });
  } catch (error: any) {
    console.error('Error in sandbox route:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to handle sandbox lifecycle' },
      { status: 500 }
    );
  }
}
