import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, ArrowRight, Sparkles, Compass, Leaf, Heart, Sun, Feather, ShieldCheck } from 'lucide-react';
import { Container } from '../components/Container';
import { SectionLabel } from '../components/SectionLabel';
import { InnerPageHero } from '../components/InnerPageHero';
import { CTASection } from '../components/CTASection';
import { siteConfig } from '../data/site';
import { Counter } from '../components/Counter';
import { TypewriterHeading } from '../components/TypewriterHeading';
import { CuratedPathwaysSection } from '../components/CuratedPathwaysSection';

gsap.registerPlugin(ScrollTrigger);

export const About: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroBannerRef = useRef<HTMLDivElement>(null);
  const heroImgRef = useRef<HTMLImageElement>(null);
  const heroBadgeRef = useRef<HTMLDivElement>(null);
  const diptychLeftRef = useRef<HTMLDivElement>(null);
  const diptychRightRef = useRef<HTMLDivElement>(null);
  const quoteCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Refresh ScrollTrigger when DOM is fully ready
    ScrollTrigger.refresh();

    const ctx = gsap.context(() => {
      // ========================================================
      // 01 HERO BANNER PARALLAX & FLUID EXPANSION
      // ========================================================
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

      // ========================================================
      // 02 LIVING STATS: SCRUBBED BARS & REVEAL
      // ========================================================
      const statItems = gsap.utils.toArray<HTMLElement>('.gsap-stat-item');
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

      // ========================================================
      // 03 THE THREE LIVING PILLARS: 3D CARD LIFT + IMAGE SCRUB
      // ========================================================
      const pillarCards = gsap.utils.toArray<HTMLElement>('.gsap-pillar-card');
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





      // ========================================================
      // 05 EDITORIAL DIPTYCH: DUAL OPPOSING PARALLAX
      // ========================================================
      if (diptychLeftRef.current && diptychRightRef.current) {
        // Left image scrolls upward
        gsap.fromTo(
          diptychLeftRef.current,
          { yPercent: -10 },
          {
            yPercent: 12,
            ease: 'none',
            scrollTrigger: {
              trigger: '.gsap-diptych-container',
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
              trigger: '.gsap-diptych-container',
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2,
            },
          }
        );
      }

      // ========================================================
      // 06 AMBIENT BACKGROUND GLOW DRIFT
      // ========================================================
      gsap.to('.gsap-ambient-orb', {
        yPercent: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 2,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative overflow-hidden bg-[#EDEABF] text-knowza-dark">
      {/* ========================================================
          01 ARCHITECTURAL EDITORIAL HERO
          ======================================================== */}
      <InnerPageHero
        watermarkTop="ABOUT"
        titleLine1="ROOTED IN PLACE."
        titleHighlight="SHAPED BY CULTURE."
        titleLine2="CONNECTED BY HEART."
        className="border-b-0 pb-10 sm:pb-14 md:pb-16"
      />

      {/* Sanctuary Banner Section */}
      <section className="pb-16 md:pb-24 border-b border-black/5 bg-[#EDEABF]">
        <Container>

          {/* Cinematic Wide Sanctuary Banner Frame with GSAP Parallax & Smooth Expand */}
          <div
            ref={heroBannerRef}
            className="mt-12 sm:mt-14 relative rounded-[28px] sm:rounded-[32px] overflow-hidden shadow-2xl min-h-[360px] sm:h-[440px] md:h-[540px] group border border-black/10 flex flex-col justify-end transition-shadow duration-500"
          >
            {/* GSAP Parallax Inner Image */}
            <div className="absolute inset-0 overflow-hidden">
              <img
                ref={heroImgRef}
                src="/images/about/sanctuary-canopy-hd.jpg"
                alt="Knowza ancient canopy sanctuary"
                className="w-full h-full object-cover object-center filter brightness-[0.9] contrast-[1.04] transition-all duration-700 will-change-transform"
                loading="eager"
              />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />

            <div
              ref={heroBadgeRef}
              className="relative z-10 p-5 sm:p-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-5 text-white"
            >
              <div className="max-w-xl">
                <span className="text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.25em] text-knowza-bronny block mb-2 font-medium text-[#D1C79D]">
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
          </div>
        </Container>
      </section>

      {/* ========================================================
          02 ARCHITECTURAL DIALOGUE & LIVING STATS
          ======================================================== */}
      <section className="py-24 md:py-36 bg-[#EDEABF] border-b border-black/5 relative">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Column: Eyebrow + Counters with GSAP Scrub Lines */}
            <div className="lg:col-span-4 space-y-10">
              <SectionLabel label="BRAND SOUL" color="olive" />

              <div className="space-y-8 pt-2">
                <div className="gsap-stat-item relative pb-6">
                  <span className="text-4xl sm:text-5xl font-serif font-normal text-knowza-dark block tracking-tight">
                    <Counter value={3} padZero={true} duration={1.6} />
                  </span>
                  <span className="text-xs uppercase tracking-wider text-knowza-dark/70 font-medium block mt-1">
                    Living Triad Pillars
                  </span>
                  <p className="text-xs font-sans text-knowza-dark/60 font-light mt-1">
                    Nature, Culture, and genuine Human Connection in harmony.
                  </p>
                  <div className="gsap-stat-line absolute bottom-0 left-0 right-0 h-[1px] bg-black/15 origin-left" />
                </div>

                <div className="gsap-stat-item relative pb-6">
                  <span className="text-4xl sm:text-5xl font-serif font-normal text-knowza-dark block tracking-tight">
                    <Counter value={5} padZero={true} duration={1.8} />
                  </span>
                  <span className="text-xs uppercase tracking-wider text-knowza-dark/70 font-medium block mt-1">
                    Cosmic Elements
                  </span>
                  <p className="text-xs font-sans text-knowza-dark/60 font-light mt-1">
                    Earth, Water, Fire, Air, and Space guiding every space.
                  </p>
                  <div className="gsap-stat-line absolute bottom-0 left-0 right-0 h-[1px] bg-black/15 origin-left" />
                </div>

                <div className="gsap-stat-item relative pb-6">
                  <span className="text-4xl sm:text-5xl font-serif font-normal text-knowza-dark block tracking-tight">
                    <Counter value={100} suffix="%" duration={2.2} />
                  </span>
                  <span className="text-xs uppercase tracking-wider text-knowza-dark/70 font-medium block mt-1">
                    Eco-Conscious Architecture
                  </span>
                  <p className="text-xs font-sans text-knowza-dark/60 font-light mt-1">
                    Reclaimed timber, stone masonry, and regenerative living.
                  </p>
                  <div className="gsap-stat-line absolute bottom-0 left-0 right-0 h-[1px] bg-black/15 origin-left" />
                </div>
              </div>
            </div>

            {/* Right Column: Architectural Headline + Detailed Prose */}
            <div className="lg:col-span-8 space-y-8">
              <TypewriterHeading
                className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-sans font-medium uppercase text-knowza-dark tracking-tight leading-[1.2]"
                segments={[
                  {
                    text: 'WHAT MAKES A JOURNEY TRULY FELT? ',
                    className: 'text-knowza-dark',
                  },
                  {
                    text: 'DELIBERATE STILLNESS AND HONEST PRESENCE.',
                    className: 'text-[#8A7D4C] font-semibold',
                  },
                ]}
              />

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

              {/* Floating Quote Card with GSAP 3D perspective */}
              <div
                ref={quoteCardRef}
                className="p-8 bg-[#FAF9F2] rounded-[28px] border border-black/10 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow"
              >
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
            </div>
          </div>
        </Container>
      </section>

      {/* ========================================================
          02.5 THE TWO LIVING PATHWAYS (HOSPITALITY & HEALING JOURNEY)
          ======================================================== */}
      <CuratedPathwaysSection />

      {/* ========================================================
          03 THE THREE LIVING PILLARS (SCULPTURAL CARDS WITH GSAP PARALLAX)
          ======================================================== */}
      <section className="py-14 md:py-20 bg-[#EDEABF] border-b border-black/5 relative">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-14 space-y-3">
            <SectionLabel label="PILLARS OF EXPERIENCE" color="olive" alignment="center" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-sans font-medium uppercase text-knowza-dark tracking-tight leading-[1.2]">
              The Living Triad
            </h2>
            <p className="text-sm md:text-base font-sans text-knowza-dark/75 font-light leading-relaxed">
              Every Knowza sanctuary weaves together these fundamental dimensions into a unified,
              transformative experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1: Nature */}
            <div className="gsap-pillar-card bg-[#FAF9F2] border border-black/10 rounded-[28px] p-8 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-500 group">
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
              <div className="rounded-[20px] overflow-hidden aspect-[4/3] mt-8 shadow-sm relative">
                <img
                  src="/images/gallery/rooted-earth.png"
                  alt="Rooted in nature"
                  className="gsap-pillar-img w-full h-[125%] -top-[12%] absolute object-cover filter brightness-95 group-hover:scale-105 transition-transform duration-700 ease-out will-change-transform"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Pillar 2: Culture */}
            <div className="gsap-pillar-card bg-[#FAF9F2] border border-black/10 rounded-[28px] p-8 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-500 group">
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
              <div className="rounded-[20px] overflow-hidden aspect-[4/3] mt-8 shadow-sm relative">
                <img
                  src="/images/gallery/courtyard.jpg"
                  alt="Living culture and courtyard"
                  className="gsap-pillar-img w-full h-[125%] -top-[12%] absolute object-cover filter brightness-95 group-hover:scale-105 transition-transform duration-700 ease-out will-change-transform"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Pillar 3: Connection */}
            <div className="gsap-pillar-card bg-[#FAF9F2] border border-black/10 rounded-[28px] p-8 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-500 group">
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
              <div className="rounded-[20px] overflow-hidden aspect-[4/3] mt-8 shadow-sm relative">
                <img
                  src="/images/connection/connection-hands.jpg"
                  alt="Heartfelt human connection"
                  className="gsap-pillar-img w-full h-[125%] -top-[12%] absolute object-cover filter brightness-95 group-hover:scale-105 transition-transform duration-700 ease-out will-change-transform"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>



      {/* ========================================================
          05 EDITORIAL CRAFT & ECOLOGICAL HARMONY (GSAP DUAL OPPOSING PARALLAX)
          ======================================================== */}
      <section className="py-12 md:py-20 bg-[#EDEABF] border-t border-black/5 relative">
        <Container>
          <div className="gsap-diptych-container grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Photographic Diptych with GSAP Opposing Parallax */}
            <div className="lg:col-span-7 grid grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              <div
                ref={diptychLeftRef}
                className="rounded-[24px] sm:rounded-[28px] overflow-hidden h-48 sm:h-64 md:h-96 shadow-md border border-black/5 will-change-transform"
              >
                <img
                  src="/images/about/presence.png"
                  alt="Mindful presence"
                  className="w-full h-full object-cover filter brightness-95 hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </div>
              <div
                ref={diptychRightRef}
                className="rounded-[24px] sm:rounded-[28px] overflow-hidden h-48 sm:h-64 md:h-96 shadow-md border border-black/5 mt-6 sm:mt-8 md:mt-12 will-change-transform"
              >
                <img
                  src="/images/about/water-ripple.png"
                  alt="Water ripple stillness"
                  className="w-full h-full object-cover filter brightness-95 hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Editorial Story & Manifesto */}
            <div className="lg:col-span-5 space-y-6">
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
            </div>
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
