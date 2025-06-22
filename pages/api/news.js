// pages/api/news.js
export default async function handler(req, res) {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing NEWS_API_KEY environment variable' });
  }

  try {
    const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`);
    if (!response.ok) throw new Error('Failed to fetch news');
    const data = await response.json();
    return res.status(200).json(data.articles);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}