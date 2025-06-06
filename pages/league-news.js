import { useEffect, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function LeagueNews() {
  const [news, setNews] = useState([])
  const [visibleCount, setVisibleCount] = useState(6)
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState('date')
  const [categoryFilter, setCategoryFilter] = useState('')

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch('/api/news')
        const data = await res.json()
        setNews(data.slice(0, 6))
      } catch (err) {
        console.error('Failed to fetch league news:', err)
      }
    }
    fetchNews()
  }, [])

  const filteredNews = news
    .filter(item => {
      const q = query.toLowerCase()
      return (
        (!query || item.title.toLowerCase().includes(q)) &&
        (!categoryFilter || item.category === categoryFilter)
      )
    })
    .sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title)
      if (sortBy === 'source') return a.source.localeCompare(b.source)
      return new Date(b.pubDate) - new Date(a.pubDate)
    })
    .slice(0, visibleCount)

  return (
    <>
      <Header />
      <main className="bg-gray-100 py-10">
        <div className="container mx-auto px-6 space-y-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">League News</h1>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search news by keyword..."
              className="w-full p-2 border border-gray-300 rounded"
            />
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="p-2 border border-gray-300 rounded"
            >
              <option value="">All Categories</option>
              <option value="Transactions">Transactions</option>
              <option value="Coaching">Coaching</option>
              <option value="Rules">Rules</option>
              <option value="Injuries">Injuries</option>
            </select>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="p-2 border border-gray-300 rounded"
            >
              <option value="date">Sort by Date</option>
              <option value="title">Sort by Title</option>
              <option value="source">Sort by Source</option>
            </select>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.length > 0 ? (
              filteredNews.map((item, index) => (
                <article key={index} className="bg-white p-4 rounded shadow space-y-2">
                  <h2 className="text-lg font-semibold text-gray-700">
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline text-red-600"
                    >
                      {item.title}
                    </a>
                  </h2>
                  <p className="text-xs text-gray-500">
                    {new Date(item.pubDate).toLocaleDateString()} • {item.source}
                  </p>
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-48 object-cover rounded"
                    />
                  )}
                </article>
              ))
            ) : (
              <p className="text-sm text-gray-500">No news available.</p>
            )}
            {filteredNews.length < news.length && (
              <div className="text-center col-span-full">
                <button
                  onClick={() => setVisibleCount(visibleCount + 6)}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Load More
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}