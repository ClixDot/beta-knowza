import React, { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import type { GalleryItemDoc } from '../cms/types';

interface GalleryLightboxProps {
  item: GalleryItemDoc | null;
  items: GalleryItemDoc[];
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (newItem: GalleryItemDoc) => void;
}

export const GalleryLightbox: React.FC<GalleryLightboxProps> = ({
  item,
  items,
  isOpen,
  onClose,
  onNavigate,
}) => {
  if (!isOpen || !item) return null;

  const currentIndex = items.findIndex((i) => i.id === item.id);

  const handlePrev = useCallback(() => {
    const prevIndex = (currentIndex - 1 + items.length) % items.length;
    onNavigate(items[prevIndex]);
  }, [currentIndex, items, onNavigate]);

  const handleNext = useCallback(() => {
    const nextIndex = (currentIndex + 1) % items.length;
    onNavigate(items[nextIndex]);
  }, [currentIndex, items, onNavigate]);

  // Keyboard navigation & body lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handlePrev, handleNext, onClose]);

  // Touch swipe handling for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 50) {
      handleNext();
    } else if (touchEndX - touchStartX > 50) {
      handlePrev();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      className="fixed inset-0 z-50 flex items-center justify-center bg-knowza-deep/95 backdrop-blur-md p-4 md:p-8"
      onClick={onClose}
    >
      {/* Container to prevent backdrop clicks when clicking inside content */}
      <div
        className="relative max-w-6xl w-full max-h-[90vh] flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Top Controls Bar */}
        <div className="w-full flex items-center justify-between pb-4 text-knowza-dew/70 border-b border-knowza-olive/20">
          <div className="flex items-center gap-3">
            <span className="text-[11px] uppercase tracking-widest-editorial font-medium text-knowza-bronze">
              {item.category}
            </span>
            <span className="text-knowza-olive/40">·</span>
            <span className="text-xs font-sans text-knowza-dew/60">
              {currentIndex + 1} of {items.length}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-knowza-dew/70 hover:text-knowza-dew hover:bg-knowza-olive/20 rounded-full transition-all focus:outline-none"
            aria-label="Close image lightbox"
          >
            <X className="w-6 h-6 stroke-[1.5]" />
          </button>
        </div>

        {/* Main Image Area with Navigation Buttons */}
        <div className="relative w-full flex items-center justify-center my-3 sm:my-4 overflow-hidden group">
          {/* Previous Button */}
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-1 sm:left-4 z-10 p-2 sm:p-3 rounded-full bg-knowza-deep/70 hover:bg-knowza-deep text-knowza-dew/80 hover:text-knowza-dew border border-knowza-olive/20 backdrop-blur-sm transition-all focus:outline-none"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.5]" />
          </button>

          {/* Image */}
          <img
            src={item.image}
            alt={item.alt}
            className="max-h-[55vh] sm:max-h-[65vh] w-auto max-w-full object-contain rounded-subtle shadow-2xl transition-all duration-300 select-none"
          />

          {/* Next Button */}
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-1 sm:right-4 z-10 p-2 sm:p-3 rounded-full bg-knowza-deep/70 hover:bg-knowza-deep text-knowza-dew/80 hover:text-knowza-dew border border-knowza-olive/20 backdrop-blur-sm transition-all focus:outline-none"
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.5]" />
          </button>
        </div>

        {/* Caption & Location Footer */}
        <div className="w-full text-center max-w-2xl px-2 sm:px-4 pt-1 sm:pt-2">
          <h3 className="text-base sm:text-xl font-serif text-knowza-dew font-normal tracking-wide">
            {item.title}
          </h3>
          <p className="text-xs sm:text-sm font-sans text-knowza-dew/75 mt-1 font-light leading-relaxed line-clamp-3 sm:line-clamp-none">
            {item.description}
          </p>
          {item.caption && <p className="text-xs font-sans italic text-knowza-dew/60 mt-1">{item.caption}</p>}
          {item.location && (
            <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-knowza-bronze mt-2">
              <MapPin className="w-3 h-3" />
              <span>{item.location}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
