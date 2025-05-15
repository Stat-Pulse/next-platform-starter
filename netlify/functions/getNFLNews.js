const Parser = require('rss-parser');
const parser = new Parser();

exports.handler = async () => {
  const feeds = [
    { name: 'ESPN', url: 'https://www.espn.com/espn/rss/nfl/news' },
    { name: 'NFL', url: 'https://www.nfl.com/rss/rsslanding?searchString=home' },
    { name: 'BleacherReport', url: 'https://bleacherreport.com/nfl.xml' },
  ];

  try {
    let allItems = [];

    for (const feed of feeds) {
      const parsed = await parser.parseURL(feed.url);
      const entries = parsed.items.map(item => ({
        source: feed.name,
        title: item.title,
        link: item.link,
        pubDate: new Date(item.pubDate || item.isoDate),
        image: item.enclosure?.url || null,
      }));
      allItems = [...allItems, ...entries];
    }

    allItems.sort((a, b) => b.pubDate - a.pubDate); // Newest first

    return {
      statusCode: 200,
      body: JSON.stringify(allItems.slice(0, 15)), // Limit to top 15
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch news', details: error.message }),
    };
  }
};
