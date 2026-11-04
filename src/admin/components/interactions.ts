import { useEffect, useRef, type RefObject } from 'react';
import Lenis from 'lenis';

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Lenis on the admin's scrolling column, tuned like the public site. Phones keep native scrolling. */
export function useSmoothScroll(wrapperRef: RefObject<HTMLElement | null>) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const content = wrapper?.firstElementChild as HTMLElement | null;
    if (!wrapper || !content || prefersReducedMotion()) return;
    const lenis = new Lenis({
      wrapper,
      content,
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.05,
      // Textareas and other inner scrollers keep scrolling themselves.
      allowNestedScroll: true,
      autoRaf: true,
    });
    lenisRef.current = lenis;
    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [wrapperRef]);

  return lenisRef;
}

/** A short press and ring on every clicked control. Runs at document level so portals are covered too. */
export function attachPressFeedback() {
  const onClick = (event: MouseEvent) => {
    if (prefersReducedMotion()) return;
    const control = (event.target as Element).closest?.('.admin-root button, .admin-root a') as HTMLElement | null;
    // Drag handles and the focal point picker are aimed at, not pressed.
    if (!control || control.matches('.cursor-grab, .cursor-crosshair')) return;
    control.animate(
      [
        { outline: '2px solid rgba(95, 108, 54, 0.45)', outlineOffset: '0px' },
        { outline: '2px solid rgba(95, 108, 54, 0)', outlineOffset: '7px' },
      ],
      { duration: 450, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
    );
    // Large cards only get the ring, because scaling them would shift a lot of content.
    if (control.offsetHeight <= 96) {
      control.animate([{ transform: 'scale(0.95)' }, { transform: 'scale(1.02)', offset: 0.55 }, { transform: 'scale(1)' }], {
        duration: 320,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      });
    }
  };
  document.addEventListener('click', onClick, true);
  return () => document.removeEventListener('click', onClick, true);
}
