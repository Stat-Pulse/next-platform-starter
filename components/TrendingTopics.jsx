'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function TrendingTopics() {
  const [newsItems, setNewsItems] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const dummyNews = [
      {
        title: 'Derek Carr Announces Retirement',
        content: 'Saints HC Kellen Moore confirms QB\'s surprise retirement.',
        date: 'May 10, 2025',
        category: 'Transactions',
        team: 'Saints',
        player: 'Derek Carr',
        tags: ['QB', 'retire']
      },
      {
        title: 'J.J. McCarthy Named QB1 for Vikings',
        content: 'Vikings confirm J.J. McCarthy as starter for Week 1.',
        date: 'May 8, 2025',
        category: 'Transactions',
        team: 'Vikings',
        player: 'J.J. McCarthy',
        tags: ['QB', 'starter']
      },
      {
        title: 'Sean Payton to Coach Broncos in 2025',
        content: 'Broncos GM explains 2025 expectations.',
        date: 'May 7, 2025',
        category: 'Coaching',
        team: 'Broncos',
        player: '',
        tags: ['coach', 'Broncos']
      },
      {
        title: 'New Kickoff Rule Approved by NFL',
        content: 'Roger Goodell: "Kickoff rule changes are for player safety."',
        date: 'May 6, 2025',
        category: 'Rules',
        team: '',
        player: '',
        tags: ['rules', 'kickoff']
      }
    ]

    setNewsItems(dummyNews)
  }, [])

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
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-800">
          <Link href="/league-news" className="hover:underline text-red-600">
            Trending Topics
          </Link>
        </h3>
      </div>

      <input
        type="text"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        placeholder="Search by player, team, position, rule..."
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />

      {filteredNews.length > 0 ? (
        filteredNews.map((item, index) => (
          <Link href="/league-news" key={index} className="block">
            <div className="bg-gray-100 p-4 rounded shadow hover:bg-gray-200 transition">
              <h4 className="text-lg font-semibold text-gray-800">{item.title}</h4>
              <p className="text-sm text-gray-600">{item.content}</p>
              <p className="text-xs text-gray-500 mt-1">{item.date} • {item.category}</p>
            </div>
          </Link>
        ))
      ) : (
        <p className="text-sm text-gray-500">No matching topics found.</p>
      )}
    </div>
  )
}
