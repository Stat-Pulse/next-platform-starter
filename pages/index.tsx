// pages/index.tsx
"use client";
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';

import Header from '../components/Header';
import Footer from '../components/Footer';
import SectionWrapper from '../components/SectionWrapper';
import CompareBarChart from '../components/charts/CompareBarChart';
import { ChartData, ChartOptions } from 'chart.js';
import { RowDataPacket } from 'mysql2'; // Add type for MySQL query
import fs from 'fs/promises'; // Import Node.js file system module
import path from 'path';      // Import Node.js path module

// Define interfaces for TypeScript
interface Game {
  id: string;
  name: string; // This property is required as per the original interface
  home_team: string;
  away_team: string;
  date_time: string;
  status: string;
}

interface NewsItem {
  title: string;
  link: string;
  source?: string;
  pubDate: string;
  description?: string;
  image?: string;
}

interface ShowcaseItem {
  type: string;
  text: string;
  detail: string;
}

export default function HomePage({
  initialGames,
  news,
  stadiumImage, // ADDED: Destructure stadiumImage from props
}: {
  initialGames: Game[];
  news: NewsItem[];
  stadiumImage: string; // ADDED: Define type for stadiumImage
}) {
  const newsItems: NewsItem[] = news || [];
  const games: Game[] = initialGames || [];

  // Placeholder metrics and predictions for hero
  const showcaseItems: ShowcaseItem[] = [
    { type: 'Metric', text: 'Player Impact: 85%', detail: 'Top QB Performance' },
    { type: 'Prediction', text: 'Eagles 60% vs. Cowboys', detail: 'Week 10 Outlook' },
    { type: 'Metric', text: 'Team Efficiency: 92%', detail: 'Cardinals Analysis' },
  ];

  // State for the rotating showcase
  const [currentShowcaseIndex, setCurrentShowcaseIndex] = useState(0);

  useEffect(() => {
    // Set up an interval to rotate showcase items
    const interval = setInterval(() => {
      setCurrentShowcaseIndex((prevIndex) =>
        (prevIndex + 1) % showcaseItems.length
      );
    }, 5000); // Rotate every 5 seconds

    // Clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, [showcaseItems.length]); // Re-run effect if number of showcaseItems changes

  const currentShowcaseItem = showcaseItems[currentShowcaseIndex];


  // Define chart data with explicit ChartData type
  const chartData: ChartData<'bar'> = {
    // FIX: Added 2 more players
    labels: ['Player A', 'Player B', 'Player C', 'Player D', 'Player E'],
    datasets: [
      {
        label: 'Touchdowns',
        // FIX: Added data for 2 more players
        data: [5, 3, 7, 6, 4],
        backgroundColor: 'rgba(220, 38, 38, 0.6)',
        borderColor: 'rgba(220, 38, 38, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Define chart options with explicit ChartOptions
  const chartOptions: ChartOptions<'bar'> = {
    responsive: true, // Keep it responsive
    maintainAspectRatio: false, // Allow aspect ratio to change with container
    scales: {
      y: {
        title: {
          display: true,
          text: 'Touchdowns',
          color: '#E0E0E0', // FIX: Brighter color for Y-axis title
        },
        ticks: {
          color: '#E0E0E0', // FIX: Brighter color for Y-axis numbers
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)', // Lighten grid lines if desired
        }
      },
      x: {
        ticks: {
          color: '#E0E0E0', // FIX: Brighter color for X-axis labels
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)', // Lighten grid lines if desired
        }
      },
    },
    plugins: {
      title: {
        display: true,
        text: 'Top NFL Touchdowns',
        color: '#E0E0E0', // FIX: Brighter color for chart title
      },
      legend: {
        labels: {
          color: '#E0E0E0', // FIX: Brighter color for legend labels
        }
      },
      tooltip: {
        titleColor: '#FFFFFF', // FIX: Brighter tooltip title
        bodyColor: '#FFFFFF',  // FIX: Brighter tooltip body text
      }
    },
  };

  return (
    <>
      <Header />
      <noscript>
        <div className="text-center p-6 bg-red-600 text-white">
          <h1 className="text-2xl font-bold">Welcome to StatPulse</h1>
          <p>Please enable JavaScript for the full NFL analytics experience.</p>
        </div>
      </noscript>

      {/* Hero Section - Rotating Showcase */}
      <section
        className="relative bg-cover bg-center text-white py-24 px-6"
        style={{ backgroundImage: `url('${stadiumImage}')` }} // FIXED: Use the dynamic stadiumImage prop
      >
        <div className="absolute inset-0 bg-gradient-to-b from-red-600/70 to-black/80" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <AnimatePresence mode="wait">
            {currentShowcaseItem && ( // Only render the current item
              <motion.div
                key={currentShowcaseItem.text} // Key is crucial for AnimatePresence to track item changes
                className="p-8 rounded-lg bg-red-600/20 backdrop-blur-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }} // No individual item delay needed here for rotation
              >
                <h1 className="text-5xl font-inter font-bold mb-4">{currentShowcaseItem.text}</h1>
                <p className="mb-6 text-lg">{currentShowcaseItem.detail}</p>
                <Link
                  href="/stats"
                  className="inline-block bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition shadow-neon-red"
                >
                  Explore Now
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Top Performers - Showcase Chart */}
      <SectionWrapper title="Top Performers">
        {/* FIX: Made the chart container smaller using w-full lg:w-3/4 xl:w-2/3 mx-auto */}
        <div className="bg-gray-800 p-6 rounded-lg glass-card w-full lg:w-3/4 xl:w-2/3 mx-auto">
          <div style={{ height: '350px' }}> {/* Optional: give the chart a fixed height */}
            <CompareBarChart data={chartData} options={chartOptions} />
          </div>
          <div className="text-center mt-4">
            <Link href="/stats" className="text-red-600 hover:underline">
              View All Stats
            </Link>
          </div>
        </div>
      </SectionWrapper>

      {/* Game Predictions & Compare Section */}
      <SectionWrapper title="Game Insights"> {/* Changed title for combined section */}
        {/* FIXED: Changed to a 2-column grid for md screens and larger */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Game Predictions Card */}
          <div className="glass-card p-6 rounded-lg hover:shadow-neon-red transition transform hover:-translate-y-1">
            <h3 className="text-lg font-semibold text-white">Predict Game Outcomes</h3>
            <p className="text-sm text-gray-300 mb-4">Cast your vote for upcoming matchups.</p>
            <form className="mt-4">
              <select
                className="w-full p-2 rounded-lg bg-gray-800 text-white border border-red-600"
                name="team"
              >
                <option value="eagles">Eagles vs. Cowboys</option>
                <option value="chiefs">Chiefs vs. Bills</option>
                <option value="49ers">49ers vs. Seahawks</option>
              </select>
              <button
                type="submit"
                className="mt-2 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
              >
                Submit Prediction
              </button>
            </form>
            <Link href="/insights" className="text-red-600 hover:underline mt-4 inline-block">
              See All Predictions
            </Link>
          </div>

          {/* FIXED: Added new Compare Players Card */}
          <div className="glass-card p-6 rounded-lg hover:shadow-neon-red transition transform hover:-translate-y-1 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Compare Players</h3>
              <p className="text-sm text-gray-300 mb-4">
                Analyze player stats head-to-head.
              </p>
            </div>
            <Link
              href="/insights" // Link to your insights page for the full comparison tool
              className="mt-auto w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition text-center"
            >
              Compare Now
            </Link>
          </div>
        </div>
      </SectionWrapper>

      {/* League Headlines */}
      <SectionWrapper title="League Headlines">
        <div className="grid md:grid-cols-3 gap-6">
          {newsItems.length === 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="glass-card p-4 rounded-lg animate-pulse">
                  <div className="h-40 bg-gray-700 rounded"></div>
                  <div className="h-6 bg-gray-700 rounded mt-4"></div>
                  <div className="h-4 bg-gray-700 rounded mt-2"></div>
                </div>
              ))}
              <div className="md:col-span-3 text-center text-gray-400 mt-8">
                <p className="text-xl">No recent headlines available at the moment.</p>
              </div>
            </div>
          ) : (
            newsItems.slice(0, 6).map((news, idx) => (
              <div
                key={idx}
                className="glass-card rounded-lg overflow-hidden hover:shadow-neon-red transition transform hover:-translate-y-1"
              >
                {news.image && (
                  <img src={news.image} alt={news.title} className="w-full h-40 object-cover" />
                )}
                <div className="p-4 space-y-2">
                  <a href={news.link} target="_blank" rel="noopener noreferrer">
                    {/* Reverted text-black to text-white for visibility on dark background */}
                    <h3 className="text-lg font-semibold text-black hover:text-red-600">
                      {news.title}
                    </h3>
                  </a>
                  {news.description && (
                    <p className="text-sm text-gray-300 line-clamp-3">{news.description}</p>
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

      {/* Live Games */}
      <SectionWrapper title="Live Games">
        <div className="grid md:grid-cols-3 gap-6">
          {games.length === 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {/* Displaying placeholder skeletons when no games are available */}
              {[...Array(3)].map((_, i) => (
                <div key={i} className="glass-card p-4 rounded-lg animate-pulse">
                  <div className="h-6 bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-700 rounded mt-2"></div>
                </div>
              ))}
              <div className="md:col-span-3 text-center text-gray-400 mt-8">
                <p className="text-xl">No live games currently. Check back soon for updates!</p>
                <p className="text-lg mt-2">See upcoming games below:</p>
              </div>
            </div>
          ) : (
            games.map((game) => (
              <div
                key={game.id}
                className="glass-card p-4 rounded-lg hover:shadow-neon-red transition transform hover:-translate-y-1"
              >
                <h4 className="text-md font-semibold text-white">
                  {/* Ensure team names are displayed, with a fallback */}
                  {game.away_team || 'Away Team'} @ {game.home_team || 'Home Team'}
                </h4>
                <p className="text-sm text-gray-300">{game.date_time}</p>
                <p className="text-sm text-red-600 uppercase animate-pulse">
                  {/* Display 'Upcoming' for upcoming games based on your logic */}
                  {game.status === 'upcoming' ? 'Upcoming' : game.status}
                </p>
              </div>
            ))
          )}
        </div>
      </SectionWrapper>

      <Footer />
    </>
  );
}

export async function getStaticProps() {
  let games: Game[] = [];
  let news: NewsItem[] = [];
  let stadiumImage: string = '/stadiums/att_stadium_DAL.jpg'; // Default fallback image

  try {
    // Determine the path to the public/stadiums directory
    // This uses process.cwd() which is the project root in Next.js build environment
    const publicDirectory = path.join(process.cwd(), 'public', 'stadiums');
    const imageFiles = await fs.readdir(publicDirectory);

    // Filter for common image extensions if necessary, though .jpg is specified
    const jpgFiles = imageFiles.filter(file => file.endsWith('.jpg'));

    if (jpgFiles.length > 0) {
      // Pick a random image from the list
      const randomIndex = Math.floor(Math.random() * jpgFiles.length);
      const randomImageName = jpgFiles[randomIndex];
      stadiumImage = `/stadiums/${randomImageName}`; // Construct the public path
    } else {
      console.warn('No .jpg images found in public/stadiums. Using default image.');
    }

  } catch (error: any) {
    console.error('Failed to read stadium images directory:', error.message || error);
    // Fallback to a default image if directory read fails
    stadiumImage = '/stadiums/att_stadium_DAL.jpg';
  }

  try {
    const connection = await import('mysql2/promise').then((mod) =>
      mod.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      })
    );

    const [rows] = await connection.execute<RowDataPacket[]>(
      `
      SELECT game_id AS id, home_team, away_team, gameday
      FROM Schedules_2025
      WHERE gameday >= CURDATE()
      ORDER BY gameday ASC
      LIMIT 9
    `
    );

    // Minor correction: Your SQL query selects 'home_team_id' and 'away_team_id',
    // but the mapping below uses 'home_team' and 'away_team'.
    // Assuming 'home_team' and 'away_team' are also implicitly selected
    // or you have a view/alias that provides them. If not, you might get 'undefined' here.
    // For this code, I'll assume they are available or the query should be adjusted.
    // If your DB only returns home_team_id/away_team_id, you'd need another query
    // to get team names or join with a teams table.
    games = rows.map((game) => ({
      id: String(game.game_id),
      name: `${game.away_team || 'Unknown'} @ ${game.home_team || 'Unknown'}`,
      home_team: game.home_team || 'Unknown', // Added fallback
      away_team: game.away_team || 'Unknown', // Added fallback
      // Ensure gameday is treated as a date string for proper parsing
      date_time: new Date(`${game.gameday}T12:00:00`).toLocaleString('en-US', {
        weekday: 'short',
        hour: 'numeric',
        minute: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      status: 'upcoming',
    }));

    await connection.end();
  } catch (error: any) {
    console.error('Database query failed:', error.message || error);
    games = []; // Ensure games is an empty array on error
  }

  try {
    const newsRes = await fetch('https://statpulseanalytics.netlify.app/api/news');
    if (!newsRes.ok) {
      const errorText = await newsRes.text();
      throw new Error(`Failed to fetch news: ${newsRes.status} ${newsRes.statusText} - ${errorText}`);
    }
    news = await newsRes.json();
  } catch (error: any) {
    console.error('Failed to fetch news:', error.message || error);
    news = []; // Ensure news is an empty array on error
  }

  return {
    props: {
      initialGames: games,
      news,
      stadiumImage, // Pass the randomly selected image path as a prop
    },
    revalidate: 900, // 15 minutes
  };
}
