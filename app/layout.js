// app/layout.js
import '../styles/globals.css'

export const metadata = {
  title: 'StatPulse Analytics',
  description: 'Your source for real‐time QB insights',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
