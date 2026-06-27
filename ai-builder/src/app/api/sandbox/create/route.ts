import { NextResponse } from 'next/server';
import { getE2BSandbox } from '@/lib/e2b-sandbox';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const reqSandboxId = body.sandboxId || process.env.E2B || undefined;
    const sandbox = await getE2BSandbox(reqSandboxId);

    // Run scaffolding in the background if not setup to prevent HTTP request timeouts
    sandbox.commands.run('test -f /app/apps/web/package.json && echo "yes" || echo "no"').then(async (exec) => {
      if (exec.stdout.trim() !== "yes") {
        console.log("Scaffolding sandbox in background...");
        await sandbox.commands.run('mkdir -p /app/apps/web /app/packages');
        await sandbox.commands.run('cd /app && npm init -y');
        await sandbox.commands.run('cd /app/apps/web && npm create vite@latest . -- --template react-ts --yes');
        await sandbox.commands.run('cd /app/apps/web && npm install');
        sandbox.commands.run('cd /app/apps/web && npm run dev -- --host 0.0.0.0 --port 5173', { background: true });
      }
    }).catch(console.error);

    return NextResponse.json({
      sandboxId: sandbox.sandboxId,
      previewUrl: `https://5173-${sandbox.sandboxId}.e2b.dev`,
      fileTree: [] // Initial empty tree
    });
  } catch (error) {
    console.error("Sandbox creation error:", error);
    return NextResponse.json({ error: 'Failed to create sandbox' }, { status: 500 });
  }
}
