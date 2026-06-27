import { NextRequest, NextResponse } from "next/server";
import { Sandbox } from "@e2b/code-interpreter";

export async function GET(req: NextRequest) {
  const sandboxId = req.nextUrl.searchParams.get("sandboxId");
  if (!sandboxId) return NextResponse.json({ error: "sandboxId required" }, { status: 400 });

  try {
    const sb = await Sandbox.connect(sandboxId);
    const result = await sb.commands.run(`find /app -not -path "*/node_modules/*" -not -path "*/.git/*" -type f | head -100`);

    // Parse paths into tree structure
    const paths = (result.stdout ?? "").split("\n").filter(Boolean).map(p => p.replace("/app/", ""));
    const tree = buildTreeFromPaths(paths);

    return NextResponse.json({ success: true, tree });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

function buildTreeFromPaths(paths: string[]): any[] {
  const root: any[] = [];
  for (const path of paths) {
    const parts = path.split("/");
    let current = root;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isFile = i === parts.length - 1;
      let node = current.find((n: any) => n.name === part);
      if (!node) {
        node = { name: part, path: parts.slice(0, i + 1).join("/"), type: isFile ? "file" : "folder", children: isFile ? undefined : [] };
        current.push(node);
      }
      if (!isFile) current = node.children;
    }
  }
  return root;
}
