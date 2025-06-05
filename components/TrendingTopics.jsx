'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function TrendingTopics() {
  const [newsItems, setNewsItems] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch('/api/news');
        const data = await res.json();
        const transformed = data.map(item => ({
          title: item.title,
          content: '', // or item.description if you want to include it
          date: new Date(item.pubDate).toLocaleDateString(),
          category: item.source,
          team: '',
          player: '',
          tags: [],
          link: item.link,
          image: item.image || null,
        }));
        setNewsItems(transformed);
      } catch (err) {
        console.error('Failed to load news:', err);
      }
    }
    fetchNews();
  }, []);

  const filteredNews = newsItems.filter(item => {
    const query = searchQuery.toLowerCase()
    return (
      item.title.toLowerCase().includes(query) ||
      item.content.toLowerCase().includes(query) ||
      item.team?.toLowerCase().includes(query) ||
      item.player?.toLowerCase().includes(query) ||
      item.tags?.some(tag => tag.toLowerCase().includes(query))
    )
  })

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        placeholder="Search by player, team, position, rule..."
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />
      {filteredNews.length > 0 ? (
        filteredNews.map((item, index) => (
          <div key={index} className="bg-gray-100 p-4 rounded shadow">
            {item.image && (
              <img src={item.image} alt={item.title} className="w-full h-40 object-cover rounded mb-2" />
            )}
            <h3 className="text-lg font-semibold text-gray-800">
              <Link href={item.link || '/league-news'} target="_blank" rel="noopener noreferrer" className="hover:underline text-red-600">
                {item.title}
              </Link>
            </h3>
            <p className="text-sm text-gray-600">{item.content}</p>
            <p className="text-xs text-gray-500">
              {item.date} • {item.category}
            </p>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500">No matching topics found.</p>
      )}
    </div>
  )
}
