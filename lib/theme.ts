/**
 * Gig Kavach Design System Constants & Theme Tokens
 * Color Palette: Ocean & Teal
 * Typography: Sora (Headings & Display) + Manrope (Body & UI)
 */

export const THEME_COLORS = {
  // Deep Ocean / Pine Green (Dominant Brand Anchor, Hero Card, FAB)
  ocean: {
    950: '#071f1a',
    900: '#0a2e27',
    850: '#0d3830', // Exact hero card background from design screenshot
    800: '#114a40',
    750: '#135348',
    700: '#176658',
    600: '#1f8270',
    500: '#279f8a',
  },

  // Teal (Primary Action, Brand Badge, Interactive Accents)
  teal: {
    50: '#f0fdfa',
    100: '#ccfbf1', // Active tab container & pill backgrounds
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#14b8a6',
    600: '#0d9488', // Primary interactive button & link teal
    700: '#0f766e', // Brand logo badge teal
    800: '#115e59',
    900: '#134e4a',
  },

  // Mint / Sage (Gentle highlights, active nav, soft cards)
  mint: {
    50: '#f4fbf8',
    100: '#e6f5f0',
    200: '#cfe9e1',
    300: '#a7d7cb',
    400: '#81c4b4',
  },

  // Surfaces & Backgrounds
  surface: {
    background: '#f8faf9', // Warm, soft paper surface from screenshot
    card: '#ffffff',       // Crisp white cards
    border: '#e2ece9',     // Soft sage border
    borderLight: '#edf4f1',
    borderMuted: '#d1deda',
  },

  // Text Typography Colors
  text: {
    primary: '#102a24',    // Deep forest charcoal for high contrast headings
    secondary: '#4a5f59',  // Medium slate-teal for body & descriptions
    muted: '#718882',      // Muted labels and timestamps
    light: '#f0fdfa',      // Light mint text on dark cards
    white: '#ffffff',
  },

  // Semantic Alert & Emergency (SOS Shield & Critical Warnings)
  emergency: {
    red: '#dc2626',        // Vibrant SOS button
    redHover: '#b91c1c',
    redLight: '#fef2f2',
    redBorder: '#fecaca',
  },

  // Advice / Tip Yellow/Amber Badge
  advice: {
    amberBg: '#fef3c7',    // Soft amber rounded container for lightbulb
    amberText: '#92400e',
    amberIcon: '#d97706',
  },

  // Positive Trends & Success
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
  },
} as const;

export const THEME_FONTS = {
  heading: 'var(--font-sora), Sora, system-ui, -apple-system, sans-serif',
  body: 'var(--font-manrope), Manrope, system-ui, -apple-system, sans-serif',
  mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
} as const;

/**
 * Common Reusable UI Styles (Prevents code duplication across screens)
 */
export const UI_STYLES = {
  // Cards
  card: 'bg-white rounded-2xl border border-[#e2ece9] shadow-sm',
  cardHover: 'bg-white rounded-2xl border border-[#e2ece9] shadow-sm hover:border-[#14b8a6]/40 hover:shadow-md transition-all',
  heroCard: 'bg-[#0d3830] text-white rounded-2xl relative overflow-hidden shadow-lg',
  
  // Buttons
  primaryBtn: 'bg-[#0d9488] hover:bg-[#0f766e] text-white font-bold rounded-xl px-4 py-2.5 transition-all shadow-sm active:scale-[0.98]',
  secondaryBtn: 'bg-white hover:bg-[#f4fbf8] text-[#102a24] border border-[#d1deda] font-semibold rounded-xl px-4 py-2 transition-all active:scale-[0.98]',
  sosBtn: 'bg-[#dc2626] hover:bg-[#b91c1c] text-white font-black rounded-xl px-4 py-2 transition-all flex items-center gap-1.5 shadow-md shadow-red-600/30 active:scale-95',
  fabBtn: 'bg-[#0d3830] hover:bg-[#0a2e27] text-white font-bold rounded-full px-5 py-3.5 shadow-2xl shadow-[#0d3830]/50 flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95',
  
  // Navigation & Tabs
  navActivePill: 'bg-[#ccfbf1] text-[#0f766e] font-bold rounded-xl shadow-xs',
  navInactivePill: 'text-[#5a736d] hover:text-[#102a24] hover:bg-[#f0fbf7] font-medium rounded-xl',
  
  // Badges & Chips
  statChip: 'bg-white rounded-xl border border-[#e2ece9] p-3 shadow-xs hover:border-[#99f6e4] transition-all flex items-center gap-2.5 text-xs font-semibold text-[#102a24]',
  badgeTeal: 'bg-[#ccfbf1] text-[#0f766e] text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#99f6e4]',
  badgeAmber: 'bg-[#fef3c7] text-[#92400e] text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#fde68a]',
  badgeRed: 'bg-[#fef2f2] text-[#dc2626] text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#fecaca]',
  
  // Inputs
  input: 'bg-white border border-[#d1deda] rounded-xl px-3.5 py-2.5 text-sm text-[#102a24] placeholder-[#718882] focus:outline-none focus:ring-2 focus:ring-[#0d9488] focus:border-transparent transition-all',
} as const;
