// pages/api/news.js
const teamNameMap = {
  ARI: 'Cardinals',
  ATL: 'Falcons',
  BAL: 'Ravens',
  BUF: 'Bills',
  CAR: 'Panthers',
  CHI: 'Bears',
  CIN: 'Bengals',
  CLE: 'Browns',
  DAL: 'Cowboys',
  DEN: 'Broncos',
  DET: 'Lions',
  GB: 'Packers',
  HOU: 'Texans',
  IND: 'Colts',
  JAX: 'Jaguars',
  KC: 'Chiefs',
  LV: 'Raiders',
  LAC: 'Chargers',
  LAR: 'Rams',
  MIA: 'Dolphins',
  MIN: 'Vikings',
  NE: 'Patriots',
  NO: 'Saints',
  NYG: 'Giants',
  NYJ: 'Jets',
  PHI: 'Eagles',
  PIT: 'Steelers',
  SEA: 'Seahawks',
  SF: '49ers',
  TB: 'Buccaneers',
  TEN: 'Titans',
  WAS: 'Commanders'
};

export default async function handler(req, res) {
  const teamAbbr = req.query.team || 'NFL';
  const apiKey = process.env.NEWS_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Missing NEWS_API_KEY env variable' });
  }

  const query = `${teamNameMap[teamAbbr.toUpperCase()] || teamAbbr} NFL`;
  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&apiKey=${apiKey}&language=en&sortBy=publishedAt&pageSize=5`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch news');
    const data = await response.json();

    const teamFullName = teamNameMap[teamAbbr.toUpperCase()];
    const filtered = data.articles.filter(article => {
      const title = article.title?.toLowerCase() || '';
      const description = article.description?.toLowerCase() || '';
      return (
        title.includes(teamAbbr.toLowerCase()) ||
        description.includes(teamAbbr.toLowerCase()) ||
        (teamFullName &&
          (title.includes(teamFullName.toLowerCase()) || description.includes(teamFullName.toLowerCase())))
      );
    });

    res.status(200).json(filtered.slice(0, 5));
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}