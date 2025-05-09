// app/layout.js
import '../styles/globals.css'

export const metadata = { /* … */ }

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}

export const metadata = {
  title: 'StatPulse Analytics',
  description: 'Analytics dashboard for StatPulse',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
