'use client'

import { useEffect, useState } from 'react'

export default function TrendingTopics() {
  const [newsItems, setNewsItems] = useState([])

  useEffect(() => {
    // Placeholder data
    const dummyNews = [
      {
       title: 'Derek Carr Announces Retirement',
        content: 'Saints confirm QBs Surprise Retirement.',
        date: 'May 10, 2025',
        category: 'Team News' 
      },
      {
        title: 'Sean Payton to Coach Broncos in 2025',
        content: 'Broncos confirm Payton’s return.',
        date: 'May 7, 2025',
        category: 'Coaching'
      },
      {
        title: 'J.J. McCarthy Named QB1 for Vikings',
        content: 'Vikings confirm J.J. McCarthy as starter for Week 1.',
        date: 'May 8, 2025',
        category: 'Team News'
      }
    ]
    setNewsItems(dummyNews)
  }, [])

  return (
    <div className="space-y-4">
      {newsItems.map((item, index) => (
        <div key={index} className="bg-gray-100 p-4 rounded shadow">
          <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
          <p className="text-sm text-gray-600">
            {item.content} <a href="#" className="text-red-600 hover:underline">Read more</a>
          </p>
          <p className="text-xs text-gray-500">{item.date} • {item.category}</p>
        </div>
      ))}
    </div>
  )
}
