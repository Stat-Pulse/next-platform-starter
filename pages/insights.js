'use client'

import { useEffect, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import PlayerSelect from '../components/PlayerSelect'
import PlayerCard from '../components/PlayerCard'
import GameLogTable from '../components/GameLogTable'
import FantasyChart from '../components/FantasyChart'

export default function Insights() {
  const [playerData, setPlayerData] = useState(null)
  const [selectedPlayer, setSelectedPlayer] = useState('Joe Burrow')
  const [view, setView] = useState('fantasy')

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/data/player-insights.json')
        const players = await res.json()
        const player = players.find(p => p.name === selectedPlayer)
        setPlayerData(player)
      } catch (e) {
        console.error(e)
        setPlayerData(null)
      }
    }

    loadData()
  }, [selectedPlayer])

  return (
    <>
      <Header />
      <main className="bg-gray-100 py-10">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Player Insights</h2>

          <PlayerSelect
            selectedPlayer={selectedPlayer}
            setSelectedPlayer={setSelectedPlayer}
            view={view}
            setView={setView}
          />

          {playerData && (
            <>
              <PlayerCard player={playerData} />
              <GameLogTable games={playerData.recentGames} />
              <FantasyChart data={playerData.fantasy.pointsHistory} />
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
