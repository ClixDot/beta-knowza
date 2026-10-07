import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowRight, Compass, Sparkles, ShieldCheck } from 'lucide-react';
import { Container } from '../components/Container';
import { SectionLabel } from '../components/SectionLabel';
import { CTASection } from '../components/CTASection';
import { siteConfig, fiveElements } from '../data/site';

export const About: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-[#FAF9F5] text-knowza-dark">
      {/* ========================================================
          01 ARCHITECTURAL EDITORIAL HERO
          ======================================================== */}
      <section className="relative pt-32 sm:pt-40 pb-16 md:pb-24 border-b border-black/5 overflow-hidden">
        {/* Subtle atmospheric ambient glow */}
        <div
          className="absolute -top-32 right-1/4 w-[500px] h-[500px] rounded-full bg-[#8A7D4C]/10 blur-[100px] pointer-events-none"
          aria-hidden="true"
        />

        <Container>
          <div className="max-w-5xl mx-auto space-y-8">
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.1 }}
              className="text-3xl xs:text-4xl sm:text-6xl md:text-7xl lg:text-[84px] font-serif text-knowza-dark font-normal tracking-tight leading-[1.04] sm:leading-[0.98] break-words"
            >
              ROOTED IN PLACE. <br />
              <span className="font-light italic text-[#8A7D4C] tracking-wide">
                SHAPED BY CULTURE.
              </span>{' '}
              <br />
              CONNECTED BY HEART.
            </motion.h1>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4 items-end border-t border-black/10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="md:col-span-8"
              >
                <p className="text-base sm:text-lg md:text-xl font-sans text-knowza-dark/80 font-light leading-relaxed max-w-2xl">
                  {siteConfig.description} We curate quiet sanctuaries where ancient landscapes,
                  localized craftsmanship, and authentic hospitality meet in deliberate stillness.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="md:col-span-4 flex md:justify-end"
              >
                {/* Floating Architectural Badge */}
                <div className="inline-flex items-center gap-3.5 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-white border border-black/10 shadow-sm text-knowza-dark">
                  <div className="w-8 h-8 rounded-full bg-knowza-deep flex items-center justify-center text-knowza-dew text-xs font-serif shrink-0">
                    K
                  </div>
                  <div className="text-left text-xs font-sans">
                    <span className="block font-medium text-knowza-dark">Knowza Ethos</span>
                    <span className="block text-knowza-dark/60 font-light">Slow, Reverent Living</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Cinematic Wide Sanctuary Banner Frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.35 }}
            className="mt-12 sm:mt-14 relative rounded-[28px] sm:rounded-[32px] overflow-hidden shadow-2xl min-h-[360px] sm:h-[440px] md:h-[540px] group border border-black/10 flex flex-col justify-end"
          >
            <img
              src="/images/about/sanctuary-canopy-hd.jpg"
              alt="Knowza ancient canopy sanctuary"
              className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.9] contrast-[1.04] group-hover:scale-105 transition-transform duration-1000 ease-out"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

            <div className="relative z-10 p-5 sm:p-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-5 text-white">
              <div className="max-w-xl">
                <span className="text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.25em] text-knowza-bronze block mb-2 font-medium">
                  SANCTUARY PHILOSOPHY
                </span>
                <p className="text-base sm:text-2xl font-serif font-light italic leading-snug">
                  "Where the noise of the world softens into the rhythm of nature, memory, and heartfelt presence."
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Link
                  to="/gallery"
                  className="w-full sm:w-auto text-center inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-xs uppercase tracking-wider font-medium knowza-btn-liquid knowza-btn-liquid-white group whitespace-nowrap"
                >
                  <span>Explore Sanctuaries</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* ========================================================
          02 ARCHITECTURAL DIALOGUE & LIVING STATS
          ======================================================== */}
      <section className="py-24 md:py-36 bg-white border-b border-black/5 relative">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Column: Eyebrow + Counters */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-4 space-y-10"
            >
              <SectionLabel label="BRAND SOUL" color="olive" />

              <div className="space-y-8 pt-2">
                <div>
                  <span className="text-4xl sm:text-5xl font-serif font-normal text-knowza-dark block tracking-tight">
                    03
                  </span>
                  <span className="text-xs uppercase tracking-wider text-knowza-dark/70 font-medium block mt-1">
                    Living Triad Pillars
                  </span>
                  <p className="text-xs font-sans text-knowza-dark/60 font-light mt-1">
                    Nature, Culture, and genuine Human Connection in harmony.
                  </p>
                </div>

                <div className="pt-6 border-t border-black/10">
                  <span className="text-4xl sm:text-5xl font-serif font-normal text-knowza-dark block tracking-tight">
                    05
                  </span>
                  <span className="text-xs uppercase tracking-wider text-knowza-dark/70 font-medium block mt-1">
                    Cosmic Elements
                  </span>
                  <p className="text-xs font-sans text-knowza-dark/60 font-light mt-1">
                    Earth, Water, Fire, Air, and Space guiding every space.
                  </p>
                </div>

                <div className="pt-6 border-t border-black/10">
                  <span className="text-4xl sm:text-5xl font-serif font-normal text-knowza-dark block tracking-tight">
                    100%
                  </span>
                  <span className="text-xs uppercase tracking-wider text-knowza-dark/70 font-medium block mt-1">
                    Eco-Conscious Architecture
                  </span>
                  <p className="text-xs font-sans text-knowza-dark/60 font-light mt-1">
                    Reclaimed timber, stone masonry, and regenerative living.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Architectural Headline + Detailed Prose */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="lg:col-span-8 space-y-8"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-sans font-medium uppercase text-knowza-dark tracking-tight leading-[1.2]">
                WHAT MAKES A JOURNEY TRULY FELT?{' '}
                <span className="text-[#8A7D4C] font-semibold">
                  DELIBERATE STILLNESS AND HONEST PRESENCE.
                </span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm font-sans text-knowza-dark/75 font-light leading-relaxed border-t border-black/10 pt-8">
                <p>
                  {siteConfig.fullPhilosophy} We believe that travel should not simply insulate
                  a traveler from the world, but offer an affectionate doorway back into it.
                </p>
                <p>
                  Every Knowza sanctuary is selected for its ecological intimacy — from mist-cloaked
                  tea hills in the Western Ghats to quiet backwaters where dawn moves at the rhythm
                  of water.
                </p>
              </div>

              {/* Floating Quote Card */}
              <div className="p-8 bg-[#FAF9F5] rounded-[28px] border border-black/5 flex items-start gap-4 shadow-sm">
                <Sparkles className="w-5 h-5 text-[#8A7D4C] shrink-0 mt-1" />
                <div>
                  <h4 className="text-base font-serif font-normal text-knowza-dark mb-1">
                    An Architecture of Quietness
                  </h4>
                  <p className="text-xs sm:text-sm font-sans text-knowza-dark/70 font-light leading-relaxed">
                    "We do not design buildings to compete with nature; we shape spaces that let the
                    trees, winds, and light do the speaking."
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ========================================================
          03 THE THREE LIVING PILLARS (SCULPTURAL CARDS)
          ======================================================== */}
      <section className="py-24 md:py-36 bg-[#FAF9F5] border-b border-black/5 relative">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <SectionLabel label="PILLARS OF EXPERIENCE" color="olive" alignment="center" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-knowza-dark font-normal">
              The Living Triad
            </h2>
            <p className="text-sm md:text-base font-sans text-knowza-dark/75 font-light leading-relaxed">
              Every Knowza sanctuary weaves together these fundamental dimensions into a unified,
              transformative experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1: Nature */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7 }}
              whileHover={{ y: -6 }}
              className="bg-white border border-black/5 rounded-[28px] p-8 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-500 group"
            >
              <div className="space-y-4">
                <span className="text-[11px] uppercase tracking-[0.25em] text-[#8A7D4C] font-semibold block">
                  01 / NATURE
                </span>
                <h3 className="text-2xl font-serif text-knowza-dark font-normal group-hover:text-knowza-forest transition-colors">
                  Rooted in the Wild
                </h3>
                <p className="text-xs sm:text-sm font-sans text-knowza-dark/75 font-light leading-relaxed">
                  We believe direct immersion in living landscapes restores the human spirit.
                  Untouched forest canopies, mountain streams, and native bio-diverse terrain form the
                  living backdrop of every stay.
                </p>
              </div>
              <div className="rounded-[20px] overflow-hidden aspect-[4/3] mt-8 shadow-sm">
                <img
                  src="/images/gallery/rooted-earth.png"
                  alt="Rooted in nature"
                  className="w-full h-full object-cover filter brightness-95 group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
              </div>
            </motion.div>

            {/* Pillar 2: Culture */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7, delay: 0.15 }}
              whileHover={{ y: -6 }}
              className="bg-white border border-black/5 rounded-[28px] p-8 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-500 group"
            >
              <div className="space-y-4">
                <span className="text-[11px] uppercase tracking-[0.25em] text-[#8A7D4C] font-semibold block">
                  02 / CULTURE
                </span>
                <h3 className="text-2xl font-serif text-knowza-dark font-normal group-hover:text-knowza-forest transition-colors">
                  Living Heritage
                </h3>
                <p className="text-xs sm:text-sm font-sans text-knowza-dark/75 font-light leading-relaxed">
                  Authentic traditions, regional courtyard architecture, culinary heritage, and
                  folklore are not museum relics. They are lived memories celebrated daily through
                  mindful interaction with native elders.
                </p>
              </div>
              <div className="rounded-[20px] overflow-hidden aspect-[4/3] mt-8 shadow-sm">
                <img
                  src="/images/gallery/courtyard.jpg"
                  alt="Living culture and courtyard"
                  className="w-full h-full object-cover filter brightness-95 group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
              </div>
            </motion.div>

            {/* Pillar 3: Connection */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7, delay: 0.3 }}
              whileHover={{ y: -6 }}
              className="bg-white border border-black/5 rounded-[28px] p-8 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-500 group"
            >
              <div className="space-y-4">
                <span className="text-[11px] uppercase tracking-[0.25em] text-[#8A7D4C] font-semibold block">
                  03 / CONNECTION
                </span>
                <h3 className="text-2xl font-serif text-knowza-dark font-normal group-hover:text-knowza-forest transition-colors">
                  Heartfelt Presence
                </h3>
                <p className="text-xs sm:text-sm font-sans text-knowza-dark/75 font-light leading-relaxed">
                  The deepest essence of hospitality is human warmth. Unforced dialogues around an
                  evening fire, shared meals prepared with seasonal harvest, and genuine quiet care
                  create bonds that outlive any itinerary.
                </p>
              </div>
              <div className="rounded-[20px] overflow-hidden aspect-[4/3] mt-8 shadow-sm">
                <img
                  src="/images/connection/connection-hands.jpg"
                  alt="Heartfelt human connection"
                  className="w-full h-full object-cover filter brightness-95 group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ========================================================
          04 HARMONY OF THE 5 ELEMENTS (ARCHITECTURAL MONOLITH)
          ======================================================== */}
      <section className="px-3 sm:px-6 md:px-10 py-12 md:py-20">
        <div className="relative rounded-[28px] sm:rounded-[40px] md:rounded-[48px] bg-gradient-to-br from-[#28351F] via-[#1E2717] to-[#141A10] text-[#F4F0D5] py-14 sm:py-20 lg:py-28 px-5 sm:px-10 md:px-16 overflow-hidden shadow-2xl border border-white/10">
          {/* Ambient luminous circles */}
          <div
            className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#8A7D4C]/25 blur-[100px] pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-[#79864B]/20 blur-[100px] pointer-events-none"
            aria-hidden="true"
          />

          <Container className="relative z-10">
            <div className="max-w-3xl mb-12 sm:mb-16 space-y-4">
              <span className="text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.25em] text-knowza-bronze font-semibold block">
                SACRED GEOMETRY & ETHOS
              </span>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif text-white font-normal tracking-tight">
                Harmony of the 5 Elements
              </h2>
              <p className="text-xs sm:text-sm md:text-base font-sans text-[#F4F0D5]/80 font-light leading-relaxed">
                The official KNOWZA visual mark is composed of five minimalist geometric strokes,
                embodying ancient elemental wisdom translated into experiential living.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
              {fiveElements.map((elem, idx) => (
                <motion.div
                  key={elem.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="p-6 sm:p-8 rounded-[24px] bg-white/5 border border-white/10 backdrop-blur-md space-y-4 sm:space-y-5 flex flex-col justify-between hover:bg-white/10 transition-colors duration-300"
                >
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-widest text-knowza-bronze font-semibold">
                        ELEMENT 0{idx + 1}
                      </span>
                      <span className="text-xs font-serif text-[#F4F0D5]/70 px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
                        {elem.geometry}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-serif text-white font-normal">
                      {elem.name}
                    </h3>

                    <p className="text-xs uppercase tracking-wider text-knowza-cream font-medium">
                      {elem.description}
                    </p>

                    <p className="text-xs sm:text-sm font-sans text-[#F4F0D5]/75 font-light leading-relaxed">
                      {elem.meaning}
                    </p>
                  </div>

                  <div className="w-12 h-[1px] bg-white/20 pt-1" />
                </motion.div>
              ))}
            </div>
          </Container>
        </div>
      </section>

      {/* ========================================================
          05 EDITORIAL CRAFT & ECOLOGICAL HARMONY
          ======================================================== */}
      <section className="py-20 md:py-36 bg-white border-t border-black/5">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Photographic Diptych */}
            <div className="lg:col-span-7 grid grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="rounded-[24px] sm:rounded-[28px] overflow-hidden h-48 sm:h-64 md:h-96 shadow-md border border-black/5"
              >
                <img
                  src="/images/about/presence.png"
                  alt="Mindful presence"
                  className="w-full h-full object-cover filter brightness-95 hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="rounded-[24px] sm:rounded-[28px] overflow-hidden h-48 sm:h-64 md:h-96 shadow-md border border-black/5 mt-6 sm:mt-8 md:mt-12"
              >
                <img
                  src="/images/about/water-ripple.png"
                  alt="Water ripple stillness"
                  className="w-full h-full object-cover filter brightness-95 hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </motion.div>
            </div>

            {/* Editorial Story & Manifesto */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-5 space-y-6"
            >
              <SectionLabel label="SUSTAINED HARMONY" color="olive" />
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-knowza-dark font-normal leading-tight">
                Designed to Age Gracefully with the Terrain
              </h2>
              <p className="text-sm sm:text-base font-sans text-knowza-dark/75 font-light leading-relaxed">
                Rather than imposing artificial concrete monuments upon fragile terrains, every Knowza
                sanctuary is envisioned in slow collaboration with native carpenters, stonemasons,
                and herbalists.
              </p>
              <p className="text-sm sm:text-base font-sans text-knowza-dark/75 font-light leading-relaxed">
                Reclaimed teak, unpolished granite, breathable lime plasters, and rainwater harvesting
                ensure that our presence honors the ancient ground beneath our feet.
              </p>

              <div className="pt-4 flex flex-wrap gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-xs uppercase tracking-wider font-medium knowza-btn-liquid knowza-btn-liquid-dark group"
                >
                  <span>Connect With Concierge</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ========================================================
          06 CLOSING CTA SECTION
          ======================================================== */}
      <CTASection />
    </div>
  );
};
