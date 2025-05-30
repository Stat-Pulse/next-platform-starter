// pages/_app.js
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      {/* Tailwind debug safelist */}
      <div className="hidden bg-primary text-primary border-primary"></div>
      <Component {...pageProps} />
    </>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 504cdbb (Add Tailwind safelist for primary colors)
