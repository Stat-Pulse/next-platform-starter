import '../styles/globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
-     <body>{children}</body>
+     <body style={{ outline: '5px dashed red', backgroundColor: 'hotpink' }}>
        {children}
      </body>
    </html>
  )
}
