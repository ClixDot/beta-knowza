import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowUpRight,
  ArrowRight,
  Sparkles,
  Compass,
  Leaf,
  Heart,
  Sun,
  Feather,
  ShieldCheck,
  Recycle,
  Mountain,
  Globe,
  Users,
  Activity,
  MapPin,
  TrendingUp,
  Crosshair,
  Quote,
  X,
} from 'lucide-react';
import { Container } from '../components/Container';
import { SectionLabel } from '../components/SectionLabel';
import { InnerPageHero } from '../components/InnerPageHero';
import { CTASection } from '../components/CTASection';
import { siteConfig } from '../data/site';
import { Counter } from '../components/Counter';
import { TypewriterHeading } from '../components/TypewriterHeading';
import { CuratedPathwaysSection } from '../components/CuratedPathwaysSection';

gsap.registerPlugin(ScrollTrigger);

interface RoadmapStageItem {
  id: string;
  stageNumber: string;
  stageBadge: string;
  badgeDotClass: string;
  durationBadge: string;
  timeframe: string;
  phaseStatus: string;
  horizonTag: string;
  title: string;
  quote: string;
  narrative: string;
  image: string;
  imageAlt: string;
  targetRegion: string;
  coordinates: string;
  elevation: string;
  focalSpec: string;
  highlights: {
    icon: React.ComponentType<{ className?: string }>;
    text: string;
  }[];
}

const ROADMAP_STAGES: RoadmapStageItem[] = [
  {
    id: 'stage-south-india',
    stageNumber: '01',
    stageBadge: 'STAGE 01 • ACTIVE',
    badgeDotClass: 'bg-[#8A7D4C]',
    durationBadge: '2032',
    timeframe: 'Target 2032',
    phaseStatus: 'Active Phase',
    horizonTag: '01 / FOUNDATIONAL ROOTS',
    title: 'South India Presence',
    quote: 'Establish a solid, impactful presence across South India.',
    narrative: 'Planting the foundational roots of experiential sanctuaries across pristine bio-corridors, sacred living forests, and restorative nature habitats.',
    image: '/images/gallery/tea-hills.jpg',
    imageAlt: 'Foundational experiential sanctuaries in morning mist',
    targetRegion: 'Foundational Sanctuaries',
    coordinates: '11.6854° N, 76.1320° E',
    elevation: '1,420m MSL',
    focalSpec: '35mm • f/2.4 Lens Focus',
    highlights: [
      { icon: Compass, text: 'Immersive nature sanctuaries connecting culture, stillness & living earth' },
      { icon: Recycle, text: 'Zero-plastic operating standard across all units' },
      { icon: Users, text: 'Direct alliances with local indigenous stewards' },
    ],
  },
  {
    id: 'stage-pan-india',
    stageNumber: '02',
    stageBadge: 'STAGE 02 • STRATEGIC',
    badgeDotClass: 'bg-[#79864B]',
    durationBadge: '2038',
    timeframe: 'Target 2038',
    phaseStatus: 'Strategic Blueprint',
    horizonTag: '02 / NATIONWIDE SCALE',
    title: 'Pan-India Eco-Network',
    quote: 'Scale nationwide to build a recognized pan-India eco-hospitality network.',
    narrative: 'Expanding across diverse geographical biomes, setting the national benchmark for regenerative stays and conscious eco-hospitality.',
    image: '/images/gallery/treehouse-retreat.png',
    imageAlt: 'Pan-India eco-hospitality network treehouse sanctuary',
    targetRegion: 'Nationwide Eco-Network',
    coordinates: '32.2190° N, 76.3234° E',
    elevation: '2,180m MSL',
    focalSpec: '50mm • f/2.0 Lens Focus',
    highlights: [
      { icon: Mountain, text: 'Pioneering regenerative stays across diverse geographical biomes' },
      { icon: Leaf, text: 'National benchmark for carbon-negative retreats' },
      { icon: TrendingUp, text: 'Conscious hospitality youth stewardship programs' },
    ],
  },
  {
    id: 'stage-global',
    stageNumber: '03',
    stageBadge: 'STAGE 03 • GLOBAL',
    badgeDotClass: 'bg-knowza-dark',
    durationBadge: 'AFTER 2038',
    timeframe: '2038 & Beyond',
    phaseStatus: 'Global Horizon',
    horizonTag: '03 / GLOBAL COMMUNION',
    title: 'International & Global Tribe',
    quote: 'International expansion and attracting a global community of conscious travelers.',
    narrative: 'Positioning India as a premier eco-conscious destination on the world stage, welcoming conscious travelers across the globe into transformative healing.',
    image: '/images/gallery/backwater.jpg',
    imageAlt: 'Global conscious traveler community reflecting on tranquil waters',
    targetRegion: 'Global Corridors',
    coordinates: '09.4981° N, 76.3388° E',
    elevation: 'Sea Level / Oceans',
    focalSpec: '24mm • f/2.8 Lens Focus',
    highlights: [
      { icon: Globe, text: 'International eco-tourism & conscious travel circuits' },
      { icon: Sparkles, text: "Global recognition for India's holistic healing model" },
      { icon: ShieldCheck, text: 'Worldwide community committed to regenerative travel' },
    ],
  },
];

interface VisionPointItem {
  id: string;
  number: string;
  category: string;
  title: string;
  text: string;
  highlight: string;
  icon: React.ComponentType<{ className?: string }>;
}

const VISION_POINTS: VisionPointItem[] = [
  {
    id: 'nature-grounded',
    number: '01',
    category: 'GROUNDED IN NATURE',
    title: 'Experience Tourism Grounded in Nature',
    text: "In today's hyper-digital world, people are increasingly disconnected from nature and physical experiences. Knowza reconnects people with the natural world through immersive experiences—connecting with the soil, embracing raw nature, stepping away from screens, and rediscovering life's natural rhythms.",
    highlight: 'Soil Connection & Screen-Free Cadence',
    icon: Leaf,
  },
  {
    id: 'simpler-era',
    number: '02',
    category: 'TIMELESS SIMPLICITY',
    title: 'Reviving the Soul of a Simpler Era',
    text: 'Knowza aims to recreate the simplicity, warmth, emotional connection, and slower pace associated with a simpler era. Its environment is designed to help people rediscover the stillness and presence that modern life has pushed aside.',
    highlight: 'Unhurried Pace & Heartfelt Warmth',
    icon: Sun,
  },
  {
    id: 'shift-healing',
    number: '03',
    category: 'ROOT-CAUSE RESTORATION',
    title: 'The Shift from Conventional Healing',
    text: 'Knowza is not another resort or transactional healing retreat. It exists to address a deeper human problem: the chronic mental exhaustion, emotional burdens, and disconnection that come with modern living.',
    highlight: 'Beyond Transactional Resorts',
    icon: Heart,
  },
  {
    id: 'high-impact',
    number: '04',
    category: 'EXECUTIVE SANCTUARY',
    title: 'Designed for High-Impact Individuals',
    text: 'Knowza focuses on people who carry significant mental and professional responsibilities, including business leaders, tech innovators, founders, investors, artists, and public servants who operate under constant pressure.',
    highlight: 'High-Pressure Responsibility Recharged',
    icon: ShieldCheck,
  },
  {
    id: 'healed-mind',
    number: '05',
    category: 'TRUE FULFILMENT',
    title: 'The True Definition of a Healed Mind',
    text: 'For Knowza, success goes beyond material achievements. True fulfilment comes from emotional peace, mental clarity, genuine happiness, and the ability to be fully present in life.',
    highlight: 'Emotional Peace & Mental Clarity',
    icon: Sparkles,
  },
  {
    id: 'sustainable-living',
    number: '06',
    category: 'NATIONAL BLUEPRINT',
    title: 'A Vision for Sustainable Living and Holistic Healing',
    text: 'Knowza envisions pioneering sustainable living and holistic healing in India by reconnecting people with nature, protecting the environment, and positioning India as a premier eco-conscious destination on the global stage.',
    highlight: "Pioneering India's Eco-Conscious Stage",
    icon: Compass,
  },
  {
    id: 'plastic-free-2050',
    number: '07',
    category: 'CIRCULAR AMBITION',
    title: 'A Plastic-Free Future: Plastic-Free India by 2050',
    text: "Knowza's long-term environmental ambition is to contribute to a Plastic-Free India by 2050. By mobilising the collective influence, leadership, and resources of its community, Knowza aims to support impactful initiatives that reduce plastic pollution, encourage responsible consumption, and promote a zero-waste culture.",
    highlight: 'Community Mobilization by 2050',
    icon: Recycle,
  },
  {
    id: 'env-harmony',
    number: '08',
    category: 'HABITAT RESILIENCE',
    title: 'Environmental Harmony and Resilience',
    text: 'Knowza aims to promote harmony between people and the natural world by supporting the preservation of pristine natural habitats, responsible resource use, and initiatives that help protect ecosystems from environmental threats. Its approach places nature conservation and long-term environmental resilience at the heart of sustainable living.',
    highlight: 'Long-Term Ecological Resilience',
    icon: Mountain,
  },
  {
    id: 'global-ecotourism',
    number: '09',
    category: 'GLOBAL RECOGNITION',
    title: 'Transforming India into a Global Eco-Tourism Destination',
    text: "Knowza aspires to contribute to the transformation of Indian eco-tourism by welcoming international travellers through immersive, nature-first, world-class experiences. By combining India's natural beauty, cultural richness, healing traditions, and sustainable practices, Knowza aims to help position the country as a destination for conscious travel and holistic well-being.",
    highlight: 'Conscious World-Class Travel',
    icon: Globe,
  },
  {
    id: 'enduring-legacy',
    number: '10',
    category: 'ENDURING LEGACY',
    title: 'An Enduring Legacy',
    text: 'Individual restoration is the starting point, not the final destination. Knowza envisions a future in which emotionally healthier individuals build a more conscious society, responsible communities protect the environment, and collective action contributes to a sustainable India for generations to come.',
    highlight: 'Generational Societal Transformation',
    icon: Users,
  },
];

interface MissionPointItem {
  id: string;
  number: string;
  category: string;
  title: string;
  text: string;
  highlight: string;
  icon: React.ComponentType<{ className?: string }>;
}

const MISSION_POINTS: MissionPointItem[] = [
  {
    id: 'mission-earth-first',
    number: '01',
    category: 'EARTH-FIRST SANCTUARIES',
    title: 'Developing Immersive, Earth-First Sanctuaries',
    text: 'We acquire and develop properties in undisturbed natural landscapes, deliberately replacing digital distractions with tactile, earth-grounding activities—encouraging guests to walk barefoot, engage with soil, and experience living forests directly.',
    highlight: 'Barefoot Soil & Living Forests Direct',
    icon: Leaf,
  },
  {
    id: 'mission-unhurried-spaces',
    number: '02',
    category: 'SIMPLER-ERA ARCHITECTURE',
    title: 'Curating Simpler-Era, Unhurried Spaces',
    text: 'We design architecture, daily routines, and shared living areas using natural materials and acoustic stillness, intentionally reducing modern hyper-connectivity to restore the warm, uncomplicated rhythm of a simpler era.',
    highlight: 'Acoustic Stillness & Warm Rhythms',
    icon: Sun,
  },
  {
    id: 'mission-root-cause',
    number: '03',
    category: 'INNER RESOLUTION',
    title: 'Facilitating Root-Cause Inner Resolution',
    text: 'Instead of superficial spa routines, we provide dedicated, guided spaces that empower individuals to confront long-held childhood burdens, release chronic guilt, and achieve authentic self-forgiveness.',
    highlight: 'Authentic Self-Forgiveness & Release',
    icon: Heart,
  },
  {
    id: 'mission-leader-destress',
    number: '04',
    category: 'EXECUTIVE RETREATS',
    title: 'Providing Targeted De-stress Protocols for Leaders',
    text: 'We create tailored retreat modules specifically designed for executives, tech professionals, investors, and public officials to address cognitive exhaustion and restore mental equilibrium.',
    highlight: 'Cognitive Recovery for Key Decision-Makers',
    icon: ShieldCheck,
  },
  {
    id: 'mission-presence-clarity',
    number: '05',
    category: 'TRANSFORMATIVE HABITS',
    title: 'Measuring Transformation Through Presence and Clarity',
    text: 'We equip guests with grounded mindfulness tools and practical habits that help them sustain emotional equilibrium, mental clarity, and greater presence in their everyday professional and personal lives.',
    highlight: 'Daily Mindfulness & Emotional Equilibrium',
    icon: Sparkles,
  },
  {
    id: 'mission-eco-frameworks',
    number: '06',
    category: 'SUSTAINABLE ARCHITECTURE',
    title: 'Integrating Sustainable Ecological Frameworks',
    text: 'We build facilities using sustainable architecture, local materials, rainwater harvesting, closed-loop waste systems, and renewable energy to serve as practical models for sustainable living in India.',
    highlight: 'Closed-Loop Systems & Renewable Energy',
    icon: Compass,
  },
  {
    id: 'mission-coalition-zero-waste',
    number: '07',
    category: 'EXECUTIVE ZERO WASTE',
    title: 'Mobilizing an Executive Coalition for Zero Waste',
    text: 'We leverage the strategic reach, institutional capital, and business influence of our guest community to launch, fund, and advocate for circular packaging initiatives and policy action against single-use plastics.',
    highlight: 'Strategic Capital for Circularity',
    icon: Recycle,
  },
  {
    id: 'mission-rewilding-conservation',
    number: '08',
    category: 'HABITAT CONSERVATION',
    title: 'Active Habitat Conservation and Rewilding',
    text: 'We protect vulnerable ecosystems surrounding our destinations, partner with local forest and conservation teams, and support dedicated reforestation and native biodiversity protection projects.',
    highlight: 'Reforestation & Native Biodiversity',
    icon: Mountain,
  },
  {
    id: 'mission-global-eco-hospitality',
    number: '09',
    category: 'GLOBAL ECO-HOSPITALITY',
    title: 'Delivering Global-Standard Eco-Hospitality',
    text: 'We blend traditional Indian healing practices and authentic eco-tourism with world-class hospitality standards, offering seamless, nature-first travel experiences that attract conscious international travellers.',
    highlight: 'Conscious International Eco-Tourism',
    icon: Globe,
  },
  {
    id: 'mission-restored-change-makers',
    number: '10',
    category: 'COMMUNITY IMPACT',
    title: 'Building a Network of Restored Change-Makers',
    text: 'We connect our community of restored, conscious leaders through an active network, channeling their collective purpose into long-term environmental protection, community development, and sustainable nation-building.',
    highlight: 'Collective Purpose & Nation-Building',
    icon: Users,
  },
];

interface ValuePointItem {
  id: string;
  number: string;
  category: string;
  title: string;
  text: string;
  highlight: string;
  icon: React.ComponentType<{ className?: string }>;
}

const CORE_VALUES: ValuePointItem[] = [
  {
    id: 'root-authenticity',
    number: '01',
    category: 'DEEP TRANSFORMATION',
    title: 'Root-Level Authenticity',
    text: 'We choose deep, lasting transformation over temporary relief. We believe real well-being begins by addressing the underlying causes of emotional struggles and human suffering.',
    highlight: 'Root-Cause Human Well-Being',
    icon: Heart,
  },
  {
    id: 'sacred-grounding',
    number: '02',
    category: 'SACRED GROUNDING',
    title: 'Sacred Grounding',
    text: 'Nature is not our backdrop; it is our foundation. We value a genuine connection with the earth, conscious simplicity, and stepping away from digital distractions to reconnect with natural rhythms.',
    highlight: 'Earth Foundation & Natural Rhythms',
    icon: Leaf,
  },
  {
    id: 'intentional-presence',
    number: '03',
    category: 'UNHURRIED LIVING',
    title: 'Intentional Presence',
    text: 'We value stillness, genuine human connection, and unhurried living. We embrace the warmth, sincerity, simplicity, and emotional connection of a simpler era, prioritising meaningful experiences over the constant rush of modern life.',
    highlight: 'Warmth of a Simpler Era',
    icon: Sun,
  },
  {
    id: 'conscious-responsibility',
    number: '04',
    category: 'ETHICAL LEADERSHIP',
    title: 'Conscious Responsibility',
    text: 'True restoration demands contribution. We believe individuals have a responsibility to direct their clarity, resources, and influence towards the greater good of society and the environment.',
    highlight: 'Clarity, Capital & Social Good',
    icon: ShieldCheck,
  },
  {
    id: 'ecological-stewardship',
    number: '05',
    category: 'ECO STEWARDSHIP',
    title: 'Ecological Stewardship',
    text: 'Sustainability is a responsibility, not a marketing promise. We are committed to protecting natural ecosystems, using resources responsibly, reducing waste, and contributing to a plastic-free future.',
    highlight: 'Zero-Waste & Ecosystem Protection',
    icon: Recycle,
  },
  {
    id: 'collective-impact',
    number: '06',
    category: 'COMMUNITY & NATION',
    title: 'Collective Impact',
    text: 'Personal transformation can inspire collective change. We foster a conscious community of individuals who work together to create lasting social, environmental, and national impact.',
    highlight: 'Lasting Social & National Impact',
    icon: Users,
  },
];

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

export const About: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroBannerRef = useRef<HTMLDivElement>(null);
  const heroImgRef = useRef<HTMLImageElement>(null);
  const heroBadgeRef = useRef<HTMLDivElement>(null);
  const diptychLeftRef = useRef<HTMLDivElement>(null);
  const diptychRightRef = useRef<HTMLDivElement>(null);
  const quoteCardRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState<'vision' | 'mission' | 'values'>('vision');
  const [focusedRoadmapIndex, setFocusedRoadmapIndex] = useState<number | null>(null);
  const [isCharterOpen, setIsCharterOpen] = useState(false);

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
    // Refresh ScrollTrigger when filter updates
    ScrollTrigger.refresh();
  }, [activeFilter]);

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

      // ========================================================
      // 06.5 FOUNDER MONOGRAPH & SIGNATURE ANIMATIONS
      // ========================================================
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (!prefersReducedMotion) {
        gsap.fromTo(
          '.gsap-signature-path',
          { strokeDashoffset: 450 },
          {
            strokeDashoffset: 0,
            duration: 2.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: '.gsap-signature-block',
              start: 'top 90%',
            },
          }
        );
      } else {
        gsap.set('.gsap-signature-path', { strokeDashoffset: 0 });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative overflow-hidden bg-[#F6F4DE] text-knowza-dark">
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
                src="/images/about/sanctuary-canopy-hd.jpg"
                alt="Knowza ancient canopy sanctuary"
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
                  SANCTUARY PHILOSOPHY
                </span>
                <p className="text-sm xs:text-base sm:text-2xl font-serif font-light italic leading-snug">
                  "Where the noise of the world softens into the rhythm of nature, memory, and heartfelt presence."
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Link
                  to="/gallery"
                  className="w-full sm:w-auto text-center inline-flex items-center justify-center gap-2 rounded-full px-5 sm:px-6 py-2.5 sm:py-3 text-xs uppercase tracking-wider font-medium knowza-btn-liquid knowza-btn-liquid-white group whitespace-nowrap"
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
          02.1 GUIDING PURPOSE: VISION & MISSION (OUR NORTH STAR)
          ======================================================== */}
      <section className="py-14 sm:py-24 md:py-36 bg-[#F6F4DE] border-b border-black/5 relative overflow-hidden">
        {/* Subtle Background Watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[70px] xs:text-[100px] sm:text-[180px] md:text-[240px] font-serif font-bold text-black/[0.025] uppercase tracking-widest select-none pointer-events-none whitespace-nowrap">
          NORTH STAR
        </div>

        <Container className="relative z-10">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-14 space-y-3 sm:space-y-4">
            <SectionLabel label="OUR NORTH STAR" color="olive" alignment="center" />
            <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-serif font-normal text-knowza-dark tracking-tight leading-[1.15] mt-2">
              Vision, Mission &amp; Values
            </h2>
            <p className="text-xs sm:text-sm md:text-base font-sans text-knowza-dark/75 font-light leading-relaxed max-w-xl mx-auto">
              Anchored in ecological stewardship, mindful restoration, and our living core principles.
            </p>

            {/* Interactive Filter Pills: Segmented 3-Column on Mobile, Pill Row on Tablet/Desktop */}
            <div className="pt-2 sm:pt-3">
              <div className="w-full max-w-sm sm:max-w-md mx-auto p-1 sm:p-1.5 rounded-full bg-black/[0.06] border border-black/10 shadow-sm grid grid-cols-3 sm:inline-flex sm:w-auto sm:grid-cols-none gap-1">
                <button
                  type="button"
                  onClick={() => setActiveFilter('vision')}
                  className={`w-full sm:w-auto px-2 xs:px-3 sm:px-5 py-2 sm:py-2.5 rounded-full text-[10px] xs:text-[11px] sm:text-xs uppercase tracking-wider font-medium transition-all duration-300 cursor-pointer text-center flex items-center justify-center ${activeFilter === 'vision'
                      ? 'bg-[#8A7D4C] text-[#FAF9F2] shadow-md'
                      : 'text-knowza-dark/70 hover:text-knowza-dark hover:bg-black/5'
                    }`}
                >
                  <span className="sm:hidden">01 / Vision</span>
                  <span className="hidden sm:inline">01 / Our Vision</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter('mission')}
                  className={`w-full sm:w-auto px-2 xs:px-3 sm:px-5 py-2 sm:py-2.5 rounded-full text-[10px] xs:text-[11px] sm:text-xs uppercase tracking-wider font-medium transition-all duration-300 cursor-pointer text-center flex items-center justify-center ${activeFilter === 'mission'
                      ? 'bg-[#79864B] text-[#FAF9F2] shadow-md'
                      : 'text-knowza-dark/70 hover:text-knowza-dark hover:bg-black/5'
                    }`}
                >
                  <span className="sm:hidden">02 / Mission</span>
                  <span className="hidden sm:inline">02 / Our Mission</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter('values')}
                  className={`w-full sm:w-auto px-2 xs:px-3 sm:px-5 py-2 sm:py-2.5 rounded-full text-[10px] xs:text-[11px] sm:text-xs uppercase tracking-wider font-medium transition-all duration-300 cursor-pointer text-center flex items-center justify-center ${activeFilter === 'values'
                      ? 'bg-[#556038] text-[#FAF9F2] shadow-md'
                      : 'text-knowza-dark/70 hover:text-knowza-dark hover:bg-black/5'
                    }`}
                >
                  <span className="sm:hidden">03 / Values</span>
                  <span className="hidden sm:inline">03 / Core Values</span>
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-12 sm:space-y-16">
            <AnimatePresence mode="wait">
              {/* ========================================================
                  01 OUR VISION SHOWCASE
                  ======================================================== */}
              {activeFilter === 'vision' && (
                <motion.div
                  key="vision-block"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  className="bg-[#FAF9F2] rounded-2xl sm:rounded-3xl md:rounded-[36px] p-4 sm:p-8 md:p-12 border border-black/10 shadow-[0_12px_45px_-15px_rgba(37,39,31,0.08)] hover:shadow-[0_24px_60px_-16px_rgba(40,53,31,0.16)] transition-all duration-500 relative overflow-hidden group"
                >
                  {/* Faint Corner Watermark */}
                  <span className="absolute -bottom-6 -right-6 text-[70px] sm:text-[120px] md:text-[140px] font-serif font-bold text-black/[0.025] select-none pointer-events-none leading-none">
                    01
                  </span>

                  {/* Cinematic Master Vision Banner Card */}
                  <div className="relative rounded-xl sm:rounded-2xl md:rounded-[28px] overflow-hidden min-h-[280px] sm:min-h-[360px] md:min-h-[380px] p-4 sm:p-8 md:p-10 shadow-lg border border-black/10 mb-6 sm:mb-10 bg-knowza-deep flex flex-col justify-between group/banner">
                    <img
                      src="/images/gallery/tea-hills.jpg"
                      alt="Western Ghats misty sanctuary and tea plantations"
                      className="absolute inset-0 w-full h-full object-cover filter brightness-[0.70] contrast-[1.08] transition-transform duration-1000 ease-out group-hover/banner:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/35 pointer-events-none" />
                    <div className="absolute inset-0 bg-[#28351F]/25 mix-blend-multiply pointer-events-none" />

                    {/* Top Bar with Glowing Badge & Milestones */}
                    <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 sm:gap-3">
                      <span className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-[9px] xs:text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.18em] sm:tracking-[0.22em] text-[#EEE9BF] font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#8A7D4C] animate-pulse" />
                        01 / OUR VISION
                      </span>
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <span className="text-[9px] xs:text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.15em] sm:tracking-[0.2em] text-white/80 bg-black/40 backdrop-blur-sm px-2.5 sm:px-3 py-1 rounded-full border border-white/15">
                          10 STRATEGIC PILLARS
                        </span>
                        <span className="text-[9px] xs:text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[#EEE9BF] bg-[#8A7D4C]/40 backdrop-blur-sm px-2.5 sm:px-3 py-1 rounded-full border border-[#8A7D4C]/50 font-semibold">
                          HORIZON 2030 – 2050
                        </span>
                      </div>
                    </div>

                    {/* Center / Bottom Quote & Master Manifesto */}
                    <div className="relative z-10 space-y-3 sm:space-y-4 max-w-4xl pt-6 sm:pt-12">
                      <div className="w-8 sm:w-12 h-[2px] bg-[#8A7D4C]" />
                      <blockquote className="text-base sm:text-2xl md:text-3xl font-serif font-light italic text-[#FAF9F2] leading-snug tracking-tight">
                        "To pioneer sustainable living and holistic healing in India by reconnecting people with nature, protecting our environment, and positioning India as a premier eco-conscious destination on the global stage."
                      </blockquote>
                      <p className="text-xs sm:text-sm font-sans text-white/85 font-light leading-relaxed pt-2 border-t border-white/15 max-w-3xl">
                        Individual restoration is the starting point, not the final destination. Emotionally healthier individuals build a conscious society, responsible communities protect the environment, and collective action shapes a sustainable India for generations to come.
                      </p>

                      {/* Pill Metrics */}
                      <div className="flex flex-wrap gap-1.5 sm:gap-2.5 pt-1 sm:pt-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[9px] xs:text-[10px] sm:text-[11px] text-[#EEE9BF] font-sans">
                          <Leaf className="w-3 h-3 text-[#EEE9BF]" />
                          Nature-First Tourism
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[9px] xs:text-[10px] sm:text-[11px] text-[#EEE9BF] font-sans">
                          <Recycle className="w-3 h-3 text-[#EEE9BF]" />
                          Plastic-Free India 2050
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[9px] xs:text-[10px] sm:text-[11px] text-[#EEE9BF] font-sans">
                          <Globe className="w-3 h-3 text-[#EEE9BF]" />
                          Global Eco-Sanctuaries
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[9px] xs:text-[10px] sm:text-[11px] text-[#EEE9BF] font-sans">
                          <Sparkles className="w-3 h-3 text-[#EEE9BF]" />
                          The Healed Mind
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 10 Sculpted Bento Pillars (2 Columns on MD/LG for maximum readability) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-5">
                    {VISION_POINTS.map((item) => {
                      const IconComponent = item.icon;
                      return (
                        <motion.div
                          key={item.id}
                          whileHover={{ y: -4 }}
                          transition={{ duration: 0.25 }}
                          className="bg-white/90 hover:bg-white rounded-2xl sm:rounded-[26px] p-4 sm:p-6 md:p-7 border border-black/8 hover:border-[#8A7D4C]/40 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_36px_-8px_rgba(138,125,76,0.18)] transition-all duration-300 flex flex-col justify-between group/card relative overflow-hidden"
                        >
                          {/* Faded Watermark Number */}
                          <span className="absolute top-2 right-3 sm:right-4 text-2xl sm:text-4xl font-serif text-black/[0.04] group-hover/card:text-[#8A7D4C]/15 transition-colors font-bold select-none pointer-events-none">
                            {item.number}
                          </span>

                          <div className="space-y-3 sm:space-y-4 relative z-10">
                            {/* Card Header with Icon & Category */}
                            <div className="flex items-center justify-between">
                              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-[#F6F4DE] text-[#79864B] flex items-center justify-center group-hover/card:bg-[#79864B] group-hover/card:text-white transition-all duration-300 shadow-sm shrink-0">
                                <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover/card:scale-110" />
                              </div>
                              <span className="text-[9px] xs:text-[10px] uppercase tracking-wider sm:tracking-widest text-[#8A7D4C] font-semibold bg-[#FAF9F2] px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-black/5">
                                {item.category}
                              </span>
                            </div>

                            {/* Title & User-Provided Content */}
                            <div>
                              <div className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-knowza-dark/50 mb-1">
                                Point {item.number}
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
                            <span className="text-[#79864B] font-semibold">{item.highlight}</span>
                            <ArrowUpRight className="w-3.5 h-3.5 text-[#8A7D4C] opacity-0 group-hover/card:opacity-100 transition-opacity" />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* ========================================================
                  02 OUR MISSION SHOWCASE: 10 ACTION COMMITMENTS
                  ======================================================== */}
              {activeFilter === 'mission' && (
                <motion.div
                  key="mission-block"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  className="bg-[#FAF9F2] rounded-2xl sm:rounded-3xl md:rounded-[36px] p-4 sm:p-8 md:p-12 border border-black/10 shadow-[0_12px_45px_-15px_rgba(37,39,31,0.08)] hover:shadow-[0_24px_60px_-16px_rgba(40,53,31,0.16)] transition-all duration-500 relative overflow-hidden group"
                >
                  {/* Faint Corner Watermark */}
                  <span className="absolute -bottom-6 -left-6 text-[70px] sm:text-[120px] md:text-[140px] font-serif font-bold text-black/[0.025] select-none pointer-events-none leading-none">
                    02
                  </span>

                  {/* Cinematic Master Mission Banner Card */}
                  <div className="relative rounded-xl sm:rounded-2xl md:rounded-[28px] overflow-hidden min-h-[280px] sm:min-h-[360px] md:min-h-[380px] p-4 sm:p-8 md:p-10 shadow-lg border border-black/10 mb-6 sm:mb-10 bg-knowza-deep flex flex-col justify-between group/banner">
                    <img
                      src="/images/offerings/healing-retreat.jpg"
                      alt="Mindful meditation and restoration by the peaceful lake"
                      className="absolute inset-0 w-full h-full object-cover filter brightness-[0.70] contrast-[1.08] transition-transform duration-1000 ease-out group-hover/banner:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/35 pointer-events-none" />
                    <div className="absolute inset-0 bg-[#79864B]/25 mix-blend-multiply pointer-events-none" />

                    {/* Top Bar with Glowing Badge & Milestones */}
                    <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 sm:gap-3">
                      <span className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-[9px] xs:text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.18em] sm:tracking-[0.22em] text-[#EEE9BF] font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#79864B] animate-pulse" />
                        02 / OUR MISSION
                      </span>
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <span className="text-[9px] xs:text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.15em] sm:tracking-[0.2em] text-white/80 bg-black/40 backdrop-blur-sm px-2.5 sm:px-3 py-1 rounded-full border border-white/15">
                          10 ACTION COMMITMENTS
                        </span>
                        <span className="text-[9px] xs:text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[#EEE9BF] bg-[#79864B]/40 backdrop-blur-sm px-2.5 sm:px-3 py-1 rounded-full border border-[#79864B]/50 font-semibold">
                          LIVING PRACTICE
                        </span>
                      </div>
                    </div>

                    {/* Center / Bottom Quote & Master Manifesto */}
                    <div className="relative z-10 space-y-3 sm:space-y-4 max-w-4xl pt-6 sm:pt-12">
                      <div className="w-8 sm:w-12 h-[2px] bg-[#79864B]" />
                      <blockquote className="text-base sm:text-2xl md:text-3xl font-serif font-light italic text-[#FAF9F2] leading-snug tracking-tight">
                        "To deliver transformative healing experiences that solve modern lifestyle stress by restoring our timeless connection with the natural world."
                      </blockquote>
                      <p className="text-xs sm:text-sm font-sans text-white/85 font-light leading-relaxed pt-2 border-t border-white/15 max-w-3xl">
                        From developing immersive earth-first sanctuaries to mobilizing an executive coalition for zero-waste and generational nation-building — every action translates our vision into living reality.
                      </p>

                      {/* Pill Metrics */}
                      <div className="flex flex-wrap gap-1.5 sm:gap-2.5 pt-1 sm:pt-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[9px] xs:text-[10px] sm:text-[11px] text-[#EEE9BF] font-sans">
                          <Leaf className="w-3 h-3 text-[#EEE9BF]" />
                          Tactile Earth Grounding
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[9px] xs:text-[10px] sm:text-[11px] text-[#EEE9BF] font-sans">
                          <Heart className="w-3 h-3 text-[#EEE9BF]" />
                          Root-Cause Inner Healing
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[9px] xs:text-[10px] sm:text-[11px] text-[#EEE9BF] font-sans">
                          <Recycle className="w-3 h-3 text-[#EEE9BF]" />
                          Executive Zero Waste Coalition
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[9px] xs:text-[10px] sm:text-[11px] text-[#EEE9BF] font-sans">
                          <Users className="w-3 h-3 text-[#EEE9BF]" />
                          Restored Change-Maker Network
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 10 Sculpted Bento Mission Pillars (2 Columns on MD/LG for maximum readability) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-5">
                    {MISSION_POINTS.map((item) => {
                      const IconComponent = item.icon;
                      return (
                        <motion.div
                          key={item.id}
                          whileHover={{ y: -4 }}
                          transition={{ duration: 0.25 }}
                          className="bg-white/90 hover:bg-white rounded-2xl sm:rounded-[26px] p-4 sm:p-6 md:p-7 border border-black/8 hover:border-[#79864B]/40 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_36px_-8px_rgba(121,134,75,0.18)] transition-all duration-300 flex flex-col justify-between group/card relative overflow-hidden"
                        >
                          {/* Faded Watermark Number */}
                          <span className="absolute top-2 right-3 sm:right-4 text-2xl sm:text-4xl font-serif text-black/[0.04] group-hover/card:text-[#79864B]/15 transition-colors font-bold select-none pointer-events-none">
                            {item.number}
                          </span>

                          <div className="space-y-3 sm:space-y-4 relative z-10">
                            {/* Card Header with Icon & Category */}
                            <div className="flex items-center justify-between">
                              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-[#F6F4DE] text-[#79864B] flex items-center justify-center group-hover/card:bg-[#79864B] group-hover/card:text-white transition-all duration-300 shadow-sm shrink-0">
                                <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover/card:scale-110" />
                              </div>
                              <span className="text-[9px] xs:text-[10px] uppercase tracking-wider sm:tracking-widest text-[#79864B] font-semibold bg-[#FAF9F2] px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-black/5">
                                {item.category}
                              </span>
                            </div>

                            {/* Title & User-Provided Content */}
                            <div>
                              <div className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-knowza-dark/50 mb-1">
                                Point {item.number}
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
                            <span className="text-[#79864B] font-semibold">{item.highlight}</span>
                            <ArrowUpRight className="w-3.5 h-3.5 text-[#79864B] opacity-0 group-hover/card:opacity-100 transition-opacity" />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* ========================================================
                  03 OUR CORE VALUES SHOWCASE
                  ======================================================== */}
              {activeFilter === 'values' && (
                <motion.div
                  key="values-block"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  className="bg-[#FAF9F2] rounded-2xl sm:rounded-3xl md:rounded-[36px] p-4 sm:p-8 md:p-12 border border-black/10 shadow-[0_12px_45px_-15px_rgba(37,39,31,0.08)] hover:shadow-[0_24px_60px_-16px_rgba(40,53,31,0.16)] transition-all duration-500 relative overflow-hidden group"
                >
                  {/* Faint Corner Watermark */}
                  <span className="absolute -bottom-6 -right-6 text-[70px] sm:text-[120px] md:text-[140px] font-serif font-bold text-black/[0.025] select-none pointer-events-none leading-none">
                    03
                  </span>

                  {/* Cinematic Master Values Banner Card */}
                  <div className="relative rounded-xl sm:rounded-2xl md:rounded-[28px] overflow-hidden min-h-[280px] sm:min-h-[360px] md:min-h-[380px] p-4 sm:p-8 md:p-10 shadow-lg border border-black/10 mb-6 sm:mb-10 bg-knowza-deep flex flex-col justify-between group/banner">
                    <img
                      src="/images/gallery/warmth-connection.png"
                      alt="Mindful human connection and conscious community"
                      className="absolute inset-0 w-full h-full object-cover filter brightness-[0.70] contrast-[1.08] transition-transform duration-1000 ease-out group-hover/banner:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/35 pointer-events-none" />
                    <div className="absolute inset-0 bg-[#556038]/25 mix-blend-multiply pointer-events-none" />

                    {/* Top Bar with Glowing Badge & Milestones */}
                    <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 sm:gap-3">
                      <span className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-[9px] xs:text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.18em] sm:tracking-[0.22em] text-[#EEE9BF] font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#556038] animate-pulse" />
                        03 / CORE VALUES
                      </span>
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <span className="text-[9px] xs:text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.15em] sm:tracking-[0.2em] text-white/80 bg-black/40 backdrop-blur-sm px-2.5 sm:px-3 py-1 rounded-full border border-white/15">
                          06 LIVING PRINCIPLES
                        </span>
                        <span className="text-[9px] xs:text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[#EEE9BF] bg-[#556038]/40 backdrop-blur-sm px-2.5 sm:px-3 py-1 rounded-full border border-[#556038]/50 font-semibold">
                          NON-NEGOTIABLES
                        </span>
                      </div>
                    </div>

                    {/* Center / Bottom Quote & Master Manifesto */}
                    <div className="relative z-10 space-y-3 sm:space-y-4 max-w-4xl pt-6 sm:pt-12">
                      <div className="w-8 sm:w-12 h-[2px] bg-[#EEE9BF]" />
                      <blockquote className="text-base sm:text-2xl md:text-3xl font-serif font-light italic text-[#FAF9F2] leading-snug tracking-tight">
                        "Our values are the living principles that guide every decision, space, and relationship across the Knowza ecosystem."
                      </blockquote>
                      <p className="text-xs sm:text-sm font-sans text-white/85 font-light leading-relaxed pt-2 border-t border-white/15 max-w-3xl">
                        Sustainability is a responsibility, not a marketing promise. We choose root-level authenticity over superficial remedies, intentional presence over digital hurry, and collective action for lasting national impact.
                      </p>

                      {/* Pill Metrics */}
                      <div className="flex flex-wrap gap-1.5 sm:gap-2.5 pt-1 sm:pt-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[9px] xs:text-[10px] sm:text-[11px] text-[#EEE9BF] font-sans">
                          <Heart className="w-3 h-3 text-[#EEE9BF]" />
                          Root-Level Authenticity
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[9px] xs:text-[10px] sm:text-[11px] text-[#EEE9BF] font-sans">
                          <Leaf className="w-3 h-3 text-[#EEE9BF]" />
                          Sacred Grounding
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[9px] xs:text-[10px] sm:text-[11px] text-[#EEE9BF] font-sans">
                          <Sun className="w-3 h-3 text-[#EEE9BF]" />
                          Intentional Presence
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[9px] xs:text-[10px] sm:text-[11px] text-[#EEE9BF] font-sans">
                          <Users className="w-3 h-3 text-[#EEE9BF]" />
                          Collective Impact
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 6 Sculpted Bento Value Pillars (2 Columns on MD/LG for maximum readability) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-5">
                    {CORE_VALUES.map((item) => {
                      const IconComponent = item.icon;
                      return (
                        <motion.div
                          key={item.id}
                          whileHover={{ y: -4 }}
                          transition={{ duration: 0.25 }}
                          className="bg-white/90 hover:bg-white rounded-2xl sm:rounded-[26px] p-4 sm:p-6 md:p-7 border border-black/8 hover:border-[#556038]/40 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_36px_-8px_rgba(85,96,56,0.18)] transition-all duration-300 flex flex-col justify-between group/card relative overflow-hidden"
                        >
                          {/* Faded Watermark Number */}
                          <span className="absolute top-2 right-3 sm:right-4 text-2xl sm:text-4xl font-serif text-black/[0.04] group-hover/card:text-[#556038]/15 transition-colors font-bold select-none pointer-events-none">
                            {item.number}
                          </span>

                          <div className="space-y-3 sm:space-y-4 relative z-10">
                            {/* Card Header with Icon & Category */}
                            <div className="flex items-center justify-between">
                              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-[#F6F4DE] text-[#556038] flex items-center justify-center group-hover/card:bg-[#556038] group-hover/card:text-white transition-all duration-300 shadow-sm shrink-0">
                                <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover/card:scale-110" />
                              </div>
                              <span className="text-[9px] xs:text-[10px] uppercase tracking-wider sm:tracking-widest text-[#556038] font-semibold bg-[#FAF9F2] px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-black/5">
                                {item.category}
                              </span>
                            </div>

                            {/* Title & User-Provided Content */}
                            <div>
                              <div className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-knowza-dark/50 mb-1">
                                Point {item.number}
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
                            <span className="text-[#556038] font-semibold">{item.highlight}</span>
                            <ArrowUpRight className="w-3.5 h-3.5 text-[#556038] opacity-0 group-hover/card:opacity-100 transition-opacity" />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Container>
      </section>

      {/* ========================================================
          02.2 GROWTH & EXPANSION ROADMAP (ARCHITECTURAL VIEWFINDER FOCUS)
          ======================================================== */}
      <section className="py-14 sm:py-24 md:py-36 bg-[#F6F4DE] border-b border-black/5 relative overflow-hidden">
        {/* Subtle Background Watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[70px] xs:text-[100px] sm:text-[180px] md:text-[240px] font-serif font-bold text-black/[0.025] uppercase tracking-widest select-none pointer-events-none whitespace-nowrap">
          ROADMAP
        </div>

        <Container className="relative z-10">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-14 space-y-3 sm:space-y-4">
            <SectionLabel label="FUTURE TRAJECTORY" color="olive" alignment="center" />
            <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-serif font-normal text-knowza-dark tracking-tight leading-[1.15] mt-2">
              Growth &amp; Expansion Roadmap
            </h2>
            <p className="text-xs sm:text-sm md:text-base font-sans text-knowza-dark/75 font-light leading-relaxed max-w-xl mx-auto">
              A phased, conscious journey — scaling our eco-hospitality model from ancestral southern terrains to a global conscious movement.
            </p>

            {/* Mobile Timeline Quick Switcher (Visible on mobile/tablet screens) */}
            <div className="flex md:hidden items-center justify-center gap-1.5 pt-2">
              {ROADMAP_STAGES.map((stage, idx) => {
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
              {ROADMAP_STAGES.map((stage, idx) => {
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

          {/* 3-Stage Milestone High-Focus Photographic Bento Grid */}
          <div
            className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-8 items-stretch"
            onMouseLeave={() => setFocusedRoadmapIndex(null)}
          >
            {ROADMAP_STAGES.map((stage, index) => {
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
                      src={stage.image}
                      alt={stage.imageAlt}
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
                      <span className={`w-1.5 h-1.5 rounded-full ${stage.badgeDotClass} animate-pulse`} />
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

                    {/* 3 Milestone Expansion Points */}
                    <div className="space-y-2 pt-2 border-t border-black/8">
                      {stage.highlights.map((item, hIdx) => {
                        const IconComp = item.icon;
                        return (
                          <div key={hIdx} className="flex items-start gap-2 text-[11px] sm:text-xs font-sans text-knowza-dark/85">
                            <IconComp className="w-3.5 h-3.5 text-[#79864B] shrink-0 mt-0.5" />
                            <span className="leading-tight">{item.text}</span>
                          </div>
                        );
                      })}
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

      {/* ========================================================
          02.3 ARCHITECTURAL DIALOGUE & LIVING STATS
          ======================================================== */}
      <section className="py-14 sm:py-24 md:py-36 bg-[#F6F4DE] border-b border-black/5 relative">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-start">
            {/* Left Column: Eyebrow + Counters with GSAP Scrub Lines */}
            <div className="lg:col-span-4 space-y-6 sm:space-y-10">
              <SectionLabel label="BRAND SOUL" color="olive" />

              <div className="space-y-6 sm:space-y-8 pt-2">
                <div className="gsap-stat-item relative pb-5 sm:pb-6">
                  <span className="text-3xl sm:text-4xl md:text-5xl font-serif font-normal text-knowza-dark block tracking-tight">
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

                <div className="gsap-stat-item relative pb-5 sm:pb-6">
                  <span className="text-3xl sm:text-4xl md:text-5xl font-serif font-normal text-knowza-dark block tracking-tight">
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

                <div className="gsap-stat-item relative pb-5 sm:pb-6">
                  <span className="text-3xl sm:text-4xl md:text-5xl font-serif font-normal text-knowza-dark block tracking-tight">
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
            <div className="lg:col-span-8 space-y-6 sm:space-y-8">
              <TypewriterHeading
                className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-sans font-medium uppercase text-knowza-dark tracking-tight leading-[1.2]"
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 text-xs sm:text-sm font-sans text-knowza-dark/75 font-light leading-relaxed border-t border-black/10 pt-6 sm:pt-8">
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
                className="p-4 sm:p-6 md:p-8 bg-[#FAF9F2] rounded-2xl sm:rounded-[28px] border border-black/10 flex items-start gap-3.5 sm:gap-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <Sparkles className="w-5 h-5 text-[#8A7D4C] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm sm:text-base font-serif font-normal text-knowza-dark mb-1">
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
      <section className="py-12 sm:py-16 md:py-20 bg-[#F6F4DE] border-b border-black/5 relative">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-3">
            <SectionLabel label="PILLARS OF EXPERIENCE" color="olive" alignment="center" />
            <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-[40px] font-sans font-medium uppercase text-knowza-dark tracking-tight leading-[1.2]">
              The Living Triad
            </h2>
            <p className="text-xs sm:text-sm md:text-base font-sans text-knowza-dark/75 font-light leading-relaxed">
              Every Knowza sanctuary weaves together these fundamental dimensions into a unified,
              transformative experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8">
            {/* Pillar 1: Nature */}
            <div className="gsap-pillar-card bg-[#FAF9F2] border border-black/10 rounded-2xl sm:rounded-[28px] p-5 sm:p-7 md:p-8 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-500 group">
              <div className="space-y-3 sm:space-y-4">
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#8A7D4C] font-semibold block">
                  01 / NATURE
                </span>
                <h3 className="text-xl sm:text-2xl font-serif text-knowza-dark font-normal group-hover:text-knowza-forest transition-colors">
                  Rooted in the Wild
                </h3>
                <p className="text-xs sm:text-sm font-sans text-knowza-dark/75 font-light leading-relaxed">
                  We believe direct immersion in living landscapes restores the human spirit.
                  Untouched forest canopies, mountain streams, and native bio-diverse terrain form the
                  living backdrop of every stay.
                </p>
              </div>
              <div className="rounded-xl sm:rounded-[20px] overflow-hidden aspect-[16/10] sm:aspect-[4/3] mt-5 sm:mt-8 shadow-sm relative">
                <img
                  src="/images/gallery/rooted-earth.png"
                  alt="Rooted in nature"
                  className="gsap-pillar-img w-full h-[125%] -top-[12%] absolute object-cover filter brightness-95 group-hover:scale-105 transition-transform duration-700 ease-out will-change-transform"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Pillar 2: Culture */}
            <div className="gsap-pillar-card bg-[#FAF9F2] border border-black/10 rounded-2xl sm:rounded-[28px] p-5 sm:p-7 md:p-8 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-500 group">
              <div className="space-y-3 sm:space-y-4">
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#8A7D4C] font-semibold block">
                  02 / CULTURE
                </span>
                <h3 className="text-xl sm:text-2xl font-serif text-knowza-dark font-normal group-hover:text-knowza-forest transition-colors">
                  Living Heritage
                </h3>
                <p className="text-xs sm:text-sm font-sans text-knowza-dark/75 font-light leading-relaxed">
                  Authentic traditions, regional courtyard architecture, culinary heritage, and
                  folklore are not museum relics. They are lived memories celebrated daily through
                  mindful interaction with native elders.
                </p>
              </div>
              <div className="rounded-xl sm:rounded-[20px] overflow-hidden aspect-[16/10] sm:aspect-[4/3] mt-5 sm:mt-8 shadow-sm relative">
                <img
                  src="/images/gallery/courtyard.jpg"
                  alt="Living culture and courtyard"
                  className="gsap-pillar-img w-full h-[125%] -top-[12%] absolute object-cover filter brightness-95 group-hover:scale-105 transition-transform duration-700 ease-out will-change-transform"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Pillar 3: Connection */}
            <div className="gsap-pillar-card bg-[#FAF9F2] border border-black/10 rounded-2xl sm:rounded-[28px] p-5 sm:p-7 md:p-8 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-500 group">
              <div className="space-y-3 sm:space-y-4">
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#8A7D4C] font-semibold block">
                  03 / CONNECTION
                </span>
                <h3 className="text-xl sm:text-2xl font-serif text-knowza-dark font-normal group-hover:text-knowza-forest transition-colors">
                  Heartfelt Presence
                </h3>
                <p className="text-xs sm:text-sm font-sans text-knowza-dark/75 font-light leading-relaxed">
                  The deepest essence of hospitality is human warmth. Unforced dialogues around an
                  evening fire, shared meals prepared with seasonal harvest, and genuine quiet care
                  create bonds that outlive any itinerary.
                </p>
              </div>
              <div className="rounded-xl sm:rounded-[20px] overflow-hidden aspect-[16/10] sm:aspect-[4/3] mt-5 sm:mt-8 shadow-sm relative">
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
      <section className="py-12 sm:py-16 md:py-20 bg-[#F6F4DE] border-t border-black/5 relative">
        <Container>
          <div className="gsap-diptych-container grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-16 items-center">
            {/* Photographic Diptych with GSAP Opposing Parallax */}
            <div className="lg:col-span-7 grid grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              <div
                ref={diptychLeftRef}
                className="rounded-2xl sm:rounded-[28px] overflow-hidden h-44 xs:h-52 sm:h-64 md:h-96 shadow-md border border-black/5 will-change-transform"
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
                className="rounded-2xl sm:rounded-[28px] overflow-hidden h-44 xs:h-52 sm:h-64 md:h-96 shadow-md border border-black/5 mt-4 xs:mt-6 sm:mt-8 md:mt-12 will-change-transform"
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
            <div className="lg:col-span-5 space-y-4 sm:space-y-6">
              <SectionLabel label="SUSTAINED HARMONY" color="olive" />
              <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-serif text-knowza-dark font-normal leading-tight">
                Designed to Age Gracefully with the Terrain
              </h2>
              <p className="text-xs sm:text-sm md:text-base font-sans text-knowza-dark/75 font-light leading-relaxed">
                Rather than imposing artificial concrete monuments upon fragile terrains, every Knowza
                sanctuary is envisioned in slow collaboration with native carpenters, stonemasons,
                and herbalists.
              </p>
              <p className="text-xs sm:text-sm md:text-base font-sans text-knowza-dark/75 font-light leading-relaxed">
                Reclaimed teak, unpolished granite, breathable lime plasters, and rainwater harvesting
                ensure that our presence honors the ancient ground beneath our feet.
              </p>

              <div className="pt-2 sm:pt-4 flex flex-wrap gap-4">
                <Link
                  to="/contact"
                  className="w-full sm:w-auto text-center inline-flex items-center justify-center gap-2 rounded-full px-7 sm:px-8 py-3 sm:py-3.5 text-xs uppercase tracking-wider font-medium knowza-btn-liquid knowza-btn-liquid-dark group"
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
          06 FOUNDER SECTION: THE EDITORIAL MONOGRAPH & PERSONAL DISPATCH
          ======================================================== */}
      <section className="gsap-founder-section py-20 sm:py-28 md:py-36 bg-[#FBF9F4] border-t border-black/8 relative overflow-hidden">
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
                    src="/founder.jpg"
                    alt="Mohammed Safwan - Founder, Knowza"
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
                      Mohammed Safwan
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.22em] text-[#8A7D4C] font-mono block">
                      Founder &bull; CEO
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-knowza-dark/50 block">
                      South India &bull; Est. 2026
                    </span>
                  </div>
                </div>

                {/* Integrated Core Philosophy Caption */}
                <div className="pt-3 mt-3 border-t border-black/6">
                  <p className="text-xs sm:text-[13px] font-serif italic text-knowza-dark/85 leading-relaxed">
                    &ldquo;An emotionally restored individual can become a powerful catalyst for positive change.&rdquo;
                  </p>
                  <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#8A7D4C] block mt-1 font-medium">
                    &mdash; Guiding Conviction
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
                    A NOTE FROM THE FOUNDER
                  </span>
                </div>

                <TypewriterHeading
                  className="text-2xl xs:text-3xl sm:text-4xl md:text-[42px] lg:text-[44px] font-serif font-light text-knowza-dark leading-[1.2] tracking-tight max-w-2xl"
                  segments={[
                    {
                      text: '"True hospitality doesn\'t simply host you — ',
                      className: 'text-knowza-dark',
                    },
                    {
                      text: 'it restores who you were before the modern noise began."',
                      className: 'text-[#79864B] italic font-normal',
                    },
                  ]}
                />
              </div>

              {/* Personal Essay Narrative: 3 Distinct Movements */}
              <div className="space-y-6 text-sm sm:text-[15px] font-sans text-knowza-dark/85 font-light leading-[1.8] border-t border-black/10 pt-6 sm:pt-8">
                {/* Movement 1: The Modern Condition */}
                <WaveParagraph
                  dropCap="W"
                  text="e live in an age of constant connectivity, yet profound human disconnection. Leaders, visionaries, and thinkers carry relentless mental pressure, while the quiet rhythms that once grounded human life have faded into digital acceleration."
                  delay={0.05}
                />

                {/* Movement 2: The Restoration Philosophy (Distinct Editorial Callout) */}
                <div className="border-l-2 border-[#79864B]/40 pl-5 sm:pl-6 my-4 bg-[#F3EFE7]/45 rounded-r-xl py-4 pr-4">
                  <span className="text-[9px] font-mono uppercase tracking-[0.22em] text-[#8A7D4C] block mb-1.5 font-semibold">
                    RESTORATIVE CONVICTION
                  </span>
                  <WaveParagraph
                    text="Knowza was not created to build another resort. It was born from a fundamental conviction: that when you place an emotionally burdened individual into the quiet cadence of living soil, clean mist, and ancient canopy trees, real restoration happens organically. Individual well-being is not a luxury; it is the prerequisite for all meaningful human contribution."
                    delay={0.16}
                    className="italic text-knowza-dark/90"
                  />
                </div>

                {/* Movement 3: The Environmental Crusade */}
                <WaveParagraph
                  text="Our ambition reaches far beyond hospitality. By mobilizing the collective influence of our community and adhering to uncompromising zero-plastic operating disciplines, our long-term crusade is to champion environmental resilience and advance the vision of a Plastic-Free India by 2050."
                  delay={0.28}
                />
              </div>

              {/* Hand-drawn Ink Signature & Authentic Sign-off Block */}
              <div className="gsap-signature-block pt-7 sm:pt-9 border-t border-black/10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div className="space-y-3">
                  <span className="text-[9px] font-mono uppercase tracking-[0.24em] text-[#8A7D4C] block font-semibold">
                    FOUNDER'S PERSONAL ENDORSEMENT
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
                      Mohammed Safwan
                    </span>
                    <span className="text-xs font-mono text-knowza-dark/65 tracking-wider block mt-0.5">
                      Founder &amp; CEO &bull; Knowza Eco-Hospitality Group
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
                    Founding Covenant &amp; Earth Charter
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
                    FOUNDING CHARTER &bull; SOUTH INDIA
                  </span>
                  <h3 id="charter-modal-title" className="text-xl sm:text-2xl font-serif font-normal text-knowza-dark">
                    The Founding Covenant &amp; Earth Charter
                  </h3>
                  <p className="text-xs font-mono text-knowza-dark/60 tracking-wider">
                    Authorised by Mohammed Safwan, Founder &amp; CEO
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

              {/* 3 Foundational Articles */}
              <div className="space-y-5 text-xs sm:text-[13px] font-sans text-knowza-dark/85 font-light leading-relaxed">
                <div className="p-4 rounded-xl bg-[#F3EFE7]/60 border border-black/6 space-y-1">
                  <div className="flex items-center gap-2 text-[#79864B]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#79864B]" />
                    <span className="font-mono uppercase tracking-widest text-[10px] font-semibold">
                      Article I: Sacred Stillness &amp; Emotional Restoration
                    </span>
                  </div>
                  <p className="text-knowza-dark/80">
                    We pledge that Knowza shall never treat human recovery as a commercial luxury. Every sanctuary is consecrated to quietude, unpolluted air, living soil, and ancient tree canopies &mdash; returning modern leaders to deep inner alignment.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#F3EFE7]/60 border border-black/6 space-y-1">
                  <div className="flex items-center gap-2 text-[#79864B]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#79864B]" />
                    <span className="font-mono uppercase tracking-widest text-[10px] font-semibold">
                      Article II: Architectural Humility &amp; Indigenous Craft
                    </span>
                  </div>
                  <p className="text-knowza-dark/80">
                    We commit to building in slow partnership with native terrain. No intrusive concrete monuments &mdash; our structures employ breathable lime plasters, unpolished stones, reclaimed timber, and natural hydrological circuits.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#F3EFE7]/60 border border-black/6 space-y-1">
                  <div className="flex items-center gap-2 text-[#79864B]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#79864B]" />
                    <span className="font-mono uppercase tracking-widest text-[10px] font-semibold">
                      Article III: Zero-Plastic India by 2050 Mandate
                    </span>
                  </div>
                  <p className="text-knowza-dark/80">
                    We enforce an uncompromising zero-single-use-plastic discipline across our supply chains, guest journeys, and property operations, standing as an active vanguard for environmental resilience.
                  </p>
                </div>
              </div>

              {/* Sign-off & Seal in Modal */}
              <div className="pt-4 border-t border-black/10 flex items-center justify-between">
                <div>
                  <span className="text-sm font-serif font-medium text-knowza-dark block">
                    Mohammed Safwan
                  </span>
                  <span className="text-[10px] font-mono text-knowza-dark/50 tracking-wider block">
                    Founder &amp; CEO &bull; Knowza
                  </span>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 rounded-md bg-[#F6F4DE] text-[9px] font-mono uppercase tracking-widest text-[#79864B] font-semibold border border-[#79864B]/20">
                    OFFICIAL CHARTER RECORD
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================
          07 CLOSING CTA SECTION
          ======================================================== */}
      <CTASection />
    </div>
  );
};
