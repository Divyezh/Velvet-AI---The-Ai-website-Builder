import { NextResponse } from 'next/server';
import { getE2BSandbox } from '@/lib/e2b-sandbox';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sandboxId = searchParams.get('sandboxId');

  if (!sandboxId) {
    return NextResponse.json({ error: 'Missing sandboxId' }, { status: 400 });
  }

  try {
    return NextResponse.json({ lines: [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const { sandboxId, command } = await req.json();
        const sandbox = await getE2BSandbox(sandboxId);
        
        const exec = await sandbox.commands.run(command, {
          onStdout: (out) => {
            controller.enqueue(encoder.encode(out + '\n'));
          },
          onStderr: (err) => {
            controller.enqueue(encoder.encode(err + '\n'));
          }
        });

        controller.close();
      } catch (error: any) {
        controller.enqueue(encoder.encode(`Error: ${error.message}\n`));
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
