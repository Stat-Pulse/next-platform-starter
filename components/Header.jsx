'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navItems = ['Home','Players','Compare','Insights','League','Fantasy','Profile','Support','About']

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 overflow-x-auto whitespace-nowrap">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0 cursor-pointer">
          <img
            src="/assets/logo.png"
            alt="StatPulse Logo"
            className="h-10 w-auto"
            onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/40x40?text=Logo' }}
          />
        </Link>

        {/* Site title (hidden on small screens) */}
        <span className="text-xl font-bold text-red-600 hidden md:block">StatPulse</span>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-6 text-sm font-semibold overflow-x-auto">
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

        {/* Mobile Toggle */}
        <div className="flex items-center md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-800 focus:outline-none p-2">
            ☰
          </button>
        </div>
      </nav>

      {/* Mobile Menu Panel */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md">
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
