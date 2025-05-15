const Parser = require('rss-parser');
const parser = new Parser();

exports.handler = async () => {
  const feeds = [
    { name: 'ESPN', url: 'https://www.espn.com/espn/rss/nfl/news' },
    { name: 'NFL', url: 'https://www.nfl.com/rss/rsslanding?searchString=home' },
    { name: 'CBS Sports', url: 'https://www.cbssports.com/rss/nfl' },
  ];

  try {
    let allItems = [];

    for (const feed of feeds) {
      try {
        const parsed = await parser.parseURL(feed.url);
        const entries = parsed.items
          .filter(item => item.title && item.link)
          .map(item => ({
            source: feed.name,
            title: item.title,
            link: item.link,
            pubDate: new Date(item.pubDate || item.isoDate || Date.now()),
            image: item.enclosure?.url || item.image?.url || null,
          }));
        allItems = [...allItems, ...entries];
      } catch (feedError) {
        console.error(`Failed to parse feed ${feed.name}:`, feedError.message);
      }
    }

    if (allItems.length === 0) {
      throw new Error('No valid news items retrieved from any feed');
    }

    allItems.sort((a, b) => b.pubDate - a.pubDate);

    return {
      statusCode: 200,
      body: JSON.stringify(allItems.slice(0, 15)),
    };
  } catch (error) {
    console.error('Function error:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch news', details: error.message }),
    };
  }
};
