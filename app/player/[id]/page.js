// app/player/[id]/page.js

import Image from 'next/image'

export default function PlayerPage({ params }) {
  const playerId = params.id;

  // Example — replace with your actual fetched data
  const player = {
    name: "A.J. Brown",
    position: "WR",
    team: "PHI",
    jersey: 11,
    headshot: "/images/headshots/aj_brown.png", // or real URL
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 px-4 py-8">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Player Headshot */}
        <div className="md:col-span-1 flex justify-center">
          <Image
            src={player.headshot}
            alt={player.name}
            width={250}
            height={250}
            className="rounded-xl shadow-md object-cover"
          />
        </div>

        {/* Player Info + Stats */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{player.name}</h1>
            <p className="text-lg text-gray-600">
              {player.position} | {player.team} | #{player.jersey}
            </p>
          </div>

          {/* Inject your stats, metrics, and sections here */}
          <div className="space-y-4">
            {/* Example Section */}
            <div>
              <h2 className="text-xl font-semibold border-b pb-1 mb-2">Game Logs</h2>
              {/* Render game log table here */}
            </div>

            <div>
              <h2 className="text-xl font-semibold border-b pb-1 mb-2">Career Stats</h2>
              {/* Render career stats */}
            </div>

            <div>
              <h2 className="text-xl font-semibold border-b pb-1 mb-2">Receiving Metrics</h2>
              {/* Render metrics */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
