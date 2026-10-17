/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-manrope)', 'Manrope', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['var(--font-sora)', 'Sora', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['var(--font-sora)', 'Sora', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        // Deep Ocean / Forest Pine (Dominant Brand Anchor)
        ocean: {
          50: '#f2f9f7',
          100: '#e1f2ed',
          200: '#c5e4db',
          300: '#9bcfc2',
          400: '#69b3a3',
          500: '#439686',
          600: '#32796c',
          700: '#286057',
          800: '#174a40',
          850: '#0d3830', // Exact hero card color from design
          900: '#0a2e27',
          950: '#071f1a',
        },
        // Teal (Interactive & Accent Brand Color)
        teal: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        // Mint / Sage (Soft backgrounds and pills)
        mint: {
          50: '#f4fbf8',
          100: '#e6f5f0',
          200: '#cfe9e1',
          300: '#a7d7cb',
          400: '#81c4b4',
        },
        // Saathi semantic mapping
        saathi: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#0d3830',
          900: '#0a2e27',
        },
        // Surface & Text
        surface: {
          DEFAULT: '#f8faf9',
          card: '#ffffff',
          border: '#e2ece9',
          borderLight: '#edf4f1',
        },
      },
    },
  },
  plugins: [],
};
