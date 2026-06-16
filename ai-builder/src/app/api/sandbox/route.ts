import { NextResponse } from 'next/server';
import { createOrConnectSandbox, writeFile } from '@/lib/e2b';

const STARTER_FILES = {
  '/home/user/app/package.json': `{
  "name": "vite-vanilla-html",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --host 0.0.0.0 --port 5173",
    "build": "vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "vite": "^5.3.1"
  }
}`,
  '/home/user/app/vite.config.ts': `import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true
  }
});`,
  '/home/user/app/index.html': `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>AI Website Preview</title>
    <style>
      body {
        background-color: #050505;
        color: #e8232a;
        font-family: system-ui, sans-serif;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
        margin: 0;
      }
      .container {
        text-align: center;
        max-width: 600px;
        padding: 2rem;
      }
      h1 { font-size: 2rem; margin-bottom: 1rem; }
      p { color: #888; font-size: 1rem; }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Sandbox Ready</h1>
      <p>Waiting for Velvet AI to generate your website...</p>
    </div>
  </body>
</html>`
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

      // Run npm install synchronously so it finishes before we return
      console.log('Running npm install...');
      await sandbox.commands.run('npm install', {
        cwd: '/home/user/app'
      });

      // Start npm run dev in the background
      console.log('Running npm run dev in background...');
      await sandbox.commands.run('npm run dev', {
        cwd: '/home/user/app',
        background: true
      });

      // Give Vite 2 seconds to boot up and bind to port 5173 before returning the proxy URL
      await new Promise(resolve => setTimeout(resolve, 2000));
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
