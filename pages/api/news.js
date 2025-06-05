export default async function handler(req, res) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/.netlify/functions/getNFLNews`);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('API error in /api/news:', error.message);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
}