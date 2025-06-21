//components/player/PlayerHeader.js

import Image from 'next/image';

export default function PlayerHeader({ player }) {
  return (
    <div className="relative bg-black text-white p-6 flex flex-col md:flex-row items-start md:items-center justify-between rounded-xl shadow-lg overflow-hidden">
      {/* Background Falcon Logo */}
      <div className="absolute right-0 bottom-0 opacity-10 w-2/3 hidden md:block">
        <Image src="/team-logos/ATL.svg" alt="Team Logo" width={400} height={400} />
      </div>

      {/* Player Info */}
      <div className="z-10">
        <div className="text-green-400 uppercase text-xs mb-1">Active ●</div>
        <h1 className="text-4xl font-light leading-tight">
          {player.firstName} <span className="font-extrabold">{player.lastName}</span>
        </h1>
        <div className="flex items-center mt-2 text-lg font-medium">
          <span>{player.position}</span>
          <span className="mx-2">#{player.jersey}</span>
          <Image src={`/team-logos/${player.team}.svg`} alt={player.team} width={24} height={24} />
          <span className="ml-2">{player.teamName}</span>
        </div>
        <div className="text-sm mt-1 text-gray-300">
          {player.height} · {player.weight}lbs · {player.age}y/o
        </div>
      </div>

      {/* Stats & Headshot */}
      <div className="z-10 mt-6 md:mt-0 flex items-center space-x-4">
        <div className="hidden md:block">
          <Image
            src={player.headshotUrl}
            alt={player.fullName}
            width={100}
            height={100}
            className="rounded-full"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 text-center text-sm">
          {player.stats.map((stat, idx) => (
            <div key={idx} className="bg-gray-900 px-4 py-3 rounded-lg">
              <div className="text-gray-400 text-xs uppercase">{stat.label}</div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-gray-500 text-xs">{stat.rank}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}