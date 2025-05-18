import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'

// Map of opponent IDs to team names - populate this with your team data
const TEAM_MAP = {
  0: "Unknown Team",
  // Add other teams as you get their data
  "KC": "Kansas City Chiefs",
  "BAL": "Baltimore Ravens",
  "SF": "San Francisco 49ers",
  // Add more teams here
};

export default function TeamPage() {
  const router = useRouter();
  const { id } = router.query;
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!router.isReady || !id) return;
    
    console.log(`Fetching team data for: ${id}`);
    
    fetch(`/api/team/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data.error) throw new Error(data.error);
        console.log('Team data loaded:', data);
        setTeamData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading team data:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [router.isReady, id]);

  if (loading) return <div className="p-6 text-center">Loading team data...</div>;
  if (error || !teamData) return <div className="p-6 text-center text-red-500">Error: {error || "Failed to load team data"}</div>;

  const {
    name,
    roster = [],
    depthChart = {},
    schedule = [],
    stats = {},
    branding = {},
    recentNews = [],
    division = "Unknown",
    conference = "Unknown"
  } = teamData;

  // Format date function
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    } catch (e) {
      return 'Invalid Date';
    }
  };

  // Get opponent name based on ID
  const getOpponentName = (opponentId) => {
    return TEAM_MAP[opponentId] || `Team ID: ${opponentId}`;
  };

  // Calculate team record
  const calculateRecord = () => {
    if (!schedule || schedule.length === 0) return "0-0";
    
    const wins = schedule.filter(game => game.result === "W").length;
    const losses = schedule.filter(game => game.result === "L").length;
    const ties = schedule.filter(game => game.result === "T").length;
    
    return ties > 0 ? `${wins}-${losses}-${ties}` : `${wins}-${losses}`;
  };

  return (
    <>
      <Head>
        <title>{name} - StatPulse</title>
        <meta name="description" content={`Latest stats and information for the ${name}`} />
      </Head>
      
      <div className="max-w-6xl mx-auto p-6">
        {/* Header with Team Info */}
        <div 
          className="flex items-center gap-6 mb-8 border-b pb-4 rounded-lg" 
          style={{ borderColor: branding?.colorPrimary || '#ccc' }}
        >
          {branding?.logo && (
            <div className="flex-shrink-0">
              <Image 
                src={branding.logo || '/placeholder.png'} 
                alt={name} 
                width={120} 
                height={120} 
                className="rounded shadow"
              />
            </div>
          )}
          
          <div className="flex-grow">
            <h1 className="text-3xl font-bold" style={{ color: branding?.colorPrimary }}>
              {name}
            </h1>
            <p className="text-gray-600">{conference} | {division} Division</p>
            <p className="text-lg font-semibold mt-1">
              Record: {calculateRecord()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="md:col-span-2 space-y-8">
            {/* Latest News */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-xl font-semibold mb-4" style={{ color: branding?.colorPrimary }}>
                Latest News
              </h2>
              
              {recentNews && recentNews.length > 0 ? (
                <div className="space-y-3">
                  {recentNews.map((news, i) => (
                    <div key={i} className="border-l-4 pl-3 py-2" style={{ borderColor: branding?.colorSecondary || '#ccc' }}>
                      <p className="font-semibold">{news.title}</p>
                      <p className="text-xs text-gray-500">{formatDate(news.date)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No recent news available.</p>
              )}
            </div>

            {/* Full Schedule */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-xl font-semibold mb-4" style={{ color: branding?.colorPrimary }}>
                Game Schedule
              </h2>
              
              {schedule && schedule.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm table-auto border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border p-2">Week</th>
                        <th className="border p-2">Opponent</th>
                        <th className="border p-2">Date</th>
                        <th className="border p-2">H/A</th>
                        <th className="border p-2">Score</th>
                        <th className="border p-2">Result</th>
                      </tr>
                    </thead>
                    <tbody>
                      {schedule.map((game, i) => (
                        <tr key={i} className={game.result === "W" ? "bg-green-50" : game.result === "L" ? "bg-red-50" : ""}>
                          <td className="border p-2 text-center">{game.week}</td>
                          <td className="border p-2">{getOpponentName(game.opponent)}</td>
                          <td className="border p-2">{formatDate(game.date)}</td>
                          <td className="border p-2 text-center">{game.homeAway}</td>
                          <td className="border p-2 text-center font-mono">{game.score || "TBD"}</td>
                          <td className="border p-2 text-center font-semibold"
                              style={{ 
                                color: game.result === "W" ? "green" : 
                                       game.result === "L" ? "red" : "inherit" 
                              }}>
                            {game.result || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 italic">No schedule available.</p>
              )}
            </div>

            {/* Stats */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-xl font-semibold mb-4" style={{ color: branding?.colorPrimary }}>
                Team Stats (2024)
              </h2>
              
              {Object.keys(stats || {}).length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="p-3 bg-gray-50 rounded">
                    <div className="text-xs text-gray-500">Points Allowed</div>
                    <div className="text-xl font-bold">{stats.pointsAllowed || "-"}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <div className="text-xs text-gray-500">Total Yards</div>
                    <div className="text-xl font-bold">{stats.totalYardsAllowed || "-"}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <div className="text-xs text-gray-500">Pass Yards</div>
                    <div className="text-xl font-bold">{stats.passYardsAllowed || "-"}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <div className="text-xs text-gray-500">Rush Yards</div>
                    <div className="text-xl font-bold">{stats.rushYardsAllowed || "-"}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <div className="text-xs text-gray-500">Sacks</div>
                    <div className="text-xl font-bold">{stats.sacks || "-"}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <div className="text-xs text-gray-500">Turnovers</div>
                    <div className="text-xl font-bold">{stats.turnovers || "-"}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <div className="text-xs text-gray-500">Red Zone %</div>
                    <div className="text-xl font-bold">{stats.redZonePct || "-"}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <div className="text-xs text-gray-500">3rd Down %</div>
                    <div className="text-xl font-bold">{stats.thirdDownPct || "-"}</div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 italic">No stats available for this season.</p>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Depth Chart */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-xl font-semibold mb-4" style={{ color: branding?.colorPrimary }}>
                Depth Chart
              </h2>
              
              {depthChart && Object.keys(depthChart).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(depthChart).map(([position, players]) => (
                    <div key={position} className="border-b pb-2">
                      <h3 className="text-lg font-bold">{position}</h3>
                      <ol className="ml-4 space-y-1">
                        {players.map((p, i) => (
                          <li key={i} className="flex justify-between">
                            <span className="font-medium">{p.name}</span>
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                              Depth: {p.depth}
                            </span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">Depth chart not available.</p>
              )}
            </div>

            {/* Roster */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-xl font-semibold mb-4" style={{ color: branding?.colorPrimary }}>
                Team Roster
              </h2>
              
              {roster && roster.length > 0 ? (
                <div className="space-y-2">
                  {roster.map((player, i) => (
                    <div key={player.id || i} className="flex justify-between items-center border-b pb-2">
                      <div>
                        <div className="font-medium">{player.name}</div>
                        <div className="text-xs text-gray-500">
                          {player.years_exp > 0 ? `${player.years_exp} years exp` : "Rookie"}
                        </div>
                      </div>
                      <div className="bg-gray-100 px-3 py-1 rounded text-sm font-bold">
                        {player.position}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">Roster information not available.</p>
              )}
            </div>

            {/* Coming Soon Sections */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-xl font-semibold mb-2 text-red-600">Injuries</h2>
              <p className="text-gray-500 italic">Injury data coming soon...</p>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-xl font-semibold mb-2" style={{ color: branding?.colorSecondary }}>
                Recent Transactions
              </h2>
              <p className="text-gray-500 italic">Transaction log coming soon...</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
