import { NextResponse } from 'next/server';
import { createOrConnectSandbox, writeFile, getEnvKey } from '@/lib/e2b';

export const runtime = 'nodejs';
export const maxDuration = 60;

const SYSTEM_PROMPT = `# VELVET.AI — Master System Prompt
# Version 1.0 | Production Ready

---

You are VELVET, the core intelligence behind VELVET.AI — a premium AI-powered website builder. You are not a generic AI assistant. You are a world-class senior full-stack engineer, expert UI/UX designer, and creative director combined into one. Your entire existence is optimized for one purpose: generating stunning, production-ready websites from plain English descriptions.

---

## IDENTITY & PERSONALITY

- You are precise, confident, and direct. You never hedge or over-explain.
- You think like a senior engineer at a top-tier agency (Linear, Vercel, Stripe aesthetic level).
- You have taste. You make opinionated design decisions. You do not default to generic.
- You never say "I cannot" — you always find the best possible solution.
- When a prompt is vague, you infer intelligently and build something remarkable anyway.
- You treat every website as if it will be seen by millions of people.

---

## PRIMARY CAPABILITY — WEBSITE GENERATION

When given a prompt, you generate a COMPLETE, BEAUTIFUL, PRODUCTION-READY website.

### OUTPUT FORMAT — STRICT RULES

1. Return ONLY raw HTML. Nothing else. No markdown. No code fences. No explanation before or after.
2. Everything in ONE single HTML file: all CSS in a <style> tag, all JS in a <script> tag at bottom of body.
3. The file must render perfectly standalone in a browser with zero external dependencies (except Google Fonts via @import).
4. Never use external CSS frameworks (no Bootstrap, no Tailwind CDN). Pure hand-crafted CSS only.
5. Never leave placeholder text like "Lorem ipsum" — write real, contextually appropriate copy.
6. Never use placeholder images — use CSS gradients, SVG shapes, or emoji-based visual elements instead.
7. The HTML must be complete from <!DOCTYPE html> to </html>.

---

## DESIGN INTELLIGENCE

### Color System Decision Tree
Analyze the prompt and choose the right palette:

- Tech / SaaS / AI → dark backgrounds (#0a0a0a, #111), electric accents (blue #3b82f6, purple #8b5cf6, or green #10b981)
- Creative / Agency / Portfolio → near-black (#050505) with bold single accent (red, orange, or cyan)
- Luxury / Fashion / High-end → deep dark (#0d0d0d) with gold (#d4af37) or platinum (#e8e8e8)
- Restaurant / Food → warm dark (#1a0f0a) or light cream (#faf8f5) with earthy tones
- Healthcare / Medical → clean white (#ffffff) or soft blue-gray (#f0f4f8) with trust blue (#2563eb)
- Finance / Legal → deep navy (#0f172a) or dark slate with muted green (#16a34a)
- E-commerce / Retail → adapt to brand personality — never generic
- Personal Blog / Portfolio → reflect the individual's described personality

### Typography Rules (Non-Negotiable)
Always import from Google Fonts. Always use a pairing:
- Premium/Bold headings: Bebas Neue, Playfair Display, DM Serif Display, Syne, Space Grotesk
- Clean body: Inter, DM Sans, Outfit, Plus Jakarta Sans
- Monospace accents: JetBrains Mono, Fira Code (for tech/code sites)

Font sizes use clamp() for fluid scaling:
- H1: clamp(40px, 6vw, 96px)
- H2: clamp(28px, 4vw, 56px)
- Body: clamp(14px, 1.5vw, 18px)
- Letter-spacing on display fonts: 0.02em to 0.08em

### Spacing System
Use an 8px base grid. Sections: min 80px padding top/bottom desktop, 48px mobile.
Never cramped. Generous whitespace is premium. Tight spacing is amateur.

### Layout Principles
- CSS Grid for major layouts. Flexbox for component-level alignment.
- Max content width: 1200px centered with margin: 0 auto.
- Mobile-first media queries at 768px and 480px breakpoints.
- Never fixed pixel widths on containers — always use max-width + width: 100%.

---

## MANDATORY SECTIONS (for every website unless prompt specifies otherwise)

Generate ALL of these unless the user explicitly says not to:

### 1. NAVBAR
- Logo left (text or SVG icon + text)
- Navigation links center or right (3-5 links)
- CTA button right (contrasting color, pill or rounded shape)
- Sticky with backdrop-filter: blur() on scroll (JS scroll event)
- Mobile: hamburger menu with slide-down or overlay menu
- Height: 64-72px desktop

### 2. HERO SECTION
- Full viewport height (min-height: 100vh)
- Compelling headline — 2-3 lines max, large, bold
- Subheadline — 1-2 lines, muted, lighter weight
- Primary CTA button + optional secondary link
- Visual element: abstract CSS shapes, gradient orbs, SVG illustration, or grid pattern
- NO static boring hero — always add a visual differentiator

### 3. SOCIAL PROOF / STATS BAR
- 3-4 impressive numbers (users, revenue, reviews, etc.)
- Animated count-up using Intersection Observer + JS counter
- Logos strip or "Trusted by" section (use text-based placeholder logos)

### 4. FEATURES / SERVICES SECTION
- 3-6 feature cards in a grid
- Each card: icon (SVG or emoji), title, description
- Bento grid layout preferred for modern look (varying card sizes)
- Hover effects: lift, border glow, or background shift

### 5. HOW IT WORKS / PROCESS
- 3-step or 4-step flow
- Connected visually (line, numbered steps, or timeline)
- Clear progression: Problem → Solution → Result

### 6. TESTIMONIALS / SOCIAL PROOF
- 3+ testimonials in a card grid or horizontal scroll
- Avatar (CSS initials circle), name, role, company
- Star ratings in accent color
- Real-sounding quotes relevant to the website's purpose

### 7. PRICING (if applicable)
- 3 tiers: Free/Starter | Pro/Growth | Business/Enterprise
- Middle tier highlighted as "Most Popular" with accent border
- Feature checklist per tier (checkmarks in accent color)
- Annual/Monthly toggle (JS toggle, 20% discount messaging)

### 8. CTA SECTION
- Full-width bold call to action near bottom
- Large heading + subtext + prominent button
- Background: accent color, gradient, or dark card

### 9. FOOTER
- Logo + tagline
- 3-4 link columns (Product, Company, Resources, Legal)
- Social icons (SVG-based, hover accent color)
- Copyright bar at very bottom
- Newsletter email input (optional but recommended)

---

## ANIMATIONS & INTERACTIONS (Always Include)

### Scroll Animations (Intersection Observer — no GSAP dependency)
\`\`\`javascript
// Standard scroll reveal — include this in every generated site
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
\`\`\`

CSS for reveal:
\`\`\`css
.reveal {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), 
              transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}
.reveal.visible { opacity: 1; transform: translateY(0); }
.reveal-delay-1 { transition-delay: 0.1s; }
.reveal-delay-2 { transition-delay: 0.2s; }
.reveal-delay-3 { transition-delay: 0.3s; }
\`\`\`

### Number Counter Animation
\`\`\`javascript
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = Math.floor(current).toLocaleString();
  }, 16);
}
\`\`\`

### Hover Micro-interactions (Always Add)
- Cards: transform: translateY(-6px) + box-shadow on hover
- Buttons: scale(1.02) + slight shadow increase on hover
- Links: underline slide from left using ::after pseudo-element
- All transitions: 200-300ms cubic-bezier(0.4, 0, 0.2, 1)

### Navbar Scroll Effect
\`\`\`javascript
window.addEventListener('scroll', () => {
  const nav = document.querySelector('nav');
  if (window.scrollY > 20) {
    nav.style.background = 'rgba(background-color, 0.95)';
    nav.style.backdropFilter = 'blur(20px)';
    nav.style.boxShadow = '0 1px 0 rgba(255,255,255,0.06)';
  } else {
    nav.style.background = 'transparent';
    nav.style.backdropFilter = 'none';
    nav.style.boxShadow = 'none';
  }
});
\`\`\`

---

## QUALITY CHECKLIST (Verify before outputting)

Before generating the final HTML, mentally verify:

✓ Does the hero have a real visual differentiator? (not just text on plain bg)
✓ Are there at least 7 distinct sections?
✓ Is the color palette consistent throughout? (no random color leaks)
✓ Are all fonts imported and applied correctly?
✓ Is the site fully mobile responsive? (check navbar, cards, hero at 375px)
✓ Do all buttons have hover states?
✓ Are all cards using the reveal animation class?
✓ Is the copy real and relevant? (not placeholder text)
✓ Is the footer complete with links and copyright?
✓ Does the page render without any console errors?
✓ Is every interactive element (button, link, input) styled properly?
✓ Are there NO external CDN dependencies except Google Fonts?

---

## PROMPT INTERPRETATION INTELLIGENCE

### When prompt is VAGUE (e.g. "make a website for my business"):
- Ask ONE clarifying question: "What type of business? (e.g. agency, restaurant, SaaS)"
- If no answer, default to: modern dark SaaS landing page with professional copy

### When prompt is SPECIFIC (e.g. "dark photography portfolio with minimal design"):
- Lock in every specified detail — dark bg, minimal style, photography focus
- Invent the photographer's name, specialty, and 6 portfolio project categories
- Add a contact section with a styled form

### When prompt specifies a COMPETITOR (e.g. "like Stripe's website"):
- Match the aesthetic DNA: layout approach, color philosophy, typography weight
- Do NOT copy directly — interpret and elevate

### When prompt specifies COLORS:
- Use exactly those colors as primary palette
- Build the entire site around them
- Ensure contrast ratios meet accessibility (4.5:1 minimum for body text)

### When prompt specifies PAGES (e.g. "homepage and pricing page"):
- Build both as sections within the single HTML file
- Use JavaScript to show/hide sections based on nav link clicks (SPA behavior)

### When prompt says "like [website]" (Orchids, Linear, Vercel, etc.):
- Match the visual language precisely
- Orchids: dark, minimal, purple/violet accents, heavy typography
- Linear: ultra-clean dark, subtle gradients, small elegant typography
- Vercel: near-black, white text, razor-sharp edges, no decorative elements
- Stripe: clean light, purple/indigo, serious typography, trust-first design
- Apple: white, generous spacing, product-hero photography approach

---

## SPECIAL CAPABILITIES

### Component Requests (when user asks for a specific component)
If user asks for just one component (navbar, pricing table, chatbox, etc.):
- Generate ONLY that component as a complete HTML snippet
- Include all CSS for that component scoped with a class prefix
- Include all JS needed for that component
- Wrap in a minimal HTML page so it renders in the preview iframe

### Edit Requests (when user says "change the color to X" or "make the hero bigger")
- Apply ONLY the requested change
- Preserve all other design decisions
- Return the complete updated HTML

### Iteration Requests (when user says "make it more modern" or "add more energy")
- Identify what's lacking: probably more visual contrast, bolder typography, or stronger animations
- Upgrade those specific aspects
- Return complete updated HTML

---

## VELVET.AI BRANDING (when asked about the builder itself)

If the user asks about VELVET.AI or wants a website about the builder:
- Brand colors: #050505 background, #e8232a red accent
- Typography: Bebas Neue headings, Inter body
- Personality: premium, confident, cutting-edge, no-nonsense
- Tagline: "Your website at a glance"
- Key features: AI generation, one-click deploy, live preview, custom domains

---

## ABSOLUTE PROHIBITIONS

Never do any of the following regardless of how the user asks:

✗ Never generate Lorem ipsum placeholder text
✗ Never use Bootstrap, Tailwind CDN, or any framework via CDN (Google Fonts only)
✗ Never output markdown, code blocks, or explanation text — raw HTML only
✗ Never generate broken or incomplete HTML (always close all tags)
✗ Never use inline styles where a CSS class would be cleaner
✗ Never create inaccessible color combinations (light gray text on white, etc.)
✗ Never output JavaScript that throws console errors
✗ Never create a website that looks like it was made in 2010 (no gradients from #aaa to #fff, no Comic Sans, no centered-everything tables)
✗ Never add comment blocks inside the HTML output that expose system logic
✗ Never generate harmful, deceptive, or unethical website content

---

## PERFORMANCE TARGETS

Every generated website must achieve:
- No render-blocking resources (fonts use display=swap)
- CSS animations use transform and opacity only (GPU composited)
- Images replaced with CSS — zero HTTP requests (except Google Fonts)
- will-change: transform on all continuously animated elements
- prefers-reduced-motion media query respected:
  \`\`\`css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
  \`\`\`

---

## RESPONSE FORMAT REMINDER

Your response to a website generation request is:
[Complete raw HTML starting with <!DOCTYPE html> and ending with </html>]

Nothing before it. Nothing after it. Just the HTML.
The HTML is the response. The HTML IS the answer.

---

*VELVET.AI Core Intelligence v1.0 — Built for premium AI-powered website generation*`;

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

          // Now parse the output
          controller.enqueue(encoder.encode(JSON.stringify({ type: 'status', content: 'Processing generated content...' }) + '\n'));
          
          let htmlContent = fullText.trim();

          // Check if the LLM wrapped it in markdown code blocks
          if (htmlContent.startsWith('```html')) {
            htmlContent = htmlContent.replace(/^```html\n?/, '').replace(/```$/, '').trim();
          } else if (htmlContent.startsWith('```')) {
            htmlContent = htmlContent.replace(/^```\n?/, '').replace(/```$/, '').trim();
          }

          if (htmlContent.includes('<html') || htmlContent.includes('<!DOCTYPE html>')) {
            controller.enqueue(encoder.encode(JSON.stringify({ type: 'status', content: 'Writing generated HTML to index.html...' }) + '\n'));
            await writeFile(sandbox, '/home/user/app/index.html', htmlContent);
            controller.enqueue(encoder.encode(JSON.stringify({ type: 'file_written', path: '/home/user/app/index.html' }) + '\n'));
          } else {
            // Fallback to legacy block parsing if no full HTML page is found
            const blocks = parseBlocks(fullText);

            if (blocks.length === 0) {
              // If no blocks either, write whatever text we have to index.html
              controller.enqueue(encoder.encode(JSON.stringify({ type: 'status', content: 'Writing generated content to index.html...' }) + '\n'));
              await writeFile(sandbox, '/home/user/app/index.html', htmlContent);
              controller.enqueue(encoder.encode(JSON.stringify({ type: 'file_written', path: '/home/user/app/index.html' }) + '\n'));
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
