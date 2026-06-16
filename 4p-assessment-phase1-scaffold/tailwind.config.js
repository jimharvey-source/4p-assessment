/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Outfit', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Diagnostic identity — sober, charcoal, premium
        ink: {
          900: '#0F0F10',
          800: '#1A1A1A',
          700: '#222222',
          600: '#3A3A3A',
          500: '#666666',
          400: '#888888',
          300: '#CCCCCC',
          200: '#E5E5E2',
          100: '#F5F1EA',
          50:  '#FAFAF7',
        },
        // The four Ps — borrowed from the framework / Ignite suite
        purpose: '#4CAF50',
        plan:    '#0077B6',
        people:  '#8B00CC',
        pride:   '#FF9800',
      },
      maxWidth: {
        prose: '40rem',
        reading: '48rem',
      },
    },
  },
  plugins: [],
};
