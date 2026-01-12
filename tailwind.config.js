/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Map the existing 'orange' color to the new site palette so existing classes keep working
        // Using the user's palette: dark (#050412), light (#FCFCFE), warm brown (#9A695A), deep brown (#4D3E39), bright yellow (#FBDB0E)
        orange: {
          50: '#FCFCFE', // color-2 (light background)
          100: '#FFF4B5', // soft pale
          200: '#FBEFA0',
          300: '#F7D94A',
          400: '#F3C71A',
          500: '#9A695A', // color-3 warm brown (base)
          600: '#FBDB0E', // color-5 bright yellow (hover/strong)
          700: '#B07B50',
          800: '#4D3E39', // color-4 deep brown (accent)
          900: '#050412', // color-1 deep text/dark
        },
        // Add a named alias 'brand' for clarity when building new components
        brand: {
          100: '#FCFCFE', // very light
          500: '#9A695A', // base brand color (warm brown)
          600: '#FBDB0E', // bright brand highlight
          800: '#4D3E39', // deep brown
          900: '#050412', // dark
        },
      },
    },
  },
  plugins: [],
};
