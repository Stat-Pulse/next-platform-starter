'use client'
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TeamSidebar from '@/components/TeamSidebar';

import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'

const PlayerProfile = dynamic(() => import('@/components/fantasy/PlayerProfile'), {
  ssr: false,
});

export default function PlayerStatsPage() {
  const searchParams = useSearchParams()
  const playerId = searchParams.get('player_id')

  return <PlayerProfile playerId={playerId} />
}
