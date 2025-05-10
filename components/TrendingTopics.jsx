'use client'

import { useEffect, useState } from 'react'

export default function TrendingTopics() {
  const [newsItems, setNewsItems] = useState([])

  useEffect(() => {
    // Placeholder for now — replace with API or dynamic source later
    const dummyNews = [
      {
        id: 1,
        title: "J.J. McCarthy Named QB1 for Vikings",
        summary: "Vikings announce J.J. McCarthy as starter.",
        category: "Transactions",
        date: "2025-05-08"
      },
      {
        id: 2,
        title: "Sean Payton Returns to Denver",
        summary: "Coach Payton confirmed for the 2025 season.",
        category: "Coaching",
        date: "2025-05-07"
      },
      {
        id: 3,
        title: "NFL Introduces Kickoff Rule Changes",
        summary: "New rules implemented to increase returns.",
        category: "Announcements",
        date: "2025-05-06"
      }
    ]
    setNewsItems(dummyNews)
  }, [])

  return (
    <section className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Trending Topics</h2>
        <input
          type="text"
          placeholder="Search news..."
          className="border p-2 rounded-md w-1/3"
        />
      </div>
      <ul className="space-y-4">
        {newsItems.map(item => (
          <li key={item.id} className="border-b pb-4">
            <h3 className="text-lg font-semibold text-red-600">{item.title}</h3>
            <p className="text-gray-600">{item.summary}</p>
            <p className="text-sm text-gray-500 mt-1">{item.date} • {item.category}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
