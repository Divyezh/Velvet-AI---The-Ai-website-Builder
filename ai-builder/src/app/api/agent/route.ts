import { NextResponse } from 'next/server';
import { createOrConnectSandbox, writeFile, getEnvKey } from '@/lib/e2b';

export const runtime = 'nodejs';
export const maxDuration = 60;

const SYSTEM_PROMPT = `You are an expert AI Coding Agent. You have access to a pre-configured React + Vite + Tailwind CSS development environment in /home/user/app.
Your task is to build and modify the application based on the user's instructions.

CRITICAL RULES:
1. DO NOT run initialization commands such as "npm init", "npm init -y", "npx tailwindcss init", or "npm install tailwindcss" as the environment is already fully set up and running. Running these will destroy the preview setup.
2. To use new npm packages, simply run "npm install <package-name>".
3. Always make sure the app uses Vite configuration with port 5173 and host 0.0.0.0 (already set up in package.json and vite.config.ts). Do not modify the dev scripts in package.json.

To write or update a file, output it in this exact format:
\`\`\`filepath
// code
\`\`\`
For example:
\`\`\`src/App.tsx
import React from 'react';
export default function App() { ... }
\`\`\`

To run a shell command (such as installing new packages), output it in this exact format:
\`\`\`bash
npm install lucide-react
\`\`\`

Always write COMPLETE files rather than placeholders or partial snippets, so the code builds without errors. Keep explanations simple and concise.`;

function parseBlocks(text: string) {
  const regex = /```([a-zA-Z0-9_\-\.\/]+)\n([\s\S]*?)```/g;
  const blocks: { type: 'file' | 'cmd'; target: string; content: string }[] = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    const header = match[1].trim();
    const content = match[2];
    if (header === 'bash' || header === 'sh') {
      blocks.push({ type: 'cmd', target: 'bash', content: content.trim() });
    } else {
      blocks.push({ type: 'file', target: header, content });
    }
  }
  return blocks;
}

function normalizePath(target: string): string {
  if (target.startsWith('/home/user/app/')) {
    return target;
  }
  if (target.startsWith('app/')) {
    return `/home/user/${target}`;
  }
  if (target.startsWith('/')) {
    return `/home/user/app${target}`;
  }
  return `/home/user/app/${target}`;
}

export async function POST(req: Request) {
  try {
    const { prompt, history = [], sandboxId } = await req.json();

    if (!prompt) {
      return NextResponse.json({ success: false, error: 'Prompt is required' }, { status: 400 });
    }
    if (!sandboxId) {
      return NextResponse.json({ success: false, error: 'sandboxId is required' }, { status: 400 });
    }

    const anthropicKey = getEnvKey('ANTHROPIC_API_KEY');
    const openaiKey = getEnvKey('OPENAI_API_KEY');
    const nvidiaKey = getEnvKey('NVIDIA_API_KEY');

    if (!anthropicKey && !openaiKey && !nvidiaKey) {
      return NextResponse.json(
        { success: false, error: 'No API key configured. Please set ANTHROPIC_API_KEY, OPENAI_API_KEY, or NVIDIA_API_KEY in your .env file.' },
        { status: 500 }
      );
    }

    // Connect to the E2B Sandbox early to make sure it's valid
    const sandbox = await createOrConnectSandbox(sandboxId);

    // Prepare LLM request
    let apiEndpoint = '';
    let headers: Record<string, string> = {};
    let requestBody: any = {};
    let provider: 'nvidia' | 'anthropic' | 'openai' = 'nvidia';

    const formattedMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content,
      })),
      { role: 'user', content: prompt }
    ];

    if (nvidiaKey) {
      provider = 'nvidia';
      apiEndpoint = 'https://integrate.api.nvidia.com/v1/chat/completions';
      headers = {
        'Authorization': `Bearer ${nvidiaKey}`,
        'content-type': 'application/json',
      };
      requestBody = {
        // Use fast 32B coder model — much lower latency than 480B on free tier
        model: 'qwen/qwen2.5-coder-32b-instruct',
        max_tokens: 4096,
        messages: formattedMessages,
        stream: true,
      };
    } else if (anthropicKey) {
      provider = 'anthropic';
      apiEndpoint = 'https://api.anthropic.com/v1/messages';
      headers = {
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      };
      requestBody = {
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8000,
        system: SYSTEM_PROMPT,
        messages: formattedMessages.filter(m => m.role !== 'system'),
        stream: true,
      };
    } else {
      provider = 'openai';
      apiEndpoint = 'https://api.openai.com/v1/chat/completions';
      headers = {
        'Authorization': `Bearer ${openaiKey}`,
        'content-type': 'application/json',
      };
      requestBody = {
        model: 'gpt-4o',
        max_tokens: 4096,
        messages: formattedMessages,
        stream: true,
      };
    }

    // Add a 50s timeout to the AI provider fetch so it never hangs indefinitely
    const fetchAbort = new AbortController();
    const fetchTimeout = setTimeout(() => fetchAbort.abort(), 50000);

    const externalResponse = await fetch(apiEndpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
      signal: fetchAbort.signal,
    });

    clearTimeout(fetchTimeout);

    if (!externalResponse.ok) {
      const errorText = await externalResponse.text();
      return NextResponse.json(
        { success: false, error: `AI Provider responded with status ${externalResponse.status}: ${errorText}` },
        { status: 500 }
      );
    }

    const externalStream = externalResponse.body;
    if (!externalStream) {
      return NextResponse.json({ success: false, error: 'Failed to establish AI response stream' }, { status: 500 });
    }

    // Set up a Response stream
    const encoder = new TextEncoder();
    const clientStream = new ReadableStream({
      async start(controller) {
        const reader = externalStream.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let fullText = '';

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              const cleanedLine = line.trim();
              if (!cleanedLine) continue;

              if (cleanedLine.startsWith('data: ')) {
                const dataStr = cleanedLine.slice(6);
                if (dataStr === '[DONE]') continue;

                try {
                  const dataJson = JSON.parse(dataStr);
                  let token = '';

                  if (provider === 'anthropic') {
                    if (dataJson.type === 'content_block_delta' && dataJson.delta?.text) {
                      token = dataJson.delta.text;
                    }
                  } else {
                    // Skip NVIDIA 'thinking' type chunks — they never contain text tokens
                    // and block the stream until the model finishes its internal reasoning
                    const finishReason = dataJson.choices?.[0]?.finish_reason;
                    const deltaType = dataJson.choices?.[0]?.delta?.type;
                    if (deltaType === 'thinking' || finishReason === 'thinking') continue;

                    if (dataJson.choices?.[0]?.delta?.content) {
                      token = dataJson.choices[0].delta.content;
                    }
                  }

                  if (token) {
                    fullText += token;
                    // Send text message tokens to the client
                    controller.enqueue(encoder.encode(JSON.stringify({ type: 'text', content: token }) + '\n'));
                  }
                } catch (e) {
                  // Ignore parse error for incomplete chunks
                }
              }
            }
          }

          // Handle leftover buffer
          if (buffer && buffer.startsWith('data: ')) {
            const dataStr = buffer.slice(6);
            if (dataStr !== '[DONE]') {
              try {
                const dataJson = JSON.parse(dataStr);
                let token = '';
                if (provider === 'anthropic') {
                  if (dataJson.type === 'content_block_delta' && dataJson.delta?.text) {
                    token = dataJson.delta.text;
                  }
                } else {
                  if (dataJson.choices?.[0]?.delta?.content) {
                    token = dataJson.choices[0].delta.content;
                  }
                }
                if (token) {
                  fullText += token;
                  controller.enqueue(encoder.encode(JSON.stringify({ type: 'text', content: token }) + '\n'));
                }
              } catch (e) {}
            }
          }

          // Now parse tool/file/cmd blocks and execute them
          controller.enqueue(encoder.encode(JSON.stringify({ type: 'status', content: 'Parsing generated files and commands...' }) + '\n'));
          const blocks = parseBlocks(fullText);

          if (blocks.length === 0) {
            controller.enqueue(encoder.encode(JSON.stringify({ type: 'status', content: 'No file modifications detected.' }) + '\n'));
          }

          for (const block of blocks) {
            if (block.type === 'file') {
              const fullPath = normalizePath(block.target);
              const relativePath = block.target;
              controller.enqueue(encoder.encode(JSON.stringify({ type: 'status', content: `Writing file ${relativePath}...` }) + '\n'));
              await writeFile(sandbox, fullPath, block.content);
              controller.enqueue(encoder.encode(JSON.stringify({ type: 'file_written', path: relativePath }) + '\n'));
            } else if (block.type === 'cmd') {
              const cmdText = block.content;
              controller.enqueue(encoder.encode(JSON.stringify({ type: 'status', content: `Running command: ${cmdText}...` }) + '\n'));

              // Split commands if multiple exist
              const commands = cmdText.split('\n').map(c => c.trim()).filter(Boolean);
              for (const singleCmd of commands) {
                controller.enqueue(encoder.encode(JSON.stringify({ type: 'terminal', content: `$ ${singleCmd}\n` }) + '\n'));
                
                const cmdResult = await sandbox.commands.run(singleCmd, {
                  cwd: '/home/user/app',
                  onStdout: (data: any) => {
                    const text = data.line || (typeof data === 'string' ? data : JSON.stringify(data));
                    controller.enqueue(encoder.encode(JSON.stringify({ type: 'terminal', content: `${text}\n` }) + '\n'));
                  },
                  onStderr: (data: any) => {
                    const text = data.line || (typeof data === 'string' ? data : JSON.stringify(data));
                    controller.enqueue(encoder.encode(JSON.stringify({ type: 'terminal', content: `[error] ${text}\n` }) + '\n'));
                  }
                });

                controller.enqueue(encoder.encode(JSON.stringify({ type: 'terminal', content: `Exit code: ${cmdResult.exitCode}\n` }) + '\n'));
              }
            }
          }

          controller.enqueue(encoder.encode(JSON.stringify({ type: 'done', sandboxId: sandbox.sandboxId }) + '\n'));
          controller.close();
        } catch (streamError: any) {
          controller.enqueue(encoder.encode(JSON.stringify({ type: 'error', content: streamError.message || 'Stream error' }) + '\n'));
          controller.close();
        } finally {
          reader.releaseLock();
        }
      }
    });

    return new Response(clientStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      },
    });

  } catch (error: any) {
    console.error('Error in agent route:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to start AI agent stream' },
      { status: 500 }
    );
  }
}
