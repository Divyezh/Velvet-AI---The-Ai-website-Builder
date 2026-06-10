import { NextResponse } from 'next/server';
import { createOrConnectSandbox } from '@/lib/e2b';

export async function POST(req: Request) {
  try {
    const { sandboxId, command, cwd = '/home/user/app' } = await req.json();

    if (!sandboxId) {
      return NextResponse.json({ success: false, error: 'sandboxId is required' }, { status: 400 });
    }
    if (!command) {
      return NextResponse.json({ success: false, error: 'command is required' }, { status: 400 });
    }

    const sandbox = await createOrConnectSandbox(sandboxId);
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          controller.enqueue(encoder.encode(`$ ${command}\n`));

          const result = await sandbox.commands.run(command, {
            cwd,
            onStdout: (data: any) => {
              // Handle stdout lines from E2B
              const text = data.line || (typeof data === 'string' ? data : JSON.stringify(data));
              controller.enqueue(encoder.encode(text + '\n'));
            },
            onStderr: (data: any) => {
              // Handle stderr lines from E2B
              const text = data.line || (typeof data === 'string' ? data : JSON.stringify(data));
              controller.enqueue(encoder.encode(`[stderr] ${text}\n`));
            }
          });

          controller.enqueue(encoder.encode(`\nCommand completed with exit code ${result.exitCode}\n`));
          controller.close();
        } catch (err: any) {
          controller.enqueue(encoder.encode(`\nError: ${err.message || err}\n`));
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('Error in terminal route:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to start command' },
      { status: 500 }
    );
  }
}
