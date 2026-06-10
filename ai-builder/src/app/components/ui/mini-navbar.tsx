"use client";

import React, { useState, useEffect, useRef } from "react";

const AnimatedNavLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <a
    href={href}
    className="group relative inline-flex items-center overflow-hidden h-5 text-sm"
  >
    <div className="flex flex-col transition-transform duration-300 ease-out group-hover:-translate-y-1/2">
      <span className="text-gray-300">{children}</span>
      <span className="text-white">{children}</span>
    </div>
  </a>
);

export function MiniNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [shapeClass, setShapeClass] = useState("rounded-full");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (isOpen) {
      setShapeClass("rounded-xl");
    } else {
      timerRef.current = setTimeout(() => setShapeClass("rounded-full"), 300);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isOpen]);

  const navLinks = [
    { label: "Builder", href: "#builder" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "/faq" },
  ];

  const loginBtn = (
    <button className="px-4 py-2 text-xs border border-[#333] bg-[rgba(31,31,31,0.62)] text-gray-300 rounded-full hover:border-white/50 hover:text-white transition-colors duration-200 w-full sm:w-auto">
      Log In
    </button>
  );

  const signupBtn = (
    <div className="relative group w-full sm:w-auto">
      <div className="absolute inset-0 -m-2 rounded-full hidden sm:block bg-gray-100 opacity-30 blur-lg pointer-events-none transition-all duration-300 group-hover:opacity-50 group-hover:blur-xl" />
      <button className="relative z-10 px-4 py-2 text-xs font-semibold text-black bg-linear-to-br from-gray-100 to-gray-300 rounded-full hover:from-gray-200 hover:to-gray-400 transition-all duration-200 w-full sm:w-auto">
        Get Started
      </button>
    </div>
  );

  return (
    <header
      className={`fixed top-6 left-1/2 z-20 flex flex-col items-center -translate-x-1/2
        pl-6 pr-6 py-3 backdrop-blur-sm ${shapeClass}
        border border-[#333] bg-[#1f1f1f57]
        w-[calc(100%-2rem)] sm:w-auto
        transition-[border-radius] duration-0`}
    >
      <div className="flex items-center justify-between w-full gap-x-6 sm:gap-x-8">
        {/* Logo */}
        <span className="font-display text-white text-base tracking-wider select-none">
          velvet<span className="text-red-vivid">.ai</span>
        </span>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center space-x-6 text-sm">
          {navLinks.map((l) => (
            <AnimatedNavLink key={l.href} href={l.href}>
              {l.label}
            </AnimatedNavLink>
          ))}
        </nav>

        <div className="hidden sm:flex items-center gap-3">
          {loginBtn}
          {signupBtn}
        </div>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden flex items-center justify-center w-8 h-8 text-gray-300 focus:outline-none"
          onClick={() => setIsOpen((o) => !o)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`sm:hidden flex flex-col items-center w-full transition-all duration-300 overflow-hidden ${isOpen ? "max-h-[500px] opacity-100 pt-4" : "max-h-0 opacity-0 pt-0 pointer-events-none"
          }`}
      >
        <nav className="flex flex-col items-center space-y-4 text-base w-full">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="text-gray-300 hover:text-white transition-colors w-full text-center">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex flex-col items-center space-y-4 mt-4 w-full">
          {loginBtn}
          {signupBtn}
        </div>
      </div>
    </header>
  );
}
