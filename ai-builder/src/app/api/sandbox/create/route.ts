import { NextResponse } from 'next/server';
import { getE2BSandbox } from '@/lib/e2b-sandbox';

export async function POST() {
  try {
    const sandbox = await getE2BSandbox();

    // Scaffold monorepo if not already set up
    // We check if package.json exists to avoid re-running create vite
    const { stdout: hasSetup } = await sandbox.commands.run('test -f /app/apps/web/package.json && echo "yes" || echo "no"');
    
    if (hasSetup.trim() !== "yes") {
      await sandbox.commands.run('mkdir -p /app/apps/web /app/packages');
      await sandbox.commands.run('cd /app && npm init -y');
      await sandbox.commands.run('cd /app/apps/web && npm create vite@latest . -- --template react-ts --yes');
      // Start dev server in background
      sandbox.commands.run('cd /app/apps/web && npm install && npm run dev -- --host 0.0.0.0 --port 5173', { background: true });
    }

    return NextResponse.json({
      sandboxId: sandbox.sandboxId,
      previewUrl: `https://5173-${sandbox.sandboxId}.e2b.dev`,
      fileTree: [] // Mock empty tree initially
    });
  } catch (error) {
    console.error("Sandbox creation error:", error);
    return NextResponse.json({ error: 'Failed to create sandbox' }, { status: 500 });
  }
}
