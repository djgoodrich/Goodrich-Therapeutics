'use client';

import { useEffect } from 'react';
import { Analytics } from '@vercel/analytics/next';
import { track } from '@vercel/analytics';

// Page views via Vercel Web Analytics, plus one event per click on a booking / gift / membership link,
// labelled with where on the page it was clicked — so you can see which buttons actually get used.
export default function SiteAnalytics() {
  useEffect(() => {
    const onClick = (e) => {
      const a = e.target.closest?.('a[href*="massagebook.com"]');
      if (!a) return;
      const href = a.getAttribute('href');
      const kind = href.includes('gift-certificates') ? 'gift' : href.includes('/deals') ? 'membership' : href.includes('/reviews') ? 'reviews' : 'book';
      const place = a.closest('#book-bar, .classic-book-bar') ? 'mobile-bar'
        : a.closest('header, #navbar, .mobile-menu') ? 'nav'
        : a.closest('section[id]')?.id || 'page';
      const service = (href.match(/service_id=(\d+)/) || [])[1] || 'any';
      try { track(`${kind}_click`, { place, service, page: location.pathname }); } catch { /* analytics must never break a booking click */ }
    };
    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, []);

  return <Analytics />;
}
