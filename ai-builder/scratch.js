const fs = require('fs');
let code = fs.readFileSync('src/app/sandbox/page.tsx', 'utf8');

// 1. Fix imports
code = code.replace(/from '\.\/components/g, 'from \'../components');
code = code.replace(/from "\.\/components/g, 'from "../components');

// 2. Remove unused UI imports
code = code.replace(/import \{[\s\S]*?\} from "\.\.\/components";/, '');
code = code.replace(/import \{ TestimonialCard \} from "\.\.\/components\/ui\/testimonial-cards";/, '');
code = code.replace(/import \{ HeroWave \} from "\.\.\/components\/ui\/ai-input-hero";/, '');

// 3. Remove ShuffleTestimonials
code = code.replace(/const SHUFFLE_TESTIMONIALS = \[[\s\S]*?function ShuffleTestimonials\(\) \{[\s\S]*?\}\n\n/m, '');

// 4. Transform Home -> SandboxPage
code = code.replace('export default function Home() {', 'import { Suspense } from "react";\nimport { useSearchParams } from "next/navigation";\n\nexport default function SandboxPageWrapper() {\n  return (\n    <Suspense fallback={<div className="h-screen bg-black flex items-center justify-center text-white">Loading sandbox...</div>}>\n      <SandboxPage />\n    </Suspense>\n  );\n}\n\nfunction SandboxPage() {');

// 5. Replace useEffect URL handling
const oldEffect = `  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("builder") === "true") {
        setShowWorkspace(true);
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);`;

const newEffect = `  const searchParams = useSearchParams();\n  useEffect(() => {
    const promptParam = searchParams.get("prompt");
    setShowWorkspace(true);
    if (promptParam && !sandboxId && !isInitializingSandbox) {
      setActivePrompt(promptParam);
      initSandbox(promptParam);
    } else if (!promptParam && !sandboxId && !isInitializingSandbox) {
      initSandbox();
    }
  }, [searchParams]);`;

code = code.replace(oldEffect, newEffect);

// 6. Delete landing page return (everything after 'if (showWorkspace) {')
const idx = code.indexOf('if (showWorkspace) {');
if (idx !== -1) {
    let workspaceStart = code.substring(idx);
    let braceCount = 0;
    let endIdx = -1;
    for (let i = 0; i < workspaceStart.length; i++) {
        if (workspaceStart[i] === '{') braceCount++;
        if (workspaceStart[i] === '}') {
            braceCount--;
            if (braceCount === 0) {
                endIdx = i;
                break;
            }
        }
    }
    
    if (endIdx !== -1) {
        const cleanedWorkspace = workspaceStart.substring(0, endIdx + 1);
        code = code.substring(0, idx) + cleanedWorkspace + '\n}\n';
    }
}

// 7. Change exit router
code = code.replace('setShowWorkspace(false);\n                      setActivePrompt("");\n                      setHeroPrompt("");\n                      setSandboxId(null);\n                      setPreviewUrl(null);\n                      setFiles([]);\n                      setActiveFile(null);\n                      setChatMessages([]);', 'router.push("/");');

fs.writeFileSync('src/app/sandbox/page.tsx', code);
console.log("File transformed successfully.");
