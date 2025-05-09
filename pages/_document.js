// pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Load Tailwind from CDN before React hydrates */}
        <Script
          src="https://cdn.tailwindcss.com"
          strategy="beforeInteractive"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
