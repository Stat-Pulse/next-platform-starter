'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import SearchBar from './SearchBar'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navItems = ['Home', 'Players', 'Compare', 'Insights', 'League', 'Fantasy', 'Profile', 'Support', 'About']

  const searchData = [
    { label: 'Kyler Murray', type: 'Player', url: '/player/offense-1' },
    { label: 'Arizona Cardinals', type: 'Team', url: '/team/ARI' },
    { label: 'John Smith (Referee)', type: 'Referee', url: '/referee/1' },
    { label: 'Team Stats', type: 'Stats', url: '/stats/team/ARI' },
  ]

  return (
    <header className="bg-darkBackground text-lightText sticky top-0 z-50 shadow-md">
      <nav className="container mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/assets/logo.png"
              alt="StatPulse Logo"
              className="h-8 w-auto"
              onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/40x40?text=Logo' }}
            />
            <span className="text-xl font-bold text-primary-600 hidden sm:block">StatPulse</span>
          </Link>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="sm:hidden text-lightText text-2xl focus:outline-none"
            aria-label="Toggle menu"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
        <div className="hidden sm:block flex-1 max-w-xs sm:max-w-sm mx-4">
          <SearchBar data={searchData} />
        </div>
        <div className="hidden sm:flex items-center gap-2 text-sm font-semibold">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {navItems.map((label) => {
              const href = label === 'Home' ? '/' : `/${label.toLowerCase()}`
              return (
                <Link
                  key={label}
                  href={href}
                  className="whitespace-nowrap hover:text-primary-600 transition-colors"
                >
                  {label}
                </Link>
              )
            })}
          </div>
          <Link
            href="/login"
            className="btn bg-primary-600 hover:bg-primary-500 text-lightText whitespace-nowrap"
          >
            Login
          </Link>
        </div>
      </nav>
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="sm:hidden bg-darkBackground"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto px-4 sm:px-6 py-4">
              <div className="mb-4">
                <SearchBar data={searchData} />
              </div>
              <div className="flex flex-col gap-3 text-sm font-semibold">
                {navItems.map((label) => {
                  const href = label === 'Home' ? '/' : `/${label.toLowerCase()}`
                  return (
                    <Link
                      key={label}
                      href={href}
                      onClick={() => setMenuOpen(false)}
                      className="hover:text-primary-600 transition-colors"
                    >
                      {label}
                    </Link>
                  )
                })}
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="btn bg-primary-600 hover:bg-primary-500 text-lightText text-center"
                >
                  Login
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}