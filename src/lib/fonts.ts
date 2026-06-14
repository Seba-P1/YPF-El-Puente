import { Inter } from 'next/font/google';

// Fuente Inter variable (Google Fonts) como fallback global
export const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

