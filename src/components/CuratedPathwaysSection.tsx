import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Container } from './Container';
import { SectionLabel } from './SectionLabel';
import { CmsLink } from './cms/CmsLink';
import { CmsIcon } from './cms/icons';
import { imageStyle } from '../cms/utils';

export type PathwayType = 'hospitality' | 'healing';

export interface CuratedPathwaysSectionProps {
  content: any;
  defaultPathway?: PathwayType;
  className?: string;
  id?: string;
}

const THEME: Record<PathwayType, { line: string; tag: string; cta: string; overlay: string; iconWraps: string[] }> = {
  hospitality: {
    line: 'bg-[#8A7D4C]',
    tag: 'text-[#8A7D4C]',
    cta: 'bg-knowza-dark text-[#FAF9F2] hover:bg-[#79864B]',
    overlay: 'contrast-[1.05]',
    iconWraps: ['bg-[#79864B]/15 text-[#79864B]', 'bg-[#8A7D4C]/15 text-[#8A7D4C]', 'bg-knowza-dark/15 text-knowza-dark'],
  },
  healing: {
    line: 'bg-[#79864B]',
    tag: 'text-[#79864B]',
    cta: 'bg-[#79864B] text-[#FAF9F2] hover:bg-knowza-deep',
    overlay: 'contrast-[1.03]',
    iconWraps: ['bg-[#79864B]/15 text-[#79864B]', 'bg-[#8A7D4C]/15 text-[#8A7D4C]', 'bg-knowza-deep/15 text-knowza-deep'],
  },
};

export const CuratedPathwaysSection: React.FC<CuratedPathwaysSectionProps> = ({
  content,
  defaultPathway = 'hospitality',
  className = '',
  id = 'curated-pathways',
}) => {
  const [searchParams] = useSearchParams();
  const urlTab = searchParams.get('tab');

  const [activePathway, setActivePathway] = useState<PathwayType>(() => {
    if (urlTab === 'healing' || urlTab === 'hospitality') {
      return urlTab;
    }
    return defaultPathway;
  });

  // Run only once on mount to handle initial deep link arrival
  useEffect(() => {
    if (urlTab === 'healing' || urlTab === 'hospitality') {
      setActivePathway(urlTab);
    }
    const el = document.getElementById(id);
    if (el && window.location.hash.includes(id)) {
      const lenis = (window as any).lenis;
      if (lenis) {
        lenis.scrollTo(el, { immediate: true });
      } else {
        el.scrollIntoView({ behavior: 'auto', block: 'start' });
      }
    }
  }, []);

  const handleSelectPathway = (type: PathwayType) => {
    setActivePathway(type);
    // Silent URL sync: preserves the hash and tab in history without triggering React Router scroll resets
    window.history.replaceState(null, '', `?tab=${type}#${id}`);
  };

  const active = content[activePathway];
  const theme = THEME[activePathway];
  const tabs: { key: PathwayType; activeClass: string }[] = [
    { key: 'hospitality', activeClass: 'bg-knowza-dark text-[#FAF9F2] shadow-md' },
    { key: 'healing', activeClass: 'bg-[#79864B] text-[#FAF9F2] shadow-md' },
  ];

  return (
    <section
      id={id}
      className={`py-20 sm:py-28 md:py-36 bg-[#F6F4DE] text-knowza-dark border-t border-b border-black/5 relative overflow-hidden ${className}`}
    >
      <Container className="relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <SectionLabel label={content.eyebrow} color="olive" alignment="center" />
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-serif font-normal text-knowza-dark tracking-tight leading-[1.15] mt-4">
            {content.heading}
          </h2>
          <p className="text-base sm:text-lg font-sans text-knowza-dark/75 font-light leading-relaxed mt-4 max-w-xl mx-auto">
            {content.description}
          </p>

          {/* Interactive Tab Switcher */}
          <div className="mt-7 sm:mt-10 w-full max-w-md mx-auto p-1 sm:p-1.5 rounded-full bg-black/[0.06] border border-black/10 shadow-sm grid grid-cols-2 sm:inline-flex sm:w-auto sm:max-w-none sm:grid-cols-none">
            {tabs.map(({ key, activeClass }) => {
              const tab = content[key];
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleSelectPathway(key)}
                  className={`w-full sm:w-auto px-2 xs:px-3 sm:px-6 md:px-7 py-2.5 sm:py-3 rounded-full font-medium transition-all duration-300 text-[10px] xs:text-[11px] sm:text-xs uppercase tracking-wider sm:tracking-widest-editorial whitespace-nowrap cursor-pointer text-center flex items-center justify-center gap-1 sm:gap-1.5 ${
                    activePathway === key ? activeClass : 'text-knowza-dark/70 hover:text-knowza-dark hover:bg-black/5'
                  }`}
                >
                  <span className="hidden sm:inline">{tab.tabLong}</span>
                  <span className="sm:hidden inline-flex items-center gap-1">
                    <span className="opacity-60 text-[9px] xs:text-[10px] font-semibold">{tab.tabNumber}</span>
                    {tab.tabShort === tab.tabShortest ? (
                      <span>{tab.tabShort}</span>
                    ) : (
                      <>
                        <span className="hidden xs:inline">{tab.tabShort}</span>
                        <span className="xs:hidden">{tab.tabShortest}</span>
                      </>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Pathway Content Panel */}
        <div className="max-w-5xl mx-auto min-h-[680px]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`pathway-${activePathway}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="space-y-8 sm:space-y-12 rounded-2xl sm:rounded-[36px] bg-[#FAF9F2] border border-black/10 p-5 sm:p-10 md:p-14 shadow-[0_12px_40px_-15px_rgba(37,39,31,0.08)]"
            >
              {/* Header Information */}
              <div className="space-y-4 max-w-3xl">
                <div className="inline-flex items-center gap-2.5">
                  <span className={`w-6 h-[1.5px] ${theme.line}`} />
                  <span className={`text-xs font-sans uppercase tracking-[0.26em] font-semibold ${theme.tag}`}>
                    {active.tag}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-normal text-knowza-dark tracking-tight leading-snug">
                  {active.title}
                </h3>
                <p className="text-base sm:text-lg font-sans text-knowza-dark/75 font-light leading-relaxed pt-1">
                  {active.text}
                </p>
              </div>

              {/* Cinematic Visual Frame */}
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden aspect-[16/8] sm:aspect-[21/9] w-full bg-knowza-deep shadow-md border border-black/10">
                <img
                  src={active.image.src}
                  alt={active.image.alt}
                  style={imageStyle(active.image)}
                  className={`w-full h-full object-cover filter brightness-[0.9] ${theme.overlay}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/20" />
                <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-8 right-4 text-[#FAF9F2]">
                  <div className="inline-flex items-center gap-2 mb-1">
                    <CmsIcon name={active.imageIcon} className="w-3.5 h-3.5 text-[#EEE9BF]" />
                    <span className="text-[11px] uppercase tracking-widest-editorial font-medium text-[#EEE9BF]">
                      {active.imageEyebrow}
                    </span>
                  </div>
                  <p className="text-sm sm:text-base font-serif font-light">{active.imageCaption}</p>
                </div>
              </div>

              {/* Grid Highlights */}
              <div className="space-y-4 pt-2">
                <h4 className="text-xs uppercase tracking-[0.24em] text-knowza-dark/60 font-semibold">
                  {active.pillarsHeading}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {active.pillars.map((pillar: any, index: number) => (
                    <div key={pillar.id} className="p-7 rounded-2xl bg-white/90 border border-black/5 shadow-sm space-y-3 hover:border-black/15 transition-all">
                      <div className={`w-11 h-11 rounded-full flex items-center justify-center ${theme.iconWraps[index % 3]}`}>
                        <CmsIcon name={pillar.icon} className="w-5 h-5" />
                      </div>
                      <h5 className="text-lg font-serif font-normal text-knowza-dark">{pillar.title}</h5>
                      <p className="text-xs sm:text-sm font-sans text-knowza-dark/70 font-light leading-relaxed">
                        {pillar.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom CTA Action Bar */}
              <div className="pt-8 border-t border-black/10 flex flex-col sm:flex-row items-center justify-between gap-5">
                <div className="text-xs font-sans text-knowza-dark/65 font-light text-center sm:text-left">
                  {active.footnote}
                </div>
                <CmsLink
                  url={active.ctaUrl}
                  className={`inline-flex items-center justify-center gap-2.5 sm:gap-3 w-full sm:w-auto px-6 sm:px-9 py-3.5 sm:py-4 rounded-full text-[11px] sm:text-xs uppercase tracking-wider sm:tracking-widest-editorial font-medium transition-all duration-300 shadow-md group/btn text-center ${theme.cta}`}
                >
                  <span>{active.ctaLabel}</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1.5 shrink-0" />
                </CmsLink>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </Container>
    </section>
  );
};

export default CuratedPathwaysSection;
