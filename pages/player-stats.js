'use client'

import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'

const PlayerStatsClient = dynamic(
  () => import('../components/fantasy/PlayerStatsClient'),
  { ssr: false }
)

export default function PlayerStatsPage() {
  const searchParams = useSearchParams()
  const playerId = searchParams.get('player_id')

  return <PlayerStatsClient playerId={playerId} />
}
