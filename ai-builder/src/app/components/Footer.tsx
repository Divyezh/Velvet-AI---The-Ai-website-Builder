"use client";

import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer
      style={{
        background: '#030202',
        borderTop: '1px solid rgba(201,74,10,0.08)',
        padding: '60px 48px 32px'
      }}
      className="max-md:px-5"
    >
      <div className="flex flex-col md:flex-row justify-between max-w-[1200px] mx-auto gap-12">
        <div>
          <div className="flex items-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
              <path d="M12 4L20 20H4L12 4Z" fill="#f07030" />
            </svg>
            <Link href="/" className="flex items-center" style={{ textDecoration: 'none' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '20px', color: '#f5e8d8' }}>VELVET</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: '20px', color: '#f07030' }}>.AI</span>
            </Link>
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: '14px', color: '#5a3820', marginTop: '8px' }}>
            Building the future of web creation.
          </p>
        </div>

        <div className="flex flex-wrap gap-16">
          <div className="flex flex-col gap-4">
            <h4 style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '12px', color: '#a08060', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Product</h4>
            {['Builder', 'Pricing', 'Showcase', 'Changelog'].map(link => (
              <Link key={link} href="#" style={{ fontFamily: 'var(--font-body)', fontWeight: 400, fontSize: '14px', color: '#5a3820', textDecoration: 'none', transition: 'color 200ms' }} onMouseEnter={(e) => e.currentTarget.style.color = '#a08060'} onMouseLeave={(e) => e.currentTarget.style.color = '#5a3820'}>{link}</Link>
            ))}
          </div>
          <div className="flex flex-col gap-4">
            <h4 style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '12px', color: '#a08060', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Company</h4>
            {['About', 'Blog', 'Careers', 'Contact'].map(link => (
              <Link key={link} href="#" style={{ fontFamily: 'var(--font-body)', fontWeight: 400, fontSize: '14px', color: '#5a3820', textDecoration: 'none', transition: 'color 200ms' }} onMouseEnter={(e) => e.currentTarget.style.color = '#a08060'} onMouseLeave={(e) => e.currentTarget.style.color = '#5a3820'}>{link}</Link>
            ))}
          </div>
          <div className="flex flex-col gap-4">
            <h4 style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '12px', color: '#a08060', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Legal</h4>
            {['Terms', 'Privacy', 'Security', 'Cookie Policy'].map(link => (
              <Link key={link} href="#" style={{ fontFamily: 'var(--font-body)', fontWeight: 400, fontSize: '14px', color: '#5a3820', textDecoration: 'none', transition: 'color 200ms' }} onMouseEnter={(e) => e.currentTarget.style.color = '#a08060'} onMouseLeave={(e) => e.currentTarget.style.color = '#5a3820'}>{link}</Link>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '48px', borderTop: '1px solid rgba(201,74,10,0.06)', paddingTop: '24px' }} className="max-w-[1200px] mx-auto flex justify-between items-center">
        <p style={{ fontFamily: 'var(--font-body)', fontWeight: 400, fontSize: '13px', color: '#3d2010' }}>
          © 2025 VELVET.AI. All rights reserved.
        </p>
        <div className="flex gap-4">
          {[
            { name: 'Twitter', path: "M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" },
            { name: 'GitHub', path: "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" },
            { name: 'LinkedIn', path: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z M4 2a2 2 0 1 1-2 2 2 2 0 0 1 2-2z" }
          ].map(social => (
            <Link key={social.name} href="#" aria-label={social.name}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5a3820" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
                style={{ transition: 'stroke 200ms' }}
                onMouseEnter={(e) => e.currentTarget.style.stroke = '#f07030'}
                onMouseLeave={(e) => e.currentTarget.style.stroke = '#5a3820'}
              >
                <path d={social.path} />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
