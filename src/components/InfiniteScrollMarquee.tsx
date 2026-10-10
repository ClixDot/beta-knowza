import React from 'react';
import { Link } from 'react-router-dom';

export interface GalleryPreviewCard {
  image: string;
  title: string;
  category: string;
  tiltClass?: string;
}

interface InfiniteScrollMarqueeProps {
  cards: GalleryPreviewCard[];
}

export const InfiniteScrollMarquee: React.FC<InfiniteScrollMarqueeProps> = ({
  cards,
}) => {
  // Pre-configured subtle alternating rotations matching luxury editorial design
  const alternatingTilts = [
    '-rotate-3',
    'rotate-2',
    '-rotate-2',
    'rotate-3',
    '-rotate-2',
    'rotate-2',
  ];

  const renderCard = (card: GalleryPreviewCard, idx: number, prefix: string) => {
    const rotation = alternatingTilts[idx % alternatingTilts.length];

    return (
      <Link
        key={`${prefix}-${idx}`}
        to="/gallery"
        className={`group relative flex-shrink-0 w-[240px] sm:w-[280px] md:w-[320px] lg:w-[340px] aspect-[4/5] rounded-[24px] sm:rounded-[28px] overflow-hidden shadow-[0_20px_45px_-12px_rgba(0,0,0,0.55)] transition-all duration-500 ease-out cursor-pointer z-10 hover:z-30 border border-black/20 bg-[#122A1B] transform ${rotation} hover:!rotate-0 hover:scale-[1.045] hover:shadow-[0_30px_60px_-12px_rgba(0,0,0,0.75)]`}
      >
        <img
          src={card.image}
          alt={card.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
          loading="lazy"
        />
        {/* Subtle Gradient & Hover Label */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />
        <div className="absolute bottom-5 left-5 right-5 text-white transform transition-transform duration-300">
          <span className="text-[10px] uppercase tracking-widest-editorial text-[#EEE9BF] block mb-1 font-semibold">
            {card.category}
          </span>
          <h4 className="text-base sm:text-lg font-serif font-normal drop-shadow-sm text-[#FAF9F2]">
            {card.title}
          </h4>
        </div>
      </Link>
    );
  };

  return (
    <div className="knowza-marquee-container relative pt-2 pb-8 overflow-hidden w-full select-none">
      <style>{`
        @keyframes knowzaMarqueeLeft {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .knowza-marquee-track {
          display: flex !important;
          width: max-content !important;
          will-change: transform;
          animation: knowzaMarqueeLeft 40s linear infinite;
        }
        .knowza-marquee-container:hover .knowza-marquee-track {
          animation-play-state: paused !important;
        }
        @media (prefers-reduced-motion: reduce) {
          .knowza-marquee-track {
            animation: none !important;
          }
        }
      `}</style>

      {/* Seamless Dual Track (Track A + Track B) for 100% gapless continuous infinite loop */}
      <div className="knowza-marquee-track pb-10 pt-4 px-4 flex">
        {/* Track A */}
        <div className="flex shrink-0 items-center gap-6 sm:gap-7 md:gap-8 pr-6 sm:pr-7 md:pr-8">
          {cards.map((card, idx) => renderCard(card, idx, 'track-a'))}
        </div>
        {/* Track B (Duplicate for seamless reset) */}
        <div className="flex shrink-0 items-center gap-6 sm:gap-7 md:gap-8 pr-6 sm:pr-7 md:pr-8" aria-hidden="true">
          {cards.map((card, idx) => renderCard(card, idx, 'track-b'))}
        </div>
      </div>
    </div>
  );
};
