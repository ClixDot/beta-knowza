import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, MapPin } from 'lucide-react';
import { Container } from '../components/Container';
import { SectionLabel } from '../components/SectionLabel';
import { InnerPageHero } from '../components/InnerPageHero';
import { GalleryLightbox } from '../components/GalleryLightbox';
import { CTASection } from '../components/CTASection';
import { galleryItems } from '../data/gallery';
import { GalleryCategory, GalleryItem } from '../types';

const CATEGORIES: GalleryCategory[] = ['ALL', 'NATURE', 'CULTURE', 'PLACES', 'PEOPLE', 'EXPERIENCES'];

export const Gallery: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>('ALL');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const filteredItems = useMemo(() => {
    if (activeCategory === 'ALL') return galleryItems;
    return galleryItems.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  const handleOpenLightbox = (item: GalleryItem) => {
    setSelectedItem(item);
    setIsLightboxOpen(true);
  };

  const handleCloseLightbox = () => {
    setIsLightboxOpen(false);
  };

  return (
    <div className="relative overflow-hidden bg-[#F7F5E0] text-knowza-dark">
      {/* ========================================================
          01 ARCHITECTURAL GALLERY HERO
          ======================================================== */}
      <InnerPageHero
        watermarkTop="GALLERY"
        titleLine1="MOMENTS, PLACES &"
        titleHighlight="QUIET ENCOUNTERS"
      />

      {/* ========================================================
          02 PILL CATEGORY FILTER TABS
          ======================================================== */}
      <section className="sticky top-[68px] md:top-[80px] z-30 bg-[#F7F5E0]/90 backdrop-blur-md border-b border-black/5 py-3 sm:py-4">
        <Container>
          <div className="flex items-center justify-start md:justify-center overflow-x-auto no-scrollbar gap-2 sm:gap-2.5 py-1 -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              const count = cat === 'ALL' ? galleryItems.length : galleryItems.filter((i) => i.category === cat).length;

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={(e) => {
                    setActiveCategory(cat);
                    e.currentTarget.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                  }}
                  className={`relative h-9 sm:h-9.5 px-4 sm:px-5 rounded-full text-xs uppercase tracking-widest-editorial font-medium transition-all duration-300 whitespace-nowrap focus:outline-none inline-flex items-center justify-center gap-2 shrink-0 select-none shadow-sm ${
                    isActive
                      ? 'bg-knowza-deep text-white ring-1 ring-knowza-deep shadow-md'
                      : 'bg-[#F7F5E0] text-knowza-dark/75 hover:text-knowza-dark hover:bg-black/[0.04] border border-black/10'
                  }`}
                  aria-pressed={isActive}
                >
                  <span className="relative z-10 leading-none">{cat}</span>
                  <span
                    className={`relative z-10 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-sans font-semibold tracking-normal leading-none rounded-full transition-colors ${
                      isActive ? 'bg-white/20 text-white' : 'bg-black/5 text-knowza-dark/60'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ========================================================
          03 ARCHITECTURAL GALLERY GRID
          ======================================================== */}
      <section className="py-12 sm:py-16 md:py-28">
        <Container>
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, idx) => {
                // Editorial asymmetric distribution (some cards span 7 cols, others 5 or 4)
                const isSpan7 = idx % 5 === 0;
                const isSpan5 = idx % 5 === 1;
                const colSpanClass = isSpan7
                  ? 'lg:col-span-7 h-[340px] sm:h-[420px] md:h-[480px]'
                  : isSpan5
                  ? 'lg:col-span-5 h-[340px] sm:h-[420px] md:h-[480px]'
                  : 'lg:col-span-4 h-[320px] sm:h-[380px] md:h-[440px]';

                return (
                  <motion.div
                    key={item.id}
                    layout
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
                      alt={item.title}
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
                        <div className="flex items-center gap-1.5 text-xs text-[#F7F5E0]/80 font-sans">
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
              })}
            </AnimatePresence>
          </motion.div>
        </Container>
      </section>



      {/* Lightbox Dialog */}
      <GalleryLightbox
        item={selectedItem}
        items={filteredItems}
        isOpen={isLightboxOpen}
        onClose={handleCloseLightbox}
        onNavigate={(newItem) => setSelectedItem(newItem)}
      />

      {/* Closing CTA Section */}
      <CTASection />
    </div>
  );
};
