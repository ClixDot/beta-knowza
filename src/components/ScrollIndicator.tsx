import React from 'react';

interface ScrollIndicatorProps {
  targetId?: string;
}

export const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({ targetId = 'statement' }) => {
  const handleClick = () => {
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' });
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex flex-col items-center gap-3 text-[10px] uppercase tracking-widest-editorial text-knowza-dew/70 hover:text-knowza-dew transition-colors duration-300 focus:outline-none group cursor-pointer"
      aria-label="Scroll down to explore"
    >
      <span className="font-sans font-medium tracking-[0.25em]">SCROLL TO EXPLORE</span>
      <div className="w-[1.5px] h-10 bg-knowza-dew/25 relative overflow-hidden rounded-full">
        <div className="w-full h-1/2 bg-knowza-bronze rounded-full animate-pulse transition-transform duration-1000 transform group-hover:translate-y-full" />
      </div>
    </button>
  );
};
