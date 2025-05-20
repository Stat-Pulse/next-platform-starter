import './globals.css';

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
      <body>
        {children}
        <script src="https://cdn.jsdelivr.net/npm/chart.js" async></script>
      </body>
    </html>
  );
}
