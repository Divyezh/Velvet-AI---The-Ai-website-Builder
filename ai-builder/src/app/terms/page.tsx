"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { Navbar, Footer } from "../components";

interface Section {
  id: string;
  title: string;
}

export default function TermsPage() {
  const sections: Section[] = [
    { id: "acceptance", title: "1. Acceptance of Terms" },
    { id: "workspace", title: "2. Workspace & Registration" },
    { id: "billing", title: "3. Billing & Cancellations" },
    { id: "ownership", title: "4. Code Output & Ownership" },
    { id: "conduct", title: "5. User Conduct & Guidelines" },
    { id: "disclaimers", title: "6. Disclaimers & Liability" },
    { id: "governing", title: "7. Governing Law & Dispute" },
  ];

  const [activeSection, setActiveSection] = useState<string>("acceptance");

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
          bottom: "-100px",
          left: "-150px",
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, rgba(232,35,42,0.14) 0%, transparent 65%)",
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
            Terms of <span className="text-red-vivid">Service</span>
          </h1>
          <p className="text-[#999999] font-sans font-light text-sm md:text-base leading-relaxed max-w-3xl">
            Welcome to Velvet.ai. These Terms of Service (“Terms”) outline structural guidelines, code compilation licenses, and account responsibilities. Please review them carefully prior to creating workspace environments.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="flex flex-col md:flex-row gap-12">
          {/* Left Sticky Sidebar Index */}
          <aside className="w-full md:w-64 shrink-0 md:sticky md:top-28 h-fit self-start">
            <div className="bg-[#0b0c10]/40 border border-white/5 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-[#999999] mb-2 border-b border-white/5 pb-2">
                <FileText className="w-3.5 h-3.5 text-red-vivid" />
                <span>AGREEMENT INDEX</span>
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
            {/* Section 1: Acceptance */}
            <section id="acceptance" className="scroll-mt-32">
              <h2 className="text-xl font-display uppercase tracking-wider text-white border-b border-white/5 pb-3 mb-4">
                1. Acceptance of Terms
              </h2>
              <div className="text-[#999999] font-sans font-light text-sm leading-relaxed space-y-4">
                <p>
                  By accessing or compiling code using the Velvet.ai web application, dashboard panel, and associated API nodes, you agree to be bound by these Terms.
                </p>
                <p>
                  If you are registering an account on behalf of a studio or corporate entity, you certify that you have the complete legal authorization to bind that entity to these guidelines. If you do not agree, do not compile or host sites using Velvet.ai.
                </p>
              </div>
            </section>

            {/* Section 2: Workspace */}
            <section id="workspace" className="scroll-mt-32">
              <h2 className="text-xl font-display uppercase tracking-wider text-white border-b border-white/5 pb-3 mb-4">
                2. Workspace & Registration
              </h2>
              <div className="text-[#999999] font-sans font-light text-sm leading-relaxed space-y-4">
                <p>
                  To use the AI compilation engine, you will create a developer workspace credentials profile:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-[#999999]">
                  <li>
                    You are solely responsible for maintaining the confidentiality of your workspace API key logs and sandbox keys.
                  </li>
                  <li>
                    You must immediately report any unauthorized resource execution or security compromises of your domain configuration nodes.
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 3: Billing */}
            <section id="billing" className="scroll-mt-32">
              <h2 className="text-xl font-display uppercase tracking-wider text-white border-b border-white/5 pb-3 mb-4">
                3. Billing & Cancellations
              </h2>
              <div className="text-[#999999] font-sans font-light text-sm leading-relaxed space-y-4">
                <p>
                  Subscription models (Pro and Enterprise) are structured on a monthly or annual auto-renew schedule:
                </p>
                <p>
                  Prices are locked based on compiler core usage metrics. You can downgrade or cancel subscriptions directly in your dashboard workspace panel at any time. Refund requests are subject to active resource checks and compiler core consumption reviews.
                </p>
              </div>
            </section>

            {/* Section 4: Ownership */}
            <section id="ownership" className="scroll-mt-32">
              <h2 className="text-xl font-display uppercase tracking-wider text-white border-b border-white/5 pb-3 mb-4">
                4. Code Output & Ownership
              </h2>
              <div className="text-[#999999] font-sans font-light text-sm leading-relaxed space-y-4">
                <p>
                  Velvet.ai specializes in the compiler translation of design elements:
                </p>
                <p>
                  <span className="text-red-vivid font-semibold">// Full IP Assignment:</span> All rights, titles, and intellectual property ownership of the compiled code layouts, customized themes, and hosted front-end pages generated by your prompts belong entirely to you. Velvet.ai claims no copyright on your compiled assets.
                </p>
                <p>
                  You grant Velvet.ai a temporary, limited, non-exclusive license to host, display, and cache your layout preview files to complete your build commands.
                </p>
              </div>
            </section>

            {/* Section 5: Conduct */}
            <section id="conduct" className="scroll-mt-32">
              <h2 className="text-xl font-display uppercase tracking-wider text-white border-b border-white/5 pb-3 mb-4">
                5. User Conduct & Guidelines
              </h2>
              <div className="text-[#999999] font-sans font-light text-sm leading-relaxed space-y-4">
                <p>
                  You agree to compile and publish content that complies with international legal guidelines. Prohibited actions include:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    Using the AI compiler to generate malicious phishing links, malware pages, or deceptive landing interfaces.
                  </li>
                  <li>
                    Running script prompts that attempt to reverse-engineer our proprietary layout rendering weights or bypass API core boundaries.
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 6: Disclaimers */}
            <section id="disclaimers" className="scroll-mt-32">
              <h2 className="text-xl font-display uppercase tracking-wider text-white border-b border-white/5 pb-3 mb-4">
                6. Disclaimers & Liability
              </h2>
              <div className="text-[#999999] font-sans font-light text-sm leading-relaxed space-y-4">
                <p>
                  Velvet.ai is provided on an “as is” and “as available” operational basis:
                </p>
                <p>
                  We offer no structural guarantees that AI-generated visual patterns will compile without styling discrepancies or render identically on all legacy web viewports. The developer is responsible for checking layout integrity prior to live custom domain deployment.
                </p>
              </div>
            </section>

            {/* Section 7: Governing */}
            <section id="governing" className="scroll-mt-32">
              <h2 className="text-xl font-display uppercase tracking-wider text-white border-b border-white/5 pb-3 mb-4">
                7. Governing Law & Dispute
              </h2>
              <div className="text-[#999999] font-sans font-light text-sm leading-relaxed space-y-4">
                <p>
                  These Terms and any structural actions relating to compiler executions shall be governed by the laws of the State of California, without regard to conflict of law principles.
                </p>
                <p>
                  For inquiries or detailed service terms, contact:
                  <br />
                  <span className="text-white font-semibold">operations@velvet.ai</span>
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
