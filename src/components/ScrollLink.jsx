import React from 'react';
import { useLenisRef } from '../lib/useLenisRef';

export default function ScrollLink({ to, offset = 0, children, className = '', ...props }) {
  const lenisRef = useLenisRef();

  const handleClick = (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    const id = to.startsWith('#') ? to : `#${to}`;
    const el = document.querySelector(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY + offset;
    const lenis = lenisRef.current;
    if (lenis && typeof lenis.scrollTo === 'function') lenis.scrollTo(top);
    else window.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <a href={to} onClick={handleClick} className={className} {...props}>
      {children}
    </a>
  );
}
