const seasonStatsQuery = `
  SELECT season, 
         SUM(receiving_yards) AS receiving_yards,
         SUM(receiving_tds) AS receiving_tds,
         SUM(rushing_yards) AS rushing_yards,
         SUM(rushing_tds) AS rushing_tds,
         SUM(passing_yards) AS passing_yards,
         SUM(passing_tds) AS passing_tds,
         SUM(passing_interceptions) AS interceptions
  FROM (
    ${[...Array(15).keys()].map(i => {
      const year = 2010 + i;
      return `SELECT season, receiving_yards, receiving_tds, rushing_yards, rushing_tds, passing_yards, passing_tds, passing_interceptions
              FROM Player_Stats_${year}
              WHERE player_id = ?`;
    }).join('\nUNION ALL\n')}
  ) AS combined
  GROUP BY season
  ORDER BY season ASC
`;
