import { NextRequest, NextResponse } from "next/server";
import { Sandbox } from "@e2b/code-interpreter";

// GET: read file content
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sandboxId = searchParams.get("sandboxId");
  const path = searchParams.get("path");

  if (!sandboxId || !path) {
    return NextResponse.json({ error: "sandboxId and path required" }, { status: 400 });
  }

  try {
    const sandbox = await Sandbox.connect(sandboxId);
    const content = await sandbox.files.read(`/app/${path}`);
    return NextResponse.json({ success: true, content, path });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 404 });
  }
}

// PUT: write/update file
export async function PUT(req: NextRequest) {
  const { sandboxId, path, content } = await req.json();

  if (!sandboxId || !path || content === undefined) {
    return NextResponse.json({ error: "sandboxId, path, content required" }, { status: 400 });
  }

  try {
    const sandbox = await Sandbox.connect(sandboxId);

    // Ensure parent directory
    const dir = path.split("/").slice(0, -1).join("/");
    if (dir) {
      await sandbox.commands.run(`mkdir -p /app/${dir}`);
    }

    await sandbox.files.write(`/app/${path}`, content);
    return NextResponse.json({ success: true, path });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE: remove file
export async function DELETE(req: NextRequest) {
  const { sandboxId, path } = await req.json();

  try {
    const sandbox = await Sandbox.connect(sandboxId);
    await sandbox.commands.run(`rm -rf /app/${path}`);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
