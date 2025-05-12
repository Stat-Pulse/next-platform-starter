'use client'

import Header from '../components/Header'
import Footer from '../components/Footer'
import SidebarNavigation from '../components/SidebarNavigation'
import SectionWrapper from '../components/SectionWrapper'

export default function MediaVault() {
  return (
    <>
      <Header />
      <main className="bg-gray-100 py-10">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-6">
          <aside className="md:col-span-1">
            <SidebarNavigation active="media-vault" />
          </aside>

          <div className="md:col-span-3 space-y-12">
            <SectionWrapper title="Media Vault">
              <p className="text-gray-600">
                Watch game highlights, player interviews, podcasts, and exclusive NFL content.
              </p>
            </SectionWrapper>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
