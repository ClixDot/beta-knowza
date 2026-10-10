import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { Container } from '../components/Container';
import { SectionLabel } from '../components/SectionLabel';
import { CTASection } from '../components/CTASection';
import { siteConfig, brandPrinciples } from '../data/site';
import { galleryItems } from '../data/gallery';
import { blogPosts } from '../data/blog';
import { Counter } from '../components/Counter';
import { TypewriterHeading } from '../components/TypewriterHeading';
import { InfiniteScrollMarquee } from '../components/InfiniteScrollMarquee';
import { InteractiveDispatchesCard } from '../components/InteractiveDispatchesCard';

interface ScrollPillarCardProps {
  image: string;
  alt: string;
  title: string;
  description: string;
  startOffset?: string;
  endOffset?: string;
}

const ScrollPillarCard: React.FC<ScrollPillarCardProps> = ({
  image,
  alt,
  title,
  description,
  startOffset = '0.92',
  endOffset = '0.45',
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: [`start ${startOffset}` as any, `start ${endOffset}` as any],
  });

  // Low opacity (0.15) increasing to full opacity (1.0) as you scroll
  const opacity = useTransform(scrollYProgress, [0, 1], [0.15, 1]);
  // Jump / drop in from the TOP (-85px), landing with a subtle bounce (+8px) and settling into place (0px)
  const y = useTransform(scrollYProgress, [0, 0.78, 1], [-85, 8, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.78, 1], [0.92, 1.02, 1]);

  return (
    <motion.div
      ref={cardRef}
      style={{ opacity, y, scale }}
      className="group cursor-pointer will-change-transform"
    >
      <div className="rounded-[28px] overflow-hidden aspect-[4/3] bg-knowza-deep shadow-md relative">
        <img
          src={image}
          alt={alt}
          className="w-full h-full object-cover filter brightness-[0.92] group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />
      </div>
      <div className="pt-4 space-y-1">
        <h4 className="text-base sm:text-lg font-serif font-medium text-knowza-dark group-hover:text-knowza-forest transition-colors">
          {title}
        </h4>
        <p className="text-xs font-sans text-knowza-dark/70 font-light leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

export const Home: React.FC = () => {
  const heroWrapperRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroWrapperRef,
    offset: ['start start', 'end start'],
  });

  // Hero section size shrinks inward on scroll
  const heroScale = useTransform(heroScrollProgress, [0, 0.85], [1, 0.88]);
  const heroBorderRadius = useTransform(heroScrollProgress, [0, 0.75], ['0px', '40px']);
  const heroDimOverlay = useTransform(heroScrollProgress, [0, 0.85], [0, 0.35]);

  // Staggered directional scroll parallax:
  // Line 1 drifts smoothly to the left
  const line1X = useTransform(heroScrollProgress, [0, 0.8], ['0%', '-24%']);
  // Line 2 drifts smoothly to the right
  const line2X = useTransform(heroScrollProgress, [0, 0.8], ['0%', '24%']);
  // Line 3 drifts smoothly to the left with varied pace
  const line3X = useTransform(heroScrollProgress, [0, 0.8], ['0%', '-16%']);

  const headlineOpacity = useTransform(heroScrollProgress, [0, 0.75], [1, 0.25]);
  const subY = useTransform(heroScrollProgress, [0, 0.5], ['0px', '-35px']);


  // Gallery section background WORK parallax
  const gallerySectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress: galleryScroll } = useScroll({
    target: gallerySectionRef,
    offset: ['start end', 'end start'],
  });
  const bgWorkLine1X = useTransform(galleryScroll, [0, 1], ['5%', '-15%']);
  const bgWorkLine2X = useTransform(galleryScroll, [0, 1], ['-15%', '5%']);
  const bgWorkLine3X = useTransform(galleryScroll, [0, 1], ['2%', '-12%']);

  // Gallery preview cards matching reference UI
  const galleryCards = [
    {
      image: '/images/hero/hero-sanctuary.jpg',
      title: 'The Valley Sanctuary at Dusk',
      category: 'PLACES',
      tiltClass: '-rotate-6 hover:-rotate-1',
    },
    {
      image: '/images/culture/meditation.png',
      title: 'Mindful Forest Presence',
      category: 'EXPERIENCES',
      tiltClass: '-rotate-1 hover:rotate-0',
    },
    {
      image: '/images/connection/connection-hands.jpg',
      title: 'Kinship in the Canopy',
      category: 'PEOPLE',
      tiltClass: 'rotate-4 hover:rotate-1',
    },
    {
      image: '/images/nature/fern.png',
      title: 'Lush Forest Canopy & Fern',
      category: 'NATURE',
      tiltClass: '-rotate-3 hover:rotate-0',
    },
    {
      image: '/images/gallery/treehouse-retreat.png',
      title: 'Treehouse Retreat in the Mist',
      category: 'PLACES',
      tiltClass: 'rotate-3 hover:rotate-0',
    },
    {
      image: '/images/gallery/tea-hills.jpg',
      title: 'Misty Dawn Over Tea Hills',
      category: 'LANDSCAPES',
      tiltClass: '-rotate-4 hover:rotate-0',
    },
  ];
  const infiniteGalleryCards = [...galleryCards, ...galleryCards];

  return (
    <div className="relative overflow-hidden bg-[#F7F5E0] text-knowza-dark">
      {/* ========================================================
          01 HERO MONOLITH (INWARD SHRINK ON SCROLL)
          ======================================================== */}
      <div ref={heroWrapperRef} className="relative h-[112vh] w-full bg-[#F7F5E0]">
        <div className="sticky top-0 h-screen h-[100vh] h-[100dvh] w-full flex items-center justify-center overflow-hidden">
          <motion.section
            style={{
              scale: heroScale,
              borderRadius: heroBorderRadius,
              transformOrigin: 'center center',
            }}
            className="relative w-full h-full overflow-hidden bg-knowza-deep text-white flex flex-col justify-between px-5 sm:px-10 md:px-14 lg:px-20 pt-20 sm:pt-28 pb-6 sm:pb-10 shadow-2xl will-change-transform"
          >
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
              {/* Ambient Darkening Overlay on Scale Down */}
              <motion.div
                style={{ opacity: heroDimOverlay }}
                className="absolute inset-0 bg-black/40 pointer-events-none z-[1]"
              />
            </div>

            {/* Top Spacer */}
            <div className="h-2 sm:h-6" aria-hidden="true" />

            {/* Giant Architectural Display Headline */}
            <div className="relative z-10 max-w-6xl mx-auto my-auto w-full text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1, ease: [0.25, 1, 0.5, 1] }}
                className="flex flex-col items-center text-center"
              >
                <motion.span
                  style={{ y: subY, opacity: headlineOpacity }}
                  className="text-[10px] sm:text-xs font-sans uppercase tracking-[0.28em] text-knowza-cream/80 block mb-2 sm:mb-3 font-medium will-change-transform text-center"
                >
                  EST. 2024 · EXPERIENTIAL SANCTUARY
                </motion.span>
                <h1 className="font-display font-black italic uppercase text-3xl xs:text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[110px] 2xl:text-[128px] text-[#ECE7D7] tracking-[0.03em] sm:tracking-[0.06em] lg:tracking-[0.08em] leading-[0.95] sm:leading-[0.86] select-none break-words flex flex-col items-center text-center px-2">
                  <motion.span
                    style={{ x: line1X, opacity: headlineOpacity }}
                    className="inline-block whitespace-nowrap will-change-transform"
                  >
                    WHERE NATURE,
                  </motion.span>
                  <motion.span
                    style={{ x: line2X, opacity: headlineOpacity }}
                    className="inline-block whitespace-nowrap will-change-transform text-white"
                  >
                    CULTURE
                  </motion.span>
                  <motion.span
                    style={{ x: line3X, opacity: headlineOpacity }}
                    className="inline-block whitespace-nowrap will-change-transform"
                  >
                    & HEART MEET.
                  </motion.span>
                </h1>
              </motion.div>
            </div>

            {/* Bottom Hero Bar */}
            <div className="relative z-10 pt-4 sm:pt-8 flex justify-center w-full">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
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
          </motion.section>
        </div>
      </div>

      {/* ========================================================
          02 ARCHITECTURAL DIALOGUE & LIVING STATS
          Matching Reference Section 2 ("EVERY HOME WE CREATE...")
          ======================================================== */}
      <section id="brand-statement" className="pt-8 sm:pt-12 md:pt-14 pb-20 md:pb-28 bg-[#F7F5E0] relative">
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
                    <Counter value={3} padZero={true} duration={1.6} />
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
                    <Counter value={100} suffix="%" duration={2.2} />
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
              <TypewriterHeading
                className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-sans font-medium uppercase text-knowza-dark tracking-tight leading-[1.2]"
                segments={[
                  {
                    text: 'EVERY SANCTUARY WE CREATE IS A DIALOGUE BETWEEN ',
                    className: 'text-knowza-dark',
                  },
                  {
                    text: 'ANCIENT NATURE, CULTURE',
                    className: 'text-[#8A7D4C] font-semibold',
                  },
                  {
                    text: ' AND THE SOUL WHO DARES TO EXPERIENCE IT. DARE MORE.',
                    className: 'text-knowza-dark',
                  },
                ]}
              />

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
      <section className="py-20 md:py-28 bg-[#F7F5E0] border-t border-black/5 relative">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Card 1: Heritage Courtyard */}
            <ScrollPillarCard
              image="/images/gallery/courtyard.jpg"
              alt="Heritage Courtyard"
              title="Heritage Courtyard"
              description="A quiet space where localized wisdom and design exist in perfect harmony."
              startOffset="0.92"
              endOffset="0.48"
            />

            {/* Card 2: Canopy Sanctuary */}
            <ScrollPillarCard
              image="/images/gallery/treehouse-retreat.png"
              alt="Canopy Sanctuary"
              title="Canopy Sanctuary"
              description="High amid mountain mist and tea foliage. Your own secluded refuge."
              startOffset="0.86"
              endOffset="0.42"
            />

            {/* Card 3: The Living Veranda */}
            <ScrollPillarCard
              image="/images/gallery/tea-hills.jpg"
              alt="The Living Veranda"
              title="The Living Veranda"
              description="Designed to soothe. Built to awaken the senses and connect with living memory."
              startOffset="0.80"
              endOffset="0.36"
            />
          </div>
        </Container>
      </section>


      {/* ========================================================
          05 THE KNOWZA EXPERIENCE PRINCIPLES (BENTO GRID CARD UI)
          Clean architectural bento grid with warm bronze accents
          ======================================================== */}
      <section className="py-20 md:py-28 bg-[#F7F5E0] border-t border-black/5 relative overflow-hidden">
        <Container className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mb-12 sm:mb-16 space-y-4"
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
                  className="bg-[#F7F5E0] border border-black/10 rounded-[28px] p-8 md:p-9 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-500 min-h-[300px] group cursor-default"
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
                  className="bg-[#79864B] border border-[#8C9A5C]/40 text-white rounded-[28px] p-8 md:p-9 flex flex-col items-center text-center justify-center shadow-md hover:shadow-2xl transition-all duration-500 min-h-[300px] group cursor-default"
                >
                  <div>
                    <span className="text-[11px] font-sans uppercase tracking-[0.25em] text-[#EEE9BF] font-semibold block mb-2">
                      02 / FOUNDATION
                    </span>
                    <h3 className="text-xl sm:text-2xl font-serif text-[#FAF9F2] font-normal tracking-wide mb-2.5">
                      Shaped by Culture
                    </h3>
                    <p className="text-xs sm:text-[13px] font-sans text-white/90 font-light leading-relaxed max-w-xs mx-auto">
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
          06 FEATURED GALLERY PREVIEW (REFERENCE UI)
          ======================================================== */}
      <section
        ref={gallerySectionRef}
        className="relative py-20 sm:py-28 md:py-36 bg-[#79864B] text-white overflow-hidden border-t border-black/10"
      >
        {/* Giant Watermark Repeating WORK Background Typography with Scroll Parallax */}
        <div className="absolute inset-0 flex flex-col justify-around pointer-events-none select-none overflow-hidden opacity-35 z-0">
          <motion.div
            style={{ x: bgWorkLine1X }}
            className="font-display font-black italic tracking-tighter uppercase text-[#566033] text-[18vw] sm:text-[16vw] leading-[0.8] whitespace-nowrap will-change-transform"
          >
            WORK &nbsp;&middot;&nbsp; WORK &nbsp;&middot;&nbsp; WORK &nbsp;&middot;&nbsp; WORK &nbsp;&middot;&nbsp; WORK
          </motion.div>
          <motion.div
            style={{ x: bgWorkLine2X }}
            className="font-display font-black italic tracking-tighter uppercase text-[#566033] text-[18vw] sm:text-[16vw] leading-[0.8] whitespace-nowrap will-change-transform"
          >
            WORK &nbsp;&middot;&nbsp; WORK &nbsp;&middot;&nbsp; WORK &nbsp;&middot;&nbsp; WORK &nbsp;&middot;&nbsp; WORK
          </motion.div>
          <motion.div
            style={{ x: bgWorkLine3X }}
            className="font-display font-black italic tracking-tighter uppercase text-[#566033] text-[18vw] sm:text-[16vw] leading-[0.8] whitespace-nowrap will-change-transform"
          >
            WORK &nbsp;&middot;&nbsp; WORK &nbsp;&middot;&nbsp; WORK &nbsp;&middot;&nbsp; WORK &nbsp;&middot;&nbsp; WORK
          </motion.div>
        </div>

        <Container className="relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14 gap-6"
          >
            <div>
              <div className="inline-flex items-center gap-2 mb-2">
                <span className="w-6 h-[1.5px] bg-[#EEE9BF]" />
                <span className="text-[11px] uppercase tracking-widest-editorial text-[#EEE9BF] font-semibold">
                  VISUAL ARCHIVE
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#FAF9F2] font-normal">
                Moments from Knowza
              </h2>
            </div>
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest-editorial font-medium rounded-full px-6 py-2.5 bg-white/10 hover:bg-white/20 text-[#FAF9F2] border border-white/15 transition-all group w-fit backdrop-blur-sm"
            >
              <span>View Full Gallery</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1 text-[#EEE9BF]" />
            </Link>
          </motion.div>
        </Container>

        {/* Continuous Non-Stop Marquee with Scroll Direction Responsiveness */}
        <InfiniteScrollMarquee cards={galleryCards} />
      </section>

      {/* ========================================================
          07 FEATURED STORY / BLOG
          ======================================================== */}
      {blogPosts && blogPosts.length > 0 && (
        <section className="py-24 md:py-32 bg-[#F7F5E0] border-t border-black/5 overflow-hidden">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8 }}
              className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14 gap-6"
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

            <InteractiveDispatchesCard posts={blogPosts} />
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
