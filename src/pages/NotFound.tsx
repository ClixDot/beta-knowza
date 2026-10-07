import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';
import { Container } from '../components/Container';
import { SectionLabel } from '../components/SectionLabel';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF9F5] text-knowza-dark py-32 relative overflow-hidden">
      {/* Background aesthetic glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#8A7D4C]/10 blur-[120px] pointer-events-none" 
        aria-hidden="true" 
      />

      <Container>
        <div className="max-w-xl mx-auto text-center space-y-6 sm:space-y-8 relative z-10 bg-white p-6 sm:p-14 rounded-[28px] sm:rounded-[32px] border border-black/5 shadow-xl">
          <span className="text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.25em] text-[#8A7D4C] font-semibold block">
            SANCTUARY THRESHOLD · 404
          </span>

          <h1 className="text-6xl sm:text-8xl font-serif text-knowza-dark font-light tracking-tight">
            404
          </h1>

          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-serif text-knowza-dark font-normal">
              Some paths are meant to be discovered slowly.
            </h2>
            <p className="text-sm font-sans text-knowza-dark/70 font-light max-w-md mx-auto leading-relaxed">
              The page or sanctuary trail you are seeking may have shifted with the seasons, but the
              wider journey continues.
            </p>
          </div>

          <div className="pt-4 flex justify-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest-editorial font-medium px-8 py-3.5 rounded-full shadow-md group knowza-btn-liquid knowza-btn-liquid-dark"
            >
              <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
              <span>Return to Sanctuary</span>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};
