import SectionWrapper from '@/components/SectionWrapper'

export default function ScheduleResults() {
  return (
    <SectionWrapper title="Schedule & Results">
      <div className="space-y-4">
        <div className="p-4 border rounded bg-white shadow">
          <p className="text-lg font-semibold">Week 1</p>
          <p>Chiefs vs Lions — Final: 21-27</p>
        </div>
        <div className="p-4 border rounded bg-white shadow">
          <p className="text-lg font-semibold">Week 2</p>
          <p>49ers vs Rams — Final: 30-23</p>
        </div>
      </div>
    </SectionWrapper>
  )
}
