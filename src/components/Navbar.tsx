import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { navLinks } from '../data/navigation';
import { siteConfig } from '../data/site';
import { Container } from './Container';

interface NavbarProps {
  onOpenExplore?: () => void;
  isInitialLoading?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenExplore, isInitialLoading = false }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const headerRef = React.useRef<HTMLElement>(null);
  const [centerYOffset, setCenterYOffset] = useState<number>(() => {
    return typeof window !== 'undefined' ? window.innerHeight / 2 - 56 : 350;
  });

  useEffect(() => {
    const calculateCenter = () => {
      if (headerRef.current) {
        const rect = headerRef.current.getBoundingClientRect();
        const headerCenter = rect.top + rect.height / 2;
        const windowCenter = window.innerHeight / 2;
        setCenterYOffset(windowCenter - headerCenter);
      } else {
        setCenterYOffset(window.innerHeight / 2 - 56);
      }
    };

    calculateCenter();
    window.addEventListener('resize', calculateCenter);
    return () => window.removeEventListener('resize', calculateCenter);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on page transition
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const isHome = location.pathname === '/';
  const useLightNavbar = isHome && !isScrolled;

  const leftNavLinks = navLinks.slice(0, 3); // HOME, ABOUT, GALLERY
  const rightNavLinks = navLinks.slice(3);   // BLOG, CONTACT

  const handleExploreClick = (e: React.MouseEvent) => {
    if (onOpenExplore) {
      e.preventDefault();
      onOpenExplore();
      return;
    }

    if (location.pathname === '/') {
      e.preventDefault();
      const target = document.getElementById('brand-statement') || document.querySelector('section:nth-of-type(2)');
      if (target) {
        const lenis = (window as any).lenis;
        if (lenis) {
          lenis.scrollTo(target, { offset: -70 });
        } else {
          target.scrollIntoView({ behavior: 'smooth' });
        }
        return;
      }
    }

    if (location.pathname === '/gallery') {
      e.preventDefault();
      window.scrollTo({ top: 320, behavior: 'smooth' });
      return;
    }
  };

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-50 border-none transition-all duration-500 ${
          isInitialLoading
            ? 'bg-transparent py-6 lg:py-8 border-transparent shadow-none'
            : isScrolled
            ? 'bg-[#F6F4DE]/90 backdrop-blur-md py-4 shadow-sm border-b border-black/5'
            : isHome
            ? 'bg-gradient-to-b from-knowza-deep/80 via-knowza-deep/30 to-transparent py-6 lg:py-8'
            : 'bg-transparent py-6 lg:py-8'
        }`}
      >
        <Container>
          <div className="relative flex items-center justify-between min-h-[40px] md:min-h-[48px]">
            {/* Desktop Left Navigation Links */}
            <motion.nav
              initial={{ opacity: 0, y: -6 }}
              animate={isInitialLoading ? { opacity: 0, y: -6 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className={`hidden md:flex items-center space-x-6 lg:space-x-8 transition-opacity duration-300 ${
                isInitialLoading ? 'opacity-0 pointer-events-none invisible' : 'opacity-100 visible'
              }`}
              aria-label="Left Navigation"
            >
              {leftNavLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `text-xs uppercase tracking-widest-editorial transition-all duration-300 relative py-1 ${
                      useLightNavbar
                        ? isActive
                          ? 'text-white font-semibold'
                          : 'text-knowza-dew/75 hover:text-white font-medium'
                        : isActive
                        ? 'text-knowza-dark font-semibold'
                        : 'text-knowza-dark/65 hover:text-knowza-dark font-medium'
                    }`
                  }
                >
                  <span>{link.name}</span>
                </NavLink>
              ))}
            </motion.nav>

            {/* Mobile Left Spacer to keep layout centered */}
            <div className="w-10 md:hidden" aria-hidden="true" />

            {/* Center Logo: Perfectly centered vertically and horizontally on the navbar axis */}
            <motion.div
              initial={false}
              animate={
                isInitialLoading
                  ? { x: '-50%', y: `calc(${centerYOffset}px - 50%)`, scale: 1.7, opacity: 1 }
                  : { x: '-50%', y: '-50%', scale: 1, opacity: 1 }
              }
              transition={{
                duration: 1.15,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={`absolute left-1/2 top-1/2 pointer-events-auto z-20 flex items-center justify-center ${
                isMobileMenuOpen ? 'hidden md:flex' : 'flex'
              }`}
            >
              <Link
                to="/"
                className="flex items-center justify-center transition-opacity duration-300 hover:opacity-85 focus:outline-none"
                aria-label="KNOWZA Home"
              >
                <img
                  src={
                    useLightNavbar
                      ? '/images/logo/knowza-logo-horizontal-light.png'
                      : '/images/logo/knowza-logo-horizontal-dark.png'
                  }
                  alt="KNOWZA — Experiential Hospitality"
                  className="h-7 sm:h-8 md:h-8.5 w-auto object-contain block transition-opacity duration-300"
                />
              </Link>
            </motion.div>

            {/* Desktop Right Navigation Links & CTA */}
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={isInitialLoading ? { opacity: 0, y: -6 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className={`hidden md:flex items-center space-x-6 lg:space-x-8 transition-opacity duration-300 ${
                isInitialLoading ? 'opacity-0 pointer-events-none invisible' : 'opacity-100 visible'
              }`}
            >
              <nav className="flex items-center space-x-6 lg:space-x-8" aria-label="Right Navigation">
                {rightNavLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) =>
                      `text-xs uppercase tracking-widest-editorial transition-all duration-300 relative py-1 ${
                        useLightNavbar
                          ? isActive
                            ? 'text-white font-semibold'
                            : 'text-knowza-dew/75 hover:text-white font-medium'
                          : isActive
                          ? 'text-knowza-dark font-semibold'
                          : 'text-knowza-dark/65 hover:text-knowza-dark font-medium'
                      }`
                    }
                  >
                    <span>{link.name}</span>
                  </NavLink>
                ))}
              </nav>

              <Link
                to="/gallery"
                onClick={handleExploreClick}
                className={`inline-flex items-center gap-1.5 lg:gap-2 text-xs uppercase tracking-widest-editorial font-medium px-4 lg:px-6 py-2 lg:py-2.5 rounded-full transition-all duration-300 group knowza-btn-liquid shrink-0 ${
                  useLightNavbar
                    ? 'knowza-btn-liquid-white-fill shadow-md'
                    : 'knowza-btn-liquid-olive shadow-sm'
                }`}
              >
                <span>EXPLORE</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={isInitialLoading ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 transition-colors focus:outline-none z-10 ${
                isInitialLoading ? 'opacity-0 pointer-events-none invisible' : 'opacity-100 visible'
              } ${
                isMobileMenuOpen ? 'hidden' : 'block'
              } ${
                useLightNavbar
                  ? 'text-knowza-dew hover:text-white'
                  : 'text-knowza-dark hover:text-knowza-olive'
              }`}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open navigation menu"}
              aria-expanded={isMobileMenuOpen}
            >
              <Menu className="w-6 h-6 stroke-[1.5]" />
            </motion.button>
          </div>
        </Container>
      </header>

      {/* Mobile Drawer Menu */}
      <div
        data-lenis-prevent
        className={`fixed inset-0 z-[60] bg-[#F6F4DE] backdrop-blur-xl text-knowza-dark flex flex-col justify-between p-6 sm:p-8 overflow-y-auto md:hidden transition-all duration-500 ease-in-out ${
          isMobileMenuOpen
            ? 'opacity-100 pointer-events-auto translate-y-0'
            : 'opacity-0 pointer-events-none -translate-y-4'
        }`}
        style={{ top: 0, height: '100dvh' }}
      >
        <div className="flex justify-between items-center pt-2 pb-6 border-b border-[#8A7D4C]/30 shrink-0">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} aria-label="KNOWZA Home">
            <img
              src="/images/logo/knowza-logo-horizontal-dark.png"
              alt="KNOWZA"
              className="h-7 sm:h-8 w-auto object-contain block"
            />
          </Link>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 text-knowza-dark hover:text-black hover:bg-black/5 rounded-full transition-colors focus:outline-none"
            aria-label="Close menu"
          >
            <X className="w-6 h-6 stroke-[2]" />
          </button>
        </div>

        <nav className="flex flex-col space-y-6 my-auto py-8">
          {navLinks.map((link, idx) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `text-2xl font-serif tracking-wide transition-all duration-300 flex items-center justify-between pl-3.5 border-l-2 ${
                  isActive
                    ? 'text-black border-knowza-deep font-bold'
                    : 'text-knowza-dark/85 hover:text-black border-transparent font-semibold'
                }`
              }
              style={{
                transitionDelay: `${idx * 50}ms`
              }}
            >
              <span className="text-black font-semibold">{link.name}</span>
              <span className="text-xs font-sans tracking-widest-editorial text-knowza-deep font-bold">
                0{idx + 1}
              </span>
            </NavLink>
          ))}
        </nav>

        <div className="pt-6 border-t border-[#8A7D4C]/30 flex flex-col gap-4">
          <Link
            to="/gallery"
            onClick={(e) => {
              setIsMobileMenuOpen(false);
              handleExploreClick(e);
            }}
            className="w-full py-3.5 sm:py-4 text-center text-xs uppercase tracking-widest-editorial font-medium rounded-full flex items-center justify-center gap-2 group knowza-btn-liquid knowza-btn-liquid-olive-fill shadow-md"
          >
            <span>Explore Knowza</span>
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
          <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] uppercase tracking-widest text-knowza-dark/75 font-semibold pt-2">
            <span>{siteConfig.tagline}</span>
            <span>{siteConfig.territory}</span>
          </div>
        </div>
      </div>
    </>
  );
};
