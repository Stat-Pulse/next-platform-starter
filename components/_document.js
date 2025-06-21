import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components'; // If using styled-components (optional)

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const originalRenderPage = ctx.renderPage;

    // Optional: If using styled-components
    const sheet = new ServerStyleSheet();
    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html lang="en" className="bg-gradient-to-br from-purple-900 via-purple-800 to-teal-800 text-gray-100">
        <Head>
          {/* Meta Tags for SEO and Performance */}
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta name="description" content="StatPulse - Your ultimate hub for NFL stats, fantasy insights, and betting odds." />
          <meta name="keywords" content="NFL, stats, fantasy football, betting, sports analytics" />
          <meta name="author" content="StatPulse Team" />

          {/* Open Graph Tags for Social Sharing */}
          <meta property="og:title" content="StatPulse - NFL Analytics Platform" />
          <meta property="og:description" content="Dive into real-time NFL stats, fantasy football insights, and betting odds with StatPulse." />
          <meta property="og:image" content="https://statpulse.com/og-image.jpg" />
          <meta property="og:url" content="https://statpulse.com" />
          <meta property="og:type" content="website" />

          <meta name="theme-color" content="#1e4d4d" />
          {/* Favicon */}
          <link rel="icon" href="/favicon.ico" />

          {/* Preload Key Assets */}
          <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
          <link rel="preload" href="/images/logo.png" as="image" />

          {/* Critical CSS (Inline for Performance) */}
          <style dangerouslySetInnerHTML={{
            __html: `
              body { margin: 0; font-family: 'Inter', sans-serif, system-ui; }
              .bg-gradient-to-br { background: linear-gradient(to bottom right, #2a1a3d, #1e4d4d); }
              .text-cyan-300 { color: #80deea; }
              .focus-ring-cyan-500:focus { outline: none; ring: 2px solid #00bcd4; }
            `,
          }} />
        </Head>
        <body className="min-h-screen">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
