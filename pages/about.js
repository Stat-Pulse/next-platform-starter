//pages/about.js
import Header from '../components/Header';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect, useRef } from 'react';

// Section animation variants
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

// Text animation for staggered reveal
const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function About() {
  // Intersection observer for each section
  const [introRef, introInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [missionRef, missionInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [teamRef, teamInView] = useInView({ triggerOnce: true, threshold: 0.2 });

  // Parallax effect for background
  const mainRef = useRef(null);
  useEffect(() => {
    const handleScroll = () => {
      if (mainRef.current) {
        const offset = window.scrollY * 0.3;
        mainRef.current.style.backgroundPositionY = `${offset}px`;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black-900 text-white font-sans overflow-hidden">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main
        ref={mainRef}
        className="flex-grow container mx-auto px-6 py-12 relative"
        style={{
          backgroundImage: "url('https://source.unsplash.com/random/1920x1080/?futuristic')",
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-black/50 pointer-events-none"></div>

        <motion.h1
          className="text-5xl sm:text-7xl font-extrabold tracking-tight text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-12 relative z-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          About StatPulse
        </motion.h1>

        {/* Intro Section */}
        <motion.section
          ref={introRef}
          variants={sectionVariants}
          initial="hidden"
          animate={introInView ? 'visible' : 'hidden'}
          className="bg-white/10 backdrop-blur-lg shadow-xl rounded-xl p-8 mb-12 border border-white/20 hover:shadow-cyan-500/20 transition-shadow duration-300 relative z-10"
        >
          <motion.h2
            className="text-3xl sm:text-4xl font-bold text-cyan-300 mb-6"
            variants={textVariants}
          >
            About Us: StatPulse
          </motion.h2>
          {[
            'Welcome to StatPulse, your ultimate destination for cutting-edge sports analytics and immersive insights. We transcend traditional stats, offering fans, fantasy players, and data enthusiasts a dynamic platform to experience sports like never before.',
            'From real-time schedules and advanced player metrics to in-depth depth charts and predictive models, StatPulse delivers unparalleled data precision. Explore our curated articles, cinematic videos, and exclusive podcasts crafted by industry experts.',
            'Join a vibrant community driven by a passion for sports intelligence. Unlock premium features like AI-driven salary cap analysis and next-gen betting odds to gain a competitive edge.',
            'Whether you’re strategizing for fantasy dominance or craving a deeper connection to the game, StatPulse is your gateway to the future of sports analytics.',
          ].map((text, index) => (
            <motion.p
              key={index}
              className="text-gray-200 mb-4 leading-relaxed"
              variants={textVariants}
              transition={{ delay: index * 0.1 }}
            >
              {text}
            </motion.p>
          ))}
        </motion.section>

        {/* Mission Section */}
        <motion.section
          ref={missionRef}
          variants={sectionVariants}
          initial="hidden"
          animate={missionInView ? 'visible' : 'hidden'}
          className="bg-white/10 backdrop-blur-lg shadow-xl rounded-xl p-8 mb-12 border border-white/20 hover:shadow-purple-500/20 transition-shadow duration-300 relative z-10"
        >
          <motion.h2
            className="text-3xl sm:text-4xl font-bold text-purple-300 mb-6"
            variants={textVariants}
          >
            Our Mission
          </motion.h2>
          {[
            'StatPulse redefines NFL quarterback analytics, empowering fantasy players, bettors, and fans with real-time, actionable insights. Our platform is designed to make every decision smarter, from draft day to game day.',
            'We’re pioneering the future of sports data, with plans to expand across all NFL positions, major sports, and integrate AI-powered predictive tools. At StatPulse, we deliver precision, innovation, and an unrivaled user experience.',
          ].map((text, index) => (
            <motion.p
              key={index}
              className="text-gray-200 mb-4 leading-relaxed"
              variants={textVariants}
              transition={{ delay: index * 0.1 }}
            >
              {text}
            </motion.p>
          ))}
        </motion.section>

        {/* Team Section */}
        <motion.section
          ref={teamRef}
          variants={sectionVariants}
          initial="hidden"
          animate={teamInView ? 'visible' : 'hidden'}
          className="bg-white/10 backdrop-blur-lg shadow-xl rounded-xl p-8 border border-white/20 hover:shadow-cyan-500/20 transition-shadow duration-300 relative z-10"
        >
          <motion.h2
            className="text-3xl sm:text-4xl font-bold text-cyan-300 mb-6"
            variants={textVariants}
          >
            Our Team
          </motion.h2>
          {[
            'We’re a collective of sports fanatics, data wizards, and tech innovators united by a mission to revolutionize sports analytics.',
            <span key="contact">
              Got ideas or feedback? Connect with us at{' '}
              <a
                href="mailto:support@statpulse.com"
                className="text-cyan-400 hover:text-cyan-200 transition-colors duration-200"
              >
                support@statpulse.com
              </a>
              . Follow our journey on{' '}
              <a
                href="https://twitter.com/StatPulseNFL"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-200 transition-colors duration-200"
              >
                X
              </a>{' '}
              for the latest updates!
            </span>,
          ].map((text, index) => (
            <motion.p
              key={index}
              className="text-gray-200 mb-4 leading-relaxed"
              variants={textVariants}
              transition={{ delay: index * 0.1 }}
            >
              {text}
            </motion.p>
          ))}
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900/50 backdrop-blur-md relative z-10">
        <Footer />
      </footer>
    </div>
  );
}
