import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { HiArrowUp } from 'react-icons/hi';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * Programmatically scrolls window to top.
 * Supports 'smooth' or 'instant' behavior.
 */
export const scrollToTop = (behavior = 'smooth') => {
  if (typeof window !== 'undefined') {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior,
    });
  }
};

/**
 * ScrollToTop Component:
 * 1. Automatically scrolls to (0, 0) upon any route/search/hash navigation change.
 * 2. Renders a smooth floating 'Back to Top' button when user scrolls down past 280px.
 */
export default function ScrollToTop() {
  const { pathname, search } = useLocation();
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  // Instantly reset scroll to top on every route/search change
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });
  }, [pathname, search]);

  // Monitor scroll height for floating back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 280) {
        setShowScrollBtn(true);
      } else {
        setShowScrollBtn(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {showScrollBtn && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 16 }}
          transition={{ duration: 0.2 }}
          onClick={() => scrollToTop('smooth')}
          className="fixed bottom-24 right-6 z-40 p-3.5 rounded-2xl bg-gradient-to-r from-[#881337] via-[#C2410C] to-[#D97706] hover:from-[#9F1239] hover:via-[#EA580C] hover:to-[#F59E0B] text-white shadow-xl shadow-amber-900/20 border border-amber-300/40 backdrop-blur-md transition-all flex items-center justify-center group cursor-pointer"
          aria-label="Back to top"
          title="Scroll to top of page"
        >
          <HiArrowUp className="text-lg group-hover:-translate-y-0.5 transition-transform" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
