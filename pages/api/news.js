export default async function handler(req, res) {
  try {
    const baseUrl = process.env.SITE_URL || 'https://statpulseanalytics.netlify.app';
    const queryString = new URL(req.url, 'http://localhost').search || '';
    const response = await fetch(`${baseUrl}/.netlify/functions/getNFLNews${queryString}`, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Netlify function responded with status: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('API error in /api/news:', error);
    res.status(500).json({ error: 'Failed to fetch news', details: error.message });
  }
}