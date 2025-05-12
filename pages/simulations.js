'use client'

import Header from '../components/Header'
import Footer from '../components/Footer'
import SidebarNavigation from '../components/SidebarNavigation'
import SectionWrapper from '../components/SectionWrapper'

export default function Simulations() {
  return (
    <>
      <Header />
      <main className="bg-gray-100 py-10">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-6">
          <aside className="md:col-span-1">
            <SidebarNavigation active="simulations" />
          </aside>

          <div className="md:col-span-3 space-y-12">
            <SectionWrapper title="Simulations">
              <p className="text-gray-600">
                Run predictive models and explore simulated game outcomes, playoff scenarios, and statistical projections.
              </p>
            </SectionWrapper>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
