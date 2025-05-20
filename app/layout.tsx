// app/layout.tsx
import '../styles/globals.css';    // ← fixed path

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
      <body className="bg-white text-gray-900">
        {children}
      </body>
    </html>
  );
}