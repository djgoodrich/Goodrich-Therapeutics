'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuActive, setMenuActive] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    const nextState = !menuActive;
    setMenuActive(nextState);
    window.dispatchEvent(new CustomEvent('toggleMobileMenu', { detail: { active: nextState } }));
  };

  const handleNavClick = (e, targetId) => {
    if (pathname === '/') {
      e.preventDefault();
      const el = document.getElementById(targetId);
      if (el) {
        // Reveal elements inside target section immediately to prevent any blank states
        const animEls = el.querySelectorAll("[data-animate='fade-up'], .char, .word-inner");
        if (animEls.length > 0) {
          gsap.to(animEls, { opacity: 1, y: 0, rotateX: 0, duration: 0.5, overwrite: 'auto' });
        }
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header id="navbar" className={scrolled ? 'scrolled' : ''} role="banner">
      <Link href="/" className="nav-logo" data-magnetic onClick={(e) => handleNavClick(e, 'hero')}>
        <img src="/logo.png" alt="Goodrich Therapeutics" className="nav-logo-img" />
        Goodrich<span className="logo-dot">.</span>
      </Link>
      <nav aria-label="Main navigation">
        <Link
          href="/#philosophy"
          className="nav-link"
          data-magnetic
          onClick={(e) => handleNavClick(e, 'philosophy')}
        >
          Philosophy
        </Link>
        <Link href="/services" className="nav-link" data-magnetic>
          Services
        </Link>
        <Link href="/#about" className="nav-link" data-magnetic onClick={(e) => handleNavClick(e, 'about')}>
          About
        </Link>
        <Link
          href="/#testimonials"
          className="nav-link"
          data-magnetic
          onClick={(e) => handleNavClick(e, 'testimonials')}
        >
          Stories
        </Link>
        <Link
          href="/#contact"
          className="nav-link"
          data-magnetic
          onClick={(e) => handleNavClick(e, 'contact')}
        >
          Contact
        </Link>
        <a
          href="https://www.massagebook.com/therapists/GoodrichMassage/gift-certificates?src=external-certificates"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-link"
          data-magnetic
        >
          Gift Certificates
        </a>
      </nav>
      <a
        href="https://www.massagebook.com/therapists/GoodrichMassage"
        target="_blank"
        rel="noopener noreferrer"
        className="nav-cta"
        data-magnetic
      >
        <span>Book Now</span>
      </a>
      <button
        className={`nav-toggle ${menuActive ? 'is-active' : ''}`}
        aria-label="Toggle navigation menu"
        aria-expanded={menuActive}
        onClick={toggleMenu}
      >
        <span />
        <span />
        <span />
      </button>
    </header>
  );
}
