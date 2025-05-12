import Header from '../components/Header'
import Footer from '../components/Footer'

export default function MediaVault() {
  return (
    <>
      <Header />
      <main className="bg-gray-100 py-10">
        <div className="container mx-auto px-6 space-y-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Media Vault</h1>

          <section className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-lg font-semibold mb-2 text-gray-700">Game Highlights</h2>
              <iframe
                src="https://www.youtube.com/embed/sample-video"
                className="w-full aspect-video rounded"
                allowFullScreen
              ></iframe>
            </div>

            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-lg font-semibold mb-2 text-gray-700">Podcasts</h2>
              <p className="text-gray-600">Listen to the latest NFL discussions from ESPN, The Ringer, and more.</p>
              <a
                href="https://www.espn.com/espnradio/podcast"
                target="_blank"
                className="text-red-600 hover:underline text-sm"
              >
                Go to Podcasts
              </a>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
