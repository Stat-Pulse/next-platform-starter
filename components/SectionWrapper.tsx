// components/SectionWrapper.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface SectionWrapperProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({ title, children, className = '' }) => {
  return (
    <motion.section
      className={`mb-12 ${className}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {title && (
        <motion.h2
          className="text-3xl sm:text-4xl font-bold text-white text-center mb-6 drop-shadow-lg"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {title}
        </motion.h2>
      )}
      {children}
    </motion.section>
  );
};

export default SectionWrapper;
