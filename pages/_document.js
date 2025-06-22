// pages/_document.js
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components'; // Keep if you are actually using styled-components

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const originalRenderPage = ctx.renderPage;

    // IMPORTANT: Only keep this styled-components setup if you are actually using
    // styled-components in your project. If not, remove this entire try/finally block
    // and just use `const initialProps = await Document.getInitialProps(ctx); return initialProps;`
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
      // Apply global HTML attributes here.
      // The background gradient and text color belong in pages/_app.js's wrapper div
      // or a global body style in globals.css, not on the <html> tag itself in _document.js.
      // _document.js is for the very base HTML structure.
      // The 'scroll-smooth dark' classes are fine here.
      <Html lang="en" className="scroll-smooth dark">
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
          {/* Ensure these paths are correct relative to your /public directory */}
          <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
          <link rel="preload" href="/images/logo.png" as="image" />

          {/* Critical CSS (Inline for Performance) - Keep if needed, otherwise move to globals.css */}
          {/* Note: If these styles conflict with Tailwind or are not truly critical,
                     it's better to manage them via globals.css.
                     The `bg-gradient-to-br` will be handled by Tailwind if properly configured. */}
          <style dangerouslySetInnerHTML={{
            __html: `
              body { margin: 0; font-family: 'Inter', sans-serif, system-ui; }
              /* Remove if Tailwind handles this: */
              /* .bg-gradient-to-br { background: linear-gradient(to bottom right, #2a1a3d, #1e4d4d); } */
              .text-cyan-300 { color: #80deea; }
              .focus-ring-cyan-500:focus { outline: none; ring: 2px solid #00bcd4; }
            `,
          }} />
        </Head>
        {/* The min-h-screen should be applied to a wrapper div in _app.js,
            not directly to the <body> in _document.js, unless you're very careful
            about how content fills the viewport. */}
        <body className="min-h-screen">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;