// pages/_app.js
import '../styles/globals.css'; // This is correct and essential for global styles

import Head from 'next/head'; // Import Head from next/head for dynamic <head> content
import Header from '../components/Header'; // Assuming your Header is in components/Header.jsx
import Footer from '../components/Footer'; // Assuming your Footer is in components/Footer.js
// No useEffect needed here for adding 'dark' class if it's already in _document.js

function MyApp({ Component, pageProps }) {
  // If you've already added `className="dark"` to the <html> tag in pages/_document.js,
  // you likely don't need this useEffect to add it on the client side.
  // It only becomes necessary if you're dynamically toggling themes.
  // For now, I'd remove it to simplify and rely on _document.js for initial state.
  /*
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);
  */

  return (
    <>
      {/*
        Head content for the entire application (more dynamic/less critical than _document.js Head).
        If you have a <title> and <meta name="description"> in your pages/_document.js,
        you can remove them here to avoid duplication unless you need to dynamically
        override them per page. For a consistent site-wide title/description, _document.js is fine.
        However, if you want pages to have unique titles/descriptions (which is common for SEO),
        you should put a <Head> tag within each page component to override these.
        For simplicity, let's keep them here as a default, knowing they can be overridden.
      */}
      <Head>
        <title>StatPulse Analytics</title>
        <meta name="description" content="Fantasy sports and analytics platform" />
      </Head>

      {/*
        Main layout wrapper for the entire visible application content.
        This is where you apply your primary background, default text color, and font.
        Choose ONE of the background styles you had:
        Option A: Your original `app/layout.tsx` background (solid dark)
        Option B: Your `pages/_app.js` background (gradient)
      */}
      <div className="bg-darkBackground text-lightText font-sans min-h-screen antialiased">
      {/* OR */}
      {/* <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-teal-800 text-gray-100 min-h-screen font-sans antialiased"> */}
        {/*
          IMPORTANT: The class 'min-h-screen' here will ensure this div always takes
          at least the full height of the viewport. This is good for backgrounds.
        */}

        <Header /> {/* Your global Header component */}

        {/* This `main` tag applies your content width and horizontal padding. */}
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Component represents the current page being rendered (e.g., index.js, compare.js) */}
          <Component {...pageProps} />
        </main>

        <Footer /> {/* Your global Footer component */}
      </div>
    </>
  );
}

export default MyApp;