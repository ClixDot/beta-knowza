import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
  wrap,
} from 'framer-motion';

export interface GalleryPreviewCard {
  image: string;
  title: string;
  category: string;
  tiltClass: string;
}

interface InfiniteScrollMarqueeProps {
  cards: GalleryPreviewCard[];
  baseSpeed?: number;
  scrollSensitivity?: number;
}

export const InfiniteScrollMarquee: React.FC<InfiniteScrollMarqueeProps> = ({
  cards,
  baseSpeed = -0.04,
  scrollSensitivity = 0.05,
}) => {
  // Duplicate cards array to create a mathematically seamless infinite loop
  const duplicatedCards = [...cards, ...cards];

  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);

  // Smooth out the scroll velocity with gentle spring physics
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 65,
    stiffness: 280,
  });

  // Transform velocity into a soft, restrained acceleration factor
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 2], {
    clamp: false,
  });

  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);

  // Animation frame loop: runs non-stop on every tick
  useAnimationFrame((_t, delta) => {
    // Steady continuous non-stop sliding movement (calm pace)
    let moveBy = baseSpeed * (delta / 16.666);

    // Gentle scroll direction influence (reduced speed):
    // Scrolling DOWN -> gently slides left
    // Scrolling UP   -> gently slides right
    const currentVelocity = velocityFactor.get() || 0;
    moveBy -= currentVelocity * scrollSensitivity * (delta / 16.666);

    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="relative pt-2 pb-8 overflow-hidden w-full select-none">
      <motion.div
        style={{ x }}
        className="flex items-center gap-6 sm:gap-7 md:gap-8 w-max pb-10 pt-4 px-4 will-change-transform"
      >
        {duplicatedCards.map((card, idx) => (
          <Link
            key={idx}
            to="/gallery"
            className={`group relative flex-shrink-0 w-[240px] sm:w-[280px] md:w-[320px] lg:w-[340px] aspect-[4/5] rounded-[24px] sm:rounded-[28px] overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.65)] transition-all duration-500 ease-out cursor-pointer z-10 hover:z-20 border border-black/20 bg-[#122A1B] transform ${card.tiltClass} hover:scale-105`}
          >
            <img
              src={card.image}
              alt={card.title}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
              loading="lazy"
            />
            {/* Subtle Gradient & Hover Label */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-65 group-hover:opacity-85 transition-opacity" />
            <div className="absolute bottom-5 left-5 right-5 text-white transform transition-transform duration-300">
              <span className="text-[10px] uppercase tracking-widest-editorial text-[#9FBCA4] block mb-1 font-semibold">
                {card.category}
              </span>
              <h4 className="text-base sm:text-lg font-serif font-normal drop-shadow-sm">
                {card.title}
              </h4>
            </div>
          </Link>
        ))}
      </motion.div>
    </div>
  );
};
