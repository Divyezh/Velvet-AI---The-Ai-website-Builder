"use client";

import React from "react";
import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components";

export default function DocumentationPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      <Navbar />
      <section className="relative pt-40 pb-20 px-6 z-10 flex flex-col items-center text-center min-h-[70vh]">
        <h1 className="text-5xl md:text-7xl font-semibold text-white tracking-tight mb-6">
          Documentation
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mb-12">
          Comprehensive guides and API references for Velvet.
        </p>
      </section>
      <Footer />
    </main>
  );
}
