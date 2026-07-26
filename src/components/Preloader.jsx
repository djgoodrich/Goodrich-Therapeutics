'use client';

import { useEffect, useState } from 'react';

export default function Preloader() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // If preloader was already shown in this session, skip delay
    if (typeof window !== 'undefined' && sessionStorage.getItem('preloaderShown')) {
      setLoaded(true);
      window.dispatchEvent(new CustomEvent('preloaderComplete'));
      return;
    }

    const timer1 = setTimeout(() => {
      setLoaded(true);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('preloaderShown', 'true');
      }
      const timer2 = setTimeout(() => {
        window.dispatchEvent(new CustomEvent('preloaderComplete'));
      }, 500);
      return () => clearTimeout(timer2);
    }, 1400);

    return () => clearTimeout(timer1);
  }, []);

  return (
    <div id="preloader" className={loaded ? 'loaded' : ''} aria-hidden="true">
      <div className="preloader-inner">
        <img src="/logo.png" alt="" className="preloader-logo" />
        <span className="preloader-text">Goodrich</span>
        <span className="preloader-sub">Therapeutics</span>
      </div>
    </div>
  );
}
