// app/layout.tsx
import '../styles/globals.css'; // Updated to correct path
import { ReactNode } from 'react';

export const metadata = {
  title: 'StatPulse Analytics',
  description: 'Fantasy sports and analytics platform',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-gradient-to-br from-purple-900 via-purple-800 to-teal-800 text-gray-100 font-sans min-h-screen antialiased">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </body>
    </html>
  );
}