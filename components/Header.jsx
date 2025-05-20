'use client'

import { useState } from 'react'
import Link from 'next/link'
import SearchBar from './SearchBar' // Import SearchBar

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navItems = ['Home', 'Players', 'Compare', 'Insights', 'League', 'Fantasy', 'Profile', 'Support', 'About']

  // Mock data for SearchBar (to be replaced with real data later)
  const searchData = [
    { label: 'Kyler Murray', type: 'Player', url: '/player/offense-1' },
    { label: 'Arizona Cardinals', type: 'Team', url: '/team/ARI' },
    { label: 'John Smith (Referee)', type: 'Referee', url: '/referee/1' },
    { label: 'Team Stats', type: 'Stats', url: '/stats/team/ARI' },
  ]

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 overflow-x-auto whitespace-nowrap">
      <nav className="container mx-auto px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Logo and Title */}
        <div className="flex items-center justify-between sm:justify-start sm:gap-4">
          <Link href="/" className="flex-shrink-0 cursor-pointer">
            <img
              src="/assets/logo.png"
              alt="StatPulse Logo"
              className="h-10 w-auto"
              onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/40x40?text=Logo' }}
            />
          </Link>
          <span className="text-xl font-bold text-red-600 hidden sm:block">StatPulse</span>

          {/* Mobile Toggle */}
          <div className="flex items-center sm:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-800 focus:outline-none p-2">
              ☰
            </button>
          </div>
        </div>

        {/* SearchBar (Desktop) */}
        <div className="hidden sm:block flex-1 max-w-md mx-4">
          <SearchBar data={searchData} />
        </div>

        {/* Desktop Nav */}
        <div className="hidden sm:flex space-x-6 text-sm font-semibold overflow-x-auto">
          {navItems.map((label) => {
            const href = label === 'Home' ? '/' : `/${label.toLowerCase()}`
            const isHome = label === 'Home'
            return (
              <Link
                key={label}
                href={href}
                className={isHome ? 'text-red-600 font-bold' : 'hover:text-red-600'}
              >
                {label}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Mobile Menu Panel */}
      {menuOpen && (
        <div className="sm:hidden bg-white shadow-md">
          <div className="container mx-auto px-6 py-4">
            {/* Logo & Title */}
            <div className="flex items-center justify-between mb-4">
              <Link href="/" className="flex-shrink-0 cursor-pointer">
                <img
                  src="/assets/logo.png"
                  alt="StatPulse Logo"
                  className="h-8 w-auto"
                  onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/40x40?text=Logo' }}
                />
              </Link>
              <span className="text-xl font-bold text-red-600">StatPulse</span>
            </div>

            {/* SearchBar (Mobile) */}
            <div className="mb-4">
              <SearchBar data={searchData} />
            </div>

            {/* Navigation Links */}
            <div className="flex flex-col space-y-4 text-sm font-semibold">
              {navItems.map((label) => {
                const href = label === 'Home' ? '/' : `/${label.toLowerCase()}`
                const isHome = label === 'Home'
                return (
                  <Link
                    key={label}
                    href={href}
                    className={isHome ? 'text-red-600 font-bold' : 'hover:text-red-600'}
                  >
                    {label}
                  </Link>
                )
              })}

              {/* Login Link */}
              <Link
                href="/login"
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 text-center"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
