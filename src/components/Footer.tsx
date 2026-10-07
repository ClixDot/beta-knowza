import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { navLinks } from '../data/navigation';
import { siteConfig } from '../data/site';
import { Container } from './Container';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-knowza-deep text-knowza-dew pt-20 pb-12 border-t border-knowza-olive/20 relative overflow-hidden">
      {/* Subtle organic watermark in background */}
      <div 
        className="absolute -right-24 -bottom-24 w-96 h-96 rounded-full border border-knowza-olive/10 pointer-events-none"
        aria-hidden="true" 
      />
      
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 pb-16 border-b border-knowza-dew/10"
        >
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-6">
            <Link to="/" className="inline-block" aria-label="KNOWZA Home">
              <img
                src="/images/logo/knowza-logo-light.png"
                alt="KNOWZA"
                className="h-16 md:h-20 w-auto object-contain"
              />
            </Link>
            <p className="text-sm font-sans text-knowza-dew/70 max-w-sm leading-relaxed font-light">
              {siteConfig.description}
            </p>
            <div className="pt-2">
              <span className="inline-block text-[11px] uppercase tracking-widest-editorial text-knowza-bronze font-medium">
                {siteConfig.tagline}
              </span>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs uppercase tracking-widest-editorial text-knowza-dew font-medium">
              Navigation
            </h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-xs uppercase tracking-widest-editorial text-knowza-dew/70 hover:text-knowza-dew transition-colors duration-200 inline-block py-0.5"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Editorial / Connect Column */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs uppercase tracking-widest-editorial text-knowza-dew font-medium">
              Sanctuaries & Connections
            </h4>
            <p className="text-xs font-sans text-knowza-dew/70 leading-relaxed font-light">
              {siteConfig.contact.locationContext}
            </p>
            <div className="pt-2 space-y-2">
              <div>
                <a
                  href={`mailto:${siteConfig.contact.generalEnquiries}`}
                  className="text-xs font-sans text-knowza-dew/90 hover:text-knowza-cream transition-colors duration-200 block"
                >
                  {siteConfig.contact.generalEnquiries}
                </a>
              </div>
              <div>
                <a
                  href={siteConfig.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest-editorial text-knowza-bronze hover:text-knowza-dew transition-colors duration-200 group"
                >
                  <span>Instagram {siteConfig.socials.instagramHandle}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="pt-8 flex flex-col md:flex-row items-center justify-between text-[11px] tracking-widest-editorial uppercase text-knowza-dew/50 gap-4"
        >
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-3 gap-y-1 text-center md:text-left">
            <span>© {currentYear} {siteConfig.brandName}. All rights reserved.</span>
            <span className="text-knowza-olive/60 hidden sm:inline">·</span>
            <a
              href="https://clixdot.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-knowza-dew/70 hover:text-white transition-colors duration-200 group"
              aria-label="Powered by Clix Dot"
            >
              <span>Powered by</span>
              <span className="text-knowza-cream font-medium tracking-wider group-hover:underline decoration-knowza-bronze/60 underline-offset-4">
                Clix Dot
              </span>
            </a>
          </div>
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-3 gap-y-1 text-[10px] text-center">
            <span>{siteConfig.territory}</span>
            <span className="text-knowza-olive">·</span>
            <span>Experiential Hospitality</span>
          </div>
        </motion.div>
      </Container>
    </footer>
  );
};
