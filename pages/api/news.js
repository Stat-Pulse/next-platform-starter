export default async function handler(req, res) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://statpulseanalytics.netlify.app';
    const queryString = req.url?.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
    const response = await fetch(`${baseUrl}/.netlify/functions/getNFLNews${queryString}`);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('API error in /api/news:', error.message);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
}