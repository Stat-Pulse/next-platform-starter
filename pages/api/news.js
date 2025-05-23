// pages/api/news.js
import Parser from 'rss-parser';

const parser = new Parser();

export default async function handler(req, res) {
  try {
    // Define RSS feeds for ESPN and NFL (add more as needed)
    const feeds = [
      'https://www.espn.com/espn/rss/nfl/news', // ESPN NFL RSS feed
      'https://www.nfl.com/rss/rss.xml', // NFL RSS feed
      // Add more feeds as needed
    ];

    const newsItems = [];

    // Fetch and parse each RSS feed
    for (const feedUrl of feeds) {
      const feed = await parser.parseURL(feedUrl);
      feed.items.slice(0, 3).forEach((item) => { // Take 3 items per feed
        newsItems.push({
          title: item.title,
          link: item.link,
          timestamp: item.pubDate ? new Date(item.pubDate).toLocaleString() : 'N/A',
        });
      });
    }

    // Sort by timestamp (newest first) and limit to 6 items
    newsItems.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const limitedNewsItems = newsItems.slice(0, 6);

    return res.status(200).json(limitedNewsItems);
  } catch (error) {
    console.error('Error fetching news:', error);
    return res.status(500).json({ error: 'Failed to fetch news' });
  }
}
