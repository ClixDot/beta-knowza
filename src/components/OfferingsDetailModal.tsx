import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ArrowRight,
  Footprints,
  Mountain,
  Sparkles,
  ShieldCheck,
  Wind,
  Users,
  Compass,
  CheckCircle2,
} from 'lucide-react';

export type OfferingType = 'hospitality' | 'healing';

export interface OfferingsDetailModalProps {
  isOpen: boolean;
  activeOffering: OfferingType;
  onClose: () => void;
  onSelectOffering: (type: OfferingType) => void;
}

export const OfferingsDetailModal: React.FC<OfferingsDetailModalProps> = ({
  isOpen,
  activeOffering,
  onClose,
  onSelectOffering,
}) => {
  // Lock body scroll when modal is active
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 overflow-y-auto">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/65 backdrop-blur-md cursor-pointer"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl sm:rounded-[36px] bg-[#FAF8F5] text-knowza-dark border border-black/10 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.35)] z-10 flex flex-col no-scrollbar"
          >
            {/* Ambient subtle light glow */}
            <div
              className="absolute top-0 right-1/4 w-96 h-96 bg-[#EEE9BF]/30 rounded-full blur-[100px] pointer-events-none -z-0"
              aria-hidden="true"
            />

            {/* Modal Header: Tab Navigation & Close Button */}
            <div className="sticky top-0 z-20 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-black/5 px-3.5 sm:px-10 py-3 sm:py-5 flex items-center justify-between gap-2 sm:gap-4">
              {/* Tab Switcher */}
              <div className="inline-flex items-center p-1 rounded-full bg-black/5 border border-black/5 text-xs max-w-[calc(100%-44px)]">
                <button
                  type="button"
                  onClick={() => onSelectOffering('hospitality')}
                  className={`px-2.5 xs:px-4 sm:px-5 py-1.5 sm:py-2 rounded-full font-medium transition-all duration-300 text-[10px] xs:text-[11px] sm:text-xs uppercase tracking-wider whitespace-nowrap ${
                    activeOffering === 'hospitality'
                      ? 'bg-knowza-dark text-[#FAF9F2] shadow-sm'
                      : 'text-knowza-dark/70 hover:text-knowza-dark'
                  }`}
                >
                  <span className="hidden sm:inline">01 / Hospitality</span>
                  <span className="sm:hidden inline-flex items-center gap-1">
                    <span className="opacity-60 text-[9px] xs:text-[10px] font-semibold">01 /</span>
                    <span>Hospitality</span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => onSelectOffering('healing')}
                  className={`px-2.5 xs:px-4 sm:px-5 py-1.5 sm:py-2 rounded-full font-medium transition-all duration-300 text-[10px] xs:text-[11px] sm:text-xs uppercase tracking-wider whitespace-nowrap ${
                    activeOffering === 'healing'
                      ? 'bg-[#79864B] text-[#FAF9F2] shadow-md'
                      : 'text-knowza-dark/70 hover:text-knowza-dark'
                  }`}
                >
                  <span className="hidden sm:inline">02 / The Healing Journey</span>
                  <span className="sm:hidden inline-flex items-center gap-1">
                    <span className="opacity-60 text-[9px] xs:text-[10px] font-semibold">02 /</span>
                    <span className="hidden xs:inline">Healing Journey</span>
                    <span className="xs:hidden">Healing</span>
                  </span>
                </button>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close detail modal"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/5 hover:bg-black/10 border border-black/5 flex items-center justify-center text-knowza-dark transition-all duration-200 group shrink-0"
              >
                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:scale-110" />
              </button>
            </div>

            {/* Modal Content Panels */}
            <div className="p-4 xs:p-6 sm:p-10 md:p-12 relative z-10">
              <AnimatePresence mode="wait">
                {activeOffering === 'hospitality' ? (
                  <motion.div
                    key="hospitality"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8 sm:space-y-10"
                  >
                    {/* Header Block */}
                    <div className="space-y-3">
                      <div className="inline-flex items-center gap-2.5">
                        <span className="w-5 h-[1.5px] bg-[#8A7D4C]" />
                        <span className="text-xs font-sans uppercase tracking-[0.26em] text-[#8A7D4C] font-semibold">
                          01 / SANCTUARY STAYS &amp; RECONNECTION
                        </span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-normal text-knowza-dark tracking-tight leading-snug">
                        Experiential Hospitality: Returning to the Living Earth
                      </h2>
                      <p className="text-base sm:text-lg font-sans text-knowza-dark/75 font-light leading-relaxed pt-2 max-w-3xl">
                        Knowza is not just a destination or a luxury resort—it is a conscious bridge back to untouched earth, raw culture, and the lost simplicity of childhood play. Step away from digital burnout and reconnect through living soil and mountain mist.
                      </p>
                    </div>

                    {/* Featured Visual Strip */}
                    <div className="relative rounded-2xl overflow-hidden aspect-[21/9] sm:aspect-[24/9] w-full bg-knowza-deep shadow-inner border border-black/10">
                      <img
                        src="https://res.cloudinary.com/mg4ku51f/image/upload/v1793760169/knowza/images/offerings/sanctuary-cabin.jpg"
                        alt="High altitude mountain mist ridge sanctuary pavilion"
                        className="w-full h-full object-cover filter brightness-[0.9] contrast-[1.05]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/20" />
                      <div className="absolute bottom-4 left-5 sm:left-6 text-[#FAF9F2]">
                        <span className="text-[10px] sm:text-xs uppercase tracking-widest-editorial font-medium block text-[#EEE9BF]">
                          Western Ghats &bull; Mist Ridge Sanctuary
                        </span>
                        <span className="text-sm sm:text-base font-serif font-light">
                          Untouched ridges untouched by modern hurry
                        </span>
                      </div>
                    </div>

                    {/* 3 Grid Highlights */}
                    <div className="space-y-4 pt-2">
                      <h3 className="text-xs uppercase tracking-[0.24em] text-knowza-dark/60 font-semibold">
                        Core Pillars of the Experience
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {/* Highlight 1 */}
                        <div className="p-6 rounded-2xl bg-white/80 border border-black/5 shadow-sm space-y-3 hover:border-black/15 transition-all">
                          <div className="w-10 h-10 rounded-full bg-[#79864B]/10 flex items-center justify-center text-[#79864B]">
                            <Footprints className="w-5 h-5" />
                          </div>
                          <h4 className="text-base font-serif font-normal text-knowza-dark">
                            Barefoot Grounding
                          </h4>
                          <p className="text-xs sm:text-[13px] font-sans text-knowza-dark/70 font-light leading-relaxed">
                            Digital screen disconnect, mud therapy, direct contact with native earth.
                          </p>
                        </div>

                        {/* Highlight 2 */}
                        <div className="p-6 rounded-2xl bg-white/80 border border-black/5 shadow-sm space-y-3 hover:border-black/15 transition-all">
                          <div className="w-10 h-10 rounded-full bg-[#8A7D4C]/10 flex items-center justify-center text-[#8A7D4C]">
                            <Mountain className="w-5 h-5" />
                          </div>
                          <h4 className="text-base font-serif font-normal text-knowza-dark">
                            Ecosystem Living
                          </h4>
                          <p className="text-xs sm:text-[13px] font-sans text-knowza-dark/70 font-light leading-relaxed">
                            Rooted in high-altitude mist ridges; expanding across deep rainforest sanctuaries.
                          </p>
                        </div>

                        {/* Highlight 3 */}
                        <div className="p-6 rounded-2xl bg-white/80 border border-black/5 shadow-sm space-y-3 hover:border-black/15 transition-all">
                          <div className="w-10 h-10 rounded-full bg-knowza-dark/10 flex items-center justify-center text-knowza-dark">
                            <Sparkles className="w-5 h-5" />
                          </div>
                          <h4 className="text-base font-serif font-normal text-knowza-dark">
                            Consistent Essence, Evolving Scenery
                          </h4>
                          <p className="text-xs sm:text-[13px] font-sans text-knowza-dark/70 font-light leading-relaxed">
                            Unified sanctuary care with unique local soul and activities.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Bottom CTA Action */}
                    <div className="pt-6 border-t border-black/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="text-xs font-sans text-knowza-dark/65 font-light text-center sm:text-left">
                        Limited guest admissions each season to protect ecological serenity.
                      </div>
                      <Link
                        to="/contact"
                        onClick={onClose}
                        className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 rounded-full text-xs uppercase tracking-widest-editorial font-medium bg-knowza-dark text-[#FAF9F2] hover:bg-[#79864B] transition-all duration-300 shadow-md group/btn"
                      >
                        <span>RESERVE SANCTUARY EXPERIENCE</span>
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1.5" />
                      </Link>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="healing"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8 sm:space-y-10"
                  >
                    {/* Header Block */}
                    <div className="space-y-3">
                      <div className="inline-flex items-center gap-2.5">
                        <span className="w-5 h-[1.5px] bg-[#79864B]" />
                        <span className="text-xs font-sans uppercase tracking-[0.26em] text-[#79864B] font-semibold">
                          02 / RESTORATIVE SOULWORK
                        </span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-normal text-knowza-dark tracking-tight leading-snug">
                        The Healing Journey: Curated Trauma Release &amp; Inner Alignment
                      </h2>
                      <p className="text-base sm:text-lg font-sans text-knowza-dark/75 font-light leading-relaxed pt-2 max-w-3xl">
                        A confidential, deeply restorative retreat crafted for visionaries, business leaders, and individuals carrying high-pressure stress or unhealed childhood emotional weight. True success starts with being 100% healed.
                      </p>
                    </div>

                    {/* Featured Visual Strip */}
                    <div className="relative rounded-2xl overflow-hidden aspect-[21/9] sm:aspect-[24/9] w-full bg-knowza-deep shadow-inner border border-black/10">
                      <img
                        src="https://res.cloudinary.com/mg4ku51f/image/upload/v1793760167/knowza/images/offerings/healing-retreat.jpg"
                        alt="Restorative mindful yoga and meditation retreat by misty lake"
                        style={{ objectPosition: '50% 60%' }}
                        className="w-full h-full object-cover filter brightness-[0.9] contrast-[1.03]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                      <div className="absolute bottom-4 left-5 sm:left-6 text-[#FAF9F2]">
                        <span className="text-[10px] sm:text-xs uppercase tracking-widest-editorial font-medium block text-[#EEE9BF]">
                          Private Healing Enclave
                        </span>
                        <span className="text-sm sm:text-base font-serif font-light">
                          Confidential somatic guidance &amp; deep nervous restoration
                        </span>
                      </div>
                    </div>

                    {/* 3 Grid Highlights */}
                    <div className="space-y-4 pt-2">
                      <h3 className="text-xs uppercase tracking-[0.24em] text-knowza-dark/60 font-semibold">
                        Transformational Retreat Pillars
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {/* Highlight 1 */}
                        <div className="p-6 rounded-2xl bg-white/80 border border-black/5 shadow-sm space-y-3 hover:border-black/15 transition-all">
                          <div className="w-10 h-10 rounded-full bg-[#79864B]/10 flex items-center justify-center text-[#79864B]">
                            <ShieldCheck className="w-5 h-5" />
                          </div>
                          <h4 className="text-base font-serif font-normal text-knowza-dark">
                            1-on-1 Expert Shadow Work
                          </h4>
                          <p className="text-xs sm:text-[13px] font-sans text-knowza-dark/70 font-light leading-relaxed">
                            Private consultations with somatic mentors to untangle emotional blocks.
                          </p>
                        </div>

                        {/* Highlight 2 */}
                        <div className="p-6 rounded-2xl bg-white/80 border border-black/5 shadow-sm space-y-3 hover:border-black/15 transition-all">
                          <div className="w-10 h-10 rounded-full bg-[#8A7D4C]/10 flex items-center justify-center text-[#8A7D4C]">
                            <Wind className="w-5 h-5" />
                          </div>
                          <h4 className="text-base font-serif font-normal text-knowza-dark">
                            Nervous System Shock Reset
                          </h4>
                          <p className="text-xs sm:text-[13px] font-sans text-knowza-dark/70 font-light leading-relaxed">
                            Ice bath therapies, deep forest breathwork, and thermal grounding.
                          </p>
                        </div>

                        {/* Highlight 3 */}
                        <div className="p-6 rounded-2xl bg-white/80 border border-black/5 shadow-sm space-y-3 hover:border-black/15 transition-all">
                          <div className="w-10 h-10 rounded-full bg-knowza-deep/10 flex items-center justify-center text-knowza-deep">
                            <Users className="w-5 h-5" />
                          </div>
                          <h4 className="text-base font-serif font-normal text-knowza-dark">
                            Visionary Collective
                          </h4>
                          <p className="text-xs sm:text-[13px] font-sans text-knowza-dark/70 font-light leading-relaxed">
                            Enter a supportive community of transformed founders, investors, and leaders.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Bottom CTA Action */}
                    <div className="pt-6 border-t border-black/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="text-xs font-sans text-knowza-dark/65 font-light text-center sm:text-left">
                        Admissions by application to preserve high emotional safety and alignment.
                      </div>
                      <Link
                        to="/contact"
                        onClick={onClose}
                        className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 rounded-full text-xs uppercase tracking-widest-editorial font-medium bg-[#79864B] text-[#FAF9F2] hover:bg-knowza-deep transition-all duration-300 shadow-md group/btn"
                      >
                        <span>APPLY FOR HEALING RETREAT</span>
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1.5" />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default OfferingsDetailModal;
