// app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'TaxBot',
  description: 'Your tax assistant chatbot',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* ✅ Google Fonts link for Inter */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.className} bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white`}>
        {children}
      </body>
    </html>
  );
}
