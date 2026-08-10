'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';

export default function MobileMenu() {
  const [active, setActive] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleToggle = (e) => {
      const isAct = e.detail?.active;
      setActive(isAct);
      document.body.style.overflow = isAct ? 'hidden' : '';
    };

    window.addEventListener('toggleMobileMenu', handleToggle);
    return () => window.removeEventListener('toggleMobileMenu', handleToggle);
  }, []);

  const closeMenu = () => {
    setActive(false);
    document.body.style.overflow = '';
    window.dispatchEvent(new CustomEvent('toggleMobileMenu', { detail: { active: false } }));
  };

  const handleNavClick = (e, targetId) => {
    closeMenu();
    if (pathname === '/') {
      e.preventDefault();
      const el = document.getElementById(targetId);
      if (el) {
        const animEls = el.querySelectorAll("[data-animate='fade-up'], .char, .word-inner");
        if (animEls.length > 0) {
          gsap.to(animEls, { opacity: 1, y: 0, rotateX: 0, duration: 0.5, overwrite: 'auto' });
        }
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div id="mobile-menu" className={`mobile-menu ${active ? 'is-active' : ''}`} aria-hidden={!active}>
      <nav>
        <Link href="/" className="mobile-link" onClick={(e) => handleNavClick(e, 'hero')}>
          Home
        </Link>
        <Link href="/services" className="mobile-link" onClick={closeMenu}>
          Services
        </Link>
        <Link href="/#memberships" className="mobile-link" onClick={(e) => handleNavClick(e, 'memberships')}>
          Memberships
        </Link>
        <Link href="/#about" className="mobile-link" onClick={(e) => handleNavClick(e, 'about')}>
          About
        </Link>
        <Link href="/#contact" className="mobile-link" onClick={(e) => handleNavClick(e, 'contact')}>
          Contact
        </Link>
        <a
          href="https://www.massagebook.com/therapists/GoodrichMassage/gift-certificates?src=external-certificates"
          target="_blank"
          rel="noopener noreferrer"
          className="mobile-link"
          onClick={closeMenu}
        >
          Gift Certificates
        </a>
        <a
          href="https://www.massagebook.com/therapists/GoodrichMassage"
          target="_blank"
          rel="noopener noreferrer"
          className="mobile-cta"
          onClick={closeMenu}
        >
          Book Now
        </a>
      </nav>
    </div>
  );
}
