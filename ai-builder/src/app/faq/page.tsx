"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, ArrowLeft, HelpCircle } from "lucide-react";
import { Navbar, Footer } from "../components";

interface FAQItem {
  question: string;
  answer: string;
  category: "General" | "Features" | "Billing" | "Technical";
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const faqs: FAQItem[] = [
    {
      category: "General",
      question: "What is Velvet.ai?",
      answer: "Velvet.ai is a premium generative web compiler that builds bespoke, high-performance landing pages, portfolios, and e-commerce designs using natural language. Unlike generic templates, it compiles production-ready semantic HTML, CSS, and interactive state systems customized directly for your brand.",
    },
    {
      category: "Features",
      question: "Can I export the compiled code?",
      answer: "Yes! On our Pro and Enterprise plans, you can export the clean, structured React/Next.js files, CSS styling, and asset packs. The output contains zero clutter, no bloated wrappers, and operates at maximum lighthouse performance.",
    },
    {
      category: "Features",
      question: "How does the AI designer customize layouts?",
      answer: "Velvet's layout engine uses deep structural reasoning to map your prompt to high-end design assets. Instead of matching placeholders, it writes responsive grid rules, configures tailored color systems (like dark mode glassmorphism), and sets up fluid typography hierarchies.",
    },
    {
      category: "Billing",
      question: "Is there a free trial?",
      answer: "We offer a Starter tier which is completely free. It allows you to build, test, and host one project on a Velvet sub-domain. You can upgrade at any time to connect custom domains and unlock unlimited generations.",
    },
    {
      category: "Technical",
      question: "Can I connect my own domain?",
      answer: "Absolutely. With our Pro Designer and Enterprise Studio tiers, you can map your custom domain or sub-domain with automated SSL certificates generated and configured by our CDN edge router instantly.",
    },
    {
      category: "Technical",
      question: "Is the generated website SEO optimized?",
      answer: "Yes, by default. Every compiled layout uses modern semantic HTML tags, proper title and description headers, correct heading structures (h1, h2, h3), responsive media scaling, and ultra-fast page load speeds.",
    },
    {
      category: "General",
      question: "How do I prompt the compiler for the best results?",
      answer: "Be specific about your brand's intent, the desired sections (e.g., hero, pricing, reviews), color themes (e.g., minimal dark with green accents), and target audience. The more structural details you provide, the more tailored the layout will be.",
    },
  ];

  const categories = ["All", "General", "Features", "Billing", "Technical"];

  const filteredFaqs =
    activeCategory === "All"
      ? faqs
      : faqs.filter((faq) => faq.category === activeCategory);

  return (
    <div className="min-h-screen flex flex-col bg-black-base text-white relative overflow-hidden">
      {/* Floating Ambient Glows */}
      <div
        className="absolute pointer-events-none animate-glow-1"
        style={{
          position: "absolute",
          top: "-150px",
          left: "-150px",
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, rgba(232,35,42,0.18) 0%, transparent 65%)",
          borderRadius: "9999px",
          zIndex: 1,
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute pointer-events-none animate-glow-2"
        style={{
          position: "absolute",
          bottom: "10%",
          right: "-100px",
          width: "550px",
          height: "550px",
          background: "radial-gradient(circle, rgba(232,35,42,0.12) 0%, transparent 65%)",
          borderRadius: "9999px",
          zIndex: 1,
          filter: "blur(40px)",
        }}
      />

      {/* Navbar wrapper */}
      <Navbar onStartGenerate={() => {}} />

      {/* Main Section */}
      <main className="grow pt-36 pb-24 px-6 relative z-10 max-w-4xl mx-auto w-full">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-[#666666] hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          <span>BACK TO MAINBOARD</span>
        </Link>

        {/* Heading Header */}
        <div className="mb-12">
          <span className="text-xs uppercase tracking-widest text-[#999999] border border-black-border px-3 py-1 rounded-full bg-black-card/65">
            Support Desk
          </span>
          <h1 className="font-display text-5xl md:text-7xl text-white mt-4 mb-4 tracking-wider uppercase">
            Frequently Asked <span className="text-red-vivid">Questions</span>
          </h1>
          <p className="text-[#999999] font-sans font-light text-sm md:text-base leading-relaxed max-w-2xl">
            Everything you need to know about building, exporting, and launching with Velvet.ai. Can't find your answer? Use the live chatbot widget below.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-10 border-b border-white/5 pb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setOpenIndex(null);
              }}
              className={`px-4 py-2 rounded-full text-xs font-sans font-semibold tracking-wider border transition-all cursor-pointer ${
                activeCategory === cat
                  ? "bg-red-vivid/10 border-red-vivid text-white shadow-[0_0_12px_rgba(232,35,42,0.15)]"
                  : "bg-black-card border-white/5 text-[#666666] hover:text-white hover:border-white/20"
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

        {/* FAQ Accordion Grid */}
        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {filteredFaqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <motion.div
                  key={faq.question}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="bg-[#0b0c10]/60 border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-colors"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full flex justify-between items-center p-6 text-left select-none cursor-pointer focus:outline-none"
                  >
                    <div className="flex items-center gap-4">
                      <HelpCircle className={`w-4 h-4 shrink-0 transition-colors ${isOpen ? 'text-red-vivid' : 'text-[#666666]'}`} />
                      <span className="font-sans font-semibold text-sm md:text-base text-white tracking-wide">
                        {faq.question}
                      </span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white shrink-0 hover:bg-white/10 transition-colors">
                      {isOpen ? (
                        <Minus className="w-3.5 h-3.5" />
                      ) : (
                        <Plus className="w-3.5 h-3.5" />
                      )}
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <div className="px-6 pb-6 pt-1 text-[#999999] font-sans font-light text-sm md:text-base leading-relaxed border-t border-white/5">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Bottom Callout */}
        <div className="mt-16 bg-[#0f0f13] border border-white/5 rounded-3xl p-8 text-center relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-red-vivid/10 rounded-full filter blur-xl pointer-events-none"></div>
          <h3 className="font-display text-2xl text-white mb-2 uppercase tracking-wider">
            Still Have Questions?
          </h3>
          <p className="text-[#666666] font-sans font-light text-xs md:text-sm max-w-md mx-auto mb-6 leading-relaxed">
            Our AI compiler and technical assistants are standing by. Click the chat bubble in the lower right to initiate a live interactive support dialogue.
          </p>
          <button
            onClick={() => {
              // Trigger global ChatWidget if present
              const chatButton = document.querySelector('[aria-label="Toggle chat widget"]') as HTMLButtonElement;
              if (chatButton) {
                chatButton.click();
              }
            }}
            className="inline-flex items-center px-6 py-2.5 bg-white text-black font-sans font-semibold text-xs rounded-full hover:bg-red-vivid hover:text-white transition-colors cursor-pointer"
          >
            Launch Assistant
          </button>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
