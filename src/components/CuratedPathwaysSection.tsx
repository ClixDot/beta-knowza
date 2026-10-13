import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Footprints,
  Mountain,
  Sparkles,
  ShieldCheck,
  Wind,
  Users,
  Compass,
} from 'lucide-react';
import { Container } from './Container';
import { SectionLabel } from './SectionLabel';

export type PathwayType = 'hospitality' | 'healing';

export interface CuratedPathwaysSectionProps {
  defaultPathway?: PathwayType;
  className?: string;
  id?: string;
}

export const CuratedPathwaysSection: React.FC<CuratedPathwaysSectionProps> = ({
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

  return (
    <section
      id={id}
      className={`py-20 sm:py-28 md:py-36 bg-[#EDEABF] text-knowza-dark border-t border-b border-black/5 relative overflow-hidden ${className}`}
    >
      <Container className="relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <SectionLabel label="CURATED SANCTUARY PATHWAYS" color="olive" alignment="center" />
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-serif font-normal text-knowza-dark tracking-tight leading-[1.15] mt-4">
            Two Pathways of Living Presence
          </h2>
          <p className="text-base sm:text-lg font-sans text-knowza-dark/75 font-light leading-relaxed mt-4 max-w-xl mx-auto">
            Choose your journey: immersed wilderness hospitality or deep confidential soulwork and nervous restoration.
          </p>

          {/* Interactive Tab Switcher */}
          <div className="mt-8 sm:mt-10 inline-flex items-center p-1.5 rounded-full bg-black/5 border border-black/5 shadow-sm max-w-full">
            <button
              type="button"
              onClick={() => handleSelectPathway('hospitality')}
              className={`px-5 sm:px-7 py-2.5 sm:py-3 rounded-full font-medium transition-all duration-300 text-xs uppercase tracking-widest-editorial whitespace-nowrap cursor-pointer ${
                activePathway === 'hospitality'
                  ? 'bg-knowza-dark text-[#FAF9F2] shadow-md'
                  : 'text-knowza-dark/70 hover:text-knowza-dark hover:bg-black/5'
              }`}
            >
              01 / Experiential Hospitality
            </button>
            <button
              type="button"
              onClick={() => handleSelectPathway('healing')}
              className={`px-5 sm:px-7 py-2.5 sm:py-3 rounded-full font-medium transition-all duration-300 text-xs uppercase tracking-widest-editorial whitespace-nowrap cursor-pointer ${
                activePathway === 'healing'
                  ? 'bg-[#79864B] text-[#FAF9F2] shadow-md'
                  : 'text-knowza-dark/70 hover:text-knowza-dark hover:bg-black/5'
              }`}
            >
              02 / The Healing Journey
            </button>
          </div>
        </div>

        {/* Dynamic Pathway Content Panel */}
        <div className="max-w-5xl mx-auto min-h-[680px]">
          <AnimatePresence mode="wait" initial={false}>
            {activePathway === 'hospitality' ? (
              <motion.div
                key="pathway-hospitality"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
                className="space-y-10 sm:space-y-12 rounded-3xl sm:rounded-[36px] bg-[#FAF9F2] border border-black/10 p-7 sm:p-11 md:p-14 shadow-[0_12px_40px_-15px_rgba(37,39,31,0.08)]"
              >
                {/* Header Information */}
                <div className="space-y-4 max-w-3xl">
                  <div className="inline-flex items-center gap-2.5">
                    <span className="w-6 h-[1.5px] bg-[#8A7D4C]" />
                    <span className="text-xs font-sans uppercase tracking-[0.26em] text-[#8A7D4C] font-semibold">
                      01 / SANCTUARY STAYS &amp; RECONNECTION
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-normal text-knowza-dark tracking-tight leading-snug">
                    Experiential Hospitality: Returning to the Living Earth
                  </h3>
                  <p className="text-base sm:text-lg font-sans text-knowza-dark/75 font-light leading-relaxed pt-1">
                    Knowza is not just a destination or a luxury resort—it is a conscious bridge back to untouched earth, raw culture, and the lost simplicity of childhood play. Step away from digital burnout and reconnect through living soil and mountain mist.
                  </p>
                </div>

                {/* Cinematic Visual Frame */}
                <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden aspect-[16/8] sm:aspect-[21/9] w-full bg-knowza-deep shadow-md border border-black/10">
                  <img
                    src="/images/offerings/sanctuary-cabin.jpg"
                    alt="Raw timber sanctuary pavilion overlooking Western Ghats mist ridges"
                    className="w-full h-full object-cover filter brightness-[0.9] contrast-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/20" />
                  <div className="absolute bottom-5 left-6 sm:bottom-6 sm:left-8 text-[#FAF9F2]">
                    <div className="inline-flex items-center gap-2 mb-1">
                      <Compass className="w-3.5 h-3.5 text-[#EEE9BF]" />
                      <span className="text-[11px] uppercase tracking-widest-editorial font-medium text-[#EEE9BF]">
                        Western Ghats &bull; Mist Ridge Sanctuary
                      </span>
                    </div>
                    <p className="text-sm sm:text-base font-serif font-light">
                      Raw architectural shelter in quiet rhythm with untouched wilderness
                    </p>
                  </div>
                </div>

                {/* 3 Grid Highlights */}
                <div className="space-y-4 pt-2">
                  <h4 className="text-xs uppercase tracking-[0.24em] text-knowza-dark/60 font-semibold">
                    Core Pillars of the Hospitality Pathway
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Highlight 1 */}
                    <div className="p-7 rounded-2xl bg-white/90 border border-black/5 shadow-sm space-y-3 hover:border-black/15 transition-all">
                      <div className="w-11 h-11 rounded-full bg-[#79864B]/15 flex items-center justify-center text-[#79864B]">
                        <Footprints className="w-5 h-5" />
                      </div>
                      <h5 className="text-lg font-serif font-normal text-knowza-dark">
                        Barefoot Grounding
                      </h5>
                      <p className="text-xs sm:text-sm font-sans text-knowza-dark/70 font-light leading-relaxed">
                        Digital screen disconnect, mud therapy, direct contact with native earth.
                      </p>
                    </div>

                    {/* Highlight 2 */}
                    <div className="p-7 rounded-2xl bg-white/90 border border-black/5 shadow-sm space-y-3 hover:border-black/15 transition-all">
                      <div className="w-11 h-11 rounded-full bg-[#8A7D4C]/15 flex items-center justify-center text-[#8A7D4C]">
                        <Mountain className="w-5 h-5" />
                      </div>
                      <h5 className="text-lg font-serif font-normal text-knowza-dark">
                        Ecosystem Living
                      </h5>
                      <p className="text-xs sm:text-sm font-sans text-knowza-dark/70 font-light leading-relaxed">
                        Rooted in high-altitude mist ridges; expanding across deep rainforest sanctuaries.
                      </p>
                    </div>

                    {/* Highlight 3 */}
                    <div className="p-7 rounded-2xl bg-white/90 border border-black/5 shadow-sm space-y-3 hover:border-black/15 transition-all">
                      <div className="w-11 h-11 rounded-full bg-knowza-dark/15 flex items-center justify-center text-knowza-dark">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <h5 className="text-lg font-serif font-normal text-knowza-dark">
                        Consistent Essence, Evolving Scenery
                      </h5>
                      <p className="text-xs sm:text-sm font-sans text-knowza-dark/70 font-light leading-relaxed">
                        Unified sanctuary care with unique local soul and activities.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom CTA Action Bar */}
                <div className="pt-8 border-t border-black/10 flex flex-col sm:flex-row items-center justify-between gap-5">
                  <div className="text-xs font-sans text-knowza-dark/65 font-light text-center sm:text-left">
                    Seasonal bookings are strictly curated to preserve ecological stillness.
                  </div>
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-9 py-4 rounded-full text-xs uppercase tracking-widest-editorial font-medium bg-knowza-dark text-[#FAF9F2] hover:bg-[#79864B] transition-all duration-300 shadow-md group/btn"
                  >
                    <span>RESERVE SANCTUARY EXPERIENCE</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1.5" />
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="pathway-healing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
                className="space-y-10 sm:space-y-12 rounded-3xl sm:rounded-[36px] bg-[#FAF9F2] border border-black/10 p-7 sm:p-11 md:p-14 shadow-[0_12px_40px_-15px_rgba(37,39,31,0.08)]"
              >
                {/* Header Information */}
                <div className="space-y-4 max-w-3xl">
                  <div className="inline-flex items-center gap-2.5">
                    <span className="w-6 h-[1.5px] bg-[#79864B]" />
                    <span className="text-xs font-sans uppercase tracking-[0.26em] text-[#79864B] font-semibold">
                      02 / RESTORATIVE SOULWORK
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-normal text-knowza-dark tracking-tight leading-snug">
                    The Healing Journey: Curated Trauma Release &amp; Inner Alignment
                  </h3>
                  <p className="text-base sm:text-lg font-sans text-knowza-dark/75 font-light leading-relaxed pt-1">
                    A confidential, deeply restorative retreat crafted for visionaries, business leaders, and individuals carrying high-pressure stress or unhealed childhood emotional weight. True success starts with being 100% healed.
                  </p>
                </div>

                {/* Cinematic Visual Frame */}
                <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden aspect-[16/8] sm:aspect-[21/9] w-full bg-knowza-deep shadow-md border border-black/10">
                  <img
                    src="/images/offerings/healing-retreat.jpg"
                    alt="Restorative mindful yoga and meditation retreat by misty lake"
                    style={{ objectPosition: '50% 60%' }}
                    className="w-full h-full object-cover filter brightness-[0.9] contrast-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/20" />
                  <div className="absolute bottom-5 left-6 sm:bottom-6 sm:left-8 text-[#FAF9F2]">
                    <div className="inline-flex items-center gap-2 mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#EEE9BF]" />
                      <span className="text-[11px] uppercase tracking-widest-editorial font-medium text-[#EEE9BF]">
                        Private Healing Enclave &bull; Ancient Cedar Valley
                      </span>
                    </div>
                    <p className="text-sm sm:text-base font-serif font-light">
                      Confidential somatic guidance &amp; deep nervous restoration
                    </p>
                  </div>
                </div>

                {/* 3 Grid Highlights */}
                <div className="space-y-4 pt-2">
                  <h4 className="text-xs uppercase tracking-[0.24em] text-knowza-dark/60 font-semibold">
                    Core Pillars of the Healing Pathway
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Highlight 1 */}
                    <div className="p-7 rounded-2xl bg-white/90 border border-black/5 shadow-sm space-y-3 hover:border-black/15 transition-all">
                      <div className="w-11 h-11 rounded-full bg-[#79864B]/15 flex items-center justify-center text-[#79864B]">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <h5 className="text-lg font-serif font-normal text-knowza-dark">
                        1-on-1 Expert Shadow Work
                      </h5>
                      <p className="text-xs sm:text-sm font-sans text-knowza-dark/70 font-light leading-relaxed">
                        Private consultations with somatic mentors to untangle emotional blocks.
                      </p>
                    </div>

                    {/* Highlight 2 */}
                    <div className="p-7 rounded-2xl bg-white/90 border border-black/5 shadow-sm space-y-3 hover:border-black/15 transition-all">
                      <div className="w-11 h-11 rounded-full bg-[#8A7D4C]/15 flex items-center justify-center text-[#8A7D4C]">
                        <Wind className="w-5 h-5" />
                      </div>
                      <h5 className="text-lg font-serif font-normal text-knowza-dark">
                        Nervous System Shock Reset
                      </h5>
                      <p className="text-xs sm:text-sm font-sans text-knowza-dark/70 font-light leading-relaxed">
                        Ice bath therapies, deep forest breathwork, and thermal grounding.
                      </p>
                    </div>

                    {/* Highlight 3 */}
                    <div className="p-7 rounded-2xl bg-white/90 border border-black/5 shadow-sm space-y-3 hover:border-black/15 transition-all">
                      <div className="w-11 h-11 rounded-full bg-knowza-deep/15 flex items-center justify-center text-knowza-deep">
                        <Users className="w-5 h-5" />
                      </div>
                      <h5 className="text-lg font-serif font-normal text-knowza-dark">
                        Visionary Collective
                      </h5>
                      <p className="text-xs sm:text-sm font-sans text-knowza-dark/70 font-light leading-relaxed">
                        Enter a supportive community of transformed founders, investors, and leaders.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom CTA Action Bar */}
                <div className="pt-8 border-t border-black/10 flex flex-col sm:flex-row items-center justify-between gap-5">
                  <div className="text-xs font-sans text-knowza-dark/65 font-light text-center sm:text-left">
                    Admissions by application to preserve high emotional safety and alignment.
                  </div>
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-9 py-4 rounded-full text-xs uppercase tracking-widest-editorial font-medium bg-[#79864B] text-[#FAF9F2] hover:bg-knowza-deep transition-all duration-300 shadow-md group/btn"
                  >
                    <span>APPLY FOR HEALING RETREAT</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1.5" />
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Container>
    </section>
  );
};

export default CuratedPathwaysSection;
