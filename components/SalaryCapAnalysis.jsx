'use client'

import Link from 'next/link'

export default function SalaryCapAnalysis() {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">
        <Link href="/analytics-lab" className="text-red-600 hover:underline">
          Salary Cap Analysis
        </Link>
      </h2>
      <p className="text-gray-600 mb-4">
        Bengals’ cap strategy for 2025 and key contract structures under new front office.
      </p>
      <p className="text-sm text-gray-500">May 7, 2025</p>
    </div>
  )
}
