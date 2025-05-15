'use client'

import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SectionWrapper from '../components/SectionWrapper';
import Link from 'next/link';
import SearchBar from '../components/SearchBar';

export default function HomePage() {
  const [newsItems, setNewsItems] = useState([]);
  const [error, setError] = useState(null); // Track fetch errors

  const games = [
    { id: 301, home_team: 'KC', away_team: 'BUF', status: 'upcoming', date_time: 'Sunday 8:20 PM ET' },
    { id: 302, home_team: 'PHI', away_team: 'DAL', status: 'live', date_time: 'Q2 10:15' },
    { id: 303, home_team: 'CIN', away_team: 'CLE', status: 'final', date_time: 'Final Score: 27-17' },
  ];

  const searchIndex = [
    { label: 'Patrick Mahomes', url: '/players/00-0031234' },
    { label: 'San Francisco 49ers', url: '/teams/SF' },
    { label: 'QB Leaders 2024', url: '/stats/qb-leaders' },
    { label: 'Settings', url: '/profile/settings' },
    { label: 'Subscribe to Premium', url: '/subscribe' },
    { label: 'Fantasy Compare Tool', url: '/compare' },
    { label: 'Referee Assignments', url: '/refs' }
  ];

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch('/.netlify/functions/getNFLNews');
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        // Validate data structure
        if (Array.isArray(data)) {
          setNewsItems(data);
        } else {
          throw new Error('Invalid news data format');
        }
      } catch (e) {
        console.error('Failed to load news:', e);
        setError('Failed to load news. Please try again later.');
      }
    }

    fetchNews();
  }, []);

  if (error) {
    return (
      <>
        <Header />
        <header className="py-12 px-6 bg-gray-900 text-white text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to StatPulse</h1>
          <SearchBar data={searchIndex} />
        </header>
        <main className="bg-gray-100 py-10">
          <div className="container mx-auto px-6 text-center">
            <p className="text-red-600">{error}</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <header className="py-12 px-6 bg-gray-900 text-white text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to StatPulse</h1>
        <SearchBar data={searchIndex} />
      </header>

      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center text-white py-20 px-6"
        style={{
          backgroundImage:
            newsItems[0]?.image
              ? `url(${newsItems[0].image})`
              : "url('/images/featured-game.jpg')",
        }}
      >
        <div className="bg-black bg-opacity-60 p-8 rounded-lg max-w-3xl mx-auto text-center">
          {newsItems[0]?.title && newsItems[0]?.link ? (
            <>
              <h1 className="text-4xl font-bold mb-4">{newsItems[0].title}</h1>
              <p className="mb-6 text-sm italic text-gray-200">
                Top story via{' '}
                <span className="font-semibold">{newsItems[0].source || 'Unknown Source'}</span>
              </p>
              <a
                href={newsItems[0].link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                Read Full Article
              </a>
            </>
          ) : (
            <>
              <h1 className="text-4xl font-bold mb-4">Clash of the Titans</h1>
              <p className="mb-6">Awaiting top NFL headline...</p>
            </>
          )}
        </div>
      </section>

      <main className="bg-gray-100 py-10">
        <div className="container mx-auto px-6 space-y-12">
          {/* Personalized Dashboard */}
          <SectionWrapper title="Your Dashboard">
            {/* ... unchanged content */}
          </SectionWrapper>

          {/* League News (Live Feed) */}
          <SectionWrapper title="League Headlines">
            <div className="grid md:grid-cols-3 gap-6">
              {newsItems.length === 0 ? (
                <p className="text-gray-500">Loading latest NFL news...</p>
              ) : (
                newsItems.slice(0, 6).map((news, idx) => (
                  <div key={idx} className="bg-white p-4 rounded shadow">
                    <h4 className="text-md font-semibold text-gray-700 mb-1">{news.title}</h4>
                    <a
                      href={news.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 text-sm hover:underline"
                    >
                      Read on {news.source}
                    </a>
                  </div>
                ))
              )}
            </div>
          </SectionWrapper>

          {/* ... Rest of your content (Games, Top Performers, Quick Access) unchanged */}
        </div>
      </main>

      <Footer />
    </>
  );
}
