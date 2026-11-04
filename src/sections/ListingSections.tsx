import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ArrowRight, Calendar, Clock, MapPin, Maximize2, Send } from 'lucide-react';
import { Container } from '../components/Container';
import { GalleryLightbox } from '../components/GalleryLightbox';
import { InnerPageHero } from '../components/InnerPageHero';
import { useLivePosts, useSiteContent } from '../cms/hooks/useSiteContent';
import { saveSubscriber } from '../cms/services/submissions';
import type { GalleryItemDoc } from '../cms/types';
import { imageStyle } from '../cms/utils';

export const InnerHeroSection: React.FC<{ content: any }> = ({ content }) => (
  <InnerPageHero
    watermarkTop={content.watermark}
    eyebrow={content.eyebrow}
    titleLine1={content.line1}
    titleHighlight={content.highlight}
    titleLine2={content.line2}
    subtitle={content.subtitle}
    className={content.compact ? 'border-b-0 pb-10 sm:pb-14 md:pb-16' : ''}
  />
);

const filterButtonClass = (isActive: boolean) =>
  `relative h-9 sm:h-9.5 px-4 sm:px-5 rounded-full text-xs uppercase tracking-widest-editorial font-medium transition-all duration-300 whitespace-nowrap focus:outline-none inline-flex items-center justify-center gap-2 shrink-0 select-none shadow-sm ${
    isActive
      ? 'bg-knowza-deep text-white ring-1 ring-knowza-deep shadow-md'
      : 'bg-[#F6F4DE] text-knowza-dark/75 hover:text-knowza-dark hover:bg-black/[0.04] border border-black/10'
  }`;

const countBadgeClass = (isActive: boolean) =>
  `relative z-10 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-sans font-semibold tracking-normal leading-none rounded-full transition-colors ${
    isActive ? 'bg-white/20 text-white' : 'bg-black/5 text-knowza-dark/60'
  }`;

const FilterBar: React.FC<{
  options: { value: string; label: string; count: number }[];
  active: string;
  showCounts?: boolean;
  onChange: (value: string) => void;
}> = ({ options, active, showCounts = true, onChange }) => (
  <section className="sticky top-[68px] md:top-[80px] z-30 bg-[#F6F4DE]/90 backdrop-blur-md border-b border-black/5 py-3 sm:py-4">
    <Container>
      <div className="flex items-center justify-start md:justify-center overflow-x-auto no-scrollbar gap-2 sm:gap-2.5 py-1 -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth">
        {options.map((option) => {
          const isActive = active === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={(e) => {
                onChange(option.value);
                e.currentTarget.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
              }}
              className={filterButtonClass(isActive)}
              aria-pressed={isActive}
            >
              <span className="relative z-10 leading-none">{option.label}</span>
              {showCounts && <span className={countBadgeClass(isActive)}>{option.count}</span>}
            </button>
          );
        })}
      </div>
    </Container>
  </section>
);

const ALL = '__all__';

export const GalleryGridSection: React.FC<{ content: any }> = ({ content }) => {
  const { gallery } = useSiteContent();
  const items = useMemo(() => gallery.items.filter((item) => item.enabled), [gallery.items]);
  const [activeCategory, setActiveCategory] = useState(ALL);
  const [selectedItem, setSelectedItem] = useState<GalleryItemDoc | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const filteredItems = useMemo(() => {
    if (activeCategory === ALL) return items;
    return items.filter((item) => item.category === activeCategory);
  }, [activeCategory, items]);

  const options = [
    { value: ALL, label: content.allLabel, count: items.length },
    ...gallery.categories
      .filter((category) => category.enabled)
      .map((category) => ({
        value: category.name,
        label: category.name,
        count: items.filter((item) => item.category === category.name).length,
      })),
  ];

  const handleOpenLightbox = (item: GalleryItemDoc) => {
    setSelectedItem(item);
    setIsLightboxOpen(true);
  };

  const layout: string = content.layout;
  const cardShell = (item: GalleryItemDoc, colSpanClass: string) => (
    <motion.div
      key={item.id}
      layout={layout !== 'masonry'}
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
      whileHover={{ y: -6 }}
      className={`group relative rounded-[28px] overflow-hidden cursor-pointer bg-knowza-deep shadow-md hover:shadow-2xl transition-all duration-500 border border-black/5 ${colSpanClass}`}
      onClick={() => handleOpenLightbox(item)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleOpenLightbox(item);
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`View ${item.title}`}
    >
      {/* Visual Asset */}
      <img
        src={item.image}
        alt={item.alt}
        style={imageStyle(item)}
        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-[0.88] group-hover:brightness-100"
        loading="lazy"
      />

      {/* Gradient Depth Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10 opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

      {/* Top Floating Pill Badge */}
      <div className="absolute top-5 left-5 right-5 flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-widest-editorial text-white/90 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/15">
          {item.category}
        </span>

        {/* Expand Action Pill */}
        <div className="p-2.5 rounded-full bg-black/40 backdrop-blur-md text-white/90 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-all duration-300 border border-white/20 transform translate-y-1 group-hover:translate-y-0 shadow-lg">
          <Maximize2 className="w-4 h-4" />
        </div>
      </div>

      {/* Bottom Editorial Caption */}
      <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
        {item.location && (
          <div className="flex items-center gap-1.5 text-xs text-[#F6F4DE]/80 font-sans">
            <MapPin className="w-3.5 h-3.5 text-[#8A7D4C]" />
            <span>{item.location}</span>
          </div>
        )}

        <h3 className="text-xl sm:text-2xl font-serif text-white font-normal tracking-wide leading-snug">
          {item.title}
        </h3>

        <p className="text-xs font-sans text-white/80 font-light line-clamp-2 leading-relaxed opacity-90 max-w-lg">
          {item.description}
        </p>
      </div>
    </motion.div>
  );

  const spanFor = (idx: number) => {
    if (layout === 'grid') return 'lg:col-span-4 h-[320px] sm:h-[380px] md:h-[440px]';
    // Editorial asymmetric distribution (some cards span 7 cols, others 5 or 4)
    const isSpan7 = idx % 5 === 0;
    const isSpan5 = idx % 5 === 1;
    return isSpan7
      ? 'lg:col-span-7 h-[340px] sm:h-[420px] md:h-[480px]'
      : isSpan5
      ? 'lg:col-span-5 h-[340px] sm:h-[420px] md:h-[480px]'
      : 'lg:col-span-4 h-[320px] sm:h-[380px] md:h-[440px]';
  };

  const masonryHeight: Record<string, string> = {
    portrait: 'h-[420px] sm:h-[480px]',
    landscape: 'h-[260px] sm:h-[300px]',
    square: 'h-[340px] sm:h-[380px]',
  };

  return (
    <>
      {content.showFilters && (
        <FilterBar options={options} active={activeCategory} showCounts={content.showCounts} onChange={setActiveCategory} />
      )}

      <section className="py-12 sm:py-16 md:py-28">
        <Container>
          {layout === 'masonry' ? (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 sm:gap-6 lg:gap-8 [&>*]:mb-5 sm:[&>*]:mb-6 lg:[&>*]:mb-8 [&>*]:break-inside-avoid">
              {filteredItems.map((item) => cardShell(item, masonryHeight[item.aspectRatio] ?? masonryHeight.square))}
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8">
              <AnimatePresence mode="popLayout">
                {filteredItems.map((item, idx) => cardShell(item, spanFor(idx)))}
              </AnimatePresence>
            </motion.div>
          )}
        </Container>
      </section>

      {/* Lightbox Dialog */}
      <GalleryLightbox
        item={selectedItem}
        items={filteredItems}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        onNavigate={(newItem) => setSelectedItem(newItem)}
      />
    </>
  );
};

export const BlogListingSection: React.FC<{ content: any }> = ({ content }) => {
  const { blog } = useSiteContent();
  const posts = useLivePosts();
  const [activeCategory, setActiveCategory] = useState(ALL);

  const filteredPosts = useMemo(() => {
    if (activeCategory === ALL) return posts;
    return posts.filter((post) => post.category === activeCategory);
  }, [activeCategory, posts]);

  const featuredPost = filteredPosts.find((post) => post.featured) ?? filteredPosts[0];
  const regularPosts = filteredPosts.filter((post) => post !== featuredPost);

  const options = [
    { value: ALL, label: content.allLabel, count: posts.length },
    ...blog.categories
      .filter((category) => category.enabled)
      .map((category) => ({
        value: category.name,
        label: category.name,
        count: posts.filter((post) => post.category === category.name).length,
      })),
  ];

  const activeDescription = blog.categories.find((c) => c.name === activeCategory)?.description;

  return (
    <>
      <FilterBar options={options} active={activeCategory} onChange={setActiveCategory} />

      <section className="py-12 sm:py-16 md:py-24">
        <Container>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
              className="space-y-12 sm:space-y-16"
            >
              {activeDescription && (
                <p className="max-w-2xl mx-auto text-center text-sm font-sans text-knowza-dark/75 font-light leading-relaxed">
                  {activeDescription}
                </p>
              )}

              {!featuredPost && (
                <p className="py-16 text-center text-sm font-sans text-knowza-dark/70 font-light">{content.emptyMessage}</p>
              )}

              {/* Featured Dispatch Monolith */}
              {featuredPost && (
                <motion.div
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.85 }}
                  className="bg-[#FAF9F2] rounded-[28px] sm:rounded-[32px] border border-black/10 overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
                    <div className="lg:col-span-7 h-[260px] sm:h-[360px] md:h-[480px] overflow-hidden relative group">
                      <Link to={`/blog/${featuredPost.slug}`} className="block w-full h-full">
                        <img
                          src={featuredPost.coverImage}
                          alt={featuredPost.coverAlt}
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-95"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                        <div className="absolute top-4 sm:top-6 left-4 sm:left-6">
                          <span className="text-[9px] sm:text-[10px] uppercase tracking-widest-editorial text-white bg-black/50 backdrop-blur-md px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full border border-white/20 font-medium">
                            {content.featuredBadge}
                          </span>
                        </div>
                      </Link>
                    </div>

                    <div className="lg:col-span-5 p-6 sm:p-10 md:p-12 lg:p-14 space-y-4 sm:space-y-6">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs uppercase tracking-widest-editorial text-[#8A7D4C] font-semibold">
                        <span>{featuredPost.category}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1 text-knowza-dark/60 font-sans font-normal">
                          <Calendar className="w-3 h-3" />
                          {featuredPost.date}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1 text-knowza-dark/60 font-sans font-normal">
                          <Clock className="w-3 h-3" />
                          {featuredPost.readTime}
                        </span>
                      </div>

                      <h2 className="text-xl sm:text-3xl lg:text-4xl font-serif text-knowza-dark font-normal leading-tight">
                        <Link
                          to={`/blog/${featuredPost.slug}`}
                          className="hover:text-knowza-forest transition-colors"
                        >
                          {featuredPost.title}
                        </Link>
                      </h2>

                      <p className="text-xs sm:text-sm font-sans text-knowza-dark/75 font-light leading-relaxed">
                        {featuredPost.excerpt}
                      </p>

                      <div className="pt-2">
                        <Link
                          to={`/blog/${featuredPost.slug}`}
                          className="w-full sm:w-auto text-center inline-flex items-center justify-center gap-2 text-xs uppercase tracking-widest-editorial font-medium px-7 sm:px-8 py-3 sm:py-3.5 rounded-full shadow-md group knowza-btn-liquid knowza-btn-liquid-olive-fill whitespace-nowrap"
                        >
                          <span>{content.featuredButton}</span>
                          <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Grid of Remaining Articles */}
              {regularPosts.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {regularPosts.map((post) => (
                    <motion.article
                      key={post.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-50px' }}
                      whileHover={{ y: -6 }}
                      transition={{ duration: 0.5 }}
                      className="bg-[#FAF9F2] rounded-[28px] border border-black/10 overflow-hidden flex flex-col justify-between group shadow-sm hover:shadow-xl transition-all duration-500 p-4"
                    >
                      <div>
                        <div className="h-56 rounded-[20px] overflow-hidden shadow-sm relative">
                          <Link to={`/blog/${post.slug}`}>
                            <img
                              src={post.coverImage}
                              alt={post.coverAlt}
                              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                              loading="lazy"
                            />
                          </Link>
                          <div className="absolute top-3 left-3">
                            <span className="text-[9px] uppercase tracking-widest text-white bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 font-medium">
                              {post.category}
                            </span>
                          </div>
                        </div>

                        <div className="p-4 sm:p-5 space-y-3">
                          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest-editorial text-[#8A7D4C] font-semibold">
                            <span>{post.date}</span>
                            <span>·</span>
                            <span className="flex items-center gap-1 font-sans text-knowza-dark/60 font-normal">
                              <Clock className="w-3 h-3" />
                              {post.readTime}
                            </span>
                          </div>

                          <h3 className="text-xl font-serif text-knowza-dark font-normal leading-snug group-hover:text-knowza-forest transition-colors">
                            <Link to={`/blog/${post.slug}`}>
                              {post.title}
                            </Link>
                          </h3>

                          <p className="text-xs sm:text-sm font-sans text-knowza-dark/70 font-light leading-relaxed line-clamp-3">
                            {post.excerpt}
                          </p>
                        </div>
                      </div>

                      <div className="px-4 sm:px-5 pb-3 pt-3 border-t border-black/5 flex items-center justify-between">
                        <span className="text-xs font-sans text-knowza-dark/50 font-light">
                          {content.cardBylinePrefix} {post.author}
                        </span>

                        <Link
                          to={`/blog/${post.slug}`}
                          className="inline-flex items-center gap-1 text-xs uppercase tracking-widest-editorial font-medium text-knowza-olive hover:text-knowza-deep transition-colors group-hover:translate-x-1 duration-300"
                        >
                          <span>{content.cardLinkLabel}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </motion.article>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </Container>
      </section>
    </>
  );
};

export const NewsletterSection: React.FC<{ content: any }> = ({ content }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      await saveSubscriber(newsletterEmail).catch(() => undefined);
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <section className="px-3 sm:px-6 md:px-10 py-12 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.85 }}
        className="relative rounded-[28px] sm:rounded-[40px] bg-gradient-to-br from-[#28351F] via-[#1E2717] to-[#141A10] text-[#F4F0D5] py-12 sm:py-20 px-5 sm:px-10 md:px-16 overflow-hidden shadow-2xl border border-white/10 max-w-6xl mx-auto"
      >
        {/* Ambient luminous glow */}
        <div
          className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#8A7D4C]/20 blur-[80px] pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-5 sm:space-y-6">
          <span className="text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.25em] text-knowza-bronze font-semibold block">
            {content.eyebrow}
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif text-white font-normal">
            {content.heading}
          </h2>
          <p className="text-xs sm:text-sm md:text-base font-sans text-[#F4F0D5]/80 font-light leading-relaxed max-w-xl mx-auto">
            {content.text}
          </p>

          {newsletterSubscribed ? (
            <div className="p-4 rounded-full bg-white/10 border border-white/20 text-xs sm:text-sm text-knowza-dew font-light inline-block">
              {content.success}
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto pt-2">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder={content.placeholder}
                required
                className="w-full px-5 py-3.5 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/50 text-xs sm:text-sm font-sans focus:outline-none focus:border-knowza-cream transition-colors"
              />
              <button
                type="submit"
                className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-xs uppercase tracking-wider font-medium knowza-btn-liquid knowza-btn-liquid-primary"
              >
                <span>{content.button}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </section>
  );
};
