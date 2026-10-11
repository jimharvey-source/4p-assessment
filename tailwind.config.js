/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Management Ignition design system, 11 October 2026. Instrument Sans for everything the
        // software says. "serif" points at it too, so older classes follow without edits.
        // Fraunces only where Jim speaks to the reader: font-spoken.
        sans: ['"Instrument Sans"', '-apple-system', '"Segoe UI"', 'Helvetica', 'Arial', 'sans-serif'],
        serif: ['"Instrument Sans"', '-apple-system', '"Segoe UI"', 'Helvetica', 'Arial', 'sans-serif'],
        spoken: ['Fraunces', '"Iowan Old Style"', 'Georgia', 'serif'],
      },
      colors: {
        // The design system's roles, under the old names so every page follows.
        ink: {
          900: '#1b2a4a',
          800: '#1b2a4a',
          700: '#2a3d63',
          600: '#2a3d63',
          500: '#5d6b7f',
          400: '#7a8798',
          300: '#c9d1dc',
          200: '#e2e7ee',
          100: '#eef2f6',
          50:  '#f6f8fb',
        },
        accent: '#0e7c7b',
        'accent-soft': '#e9f3f3',
        // Tool colours: dots only, never text or fills.
        purpose: '#4CAF50',
        plan:    '#0077B6',
        people:  '#8B00CC',
        pride:   '#FF9800',
        meeting: '#F44336',
      },
      maxWidth: {
        prose: '40rem',
        reading: '48rem',
      },
    },
  },
  plugins: [],
};
