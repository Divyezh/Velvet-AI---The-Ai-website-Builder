import { NextResponse } from 'next/server';
import { getE2BSandbox } from '@/lib/e2b-sandbox';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sandboxId = searchParams.get('sandboxId');
  const path = searchParams.get('path');

  if (!sandboxId || !path) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  try {
    const sandbox = await getE2BSandbox(sandboxId);
    const content = await sandbox.files.read(`/app/${path}`);
    return NextResponse.json({ content });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { sandboxId, path, content } = await req.json();
    const sandbox = await getE2BSandbox(sandboxId);
    await sandbox.files.write(`/app/${path}`, content);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { sandboxId, path } = await req.json();
    const sandbox = await getE2BSandbox(sandboxId);
    await sandbox.commands.run(`rm -rf /app/${path}`);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
