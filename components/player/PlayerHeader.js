'use client';
import Image from 'next/image';

export default function PlayerHeader({ player }) {
  return (
    <section className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-gray-50 border rounded-xl shadow px-6 py-6">
      <Image
        src={player.headshot_url}
        alt={player.player_name}
        width={120}
        height={120}
        className="rounded-full border-2 border-gray-300 shadow-sm"
      />

      <div className="text-center sm:text-left space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold">{player.player_name}</h1>
        <p className="text-gray-600 text-sm">
          {player.position} | {player.team_abbr} | #{player.jersey_number}
        </p>

        <div className="text-sm text-gray-700 space-y-1">
          <p><strong>College:</strong> {player.college || 'N/A'}</p>
          <p>
            <strong>Drafted:</strong> {player.draft_club || 'Undrafted'} #{player.draft_number || 'N/A'} ({player.rookie_year || 'N/A'})
          </p>
          <p><strong>Experience:</strong> {player.years_exp || 'N/A'} years</p>
          <p><strong>Status:</strong> {player.status || 'N/A'}</p>
        </div>
      </div>
    </section>
  );
}
