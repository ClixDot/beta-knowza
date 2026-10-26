import React, { useRef, useState, useEffect } from 'react';
import { useScroll } from 'framer-motion';

interface TextSegment {
  text: string;
  className?: string;
}

interface TypewriterHeadingProps {
  segments: TextSegment[];
  className?: string;
}

export const TypewriterHeading: React.FC<TypewriterHeadingProps> = ({
  segments,
  className = '',
}) => {
  const containerRef = useRef<HTMLHeadingElement>(null);
  const [typedCount, setTypedCount] = useState(0);

  // Flatten segments into an array of characters
  const chars = React.useMemo(() => {
    const list: { char: string; className?: string; globalIndex: number }[] = [];
    let count = 0;
    segments.forEach((segment) => {
      for (let i = 0; i < segment.text.length; i++) {
        list.push({
          char: segment.text[i],
          className: segment.className,
          globalIndex: count++,
        });
      }
    });
    return list;
  }, [segments]);

  const totalChars = chars.length;

  // Drive typing directly from scroll position:
  // Starts when heading reaches 85% from top of viewport,
  // finishes when heading reaches 30% from top of viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.88', 'start 0.28'],
  });

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      setTypedCount(totalChars);
      return;
    }

    const updateFromScroll = (latest: number) => {
      const clamped = Math.max(0, Math.min(1, latest));
      const count = Math.round(clamped * totalChars);
      setTypedCount((prev) => (prev === count ? prev : count));
    };

    const unsubscribe = scrollYProgress.on('change', updateFromScroll);
    updateFromScroll(scrollYProgress.get());

    return () => unsubscribe();
  }, [scrollYProgress, totalChars]);

  const isComplete = typedCount >= totalChars;

  return (
    <h2 ref={containerRef} className={`relative ${className}`}>
      {chars.map(({ char, className: charClass, globalIndex }) => {
        const isTyped = globalIndex < typedCount;
        const isCurrent = globalIndex === typedCount - 1 && !isComplete;

        return (
          <span key={globalIndex} className={charClass || ''}>
            <span
              className={`transition-opacity duration-75 ${
                isTyped ? 'opacity-100' : 'opacity-0 select-none pointer-events-none'
              }`}
            >
              {char}
            </span>
            {isCurrent && (
              <span
                className="inline-block w-[2.5px] sm:w-[3px] h-[0.85em] bg-[#8A7D4C] align-baseline ml-[1px] animate-pulse"
                aria-hidden="true"
              />
            )}
          </span>
        );
      })}
      {/* Starting cursor before first character */}
      {typedCount === 0 && (
        <span
          className="inline-block w-[2.5px] sm:w-[3px] h-[0.85em] bg-[#8A7D4C] align-baseline ml-[1px] animate-pulse"
          aria-hidden="true"
        />
      )}
    </h2>
  );
};

export default TypewriterHeading;
