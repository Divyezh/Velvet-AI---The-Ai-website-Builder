import { NextResponse } from 'next/server';
import { createOrConnectWorkspace, writeFile, executeCommand, getEnvKey } from '@/lib/sandbox';

export const runtime = 'nodejs';
export const maxDuration = 60;

const SYSTEM_PROMPT = `# VELVET.AI — Master System Prompt

You are an expert AI software engineer building applications live in a Next.js (App Router) environment.

Your goal is to build full-stack web applications based on user prompts.
The workspace already has a basic Next.js + Tailwind CSS template installed in \`/tmp/app\`.

## WORKFLOW

1. **Analyze & Plan**: Always start your response by writing a step-by-step project plan as text.
   Example:
   ✓ Create database schema
   ✓ Create authentication components
   ✓ Build homepage layout
2. **Execute**: Create files one by one. Use Markdown code blocks to create files.
   Specify the file path immediately after the backticks.
   Example:
   \`\`\`app/page.tsx
   import React from 'react';
   export default function Page() { return <div>Hello</div>; }
   \`\`\`
3. **Terminal Commands**: If you need to install packages (like lucide-react, drizzle-orm, etc.), use a bash code block.
   Example:
   \`\`\`bash
   npm install lucide-react framer-motion clsx tailwind-merge
   \`\`\`
   Note: Do not run \`npm run dev\` as the dev server is already running in the background.

## TECH STACK
- Framework: Next.js (App Router)
- Styling: Tailwind CSS
- UI Components: use pure Tailwind or generic Shadcn-like components (build them yourself, do NOT run npx shadcn-ui as it requires interactive prompts).
- Icons: \`lucide-react\`
- Database (if requested): \`drizzle-orm\` with Postgres.
- Authentication (if requested): \`next-auth\` (Auth.js) v5.

## RULES
- NEVER output generic placeholder text (Lorem Ipsum). Use realistic copy.
- Build beautiful, modern, dark-themed UIs by default (background #050505, accents #9ABDB9, #C7F0EC).
- Ensure animations with Framer Motion or pure CSS where appropriate.
- Always output valid code blocks.
- Provide the complete file content.
- Do NOT generate everything at once. Stream the creation progressively.`;

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
  if (target.startsWith('/tmp/app/')) {
    return target;
  }
  if (target.startsWith('app/')) {
    return `/home/user/${target}`;
  }
  if (target.startsWith('/')) {
    return `/tmp/app${target}`;
  }
  return `/tmp/app/${target}`;
}

export async function POST(req: Request) {
  try {
    const { prompt, history = [], sandboxId, apiKeys = {} } = await req.json();

    if (!prompt) {
      return NextResponse.json({ success: false, error: 'Prompt is required' }, { status: 400 });
    }
    if (!sandboxId) {
      return NextResponse.json({ success: false, error: 'sandboxId is required' }, { status: 400 });
    }

    const anthropicKey = apiKeys.anthropicKey || getEnvKey('ANTHROPIC_API_KEY');
    const openaiKey = apiKeys.openaiKey || getEnvKey('OPENAI_API_KEY');
    const nvidiaKey = apiKeys.nvidiaKey || getEnvKey('NVIDIA_API_KEY');

    if (!anthropicKey && !openaiKey && !nvidiaKey) {
      return NextResponse.json(
        { success: false, error: 'No API key configured. Please set your API keys in Settings or .env file.' },
        { status: 500 }
      );
    }

    // Connect to the Daytona Workspace early to make sure it's valid
    const workspace = await createOrConnectWorkspace(sandboxId);

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
        // Use Llama 3.1 70B Instruct as a robust alternative
        model: 'meta/llama-3.1-70b-instruct',
        // Force recompile
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

          // Now parse the output
          controller.enqueue(encoder.encode(JSON.stringify({ type: 'status', content: 'Processing generated content...' }) + '\n'));
          
          // Parse markdown blocks for files and commands
          const blocks = parseBlocks(fullText);

            for (const block of blocks) {
              if (block.type === 'file') {
                const fullPath = normalizePath(block.target);
                const relativePath = block.target;
                controller.enqueue(encoder.encode(JSON.stringify({ type: 'status', content: `Writing file ${relativePath}...` }) + '\n'));
                await writeFile(workspace.id, fullPath, block.content);
                controller.enqueue(encoder.encode(JSON.stringify({ type: 'file_written', path: relativePath }) + '\n'));
              } else if (block.type === 'cmd') {
                const cmdText = block.content;
                controller.enqueue(encoder.encode(JSON.stringify({ type: 'status', content: `Running command: ${cmdText}...` }) + '\n'));

                const commands = cmdText.split('\n').map(c => c.trim()).filter(Boolean);
                for (const singleCmd of commands) {
                  controller.enqueue(encoder.encode(JSON.stringify({ type: 'terminal', content: `$ ${singleCmd}\n` }) + '\n'));
                  
                  const cmdResult = await executeCommand(workspace.id, singleCmd, '/tmp/app');
                  if (cmdResult.result) {
                    controller.enqueue(encoder.encode(JSON.stringify({ type: 'terminal', content: `${cmdResult.result}\n` }) + '\n'));
                  }
                  controller.enqueue(encoder.encode(JSON.stringify({ type: 'terminal', content: `Exit code: ${cmdResult.exitCode}\n` }) + '\n'));
                }
              }
            }

          controller.enqueue(encoder.encode(JSON.stringify({ type: 'done', sandboxId: workspace.id }) + '\n'));
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
