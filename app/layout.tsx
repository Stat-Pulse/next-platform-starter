// app/layout.tsx

import '../styles/globals.css'; // or './globals.css' if moved

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
        <div className="fixed top-4 right-4 w-6 h-6 bg-red-500 z-50" />
        {children}
      </body>
    </html>
  );
}