import React from "react";
import Link from "next/link";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 border-b border-white/5 bg-[#0A0A0A]/80 backdrop-blur-md z-50 flex items-center justify-between px-6">
      <Link href="/" className="flex items-center gap-2 text-white font-semibold tracking-tight">
        <div className="w-6 h-6 rounded bg-white text-black flex items-center justify-center font-bold text-xs">V</div>
        Velvet
      </Link>
      <div className="flex items-center gap-6 text-sm font-medium text-slate-300">
        <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
        <Link href="/docs" className="hover:text-white transition-colors">Docs</Link>
        <Link href="/login" className="hover:text-white transition-colors">Log in</Link>
        <Link href="/signup" className="bg-white text-black px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors">
          Sign Up
        </Link>
      </div>
    </nav>
  );
}
