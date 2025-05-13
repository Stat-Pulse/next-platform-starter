// pages/api/leagueSchedule.js

export default function handler(req, res) {
  const scheduleData = {
    2025: [
      { week: 1, date: '5-9 Sep 2025', matchups: [
        { team1: 'Thunder Cats', team2: 'Touchdown Titans', score: '104.2 - 98.7' },
        { team1: 'Gridiron Gurus', team2: 'Pigskin Pros', score: '110.5 - 95.3' }
      ], label: '', isPlayoff: false },
      { week: 2, date: '12-16 Sep 2025', matchups: [
        { team1: 'Thunder Cats', team2: 'Gridiron Gurus', score: '120.1 - 115.8' },
        { team1: 'Touchdown Titans', team2: 'Pigskin Pros', score: '108.4 - 100.2' }
      ], label: '', isPlayoff: false },
      { week: 3, date: '19-23 Sep 2025', matchups: [
        { team1: 'Thunder Cats', team2: 'Pigskin Pros', score: '112.7 - 105.6' },
        { team1: 'Touchdown Titans', team2: 'Gridiron Gurus', score: '118.3 - 109.4' }
      ], label: '', isPlayoff: false },
      // ...additional weeks from the HTML sample above
    ],
    2024: [
      { week: 1, date: '6-10 Sep 2024', matchups: [
        { team1: 'Thunder Cats', team2: 'Touchdown Titans', score: '102.5 - 97.8' },
        { team1: 'Gridiron Gurus', team2: 'Pigskin Pros', score: '108.3 - 94.6' }
      ], label: '', isPlayoff: false }
    ],
    2023: [
      { week: 1, date: '7-11 Sep 2023', matchups: [
        { team1: 'Thunder Cats', team2: 'Touchdown Titans', score: '100.7 - 96.4' },
        { team1: 'Gridiron Gurus', team2: 'Pigskin Pros', score: '106.9 - 92.8' }
      ], label: '', isPlayoff: false }
    ]
  };

  const teams = [
    { name: 'Thunder Cats', rank: 3, keyPlayers: { qb: 'Patrick Mahomes', rb: 'Derrick Henry' }, byeWeek: 6, record: '6-3', pointsFor: 1125.8, pointsAgainst: 990.2 },
    { name: 'Touchdown Titans', rank: 1, keyPlayers: { qb: 'Josh Allen', rb: 'Saquon Barkley' }, byeWeek: 7, record: '7-2', pointsFor: 1180.4, pointsAgainst: 950.7 },
    { name: 'Gridiron Gurus', rank: 5, keyPlayers: { qb: 'Lamar Jackson', rb: 'Christian McCaffrey' }, byeWeek: 9, record: '4-5', pointsFor: 1080.2, pointsAgainst: 1025.6 },
    { name: 'Pigskin Pros', rank: 7, keyPlayers: { qb: 'Jalen Hurts', rb: 'Bijan Robinson' }, byeWeek: 14, record: '3-6', pointsFor: 950.3, pointsAgainst: 1060.4 }
  ];

  res.status(200).json({ scheduleData, teams });
}
