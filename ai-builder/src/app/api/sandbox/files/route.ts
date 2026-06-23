import { NextResponse } from 'next/server';
import { createOrConnectWorkspace, listDirectory, writeFile, readFile, deleteFile, createDirectory } from '@/lib/sandbox';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sandboxId = searchParams.get('sandboxId');
    const action = searchParams.get('action') || 'list'; // 'list' or 'read'
    const path = searchParams.get('path') || '/tmp/app';

    if (!sandboxId) {
      return NextResponse.json({ success: false, error: 'sandboxId is required' }, { status: 400 });
    }

    const workspace = await createOrConnectWorkspace(sandboxId);

    if (action === 'read') {
      const content = await readFile(workspace.id, path);
      return NextResponse.json({ success: true, content });
    } else {
      const files = await listDirectory(workspace.id, path);
      return NextResponse.json({ success: true, files });
    }
  } catch (error: any) {
    console.error('Error in files API route (GET):', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to perform files operation' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { sandboxId, action, path, content } = await req.json();

    if (!sandboxId) {
      return NextResponse.json({ success: false, error: 'sandboxId is required' }, { status: 400 });
    }
    if (!path) {
      return NextResponse.json({ success: false, error: 'path is required' }, { status: 400 });
    }

    const workspace = await createOrConnectWorkspace(sandboxId);

    if (action === 'write') {
      await writeFile(workspace.id, path, content || '');
      return NextResponse.json({ success: true, message: 'File written successfully' });
    } else if (action === 'delete') {
      await deleteFile(workspace.id, path);
      return NextResponse.json({ success: true, message: 'File deleted successfully' });
    } else if (action === 'create_dir') {
      await createDirectory(workspace.id, path);
      return NextResponse.json({ success: true, message: 'Directory created successfully' });
    } else {
      return NextResponse.json({ success: false, error: `Invalid action: ${action}` }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Error in files API route (POST):', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to perform files write operation' },
      { status: 500 }
    );
  }
}
