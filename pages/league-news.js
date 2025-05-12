import SectionWrapper from '@/components/SectionWrapper'

export default function LeagueNews() {
  return (
    <SectionWrapper title="League News">
      <ul className="list-disc pl-6 text-gray-700">
        <li>Breaking: Star QB signs contract extension</li>
        <li>Trade alert: WR moves to AFC East contender</li>
        <li>Injury update: Top RB questionable for Week 4</li>
      </ul>
    </SectionWrapper>
  )
}
