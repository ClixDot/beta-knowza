import React from 'react';
import { motion } from 'framer-motion';
import { Container } from './Container';
import { SectionLabel } from './SectionLabel';
import { Button } from './Button';

export const CTASection: React.FC = () => {
  return (
    <div className="px-3 sm:px-5 md:px-7 lg:px-8 py-10 md:py-16">
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative bg-[#79864B] text-white py-14 sm:py-20 lg:py-28 px-4 sm:px-8 overflow-hidden rounded-[28px] sm:rounded-[40px] md:rounded-[48px] shadow-2xl border border-[#8C9A5C]/40"
      >
        {/* Subtle organic texture in background */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay bg-cover bg-center"
          style={{ backgroundImage: `url('/images/brand/forest-texture.png')` }}
        />

        {/* Decorative brand stroke watermark */}
        <div className="absolute -right-20 -bottom-20 w-96 h-96 opacity-10 pointer-events-none">
          <img 
            src="/images/logo/knowza-mark-light.png" 
            alt="" 
            className="w-full h-full object-contain filter invert" 
          />
        </div>

        <Container className="relative z-10 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <SectionLabel light className="justify-center mb-6">
              AN INVITATION
            </SectionLabel>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-normal tracking-tight text-white mb-4 sm:mb-6 leading-tight uppercase break-words"
          >
            Come Closer to the Experience.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-sm sm:text-base md:text-lg text-white/90 font-light max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed"
          >
            Discover places where nature, culture, and human connection come together. Step away from the noise and return to what is essential.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-xs sm:max-w-none mx-auto"
          >
            <Button to="/contact" variant="white-fill" withArrow className="w-full sm:w-auto">
              Explore Knowza
            </Button>
            <Button to="/gallery" variant="white" className="w-full sm:w-auto">
              View Sanctuary Moments
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-10 sm:mt-16 pt-6 sm:pt-8 border-t border-white/20 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs uppercase tracking-widest text-[#EEE9BF]"
          >
            <span>Nature</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#EEE9BF]" />
            <span>Culture</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#EEE9BF]" />
            <span>Connection</span>
          </motion.div>
        </Container>
      </motion.section>
    </div>
  );
};
