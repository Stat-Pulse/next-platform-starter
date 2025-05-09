// app/layout.js
import '../styles/globals.css'

export const metadata = {
  title: 'StatPulse',
  description: '…'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
