import React, { useEffect, useState } from 'react';

type Game = {
  game_id: number;
  season: string;
  game_type: string;
  week: number;
  gameday: string;
  weekday: string;
  gametime: string;
  away_team: string;
  away_score: number;
  home_team: string;
  home_score: number;
  location: string;
  result: string;
  total: number | null;
  overtime: string | null;
  away_moneyline: number | null;
  home_moneyline: number | null;
  spread_line: number | null;
  away_spread_odds: number | null;
  home_spread_odds: number | null;
  total_line: number | null;
  under_odds: number | null;
  over_odds: number | null;
  div_game: number | null;
  roof: string | null;
  surface: string | null;
  temp: number | null;
  wind: string | null;
  referee: string | null;
};

const ScheduleResults = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await fetch('/api/games?season=2024');
        const data = await res.json();
        console.log('Fetched games:', data);
        setGames(data);
      } catch (error) {
        console.error('Error fetching games:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  return (
    <div>
      {/* Filters for Season/Team/Player can be placed here, visible but not blocking initial render */}
      <h1>Schedule and Results - 2024 Season</h1>

      {loading ? (
        <p>Loading games...</p>
      ) : (
        <table border={1} cellPadding={5} cellSpacing={0}>
          <thead>
            <tr>
              <th>Week</th>
              <th>Date</th>
              <th>Matchup</th>
              <th>Score</th>
              <th>Location</th>
              <th>Referee</th>
            </tr>
          </thead>
          <tbody>
            {games.map((game) => (
              <tr key={game.game_id}>
                <td>{game.week}</td>
                <td>{game.gameday}</td>
                <td>{`${game.away_team} @ ${game.home_team}`}</td>
                <td>{`${game.away_score} - ${game.home_score}`}</td>
                <td>{game.location}</td>
                <td>{game.referee || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ScheduleResults;