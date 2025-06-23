//league-standings.js
'use client';

import SidebarNavigation from '../components/SidebarNavigation.tsx';
import SectionWrapper from '../components/SectionWrapper';
import NFLStandings from '../components/NFLStandings';
import FantasyStandings from '../components/FantasyStandings';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect, useRef } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// Animation variants
// ─────────────────────────────────────────────────────────────────────────────
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

export default function LeagueStandingsPage() {
  // Parallax background ref (JS‑only – no HTMLDivElement generic)
  const mainRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (mainRef.current) {
        const offset = window.scrollY * 0.2;
        mainRef.current.style.backgroundPositionY = `${offset}px`;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fade‑in observers
  const [nflRef, nflInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [fantasyRef, fantasyInView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <>

      <main
        ref={mainRef}
        role="img"
        aria-label="Panoramic NFL stadium background"
        className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-gray-800 py-12 relative overflow-hidden"
        style={{
          backgroundImage: "url('https://source.unsplash.com/random/1920x1080?stadium,nfl')",
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay for legibility */}
        <div className="absolute inset-0 bg-black/25 md:bg-black/30 pointer-events-none z-0" />

        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
          {/* ───────────────── Sidebar ───────────────── */}
          <aside className="md:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white/10 backdrop-blur-lg shadow-xl rounded-xl p-6 border border-white/20 sticky top-24"
            >
              <SidebarNavigation active="league-standings" />
            </motion.div>
          </aside>

          {/* ───────────────── Main Content ───────────────── */}
          <div className="md:col-span-3 space-y-12">
            {/* NFL League Standings */}
            <motion.div
              ref={nflRef}
              variants={sectionVariants}
              initial="hidden"
              animate={nflInView ? 'visible' : 'hidden'}
            >
              <SectionWrapper
                title="NFL League Standings"
                className="bg-white/10 backdrop-blur-lg shadow-xl rounded-xl p-8 border border-white/20 hover:shadow-[0_0_12px_4px_rgba(34,211,238,0.4)] transition-shadow duration-300"
              >
                {Array.isArray(NFLStandings?.data) ? (
                  <NFLStandings />
                ) : (
                  <p className="text-red-500">NFL Standings failed to load or are not in correct format.</p>
                )}
              </SectionWrapper>
            </motion.div>

            {/* Fantasy Football Standings */}
            <motion.div
              ref={fantasyRef}
              variants={sectionVariants}
              initial="hidden"
              animate={fantasyInView ? 'visible' : 'hidden'}
            >
              <SectionWrapper
                title="Fantasy Football Standings"
                className="bg-white/10 backdrop-blur-lg shadow-xl rounded-xl p-8 border border-white/20 hover:shadow-[0_0_12px_4px_rgba(168,85,247,0.4)] transition-shadow duration-300"
              >
                {Array.isArray(FantasyStandings?.data) ? (
                  <FantasyStandings />
                ) : (
                  <p className="text-red-500">Fantasy Standings failed to load or are not in correct format.</p>
                )}
              </SectionWrapper>
            </motion.div>
          </div>
        </div>
      </main>
    </>
  );
}
