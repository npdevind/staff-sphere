/** @type {import('tailwindcss').Config} */
// =============================================================================
// Tailwind CSS Configuration
// =============================================================================
// Tailwind CSS v3 uses a "content" array to tell it which files to scan
// for class names. This enables "purging" - removing unused CSS in production.
//
// Why is this needed?
//   Tailwind generates thousands of utility classes. Without purging, the
//   CSS file would be huge. By specifying which files use Tailwind classes,
//   only the classes you actually use are included in the final CSS bundle.
// =============================================================================
export default {
  // Tell Tailwind to scan these files for class names
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Custom colors to maintain a consistent design system
      // You can reference these as: bg-primary-600, text-primary-700, etc.
      colors: {
        primary: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
      // Custom font family
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
