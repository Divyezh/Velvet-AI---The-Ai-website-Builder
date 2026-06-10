# 🔴 AI Website Builder — Dark Red Vibe Code Prompt
## Inspired by: Dark Analytics Dashboard UI (Black + Deep Red)

---

## 🎯 PROJECT VISION

Build a **premium dark-mode AI Website Builder** that feels like a powerful SaaS analytics tool. 
The aesthetic is aggressive, sleek, and data-driven — deep black backgrounds with dramatic red 
geometric light leaks, bold all-caps typography, and a real dashboard preview embedded into the 
hero section. Think: dark luxury meets performance intelligence.

---

## 🎨 COLOR SYSTEM (Exact Match to Reference UI)

```css
:root {
  /* Core Colors */
  --black-base:       #050505;   /* Pure near-black — page background */
  --black-deep:       #0a0a0a;   /* Slightly lifted black — navbar, footer */
  --black-card:       #111111;   /* Card/panel background */
  --black-surface:    #1a1a1a;   /* Elevated surfaces, sidebar */
  --black-border:     #242424;   /* Subtle borders */

  /* Red Accent System */
  --red-vivid:        #e8232a;   /* Primary CTA, key highlights */
  --red-mid:          #c41c22;   /* Hover states, active indicators */
  --red-dark:         #8b1016;   /* Deep red for glows and shadows */
  --red-glow:         rgba(232, 35, 42, 0.18);  /* Soft glow ambient */
  --red-glow-strong:  rgba(232, 35, 42, 0.35);  /* Strong glow on focus */

  /* Text */
  --text-white:       #ffffff;
  --text-primary:     #f0f0f0;
  --text-secondary:   #999999;
  --text-muted:       #555555;

  /* Positive metrics (green accent) */
  --green-stat:       #22c55e;

  /* Functional */
  --bg-primary:       #050505;
  --bg-card:          #111111;
  --border-subtle:    rgba(255,255,255,0.06);
  --border-red:       rgba(232, 35, 42, 0.3);
}
```

---

## 🖋️ TYPOGRAPHY

```css
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600&display=swap');

/* Headings: Bebas Neue — all caps, bold, impactful */
/* Body/UI:  Inter — clean, modern, legible at small sizes */

h1 { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.04em; }
body { font-family: 'Inter', sans-serif; }
```

---

## 🌋 BACKGROUND & ATMOSPHERE (Critical — must match reference)

```css
/* The signature look: pure black with angular red light leak shapes */

body {
  background: #050505;
}

/* Hero section background effect */
.hero-bg {
  position: relative;
  overflow: hidden;
  background: #050505;
}

/* Left red angular shape — like a folded red panel coming from left */
.hero-bg::before {
  content: '';
  position: absolute;
  left: -120px;
  top: -60px;
  width: 420px;
  height: 500px;
  background: linear-gradient(135deg, #c41c22 0%, #8b1016 50%, transparent 80%);
  clip-path: polygon(0 0, 70% 0, 100% 40%, 60% 100%, 0 100%);
  opacity: 0.75;
  filter: blur(1px);
}

/* Right red angular shape — mirror on right side */
.hero-bg::after {
  content: '';
  position: absolute;
  right: -120px;
  top: -60px;
  width: 420px;
  height: 500px;
  background: linear-gradient(225deg, #c41c22 0%, #8b1016 50%, transparent 80%);
  clip-path: polygon(30% 0, 100% 0, 100% 100%, 40% 100%, 0 40%);
  opacity: 0.75;
  filter: blur(1px);
}

/* Center ambient red glow (subtle) */
.hero-glow {
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translateX(-50%);
  width: 600px;
  height: 300px;
  background: radial-gradient(ellipse, rgba(232,35,42,0.08) 0%, transparent 70%);
  pointer-events: none;
}
```

---

## 🏗️ FULL PAGE LAYOUT

```
┌────────────────────────────────────────────────────────────┐
│  NAVBAR — black, transparent | links center | profile icon │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  HERO SECTION (dark bg + red angular shapes)               │
│  ┌──────────────────────────────────────────┐              │
│  │  ⬤⬤⬤ "40+ Positive Reviews" badge pill  │              │
│  │                                          │              │
│  │  STAY IN CONTROL           ← gray thin   │              │
│  │  YOUR WEBSITE AT A GLANCE  ← white bold  │              │
│  │                                          │              │
│  │  Subtitle text (2 lines, muted)          │              │
│  │                                          │              │
│  │  [ Book a Free Demo  → ]  ← outlined btn │              │
│  └──────────────────────────────────────────┘              │
│                                                            │
│  DASHBOARD PREVIEW CARD (floating, dark card)             │
│  ┌────────────────────────────────────────┐               │
│  │  🏠 Welcome back, [Name]   [search][🔔]│               │
│  │  ── Statistics overview ──             │               │
│  │  [This week ▾]              Last upd.. │               │
│  │  ┌──────────┐ ┌──────────┐ ┌────────┐ │               │
│  │  │New subs  │ │Total view│ │Engage  │ │               │
│  │  │ 1,324 ↑  │ │12.1M ↑  │ │56% ↑  │ │               │
│  │  └──────────┘ └──────────┘ └────────┘ │               │
│  │  Daily Visitors chart    │ Integrations│               │
│  └────────────────────────────────────────┘               │
│                                                            │
├────────────────────────────────────────────────────────────┤
│  HOW IT WORKS — 3 Steps                                    │
├────────────────────────────────────────────────────────────┤
│  FEATURES — bento grid 2×3                                 │
├────────────────────────────────────────────────────────────┤
│  AI BUILDER DEMO — split panel                             │
├────────────────────────────────────────────────────────────┤
│  REVIEWS — horizontal scroll cards                         │
├────────────────────────────────────────────────────────────┤
│  PRICING — 3 tiers                                         │
├────────────────────────────────────────────────────────────┤
│  FOOTER                                                    │
└────────────────────────────────────────────────────────────┘
```

---

## ✨ COMPONENT SPECIFICATIONS

### 1. NAVBAR
```
- Background: rgba(5, 5, 5, 0.92), backdrop-filter: blur(16px)
- Sticky, border-bottom: 1px solid rgba(255,255,255,0.05)
- Logo: top-left, white geometric mountain/triangle icon + wordmark
- Nav links center: "PRICING | FAQ | TERMS | PRIVACY"
  font: Inter 500, 13px, color #999, hover → #fff, letter-spacing 0.08em
- Right: user avatar circle icon, border 1px solid #333
- NO colored background — pure dark glass
```

### 2. HERO SECTION
```
- Full viewport height minimum
- Background: #050505 + red angular panels left & right (CSS clip-path shapes)
- Content centered, max-width 720px

BADGE (top):
  ⬤⬤⬤ icon cluster + "40+ Positive Reviews"
  style: border 1px solid #333, bg rgba(255,255,255,0.04), 
         border-radius 999px, padding 6px 16px, font 13px #aaa

H1 LINE 1: "STAY IN CONTROL"
  font: Bebas Neue, 52px, color #666666, letter-spacing 0.06em

H1 LINE 2: "YOUR WEBSITE AT A GLANCE"  ← (adapt to your product)
  font: Bebas Neue, 72px desktop / 42px mobile, color #ffffff

SUBTITLE:
  "Unlock next-level performance with AI-powered website creation.
   Build every page, customize every section, and launch with 
   real-time intelligence that turns your vision into reality."
  font: Inter 300, 16px, color #888, max-width 560px, line-height 1.7

CTA BUTTON:
  text: "Book a Free Demo →"  (or "Start Building Free →")
  style: 
    border: 1.5px solid rgba(255,255,255,0.6)
    background: transparent
    color: #fff
    border-radius: 999px
    padding: 14px 32px
    font: Inter 500, 15px
    hover: bg #e8232a, border-color #e8232a, shadow: 0 0 24px rgba(232,35,42,0.4)
    transition: all 300ms ease
```

### 3. DASHBOARD PREVIEW CARD (Hero Bottom — Key Visual)
```
This floating dashboard card is THE hero visual. It must look like a real product.

Container:
  background: #111111
  border: 1px solid rgba(255,255,255,0.07)
  border-radius: 16px
  box-shadow: 0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(232,35,42,0.05)
  overflow: hidden
  margin-top: 48px

Left Sidebar (narrow, ~56px):
  background: #0d0d0d
  border-right: 1px solid #1f1f1f
  icons: home, chart, users, settings, gear, info — color #555, active → #fff

Main Content:
  Header bar:
    "Welcome back, [Name]" — Inter 600 18px #fff
    "Statistics overview" — Inter 400 13px #666
    Right: search bar (dark input), bell icon, mail icon, avatar

  Filter row:
    "This week ▾" pill button — dark bg, white text, small
    Right: "Last updated at 10:23 AM" — muted 12px

  Stats Row (3 cards side by side):
    Card 1: "New subscribers" | "+10% ↑" green | "1,324" big white | "People"
    Card 2: "Total views"     | "+5% ↑"  green | "12.1M" big white | "Views"
    Card 3: "Engagement rate" | "+12% ↑" green | "56%"   big white | "percent"
    Card style: bg #161616, border 1px solid #222, border-radius 12px, padding 16px

  Bottom Row (2 columns):
    Left — "Daily visitors" bar chart:
      Dark bars with one highlighted red bar
      X-axis dates, y-axis hidden
      Chart bg: transparent
      
    Right — "Integrations" list:
      Unsplash   [Connected — green badge]
      Facebook   [Connected — green badge]
      Instagram  [Connected — green badge]
      Behance    [Connect — outline button]
      Each row: logo circle + name + @handle + badge
      bg: #0f0f0f, border-left: none

Percentage badges on stat cards:
  "+10%" style: color #22c55e, bg rgba(34,197,94,0.1), border-radius 4px, font 12px
```

### 4. HOW IT WORKS (3 Steps)
```
- Section bg: #050505
- Large section number "01 / 02 / 03" in very large muted text (#1a1a1a) behind card
- Cards: bg #0f0f0f, border 1px solid #1e1e1e, border-radius 16px
- Step icon: red circle with white icon inside
- Connector: dashed red line between cards
- Step 1: "Describe Your Website" 
- Step 2: "AI Builds It Instantly"
- Step 3: "Publish & Go Live"
- Hover: border-color → #e8232a, faint red glow
```

### 5. FEATURES BENTO GRID
```
2 columns, 3 rows — varying sizes:
  [   AI Prompt Builder — FULL WIDTH   ]
  [ Dark/Light Themes ] [ Mobile Ready ]
  [ One-Click Deploy  ] [ Analytics    ]
  [   Custom Domain — FULL WIDTH       ]

Card style:
  bg: #0d0d0d
  border: 1px solid #1c1c1c
  border-radius: 16px
  hover: border-color #e8232a, translateY(-3px), red glow shadow
  
Each card has:
  - Icon in red (#e8232a) 
  - Bold white title
  - Muted gray description
```

### 6. PRICING (3 Tiers)
```
- Bg: #050505
- 3 cards: Starter | Pro | Business
- Middle (Pro): 
    border: 1px solid #e8232a
    top badge: "Most Popular" — bg #e8232a, white text, pill
    box-shadow: 0 0 40px rgba(232,35,42,0.15)
- CTA per card:
    Starter: outline white button
    Pro: solid red button (#e8232a bg)
    Business: outline white button
- Feature list: checkmarks in #e8232a
- Annual/Monthly toggle pill at top — active side: red bg
```

### 7. REVIEWS
```
- Horizontal scroll, scroll-snap
- Card: bg #0f0f0f, border #1e1e1e, border-radius 16px
- Stars: #e8232a (red stars — matches theme)
- Avatar: dark circle with initials or placeholder
- Name: white, Role: #666
- Quote: #aaa, italic
```

### 8. FOOTER
```
- bg: #080808, border-top: 1px solid #1a1a1a
- Logo + tagline left
- 4 column links: Product | Resources | Company | Legal
- Link color: #666, hover #fff
- Bottom: copyright center, muted
- Social icons: #555, hover #e8232a
```

---

## 🎞️ ANIMATIONS

```css
/* Page load stagger */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Dashboard card entrance — slides up from below */
@keyframes dashboardReveal {
  from { opacity: 0; transform: translateY(48px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

/* Stat counter — count up animation on scroll into view */
/* Use IntersectionObserver + JS counter for 1,324 / 12.1M / 56% */

/* Red glow pulse on CTA hover */
@keyframes redGlowPulse {
  0%, 100% { box-shadow: 0 0 16px rgba(232,35,42,0.3); }
  50%       { box-shadow: 0 0 40px rgba(232,35,42,0.6); }
}

/* Angular bg shapes: slow scale breathe */
@keyframes shapeBreath {
  0%, 100% { transform: scale(1) rotate(0deg); }
  50%       { transform: scale(1.03) rotate(0.5deg); }
}
```

---

## 📋 FULL COPY-PASTE PROMPT (for v0.dev / Bolt / Lovable / Cursor)

> Paste this entire block into your AI builder:

---

```
Build a dark-mode AI Website Builder landing page. Exact design spec:

COLORS:
  Background: #050505 (near black)
  Cards/panels: #111111
  Surfaces: #1a1a1a
  Borders: rgba(255,255,255,0.06)
  Primary accent: #e8232a (vivid red)
  Text: #ffffff primary, #999999 secondary, #555555 muted
  Green stats: #22c55e

FONTS:
  Headings: Bebas Neue (all-caps, letter-spacing 0.05em)
  Body/UI: Inter (300/400/500/600)

HERO SECTION:
  Full viewport. Background #050505. 
  Left side: large angular red geometric shape (CSS clip-path polygon) — deep red 
  #c41c22 to transparent gradient, positioned top-left corner overlapping edge.
  Right side: mirrored angular red shape, top-right corner.
  These shapes look like folded metallic red panels coming from both sides — 
  sharp edges, no blur, dramatic. Add subtle red ambient glow in center behind content.
  
  Center content (max-width 700px, centered):
    - Badge pill: "⬤⬤⬤ 40+ Positive Reviews" — dark bg, white text, rounded pill
    - H1 line 1: "STAY IN CONTROL" — Bebas Neue 52px, color #666666
    - H1 line 2: "YOUR WEBSITE AT A GLANCE" — Bebas Neue 72px, color #ffffff
    - Subtitle: Inter 300 16px #888, 2 lines about AI-powered website creation
    - CTA button: "Book a Free Demo →" — transparent bg, white rounded border, 
      hover: bg #e8232a, red glow shadow

DASHBOARD PREVIEW CARD (hero visual, below CTA):
  Large card — bg #111, border 1px solid rgba(255,255,255,0.07), border-radius 16px.
  Show a real-looking analytics dashboard inside it:
  
  Left sidebar: narrow icon sidebar (home, chart, users, settings icons in #555)
  Main area:
    - Header: "Welcome back, [Name]" + "Statistics overview" + search + bell + avatar
    - Filter bar: "This week ▾" pill + "Last updated at 10:23 AM" right
    - Stats row (3 cards):
        "New subscribers | +10% ↑ green | 1,324 | People"
        "Total views | +5% ↑ green | 12.1M | Views"  
        "Engagement rate | +12% ↑ green | 56% | percent"
        Card style: bg #161616, border #222, rounded-xl
    - Bottom row 2 cols:
        Left: "Daily visitors" bar chart — dark bars, one red highlighted bar, x-axis dates
        Right: "Integrations" list — Unsplash/Facebook/Instagram/Behance each with 
               logo + name + [Connected green badge] or [Connect outline button]

HOW IT WORKS: 3 horizontal cards on dark bg.
  Large ghost numbers 01/02/03 behind cards.
  Red connector line between cards. Cards: dark, border hover → red.
  Steps: "Describe" → "AI Builds" → "Publish"

FEATURES BENTO GRID: 2-col bento layout, 6 cards varying sizes.
  First + last: full width. Middle 4: 2-per-row.
  Icons in #e8232a. Hover: red border + red glow.

PRICING: 3 cards. Middle highlighted with red border + glow.
  "Most Popular" badge on Pro. Red CTA button on Pro. Annual/Monthly toggle.

REVIEWS: Horizontal scroll, dark cards, red stars.

FOOTER: Near-black bg, 4-col links, red hover on social icons.

ANIMATIONS:
  - Staggered fade-up on scroll (IntersectionObserver)
  - Dashboard card slides up with slight scale on page load (delay 400ms)
  - Stat numbers count up on entering viewport
  - Red angular bg shapes: slow breathing scale animation (8s loop)
  - CTA hover: red glow pulse
  - All transitions: 250ms cubic-bezier(0.4,0,0.2,1)

IMPORTANT RULES:
  ✗ No white or light backgrounds anywhere
  ✗ No purple, blue, or any off-palette colors  
  ✗ No rounded soft aesthetics — this is sharp, dark, aggressive SaaS
  ✓ Everything must feel like a real high-end analytics product
  ✓ The dashboard preview card must look authentic and data-rich
  ✓ Mobile responsive with all sections adapting cleanly
  ✓ Use semantic HTML5 + smooth-scroll behavior
```

---

## 🎁 TAILWIND THEME CONFIG

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'black-base':    '#050505',
        'black-card':    '#111111',
        'black-surface': '#1a1a1a',
        'red-vivid':     '#e8232a',
        'red-mid':       '#c41c22',
        'red-dark':      '#8b1016',
        'green-stat':    '#22c55e',
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        sans:    ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        'red-glow': '0 0 32px rgba(232, 35, 42, 0.35)',
        'red-glow-sm': '0 0 16px rgba(232, 35, 42, 0.2)',
        'card-dark': '0 32px 80px rgba(0,0,0,0.8)',
      }
    }
  }
}
```

---

*AI Website Builder — Dark Red Analytics Vibe | Inspired by reference UI*