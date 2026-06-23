"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ backgroundColor: 'rgba(6,4,4,0)', borderBottomColor: 'rgba(201,74,10,0)', backdropFilter: 'blur(0px)' }}
      animate={{
        backgroundColor: scrolled ? 'rgba(6,4,4,0.88)' : 'rgba(6,4,4,0)',
        borderBottomColor: scrolled ? 'rgba(201,74,10,0.15)' : 'rgba(201,74,10,0)',
        backdropFilter: scrolled ? 'blur(20px)' : 'blur(0px)'
      }}
      transition={{ duration: 0.4 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '64px',
        zIndex: 100,
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 48px'
      }}
      className="max-md:px-5"
    >
      <div className="flex items-center">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
          <path d="M12 4L20 20H4L12 4Z" fill="#f07030" />
        </svg>
        <Link href="/" className="flex items-center" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '20px', color: '#f5e8d8' }}>VELVET</span>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: '20px', color: '#f07030' }}>.AI</span>
        </Link>
      </div>

      <div className="hidden md:flex items-center" style={{ gap: '36px' }}>
        {['BUILDER', 'PRICING', 'FAQ', 'TERMS', 'PRIVACY'].map((item) => (
          <Link
            key={item}
            href={item === 'BUILDER' ? '/' : item === 'PRICING' ? '/pricing' : `/${item.toLowerCase()}`}
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 500,
              fontSize: '14px',
              color: item === 'BUILDER' ? '#f07030' : '#a08060',
              letterSpacing: '0.06em',
              textDecoration: 'none',
              transition: 'color 200ms'
            }}
            onMouseEnter={(e) => { if(item !== 'BUILDER') e.currentTarget.style.color = '#f5e8d8' }}
            onMouseLeave={(e) => { if(item !== 'BUILDER') e.currentTarget.style.color = '#a08060' }}
          >
            {item}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button
          style={{
            background: 'linear-gradient(135deg, #c94a0a, #e85d0a)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '999px',
            padding: '10px 24px',
            fontFamily: 'var(--font-body)',
            fontWeight: 600,
            fontSize: '14px',
            boxShadow: '0 4px 20px rgba(201,74,10,0.4)',
            transition: 'all 200ms ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.filter = 'brightness(1.1)';
            e.currentTarget.style.transform = 'scale(1.02)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = 'brightness(1)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          Get Started
        </button>

        <div
          style={{
            width: '32px',
            height: '32px',
            background: 'var(--mars-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-body)',
            fontWeight: 600,
            fontSize: '13px',
            color: '#f07030'
          }}
        >
          D
        </div>
      </div>
    </motion.nav>
  );
}
