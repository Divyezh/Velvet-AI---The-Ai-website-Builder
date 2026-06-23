import { Sandbox } from '@e2b/code-interpreter';

let globalSandbox: Sandbox | null = null;

export async function getE2BSandbox(sandboxId?: string): Promise<Sandbox> {
  if (globalSandbox) {
    if (sandboxId && globalSandbox.sandboxId === sandboxId) {
      try {
        await globalSandbox.setTimeout(300000);
        return globalSandbox;
      } catch(e) {
        globalSandbox = null;
      }
    } else if (!sandboxId) {
      try {
        await globalSandbox.setTimeout(300000);
        return globalSandbox;
      } catch(e) {
        globalSandbox = null;
      }
    }
  }

  if (sandboxId) {
    try {
      const sandbox = await Sandbox.connect(sandboxId);
      globalSandbox = sandbox;
      return sandbox;
    } catch(e) {
      console.error("Failed to reconnect to sandbox, creating new one:", e);
    }
  }

  const sandbox = await Sandbox.create({ template: 'base', timeoutMs: 300000 });
  globalSandbox = sandbox;
  return sandbox;
}
