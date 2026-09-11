'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Preloader() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isMobile = window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches;
    const alreadyShown = sessionStorage.getItem('preloaderShown');

    // On mobile or if already shown in this session, skip delay entirely
    if (isMobile || alreadyShown) {
      setLoaded(true);
      window.dispatchEvent(new CustomEvent('preloaderComplete'));
      return;
    }

    // Snappy desktop intro delay
    const timer1 = setTimeout(() => {
      setLoaded(true);
      sessionStorage.setItem('preloaderShown', 'true');
      const timer2 = setTimeout(() => {
        window.dispatchEvent(new CustomEvent('preloaderComplete'));
      }, 300);
      return () => clearTimeout(timer2);
    }, 350);

    return () => clearTimeout(timer1);
  }, []);

  return (
    <div id="preloader" className={loaded ? 'loaded' : ''} aria-hidden="true">
      <div className="preloader-inner">
        <Image
          src="/logo.png"
          alt=""
          width={120}
          height={191}
          priority
          className="preloader-logo"
        />
        <span className="preloader-text">Goodrich</span>
        <span className="preloader-sub">Therapeutics</span>
      </div>
    </div>
  );
}
