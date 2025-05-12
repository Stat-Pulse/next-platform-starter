import Header from '../components/Header'
import Footer from '../components/Footer'

export default function ScheduleResults() {
  return (
    <>
      <Header />
      <main className="bg-gray-100 py-10">
        <div className="container mx-auto px-6 space-y-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Schedule & Results</h1>

          <div className="bg-white p-4 rounded shadow overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2">Date</th>
                  <th className="p-2">Matchup</th>
                  <th className="p-2">Result</th>
                  <th className="p-2">TV</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2">May 10</td>
                  <td className="p-2">Cowboys vs Giants</td>
                  <td className="p-2 text-green-600">W 27-20</td>
                  <td className="p-2">NBC</td>
                </tr>
                <tr>
                  <td className="p-2">May 15</td>
                  <td className="p-2">Bengals vs Chiefs</td>
                  <td className="p-2 text-gray-500">Scheduled</td>
                  <td className="p-2">FOX</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
