import SectionWrapper from '@/components/SectionWrapper'

export default function InjuryReportHub() {
  return (
    <SectionWrapper title="Injury Report Hub">
      <table className="min-w-full bg-white border rounded shadow text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Player</th>
            <th className="p-2">Team</th>
            <th className="p-2">Injury</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-2">Justin Jefferson</td>
            <td className="p-2">Vikings</td>
            <td className="p-2">Hamstring</td>
            <td className="p-2">Questionable</td>
          </tr>
        </tbody>
      </table>
    </SectionWrapper>
  )
}
