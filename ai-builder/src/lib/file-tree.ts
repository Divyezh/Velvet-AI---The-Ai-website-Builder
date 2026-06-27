import { Sandbox } from "@e2b/code-interpreter";

export interface FileNode {
  name: string;
  path: string;
  type: "file" | "dir";
  children?: FileNode[];
  ext?: string;
  isStreaming?: boolean; // AI currently writing this file
}

const IGNORE = new Set([
  "node_modules", ".git", ".next", "dist", "build",
  ".turbo", "coverage", ".nyc_output", "out",
]);

export async function getFileTree(
  sandbox: Sandbox,
  rootPath = "/app",
  depth = 0,
  maxDepth = 4
): Promise<FileNode[]> {
  if (depth > maxDepth) return [];

  try {
    await sandbox.commands.run(`ls -la "${rootPath}" 2>/dev/null`);

    const entries = await sandbox.files.list(rootPath);
    const nodes: FileNode[] = [];

    for (const entry of entries) {
      if (IGNORE.has(entry.name) || entry.name.startsWith(".")) continue;

      const fullPath = `${rootPath}/${entry.name}`;
      const relativePath = fullPath.replace("/app/", "");

      if (entry.type === "dir") {
        const children = await getFileTree(sandbox, fullPath, depth + 1, maxDepth);
        nodes.push({
          name: entry.name,
          path: relativePath,
          type: "dir",
          children,
        });
      } else {
        nodes.push({
          name: entry.name,
          path: relativePath,
          type: "file",
          ext: entry.name.split(".").pop()?.toLowerCase(),
        });
      }
    }

    // Sort: dirs first, then files, both alphabetical
    return nodes.sort((a, b) => {
      if (a.type !== b.type) return a.type === "dir" ? -1 : 1;
      return a.name.localeCompare(b.name);
    });

  } catch {
    return [];
  }
}
