const Parser = require('rss-parser');
const parser = new Parser();

exports.handler = async (event) => {
  const teamQuery = event.queryStringParameters?.team?.toLowerCase() || null;
  const playerQuery = event.queryStringParameters?.player?.toLowerCase() || null;
  const playerAliases = {
    mahomes: ['patrick mahomes', 'mahomes'],
    kelce: ['travis kelce', 'kelce'],
    allen: ['josh allen', 'allen'],
    // Add more aliases as needed
  };

  const getPlayerTerms = (query) => {
    if (!query) return [];
    const aliases = playerAliases[query] || [];
    return [query, ...aliases];
  };

  const playerTerms = getPlayerTerms(playerQuery);
  const feeds = [
    { name: 'ESPN', url: 'https://www.espn.com/espn/rss/nfl/news' },
    { name: 'Sporting News', url: 'https://www.sportingnews.com/us/nfl/rss' }, // Add this
    { name: 'CBS Sports', url: 'https://www.cbssports.com/rss/nfl' },
    { name: 'Yahoo Sports', url: 'https://sports.yahoo.com/nfl/rss.xml' },
    { name: 'NBC Sports (PFT)', url: 'https://profootballtalk.nbcsports.com/feed/' },
    { name: 'USA Today', url: 'https://rssfeeds.usatoday.com/usatodaycomnfl-headlines' },
    { name: 'Sports Illustrated', url: 'https://www.si.com/rss/si_nfl.rss' },
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
            description: item.contentSnippet || '',
            pubDate: new Date(item.pubDate || item.isoDate || Date.now()),
            image: item.enclosure?.url || item.image?.url || null,
          }))
          .filter(entry => {
            const title = entry.title.toLowerCase();
            const desc = entry.description.toLowerCase();
            if (playerTerms.length > 0 && playerTerms.some(term => title.includes(term) || desc.includes(term))) {
              return true;
            }
            if (teamQuery && (title.includes(teamQuery) || desc.includes(teamQuery))) {
              return true;
            }
            return !playerTerms.length && !teamQuery; // Allow all if no filters
          })
          // Optionally, if you want to remove description before returning, you can map here
          .map(({description, ...rest}) => rest);
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
