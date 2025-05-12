import Header from '../components/Header'
import Footer from '../components/Footer'

export default function LeagueNews() {
  return (
    <>
      <Header />
      <main className="bg-gray-100 py-10">
        <div className="container mx-auto px-6 space-y-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">League News</h1>

          <input
            type="text"
            placeholder="Search news by keyword..."
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />

          <div className="grid md:grid-cols-2 gap-6">
            <article className="bg-white p-4 rounded shadow">
              <h2 className="text-lg font-semibold text-gray-700">Burrow Returns to Practice</h2>
              <p className="text-sm text-gray-500">May 10, 2025</p>
              <p className="text-gray-600 mt-2">QB Joe Burrow was a full participant in Thursday's practice.</p>
              <a href="#" className="text-red-600 hover:underline mt-2 block text-sm">Read more</a>
            </article>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
