// components/Footer.jsx
import React from 'react'
import Link from 'next/link'

export default function Footer() {
  const navItems = ['Home', 'Players', 'Compare', 'Insights', 'League', 'Fantasy', 'Support', 'About']

  return (
    <footer className="bg-gray-800 text-white py-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-4">StatPulse</h3>
            <p className="text-gray-400">Actionable NFL QB analytics for fans, fantasy players, and bettors.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {navItems.map((label) => {
                const href = label === 'Home' ? '/' : `/${label.toLowerCase()}`
                return (
                  <li key={label}>
                    <Link href={href} className="text-gray-400 hover:text-white">
                      {label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <p className="text-gray-400">Email: support@statpulse.com</p>
            <p className="text-gray-400">
              Follow us on{' '}
              <a
                href="https://twitter.com/StatPulseNFL"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                X
              </a>: @StatPulseNFL
            </p>
          </div>
        </div>

        <p className="text-center text-gray-400 mt-8">
          © {new Date().getFullYear()} StatPulse. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
