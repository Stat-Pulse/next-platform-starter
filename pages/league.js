import Link from 'next/link'
import SectionWrapper from '@/components/SectionWrapper'

export default function LeaguePage() {
  return (
    <SectionWrapper title="League Overview">
      <div className="space-y-6">
        <div className="p-4 bg-white rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Stat Tracker</h2>
          <p className="mb-2">View the top players by position, team, or stat category.</p>
          <Link href="/stat-tracker" className="text-red-600 hover:underline">
            Go to Stat Tracker →
          </Link>
        </div>

        <div className="p-4 bg-white rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Betting Book</h2>
          <p className="mb-2">See lines, movement, and upcoming odds.</p>
          <Link href="/betting-book" className="text-red-600 hover:underline">
            Go to Betting Book →
          </Link>
        </div>

        <div className="p-4 bg-white rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Media Vault</h2>
          <p className="mb-2">Watch game highlights, breakdowns, and original content.</p>
          <Link href="/media-vault" className="text-red-600 hover:underline">
            Go to Media Vault →
          </Link>
        </div>
      </div>
    </SectionWrapper>
  )
}
