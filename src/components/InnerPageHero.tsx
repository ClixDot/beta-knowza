import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Container } from './Container';

interface InnerPageHeroProps {
  watermarkTop?: string;
  watermarkBottom?: string;
  watermarkRepeat?: string;
  eyebrow?: string;
  titleLine1: string;
  titleHighlight: string;
  titleLine2?: string;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
}

export const InnerPageHero: React.FC<InnerPageHeroProps> = ({
  watermarkTop,
  watermarkBottom,
  watermarkRepeat,
  eyebrow,
  titleLine1,
  titleHighlight,
  titleLine2,
  subtitle,
  children,
  className = '',
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const line1X = useTransform(scrollYProgress, [0, 1], ['5%', '-15%']);
  const line2X = useTransform(scrollYProgress, [0, 1], ['-15%', '5%']);
  const line3X = useTransform(scrollYProgress, [0, 1], ['2%', '-12%']);

  const repeatWord = watermarkRepeat || watermarkTop;
  const repeatString = repeatWord
    ? `${repeatWord} \u00A0\u00B7\u00A0 ${repeatWord} \u00A0\u00B7\u00A0 ${repeatWord} \u00A0\u00B7\u00A0 ${repeatWord} \u00A0\u00B7\u00A0 ${repeatWord} \u00A0\u00B7\u00A0 ${repeatWord}`
    : '';

  return (
    <section
      ref={sectionRef}
      className={`relative pt-28 sm:pt-36 md:pt-44 pb-12 sm:pb-16 md:pb-20 overflow-hidden border-b border-black/5 bg-[#EDEABF] text-knowza-dark ${className}`}
    >
      {/* ========================================================
          REPEATING SCROLL PARALLAX WATERMARK (EXACTLY 2 LINES)
          ======================================================== */}
      {repeatWord && (
        <div className="absolute inset-0 flex flex-col justify-between py-6 sm:py-10 pointer-events-none select-none overflow-hidden opacity-[0.065] z-0">
          <motion.div
            style={{ x: line1X }}
            className="font-display font-black italic tracking-tighter uppercase text-knowza-dark text-[18vw] sm:text-[16vw] leading-[0.8] whitespace-nowrap will-change-transform"
          >
            {repeatString}
          </motion.div>
          <motion.div
            style={{ x: line2X }}
            className="font-display font-black italic tracking-tighter uppercase text-knowza-dark text-[18vw] sm:text-[16vw] leading-[0.8] whitespace-nowrap will-change-transform"
          >
            {repeatString}
          </motion.div>
        </div>
      )}

      {/* Subtle Ambient Radial Lighting Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#79864B]/10 blur-[140px] pointer-events-none"
        aria-hidden="true"
      />

      <Container className="relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Optional Eyebrow Label with Play / Accent Symbol */}
          {eyebrow && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center justify-center gap-2 mb-4 sm:mb-6"
            >
              <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-sans uppercase tracking-[0.25em] text-[#79864B] font-semibold">
                <span className="inline-block text-[11px] font-mono select-none">▷</span>
                <span>{eyebrow}</span>
              </span>
            </motion.div>
          )}

          {/* Central Architectural Display Title */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-display font-black italic uppercase text-[44px] xs:text-[54px] sm:text-7xl md:text-8xl lg:text-[104px] xl:text-[116px] tracking-tight leading-[0.92] sm:leading-[0.88] select-none break-words flex flex-col items-center text-center px-2"
          >
            <span className="text-knowza-dark block">
              {titleLine1}
            </span>
            <span className="text-[#79864B] block">
              {titleHighlight}
            </span>
            {titleLine2 && (
              <span className="text-knowza-dark block">
                {titleLine2}
              </span>
            )}
          </motion.h1>

          {/* Centered Subtitle Paragraph */}
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 sm:mt-8 max-w-xl sm:max-w-2xl mx-auto text-center text-sm sm:text-base font-sans text-knowza-dark/70 font-light leading-relaxed"
            >
              {subtitle}
            </motion.p>
          )}

          {/* Optional Children Components */}
          {children && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 sm:mt-10"
            >
              {children}
            </motion.div>
          )}
        </div>
      </Container>
    </section>
  );
};
