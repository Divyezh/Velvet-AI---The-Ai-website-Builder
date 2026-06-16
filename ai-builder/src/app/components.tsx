"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Sparkles, Code2, Play, Globe, Layout, 
  Terminal, Monitor, CheckCircle2, ChevronRight,
  MessageSquare, Settings, Check, Zap
} from "lucide-react";
import Link from "next/link";

// --- NAVBAR ---
export function Navbar({ onStartGenerate }: { onStartGenerate?: () => void }) {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 border-b border-white/5 bg-[#0A0A0A]/80 backdrop-blur-md z-50 flex items-center justify-between px-6">
      <Link href="/" className="flex items-center gap-2 text-white font-semibold tracking-tight">
        <div className="w-6 h-6 rounded bg-white text-black flex items-center justify-center font-bold text-xs">V</div>
        Velvet
      </Link>
      <div className="flex items-center gap-6 text-sm font-medium text-slate-300">
        <Link href="/faq" className="hover:text-white transition-colors">FAQ</Link>
        <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
        <a href="#" className="hover:text-white transition-colors">Log in</a>
        <button onClick={onStartGenerate} className="bg-white text-black px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors">
          Sign Up
        </button>
      </div>
    </nav>
  );
}

// --- HERO INTERACTIVE MOCKUP ---
export function HeroPreview() {
  return (
    <div className="w-full max-w-[1200px] mx-auto rounded-xl overflow-hidden border border-white/10 bg-[#0A0A0A] shadow-2xl shadow-black/50 flex flex-col h-[600px] font-sans text-sm">
      {/* Mockup Header */}
      <div className="h-12 bg-[#111] border-b border-white/5 flex items-center px-4 justify-between select-none shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 mr-4">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <div className="px-3 py-1 bg-white/5 rounded-md text-[11px] text-slate-400 border border-white/5 font-mono flex items-center gap-2">
            <Layout className="w-3 h-3" />
            my-saas-app
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 bg-white/10 hover:bg-white/15 text-white text-[11px] rounded-md transition-colors flex items-center gap-1.5 font-medium">
            <Play className="w-3 h-3" /> Preview
          </button>
          <button className="px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white text-[11px] rounded-md transition-colors flex items-center gap-1.5 font-medium">
            <Globe className="w-3 h-3" /> Deploy
          </button>
        </div>
      </div>

      {/* Mockup Body: 3 panes */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Pane: AI Chat */}
        <div className="w-[300px] bg-[#161616] border-r border-white/5 flex flex-col shrink-0">
          <div className="p-3 border-b border-white/5 flex items-center gap-2 text-xs font-semibold text-slate-300">
            <MessageSquare className="w-4 h-4 text-slate-400" />
            Velvet AI Agent
          </div>
          <div className="flex-1 p-4 space-y-4 overflow-hidden relative">
            <div className="bg-[#222] p-3 rounded-lg text-xs text-slate-300 border border-white/5">
              I'm ready to build your SaaS app. What should we add first?
            </div>
            <div className="bg-indigo-500/10 border border-indigo-500/20 p-3 rounded-lg text-xs text-indigo-200 ml-6">
              Create a modern dashboard layout with a sidebar and a metrics grid.
            </div>
            <div className="bg-[#222] p-3 rounded-lg text-xs text-slate-300 border border-white/5">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                <span className="font-semibold text-white">Generating...</span>
              </div>
              <div className="space-y-1 font-mono text-[10px] text-slate-500">
                <div>&gt; Compiling Sidebar.tsx</div>
                <div>&gt; Compiling MetricsGrid.tsx</div>
                <div className="text-emerald-400">&gt; Layout generated</div>
              </div>
            </div>
            {/* Fade out bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-[#161616] to-transparent" />
          </div>
          <div className="p-3 border-t border-white/5">
            <div className="bg-[#0A0A0A] border border-white/10 rounded-md p-2 flex items-center">
              <span className="text-xs text-slate-500 flex-1">Ask AI to modify...</span>
              <div className="w-5 h-5 rounded bg-white/10 flex items-center justify-center">
                <ChevronRight className="w-3 h-3 text-slate-300" />
              </div>
            </div>
          </div>
        </div>

        {/* Center Pane: Code Editor */}
        <div className="flex-1 bg-[#0A0A0A] border-r border-white/5 flex flex-col">
          <div className="flex bg-[#111] border-b border-white/5">
            <div className="px-4 py-2 bg-[#0A0A0A] text-[11px] text-indigo-300 border-t-2 border-indigo-500 font-mono">
              Dashboard.tsx
            </div>
            <div className="px-4 py-2 text-[11px] text-slate-500 border-t-2 border-transparent font-mono cursor-not-allowed">
              Sidebar.tsx
            </div>
          </div>
          <div className="flex-1 p-4 font-mono text-[12px] leading-loose text-slate-400 overflow-hidden relative">
            <div className="text-indigo-400">import <span className="text-white">React</span> from <span className="text-emerald-400">'react'</span>;</div>
            <div className="text-indigo-400">import <span className="text-white">{'{'} Sidebar, MetricsGrid {'}'}</span> from <span className="text-emerald-400">'@/components'</span>;</div>
            <br />
            <div className="text-indigo-400">export default function <span className="text-blue-400">Dashboard</span>() {'{'}</div>
            <div className="pl-4">return (</div>
            <div className="pl-8 text-slate-500">&lt;<span className="text-rose-400">div</span> <span className="text-indigo-300">className</span>=<span className="text-emerald-400">"flex h-screen bg-black"</span>&gt;</div>
            <div className="pl-12 text-slate-500">&lt;<span className="text-rose-400">Sidebar</span> /&gt;</div>
            <div className="pl-12 text-slate-500">&lt;<span className="text-rose-400">main</span> <span className="text-indigo-300">className</span>=<span className="text-emerald-400">"flex-1 p-8"</span>&gt;</div>
            <div className="pl-16 text-slate-500">&lt;<span className="text-rose-400">MetricsGrid</span> /&gt;</div>
            <div className="pl-12 text-slate-500">&lt;/<span className="text-rose-400">main</span>&gt;</div>
            <div className="pl-8 text-slate-500">&lt;/<span className="text-rose-400">div</span>&gt;</div>
            <div className="pl-4">);</div>
            <div>{'}'}</div>
            {/* Blinking cursor */}
            <div className="w-2 h-4 bg-white/50 mt-1 animate-pulse" />
          </div>
        </div>

        {/* Right Pane: Live Preview */}
        <div className="w-[400px] bg-white flex flex-col shrink-0">
          <div className="h-8 bg-[#f5f5f5] border-b border-[#e5e5e5] flex items-center px-3 gap-2">
            <Monitor className="w-3 h-3 text-slate-400" />
            <div className="bg-white px-2 py-0.5 rounded text-[10px] text-slate-500 border border-slate-200 flex-1 truncate">
              localhost:3000
            </div>
          </div>
          <div className="flex-1 p-4 bg-slate-50 overflow-hidden relative">
            <div className="flex gap-4 h-full">
              {/* Fake Sidebar */}
              <div className="w-16 bg-slate-900 rounded-lg flex flex-col items-center py-4 gap-4">
                <div className="w-8 h-8 rounded bg-indigo-500" />
                <div className="w-6 h-6 rounded bg-white/10" />
                <div className="w-6 h-6 rounded bg-white/10" />
                <div className="w-6 h-6 rounded bg-white/10" />
              </div>
              {/* Fake Content */}
              <div className="flex-1 flex flex-col gap-4">
                <div className="h-10 bg-white rounded-lg shadow-sm border border-slate-100 flex items-center px-4">
                  <div className="w-24 h-3 bg-slate-200 rounded" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-20 bg-white rounded-lg shadow-sm border border-slate-100 p-3 flex flex-col gap-2">
                    <div className="w-12 h-2 bg-slate-200 rounded" />
                    <div className="w-16 h-6 bg-slate-800 rounded" />
                  </div>
                  <div className="h-20 bg-white rounded-lg shadow-sm border border-slate-100 p-3 flex flex-col gap-2">
                    <div className="w-12 h-2 bg-slate-200 rounded" />
                    <div className="w-16 h-6 bg-slate-800 rounded" />
                  </div>
                </div>
                <div className="flex-1 bg-white rounded-lg shadow-sm border border-slate-100 p-4">
                  <div className="w-32 h-3 bg-slate-200 rounded mb-4" />
                  <div className="space-y-2">
                    <div className="w-full h-8 bg-slate-50 rounded border border-slate-100" />
                    <div className="w-full h-8 bg-slate-50 rounded border border-slate-100" />
                    <div className="w-full h-8 bg-slate-50 rounded border border-slate-100" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute inset-0 ring-1 ring-inset ring-black/5 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}

// --- FEATURE SECTIONS ---
export function AlternatingFeatures() {
  const features = [
    {
      title: "Generate production-ready code",
      desc: "Our AI engine writes semantic, highly optimized React and Node.js code that adheres to enterprise standards. No messy abstractions, just clean code you can own.",
      icon: <Code2 className="w-5 h-5 text-indigo-400" />,
      mockup: (
        <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-4 font-mono text-xs text-slate-300 leading-relaxed shadow-xl">
          <div className="text-slate-500 mb-2">// Fully typed, production-ready React component</div>
          <div><span className="text-indigo-400">export function</span> <span className="text-blue-400">DashboardWidget</span>() {'{'}</div>
          <div className="pl-4"><span className="text-indigo-400">const</span> [data, setData] = <span className="text-blue-400">useState</span>&lt;Analytics&gt;([]);</div>
          <div className="pl-4 mt-2">return (</div>
          <div className="pl-8 text-slate-500">&lt;<span className="text-rose-400">div</span> <span className="text-indigo-300">className</span>=<span className="text-emerald-400">"grid gap-4"</span>&gt;</div>
          <div className="pl-12">{'/* Auto-generated highly responsive layout */'}</div>
          <div className="pl-8 text-slate-500">&lt;/<span className="text-rose-400">div</span>&gt;</div>
          <div className="pl-4">);</div>
          <div>{'}'}</div>
        </div>
      )
    },
    {
      title: "Live preview instantly",
      desc: "Watch your application come to life as you describe it. The integrated sandbox compiles and runs your code in real-time, giving you immediate visual feedback.",
      icon: <Play className="w-5 h-5 text-emerald-400" />,
      mockup: (
        <div className="bg-white rounded-xl p-4 shadow-xl border border-slate-200 relative overflow-hidden h-48">
          <div className="absolute top-2 left-2 bg-emerald-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full z-10 flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> LIVE
          </div>
          <div className="w-full h-full bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-center relative">
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,107,158,0.05)_50%,transparent_75%)] bg-size-[250%_250%,100%_100%] animate-[shimmer_2s_infinite]" />
            <div className="flex flex-col items-center gap-3 relative z-10">
              <div className="w-12 h-12 bg-indigo-500 rounded-xl shadow-lg" />
              <div className="w-24 h-3 bg-slate-200 rounded-full" />
              <div className="w-16 h-2 bg-slate-200 rounded-full" />
            </div>
          </div>
        </div>
      )
    },
    {
      title: "One-click deployment",
      desc: "Push your generated application to global edge networks instantly. We handle the bundling, CDN distribution, and SSL certificates automatically.",
      icon: <Globe className="w-5 h-5 text-blue-400" />,
      mockup: (
        <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-5 shadow-xl font-mono text-xs">
          <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
            <span className="text-slate-400">Deployment Status</span>
            <span className="text-emerald-400 flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> SUCCESS</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-500">Domain</span>
              <span className="text-indigo-300">your-app.velvet.ai</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Environment</span>
              <span className="text-white">Production</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Region</span>
              <span className="text-white">Global Edge</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Time</span>
              <span className="text-white">450ms</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Multi-model support",
      desc: "Switch seamlessly between the world's most advanced LLMs. Use Claude 3.5 for UI design, GPT-4o for complex logic, and Gemini for rapid prototyping.",
      icon: <Settings className="w-5 h-5 text-purple-400" />,
      mockup: (
        <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-5 shadow-xl">
          <div className="space-y-2">
            <div className="bg-white/10 border border-indigo-500/50 rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span className="text-sm text-white font-medium">Claude 3.5 Sonnet</span>
              </div>
              <div className="w-2 h-2 rounded-full bg-indigo-500" />
            </div>
            <div className="bg-white/5 border border-transparent rounded-lg p-3 flex items-center justify-between opacity-50">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-emerald-500" />
                <span className="text-sm text-white font-medium">GPT-4o</span>
              </div>
            </div>
            <div className="bg-white/5 border border-transparent rounded-lg p-3 flex items-center justify-between opacity-50">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-500" />
                <span className="text-sm text-white font-medium">Gemini 1.5 Pro</span>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="w-full py-24 bg-black border-y border-white/5">
      <div className="max-w-6xl mx-auto px-6 space-y-32">
        {features.map((feat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 lg:gap-24`}
          >
            <div className="flex-1 space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                {feat.icon}
              </div>
              <h3 className="text-3xl md:text-4xl font-semibold text-white tracking-tight">
                {feat.title}
              </h3>
              <p className="text-lg text-slate-400 leading-relaxed max-w-md">
                {feat.desc}
              </p>
            </div>
            <div className="flex-1 w-full">
              {feat.mockup}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// --- METRICS SECTION ---
export function MetricsSection() {
  const metrics = [
    { value: "1M+", label: "Apps Generated" },
    { value: "100K+", label: "Developers" },
    { value: "99.9%", label: "Uptime" },
    { value: "500M+", label: "Lines Generated" }
  ];

  return (
    <div className="w-full py-24 bg-black">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 divide-x divide-white/10 border-y border-white/10 py-16">
          {metrics.map((metric, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`flex flex-col items-center justify-center text-center ${i === 0 ? 'border-none' : ''}`}
            >
              <h4 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
                {metric.value}
              </h4>
              <span className="text-sm text-slate-400 font-medium">
                {metric.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- TESTIMONIALS SECTION ---
export function Testimonials() {
  const reviews = [
    {
      body: "Velvet completely shifted our prototyping speed. We spun up 5 full-stack variants in minutes. The markup was beautiful and production-ready.",
      author: "Marcus Aurel",
      title: "Lead Dev at Vesper"
    },
    {
      body: "I've tried all the AI builders. Velvet is the only one that outputs custom systems that don't feel like stock templates. It's a game changer.",
      author: "Devon Thorne",
      title: "Product Lead, Aether"
    },
    {
      body: "I described my SaaS dashboard in a simple paragraph, and Velvet gave me a layout with perfectly balanced tones, charts, and routing.",
      author: "Celine Zhang",
      title: "Founder, Zenith Analytics"
    }
  ];

  return (
    <div className="w-full py-24 bg-black">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold text-white tracking-tight">Loved by developers</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 flex flex-col justify-between"
            >
              <div className="text-slate-300 text-sm leading-relaxed mb-8">
                "{rev.body}"
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white font-bold text-sm">
                  {rev.author[0]}
                </div>
                <div>
                  <div className="text-white text-sm font-semibold">{rev.author}</div>
                  <div className="text-slate-500 text-xs">{rev.title}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- CTA SECTION ---
export function CTA() {
  return (
    <div className="w-full py-32 bg-black border-t border-white/5 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
        <h2 className="text-4xl md:text-5xl font-semibold text-white tracking-tight mb-6">
          Ready to build your next app?
        </h2>
        <p className="text-lg text-slate-400 mb-10">
          Join thousands of developers building production-ready applications with Velvet AI.
        </p>
        <button className="bg-white text-black hover:bg-slate-200 px-8 py-4 rounded-xl font-semibold transition-colors text-sm shadow-[0_0_40px_rgba(255,255,255,0.15)]">
          Start Building Free
        </button>
      </div>
    </div>
  );
}

// --- FOOTER ---
export function Footer() {
  const sections = [
    {
      title: "Product",
      links: [
        { name: "AI Compiler", href: "#" },
        { name: "Live Editor", href: "#" },
        { name: "Pricing", href: "#" },
        { name: "Changelog", href: "#" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About", href: "#" },
        { name: "Blog", href: "/blog" },
        { name: "Careers", href: "/careers" },
        { name: "Contact", href: "/contact" }
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Documentation", href: "/documentation" },
        { name: "Community", href: "/community" },
        { name: "Help Center", href: "/help-center" },
        { name: "Status", href: "#" }
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "/privacy-policy" },
        { name: "Terms of Service", href: "/terms-of-service" },
        { name: "Cookie Policy", href: "/cookie-policy" }
      ]
    }
  ];

  return (
    <footer className="w-full bg-black-base border-t border-white/10 py-16 text-sm">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-5 gap-8">
        <div className="col-span-2 md:col-span-1">
          <Link href="/" className="font-semibold text-white text-lg tracking-tight flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-white text-black flex items-center justify-center font-bold text-[10px]">V</div>
            Velvet
          </Link>
          <div className="mt-4 text-slate-500 text-xs">
            © 2026 Velvet AI, Inc.<br/>All rights reserved.
          </div>
          <div className="flex gap-4 mt-6 text-slate-400">
            <Globe className="w-4 h-4 hover:text-white cursor-pointer transition-colors" />
          </div>
        </div>
        
        {sections.map(section => (
          <div key={section.title}>
            <h4 className="text-white font-semibold mb-4">{section.title}</h4>
            <ul className="space-y-3">
              {section.links.map(link => (
                <li key={link.name}>
                  <Link href={link.href} className="text-slate-400 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </footer>
  );
}
