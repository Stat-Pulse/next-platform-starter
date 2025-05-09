// components/Hero.jsx
import React from 'react'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="py-20 bg-gradient-to-r from-red-600 to-red-800 text-white">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Welcome to StatPulse Analytics
        </h1>
        <p className="text-lg md:text-xl mb-6">
          Your ultimate source for NFL news, insights, and fan engagement.
        </p>
        <Link href="/profile">
          <a className="bg-white text-red-600 px-6 py-3 rounded-md font-semibold hover:bg-gray-100">
            Personalize Your Experience
          </a>
        </Link>
      </div>
    </section>
  )
}
