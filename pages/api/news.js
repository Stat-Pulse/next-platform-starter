import { NextResponse } from 'next/server';

export async function GET(request) {
  const apiKey = process.env.NEWS_API_KEY;
  const { searchParams } = new URL(request.url);
  const teamId = searchParams.get('team')?.toUpperCase();

  const teamMap = {
    PHI: 'Philadelphia Eagles',
    KC: 'Kansas City Chiefs',
    SF: 'San Francisco 49ers',
    DAL: 'Dallas Cowboys',
    BUF: 'Buffalo Bills',
    NYJ: 'New York Jets',
    MIA: 'Miami Dolphins',
    GB: 'Green Bay Packers',
    NE: 'New England Patriots',
    DET: 'Detroit Lions',
    // Add more as needed
  };

  const query = teamMap[teamId] || 'NFL';

  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&apiKey=${apiKey}&language=en&pageSize=5&sortBy=publishedAt`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch news');
    const data = await response.json();
    return NextResponse.json(data.articles);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}
