'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ScheduleResults() {
  const [games, setGames] = useState([]);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seasonsLoading, setSeasonsLoading] = useState(true); // New loading state for seasons

  // Initialize season to an empty string or null initially,
  // then set it to the latest season fetched from the API.
  // This prevents an immediate fetch for '2024' if the API returns something else.
  const [season, setSeason] = useState('');
  const [availableSeasons, setAvailableSeasons] = useState([]); // New state for available seasons
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState('');

  // ───────────────────────────────────────────────────────────────────────────
  // Data fetching
  // ───────────────────────────────────────────────────────────────────────────

  // Fetch available seasons first
  useEffect(() => {
    setSeasonsLoading(true);
    fetch('/api/seasons')
      .then((res) => res.json())
      .then((data) => {
        // Ensure data is an array of strings (e.g., ['2024', '2023'])
        const fetchedSeasons = data.map(String);
        setAvailableSeasons(fetchedSeasons);

        // Set the default season to the latest one available if not already set
        if (fetchedSeasons.length > 0 && !season) {
          setSeason(fetchedSeasons[0]); // Assumes API returns seasons in descending order
        }
        setSeasonsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load seasons:', err);
        setSeasonsLoading(false);
        // Optionally set a fallback season if API fails
        setAvailableSeasons(['2024']);
        setSeason('2024');
      });
  }, []); // Runs only once on component mount

  // Fetch games when season or selectedPlayer changes
  useEffect(() => {
    // Only fetch games if a season has been selected/loaded
    if (!season) {
      setGames([]); // Clear games if no season is selected yet
      setLoading(false);
      return;
    }

    const query = new URLSearchParams({
      season,
      ...(selectedPlayer && { player: selectedPlayer }),
    }).toString();

    setLoading(true);
    fetch(`/api/games?${query}`)
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
        setGames([]); // Clear games on error
      });
  }, [season, selectedPlayer]); // Re-runs when season or selectedPlayer changes

  // Fetch players list
  useEffect(() => {
    fetch('/.netlify/functions/getPlayers')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => setPlayers(data))
      .catch((err) => console.error('Failed to load players:', err));
  }, []);

  // ───────────────────────────────────────────────────────────────────────────
  // Derived state
  // ───────────────────────────────────────────────────────────────────────────
  const today = new Date();

  // Filter games based on selectedTeam (client-side filter)
  const filteredGames = selectedTeam
    ? games.filter(
        (g) => g.home_team === selectedTeam || g.away_team === selectedTeam,
      )
    : games;

  // Group filtered games by week
  const gamesByWeek = filteredGames.reduce((acc, game) => {
    acc[game.week] = acc[game.week] || [];
    acc[game.week].push(game);
    return acc;
  }, {});

  // Get all unique teams from the currently fetched games
  const allTeams = Array.from(new Set(games.flatMap((g) => [g.home_team, g.away_team]))).sort();

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
            View every matchup, score, and venue — filter by team or player, all in one curated timeline.
          </p>
        </div>
      </section>

      <main className="bg-gray-50 py-12">
        <div className="mx-auto max-w-5xl px-6 space-y-10">
          {/* Filters bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-white shadow rounded-xl p-6 ring-1 ring-gray-200">
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
                  className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-md focus:border-blue-500 focus:ring-blue-500"
                >
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
                className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-md focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">All Teams</option>
                {allTeams.map((team) => (
                  <option key={team} value={team}>
                    {team}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="player-filter" className="block text-sm font-medium text-gray-900 mb-1">
                Player
              </label>
              <select
                id="player-filter"
                value={selectedPlayer}
                onChange={(e) => setSelectedPlayer(e.target.value)}
                className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-md focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">All Players</option>
                {players.map((p) => (
                  <option key={p.player_id} value={p.player_id}>
                    {p.player_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedPlayer && (
            <div className="text-right -mt-6">
              <Link href={`/player-stats?player_id=${selectedPlayer}`} className="text-sm font-medium text-blue-700 hover:underline">
                View full profile →
              </Link>
            </div>
          )}

          {/* Schedule */}
          {loading ? (
            <p className="text-gray-900">Loading schedule…</p>
          ) : Object.keys(gamesByWeek).length === 0 ? (
            <p className="text-gray-900">No games found for the selected filters.</p>
          ) : (
            Object.keys(gamesByWeek).map((week) => (
              <div key={week} className="space-y-2">
                <h2 className="text-xl font-semibold text-blue-800">Week {week}</h2>

                <div className="overflow-x-auto rounded-xl shadow ring-1 ring-gray-200 bg-white">
                  <table className="min-w-full divide-y divide-gray-900 text-sm">
                    <thead className="bg-blue-50">
                      <tr>
                        <th className="px-4 py-2 text-left font-semibold text-black-900">Season</th>
                        <th className="px-4 py-2 text-left font-semibold text-black-900">Week</th>
                        <th className="px-4 py-2 text-left font-semibold text-black-900">Weekday</th>
                        <th className="px-4 py-2 text-left font-semibold text-black-900">Away Team</th> {/* Added */}
                        <th className="px-4 py-2 text-left font-semibold text-black-900">Home Team</th> {/* Added */}
                        <th className="px-4 py-2 text-left font-semibold text-black-900">Away Score</th>
                        <th className="px-4 py-2 text-left font-semibold text-black-900">Home Score</th>
                        <th className="px-4 py-2 text-left font-semibold text-black-900">Location</th>
                        <th className="px-4 py-2 text-left font-semibold text-black-900">Result</th>
                        <th className="px-4 py-2 text-left font-semibold text-black-900">Total</th>
                        <th className="px-4 py-2 text-left font-semibold text-black-900">Overtime</th>
                        <th className="px-4 py-2 text-left font-semibold text-black-900">Away Moneyline</th>
                        <th className="px-4 py-2 text-left font-semibold text-black-900">Home Moneyline</th>
                        <th className="px-4 py-2 text-left font-semibold text-black-900">Spread Line</th>
                        <th className="px-4 py-2 text-left font-semibold text-black-900">Away Spread Odds</th>
                        <th className="px-4 py-2 text-left font-semibold text-black-900">Home Spread Odds</th>
                        <th className="px-4 py-2 text-left font-semibold text-black-900">Total Line</th>
                        <th className="px-4 py-2 text-left font-semibold text-black-900">Under Odds</th>
                        <th className="px-4 py-2 text-left font-semibold text-black-900">Over Odds</th>
                        <th className="px-4 py-2 text-left font-semibold text-black-900">Division Game</th>
                        <th className="px-4 py-2 text-left font-semibold text-black-900">Roof</th>
                        <th className="px-4 py-2 text-left font-semibold text-black-900">Surface</th>
                        <th className="px-4 py-2 text-left font-semibold text-black-900">Temp</th>
                        <th className="px-4 py-2 text-left font-semibold text-black-900">Wind</th>
                        <th className="px-4 py-2 text-left font-semibold text-black-900">Referee</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {gamesByWeek[week].map((game) => {
                        // Date/weekday
                        const gameDate = new Date(`${game.game_date}T${game.gametime || '00:00:00'}`);
                        const isPast = gameDate < today;
                        const dateStr = gameDate.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        });
                        const timeStr = game.gametime
                          ? gameDate.toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: '2-digit',
                              timeZone: 'America/Chicago',
                            })
                          : null;
                        // New weekdayStr calculation
                        let weekdayStr = "—";
                        if (game.weekday && typeof game.weekday === 'string') {
                          weekdayStr = game.weekday;
                        } else if (game.game_date) {
                          const parsedDate = new Date(game.game_date);
                          weekdayStr = isNaN(parsedDate) ? "—" : parsedDate.toLocaleDateString('en-US', { weekday: 'short' });
                        }

                        // Helper for missing values
                        const displayVal = (val) =>
                          val === null || val === undefined || val === '' ? <span>&mdash;</span> : val;
                        // Boolean badge
                        const yesNo = (val) =>
                          val === true ? (
                            <span className="inline-block px-2 py-0.5 rounded bg-green-100 text-black-900">Yes</span>
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
                            <td className="px-4 py-2 whitespace-nowrap font-medium text-gray-900">{displayVal(game.away_team)}</td> {/* Added */}
                            <td className="px-4 py-2 whitespace-nowrap font-medium text-gray-900">{displayVal(game.home_team)}</td> {/* Added */}
                            <td className="px-4 py-2 whitespace-nowrap text-gray-900">{displayVal(game.away_score)}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-gray-900">{displayVal(game.home_score)}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-gray-900">{displayVal(game.location || game.stadium_name)}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-gray-900">
                              {/* Result: show home_score – away_score or em dash */}
                              {game.home_score !== null && game.away_score !== null ? (
                                <span className={isPast ? 'text-green-600' : 'text-gray-500'}>
                                  {game.home_score} – {game.away_score}
                                </span>
                              ) : (
                                <span className="text-gray-500">&mdash;</span>
                              )}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-gray-900">{displayVal(game.total)}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-gray-900">{yesNo(game.overtime)}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-gray-900">{displayVal(game.away_moneyline)}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-gray-900">{displayVal(game.home_moneyline)}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-gray-900">{displayVal(game.spread_line)}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-gray-900">{displayVal(game.away_spread_odds)}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-gray-900">{displayVal(game.home_spread_odds)}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-gray-900">{displayVal(game.total_line)}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-gray-900">{displayVal(game.under_odds)}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-gray-900">{displayVal(game.over_odds)}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-gray-900">{yesNo(game.div_game)}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-gray-900">{displayVal(game.roof)}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-gray-900">{displayVal(game.surface)}</td>
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