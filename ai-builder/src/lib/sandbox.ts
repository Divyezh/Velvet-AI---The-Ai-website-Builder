import fs from 'fs';
import path from 'path';
import { exec, spawn } from 'child_process';
import crypto from 'crypto';

export interface FileEntry {
  name: string;
  path: string;
  type: 'file' | 'dir';
  children?: FileEntry[];
}

// Get the base directory for local sandboxes
// This maps to `.workspaces` inside the project root
export function getWorkspacesDir() {
  const dir = path.join(process.cwd(), '.workspaces');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

export function getWorkspaceDir(sandboxId: string) {
  return path.join(getWorkspacesDir(), sandboxId);
}

// Ensure the requested path is safely within the workspace directory
function resolveSafePath(sandboxId: string, requestedPath: string) {
  const workspaceDir = getWorkspaceDir(sandboxId);
  
  // Strip any leading '/tmp/app' prefix if the client still sends it
  let normalizedPath = requestedPath;
  if (normalizedPath.startsWith('/tmp/app')) {
    normalizedPath = normalizedPath.substring('/tmp/app'.length);
  }
  
  // Make it absolute relative to workspaceDir
  const absolutePath = path.join(workspaceDir, normalizedPath);
  
  // Ensure the resolved path is inside the workspaceDir
  if (!absolutePath.startsWith(workspaceDir)) {
    throw new Error('Path traversal attempt detected');
  }
  
  return absolutePath;
}

export function getEnvKey(keyName: string): string | undefined {
  if (process.env[keyName]) {
    return process.env[keyName];
  }
  
  const paths = [
    path.join(process.cwd(), '.env'),
    'c:/Users/Divyesh/OneDrive/Desktop/ai website builder/ai-builder/.env'
  ];

  for (const envPath of paths) {
    try {
      if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf-8');
        const lines = content.split('\n');
        for (const line of lines) {
          const match = line.match(/^\s*([^=#]+)\s*=\s*(.*)$/);
          if (match) {
            const key = match[1].trim();
            let value = match[2].trim();
            if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
              value = value.substring(1, value.length - 1);
            }
            if (key === keyName) {
              return value;
            }
          }
        }
      }
    } catch (e) {
      console.error(`Failed to read env file at ${envPath}:`, e);
    }
  }
  return undefined;
}

export async function createOrConnectWorkspace(workspaceId?: string) {
  const id = workspaceId || crypto.randomBytes(8).toString('hex');
  const workspaceDir = getWorkspaceDir(id);
  
  if (!fs.existsSync(workspaceDir)) {
    fs.mkdirSync(workspaceDir, { recursive: true });
  }

  return {
    id,
    dir: workspaceDir
  };
}

export async function listDirectory(sandboxId: string, dirPath: string): Promise<FileEntry[]> {
  const absoluteDirPath = resolveSafePath(sandboxId, dirPath);
  
  if (!fs.existsSync(absoluteDirPath)) {
    return [];
  }

  const result: FileEntry[] = [];
  const files = fs.readdirSync(absoluteDirPath, { withFileTypes: true });

  for (const f of files) {
    if (
      f.name === 'node_modules' ||
      f.name === '.git' ||
      f.name === '.next' ||
      f.name === 'dist' ||
      f.name === 'build'
    ) {
      result.push({
        name: f.name,
        path: path.posix.join(dirPath.startsWith('/tmp/app') ? dirPath : `/tmp/app${dirPath.startsWith('/') ? dirPath : '/' + dirPath}`, f.name).replace(/\/+/g, '/'),
        type: 'dir',
        children: [],
      });
      continue;
    }

    const relativePath = path.posix.join(dirPath.startsWith('/tmp/app') ? dirPath : `/tmp/app${dirPath.startsWith('/') ? dirPath : '/' + dirPath}`, f.name).replace(/\/+/g, '/');
    
    if (f.isDirectory()) {
      const children = await listDirectory(sandboxId, relativePath);
      result.push({
        name: f.name,
        path: relativePath,
        type: 'dir',
        children,
      });
    } else {
      result.push({
        name: f.name,
        path: relativePath,
        type: 'file',
      });
    }
  }

  return result.sort((a, b) => {
    if (a.type !== b.type) {
      return a.type === 'dir' ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });
}

export async function writeFile(sandboxId: string, filePath: string, content: string) {
  const absolutePath = resolveSafePath(sandboxId, filePath);
  const dir = path.dirname(absolutePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(absolutePath, content);
}

export async function readFile(sandboxId: string, filePath: string): Promise<string> {
  const absolutePath = resolveSafePath(sandboxId, filePath);
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  return fs.readFileSync(absolutePath, 'utf-8');
}

export async function deleteFile(sandboxId: string, filePath: string) {
  const absolutePath = resolveSafePath(sandboxId, filePath);
  if (fs.existsSync(absolutePath)) {
    fs.rmSync(absolutePath, { recursive: true, force: true });
  }
}

export async function createDirectory(sandboxId: string, dirPath: string) {
  const absolutePath = resolveSafePath(sandboxId, dirPath);
  if (!fs.existsSync(absolutePath)) {
    fs.mkdirSync(absolutePath, { recursive: true });
  }
}

export async function executeCommand(sandboxId: string, command: string, cwd?: string): Promise<{ result: string, exitCode: number }> {
  const workspaceDir = getWorkspaceDir(sandboxId);
  const absoluteCwd = cwd ? resolveSafePath(sandboxId, cwd) : workspaceDir;

  return new Promise((resolve) => {
    exec(command, { cwd: absoluteCwd }, (error, stdout, stderr) => {
      let result = stdout;
      if (stderr) {
        result += (result ? '\n' : '') + stderr;
      }
      resolve({
        result: result,
        exitCode: error ? (error.code || 1) : 0
      });
    });
  });
}
