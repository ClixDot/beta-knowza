import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Compass, Sparkles } from 'lucide-react';

export type OfferingPath = 'hospitality' | 'healing';

export interface OfferingCardData {
  id: OfferingPath;
  tag: string;
  badge?: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  objectPosition?: string;
  ctaText: string;
  buttonVariant?: 'dark' | 'olive' | 'outline';
}

const defaultOfferings: OfferingCardData[] = [
  {
    id: 'hospitality',
    tag: '01 / HOSPITALITY',
    badge: 'Experiential Hospitality',
    title: 'Experiential Hospitality',
    description:
      'Reconnect with untouched nature and raw culture. Step away from the digital chaos to rediscover barefoot childhood wonders, soulful community, and timeless earth.',
    image: '/images/offerings/experiential-hospitality.jpg',
    imageAlt: 'Young explorer rediscovering barefoot childhood wonder, examining forest moss and acorns with a magnifying glass',
    objectPosition: '50% 50%',
    ctaText: 'EXPLORE EXPERIENCES',
    buttonVariant: 'dark',
  },
  {
    id: 'healing',
    tag: '02 / WELLBEING & RETREAT',
    badge: 'The Healing Journey',
    title: 'The Healing Journey',
    description:
      'A deeply restorative sanctuary designed for leaders and visionaries to heal, release deep-seated trauma, and restore inner stillness with expert guides.',
    image: '/images/offerings/healing-retreat.jpg',
    imageAlt: 'Restorative mindful yoga and meditation retreat by the misty lake under sunlit forest canopy',
    objectPosition: '50% 58%',
    ctaText: 'DISCOVER HEALING',
    buttonVariant: 'olive',
  },
];

export interface OfferingsSectionProps {
  heading?: string;
  tagline?: string;
  subtitle?: string;
  offerings?: OfferingCardData[];
  className?: string;
  id?: string;
}

export const OfferingsSection: React.FC<OfferingsSectionProps> = ({
  heading = 'OUR OFFERINGS',
  tagline = 'CURATED EXPERIENCES',
  subtitle = 'Two pathways to reconnect with the earth and your inner self.',
  offerings = defaultOfferings,
  className = '',
  id = 'offerings',
}) => {
  return (
    <section
      id={id}
      className={`relative py-20 sm:py-28 md:py-36 bg-[#EDEABF] text-knowza-dark overflow-hidden border-t border-black/5 ${className}`}
    >

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-14 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-3 mb-4"
          >
            <span className="w-6 h-[1.5px] bg-[#8A7D4C]" />
            <span className="text-xs font-sans uppercase tracking-[0.28em] text-[#8A7D4C] font-semibold">
              {tagline}
            </span>
            <span className="w-6 h-[1.5px] bg-[#8A7D4C]" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.75, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-serif font-normal text-knowza-dark tracking-tight leading-[1.15]"
          >
            {heading}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.75, delay: 0.2 }}
            className="text-base sm:text-lg font-sans text-knowza-dark/75 font-light leading-relaxed mt-4 max-w-xl mx-auto"
          >
            {subtitle}
          </motion.p>
        </div>

        {/* 2-Column Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 items-stretch">
          {offerings.map((offering, index) => {
            const isFirst = index === 0;

            return (
              <motion.article
                key={offering.tag}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{
                  duration: 0.85,
                  delay: isFirst ? 0.15 : 0.3,
                  ease: [0.25, 1, 0.5, 1],
                }}
                className="group relative flex flex-col rounded-3xl sm:rounded-[32px] overflow-hidden bg-[#FAF9F2] border border-black/[0.08] shadow-[0_4px_24px_-6px_rgba(37,39,31,0.06)] hover:shadow-[0_24px_50px_-14px_rgba(40,53,31,0.16)] transition-all duration-500 hover:-translate-y-1.5"
              >
                {/* Visual Imagery Container */}
                <div className="relative aspect-[16/11] sm:aspect-[16/11] w-full overflow-hidden bg-knowza-deep">
                  <img
                    src={offering.image}
                    alt={offering.imageAlt}
                    style={{ objectPosition: offering.objectPosition || 'center' }}
                    className="w-full h-full object-cover filter brightness-[0.94] contrast-[1.03] transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Cinematic Natural Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent pointer-events-none" />
                  <div className="absolute inset-0 bg-knowza-deep/10 mix-blend-multiply pointer-events-none" />

                  {/* Subtle Badge Tag */}
                  {offering.badge && (
                    <div className="absolute top-5 left-5 sm:top-6 sm:left-6 z-10">
                      <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] uppercase tracking-widest text-[#FAF9F2] bg-black/45 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 font-medium shadow-sm">
                        {isFirst ? (
                          <Compass className="w-3 h-3 text-[#EEE9BF]" />
                        ) : (
                          <Sparkles className="w-3 h-3 text-[#EEE9BF]" />
                        )}
                        {offering.badge}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Content & Narrative */}
                <div className="p-7 sm:p-9 lg:p-11 flex flex-col flex-1 justify-between gap-6 bg-[#FAF9F2]">
                  <div className="space-y-3.5">
                    {/* Editorial Tag */}
                    <span className="text-[11px] sm:text-xs font-sans uppercase tracking-[0.25em] text-[#8A7D4C] font-semibold block">
                      {offering.tag}
                    </span>

                    {/* Title */}
                    <h3 className="text-2xl sm:text-3xl lg:text-[34px] font-serif font-normal text-knowza-dark tracking-tight leading-snug group-hover:text-knowza-forest transition-colors duration-300">
                      {offering.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm sm:text-[15px] font-sans text-knowza-dark/75 font-light leading-relaxed pt-1">
                      {offering.description}
                    </p>
                  </div>

                  {/* CTA Action - Navigates to dedicated separate page on About */}
                  <div className="pt-4 border-t border-black/5">
                    <Link
                      to={`/about?tab=${offering.id}#curated-pathways`}
                      className={`inline-flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto px-7 sm:px-8 py-3.5 sm:py-4 rounded-full text-xs uppercase tracking-widest-editorial font-medium transition-all duration-300 shadow-sm group/btn select-none cursor-pointer ${
                        offering.buttonVariant === 'olive'
                          ? 'bg-[#79864B] text-[#FAF9F2] hover:bg-knowza-deep hover:shadow-md border border-[#79864B]'
                          : offering.buttonVariant === 'outline'
                          ? 'bg-transparent text-knowza-dark border border-knowza-dark/30 hover:border-knowza-dark hover:bg-knowza-dark hover:text-[#FAF9F2]'
                          : 'bg-knowza-dark text-[#FAF9F2] hover:bg-[#79864B] hover:shadow-md border border-knowza-dark/10'
                      }`}
                    >
                      <span>{offering.ctaText}</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:translate-x-1.5 shrink-0" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default OfferingsSection;
