import { NextRequest } from "next/server";
import { Sandbox } from "@e2b/code-interpreter";

export async function POST(req: NextRequest) {
  const { sandboxId, command } = await req.json();

  if (!sandboxId || !command?.trim()) {
    return new Response(
      JSON.stringify({ error: "sandboxId and command required" }),
      { status: 400 }
    );
  }

  // Block dangerous commands
  const BLOCKED = ["rm -rf /", "mkfs", "dd if=", ":(){ :|:& };:", "sudo rm"];
  if (BLOCKED.some(b => command.includes(b))) {
    return new Response(
      JSON.stringify({ error: "Command not allowed" }),
      { status: 403 }
    );
  }

  const enc = new TextEncoder();
  const stream = new ReadableStream({
    async start(ctrl) {
      function send(obj: object) {
        ctrl.enqueue(enc.encode(JSON.stringify(obj) + "\n"));
      }

      try {
        const sandbox = await Sandbox.connect(sandboxId);

        send({ type: "cmd_start", command });

        const result = await sandbox.commands.run(command, {
          onStdout: (data: string) => send({ type: "stdout", line: data }),
          onStderr: (data: string) => send({ type: "stderr", line: data }),
          timeoutMs: 60000, // 60s timeout per command
        });

        send({
          type: "cmd_done",
          exitCode: result.exitCode ?? 0,
          success: (result.exitCode ?? 0) === 0,
        });

      } catch (err: any) {
        send({ type: "error", message: err.message });
      } finally {
        ctrl.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
    },
  });
}
