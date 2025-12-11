import React, { createContext, useContext, useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';

const LenisContext = createContext(null);

export function LenisProvider({ children, options = {} }) {
  const lenisRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    // respect reduced motion
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    lenisRef.current = new Lenis({
      duration: 1.2,
      smooth: true,
      smoothTouch: true,
      wheelMultiplier: 1,
      ...options,
    });

    function raf(time) {
      lenisRef.current.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    }

    rafRef.current = requestAnimationFrame(raf);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
    };
  }, [options]);

  return <LenisContext.Provider value={lenisRef}>{children}</LenisContext.Provider>;
}

export function useLenisRef() {
  const ref = useContext(LenisContext);
  if (!ref) throw new Error('useLenisRef must be used inside LenisProvider');
  return ref;
}
