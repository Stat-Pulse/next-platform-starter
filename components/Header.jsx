// components/Header.jsx
import { useState } from 'react'
import Link from 'next/link'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navItems = ['Home', 'Players', 'Compare', 'Insights', 'League', 'Fantasy', 'Profile', 'Support', 'About']

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4 min-w-0">
          <Link href="/">
            <img
              src="/assets/logo.png"
              alt="StatPulse Logo"
              className="h-10 w-auto"
              onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/40x40?text=Logo' }}
            />
          </Link>
          <span className="flex-shrink-0 text-xl font-bold text-red-600 truncate">StatPulse</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-6 text-sm font-semibold">
          {navItems.map((label) => {
            const href = label === 'Home' ? '/' : `/${label.toLowerCase()}`
            return (
              <Link key={label} href={href}>
                <a className={label === 'Home' ? 'text-red-600 font-bold' : 'hover:text-red-600'}>
                  {label}
                </a>
              </Link>
            )
          })}
        </div>

        {/* Mobile Toggle & Login */}
        <div className="flex items-center md:hidden space-x-2">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-800 focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
          <Link href="/login">
            <a className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700">Login</a>
          </Link>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="container mx-auto px-6 py-4 flex flex-col space-y-4 text-sm font-semibold">
            {navItems.map((label) => {
              const href = label === 'Home' ? '/' : `/${label.toLowerCase()}`
              return (
                <Link key={label} href={href}>
                  <a className={label === 'Home' ? 'text-red-600 font-bold' : 'hover:text-red-600'}>
                    {label}
                  </a>
                </Link>
              )
            })}
            <Link href="/login">
              <a className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 text-center">
                Login
              </a>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
