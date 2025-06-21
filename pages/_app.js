// pages/_app.js
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-teal-800 text-gray-100 min-h-screen font-sans antialiased">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Component {...pageProps} />
      </main>
    </div>
  );
}

export default MyApp;