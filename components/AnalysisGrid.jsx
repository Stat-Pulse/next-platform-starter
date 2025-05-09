// components/AnalysisGrid.jsx
import React from 'react'
import Link from 'next/link'

// Mock articles; replace with dynamic data when available
const articles = [
  {
    id: 1,
    title: "Eagles' 2025 Outlook",
    description: "Can Philadelphia repeat as Super Bowl champs? A deep dive into their draft and roster.",
    link: "/insights/eagles-2025",
    date: "May 5, 2025",
    type: "Article"
  },
  {
    id: 2,
    title: "Game Highlights",
    description: "Watch highlights from Week 1's top games.",
    link: "https://www.youtube.com/embed/sample-video",
    type: "Video"
  },
  {
    id: 3,
    title: "NFL Podcast",
    description: "Listen to ESPN's First Draft for draft prospect analysis.",
    link: "https://www.espn.com/espnradio/podcast",
    type: "External"
  },
  {
    id: 4,
    title: "Salary Cap Breakdown",
    description: "How the Bengals manage their cap space for 2025.",
    link: "/insights/bengals-cap",
    date: "May 4, 2025",
    type: "Article"
  }
]

export default function AnalysisGrid() {
  return (
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Analysis & Opinion</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map(item => (
            <div key={item.id} className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">{item.title}</h3>
              {item.type === 'Video' ? (
                <div className="aspect-w-16 aspect-h-9 mb-4">
                  <iframe
                    src={item.link}
                    frameBorder="0"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              ) : item.type === 'External' ? (
                <p className="text-gray-600 mb-4">
                  {item.description}{' '}
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">
                    Listen now
                  </a>
                </p>
              ) : (
                <p className="text-gray-600 mb-4">{item.description}{' '}
                  <Link href={item.link}>
                    <a className="text-red-600 hover:underline">Read more</a>
                  </Link>
                </p>
              )}
              {item.date && <p className="text-sm text-gray-500">By StatPulse Staff • {item.date}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
