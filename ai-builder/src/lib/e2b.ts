import { Sandbox } from 'e2b';
import fs from 'fs';
import path from 'path';

export interface FileEntry {
  name: string;
  path: string;
  type: 'file' | 'dir';
  children?: FileEntry[];
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

// Initialize process.env with fallback key immediately
const apiKey = getEnvKey('E2B_API_KEY');
if (apiKey) {
  process.env.E2B_API_KEY = apiKey;
}

export async function createOrConnectSandbox(sandboxId?: string) {
  if (sandboxId) {
    try {
      // Connect to the existing sandbox
      return await Sandbox.connect(sandboxId);
    } catch (e) {
      console.warn(`Failed to connect to sandbox ${sandboxId}, creating a new one:`, e);
    }
  }

  // Create a new sandbox session
  const sbx = await Sandbox.create();
  return sbx;
}

export async function listDirectory(sandbox: any, dirPath: string): Promise<FileEntry[]> {
  try {
    const entries = await sandbox.files.list(dirPath);
    const result: FileEntry[] = [];
    
    for (const entry of entries) {
      // Filter out heavy/hidden folders to avoid scanning overhead
      if (
        entry.name === 'node_modules' ||
        entry.name === '.git' ||
        entry.name === '.next' ||
        entry.name === 'dist' ||
        entry.name === 'build'
      ) {
        result.push({
          name: entry.name,
          path: entry.path,
          type: 'dir',
          children: [],
        });
        continue;
      }

      if (entry.type === 'dir') {
        const children = await listDirectory(sandbox, entry.path);
        result.push({
          name: entry.name,
          path: entry.path,
          type: 'dir',
          children,
        });
      } else {
        result.push({
          name: entry.name,
          path: entry.path,
          type: 'file',
        });
      }
    }

    // Sort: directories first, then files alphabetically
    return result.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'dir' ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });
  } catch (error) {
    console.error(`Error listing directory ${dirPath}:`, error);
    return [];
  }
}

export async function writeFile(sandbox: any, filePath: string, content: string) {
  await sandbox.files.write(filePath, content);
}

export async function readFile(sandbox: any, path: string): Promise<string> {
  return await sandbox.files.read(path);
}

export async function deleteFile(sandbox: any, path: string) {
  await sandbox.commands.run(`rm -rf "${path}"`);
}
