import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { Container } from '../components/Container';
import { SectionLabel } from '../components/SectionLabel';
import { CTASection } from '../components/CTASection';
import { siteConfig, brandPrinciples } from '../data/site';
import { galleryItems } from '../data/gallery';
import { blogPosts } from '../data/blog';

export const Home: React.FC = () => {
  // Gallery preview items
  const featuredGallery = galleryItems.slice(0, 4);
  const featuredPost = blogPosts[0];

  return (
    <div className="relative overflow-hidden bg-[#FAF9F5] text-knowza-dark">
      {/* ========================================================
          01 HERO MONOLITH (STRICT 100VH FULL SCREEN)
          ======================================================== */}
      <section className="relative w-full h-screen h-[100vh] h-[100dvh] max-h-screen overflow-hidden bg-knowza-deep text-white flex flex-col justify-between px-5 sm:px-10 md:px-14 lg:px-20 pt-20 sm:pt-28 pb-6 sm:pb-10 shadow-2xl">
        {/* Cinematic Background Image with Slow Scale */}
        <div className="absolute inset-0 z-0">
          <motion.div
            initial={{ scale: 1.06 }}
            animate={{ scale: 1.0 }}
            transition={{ duration: 3.5, ease: [0.25, 1, 0.5, 1] }}
            className="w-full h-full"
          >
            <img
              src="/images/hero/hero-sanctuary.jpg"
              alt="Knowza Valley Sanctuary"
              className="w-full h-full object-cover object-center filter brightness-[0.78] contrast-[1.08]"
              loading="eager"
            />
          </motion.div>
          {/* Cinematic Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/55" />
          <div className="absolute inset-0 bg-black/20 mix-blend-multiply" />
        </div>

        {/* Top Spacer */}
        <div className="h-2 sm:h-6" aria-hidden="true" />

        {/* Giant Architectural Display Headline */}
        <div className="relative z-10 max-w-6xl my-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: [0.25, 1, 0.5, 1] }}
          >
            <span className="text-[10px] sm:text-xs font-sans uppercase tracking-[0.28em] text-knowza-cream/80 block mb-2 sm:mb-3 font-medium">
              EST. 2024 · EXPERIENTIAL SANCTUARY
            </span>
            <h1 className="text-[32px] xs:text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[96px] font-serif text-white font-normal uppercase tracking-tight leading-[1.02] sm:leading-[0.95] select-none break-words">
              WHERE NATURE, <br />
              <span className="font-light italic text-knowza-cream tracking-wide">CULTURE</span> & HEART MEET.
            </h1>
          </motion.div>
        </div>

        {/* Bottom Hero Bar */}
        <div className="relative z-10 pt-4 sm:pt-8 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 sm:gap-6">
          {/* Bottom-Left: Pill CTAs */}
          <div className="w-full sm:w-auto">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <Link
                to="/gallery"
                className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full font-sans font-medium text-xs tracking-wider uppercase shadow-xl knowza-btn-liquid knowza-btn-liquid-white-fill group whitespace-nowrap"
              >
                <span>Explore Sanctuaries</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full font-sans font-medium text-xs tracking-wider uppercase knowza-btn-liquid knowza-btn-liquid-white group text-center whitespace-nowrap"
              >
                <span>Our Story</span>
              </Link>
            </div>
          </div>

          {/* Bottom-Right: Floating Social Proof Pill */}
          <div className="flex justify-start sm:justify-end">
            <div className="inline-flex items-center gap-3 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white shadow-lg">
              <div className="flex -space-x-2">
                <div className="w-6 sm:w-7 h-6 sm:h-7 rounded-full bg-knowza-olive border-2 border-white/50 flex items-center justify-center text-[9px] sm:text-[10px] font-medium text-white">K</div>
                <div className="w-6 sm:w-7 h-6 sm:h-7 rounded-full bg-knowza-bronze border-2 border-white/50 flex items-center justify-center text-[9px] sm:text-[10px] font-medium text-white">N</div>
                <div className="w-6 sm:w-7 h-6 sm:h-7 rounded-full bg-knowza-taupe border-2 border-white/50 flex items-center justify-center text-[9px] sm:text-[10px] font-medium text-white">Z</div>
              </div>
              <div className="text-left">
                <span className="block text-xs font-semibold leading-tight text-white tracking-wide">500+</span>
                <span className="block text-[9px] sm:text-[10px] text-white/75 font-light leading-tight">Soulful Encounters</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          02 ARCHITECTURAL DIALOGUE & LIVING STATS
          Matching Reference Section 2 ("EVERY HOME WE CREATE...")
          ======================================================== */}
      <section id="brand-statement" className="py-24 md:py-36 bg-white relative">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Column: Eyebrow + Big Counters */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-4 space-y-10"
            >
              <span className="text-xs font-sans uppercase tracking-[0.25em] text-knowza-dark/60 font-medium block">
                About Knowza
              </span>

              <div className="space-y-8 pt-2">
                <div>
                  <span className="text-4xl sm:text-5xl font-serif font-normal text-knowza-dark block tracking-tight">
                    03
                  </span>
                  <span className="text-xs uppercase tracking-wider text-knowza-dark/70 font-medium block mt-1">
                    Living Triad Pillars
                  </span>
                  <p className="text-xs font-sans text-knowza-dark/60 font-light mt-1">
                    Nature, Culture, and genuine Human Connection.
                  </p>
                </div>

                <div className="pt-6 border-t border-black/10">
                  <span className="text-4xl sm:text-5xl font-serif font-normal text-knowza-dark block tracking-tight">
                    100%
                  </span>
                  <span className="text-xs uppercase tracking-wider text-knowza-dark/70 font-medium block mt-1">
                    Authentic Reverence
                  </span>
                  <p className="text-xs font-sans text-knowza-dark/60 font-light mt-1">
                    Organic architecture built in harmony with native terrain.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Giant Architectural Headline + Pill CTA */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="lg:col-span-8 space-y-8"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-sans font-medium uppercase text-knowza-dark tracking-tight leading-[1.2]">
                EVERY SANCTUARY WE CREATE IS A DIALOGUE BETWEEN{' '}
                <span className="text-[#8A7D4C] font-semibold">
                  ANCIENT NATURE, CULTURE
                </span>{' '}
                AND THE SOUL WHO DARES TO EXPERIENCE IT. DARE MORE.
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm font-sans text-knowza-dark/75 font-light leading-relaxed border-t border-black/10 pt-8">
                <p>
                  {siteConfig.description} We curate destinations where the boundary between architecture and ancient wilderness naturally dissolves.
                </p>
                <p>
                  {siteConfig.fullPhilosophy} {siteConfig.subPhilosophy}
                </p>
              </div>

              <div className="pt-2">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-xs uppercase tracking-wider font-medium knowza-btn-liquid knowza-btn-liquid-dark group"
                >
                  <span>Explore Philosophy</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ========================================================
          03 THREE ARCHITECTURAL PILLARS (TRIPTYCH CARDS)
          Matching Reference Section 3 (Private Library, Cinema, Living Room)
          ======================================================== */}
      <section className="py-20 md:py-28 bg-white border-t border-black/5 relative">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Card 1: Heritage Courtyard */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7 }}
              className="group cursor-pointer"
            >
              <div className="rounded-[28px] overflow-hidden aspect-[4/3] bg-knowza-deep shadow-md relative">
                <img
                  src="/images/gallery/courtyard.jpg"
                  alt="Heritage Courtyard"
                  className="w-full h-full object-cover filter brightness-[0.92] group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
              </div>
              <div className="pt-4 space-y-1">
                <h4 className="text-base sm:text-lg font-serif font-medium text-knowza-dark group-hover:text-knowza-forest transition-colors">
                  Heritage Courtyard
                </h4>
                <p className="text-xs font-sans text-knowza-dark/70 font-light leading-relaxed">
                  A quiet space where localized wisdom and design exist in perfect harmony.
                </p>
              </div>
            </motion.div>

            {/* Card 2: Canopy Retreat */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="group cursor-pointer"
            >
              <div className="rounded-[28px] overflow-hidden aspect-[4/3] bg-knowza-deep shadow-md relative">
                <img
                  src="/images/gallery/treehouse-retreat.png"
                  alt="Canopy Retreat"
                  className="w-full h-full object-cover filter brightness-[0.92] group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
              </div>
              <div className="pt-4 space-y-1">
                <h4 className="text-base sm:text-lg font-serif font-medium text-knowza-dark group-hover:text-knowza-forest transition-colors">
                  Canopy Sanctuary
                </h4>
                <p className="text-xs font-sans text-knowza-dark/70 font-light leading-relaxed">
                  High amid mountain mist and tea foliage. Your own secluded refuge.
                </p>
              </div>
            </motion.div>

            {/* Card 3: Living Veranda */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="group cursor-pointer"
            >
              <div className="rounded-[28px] overflow-hidden aspect-[4/3] bg-knowza-deep shadow-md relative">
                <img
                  src="/images/gallery/tea-hills.jpg"
                  alt="Living Veranda"
                  className="w-full h-full object-cover filter brightness-[0.92] group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
              </div>
              <div className="pt-4 space-y-1">
                <h4 className="text-base sm:text-lg font-serif font-medium text-knowza-dark group-hover:text-knowza-forest transition-colors">
                  The Living Veranda
                </h4>
                <p className="text-xs font-sans text-knowza-dark/70 font-light leading-relaxed">
                  Designed to soothe. Built to awaken the senses and connect with living memory.
                </p>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>


      {/* ========================================================
          05 THE KNOWZA EXPERIENCE PRINCIPLES (BENTO GRID CARD UI)
          Refined into clean architectural cards with warm bronze accents
          ======================================================== */}
      <section className="py-24 md:py-32 bg-[#FAF9F5] border-t border-black/5 relative overflow-hidden">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mb-16 space-y-4"
          >
            <SectionLabel label="FOUNDATIONS" color="olive" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-knowza-dark font-normal tracking-tight">
              The Principles of Our Experience
            </h2>
            <p className="text-sm md:text-base font-sans text-knowza-dark/75 font-light leading-relaxed pt-1">
              Every detail of a Knowza journey is grounded in four guiding principles that ensure reverence for the land and soulful human presence.
            </p>
          </motion.div>

          {/* Bento Grid Architecture */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left 8-Column Block (Top 2 Cards + Bottom Wide Card) */}
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
              {/* Top Row: 2 Clean Rounded Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Card 1: 01 / Rooted in Place */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  whileHover={{ y: -6 }}
                  className="bg-white border border-black/5 rounded-[28px] p-8 md:p-9 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-500 min-h-[300px] group cursor-default"
                >
                  <div className="text-center">
                    <span className="text-[11px] font-sans uppercase tracking-[0.25em] text-[#8A7D4C] font-semibold block mb-2">
                      01 / FOUNDATION
                    </span>
                    <h3 className="text-xl sm:text-2xl font-serif text-knowza-dark font-normal tracking-wide mb-2.5">
                      Rooted in Place
                    </h3>
                    <p className="text-xs sm:text-[13px] font-sans text-knowza-dark/75 font-light leading-relaxed max-w-xs mx-auto">
                      Every sanctuary is an organic extension of its natural habitat, building in quiet rhythm with untouched wilderness.
                    </p>
                  </div>

                  {/* Organic Wood Rings / Topographic Emblem */}
                  <div className="flex justify-center pt-6">
                    <div className="relative w-24 h-20 flex items-center justify-center text-[#8A7D4C]/80 transition-transform duration-700 ease-out group-hover:scale-105">
                      <svg viewBox="0 0 120 90" fill="none" className="w-full h-full stroke-current">
                        <path d="M 15 50 C 20 20, 60 15, 105 35" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
                        <path d="M 22 56 C 28 32, 65 28, 98 44" strokeWidth="2.5" strokeLinecap="round" opacity="0.75" />
                        <path d="M 32 62 C 38 42, 68 38, 90 52" strokeWidth="2.5" strokeLinecap="round" opacity="0.65" />
                        <path d="M 44 68 C 48 54, 70 50, 82 60" strokeWidth="2.5" strokeLinecap="round" opacity="0.55" />
                        <path d="M 55 72 C 58 64, 70 62, 75 66" strokeWidth="2.5" strokeLinecap="round" opacity="0.45" />
                      </svg>
                    </div>
                  </div>
                </motion.div>

                {/* Card 2: 02 / Shaped by Culture */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  whileHover={{ y: -6 }}
                  className="bg-white border border-black/5 rounded-[28px] p-8 md:p-9 flex flex-col items-center text-center justify-between shadow-sm hover:shadow-xl transition-all duration-500 min-h-[300px] group cursor-default"
                >
                  <div className="relative mb-2 flex items-center justify-center">
                    <div className="absolute w-24 h-24 rounded-full bg-[#8A7D4C]/20 blur-xl pointer-events-none" />
                    <motion.div
                      animate={{ y: [-3, 3, -3] }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                      className="w-14 h-14 rounded-full bg-gradient-to-br from-[#EAE0CD] via-[#8C7A5C] to-[#2B2014] shadow-lg shadow-[#3D2F20]/30 border border-white/30 relative z-10 transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>

                  <div>
                    <span className="text-[11px] font-sans uppercase tracking-[0.25em] text-[#8A7D4C] font-semibold block mb-2">
                      02 / FOUNDATION
                    </span>
                    <h3 className="text-xl sm:text-2xl font-serif text-knowza-dark font-normal tracking-wide mb-2.5">
                      Shaped by Culture
                    </h3>
                    <p className="text-xs sm:text-[13px] font-sans text-knowza-dark/75 font-light leading-relaxed max-w-xs mx-auto">
                      Living heritage, localized wisdom, and traditional craftsmanship guide each experience, honoring native memory.
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Bottom Row: Wide Photographic Card (03 / Connected by Heart) */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.8, delay: 0.3 }}
                whileHover={{ y: -6 }}
                className="relative rounded-[28px] overflow-hidden min-h-[280px] md:h-[310px] group shadow-md hover:shadow-2xl transition-all duration-500 border border-black/5 cursor-default"
              >
                <img
                  src="/images/gallery/backwater.jpg"
                  alt="Connected by Heart - Morning canoe on misted backwaters"
                  className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.88] contrast-[1.05] transition-transform duration-1000 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/30 group-hover:from-black/90 group-hover:via-black/50 transition-colors duration-500" />

                <div className="relative z-10 h-full p-8 md:p-10 flex flex-col items-center justify-center text-center text-[#F4F0D5]">
                  <span className="text-[11px] font-sans uppercase tracking-[0.25em] text-knowza-bronze font-semibold block mb-2">
                    03 / CONNECTION
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-serif text-white font-normal tracking-wide mb-3">
                    Connected by Heart
                  </h3>
                  <p className="text-xs sm:text-[13px] font-sans text-white/90 font-light leading-relaxed max-w-md mx-auto">
                    Hospitality is reimagined as genuine human presence. Meaningful encounters between travelers and local keepers foster quiet moments that outlast any itinerary.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Right 4-Column Tall Monolith (04 / Thoughtfully Experienced & Bespoke Sanctuaries) */}
            <div className="lg:col-span-5 xl:col-span-4">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.8, delay: 0.25 }}
                whileHover={{ y: -6 }}
                className="h-full min-h-[580px] md:min-h-[640px] rounded-[28px] bg-gradient-to-br from-[#3D3126] via-[#2A2016] to-[#1C150E] text-[#F4F0D5] p-8 md:p-10 flex flex-col justify-between relative overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-[#4E3F2E]/60 group cursor-default"
              >
                <div
                  className="absolute -top-10 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-[#8A7D4C]/20 blur-[80px] pointer-events-none"
                  aria-hidden="true"
                />

                {/* Top Section */}
                <div className="relative z-10 text-center md:text-left pt-2">
                  <span className="text-[11px] font-sans uppercase tracking-[0.25em] text-knowza-bronze font-semibold block mb-2">
                    04 / FOUNDATION
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-serif text-[#F4F0D5] font-normal tracking-wide mb-3">
                    Thoughtfully Experienced
                  </h3>
                  <p className="text-xs sm:text-[13px] font-sans text-[#F4F0D5]/80 font-light leading-relaxed">
                    Slow travel elevated into an art form. Time slows to the cadence of rustling leaves, dawn birdsong, and the warmth of a shared morning fire.
                  </p>
                </div>

                {/* Bottom Section */}
                <div className="relative z-10 text-center md:text-left pt-10 border-t border-[#8A7D4C]/30">
                  <h4 className="text-xl sm:text-2xl font-serif text-[#F4F0D5] font-normal tracking-wide mb-2.5">
                    Bespoke Sanctuaries
                  </h4>
                  <p className="text-xs sm:text-[13px] font-sans text-[#F4F0D5]/80 font-light leading-relaxed mb-6">
                    We partner with local craft masters, indigenous botanists, and ancestral keepers to curate unhurried, soul-stirring journeys tailored to individual rhythm.
                  </p>

                  <div className="flex justify-center md:justify-start">
                    <Link
                      to="/about"
                      className="inline-flex items-center gap-2 text-xs uppercase tracking-widest-editorial font-medium px-7 py-3 rounded-full group knowza-btn-liquid knowza-btn-liquid-secondary"
                    >
                      <span>Discover Philosophy</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </Container>
      </section>

      {/* ========================================================
          06 FEATURED GALLERY PREVIEW
          ======================================================== */}
      <section className="py-24 md:py-32 bg-white border-t border-black/5">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6"
          >
            <div>
              <SectionLabel label="VISUAL ARCHIVE" color="olive" />
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-knowza-dark font-normal mt-4">
                Moments from Knowza
              </h2>
            </div>
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest-editorial font-medium rounded-full px-7 py-3 transition-colors group knowza-btn-liquid knowza-btn-liquid-dark"
            >
              <span>View Full Gallery</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>

          {/* Asymmetric Gallery Grid Preview with Clean Rounded Architecture */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.85, delay: 0.15 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-6"
          >
            {/* Large feature image (7 cols) */}
            <div className="md:col-span-7 h-[360px] md:h-[480px] rounded-[28px] overflow-hidden relative group shadow-md">
              <Link to="/gallery" className="block w-full h-full">
                <img
                  src={featuredGallery[0]?.image}
                  alt={featuredGallery[0]?.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="text-[10px] uppercase tracking-widest-editorial text-knowza-bronze block mb-1">
                    {featuredGallery[0]?.category}
                  </span>
                  <h4 className="text-xl md:text-2xl font-serif font-normal">
                    {featuredGallery[0]?.title}
                  </h4>
                </div>
              </Link>
            </div>

            {/* Right Two Stacked (5 cols) */}
            <div className="md:col-span-5 flex flex-col gap-6">
              <div className="h-[220px] md:h-[228px] rounded-[28px] overflow-hidden relative group shadow-md">
                <Link to="/gallery" className="block w-full h-full">
                  <img
                    src={featuredGallery[1]?.image}
                    alt={featuredGallery[1]?.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-[10px] uppercase tracking-widest-editorial text-knowza-bronze block mb-1">
                      {featuredGallery[1]?.category}
                    </span>
                    <h4 className="text-base font-serif font-normal">
                      {featuredGallery[1]?.title}
                    </h4>
                  </div>
                </Link>
              </div>

              <div className="h-[220px] md:h-[228px] rounded-[28px] overflow-hidden relative group shadow-md">
                <Link to="/gallery" className="block w-full h-full">
                  <img
                    src={featuredGallery[2]?.image}
                    alt={featuredGallery[2]?.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-[10px] uppercase tracking-widest-editorial text-knowza-bronze block mb-1">
                      {featuredGallery[2]?.category}
                    </span>
                    <h4 className="text-base font-serif font-normal">
                      {featuredGallery[2]?.title}
                    </h4>
                  </div>
                </Link>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* ========================================================
          07 FEATURED STORY / BLOG
          ======================================================== */}
      {featuredPost && (
        <section className="py-24 md:py-32 bg-[#FAF9F5] border-t border-black/5">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8 }}
              className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6"
            >
              <div>
                <SectionLabel label="DISPATCHES" color="olive" />
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-knowza-dark font-normal mt-4">
                  Stories from the Journey
                </h2>
              </div>
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest-editorial font-medium rounded-full px-7 py-3 group knowza-btn-liquid knowza-btn-liquid-dark"
              >
                <span>Read All Stories</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.85, delay: 0.15 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center bg-white p-5 sm:p-8 md:p-12 rounded-[28px] sm:rounded-[32px] border border-black/5 shadow-md"
            >
              <div className="lg:col-span-6 h-[240px] sm:h-[320px] md:h-[400px] rounded-[20px] sm:rounded-[24px] overflow-hidden shadow-sm">
                <img
                  src={featuredPost.coverImage}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </div>

              <div className="lg:col-span-6 space-y-6">
                <div className="flex items-center gap-3 text-xs uppercase tracking-widest-editorial text-knowza-bronze font-medium">
                  <span>{featuredPost.category}</span>
                  <span>·</span>
                  <span className="text-knowza-dark/50">{featuredPost.date}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-serif text-knowza-dark font-normal leading-snug">
                  {featuredPost.title}
                </h3>

                <p className="text-sm font-sans text-knowza-dark/75 font-light leading-relaxed">
                  {featuredPost.excerpt}
                </p>

                <div className="pt-2">
                  <Link
                    to={`/blog/${featuredPost.slug}`}
                    className="inline-flex items-center gap-2 text-xs uppercase tracking-widest-editorial font-medium px-8 py-3.5 rounded-full shadow-md group knowza-btn-liquid knowza-btn-liquid-olive-fill"
                  >
                    <span>Read Article</span>
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </Container>
        </section>
      )}

      {/* ========================================================
          08 CLOSING INVITATION CTA SECTION
          ======================================================== */}
      <CTASection />
    </div>
  );
};
