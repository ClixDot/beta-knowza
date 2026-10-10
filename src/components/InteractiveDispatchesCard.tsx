import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ArrowRight, ChevronLeft, ChevronRight, Clock, BookOpen } from 'lucide-react';
import { BlogPost } from '../types';

interface InteractiveDispatchesCardProps {
  posts: BlogPost[];
}

export const InteractiveDispatchesCard: React.FC<InteractiveDispatchesCardProps> = ({ posts }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const currentPost = posts[activeIndex] || posts[0];

  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  });

  // Scroll parallax transforms
  const cardY = useTransform(scrollYProgress, [0, 0.45, 0.8, 1], [60, 0, 0, -35]);
  const cardScale = useTransform(scrollYProgress, [0, 0.4, 0.75, 1], [0.94, 1, 1, 0.98]);
  const imageParallaxY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);

  // Interactive 3D tilt tracking mouse
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  // Smooth springs for 3D tilt
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [4, -4]), { stiffness: 260, damping: 24 });
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-4, 4]), { stiffness: 260, damping: 24 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveIndex((prev) => (prev === 0 ? posts.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveIndex((prev) => (prev === posts.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative">
      {/* Interactive Tabs for Quick Article Browsing */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {posts.map((post, idx) => (
            <button
              key={post.id}
              onClick={() => setActiveIndex(idx)}
              className={`px-4 py-2 rounded-full text-xs font-sans uppercase tracking-widest-editorial font-medium transition-all duration-300 flex items-center gap-2 ${
                idx === activeIndex
                  ? 'bg-knowza-deep text-knowza-cream shadow-md scale-[1.02]'
                  : 'bg-black/[0.04] text-knowza-dark/70 hover:bg-black/[0.08] hover:text-knowza-dark'
              }`}
            >
              <span className="text-[10px] opacity-60">0{idx + 1}</span>
              <span>{post.category}</span>
            </button>
          ))}
        </div>

        {/* Carousel Prev/Next Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            aria-label="Previous story"
            className="w-9 h-9 rounded-full border border-black/15 bg-white/70 hover:bg-knowza-deep hover:text-white hover:border-knowza-deep flex items-center justify-center transition-all duration-300 text-knowza-dark shadow-sm active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next story"
            className="w-9 h-9 rounded-full border border-black/15 bg-white/70 hover:bg-knowza-deep hover:text-white hover:border-knowza-deep flex items-center justify-center transition-all duration-300 text-knowza-dark shadow-sm active:scale-95"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Interactive Animated 3D Floating Card */}
      <motion.div
        ref={cardRef}
        style={{
          y: cardY,
          scale: cardScale,
          rotateX,
          rotateY,
          transformPerspective: 1200,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative z-10 bg-[#F7F5E0] p-5 sm:p-8 md:p-12 rounded-[24px] sm:rounded-[32px] border border-black/10 shadow-[0_12px_45px_-12px_rgba(0,0,0,0.12)] hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.18)] transition-shadow duration-500 will-change-transform overflow-hidden group"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-14 items-center">
          {/* Left Column: Image with Windowed Parallax & Floating Badge */}
          <div className="lg:col-span-6 relative">
            <Link
              to={`/blog/${currentPost.slug}`}
              className="block h-[220px] xs:h-[260px] sm:h-[340px] md:h-[420px] rounded-[20px] sm:rounded-[24px] overflow-hidden relative group/img cursor-pointer"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPost.id}
                  initial={{ opacity: 0, scale: 1.08 }}
                  animate={{ opacity: 1, scale: 1.0 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.65, ease: [0.25, 1, 0.5, 1] }}
                  style={{ y: imageParallaxY }}
                  className="w-full h-[120%] -top-[10%] relative will-change-transform"
                >
                  <img
                    src={currentPost.coverImage}
                    alt={currentPost.title}
                    className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Interactive Floating Hover Chip on Image */}
              <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-10">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/50 backdrop-blur-md text-white text-[11px] font-sans font-medium tracking-wider uppercase border border-white/20 transition-transform duration-300 group-hover/img:scale-105 group-hover/img:bg-knowza-deep">
                  <BookOpen className="w-3.5 h-3.5 text-knowza-dew" />
                  <span>{currentPost.readTime}</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Right Column: Editorial Details with Staggered Transition */}
          <div className="lg:col-span-6 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPost.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="space-y-6"
              >
                {/* Meta Line */}
                <div className="flex items-center gap-3 text-xs uppercase tracking-widest-editorial text-knowza-bronze font-medium">
                  <span className="bg-knowza-dew/60 text-knowza-deep px-3 py-1 rounded-full text-[11px] font-semibold">
                    {currentPost.category}
                  </span>
                  <span>·</span>
                  <span className="text-knowza-dark/60 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {currentPost.date}
                  </span>
                </div>

                {/* Post Title */}
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif text-knowza-dark font-normal leading-snug">
                  <Link
                    to={`/blog/${currentPost.slug}`}
                    className="hover:text-knowza-forest transition-colors duration-300"
                  >
                    {currentPost.title}
                  </Link>
                </h3>

                {/* Excerpt */}
                <p className="text-sm sm:text-base font-sans text-knowza-dark/75 font-light leading-relaxed">
                  {currentPost.excerpt}
                </p>

                {/* Interactive Action Buttons */}
                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <Link
                    to={`/blog/${currentPost.slug}`}
                    className="inline-flex items-center gap-2 text-xs uppercase tracking-widest-editorial font-medium px-8 py-3.5 rounded-full shadow-md group/btn knowza-btn-liquid knowza-btn-liquid-olive-fill"
                  >
                    <span>Read Article</span>
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                  </Link>

                  <div className="text-xs font-sans text-knowza-dark/50 flex items-center gap-2">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-knowza-forest animate-pulse" />
                    <span>Story {activeIndex + 1} of {posts.length}</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
