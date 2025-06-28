'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ScheduleResults() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seasonsLoading, setSeasonsLoading] = useState(true);
  const [season, setSeason] = useState(''); // Default to empty string for "All Seasons"
  const [availableSeasons, setAvailableSeasons] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [allAvailableTeams, setAllAvailableTeams] = useState([]); // To store all teams for the dropdown

  // ───────────────────────────────────────────────────────────────────────────
  // Data fetching
  // ───────────────────────────────────────────────────────────────────────────

  // Fetch available seasons first
  useEffect(() => {
    setSeasonsLoading(true);
    fetch('/api/seasons')
      .then((res) => res.json())
      .then((data) => {
        const fetchedSeasons = data.map(String).sort((a, b) => b - a); // Sort seasons descending
        setAvailableSeasons(fetchedSeasons);
        setSeasonsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load seasons:', err);
        setSeasonsLoading(false);
        setAvailableSeasons(['2024', '2023']); // Fallback
      });
  }, []); // Runs only once on mount

  // Fetch all available teams for the dropdown when the component mounts
  // This ensures the team filter is always populated.
  useEffect(() => {
    fetch('/api/teams') // Assuming you have this endpoint
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setAllAvailableTeams(data.sort()); // Assuming data is an array of team names
      })
      .catch((err) => {
        console.error('Failed to load all teams:', err);
        // Fallback if the /api/teams endpoint doesn't exist or fails
        setAllAvailableTeams([
          'Arizona Cardinals', 'Atlanta Falcons', 'Baltimore Ravens', 'Buffalo Bills',
          'Carolina Panthers', 'Chicago Bears', 'Cincinnati Bengals', 'Cleveland Browns',
          'Dallas Cowboys', 'Denver Broncos', 'Detroit Lions', 'Green Bay Packers',
          'Houston Texans', 'Indianapolis Colts', 'Jacksonville Jaguars', 'Kansas City Chiefs',
          'Las Vegas Raiders', 'Los Angeles Chargers', 'Los Angeles Rams', 'Miami Dolphins',
          'Minnesota Vikings', 'New England Patriots', 'New Orleans Saints', 'New York Giants',
          'New York Jets', 'Philadelphia Eagles', 'Pittsburgh Steelers', 'San Francisco 49ers',
          'Seattle Seahawks', 'Tampa Bay Buccaneers', 'Tennessee Titans', 'Washington Commanders'
        ].sort());
      });
  }, []); // Runs only once on mount

  // Fetch games based on selected season and team
  useEffect(() => {
    // Determine if a fetch is needed.
    // Fetch if:
    // 1. A season is selected (even if no team)
    // 2. A team is selected (even if no season, i.e., "All Seasons")
    // If both are empty, we don't fetch and simply clear the games list.
    if (!season && !selectedTeam) {
      setGames([]);
      setLoading(false);
      return;
    }

    const queryParams = new URLSearchParams();

    // Only append season if it's not "All Seasons" (empty string)
    if (season) {
      queryParams.append('season', season);
    }
    // Only append team if it's not "All Teams" (empty string)
    if (selectedTeam) {
      queryParams.append('team', selectedTeam);
    }

    setLoading(true);
    fetch(`/api/games?${queryParams.toString()}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setGames(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading schedule:', err);
        setLoading(false);
        setGames([]);
      });
  }, [season, selectedTeam]); // Re-run when season or selectedTeam changes

  // ───────────────────────────────────────────────────────────────────────────
  // Derived state
  // ───────────────────────────────────────────────────────────────────────────
  // 'games' state already holds the filtered results from the API.

  // Group games for display
  const gamesDisplay = selectedTeam
    ? { 'All Games': games.sort((a, b) => a.week - b.week) } // If a team is selected, group all its games under 'All Games' and sort by week
    : games.reduce((acc, game) => { // If no team selected, group by week
        acc[game.week] = acc[game.week] || [];
        acc[game.week].push(game);
        return acc;
      }, {});

  // ───────────────────────────────────────────────────────────────────────────
  // UI
  // ───────────────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Hero header – different palette from other pages */}
      <section className="relative isolate overflow-hidden bg-blue-900 pb-24 pt-28 sm:pt-32">
        <img
          src="https://source.unsplash.com/random/1600x800?football-night"
          alt="stadium night background"
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-30"
        />

        <div className="mx-auto max-w-4xl px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-extrabold tracking-tight text-black sm:text-5xl"
          >
            NFL Schedule &amp; Results
          </motion.h1>
          <p className="mt-4 text-lg text-blue-100">
            View every matchup, score, and venue — filter by team, all in one curated timeline.
          </p>
        </div>
      </section>

      <main className="bg-gray-50 py-12">
        <div className="mx-auto max-w-5xl px-6 space-y-10">
          {/* Filters bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white shadow rounded-xl p-6 ring-1 ring-gray-200">
            <div>
              <label htmlFor="season" className="block text-sm font-medium text-gray-900 mb-1">
                Season
              </label>
              {seasonsLoading ? (
                <p className="text-gray-500 text-sm py-2">Loading seasons...</p>
              ) : (
                <select
                  id="season"
                  value={season}
                  onChange={(e) => {
                    setSeason(e.target.value);
                    // When season changes, we might want to clear team if "All Seasons" is chosen
                    // or if the previous team doesn't exist in the new season's data.
                    // For simplicity, we'll just let the `useEffect` handle re-fetching.
                  }}
                  className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-gray-900 text-md focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">All Seasons</option> {/* Blank option */}
                  {availableSeasons.length > 0 ? (
                    availableSeasons.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))
                  ) : (
                    <option value="">No seasons available</option>
                  )}
                </select>
              )}
            </div>

            <div>
              <label htmlFor="team-filter" className="block text-sm font-medium text-gray-900 mb-1">
                Team
              </label>
              <select
                id="team-filter"
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-gray-900 text-md focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">All Teams</option>
                {allAvailableTeams.map((team) => (
                  <option key={team} value={team}>
                    {team}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Schedule */}
          {loading ? (
            <p className="text-gray-900">Loading schedule…</p>
          ) : Object.keys(gamesDisplay).length === 0 ? (
            <p className="text-gray-900">No games found for the selected filters.</p>
          ) : (
            Object.keys(gamesDisplay).map((groupKey) => (
              <div key={groupKey} className="space-y-2">
                <h2 className="text-xl font-semibold text-blue-800">
                  {selectedTeam ? `${selectedTeam} Games` : `Week ${groupKey}`}
                </h2>

                <div className="overflow-x-auto rounded-xl shadow ring-1 ring-gray-200 bg-white">
                  <table className="min-w-full divide-y divide-gray-900 text-sm">
                    <thead className="bg-blue-50">
                      <tr>
                        <th className="px-4 py-2 text-left font-semibold text-gray-900">Season</th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-900">Week</th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-900">Weekday</th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-900">Home Team</th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-900">Home Score</th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-900">Away Score</th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-900">Away Team</th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-900">Total</th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-900">Location</th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-900">Overtime</th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-900">Away Moneyline</th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-900">Home Moneyline</th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-900">Total Line</th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-900">Under Odds</th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-900">Over Odds</th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-900">Temp</th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-900">Wind</th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-900">Referee</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {gamesDisplay[groupKey].map((game) => {
                        const gameDate = new Date(`${game.game_date}T${game.game_time || '00:00:00'}`);
                        const weekdayStr = game.weekday && typeof game.weekday === 'string'
                          ? game.weekday
                          : game.game_date
                            ? (isNaN(new Date(game.game_date)) ? "—" : new Date(game.game_date).toLocaleDateString('en-US', { weekday: 'short' }))
                            : "—";

                        const displayVal = (val) =>
                          val === null || val === undefined || val === '' ? <span>&mdash;</span> : val;
                        const yesNo = (val) =>
                          val === true ? (
                            <span className="inline-block px-2 py-0.5 rounded bg-green-100 text-gray-900">Yes</span>
                          ) : val === false ? (
                            <span className="inline-block px-2 py-0.5 rounded bg-gray-100 text-gray-900">No</span>
                          ) : (
                            <span>&mdash;</span>
                          );
                        return (
                          <tr key={game.game_id} className="hover:bg-blue-50/60">
                            <td className="px-4 py-2 whitespace-nowrap text-gray-900">{displayVal(game.season)}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-gray-900">{displayVal(game.week)}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-gray-900">{weekdayStr}</td>
                            <td className="px-4 py-2 whitespace-nowrap font-medium text-gray-900">{displayVal(game.home_team)}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-gray-900">{displayVal(game.home_score)}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-gray-900">{displayVal(game.away_score)}</td>
                            <td className="px-4 py-2 whitespace-nowrap font-medium text-gray-900">{displayVal(game.away_team)}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-gray-900">{displayVal(game.total)}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-gray-900">{displayVal(game.location || game.stadium_name)}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-gray-900">{yesNo(game.overtime)}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-gray-900">{displayVal(game.away_moneyline)}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-gray-900">{displayVal(game.home_moneyline)}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-gray-900">{displayVal(game.total_line)}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-gray-900">{displayVal(game.under_odds)}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-gray-900">{displayVal(game.over_odds)}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-gray-900">{displayVal(game.temp)}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-gray-900">{displayVal(game.wind)}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-gray-900">{displayVal(game.referee)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </>
  );
}