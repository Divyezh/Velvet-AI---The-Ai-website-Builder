import { NextRequest } from "next/server";
import { Sandbox } from "@e2b/code-interpreter";
import {
  detectIntent,
  scanUploadedFiles,
  buildCommands,
  generateCode,
  type UploadedFile,
} from "@/lib/velvet-agent";

export const maxDuration = 300; // 5 min timeout

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { prompt, sandboxId, uploadedFiles } = body as {
    prompt: string;
    sandboxId: string;
    uploadedFiles?: UploadedFile[];
  };

  const enc = new TextEncoder();

  const stream = new ReadableStream({
    async start(ctrl) {
      function send(obj: object) {
        ctrl.enqueue(enc.encode(JSON.stringify(obj) + "\n"));
      }

      try {
        // ── STEP 1: DETECT INTENT ──
        send({ type: "thinking", phase: "Understanding your request...", toolsUsed: 1 });

        const intent = await detectIntent(prompt, uploadedFiles);
        send({ type: "intent", data: intent });
        send({ type: "plan_start", steps: buildPlanSteps(intent) });

        // ── STEP 2: SCAN UPLOADED FILES (if any) ──
        let fileAnalysis = undefined;
        if (uploadedFiles && uploadedFiles.length > 0) {
          send({ type: "thinking", phase: `Scanning ${uploadedFiles.length} uploaded file(s)...`, toolsUsed: 2 });
          fileAnalysis = await scanUploadedFiles(uploadedFiles);
          send({ type: "file_analysis", data: fileAnalysis });
          send({
            type: "agent_message",
            content: formatFileAnalysis(fileAnalysis),
          });
        }

        // ── STEP 3: CONNECT TO SANDBOX ──
        send({ type: "thinking", phase: "Connecting to sandbox...", toolsUsed: 3 });
        const sandbox = await Sandbox.connect(sandboxId);

        // ── STEP 4: RUN FRAMEWORK SETUP COMMANDS ──
        const commands = buildCommands(intent);
        if (commands.length > 0) {
          send({ type: "plan_step", index: 0 });
          send({ type: "thinking", phase: "Setting up project scaffold...", toolsUsed: 4 });

          for (const cmd of commands) {
            send({ type: "terminal_cmd", cmd });

            const result = await sandbox.commands.run(cmd, {
              onStdout: (data: string) => send({ type: "terminal_out", line: data }),
              onStderr: (data: string) => {
                // Only send actual errors, not npm warnings
                if (!data.includes("npm warn") && !data.includes("WARN")) {
                  send({ type: "terminal_out", line: data });
                }
              },
            });

            send({
              type: "terminal_done",
              cmd,
              exitCode: result.exitCode ?? 0,
            });

            if ((result.exitCode ?? 0) > 0) {
              throw new Error(`Command failed (exit ${result.exitCode}): ${cmd}`);
            }
          }
        }

        // ── STEP 5: GENERATE CODE WITH AI ──
        send({ type: "plan_step", index: 1 });
        send({ type: "thinking", phase: "Generating your app with AI...", toolsUsed: 5 });

        const plan = await generateCode(prompt, intent, fileAnalysis);
        send({ type: "plan_steps_update", steps: plan.steps });

        // ── STEP 6: WRITE FILES TO SANDBOX ──
        send({ type: "plan_step", index: 2 });
        send({ type: "thinking", phase: "Writing project files...", toolsUsed: 6 });

        const fileEntries = Object.entries(plan.files);
        for (const [filePath, content] of fileEntries) {
          send({ type: "file_start", path: filePath });

          // Ensure parent directory exists
          const dir = filePath.split("/").slice(0, -1).join("/");
          if (dir) {
            await sandbox.commands.run(`mkdir -p /app/${dir}`);
          }

          // Write file
          await sandbox.files.write(`/app/${filePath}`, content);

          // Stream content in chunks for real-time editor feel
          const chunkSize = 300;
          for (let i = 0; i < content.length; i += chunkSize) {
            send({
              type: "file_chunk",
              path: filePath,
              content: content.slice(i, i + chunkSize),
            });
          }

          send({ type: "file_done", path: filePath, fullContent: content });
        }

        // ── STEP 7: APPLY TAILWIND CONFIG (if needed) ──
        if (intent.framework === "react" && fileEntries.some(([p]) => p.endsWith(".tsx"))) {
          const twConfig = `/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: {} },
  plugins: [],
}`;
          await sandbox.files.write("/app/web/tailwind.config.js", twConfig);
          send({ type: "file_done", path: "web/tailwind.config.js", fullContent: twConfig });
        }

        // ── STEP 8: START DEV SERVER ──
        send({ type: "plan_step", index: 3 });
        send({ type: "thinking", phase: "Starting development server...", toolsUsed: 7 });
        send({ type: "terminal_cmd", cmd: plan.devCommand });

        // Start non-blocking (dev server runs forever)
        sandbox.commands.run(plan.devCommand, {
          background: true,
          onStdout: (data: string) => send({ type: "terminal_out", line: data }),
          onStderr: (data: string) => send({ type: "terminal_out", line: data }),
        });

        // Wait for Vite/Next to be ready
        await new Promise(r => setTimeout(r, 4000));

        const previewUrl = `https://${plan.previewPort}-${sandboxId}.e2b.app`;
        send({ type: "plan_step", index: 4 });
        send({ type: "server_ready", url: previewUrl });

        // ── DONE ──
        send({
          type: "done",
          previewUrl,
          filesCreated: fileEntries.map(([p]) => p),
          summary: intent.summary,
        });

      } catch (err: any) {
        console.error("Generation error:", err);
        send({
          type: "error",
          message: err.message ?? "Generation failed",
          recoverable: true,
        });
      } finally {
        ctrl.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}

function buildPlanSteps(intent: ReturnType<typeof detectIntent> extends Promise<infer T> ? T : never): string[] {
  return [
    intent.commands?.length > 0 ? `Scaffold ${intent.framework ?? "React"} project` : "Prepare workspace",
    "Generate code with VELVET AI",
    "Write all project files",
    "Start development server",
    "App is live ✓",
  ];
}

function formatFileAnalysis(analysis: Awaited<ReturnType<typeof scanUploadedFiles>>): string {
  const lines = [
    `**Files analyzed.** Here's what I found:\n`,
    `**Framework:** ${analysis.framework}`,
    `**Tech stack:** ${analysis.techStack.join(", ") || "Not detected"}`,
    analysis.existingComponents.length
      ? `**Components found:** ${analysis.existingComponents.join(", ")}`
      : "",
    analysis.issues.length
      ? `**Issues I'll fix:** ${analysis.issues.slice(0, 3).join(", ")}`
      : "",
    analysis.suggestions.length
      ? `**Improvements I'll add:** ${analysis.suggestions.slice(0, 2).join(", ")}`
      : "",
    `\n${analysis.summary}`,
  ];
  return lines.filter(Boolean).join("\n");
}
