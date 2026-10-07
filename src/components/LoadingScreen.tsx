import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  isInitialLoading?: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  isInitialLoading = false,
}) => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <AnimatePresence>
      {isInitialLoading && (
        <motion.div
          key="knowza-loader-backdrop"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
          className={`fixed inset-0 z-40 flex flex-col items-center justify-center pointer-events-none select-none transition-colors duration-500 ${
            isHome ? 'bg-knowza-deep' : 'bg-[#EEEAC0]'
          }`}
          aria-hidden="true"
        >
          {/* Subtle soft ambient aura */}
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-[90px] ${
              isHome ? 'bg-knowza-olive/15' : 'bg-[#8A7D4C]/15'
            }`}
          />

          {/* Simple Minimal Loading Track below the centered logo */}
          <div className="relative z-10 mt-28 sm:mt-32 flex flex-col items-center gap-2">
            <div
              className={`w-36 sm:w-44 h-[2px] rounded-full overflow-hidden ${
                isHome ? 'bg-white/15' : 'bg-black/15'
              }`}
            >
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{
                  duration: 1.05,
                  ease: [0.25, 1, 0.4, 1],
                }}
                className={`h-full rounded-full ${
                  isHome
                    ? 'bg-gradient-to-r from-knowza-bronze via-knowza-cream to-white shadow-[0_0_8px_rgba(244,240,213,0.4)]'
                    : 'bg-gradient-to-r from-[#8A7D4C] via-[#79864B] to-knowza-deep shadow-[0_0_8px_rgba(121,134,75,0.3)]'
                }`}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
