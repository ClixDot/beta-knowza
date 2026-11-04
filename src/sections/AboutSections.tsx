import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, ArrowRight, Sparkles, Crosshair, X } from 'lucide-react';
import { Container } from '../components/Container';
import { SectionLabel } from '../components/SectionLabel';
import { Counter } from '../components/Counter';
import { TypewriterHeading } from '../components/TypewriterHeading';
import { CmsButton } from '../components/cms/CmsLink';
import { CmsIcon } from '../components/cms/icons';
import { imageStyle } from '../cms/utils';

gsap.registerPlugin(ScrollTrigger);

interface WaveParagraphProps {
  text: string;
  className?: string;
  delay?: number;
  dropCap?: string;
}

const WaveParagraph: React.FC<WaveParagraphProps> = ({
  text,
  className = '',
  delay = 0,
  dropCap,
}) => {
  const words = text.split(' ');
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <motion.p
      initial={prefersReduced ? 'visible' : 'hidden'}
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      className={`leading-relaxed ${className}`}
    >
      {dropCap && (
        <motion.span
          variants={{
            hidden: { opacity: 0, y: prefersReduced ? 0 : 20, scale: 0.92 },
            visible: {
              opacity: 1,
              y: 0,
              scale: 1,
              transition: prefersReduced
                ? { duration: 0 }
                : {
                  type: 'spring',
                  damping: 16,
                  stiffness: 120,
                  delay: delay,
                },
            },
          }}
          className="float-left text-4xl sm:text-5xl font-serif leading-none pr-1.5 pt-0.5 text-[#79864B] font-normal select-none"
        >
          {dropCap}
        </motion.span>
      )}
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: {
              opacity: 0,
              y: prefersReduced ? 0 : 16,
            },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                y: prefersReduced
                  ? { duration: 0 }
                  : {
                    type: 'spring',
                    damping: 14,
                    stiffness: 120,
                    mass: 0.5,
                    delay: delay + i * 0.016,
                  },
                opacity: {
                  duration: prefersReduced ? 0 : 0.4,
                  delay: delay + i * 0.016,
                  ease: 'easeOut',
                },
              },
            },
          }}
          className="inline-block mr-[0.28em] will-change-transform"
        >
          {word}
        </motion.span>
      ))}
    </motion.p>
  );
};

export const SanctuaryBannerSection: React.FC<{ content: any }> = ({ content }) => {
  const heroBannerRef = useRef<HTMLDivElement>(null);
  const heroImgRef = useRef<HTMLImageElement>(null);
  const heroBadgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ScrollTrigger.refresh();
    const ctx = gsap.context(() => {
      if (heroBannerRef.current && heroImgRef.current) {
        // Subtle container expand on scroll
        gsap.fromTo(
          heroBannerRef.current,
          { scale: 0.98, borderRadius: '32px' },
          {
            scale: 1,
            borderRadius: '24px',
            ease: 'none',
            scrollTrigger: {
              trigger: heroBannerRef.current,
              start: 'top 90%',
              end: 'top 35%',
              scrub: 1.2,
            },
          }
        );

        // Rich image depth parallax (drifts within the overflow-hidden mask)
        gsap.fromTo(
          heroImgRef.current,
          { yPercent: -10, scale: 1.14 },
          {
            yPercent: 12,
            scale: 1.04,
            ease: 'none',
            scrollTrigger: {
              trigger: heroBannerRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      }

      // Floating hero badge counter-parallax
      if (heroBadgeRef.current) {
        gsap.to(heroBadgeRef.current, {
          yPercent: -20,
          ease: 'none',
          scrollTrigger: {
            trigger: heroBannerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="pb-12 sm:pb-16 md:pb-24 border-b border-black/5 bg-[#F6F4DE]">
      <Container>

        {/* Cinematic Wide Sanctuary Banner Frame with GSAP Parallax & Smooth Expand */}
        <div
          ref={heroBannerRef}
          className="mt-8 sm:mt-14 relative rounded-2xl sm:rounded-[32px] overflow-hidden shadow-2xl min-h-[300px] xs:min-h-[340px] sm:h-[440px] md:h-[540px] group border border-black/10 flex flex-col justify-end transition-shadow duration-500"
        >
          {/* GSAP Parallax Inner Image */}
          <div className="absolute inset-0 overflow-hidden">
            <img
              ref={heroImgRef}
              src={content.image.src}
              alt={content.image.alt}
              style={imageStyle(content.image)}
              className="w-full h-full object-cover object-center filter brightness-[0.9] contrast-[1.04] transition-all duration-700 will-change-transform"
              loading="eager"
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />

          <div
            ref={heroBadgeRef}
            className="relative z-10 p-4 sm:p-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 sm:gap-5 text-white"
          >
            <div className="max-w-xl">
              <span className="text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.25em] text-knowza-bronny block mb-1.5 sm:mb-2 font-medium text-[#D1C79D]">
                {content.eyebrow}
              </span>
              <p className="text-sm xs:text-base sm:text-2xl font-serif font-light italic leading-snug">
                {content.quote}
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {content.buttons.map((button: any) => (
                <CmsButton
                  key={button.id}
                  button={button}
                  className="w-full sm:w-auto text-center inline-flex items-center justify-center gap-2 rounded-full px-5 sm:px-6 py-2.5 sm:py-3 text-xs uppercase tracking-wider font-medium group whitespace-nowrap"
                  arrowClass="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

type StarTab = 'vision' | 'mission' | 'values';

const STAR_THEME: Record<StarTab, {
  tabActive: string;
  cornerSide: string;
  overlay: string;
  dot: string;
  stat: string;
  divider: string;
  cardHover: string;
  watermarkHover: string;
  iconWrap: string;
  category: string;
  highlight: string;
  arrow: string;
}> = {
  vision: {
    tabActive: 'bg-[#8A7D4C] text-[#FAF9F2] shadow-md',
    cornerSide: '-bottom-6 -right-6',
    overlay: 'bg-[#28351F]/25',
    dot: 'bg-[#8A7D4C]',
    stat: 'bg-[#8A7D4C]/40 border-[#8A7D4C]/50',
    divider: 'bg-[#8A7D4C]',
    cardHover: 'hover:border-[#8A7D4C]/40 hover:shadow-[0_16px_36px_-8px_rgba(138,125,76,0.18)]',
    watermarkHover: 'group-hover/card:text-[#8A7D4C]/15',
    iconWrap: 'text-[#79864B] group-hover/card:bg-[#79864B]',
    category: 'text-[#8A7D4C]',
    highlight: 'text-[#79864B]',
    arrow: 'text-[#8A7D4C]',
  },
  mission: {
    tabActive: 'bg-[#79864B] text-[#FAF9F2] shadow-md',
    cornerSide: '-bottom-6 -left-6',
    overlay: 'bg-[#79864B]/25',
    dot: 'bg-[#79864B]',
    stat: 'bg-[#79864B]/40 border-[#79864B]/50',
    divider: 'bg-[#79864B]',
    cardHover: 'hover:border-[#79864B]/40 hover:shadow-[0_16px_36px_-8px_rgba(121,134,75,0.18)]',
    watermarkHover: 'group-hover/card:text-[#79864B]/15',
    iconWrap: 'text-[#79864B] group-hover/card:bg-[#79864B]',
    category: 'text-[#79864B]',
    highlight: 'text-[#79864B]',
    arrow: 'text-[#79864B]',
  },
  values: {
    tabActive: 'bg-[#556038] text-[#FAF9F2] shadow-md',
    cornerSide: '-bottom-6 -right-6',
    overlay: 'bg-[#556038]/25',
    dot: 'bg-[#556038]',
    stat: 'bg-[#556038]/40 border-[#556038]/50',
    divider: 'bg-[#EEE9BF]',
    cardHover: 'hover:border-[#556038]/40 hover:shadow-[0_16px_36px_-8px_rgba(85,96,56,0.18)]',
    watermarkHover: 'group-hover/card:text-[#556038]/15',
    iconWrap: 'text-[#556038] group-hover/card:bg-[#556038]',
    category: 'text-[#556038]',
    highlight: 'text-[#556038]',
    arrow: 'text-[#556038]',
  },
};

const STAR_TABS: StarTab[] = ['vision', 'mission', 'values'];

export const NorthStarSection: React.FC<{ content: any }> = ({ content }) => {
  const [activeFilter, setActiveFilter] = useState<StarTab>('vision');
  const active = content[activeFilter];
  const theme = STAR_THEME[activeFilter];

  useEffect(() => {
    // Refresh ScrollTrigger when filter updates
    ScrollTrigger.refresh();
  }, [activeFilter]);

  return (
    <section className="py-14 sm:py-24 md:py-36 bg-[#F6F4DE] border-b border-black/5 relative overflow-hidden">
      {/* Subtle Background Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[70px] xs:text-[100px] sm:text-[180px] md:text-[240px] font-serif font-bold text-black/[0.025] uppercase tracking-widest select-none pointer-events-none whitespace-nowrap">
        {content.watermark}
      </div>

      <Container className="relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-14 space-y-3 sm:space-y-4">
          <SectionLabel label={content.eyebrow} color="olive" alignment="center" />
          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-serif font-normal text-knowza-dark tracking-tight leading-[1.15] mt-2">
            {content.heading}
          </h2>
          <p className="text-xs sm:text-sm md:text-base font-sans text-knowza-dark/75 font-light leading-relaxed max-w-xl mx-auto">
            {content.description}
          </p>

          {/* Interactive Filter Pills: Segmented 3-Column on Mobile, Pill Row on Tablet/Desktop */}
          <div className="pt-2 sm:pt-3">
            <div className="w-full max-w-sm sm:max-w-md mx-auto p-1 sm:p-1.5 rounded-full bg-black/[0.06] border border-black/10 shadow-sm grid grid-cols-3 sm:inline-flex sm:w-auto sm:grid-cols-none gap-1">
              {STAR_TABS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveFilter(tab)}
                  className={`w-full sm:w-auto px-2 xs:px-3 sm:px-5 py-2 sm:py-2.5 rounded-full text-[10px] xs:text-[11px] sm:text-xs uppercase tracking-wider font-medium transition-all duration-300 cursor-pointer text-center flex items-center justify-center ${activeFilter === tab
                      ? STAR_THEME[tab].tabActive
                      : 'text-knowza-dark/70 hover:text-knowza-dark hover:bg-black/5'
                    }`}
                >
                  <span className="sm:hidden">{content[tab].tabShort}</span>
                  <span className="hidden sm:inline">{content[tab].tabLong}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-12 sm:space-y-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeFilter}-block`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="bg-[#FAF9F2] rounded-2xl sm:rounded-3xl md:rounded-[36px] p-4 sm:p-8 md:p-12 border border-black/10 shadow-[0_12px_45px_-15px_rgba(37,39,31,0.08)] hover:shadow-[0_24px_60px_-16px_rgba(40,53,31,0.16)] transition-all duration-500 relative overflow-hidden group"
            >
              {/* Faint Corner Watermark */}
              <span className={`absolute ${theme.cornerSide} text-[70px] sm:text-[120px] md:text-[140px] font-serif font-bold text-black/[0.025] select-none pointer-events-none leading-none`}>
                {active.cornerNumber}
              </span>

              {/* Cinematic Master Banner Card */}
              <div className="relative rounded-xl sm:rounded-2xl md:rounded-[28px] overflow-hidden min-h-[280px] sm:min-h-[360px] md:min-h-[380px] p-4 sm:p-8 md:p-10 shadow-lg border border-black/10 mb-6 sm:mb-10 bg-knowza-deep flex flex-col justify-between group/banner">
                <img
                  src={active.image.src}
                  alt={active.image.alt}
                  style={imageStyle(active.image)}
                  className="absolute inset-0 w-full h-full object-cover filter brightness-[0.70] contrast-[1.08] transition-transform duration-1000 ease-out group-hover/banner:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/35 pointer-events-none" />
                <div className={`absolute inset-0 ${theme.overlay} mix-blend-multiply pointer-events-none`} />

                {/* Top Bar with Glowing Badge & Milestones */}
                <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 sm:gap-3">
                  <span className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-[9px] xs:text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.18em] sm:tracking-[0.22em] text-[#EEE9BF] font-semibold">
                    <span className={`w-1.5 h-1.5 rounded-full ${theme.dot} animate-pulse`} />
                    {active.badge}
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="text-[9px] xs:text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.15em] sm:tracking-[0.2em] text-white/80 bg-black/40 backdrop-blur-sm px-2.5 sm:px-3 py-1 rounded-full border border-white/15">
                      {active.statOne}
                    </span>
                    <span className={`text-[9px] xs:text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[#EEE9BF] backdrop-blur-sm px-2.5 sm:px-3 py-1 rounded-full border font-semibold ${theme.stat}`}>
                      {active.statTwo}
                    </span>
                  </div>
                </div>

                {/* Center / Bottom Quote & Master Manifesto */}
                <div className="relative z-10 space-y-3 sm:space-y-4 max-w-4xl pt-6 sm:pt-12">
                  <div className={`w-8 sm:w-12 h-[2px] ${theme.divider}`} />
                  <blockquote className="text-base sm:text-2xl md:text-3xl font-serif font-light italic text-[#FAF9F2] leading-snug tracking-tight">
                    {active.quote}
                  </blockquote>
                  <p className="text-xs sm:text-sm font-sans text-white/85 font-light leading-relaxed pt-2 border-t border-white/15 max-w-3xl">
                    {active.body}
                  </p>

                  {/* Pill Metrics */}
                  <div className="flex flex-wrap gap-1.5 sm:gap-2.5 pt-1 sm:pt-2">
                    {active.pills.map((pill: any) => (
                      <span key={pill.id} className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[9px] xs:text-[10px] sm:text-[11px] text-[#EEE9BF] font-sans">
                        <CmsIcon name={pill.icon} className="w-3 h-3 text-[#EEE9BF]" />
                        {pill.text}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sculpted Bento Pillars (2 Columns on MD/LG for maximum readability) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-5">
                {active.points.map((item: any) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.25 }}
                    className={`bg-white/90 hover:bg-white rounded-2xl sm:rounded-[26px] p-4 sm:p-6 md:p-7 border border-black/8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] transition-all duration-300 flex flex-col justify-between group/card relative overflow-hidden ${theme.cardHover}`}
                  >
                    {/* Faded Watermark Number */}
                    <span className={`absolute top-2 right-3 sm:right-4 text-2xl sm:text-4xl font-serif text-black/[0.04] transition-colors font-bold select-none pointer-events-none ${theme.watermarkHover}`}>
                      {item.number}
                    </span>

                    <div className="space-y-3 sm:space-y-4 relative z-10">
                      {/* Card Header with Icon & Category */}
                      <div className="flex items-center justify-between">
                        <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-[#F6F4DE] flex items-center justify-center group-hover/card:text-white transition-all duration-300 shadow-sm shrink-0 ${theme.iconWrap}`}>
                          <CmsIcon name={item.icon} className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover/card:scale-110" />
                        </div>
                        <span className={`text-[9px] xs:text-[10px] uppercase tracking-wider sm:tracking-widest font-semibold bg-[#FAF9F2] px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-black/5 ${theme.category}`}>
                          {item.category}
                        </span>
                      </div>

                      {/* Title & User-Provided Content */}
                      <div>
                        <div className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-knowza-dark/50 mb-1">
                          {content.pointLabel} {item.number}
                        </div>
                        <h4 className="text-sm sm:text-base md:text-lg font-serif font-semibold text-knowza-dark group-hover/card:text-knowza-forest transition-colors leading-snug">
                          {item.title}
                        </h4>
                        <p className="text-xs sm:text-[13px] font-sans text-knowza-dark/80 font-light leading-relaxed mt-2 sm:mt-2.5">
                          {item.text}
                        </p>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="mt-4 sm:mt-5 pt-3 sm:pt-3.5 border-t border-black/5 flex items-center justify-between text-[10px] sm:text-[11px] text-knowza-dark/65 font-sans font-medium">
                      <span className={`${theme.highlight} font-semibold`}>{item.highlight}</span>
                      <ArrowUpRight className={`w-3.5 h-3.5 ${theme.arrow} opacity-0 group-hover/card:opacity-100 transition-opacity`} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </Container>
    </section>
  );
};

const STAGE_DOTS: Record<string, string> = {
  bronze: 'bg-[#8A7D4C]',
  olive: 'bg-[#79864B]',
  dark: 'bg-knowza-dark',
};

export const RoadmapSection: React.FC<{ content: any }> = ({ content }) => {
  const [focusedRoadmapIndex, setFocusedRoadmapIndex] = useState<number | null>(null);
  const stages: any[] = content.stages;

  return (
    <section className="py-14 sm:py-24 md:py-36 bg-[#F6F4DE] border-b border-black/5 relative overflow-hidden">
      {/* Subtle Background Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[70px] xs:text-[100px] sm:text-[180px] md:text-[240px] font-serif font-bold text-black/[0.025] uppercase tracking-widest select-none pointer-events-none whitespace-nowrap">
        {content.watermark}
      </div>

      <Container className="relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-14 space-y-3 sm:space-y-4">
          <SectionLabel label={content.eyebrow} color="olive" alignment="center" />
          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-serif font-normal text-knowza-dark tracking-tight leading-[1.15] mt-2">
            {content.heading}
          </h2>
          <p className="text-xs sm:text-sm md:text-base font-sans text-knowza-dark/75 font-light leading-relaxed max-w-xl mx-auto">
            {content.description}
          </p>

          {/* Mobile Timeline Quick Switcher (Visible on mobile/tablet screens) */}
          <div className="flex md:hidden items-center justify-center gap-1.5 pt-2">
            {stages.map((stage, idx) => {
              const isFocused = focusedRoadmapIndex === idx;
              return (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => setFocusedRoadmapIndex(isFocused ? null : idx)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[10px] font-medium transition-all duration-300 cursor-pointer ${isFocused
                      ? 'bg-knowza-dark text-[#FAF9F2] shadow-sm'
                      : 'bg-black/[0.06] text-knowza-dark/75 hover:bg-black/10'
                    }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full text-[9px] font-mono flex items-center justify-center font-bold ${isFocused ? 'bg-[#79864B] text-white' : 'bg-black/20 text-knowza-dark'
                      }`}
                  >
                    {stage.stageNumber}
                  </span>
                  <span className="font-sans uppercase tracking-wider text-[9px] xs:text-[10px]">
                    {stage.title.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Interactive Timeline Step Track Indicator (Desktop) */}
          <div className="hidden md:flex items-center justify-center gap-3 pt-4">
            {stages.map((stage, idx) => {
              const isFocused = focusedRoadmapIndex === idx;
              return (
                <React.Fragment key={stage.id}>
                  {idx > 0 && (
                    <div
                      className={`w-12 lg:w-16 h-[1.5px] transition-colors duration-300 ${focusedRoadmapIndex === idx || focusedRoadmapIndex === idx - 1
                          ? 'bg-[#79864B]'
                          : 'bg-black/15'
                        }`}
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => setFocusedRoadmapIndex(isFocused ? null : idx)}
                    onMouseEnter={() => setFocusedRoadmapIndex(idx)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full transition-all duration-300 cursor-pointer ${isFocused
                        ? 'bg-knowza-dark text-[#FAF9F2] shadow-md scale-105'
                        : 'bg-black/[0.05] hover:bg-black/10 text-knowza-dark/80'
                      }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full text-[10px] font-mono flex items-center justify-center font-bold ${isFocused ? 'bg-[#79864B] text-white' : 'bg-black/20 text-knowza-dark'
                        }`}
                    >
                      {stage.stageNumber}
                    </span>
                    <span className="text-[11px] font-sans uppercase tracking-widest font-semibold">
                      {stage.title}
                    </span>
                  </button>
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Milestone High-Focus Photographic Bento Grid */}
        <div
          className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-8 items-stretch"
          onMouseLeave={() => setFocusedRoadmapIndex(null)}
        >
          {stages.map((stage, index) => {
            const isCardFocused = focusedRoadmapIndex === index;
            const isSiblingFocused = focusedRoadmapIndex !== null && !isCardFocused;

            return (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, delay: index * 0.12 }}
                onMouseEnter={() => setFocusedRoadmapIndex(index)}
                className={`min-h-[460px] xs:min-h-[500px] sm:min-h-[580px] md:min-h-[640px] rounded-2xl sm:rounded-3xl md:rounded-[36px] overflow-hidden relative flex flex-col justify-between p-4 sm:p-6 transition-all duration-500 group cursor-default select-none ${isCardFocused
                    ? 'scale-[1.01] sm:scale-[1.03] shadow-[0_32px_80px_-15px_rgba(0,0,0,0.55)] ring-2 ring-[#79864B] z-20'
                    : isSiblingFocused
                      ? 'opacity-85 filter brightness-95 scale-[0.99] border border-black/10 shadow-md z-10'
                      : 'border border-black/10 shadow-[0_10px_35px_-8px_rgba(37,39,31,0.12)] z-10'
                  }`}
              >
                {/* Full-Bleed Commanding Sanctuary Background Photo */}
                <div className="absolute inset-0 z-0 overflow-hidden bg-knowza-deep">
                  <img
                    src={stage.image.src}
                    alt={stage.image.alt}
                    style={imageStyle(stage.image)}
                    className="w-full h-full object-cover filter brightness-[0.82] contrast-[1.08] transition-transform duration-1000 ease-out group-hover:scale-110 group-hover:brightness-[0.96]"
                    loading="lazy"
                  />
                  {/* Natural Multi-layered Light & Vignette Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/30 pointer-events-none group-hover:from-black/90 transition-colors duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Top Floating Glass Bar */}
                <div className="relative z-10 flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[9px] xs:text-[10px] sm:text-[11px] font-sans uppercase tracking-widest text-[#EEE9BF] font-semibold shadow-md">
                    <span className={`w-1.5 h-1.5 rounded-full ${STAGE_DOTS[stage.dotAccent] ?? STAGE_DOTS.olive} animate-pulse`} />
                    {stage.stageBadge}
                  </span>
                  <span className="text-[9px] xs:text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-white/90 bg-black/50 backdrop-blur-md px-2.5 sm:px-3 py-1 rounded-full border border-white/15 font-semibold">
                    {stage.durationBadge}
                  </span>
                </div>

                {/* Center Architectural Camera Viewfinder Reticle (Visual Non-Clickable Focus) */}
                <div className="relative z-10 my-auto py-3 xs:py-4 sm:py-7 flex flex-col items-center justify-center pointer-events-none select-none">
                  <div className="relative p-4 sm:p-7 rounded-xl sm:rounded-2xl border border-white/10 bg-black/25 backdrop-blur-[2px]">
                    {/* 4 Viewfinder Framing Corner Brackets */}
                    <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 w-3.5 h-3.5 sm:w-4 sm:h-4 border-t-2 border-l-2 border-white/60 group-hover:border-[#EEE9BF] transition-colors duration-300" />
                    <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-3.5 h-3.5 sm:w-4 sm:h-4 border-t-2 border-r-2 border-white/60 group-hover:border-[#EEE9BF] transition-colors duration-300" />
                    <div className="absolute bottom-1.5 left-1.5 sm:bottom-2 sm:left-2 w-3.5 h-3.5 sm:w-4 sm:h-4 border-b-2 border-l-2 border-white/60 group-hover:border-[#EEE9BF] transition-colors duration-300" />
                    <div className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 w-3.5 h-3.5 sm:w-4 sm:h-4 border-b-2 border-r-2 border-white/60 group-hover:border-[#EEE9BF] transition-colors duration-300" />

                    {/* Center Crosshair Lens Icon & Region Data */}
                    <div className="flex flex-col items-center gap-1.5 sm:gap-2">
                      <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/45 backdrop-blur-md border border-white/30 flex items-center justify-center text-white/85 group-hover:text-[#EEE9BF] group-hover:scale-110 group-hover:border-[#EEE9BF]/70 transition-all duration-300 shadow-lg">
                        <Crosshair className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-500 group-hover:rotate-90" />
                      </div>
                      <span className="text-[9px] xs:text-[10px] font-mono uppercase tracking-[0.18em] sm:tracking-[0.2em] text-white/90 group-hover:text-[#EEE9BF] transition-colors bg-black/45 backdrop-blur-sm px-2 sm:px-2.5 py-0.5 rounded-full border border-white/15">
                        {stage.targetRegion}
                      </span>
                      <div className="flex items-center gap-1.5 text-[8px] xs:text-[9px] font-mono text-white/70 tracking-wider">
                        <span>{stage.coordinates}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Floating Frosted Glass Information Drawer */}
                <div className="relative z-10 bg-[#FAF9F2]/95 hover:bg-[#FAF9F2] backdrop-blur-xl border border-black/10 rounded-2xl sm:rounded-[26px] p-4 sm:p-6 shadow-[0_16px_40px_-8px_rgba(0,0,0,0.35)] transition-all duration-300 space-y-3 sm:space-y-4">
                  <div className="space-y-1">
                    <span className="text-[9px] xs:text-[10px] font-sans uppercase tracking-[0.22em] sm:tracking-[0.25em] text-[#8A7D4C] font-semibold block">
                      {stage.horizonTag}
                    </span>
                    <h3 className="text-lg xs:text-xl sm:text-2xl font-serif font-normal text-knowza-dark tracking-wide leading-tight group-hover:text-knowza-forest transition-colors">
                      {stage.title}
                    </h3>
                  </div>

                  {/* Exact User Milestone Quote */}
                  <blockquote className="text-xs sm:text-[13px] font-serif italic text-knowza-dark/95 border-l-2 border-[#79864B] pl-2.5 sm:pl-3 py-0.5 leading-snug">
                    "{stage.quote}"
                  </blockquote>

                  {/* Milestone Expansion Points */}
                  <div className="space-y-2 pt-2 border-t border-black/8">
                    {stage.highlights.map((item: any) => (
                      <div key={item.id} className="flex items-start gap-2 text-[11px] sm:text-xs font-sans text-knowza-dark/85">
                        <CmsIcon name={item.icon} className="w-3.5 h-3.5 text-[#79864B] shrink-0 mt-0.5" />
                        <span className="leading-tight">{item.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* Card Footer Status */}
                  <div className="pt-2.5 sm:pt-3 border-t border-black/8 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-[9px] xs:text-[10px] font-sans uppercase tracking-wider sm:tracking-widest text-[#79864B] font-semibold bg-[#F6F4DE]/80 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#79864B]" />
                      {stage.phaseStatus}
                    </span>
                    <span className="text-[11px] sm:text-xs font-sans text-knowza-dark/70 font-medium flex items-center gap-1 group-hover:text-knowza-dark transition-colors">
                      {stage.timeframe}
                      <ArrowRight className="w-3 h-3 text-[#79864B] transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

export const BrandSoulSection: React.FC<{ content: any }> = ({ content }) => {
  const scopeRef = useRef<HTMLElement>(null);
  const quoteCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const statItems = gsap.utils.toArray<HTMLElement>(scopeRef.current!.querySelectorAll('.gsap-stat-item'));
      statItems.forEach((item) => {
        const line = item.querySelector('.gsap-stat-line');
        if (line) {
          gsap.fromTo(
            line,
            { scaleX: 0 },
            {
              scaleX: 1,
              transformOrigin: 'left center',
              duration: 1.2,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: item,
                start: 'top 85%',
              },
            }
          );
        }

        gsap.from(item, {
          y: 28,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 88%',
          },
        });
      });

      // Quote Card Floating Drift
      if (quoteCardRef.current) {
        gsap.from(quoteCardRef.current, {
          y: 40,
          opacity: 0,
          rotateX: 4,
          transformPerspective: 800,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: quoteCardRef.current,
            start: 'top 85%',
          },
        });
      }
    }, scopeRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={scopeRef} className="py-14 sm:py-24 md:py-36 bg-[#F6F4DE] border-b border-black/5 relative">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-start">
          {/* Left Column: Eyebrow + Counters with GSAP Scrub Lines */}
          <div className="lg:col-span-4 space-y-6 sm:space-y-10">
            <SectionLabel label={content.eyebrow} color="olive" />

            <div className="space-y-6 sm:space-y-8 pt-2">
              {content.stats.map((stat: any) => (
                <div key={stat.id} className="gsap-stat-item relative pb-5 sm:pb-6">
                  <span className="text-3xl sm:text-4xl md:text-5xl font-serif font-normal text-knowza-dark block tracking-tight">
                    <Counter value={stat.value} suffix={stat.suffix} padZero={stat.padZero} duration={stat.duration} />
                  </span>
                  <span className="text-xs uppercase tracking-wider text-knowza-dark/70 font-medium block mt-1">
                    {stat.label}
                  </span>
                  <p className="text-xs font-sans text-knowza-dark/60 font-light mt-1">{stat.text}</p>
                  <div className="gsap-stat-line absolute bottom-0 left-0 right-0 h-[1px] bg-black/15 origin-left" />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Architectural Headline + Detailed Prose */}
          <div className="lg:col-span-8 space-y-6 sm:space-y-8">
            <TypewriterHeading
              className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-sans font-medium uppercase text-knowza-dark tracking-tight leading-[1.2]"
              segments={[
                { text: content.headingStart, className: 'text-knowza-dark' },
                { text: content.headingHighlight, className: 'text-[#8A7D4C] font-semibold' },
              ]}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 text-xs sm:text-sm font-sans text-knowza-dark/75 font-light leading-relaxed border-t border-black/10 pt-6 sm:pt-8">
              <p>{content.paragraphOne}</p>
              <p>{content.paragraphTwo}</p>
            </div>

            {/* Floating Quote Card with GSAP 3D perspective */}
            <div
              ref={quoteCardRef}
              className="p-4 sm:p-6 md:p-8 bg-[#FAF9F2] rounded-2xl sm:rounded-[28px] border border-black/10 flex items-start gap-3.5 sm:gap-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <Sparkles className="w-5 h-5 text-[#8A7D4C] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm sm:text-base font-serif font-normal text-knowza-dark mb-1">
                  {content.quoteTitle}
                </h4>
                <p className="text-xs sm:text-sm font-sans text-knowza-dark/70 font-light leading-relaxed">
                  {content.quoteText}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export const ExperiencePillarsSection: React.FC<{ content: any }> = ({ content }) => {
  const scopeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const pillarCards = gsap.utils.toArray<HTMLElement>(scopeRef.current!.querySelectorAll('.gsap-pillar-card'));
      pillarCards.forEach((card, index) => {
        // Staggered perspective lift
        gsap.from(card, {
          y: 60,
          opacity: 0,
          rotateX: 6,
          transformPerspective: 1000,
          duration: 0.9,
          delay: index * 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 86%',
          },
        });

        // Deep photographic parallax scrub inside the image frame
        const innerImg = card.querySelector('.gsap-pillar-img');
        if (innerImg) {
          gsap.fromTo(
            innerImg,
            { yPercent: -12, scale: 1.12 },
            {
              yPercent: 12,
              scale: 1.02,
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1,
              },
            }
          );
        }
      });
    }, scopeRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={scopeRef} className="py-12 sm:py-16 md:py-20 bg-[#F6F4DE] border-b border-black/5 relative">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-3">
          <SectionLabel label={content.eyebrow} color="olive" alignment="center" />
          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-[40px] font-sans font-medium uppercase text-knowza-dark tracking-tight leading-[1.2]">
            {content.heading}
          </h2>
          <p className="text-xs sm:text-sm md:text-base font-sans text-knowza-dark/75 font-light leading-relaxed">
            {content.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8">
          {content.cards.map((card: any) => (
            <div key={card.id} className="gsap-pillar-card bg-[#FAF9F2] border border-black/10 rounded-2xl sm:rounded-[28px] p-5 sm:p-7 md:p-8 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-500 group">
              <div className="space-y-3 sm:space-y-4">
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#8A7D4C] font-semibold block">
                  {card.tag}
                </span>
                <h3 className="text-xl sm:text-2xl font-serif text-knowza-dark font-normal group-hover:text-knowza-forest transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs sm:text-sm font-sans text-knowza-dark/75 font-light leading-relaxed">
                  {card.text}
                </p>
              </div>
              <div className="rounded-xl sm:rounded-[20px] overflow-hidden aspect-[16/10] sm:aspect-[4/3] mt-5 sm:mt-8 shadow-sm relative">
                <img
                  src={card.image.src}
                  alt={card.image.alt}
                  style={imageStyle(card.image)}
                  className="gsap-pillar-img w-full h-[125%] -top-[12%] absolute object-cover filter brightness-95 group-hover:scale-105 transition-transform duration-700 ease-out will-change-transform"
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export const SustainedHarmonySection: React.FC<{ content: any }> = ({ content }) => {
  const scopeRef = useRef<HTMLDivElement>(null);
  const diptychLeftRef = useRef<HTMLDivElement>(null);
  const diptychRightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (diptychLeftRef.current && diptychRightRef.current) {
        // Left image scrolls upward
        gsap.fromTo(
          diptychLeftRef.current,
          { yPercent: -10 },
          {
            yPercent: 12,
            ease: 'none',
            scrollTrigger: {
              trigger: scopeRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2,
            },
          }
        );

        // Right image scrolls downward (opposing motion)
        gsap.fromTo(
          diptychRightRef.current,
          { yPercent: 12 },
          {
            yPercent: -10,
            ease: 'none',
            scrollTrigger: {
              trigger: scopeRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2,
            },
          }
        );
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-[#F6F4DE] border-t border-black/5 relative">
      <Container>
        <div ref={scopeRef} className="gsap-diptych-container grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-16 items-center">
          {/* Photographic Diptych with GSAP Opposing Parallax */}
          <div className="lg:col-span-7 grid grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            <div
              ref={diptychLeftRef}
              className="rounded-2xl sm:rounded-[28px] overflow-hidden h-44 xs:h-52 sm:h-64 md:h-96 shadow-md border border-black/5 will-change-transform"
            >
              <img
                src={content.imageLeft.src}
                alt={content.imageLeft.alt}
                style={imageStyle(content.imageLeft)}
                className="w-full h-full object-cover filter brightness-95 hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
            </div>
            <div
              ref={diptychRightRef}
              className="rounded-2xl sm:rounded-[28px] overflow-hidden h-44 xs:h-52 sm:h-64 md:h-96 shadow-md border border-black/5 mt-4 xs:mt-6 sm:mt-8 md:mt-12 will-change-transform"
            >
              <img
                src={content.imageRight.src}
                alt={content.imageRight.alt}
                style={imageStyle(content.imageRight)}
                className="w-full h-full object-cover filter brightness-95 hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
            </div>
          </div>

          {/* Editorial Story & Manifesto */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-6">
            <SectionLabel label={content.eyebrow} color="olive" />
            <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-serif text-knowza-dark font-normal leading-tight">
              {content.heading}
            </h2>
            {content.paragraphs.map((paragraph: any) => (
              <p key={paragraph.id} className="text-xs sm:text-sm md:text-base font-sans text-knowza-dark/75 font-light leading-relaxed">
                {paragraph.text}
              </p>
            ))}

            <div className="pt-2 sm:pt-4 flex flex-wrap gap-4">
              {content.buttons.map((button: any) => (
                <CmsButton
                  key={button.id}
                  button={button}
                  className="w-full sm:w-auto text-center inline-flex items-center justify-center gap-2 rounded-full px-7 sm:px-8 py-3 sm:py-3.5 text-xs uppercase tracking-wider font-medium group"
                  arrowClass="w-4 h-4 transition-transform group-hover:translate-x-1"
                />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export const FounderSection: React.FC<{ content: any }> = ({ content }) => {
  const scopeRef = useRef<HTMLElement>(null);
  const [isCharterOpen, setIsCharterOpen] = useState(false);
  const charter = content.charter;

  useEffect(() => {
    if (!isCharterOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsCharterOpen(false);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCharterOpen]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const path = scopeRef.current!.querySelector('.gsap-signature-path');
      const block = scopeRef.current!.querySelector('.gsap-signature-block');

      if (!prefersReducedMotion) {
        gsap.fromTo(
          path,
          { strokeDashoffset: 450 },
          {
            strokeDashoffset: 0,
            duration: 2.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: block,
              start: 'top 90%',
            },
          }
        );
      } else {
        gsap.set(path, { strokeDashoffset: 0 });
      }
    }, scopeRef);
    return () => ctx.revert();
  }, []);

  return (
    <>
      <section ref={scopeRef} className="gsap-founder-section py-20 sm:py-28 md:py-36 bg-[#FBF9F4] border-t border-black/8 relative overflow-hidden">
        {/* Subtle architectural ambient warmth */}
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_75%_55%_at_50%_-15%,rgba(138,125,76,0.06),transparent)] pointer-events-none"
          aria-hidden="true"
        />

        <Container className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-14 lg:gap-20 items-start">

            {/* Left Column (5 Cols): Editorial Archival Portrait & Provenance Plaque */}
            <div className="lg:col-span-5 lg:sticky lg:top-28">
              <div className="bg-[#F3EFE7] p-3 sm:p-4 rounded-2xl sm:rounded-[28px] border border-black/8 shadow-[0_20px_50px_-20px_rgba(43,53,30,0.12)]">
                {/* Portrait Photo */}
                <div className="relative rounded-xl sm:rounded-2xl overflow-hidden aspect-[3.7/4.6] bg-knowza-deep shadow-2xs group">
                  <img
                    src={content.portrait.src}
                    alt={content.portrait.alt}
                    style={imageStyle(content.portrait)}
                    className="w-full h-full object-cover object-[50%_14%] group-hover:scale-102 transition-transform duration-700 ease-out"
                    loading="lazy"
                    decoding="async"
                    width={1200}
                    height={2132}
                  />
                  {/* Subtle tonal bottom vignette for depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Museum Provenance Plaque */}
                <div className="pt-3.5 mt-3.5 border-t border-black/8 flex items-end justify-between text-knowza-dark">
                  <div className="space-y-0.5">
                    <span className="text-[13px] sm:text-sm font-serif uppercase tracking-[0.2em] text-knowza-dark font-medium block">
                      {content.name}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.22em] text-[#8A7D4C] font-mono block">
                      {content.role}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-knowza-dark/50 block">
                      {content.origin}
                    </span>
                  </div>
                </div>

                {/* Integrated Core Philosophy Caption */}
                <div className="pt-3 mt-3 border-t border-black/6">
                  <p className="text-xs sm:text-[13px] font-serif italic text-knowza-dark/85 leading-relaxed">
                    {content.conviction}
                  </p>
                  <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#8A7D4C] block mt-1 font-medium">
                    {content.convictionLabel}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column (7 Cols): The Founder's Letter & Strategic Narrative */}
            <div className="lg:col-span-7 space-y-8 sm:space-y-10">
              {/* Dispatch Header */}
              <div className="space-y-3.5">
                <div className="inline-flex items-center gap-2.5">
                  <span className="w-8 h-[1px] bg-[#8A7D4C]" />
                  <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.28em] text-[#8A7D4C] font-semibold">
                    {content.noteLabel}
                  </span>
                </div>

                <TypewriterHeading
                  className="text-2xl xs:text-3xl sm:text-4xl md:text-[42px] lg:text-[44px] font-serif font-light text-knowza-dark leading-[1.2] tracking-tight max-w-2xl"
                  segments={[
                    { text: content.headingStart, className: 'text-knowza-dark' },
                    { text: content.headingHighlight, className: 'text-[#79864B] italic font-normal' },
                  ]}
                />
              </div>

              {/* Personal Essay Narrative: 3 Distinct Movements */}
              <div className="space-y-6 text-sm sm:text-[15px] font-sans text-knowza-dark/85 font-light leading-[1.8] border-t border-black/10 pt-6 sm:pt-8">
                {/* Movement 1: The Modern Condition */}
                <WaveParagraph dropCap={content.dropCap} text={content.paragraphOne} delay={0.05} />

                {/* Movement 2: The Restoration Philosophy (Distinct Editorial Callout) */}
                <div className="border-l-2 border-[#79864B]/40 pl-5 sm:pl-6 my-4 bg-[#F3EFE7]/45 rounded-r-xl py-4 pr-4">
                  <span className="text-[9px] font-mono uppercase tracking-[0.22em] text-[#8A7D4C] block mb-1.5 font-semibold">
                    {content.calloutLabel}
                  </span>
                  <WaveParagraph text={content.callout} delay={0.16} className="italic text-knowza-dark/90" />
                </div>

                {/* Movement 3: The Environmental Crusade */}
                <WaveParagraph text={content.paragraphTwo} delay={0.28} />
              </div>

              {/* Hand-drawn Ink Signature & Authentic Sign-off Block */}
              <div className="gsap-signature-block pt-7 sm:pt-9 border-t border-black/10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div className="space-y-3">
                  <span className="text-[9px] font-mono uppercase tracking-[0.24em] text-[#8A7D4C] block font-semibold">
                    {content.endorsementLabel}
                  </span>

                  {/* Flowing Ink Signature SVG */}
                  <div className="w-52 h-13 relative text-[#79864B]">
                    <svg viewBox="0 0 240 55" className="w-full h-full overflow-visible" aria-hidden="true">
                      <path
                        className="gsap-signature-path"
                        d="M 15 38 Q 24 12 32 24 Q 40 42 46 26 Q 52 14 60 38 Q 70 28 78 38 Q 86 22 94 34 Q 100 26 108 36 Q 116 16 122 40 Q 130 28 140 34 Q 150 28 162 36 Q 174 14 180 40 M 24 47 C 65 43 130 45 205 41 C 220 40 230 38 224 44 C 205 50 160 53 130 52"
                        fill="none"
                        stroke="#79864B"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ strokeDasharray: 450, strokeDashoffset: 0 }}
                      />
                    </svg>
                  </div>

                  <div>
                    <span className="text-base sm:text-lg font-serif font-medium text-knowza-dark block">
                      {content.signatureName}
                    </span>
                    <span className="text-xs font-mono text-knowza-dark/65 tracking-wider block mt-0.5">
                      {content.signatureRole}
                    </span>
                  </div>
                </div>

                {/* Functional Charter Button */}
                <button
                  type="button"
                  onClick={() => setIsCharterOpen(true)}
                  className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#F6F4DE]/80 hover:bg-[#F6F4DE] border border-[#8A7D4C]/35 hover:border-[#8A7D4C]/60 shadow-xs text-knowza-dark transition-all duration-300 group self-start sm:self-auto cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-[#79864B]/40"
                  aria-haspopup="dialog"
                  aria-expanded={isCharterOpen}
                >
                  <span className="w-2 h-2 rounded-full bg-[#79864B] ring-2 ring-[#79864B]/20 animate-pulse" />
                  <span className="font-mono uppercase tracking-[0.2em] text-[10px] sm:text-[11px] text-[#2B351E] font-semibold">
                    {content.charterButton}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#8A7D4C] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </div>

            </div>

          </div>
        </Container>
      </section>

      {/* ========================================================
          THE FOUNDING COVENANT & EARTH CHARTER MODAL
          ======================================================== */}
      <AnimatePresence>
        {isCharterOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs"
            role="dialog"
            aria-modal="true"
            aria-labelledby="charter-modal-title"
            onClick={() => setIsCharterOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#FBF9F4] border border-[#8A7D4C]/30 rounded-2xl sm:rounded-3xl shadow-2xl max-w-2xl w-full p-6 sm:p-10 relative overflow-hidden text-knowza-dark space-y-6 max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-start justify-between border-b border-black/10 pb-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-[0.26em] text-[#8A7D4C] font-semibold block">
                    {charter.eyebrow}
                  </span>
                  <h3 id="charter-modal-title" className="text-xl sm:text-2xl font-serif font-normal text-knowza-dark">
                    {charter.title}
                  </h3>
                  <p className="text-xs font-mono text-knowza-dark/60 tracking-wider">
                    {charter.authorised}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCharterOpen(false)}
                  className="p-2 rounded-full hover:bg-black/5 text-knowza-dark/70 hover:text-knowza-dark transition-colors cursor-pointer"
                  aria-label="Close charter modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Foundational Articles */}
              <div className="space-y-5 text-xs sm:text-[13px] font-sans text-knowza-dark/85 font-light leading-relaxed">
                {charter.articles.map((article: any) => (
                  <div key={article.id} className="p-4 rounded-xl bg-[#F3EFE7]/60 border border-black/6 space-y-1">
                    <div className="flex items-center gap-2 text-[#79864B]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#79864B]" />
                      <span className="font-mono uppercase tracking-widest text-[10px] font-semibold">
                        {article.title}
                      </span>
                    </div>
                    <p className="text-knowza-dark/80">{article.text}</p>
                  </div>
                ))}
              </div>

              {/* Sign-off & Seal in Modal */}
              <div className="pt-4 border-t border-black/10 flex items-center justify-between">
                <div>
                  <span className="text-sm font-serif font-medium text-knowza-dark block">
                    {charter.signName}
                  </span>
                  <span className="text-[10px] font-mono text-knowza-dark/50 tracking-wider block">
                    {charter.signRole}
                  </span>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 rounded-md bg-[#F6F4DE] text-[9px] font-mono uppercase tracking-widest text-[#79864B] font-semibold border border-[#79864B]/20">
                    {charter.seal}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
