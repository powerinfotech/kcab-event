'use client';

import React, { useEffect, useState } from 'react';

interface PublicBackToTopButtonProps {
  showAfter?: number;
}

export default function PublicBackToTopButton({ showAfter = 720 }: PublicBackToTopButtonProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const handleScroll = () => {
      setVisible(window.scrollY > showAfter);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showAfter]);

  const handleClick = () => {
    if (typeof window === 'undefined') return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      type="button"
      className={`saf-public-scroll-top ${visible ? 'is-visible' : ''}`}
      onClick={handleClick}
      aria-label="Back to top"
    >
      TOP
    </button>
  );
}
