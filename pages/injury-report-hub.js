import Header from '../components/Header'
import Footer from '../components/Footer'

export default function InjuryReportHub() {
  return (
    <>
      <Header />
      <main className="bg-gray-100 py-10">
        <div className="container mx-auto px-6 space-y-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Injury Report Hub</h1>

          <section className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Filter Injuries</h2>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <select className="p-2 border rounded">
                <option>All Teams</option>
              </select>
              <select className="p-2 border rounded">
                <option>All Positions</option>
              </select>
              <select className="p-2 border rounded">
                <option>Status</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2">Player</th>
                    <th className="p-2">Team</th>
                    <th className="p-2">Injury</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Return</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2">Joe Burrow</td>
                    <td className="p-2">Bengals</td>
                    <td className="p-2">Wrist</td>
                    <td className="p-2 text-yellow-600">Questionable</td>
                    <td className="p-2">Week 6</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
