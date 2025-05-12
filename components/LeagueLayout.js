// components/LeagueLayout.js
import SidebarNavigation from './SidebarNavigation'

export default function LeagueLayout({ current, children }) {
  return (
    <main className="bg-gray-100 py-10">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        <aside className="md:col-span-1">
          <SidebarNavigation current={current} />
        </aside>
        <div className="md:col-span-3 space-y-12">
          {children}
        </div>
      </div>
    </main>
  )
}
