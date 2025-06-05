'use client'

import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SectionWrapper from '../components/SectionWrapper';
import Link from 'next/link';
import SearchBar from '../components/SearchBar';

export default function HomePage({ initialGames, news }) {
  const [newsItems, setNewsItems] = useState(news || []);
  const [newsError, setNewsError] = useState(null); // Track news fetch errors
  const games = initialGames || [];

  const [searchIndex, setSearchIndex] = useState([]);

useEffect(() => {
  async function fetchSearchIndex() {
    try {
      const res = await fetch('/.netlify/functions/getSearchIndex');
      const data = await res.json();
      setSearchIndex(data);
    } catch (e) {
      console.error('Search index load failed:', e);
    }
  }

  fetchSearchIndex();
}, []);

/*
  useEffect(() => {
    async function fetchNews() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
        const res = await fetch(`${baseUrl}/api/news`);
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
        setNewsError('Failed to load news. Please try again later.');
      }
    }

    fetchNews();
  }, []);
*/

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
      newsItems?.[0]?.image
        ? `url(${newsItems[0].image})`
        : "url('/images/featured-game.jpg')",
  }}
>
  <div className="absolute inset-0 bg-black bg-opacity-60" />
  <div className="relative z-10 p-8 rounded-lg max-w-3xl mx-auto text-center">
    {newsError ? (
      <p className="text-red-400">Unable to load top story.</p>
    ) : newsItems[0]?.title && newsItems[0]?.link ? (
      <>
        <h1 className="text-4xl font-bold mb-4">{newsItems[0].title}</h1>
        <p className="mb-4 text-sm italic text-gray-300">
          Top story via{' '}
          <span className="inline-block bg-blue-600 text-white px-2 py-0.5 rounded text-xs uppercase tracking-wide">
            {newsItems[0].source || 'Unknown'}
          </span>
        </p>
        <a
          href={newsItems[0].link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Read Full Article
        </a>
      </>
    ) : (
      <>
        <h1 className="text-4xl font-bold mb-4">Big Story Here. IDK</h1>
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
        <div key={idx} className="bg-white rounded shadow overflow-hidden hover:shadow-md transition">
          {news.image && (
            <img
              src={news.image}
              alt={news.title}
              className="w-full h-40 object-cover"
            />
          )}
          <div className="p-4 space-y-2">
            <a href={news.link} target="_blank" rel="noopener noreferrer">
              <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-700">{news.title}</h3>
            </a>
            {news.description && (
              <p className="text-sm text-gray-600 line-clamp-3">
                {news.description}
              </p>
            )}
            <div className="text-xs text-gray-400 flex justify-between items-center mt-2">
              <span>{news.source}</span>
              <span>{new Date(news.pubDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      ))
    )}
  </div>
</SectionWrapper>

          {/* Games Section */}
          <SectionWrapper title="Games">
            <div className="grid md:grid-cols-3 gap-6">
              {games.length === 0 ? (
                <p className="text-gray-500">No upcoming games found.</p>
              ) : (
                games.map((game) => (
                  <div key={game.id} className="bg-white p-4 rounded shadow">
                    <h4 className="text-md font-semibold text-gray-700 mb-1">
                      {game.away_team} @ {game.home_team}
                    </h4>
                    <p className="text-sm text-gray-500">{game.date_time}</p>
                    <p className="text-sm text-blue-600 uppercase">{game.status}</p>
                  </div>
                ))
              )}
            </div>
          </SectionWrapper>

          {/* ... Add other sections like Top Performers, Quick Access if they exist */}
        </div>
      </main>

      <Footer />
    </>
  );
}

import mysql from 'mysql2/promise';

export async function getStaticProps() {
  let games = [];
  let news = [];

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [rows] = await connection.execute(`
      SELECT game_id AS id, home_team, away_team, gameday
      FROM Schedules_2025
      WHERE gameday >= CURDATE()
      ORDER BY gameday ASC
      LIMIT 9
    `);

    games = rows.map(game => {
      const dateStr = `${game.gameday}T12:00:00`;
      return {
        ...game,
        date_time: new Date(dateStr).toLocaleString('en-US', {
          weekday: 'short',
          hour: 'numeric',
          minute: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
        status: 'upcoming',
      };
    });
  } catch (error) {
    console.error('Database query failed:', error);
  }

  try {
    const newsRes = await fetch('https://statpulseanalytics.netlify.app/api/news');
    news = await newsRes.json();
  } catch (e) {
    console.error('Failed to fetch news:', e);
  }

  return {
    props: {
      initialGames: games,
      news,
    },
    revalidate: 900, // Rebuild every 15 minutes
  };
}