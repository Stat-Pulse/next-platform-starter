// pages/api/news.js
export default async function handler(req, res) {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing NEWS_API_KEY environment variable' });
  }

  // Get the optional 'team' query parameter from the frontend
  const { team } = req.query;

  // Build the query string for NewsAPI
  // If 'team' is provided, the query will be "NFL AND [TEAM_ABBR]"
  // If 'team' is NOT provided, the query will default to "NFL"
  let searchQuery = 'NFL';
  if (team) {
    searchQuery += ` AND ${team}`;
  }

  try {
    // Construct the API URL with the 'q' parameter for search query
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(searchQuery)}&language=en&sortBy=publishedAt&apiKey=${apiKey}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to fetch news from NewsAPI:', errorData);
      throw new Error(errorData.message || 'Failed to fetch news from external API');
    }

    const data = await response.json();
    return res.status(200).json(data.articles);
  } catch (error) {
    console.error('Error in /api/news:', error);
    return res.status(500).json({ error: error.message });
  }
}
