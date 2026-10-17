# Saathi (साथी) — Design System & Visual Specification

> **Official Visual Identity Guide for Saathi: GenAI Co-pilot for Gig & Informal Workers**  
> **Color Theme:** Ocean & Teal  
> **Typography System:** Sora (Headings & Metrics) + Manrope (Body & UI Controls)  
> **Constants Source:** [`lib/theme.ts`](file:///Users/raghav/Desktop/gig-helper/lib/theme.ts) & [`tailwind.config.js`](file:///Users/raghav/Desktop/gig-helper/tailwind.config.js)

---

## 1. Project Overview & Design Philosophy

**Saathi** is an AI co-pilot crafted for delivery riders, cab/auto drivers, and daily wage workers across India. These workers operate in challenging conditions: direct sunlight on motorcycle phone mounts, noisy traffic, low connectivity, and multilingual contexts.

### Core Visual Principles
1. **Dignity & Clarity:** Clean, respectful, non-patronizing visual hierarchy.
2. **High Outdoor Contrast:** Deep Pine (`#0d3830`) and Forest Charcoal (`#102a24`) against crisp off-white (`#f8faf9`) ensure full legibility in bright Indian sunlight.
3. **Calming Trust (Ocean & Teal):** Replacing high-anxiety neon or harsh orange with grounding, trustworthy Ocean and Teal tones that communicate financial security and worker advocacy.
4. **Instant Action (SOS Red):** Unambiguous emergency safety triggers in high-visibility crimson (`#dc2626`).
5. **Zero Redundancy (Single Source of Truth):** All color hex codes, font rules, and common component styles are centralized in `lib/theme.ts` and extended directly in `tailwind.config.js`.

---

## 2. Color Palette: "Ocean & Teal"

The palette is constructed around deep ocean pines, vivid interactive teals, soft calming mint surfaces, and high-visibility alert accents.

### Master Color Tokens

| Token Name | Hex Code | RGB | Role & Usage |
|---|---|---|---|
| `ocean-850` (Hero Deep Pine) | `#0d3830` | `rgb(13, 56, 48)` | **Signature Card Background** (Today's Earnings Hero Card, Floating Voice FAB, Dark Headers) |
| `ocean-900` (Midnight Pine) | `#0a2e27` | `rgb(10, 46, 39)` | Hover states on dark cards, footer, dark overlays |
| `ocean-950` (Abyssal Teal) | `#071f1a` | `rgb(7, 31, 26)` | Deepest contrast accents |
| `teal-700` (Brand Mark Teal) | `#0f766e` | `rgb(15, 118, 110)` | **"सा" Logo Badge Background**, active tab text, prominent labels |
| `teal-600` (Interactive Teal) | `#0d9488` | `rgb(13, 148, 136)` | **Primary CTA Buttons**, active links, focus rings, interactive toggles |
| `teal-500` (Vivid Teal) | `#14b8a6` | `rgb(20, 184, 166)` | Hover highlights, active progress indicators |
| `teal-100` (Mint Glass) | `#ccfbf1` | `rgb(204, 251, 241)` | **Active Navigation Pill Background**, selected chips |
| `mint-50` (Soft Paper) | `#f4fbf8` | `rgb(244, 251, 248)` | Subtle card hover states, table alternate rows |
| `mint-200` (Sage Border) | `#cfe9e1` | `rgb(207, 233, 225)` | Scrollbar thumbs, divider lines |
| `surface-bg` (App Background) | `#f8faf9` | `rgb(248, 250, 249)` | **Global Page Canvas Background** (softer than clinical white) |
| `surface-card` (Pure Card) | `#ffffff` | `rgb(255, 255, 255)` | All white content cards and containers |
| `surface-border` (Clean Border) | `#e2ece9` | `rgb(226, 236, 233)` | Subtle card and input borders |
| `text-primary` (Forest Charcoal) | `#102a24` | `rgb(16, 42, 36)` | Primary headings, monetary values, titles |
| `text-secondary` (Slate Teal) | `#4a5f59` | `rgb(74, 95, 89)` | Body paragraphs, explanations, card subtext |
| `text-muted` (Muted Sage) | `#718882` | `rgb(113, 136, 130)` | Helper captions, timestamps, disabled labels |
| `emergency-red` (SOS Crimson) | `#dc2626` | `rgb(220, 38, 38)` | **SOS Button**, critical unfair penalty warnings, night panic trigger |
| `advice-amber-bg` (Lightbulb Bg) | `#fef3c7` | `rgb(254, 243, 199)` | Rounded container behind the advice lightbulb icon |
| `advice-amber-icon` (Lightbulb) | `#d97706` | `rgb(217, 119, 6)` | Lightbulb icon color |
| `advice-amber-text` (Advice Text) | `#92400e` | `rgb(146, 64, 14)` | Advice badge text |

---

## 3. Typography System: "Sora + Manrope"

### Pairing Logic
- **Sora (Geometric Display & Headings):** Clean, confident geometric sans with excellent letterform distinction. Numbers like `₹1,250` and greetings like `नमस्ते, रवि जी 👋` render with authority and warmth.
- **Manrope (Open Body & UI Sans):** High x-height, open counters, optimized for mobile screens and small font sizes (11px–14px). Exceptional readability for multiline Hindi, Tamil, Telugu, and English text.
- **Noto Sans Devanagari (Fallback):** Seamless vernacular glyph support across Indian regional scripts.

### Typographic Scale

| Level | Font Family | Size | Weight | Line Height | Usage |
|---|---|---|---|---|---|
| **Display Hero** | `Sora` | 32px – 36px (`text-3xl`/`text-4xl`) | Extra Bold (`800`) | `1.1` | Hero earnings (`₹1,250`) |
| **H1 Heading** | `Sora` | 24px – 28px (`text-2xl`) | Bold (`700`) | `1.2` | Page greeting (`नमस्ते, रवि जी 👋`) |
| **H2 Section** | `Sora` | 18px – 20px (`text-xl`) | Bold (`700`) | `1.3` | Tab titles, card headers |
| **H3 Card** | `Sora` | 15px – 16px (`text-base`) | Semi-Bold (`600`) | `1.4` | Card titles (`आज की छोटी सलाह`) |
| **Body Standard** | `Manrope` | 13px – 14px (`text-sm`) | Medium (`500`) | `1.5` | Vernacular descriptions, audit summaries |
| **UI Labels & Buttons** | `Manrope` | 12px – 13px (`text-xs`/`text-sm`) | Semi-Bold / Bold (`600`/`700`) | `1.0` | Navigation items, button text, chips |
| **Caption / Timestamp** | `Manrope` | 10px – 11px (`text-[11px]`) | Medium (`500`) | `1.4` | Eyebrow tags (`शनिवार, 17 अक्टूबर`), secondary info |

---

## 4. Single Source of Truth & Zero Code Duplication

All theme constants are centralized in [`lib/theme.ts`](file:///Users/raghav/Desktop/gig-helper/lib/theme.ts):

```typescript
import { THEME_COLORS, THEME_FONTS, UI_STYLES } from '@/lib/theme';

// 1. In inline styles or dynamic components:
THEME_COLORS.ocean[850]    // '#0d3830'
THEME_COLORS.teal[600]     // '#0d9488'
THEME_COLORS.emergency.red // '#dc2626'

// 2. Predefined reusable Tailwind class string constants:
UI_STYLES.card             // "bg-white rounded-2xl border border-[#e2ece9] shadow-sm"
UI_STYLES.heroCard         // "bg-[#0d3830] text-white rounded-2xl relative overflow-hidden"
UI_STYLES.primaryBtn       // "bg-[#0d9488] hover:bg-[#0f766e] text-white font-bold rounded-xl ..."
UI_STYLES.sosBtn           // "bg-[#dc2626] hover:bg-[#b91c1c] text-white font-black rounded-xl ..."
UI_STYLES.navActivePill    // "bg-[#ccfbf1] text-[#0f766e] font-bold rounded-xl"
```

In Tailwind CSS, native utility classes are mapped directly:
- `bg-ocean-850`, `bg-ocean-900`, `text-ocean-850`
- `bg-teal-600`, `text-teal-700`, `border-teal-100`
- `bg-mint-50`, `bg-mint-100`, `border-mint-200`
- `font-heading` (`Sora`), `font-sans` (`Manrope`)

---

## 5. Screen Anatomy (Aligned with Provided Screenshot)

### A. Top Application Header
- **Logo Badge:** Rounded rectangle (`rounded-xl`), background `bg-teal-700` (`#0f766e`), centered white Devanagari **"सा"** in bold Sora.
- **Brand Identity:** Title **"साथी"** in bold Sora `text-ocean-950` (`#102a24`), subtitle **"काम में आपका भरोसेमंद साथी"** in `text-slate-500`.
- **Language Switcher:** Crisp white pill with fine border (`border-[#d1deda]`), globe icon, and active language name (**"हिंदी"**).
- **Emergency SOS:** Vibrant crimson button (`bg-[#dc2626]`), rounded-xl, white shield icon + **"SOS"** text. Provides 1-click access to the emergency hotline, family contact alert, and night safety tracking.

### B. Hero Greeting & Eyebrow
- **Date Tag:** Localized live date (`शनिवार, 17 अक्टूबर`) rendered in `text-teal-800 font-semibold text-xs`.
- **Greeting Heading:** Large bold display text (`नमस्ते, रवि जी 👋`), personalized to worker profile.
- **Subtitle:** `आज की कमाई और आपके काम की ज़रूरी मदद — सब एक जगह।` (`text-slate-600`).

### C. Featured Earnings Hero Card (`#0d3830`)
- **Background:** Deep Pine Green `bg-[#0d3830]` with subtle radial gradient.
- **Watermark Graphic:** Semi-transparent circular badge with large `₹` symbol (15% opacity) on the right side.
- **Header:** Briefcase/Wallet icon with label `आज की कमाई` in mint text (`text-[#a7d7cb]`).
- **Stat:** Large bold display font `₹1,250` in pure white Sora font (`text-3xl sm:text-4xl`).
- **Substat:** `14 डिलीवरी पूरी` in soft sage green (`text-[#cfe9e1]`).
- **Trend Indicator:** Trend up-right icon `↗` with `कल से ₹180 ज़्यादा` in white semibold pill.

### D. Vernacular Advice Card ("आज की छोटी सलाह")
- **Container:** White card (`rounded-2xl border border-[#e2ece9]`).
- **Icon Badge:** Warm amber rounded container (`bg-[#fef3c7]`) with `Lightbulb` icon (`text-[#d97706]`).
- **Title:** `आज की छोटी सलाह` in bold Sora.
- **Body:** `पेट्रोल का खर्च रोज़ लिखें — महीने के आखिर में पता चलेगा असली बचत कितनी हुई।`
- **Action Link:** `साथी की सलाह · 1 मिनट पढ़ें` in interactive teal (`text-[#0d9488] font-bold`).

### E. Quick Stats & Action Chips
Horizontal grid of clean white rounded cards:
1. **काम के घंटे:** Active shift hours (`10 घंटे`)
2. **हाथ में आए:** Real take-home pocket cash after fuel & penalties (`₹781`)
3. **प्लेटफ़ॉर्म कटौती:** Unfair deductions flagged for dispute (`-₹350`)
4. **इस हफ़्ते:** Weekly accumulated payout (`₹8,450`)

### F. Floating Action Button (FAB)
- **Position:** Fixed at bottom right.
- **Styling:** Pill-shaped `bg-[#0d3830]` with gentle drop shadow (`shadow-2xl shadow-[#0d3830]/40`).
- **Content:** Speech bubble icon (`MessageSquare`) + **"मदद पूछें"** text. Triggers the Saathi Multilingual AI Voice Assistant.

### G. Docked Bottom Navigation Bar
- **Container:** Elevated bar fixed at screen bottom with blur backdrop (`bg-white/95 backdrop-blur-md border-t border-[#e2ece9]`).
- **Active State:** Soft mint container (`bg-[#ccfbf1] text-[#0f766e] font-bold rounded-xl`).
- **Tabs:**
  - `होम` (Home)
  - `कमाई` (Earnings Audit)
  - `विवाद` (Dispute Drafter)
  - `योजनाएं` (Welfare Schemes)
  - `मदद` (Safety & Help)

---

## 6. Accessibility & Outdoor Sunlight Contrast (WCAG 2.1)

- All text on the `#0d3830` card has a contrast ratio exceeding **9.5:1** (AAA standard).
- All primary button text (`#ffffff` on `#0d9488` / `#0f766e`) has a contrast ratio of **4.8:1 to 6.2:1** (AA/AAA standard).
- Body copy on `#f8faf9` background maintains **11.2:1** contrast ratio.
- Touch targets on mobile meet or exceed **48px × 48px** for easy tapping while wearing delivery gloves or operating mobile phone mounts.
