// File: pages/api/draftReview.js

import path from 'path';
import { promises as fs } from 'fs';

export default async function handler(req, res) {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'draftReview.json');
    const fileContents = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContents);
    res.status(200).json(data);
  } catch (error) {
    console.error('Error reading draft review data:', error);
    res.status(500).json({ message: 'Failed to load draft review data.' });
  }
} 


// File: pages/draft-review.js

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TeamSidebar from '@/components/TeamSidebar';

export default function DraftReviewPage() {
  const [draftData, setDraftData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/draftReview')
      .then(res => res.json())
      .then(data => {
        setDraftData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load draft data:', err);
        setError('Unable to fetch draft review.');
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800">
      <Header />
      <main className="container mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <TeamSidebar active="Draft Review" />

        <div className="md:col-span-3">
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Draft Review - Thunder Cats</h2>

            {loading && <p>Loading draft data...</p>}
            {error && <p className="text-red-600">{error}</p>}

            {draftData && (
              <>
                <div className="mb-4">
                  <p className="text-lg font-medium">
                    Overall Draft Grade: <span className="text-red-600">{draftData.overallGrade}</span>
                  </p>
                  <p className="text-gray-600">Analysis: {draftData.analysis}</p>
                </div>

                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2">Round</th>
                      <th className="px-4 py-2">Player</th>
                      <th className="px-4 py-2">Position</th>
                      <th className="px-4 py-2">Team</th>
                      <th className="px-4 py-2">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {draftData.picks.map((pick, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2">{pick.round}</td>
                        <td className="px-4 py-2">{pick.player}</td>
                        <td className="px-4 py-2">{pick.position}</td>
                        <td className="px-4 py-2">{pick.team}</td>
                        <td className="px-4 py-2 text-red-600">{pick.grade}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <p className="mt-4 text-gray-600">Pick Commentary: {draftData.commentary}</p>
              </>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
