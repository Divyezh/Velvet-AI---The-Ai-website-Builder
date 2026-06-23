"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <main className="mars-texture" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#060404' }}>
      <Navbar />
      
      <div style={{ flex: 1, padding: '120px 24px 100px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          style={{
            display: 'inline-block',
            background: 'rgba(201,74,10,0.12)',
            border: '1px solid rgba(201,74,10,0.3)',
            borderRadius: '999px',
            padding: '6px 18px',
            fontFamily: 'var(--font-body)',
            fontWeight: 500,
            fontSize: '12px',
            color: '#f07030',
            letterSpacing: '0.1em',
            marginBottom: '16px'
          }}
        >
          PRICING
        </motion.div>
        
        <motion.h1
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 'clamp(40px,6vw,80px)',
            color: '#f5e8d8',
            marginBottom: '16px',
            textAlign: 'center'
          }}
        >
          SIMPLE PRICING
        </motion.h1>

        <motion.p
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 300,
            fontSize: '16px',
            color: '#a08060',
            textAlign: 'center'
          }}
        >
          Start free. Scale as you grow.
        </motion.p>

        {/* Toggle */}
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          style={{
            marginTop: '32px',
            display: 'flex',
            alignItems: 'center',
            background: '#120b08',
            border: '1px solid rgba(201,74,10,0.2)',
            borderRadius: '999px',
            padding: '4px'
          }}
        >
          <button
            onClick={() => setIsAnnual(false)}
            style={{
              background: !isAnnual ? 'linear-gradient(135deg, #c94a0a, #e85d0a)' : 'transparent',
              color: !isAnnual ? '#fff' : '#a08060',
              borderRadius: '999px',
              padding: '8px 24px',
              fontFamily: 'var(--font-body)',
              fontWeight: 600,
              fontSize: '13px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 200ms'
            }}
          >
            Monthly
          </button>
          <button
            onClick={() => setIsAnnual(true)}
            style={{
              background: isAnnual ? 'linear-gradient(135deg, #c94a0a, #e85d0a)' : 'transparent',
              color: isAnnual ? '#fff' : '#a08060',
              borderRadius: '999px',
              padding: '8px 24px',
              fontFamily: 'var(--font-body)',
              fontWeight: 600,
              fontSize: '13px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 200ms'
            }}
          >
            Annual
            <span style={{ background: '#22c55e', color: '#060404', padding: '2px 6px', borderRadius: '4px', fontSize: '10px' }}>Save 20%</span>
          </button>
        </motion.div>

        {/* Cards */}
        <div style={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
          maxWidth: '1000px',
          margin: '60px auto 0',
          width: '100%'
        }} className="max-md:flex-wrap">
          
          {/* Card 1 - Light */}
          <motion.div
            initial={{ x: -40, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0 }}
            style={{
              width: '300px',
              flexShrink: 0,
              background: '#120b08',
              border: '1px solid rgba(201,74,10,0.12)',
              borderRadius: '20px',
              padding: '32px 28px',
              display: 'flex',
              flexDirection: 'column'
            }}
            className="max-md:w-full"
          >
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '24px', color: '#f5e8d8' }}>Light</h3>
            <p style={{ fontFamily: 'var(--font-body)', fontWeight: 400, fontSize: '13px', color: '#a08060', marginTop: '6px' }}>
              Quick solution for simple tasks
            </p>
            <div style={{ marginTop: '24px' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '42px', color: '#f5e8d8' }}>
                from 20$
              </span>
              <span style={{ fontFamily: 'var(--font-body)', fontWeight: 400, fontSize: '14px', color: '#a08060', marginLeft: '4px' }}>
                / from 2 days
              </span>
            </div>
            
            <div style={{ height: '1px', background: 'rgba(201,74,10,0.1)', margin: '24px 0' }} />
            
            <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '12px', color: '#a08060', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Suitable for:
            </div>
            
            <ul style={{ listStyle: 'none', padding: 0, margin: '16px 0 0', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
              {["Simple skin, addon, 3D model", "Editing existing features", "Quick refinement", "Custom particles and effects"].map((feature, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontFamily: 'var(--font-body)', fontWeight: 400, fontSize: '14px', color: '#f5e8d8' }}>
                  <span style={{ color: '#f07030' }}>✓</span> {feature}
                </li>
              ))}
            </ul>

            <button style={{
              background: 'transparent',
              border: '1px solid rgba(201,74,10,0.35)',
              color: '#f07030',
              borderRadius: '12px',
              padding: '14px 24px',
              fontFamily: 'var(--font-body)',
              fontWeight: 600,
              fontSize: '14px',
              marginTop: '28px',
              width: '100%',
              cursor: 'pointer',
              transition: 'all 200ms'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(201,74,10,0.12)'; e.currentTarget.style.borderColor = 'rgba(201,74,10,0.6)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(201,74,10,0.35)'; }}
            >
              Get Started ↗
            </button>
          </motion.div>

          {/* Card 2 - Middle (HIGHLIGHTED) */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: -8, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            style={{
              width: '320px',
              background: 'linear-gradient(160deg, #8b3008 0%, #c94a0a 35%, #e85d0a 65%, #f07030 100%)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '20px',
              padding: '32px 28px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 0 60px rgba(201,74,10,0.4), 0 24px 60px rgba(0,0,0,0.5)',
              position: 'relative',
              zIndex: 10
            }}
            className="max-md:w-full max-md:transform-none!"
          >
            <div style={{
              display: 'inline-block',
              background: 'rgba(0,0,0,0.25)',
              borderRadius: '999px',
              padding: '4px 12px',
              fontFamily: 'var(--font-body)',
              fontWeight: 500,
              fontSize: '11px',
              color: '#ffffff',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              alignSelf: 'flex-start',
              marginBottom: '16px'
            }}>
              Золотая середина
            </div>
            
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '24px', color: '#ffffff' }}>Middle</h3>
            <div style={{ marginTop: '8px' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '42px', color: '#ffffff' }}>
                from 50$
              </span>
              <span style={{ fontFamily: 'var(--font-body)', fontWeight: 400, fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginLeft: '4px' }}>
                / from 7 days
              </span>
            </div>
            
            <div style={{ height: '1px', background: 'rgba(255,255,255,0.15)', margin: '24px 0' }} />
            
            <ul style={{ listStyle: 'none', padding: 0, margin: '0', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
              {["Custom skin with details", "Mid-level system or mechanics", "Map or location", "Custom script writing", "Model rigging"].map((feature, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontFamily: 'var(--font-body)', fontWeight: 400, fontSize: '14px', color: '#ffffff' }}>
                  <span style={{ color: '#ffffff' }}>✓</span> {feature}
                </li>
              ))}
            </ul>

            <button style={{
              background: 'rgba(0,0,0,0.35)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#ffffff',
              borderRadius: '12px',
              padding: '14px 24px',
              fontFamily: 'var(--font-body)',
              fontWeight: 600,
              fontSize: '14px',
              marginTop: '28px',
              width: '100%',
              cursor: 'pointer',
              transition: 'all 200ms'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.5)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.35)'; }}
            >
              Оставить заявку ↗
            </button>
          </motion.div>

          {/* Card 3 - Pro */}
          <motion.div
            initial={{ x: 40, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            style={{
              width: '300px',
              flexShrink: 0,
              background: '#120b08',
              border: '1px solid rgba(201,74,10,0.12)',
              borderRadius: '20px',
              padding: '32px 28px',
              display: 'flex',
              flexDirection: 'column'
            }}
            className="max-md:w-full"
          >
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '24px', color: '#f5e8d8' }}>Pro</h3>
            <p style={{ fontFamily: 'var(--font-body)', fontWeight: 400, fontSize: '13px', color: '#a08060', marginTop: '6px' }}>
              Full-scale complex projects
            </p>
            <div style={{ marginTop: '24px' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '42px', color: '#f5e8d8' }}>
                from 200$
              </span>
              <span style={{ fontFamily: 'var(--font-body)', fontWeight: 400, fontSize: '14px', color: '#a08060', marginLeft: '4px' }}>
                / from 14 days
              </span>
            </div>
            
            <div style={{ height: '1px', background: 'rgba(201,74,10,0.1)', margin: '24px 0' }} />
            
            <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '12px', color: '#a08060', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Suitable for:
            </div>
            
            <ul style={{ listStyle: 'none', padding: 0, margin: '16px 0 0', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
              {["Full development of a complex project", "High detailing and geometry elaboration", "Optimization, testing, and support"].map((feature, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontFamily: 'var(--font-body)', fontWeight: 400, fontSize: '14px', color: '#f5e8d8' }}>
                  <span style={{ color: '#f07030' }}>✓</span> {feature}
                </li>
              ))}
            </ul>

            <button style={{
              background: 'transparent',
              border: '1px solid rgba(201,74,10,0.35)',
              color: '#f07030',
              borderRadius: '12px',
              padding: '14px 24px',
              fontFamily: 'var(--font-body)',
              fontWeight: 600,
              fontSize: '14px',
              marginTop: '28px',
              width: '100%',
              cursor: 'pointer',
              transition: 'all 200ms'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(201,74,10,0.12)'; e.currentTarget.style.borderColor = 'rgba(201,74,10,0.6)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(201,74,10,0.35)'; }}
            >
              Get Started ↗
            </button>
          </motion.div>

        </div>
      </div>

      <Footer />
    </main>
  );
}
