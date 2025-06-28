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


  // Fetch available seasons first
  useEffect(() => {
    setSeasonsLoading(true);
    fetch('/api/seasons')
      .then((res) => res.json())
      .then((data) => {
        const fetchedSeasons = data.map(String).sort((a, b) => b - a); // Sort seasons descending
        setAvailableSeasons(fetchedSeasons);
        // Do NOT set a default season here. Let it be initially blank for "All Seasons" option
        setSeasonsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load seasons:', err);
        setSeasonsLoading(false);
        setAvailableSeasons(['2024', '2023']); // Fallback
      });
  }, []);

  // Fetch games based on selected season and team
  useEffect(() => {
    // Only fetch if a filter is active, or if we want to load initial data (e.g., all games from latest season)
    // For initial load, if no team/season selected, we might want to show nothing or a default set.
    // Given the request, we want to fetch if *either* season or team is selected.
    // If both are empty, we can choose to display nothing until a selection is made.
    if (!season && !selectedTeam) {
      setGames([]);
      setLoading(false);
      // Potentially fetch initial data (e.g., all teams) here if not already done
      // For now, let's assume `allAvailableTeams` is populated through `games` or `seasons` later.
      return;
    }

    const queryParams = new URLSearchParams();

    // Append season only if it's not "All Seasons" (empty string)
    if (season) {
      queryParams.append('season', season);
    }
    // Append team only if it's not "All Teams" (empty string)
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
        // Update allAvailableTeams based on fetched games
        const uniqueTeams = Array.from(new Set(data.flatMap((g) => [g.home_team, g.away_team]))).sort();
        setAllAvailableTeams(uniqueTeams);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading schedule:', err);
        setLoading(false);
        setGames([]);
        setAllAvailableTeams([]); // Clear teams on error
      });
  }, [season, selectedTeam]); // Re-run when season or selectedTeam changes

  // ───────────────────────────────────────────────────────────────────────────
  // Derived state
  // ───────────────────────────────────────────────────────────────────────────
  // No need for a 'filteredGames' state here, as filtering is done by API now.
  // 'games' state already holds the filtered results.

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
                  onChange={(e) => setSeason(e.target.value)}
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
                {/* Use allAvailableTeams here, which is updated after each game fetch */}
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
                      {/* Iterate over the games in the current group */}
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