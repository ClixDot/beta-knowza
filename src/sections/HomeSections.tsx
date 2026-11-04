import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Container } from '../components/Container';
import { SectionLabel } from '../components/SectionLabel';
import { Counter } from '../components/Counter';
import { TypewriterHeading } from '../components/TypewriterHeading';
import { InfiniteScrollMarquee } from '../components/InfiniteScrollMarquee';
import { InteractiveDispatchesCard } from '../components/InteractiveDispatchesCard';
import { CmsButton } from '../components/cms/CmsLink';
import { useLivePosts } from '../cms/hooks/useSiteContent';
import { hasVideo, imageStyle } from '../cms/utils';

export const HomeHeroSection: React.FC<{ content: any }> = ({ content }) => {
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
  const line1X = useTransform(heroScrollProgress, [0, 0.8], ['0%', '-6%']);
  // Line 2 drifts smoothly to the right
  const line2X = useTransform(heroScrollProgress, [0, 0.8], ['0%', '6%']);
  // Line 3 drifts smoothly to the left with varied pace
  const line3X = useTransform(heroScrollProgress, [0, 0.8], ['0%', '-4%']);

  const headlineOpacity = useTransform(heroScrollProgress, [0, 0.75], [1, 0.25]);
  const subY = useTransform(heroScrollProgress, [0, 0.5], ['0px', '-35px']);

  const backgroundClass = 'w-full h-full object-cover object-center filter brightness-[0.78] contrast-[1.08]';

  return (
    <div ref={heroWrapperRef} className="relative h-[100dvh] h-[100vh] sm:h-[112vh] w-full bg-[#F6F4DE]">
      <div className="sticky top-0 h-[100dvh] h-[100vh] w-full flex items-center justify-center overflow-hidden">
        <motion.section
          style={{
            scale: heroScale,
            borderRadius: heroBorderRadius,
            transformOrigin: 'center center',
          }}
          className="relative w-full h-full overflow-hidden bg-knowza-deep text-white flex flex-col items-center justify-center px-4 sm:px-10 md:px-14 lg:px-20 pt-14 sm:pt-20 pb-8 sm:pb-12 shadow-2xl will-change-transform"
        >
          {/* Cinematic Background Image with Slow Scale */}
          <div className="absolute inset-0 z-0">
            <motion.div
              initial={{ scale: 1.06 }}
              animate={{ scale: 1.0 }}
              transition={{ duration: 3.5, ease: [0.25, 1, 0.5, 1] }}
              className="w-full h-full"
            >
              {hasVideo(content.video) ? (
                <video
                  src={content.video.src}
                  poster={content.video.poster || content.image.src}
                  autoPlay={content.video.autoplay}
                  muted={content.video.muted}
                  loop={content.video.loop}
                  controls={content.video.controls}
                  playsInline
                  className={backgroundClass}
                />
              ) : (
                <img
                  src={content.image.src}
                  alt={content.image.alt}
                  style={imageStyle(content.image)}
                  className={backgroundClass}
                  loading="eager"
                />
              )}
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

          {/* Giant Architectural Display Headline + Action Buttons */}
          <div className="relative z-10 max-w-6xl mx-auto w-full text-center flex flex-col items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, ease: [0.25, 1, 0.5, 1] }}
              className="flex flex-col items-center text-center w-full"
            >
              <motion.span
                style={{ y: subY, opacity: headlineOpacity }}
                className="text-[9px] xs:text-[10px] sm:text-xs font-sans uppercase tracking-[0.24em] sm:tracking-[0.28em] text-knowza-cream/80 block mb-2 sm:mb-3 font-medium will-change-transform text-center"
              >
                {content.eyebrow}
              </motion.span>
              <h1 className="font-display font-black italic uppercase text-[24px] xs:text-[28px] sm:text-4xl md:text-5xl lg:text-[54px] xl:text-[62px] 2xl:text-[68px] text-[#ECE7D7] tracking-[0.02em] sm:tracking-[0.03em] lg:tracking-[0.04em] leading-[1.02] sm:leading-[0.96] select-none break-words flex flex-col items-center text-center px-4 max-w-5xl mx-auto">
                <motion.span
                  style={{ x: line1X, opacity: headlineOpacity }}
                  className="inline-block whitespace-nowrap will-change-transform"
                >
                  {content.line1}
                </motion.span>
                <motion.span
                  style={{ x: line2X, opacity: headlineOpacity }}
                  className="inline-block whitespace-nowrap will-change-transform text-[#6D7A43]"
                >
                  {content.line2}
                </motion.span>
                <motion.span
                  style={{ x: line3X, opacity: headlineOpacity }}
                  className="inline-flex flex-col sm:flex-row items-center justify-center will-change-transform"
                >
                  <span className="whitespace-nowrap inline-block">{content.line3}</span>
                  <span className="whitespace-nowrap inline-block sm:ml-2.5">{content.line3b}</span>
                </motion.span>
              </h1>

              {/* Unified Hero Action Buttons */}
              <motion.div
                style={{ opacity: headlineOpacity }}
                className="mt-5 sm:mt-8 md:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-4 w-full sm:w-auto px-6 xs:px-10 sm:px-0 max-w-xs sm:max-w-none mx-auto"
              >
                {content.buttons.map((button: any, index: number) => (
                  <CmsButton
                    key={button.id}
                    button={button}
                    className={`inline-flex items-center justify-center gap-2 ${index === 0 ? 'px-5 sm:px-8 shadow-xl' : 'px-5 sm:px-7 text-center'} py-2.5 sm:py-3.5 rounded-full font-sans font-medium text-[11px] sm:text-xs tracking-wider uppercase group whitespace-nowrap`}
                    arrowClass="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                ))}
              </motion.div>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export const BrandStatementSection: React.FC<{ content: any }> = ({ content }) => (
  <section id="brand-statement" className="pt-8 sm:pt-12 md:pt-14 pb-20 md:pb-28 bg-[#F6F4DE] relative">
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
            {content.eyebrow}
          </span>

          <div className="space-y-8 pt-2">
            {content.stats.map((stat: any, index: number) => (
              <div key={stat.id} className={index > 0 ? 'pt-6 border-t border-black/10' : undefined}>
                <span className="text-4xl sm:text-5xl font-serif font-normal text-knowza-dark block tracking-tight">
                  <Counter value={stat.value} suffix={stat.suffix} padZero={stat.padZero} duration={stat.duration} />
                </span>
                <span className="text-xs uppercase tracking-wider text-knowza-dark/70 font-medium block mt-1">
                  {stat.label}
                </span>
                <p className="text-xs font-sans text-knowza-dark/60 font-light mt-1">{stat.text}</p>
              </div>
            ))}
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
              { text: content.headingStart, className: 'text-knowza-dark' },
              { text: content.headingHighlight, className: 'text-[#8A7D4C] font-semibold' },
              { text: content.headingEnd, className: 'text-knowza-dark' },
            ]}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm font-sans text-knowza-dark/75 font-light leading-relaxed border-t border-black/10 pt-8">
            <p>{content.paragraphOne}</p>
            <p>{content.paragraphTwo}</p>
          </div>

          {content.buttons.length > 0 && (
            <div className="pt-2 flex flex-wrap gap-3">
              {content.buttons.map((button: any) => (
                <CmsButton
                  key={button.id}
                  button={button}
                  className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-xs uppercase tracking-wider font-medium group"
                  arrowClass="w-3.5 h-3.5 transition-transform group-hover:translate-x-1"
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </Container>
  </section>
);

const ScrollPillarCard: React.FC<{ card: any; startOffset: string; endOffset: string }> = ({ card, startOffset, endOffset }) => {
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
          src={card.image.src}
          alt={card.image.alt}
          style={imageStyle(card.image)}
          className="w-full h-full object-cover filter brightness-[0.92] group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />
      </div>
      <div className="pt-4 space-y-1">
        <h4 className="text-base sm:text-lg font-serif font-medium text-knowza-dark group-hover:text-knowza-forest transition-colors">
          {card.title}
        </h4>
        <p className="text-xs font-sans text-knowza-dark/70 font-light leading-relaxed">{card.description}</p>
      </div>
    </motion.div>
  );
};

export const SanctuaryFeaturesSection: React.FC<{ content: any }> = ({ content }) => (
  <section className="py-20 md:py-28 bg-[#F6F4DE] border-t border-black/5 relative">
    <Container>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {content.cards.map((card: any, index: number) => {
          // Cards land in a staggered cascade across the row.
          const step = index % 3;
          return (
            <ScrollPillarCard
              key={card.id}
              card={card}
              startOffset={(0.92 - step * 0.06).toFixed(2)}
              endOffset={(0.48 - step * 0.06).toFixed(2)}
            />
          );
        })}
      </div>
    </Container>
  </section>
);

export const FoundationsSection: React.FC<{ content: any }> = ({ content }) => {
  const { rooted, culture, connection, experienced } = content;
  return (
    <section className="py-20 md:py-28 bg-[#F6F4DE] border-t border-black/5 relative overflow-hidden">
      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mb-12 sm:mb-16 space-y-4"
        >
          <SectionLabel label={content.eyebrow} color="olive" />
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-knowza-dark font-normal tracking-tight">
            {content.heading}
          </h2>
          <p className="text-sm md:text-base font-sans text-knowza-dark/75 font-light leading-relaxed pt-1">
            {content.description}
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
                className="bg-[#FAF9F2] border border-black/10 rounded-[28px] p-8 md:p-9 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-500 min-h-[300px] group cursor-default"
              >
                <div className="text-center">
                  <span className="text-[11px] font-sans uppercase tracking-[0.25em] text-[#8A7D4C] font-semibold block mb-2">
                    {rooted.tag}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-serif text-knowza-dark font-normal tracking-wide mb-2.5">
                    {rooted.title}
                  </h3>
                  <p className="text-xs sm:text-[13px] font-sans text-knowza-dark/75 font-light leading-relaxed max-w-xs mx-auto">
                    {rooted.text}
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

              {/* Card 2: 02 / Shaped by Culture (THE GREEN CARD with AUTOMATIC CONTINUOUS BREATHING ZOOM) */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="w-full flex"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.045, 1],
                    boxShadow: [
                      '0 10px 24px -6px rgba(0, 0, 0, 0.16), 0 4px 8px -4px rgba(0, 0, 0, 0.08)',
                      '0 24px 44px -10px rgba(78, 92, 45, 0.4), 0 14px 20px -6px rgba(0, 0, 0, 0.2)',
                      '0 10px 24px -6px rgba(0, 0, 0, 0.16), 0 4px 8px -4px rgba(0, 0, 0, 0.08)',
                    ],
                  }}
                  transition={{
                    duration: 6,
                    ease: 'easeInOut',
                    repeat: Infinity,
                    repeatType: 'loop',
                  }}
                  style={{ transformOrigin: 'center center' }}
                  className="w-full bg-[#79864B] border border-[#8C9A5C]/40 text-white rounded-[28px] p-8 md:p-9 flex flex-col items-center text-center justify-center min-h-[300px] group cursor-default relative overflow-hidden will-change-transform"
                >
                  <div className="relative z-10">
                    <span className="text-[11px] font-sans uppercase tracking-[0.25em] text-[#EEE9BF] font-semibold block mb-2">
                      {culture.tag}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-serif text-[#FAF9F2] font-normal tracking-wide mb-2.5">
                      {culture.title}
                    </h3>
                    <p className="text-xs sm:text-[13px] font-sans text-white/90 font-light leading-relaxed max-w-xs mx-auto">
                      {culture.text}
                    </p>
                  </div>
                </motion.div>
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
                src={connection.image.src}
                alt={connection.image.alt}
                style={imageStyle(connection.image)}
                className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.88] contrast-[1.05] transition-transform duration-1000 ease-out group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/30 group-hover:from-black/90 group-hover:via-black/50 transition-colors duration-500" />

              <div className="relative z-10 h-full p-8 md:p-10 flex flex-col items-center justify-center text-center text-[#F4F0D5]">
                <span className="text-[11px] font-sans uppercase tracking-[0.25em] text-knowza-bronze font-semibold block mb-2">
                  {connection.tag}
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif text-white font-normal tracking-wide mb-3">
                  {connection.title}
                </h3>
                <p className="text-xs sm:text-[13px] font-sans text-white/90 font-light leading-relaxed max-w-md mx-auto">
                  {connection.text}
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
                  {experienced.tag}
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif text-[#F4F0D5] font-normal tracking-wide mb-3">
                  {experienced.title}
                </h3>
                <p className="text-xs sm:text-[13px] font-sans text-[#F4F0D5]/80 font-light leading-relaxed">
                  {experienced.text}
                </p>
              </div>

              {/* Bottom Section */}
              <div className="relative z-10 text-center md:text-left pt-10 border-t border-[#8A7D4C]/30">
                <h4 className="text-xl sm:text-2xl font-serif text-[#F4F0D5] font-normal tracking-wide mb-2.5">
                  {experienced.subTitle}
                </h4>
                <p className="text-xs sm:text-[13px] font-sans text-[#F4F0D5]/80 font-light leading-relaxed mb-6">
                  {experienced.subText}
                </p>

                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  {experienced.buttons.map((button: any) => (
                    <CmsButton
                      key={button.id}
                      button={button}
                      className="inline-flex items-center gap-2 text-xs uppercase tracking-widest-editorial font-medium px-7 py-3 rounded-full group"
                      arrowClass="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export const MomentsSection: React.FC<{ content: any }> = ({ content }) => {
  // Gallery section background parallax
  const gallerySectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress: galleryScroll } = useScroll({
    target: gallerySectionRef,
    offset: ['start end', 'end start'],
  });
  const bgWorkLine1X = useTransform(galleryScroll, [0, 1], ['5%', '-15%']);
  const bgWorkLine2X = useTransform(galleryScroll, [0, 1], ['-15%', '5%']);
  const bgWorkLine3X = useTransform(galleryScroll, [0, 1], ['2%', '-12%']);

  const word = content.watermark;
  const repeat = word ? Array(5).fill(word).join('  ·  ') : '';
  const lineClass = 'font-display font-black italic tracking-tighter uppercase text-[#566033] text-[11vw] sm:text-[9vw] md:text-[7.5vw] leading-[0.85] whitespace-nowrap will-change-transform';

  return (
    <section
      ref={gallerySectionRef}
      className="relative py-20 sm:py-28 md:py-36 bg-[#79864B] text-white overflow-hidden border-t border-black/10"
    >
      {/* Giant Watermark Repeating Background Typography with Scroll Parallax */}
      <div className="absolute inset-0 flex flex-col justify-around pointer-events-none select-none overflow-hidden opacity-30 z-0">
        <motion.div style={{ x: bgWorkLine1X }} className={lineClass}>{repeat}</motion.div>
        <motion.div style={{ x: bgWorkLine2X }} className={lineClass}>{repeat}</motion.div>
        <motion.div style={{ x: bgWorkLine3X }} className={lineClass}>{repeat}</motion.div>
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
                {content.eyebrow}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#FAF9F2] font-normal">
              {content.heading}
            </h2>
          </div>
          <CmsButton
            button={content.button}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest-editorial font-medium rounded-full px-6 py-2.5 group w-fit"
            plainClass="bg-white/10 hover:bg-white/20 text-[#FAF9F2] border border-white/15 transition-all backdrop-blur-sm"
            arrowClass="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1 text-[#EEE9BF]"
          />
        </motion.div>
      </Container>

      {/* Continuous Non-Stop Marquee with Scroll Direction Responsiveness */}
      <InfiniteScrollMarquee cards={content.cards} />
    </section>
  );
};

export const DispatchesSection: React.FC<{ content: any }> = ({ content }) => {
  const posts = useLivePosts();
  const shown = content.limit > 0 ? posts.slice(0, content.limit) : posts;
  if (shown.length === 0) return null;

  return (
    <section className="py-24 md:py-32 bg-[#F6F4DE] border-t border-black/5 overflow-hidden">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14 gap-6"
        >
          <div>
            <SectionLabel label={content.eyebrow} color="olive" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-knowza-dark font-normal mt-4">
              {content.heading}
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {content.buttons.map((button: any) => (
              <CmsButton
                key={button.id}
                button={button}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest-editorial font-medium rounded-full px-7 py-3 group"
                arrowClass="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              />
            ))}
          </div>
        </motion.div>

        <InteractiveDispatchesCard posts={shown} readLabel={content.readLabel} counterLabel={content.counterLabel} />
      </Container>
    </section>
  );
};
