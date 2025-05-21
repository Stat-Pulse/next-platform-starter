// app/layout.tsx

import '../styles/globals.css';   // ← ensure this path matches your project

export const metadata = {
  title: 'StatPulse Analytics',
  description: 'Fantasy sports and analytics platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 font-sans">
        {children}
      </body>
    </html>
  );
}
