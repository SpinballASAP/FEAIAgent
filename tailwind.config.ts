import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4F9CF9', // Bright Blue (like in reference)
          50: '#EBF4FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#4F9CF9',
          600: '#3B82F6',
          700: '#2563EB',
          800: '#1D4ED8',
          900: '#1E40AF',
        },
        secondary: {
          DEFAULT: '#9BB5FF', // Light Blue
          50: '#F4F7FF',
          100: '#E8EFFF',
          200: '#D6E3FF',
          300: '#B8CCFF',
          400: '#9BB5FF',
          500: '#7C9AFF',
          600: '#5A7CFF',
          700: '#3F5DFF',
          800: '#2B47E6',
          900: '#1E35B8',
        },
        tertiary: {
          DEFAULT: '#6B7FA0', // Muted Blue-Gray
          50: '#F8F9FB',
          100: '#F1F4F7',
          200: '#E4E9F0',
          300: '#CDD6E4',
          400: '#B0BDD4',
          500: '#6B7FA0',
          600: '#5C7094',
          700: '#4D6088',
          800: '#3E4F6F',
          900: '#2F3F58',
        },
        accent: {
          DEFAULT: '#A6C8FF', // Very Light Blue
          50: '#F7FAFF',
          100: '#EEF5FF',
          200: '#DCE9FF',
          300: '#C4DBFF',
          400: '#A6C8FF',
          500: '#85B3FF',
          600: '#5E98FF',
          700: '#3B7DFF',
          800: '#2563EB',
          900: '#1E40AF',
        },
        background: '#FFFFFF',
        foreground: '#2D3748',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
}
export default config