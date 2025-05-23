// pages/api/news.js
import Parser from 'rss-parser';

const parser = new Parser();

export default async function handler(req, res) {
  try {
    // Define RSS feeds (excluding ESPN and NFL due to parsing errors)
    const feeds = [
      { url: 'https://rss.cbssports.com/rss/headlines/nfl', name: 'CBS Sports NFL' },
      { url: 'https://sports.yahoo.com/nfl/rss.xml', name: 'Yahoo Sports NFL' },
    ];

    const newsItems = [];

    // Fetch and parse each RSS feed
    for (const feed of feeds) {
      try {
        console.log(`Fetching RSS feed from ${feed.name}: ${feed.url}`);
        const feedData = await parser.parseURL(feed.url);
        feedData.items.slice(0, 3).forEach((item) => {
          newsItems.push({
            title: item.title,
            link: item.link,
            timestamp: item.pubDate ? new Date(item.pubDate).toLocaleString() : 'N/A',
          });
        });
        console.log(`Successfully parsed ${feed.name} feed.`);
      } catch (error) {
        console.error(`Error fetching/parsing ${feed.name} feed (${feed.url}):`, error.message);
        continue;
      }
    }

    // Sort by timestamp (newest first) and limit to 6 items
    newsItems.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const limitedNewsItems = newsItems.slice(0, 6);

    if (limitedNewsItems.length === 0) {
      console.log('No news items fetched from any feed.');
      return res.status(200).json([]);
    }

    return res.status(200).json(limitedNewsItems);
  } catch (error) {
    console.error('Error in /api/news:', error.message);
    return res.status(500).json({ error: 'Failed to fetch news' });
  }
}
