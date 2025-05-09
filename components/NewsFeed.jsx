// components/NewsFeed.jsx
import { useState, useEffect } from 'react'

// Mock data; replace with API call when ready
const mockNewsData = [
  { id: 1, title: "J.J. McCarthy Named QB1 for Vikings", category: "transactions", content: "The Vikings have named J.J. McCarthy as their starting QB for 2025 after his recovery from a meniscus injury.", team: "Vikings", player: "J.J. McCarthy", date: "2025-05-03" },
  { id: 2, title: "Justin Tucker Under Investigation", category: "announcements", content: "The NFL is investigating allegations against Ravens kicker Justin Tucker.", team: "Ravens", player: "Justin Tucker", date: "2025-05-05" },
  { id: 3, title: "Chiefs Draft Grades Soar", category: "recaps", content: "Kansas City’s 2025 draft class earned high marks, outclassing AFC West rivals.", team: "Chiefs", date: "2025-05-03" },
  { id: 4, title: "Tua Tagovailoa Injury Rumors", category: "rumors", content: "Speculation suggests Tua may miss games in 2025 due to ongoing health concerns.", team: "Dolphins", player: "Tua Tagovailoa", date: "2025-05-02" }
]

export default function NewsFeed() {
  const [newsData, setNewsData] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")

  // Load data (mock or API)
  useEffect(() => {
    // TODO: replace with real fetch
    setNewsData(mockNewsData)
  }, [])

  const filteredNews = newsData.filter(item => {
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory
    const matchesSearch = searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const rumors = newsData.filter(item => item.category === 'rumors')

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
          <h2 className="text-3xl font-bold text-gray-800">NFL News & Updates</h2>
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Search news..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="p-2 border rounded-md"
            />
            <select
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              className="p-2 border rounded-md"
            >
              <option value="all">All</option>
              <option value="injuries">Injuries</option>
              <option value="transactions">Transactions</option>
              <option value="recaps">Game Recaps</option>
              <option value="rumors">Rumors</option>
              <option value="announcements">Announcements</option>
            </select>
          </div>
        </div>
        <div className="space-y-6">
          {filteredNews.length > 0 ? (
            filteredNews.map(item => (
              <div key={item.id} className="bg-gray-100 p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">{item.title}</h3>
                <p className="text-gray-600 mb-2">{item.content}</p>
                <p className="text-sm text-gray-500">{item.date} • {item.category.charAt(0).toUpperCase() + item.category.slice(1)}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No news matches your criteria.</p>
          )}
        </div>

        {/* Trending Topics */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Trending Topics</h3>
          <div className="flex flex-wrap gap-2">
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">NFL Draft 2025</span>
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">Chiefs Dynasty</span>
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">Rookie QBs</span>
          </div>
        </div>

        {/* Rumors List */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Rumors & Speculation</h3>
          <p className="text-gray-600 italic">Note: Rumors are unconfirmed and speculative.</p>
          <ul className="space-y-2 text-gray-700">
            {rumors.length > 0 ? rumors.map(item => (
              <li key={item.id}>{item.title} - {item.date}</li>
            )) : (
              <li>No rumors available.</li>
            )}
          </ul>
        </div>
      </div>
    </section>
  )
}
