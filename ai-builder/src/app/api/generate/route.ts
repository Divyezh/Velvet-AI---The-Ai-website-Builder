import { NextRequest } from "next/server";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `You are an expert web developer and UI designer. When given a description, 
you generate a complete, beautiful, single-file HTML website.

STRICT RULES:
- Return ONLY raw HTML. No markdown. No code blocks. No explanation.
- Everything in one HTML file: HTML + CSS in <style> + JS in <script>
- Make it visually stunning — use modern design, good typography, real content
- Use Google Fonts (import via @import in style tag)
- Make it fully responsive (mobile + desktop)
- Add realistic placeholder content — real paragraphs, real section names
- Include a navbar, hero section, at least 2-3 more sections, and a footer
- Use a color palette that fits the website's purpose
- NO external CSS frameworks. Pure CSS only.
- Do NOT include any JavaScript that requires a backend
- The HTML must be complete and render perfectly in an iframe`;

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    // 1. Validation checks
    if (!prompt || typeof prompt !== "string") {
      return new Response(JSON.stringify({ error: "Prompt is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (prompt.trim().length < 5) {
      return new Response(JSON.stringify({ error: "Prompt too short (must be at least 5 characters)" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (prompt.length > 1000) {
      return new Response(JSON.stringify({ error: "Prompt too long (maximum 1000 characters)" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;
    const nvidiaKey = process.env.NVIDIA_API_KEY;

    if (!anthropicKey && !openaiKey && !nvidiaKey) {
      return new Response(
        JSON.stringify({ error: "No API key configured. Please set ANTHROPIC_API_KEY, OPENAI_API_KEY, or NVIDIA_API_KEY in your .env file." }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    let apiEndpoint = "";
    let headers: Record<string, string> = {};
    let requestBody: any = {};
    let provider: "nvidia" | "anthropic" | "openai" = "nvidia";

    if (nvidiaKey) {
      provider = "nvidia";
      // Nvidia AI configuration
      apiEndpoint = "https://integrate.api.nvidia.com/v1/chat/completions";
      headers = {
        "Authorization": `Bearer ${nvidiaKey}`,
        "content-type": "application/json",
      };
      requestBody = {
        model: "qwen/qwen3-coder-480b-a35b-instruct",
        max_tokens: 4096,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `Build a complete website for: ${prompt}` },
        ],
        stream: true,
      };
    } else if (anthropicKey) {
      provider = "anthropic";
      // Anthropic Claude configuration
      apiEndpoint = "https://api.anthropic.com/v1/messages";
      headers = {
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      };
      requestBody = {
        model: "claude-sonnet-4-20250514",
        max_tokens: 8000,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: `Build a complete website for: ${prompt}` }],
        stream: true,
      };
    } else {
      provider = "openai";
      // OpenAI configuration
      apiEndpoint = "https://api.openai.com/v1/chat/completions";
      headers = {
        "Authorization": `Bearer ${openaiKey}`,
        "content-type": "application/json",
      };
      requestBody = {
        model: "gpt-4o",
        max_tokens: 4096,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `Build a complete website for: ${prompt}` },
        ],
        stream: true,
      };
    }

    const externalResponse = await fetch(apiEndpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody),
    });

    if (!externalResponse.ok) {
      const errorText = await externalResponse.text();
      return new Response(
        JSON.stringify({ error: `AI Provider responded with status ${externalResponse.status}: ${errorText}` }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const externalStream = externalResponse.body;
    if (!externalStream) {
      return new Response(JSON.stringify({ error: "Failed to establish AI response stream." }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Standard ReadableStream that pipes chunk-parsed content to client
    const clientStream = new ReadableStream({
      async start(controller) {
        const reader = externalStream.getReader();
        const decoder = new TextDecoder();
        const encoder = new TextEncoder();
        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              const cleanedLine = line.trim();
              if (!cleanedLine) continue;

              if (cleanedLine.startsWith("data: ")) {
                const dataStr = cleanedLine.slice(6);
                if (dataStr === "[DONE]") continue;

                try {
                  const dataJson = JSON.parse(dataStr);

                  // Extract text delta based on provider
                  let textToken = "";
                  if (provider === "anthropic") {
                    if (dataJson.type === "content_block_delta" && dataJson.delta?.text) {
                      textToken = dataJson.delta.text;
                    }
                  } else {
                    if (dataJson.choices?.[0]?.delta?.content) {
                      textToken = dataJson.choices[0].delta.content;
                    }
                  }

                  if (textToken) {
                    controller.enqueue(encoder.encode(textToken));
                  }
                } catch (e) {
                  // Ignore parse errors on incomplete chunk lines
                }
              }
            }
          }

          // Read remaining buffer
          if (buffer && buffer.startsWith("data: ")) {
            const dataStr = buffer.slice(6);
            if (dataStr !== "[DONE]") {
              try {
                const dataJson = JSON.parse(dataStr);
                let textToken = "";
                if (provider === "anthropic") {
                  if (dataJson.type === "content_block_delta" && dataJson.delta?.text) {
                    textToken = dataJson.delta.text;
                  }
                } else {
                  if (dataJson.choices?.[0]?.delta?.content) {
                    textToken = dataJson.choices[0].delta.content;
                  }
                }
                if (textToken) {
                  controller.enqueue(encoder.encode(textToken));
                }
              } catch (e) {}
            }
          }
        } catch (streamError) {
          controller.error(streamError);
        } finally {
          controller.close();
          reader.releaseLock();
        }
      },
    });

    return new Response(clientStream, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.message || "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
