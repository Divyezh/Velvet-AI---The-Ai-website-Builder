"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";
import { Navbar, Footer } from "../components";

interface Section {
  id: string;
  title: string;
}

export default function PrivacyPage() {
  const sections: Section[] = [
    { id: "intro", title: "1. Introduction & Scope" },
    { id: "collection", title: "2. Data We Collect" },
    { id: "ai-usage", title: "3. How We Use AI Models" },
    { id: "cookies", title: "4. Cookies & Edge Telemetry" },
    { id: "sharing", title: "5. Third-Party Subprocessors" },
    { id: "rights", title: "6. Your Rights & Controls" },
    { id: "contact", title: "7. Policy Contact & Updates" },
  ];

  const [activeSection, setActiveSection] = useState<string>("intro");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 120,
        behavior: "smooth",
      });
      setActiveSection(id);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black-base text-white relative overflow-hidden">
      {/* Floating Ambient Glow */}
      <div
        className="absolute pointer-events-none animate-glow-1"
        style={{
          position: "absolute",
          top: "-150px",
          right: "-150px",
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, rgba(232,35,42,0.15) 0%, transparent 65%)",
          borderRadius: "9999px",
          zIndex: 1,
          filter: "blur(45px)",
        }}
      />

      {/* Navbar */}
      <Navbar onStartGenerate={() => {}} />

      {/* Main Content wrapper */}
      <main className="grow pt-36 pb-24 px-6 relative z-10 max-w-6xl mx-auto w-full">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-[#666666] hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          <span>BACK TO MAINBOARD</span>
        </Link>

        {/* Heading Header */}
        <div className="mb-16 border-b border-white/5 pb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs uppercase tracking-widest text-[#999999] border border-black-border px-3 py-1 rounded-full bg-black-card/65">
              Legal Center
            </span>
            <span className="text-xs font-mono text-neutral-500">Last updated: June 8, 2026</span>
          </div>
          <h1 className="font-display text-5xl md:text-7xl text-white tracking-wider uppercase mb-6">
            Privacy <span className="text-red-vivid">Policy</span>
          </h1>
          <p className="text-[#999999] font-sans font-light text-sm md:text-base leading-relaxed max-w-3xl">
            At Velvet.ai, your trust is fundamental to our compiler environment. This policy outlines how we handle prompt datasets, sandbox telemetry, custom uploads, and code generation outputs with structural privacy boundaries.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="flex flex-col md:flex-row gap-12">
          {/* Left Sticky Sidebar Index */}
          <aside className="w-full md:w-64 shrink-0 md:sticky md:top-28 h-fit self-start">
            <div className="bg-[#0b0c10]/40 border border-white/5 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-[#999999] mb-2 border-b border-white/5 pb-2">
                <Shield className="w-3.5 h-3.5 text-red-vivid" />
                <span>POLICY INDEX</span>
              </div>
              <nav className="flex flex-col gap-3">
                {sections.map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => handleScrollTo(sec.id)}
                    className={`text-left text-xs font-sans tracking-wide transition-colors cursor-pointer block select-none ${
                      activeSection === sec.id
                        ? "text-red-vivid font-bold"
                        : "text-[#666666] hover:text-white"
                    }`}
                  >
                    {sec.title}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Right Scrollable content */}
          <div className="flex-1 space-y-12 max-w-3xl">
            {/* Section 1: Intro */}
            <section id="intro" className="scroll-mt-32">
              <h2 className="text-xl font-display uppercase tracking-wider text-white border-b border-white/5 pb-3 mb-4">
                1. Introduction & Scope
              </h2>
              <div className="text-[#999999] font-sans font-light text-sm leading-relaxed space-y-4">
                <p>
                  Velvet Technology Corp. (“Velvet.ai”, “we”, “our”) operates the Velvet.ai platform—a cloud-based AI system compiler that generates front-end layout styles and hosting nodes.
                </p>
                <p>
                  This Privacy Policy applies to all developers, creators, and business entities utilizing our compilation dashboard, live sandbox, and API integrations. By executing build commands on our platform, you consent to the collection practices defined herein.
                </p>
              </div>
            </section>

            {/* Section 2: Collection */}
            <section id="collection" className="scroll-mt-32">
              <h2 className="text-xl font-display uppercase tracking-wider text-white border-b border-white/5 pb-3 mb-4">
                2. Data We Collect
              </h2>
              <div className="text-[#999999] font-sans font-light text-sm leading-relaxed space-y-4">
                <p>
                  To deliver premium customized compilers, we gather inputs matching three main categories:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-[#999999]">
                  <li>
                    <strong className="text-white">Prompt Inputs:</strong> The text descriptions, layout guidelines, color parameters, and specifications you type in the generation dialog.
                  </li>
                  <li>
                    <strong className="text-white">User Metadata:</strong> Setup indicators, browser settings, preferred developer frameworks, and profile telemetry.
                  </li>
                  <li>
                    <strong className="text-white">Live Sandboxing Logs:</strong> Compilation timelines, execution errors, styling discrepancies, and preview clicks generated inside the playground.
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 3: AI Usage */}
            <section id="ai-usage" className="scroll-mt-32">
              <h2 className="text-xl font-display uppercase tracking-wider text-white border-b border-white/5 pb-3 mb-4">
                3. How We Use AI Models
              </h2>
              <div className="text-[#999999] font-sans font-light text-sm leading-relaxed space-y-4">
                <p>
                  Our layout compilations leverage optimized transformer architecture to produce front-end components. We enforce strict data privacy boundaries concerning our weights:
                </p>
                <p>
                  <span className="text-red-vivid font-semibold">// Model Isolation:</span> Velvet.ai does not utilize your proprietary prompt inputs, generated code, or layout assets to train publicly available AI models. Your custom dashboard prompts remain isolated inside your organization workspace logs.
                </p>
                <p>
                  If you opt into our community showcase, only then do we utilize compile heuristics to build optimized visual recommendations for other creators.
                </p>
              </div>
            </section>

            {/* Section 4: Cookies */}
            <section id="cookies" className="scroll-mt-32">
              <h2 className="text-xl font-display uppercase tracking-wider text-white border-b border-white/5 pb-3 mb-4">
                4. Cookies & Edge Telemetry
              </h2>
              <div className="text-[#999999] font-sans font-light text-sm leading-relaxed space-y-4">
                <p>
                  We deploy localized storage nodes to track UI preferences and user validation states:
                </p>
                <p>
                  Session caching cookies keep you logged into the builder sandbox. Telemetry tracks compiler load times to allocate correct server cores for high-speed outputs. We do not use cross-site tracking cookies.
                </p>
              </div>
            </section>

            {/* Section 5: Sharing */}
            <section id="sharing" className="scroll-mt-32">
              <h2 className="text-xl font-display uppercase tracking-wider text-white border-b border-white/5 pb-3 mb-4">
                5. Third-Party Subprocessors
              </h2>
              <div className="text-[#999999] font-sans font-light text-sm leading-relaxed space-y-4">
                <p>
                  We collaborate with external security hosts and processor systems to optimize deployment workflows:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong className="text-white">Hosting Nodes:</strong> Secure AWS and Vercel edge networks for hosting preview instances.
                  </li>
                  <li>
                    <strong className="text-white">Security & Auditing:</strong> Stripe for encrypted subscription logs and cloud firewalls for DDoS prevention.
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 6: Rights */}
            <section id="rights" className="scroll-mt-32">
              <h2 className="text-xl font-display uppercase tracking-wider text-white border-b border-white/5 pb-3 mb-4">
                6. Your Rights & Controls
              </h2>
              <div className="text-[#999999] font-sans font-light text-sm leading-relaxed space-y-4">
                <p>
                  You retain complete authority over your sandboxed workspace:
                </p>
                <p>
                  You can purge generated design histories, disconnect hosting endpoints, export workspace setups, or request a complete server account termination by messaging our support desk.
                </p>
              </div>
            </section>

            {/* Section 7: Contact */}
            <section id="contact" className="scroll-mt-32">
              <h2 className="text-xl font-display uppercase tracking-wider text-white border-b border-white/5 pb-3 mb-4">
                7. Policy Contact & Updates
              </h2>
              <div className="text-[#999999] font-sans font-light text-sm leading-relaxed space-y-4">
                <p>
                  We will notify account holders via dashboard banner updates if structural changes occur in our storage systems.
                </p>
                <p>
                  For detailed data handling inquiries, contact:
                  <br />
                  <span className="text-white font-semibold">legal@velvet.ai</span>
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
