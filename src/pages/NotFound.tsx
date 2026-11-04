import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Container } from '../components/Container';
import { CmsLink } from '../components/cms/CmsLink';
import { SeoHead } from '../components/cms/SeoHead';
import { useGlobal } from '../cms/hooks/useSiteContent';

export const NotFound: React.FC = () => {
  const copy = useGlobal().system.notFound;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F6F4DE] text-knowza-dark py-32 relative overflow-hidden">
      <SeoHead />
      {/* Background aesthetic glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#8A7D4C]/10 blur-[120px] pointer-events-none"
        aria-hidden="true"
      />

      <Container>
        <div className="max-w-xl mx-auto text-center space-y-6 sm:space-y-8 relative z-10 bg-[#FAF9F2] p-6 sm:p-14 rounded-[28px] sm:rounded-[32px] border border-black/10 shadow-xl">
          <span className="text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.25em] text-[#8A7D4C] font-semibold block">
            {copy.eyebrow}
          </span>

          <h1 className="text-6xl sm:text-8xl font-serif text-knowza-dark font-light tracking-tight">
            {copy.code}
          </h1>

          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-serif text-knowza-dark font-normal">
              {copy.heading}
            </h2>
            <p className="text-sm font-sans text-knowza-dark/70 font-light max-w-md mx-auto leading-relaxed">
              {copy.text}
            </p>
          </div>

          <div className="pt-4 flex justify-center">
            <CmsLink
              url={copy.buttonUrl}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest-editorial font-medium px-8 py-3.5 rounded-full shadow-md group knowza-btn-liquid knowza-btn-liquid-dark"
            >
              <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
              <span>{copy.buttonLabel}</span>
            </CmsLink>
          </div>
        </div>
      </Container>
    </div>
  );
};
