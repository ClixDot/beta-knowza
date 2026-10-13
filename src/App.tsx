import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { PageTransition } from './components/PageTransition';
import { LoadingScreen } from './components/LoadingScreen';

// Pages
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Gallery } from './pages/Gallery';
import { Blog } from './pages/Blog';
import { BlogDetail } from './pages/BlogDetail';
import { Contact } from './pages/Contact';
import { NotFound } from './pages/NotFound';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Scroll to top helper - only resets to top when navigating to a DIFFERENT page
const ScrollToTop: React.FC = () => {
  const location = useLocation();
  const prevPathRef = useRef<string>(location.pathname);

  useEffect(() => {
    const isNewPage = prevPathRef.current !== location.pathname;
    prevPathRef.current = location.pathname;

    const lenis = (window as any).lenis;
    const hash = location.hash;

    if (hash) {
      const target = document.querySelector(hash);
      if (target) {
        if (lenis) {
          lenis.scrollTo(target as HTMLElement, { immediate: true });
        } else {
          target.scrollIntoView({ behavior: 'auto' });
        }
        ScrollTrigger.refresh();
        return;
      }
    }

    // Only scroll to 0,0 if navigating to a brand new page
    if (isNewPage) {
      if (lenis) {
        lenis.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo(0, 0);
      }
    }

    ScrollTrigger.refresh();
  }, [location.pathname, location.hash]);

  return null;
};

export const App: React.FC = () => {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // 1.1s initial centered logo display before animating up into the header
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 1100);
    return () => clearTimeout(timer);
  }, []);

  // Initialize Lenis smooth scroll engine & sync with GSAP ScrollTrigger
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.05,
      touchMultiplier: 1.8,
    });

    (window as any).lenis = lenis;

    // Connect Lenis to ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      delete (window as any).lenis;
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#EDEABF] text-knowza-dark font-sans selection:bg-knowza-olive selection:text-white">
      <LoadingScreen isInitialLoading={isInitialLoading} />
      <ScrollToTop />
      <Navbar isInitialLoading={isInitialLoading} />

      <main className="flex-grow">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PageTransition>
                <Home />
              </PageTransition>
            }
          />
          <Route
            path="/about"
            element={
              <PageTransition>
                <About />
              </PageTransition>
            }
          />
          <Route
            path="/gallery"
            element={
              <PageTransition>
                <Gallery />
              </PageTransition>
            }
          />
          <Route
            path="/blog"
            element={
              <PageTransition>
                <Blog />
              </PageTransition>
            }
          />
          <Route
            path="/blog/:slug"
            element={
              <PageTransition>
                <BlogDetail />
              </PageTransition>
            }
          />
          <Route
            path="/hospitality"
            element={<Navigate to="/about?tab=hospitality#curated-pathways" replace />}
          />
          <Route
            path="/healing"
            element={<Navigate to="/about?tab=healing#curated-pathways" replace />}
          />
          <Route
            path="/contact"
            element={
              <PageTransition>
                <Contact />
              </PageTransition>
            }
          />
          <Route
            path="*"
            element={
              <PageTransition>
                <NotFound />
              </PageTransition>
            }
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default App;
