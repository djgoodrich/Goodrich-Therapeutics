'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function HomeAnimations() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const isMobile = window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches;

    // Split character helper (desktop only for performance and to avoid forced reflows)
    const splitChars = (el) => {
      if (!el || el.querySelector('.char')) return;
      const text = el.textContent;
      el.textContent = '';
      el.setAttribute('aria-label', text);
      Array.from(text).forEach((char) => {
        const span = document.createElement('span');
        span.className = 'char';
        span.innerHTML = char === ' ' ? '&nbsp;' : char;
        el.appendChild(span);
      });
    };

    const heroTitle1 = document.querySelector('.hero-title .title-line:nth-child(1)');
    const heroTitle2 = document.querySelector('.hero-title .title-line:nth-child(2)');
    const contactTitle = document.querySelector('.contact-title');

    if (!isMobile) {
      splitChars(heroTitle1);
      splitChars(heroTitle2);
      splitChars(contactTitle);
    }

    let heroAnimated = false;
    const animateHeroEntrance = () => {
      if (heroAnimated || isMobile) return;
      heroAnimated = true;
      const tl = gsap.timeline();
      tl.to('.hero-tag', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
        .to('.hero-title .char', { opacity: 1, y: '0%', rotateX: 0, stagger: 0.02, duration: 0.9, ease: 'power3.out' }, '-=0.6')
        .to('.hero-sub', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
        .to('.hero-actions', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
        .to('.scroll-indicator', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5');
    };

    let fallbackTimer = null;
    if (typeof window !== 'undefined' && !isMobile) {
      if (sessionStorage.getItem('preloaderShown')) {
        animateHeroEntrance();
      } else {
        const handlePreloaderComplete = () => animateHeroEntrance();
        window.addEventListener('preloaderComplete', handlePreloaderComplete, { once: true });
        fallbackTimer = setTimeout(() => animateHeroEntrance(), 400);
      }
    }

    let refreshTimer = null;
    let idleId = null;
    let fallbackAnimTimer = null;

    const revealHashTarget = () => {
      if (!window.location.hash) return;
      const hashEl = document.querySelector(window.location.hash);
      if (!hashEl) return;
      const animEls = hashEl.querySelectorAll("[data-animate='fade-up'], .char, .word-inner");
      gsap.set(animEls, { opacity: 1, y: 0, rotateX: 0 });
      hashEl.scrollIntoView({ behavior: 'smooth' });
    };

    const initScrollAnimations = () => {
      if (isMobile) {
        gsap.set("[data-animate='fade-up']", { opacity: 1, y: 0, clearProps: 'transform' });
        refreshTimer = setTimeout(revealHashTarget, 80);
        return;
      }

      // GSAP ScrollTrigger Animations
      document.querySelectorAll("[data-animate='fade-up']").forEach((el) => {
        const delay = parseFloat(el.getAttribute('data-delay') || '0');
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 95%',
              toggleActions: 'play none none none',
              onRefresh: (self) => {
                if (self.progress > 0) {
                  gsap.set(el, { opacity: 1, y: 0 });
                }
              },
            },
          }
        );
      });

      // Hero Parallax (desktop only)
      if (!isMobile) {
        gsap.to('.hero-content', {
          scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
          y: -100,
          opacity: 0.2,
        });

        document.querySelectorAll('.hero-orb[data-parallax]').forEach((orb) => {
          const speed = parseFloat(orb.getAttribute('data-parallax') || '0.2');
          gsap.to(orb, {
            scrollTrigger: {
              trigger: '.hero',
              start: 'top top',
              end: 'bottom top',
              scrub: true,
            },
            y: (i, target) => -200 * speed,
          });
        });
      }

      // Philosophy Word Reveal
      const philEl = document.querySelector('[data-reveal-words]');
      if (philEl && !philEl.querySelector('.word') && !isMobile) {
        const text = philEl.textContent.trim();
        philEl.textContent = '';
        philEl.setAttribute('aria-label', text);
        text.split(/\s+/).forEach((w) => {
          const wordSpan = document.createElement('span');
          wordSpan.className = 'word';
          const innerSpan = document.createElement('span');
          innerSpan.className = 'word-inner';
          innerSpan.textContent = w;
          wordSpan.appendChild(innerSpan);
          philEl.appendChild(wordSpan);
        });

        gsap.fromTo(
          '.philosophy-text .word-inner',
          { y: '110%' },
          {
            y: '0%',
            stagger: 0.02,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: '.philosophy-text',
              start: 'top 85%',
              end: 'bottom 50%',
              scrub: 1,
              onRefresh: (self) => {
                if (self.progress > 0) {
                  gsap.set('.philosophy-text .word-inner', { y: '0%' });
                }
              },
            },
          }
        );

        gsap.to('.philosophy-line', {
          scrollTrigger: {
            trigger: '.philosophy-text',
            start: 'top 70%',
            end: 'bottom 40%',
            scrub: 1,
          },
          width: '200px',
          ease: 'power3.out',
        });
      }

      // Contact title character reveal
      if (contactTitle && !isMobile) {
        gsap.fromTo(
          '.contact-title .char',
          { opacity: 0, y: '100%', rotateX: -80 },
          {
            opacity: 1,
            y: '0%',
            rotateX: 0,
            stagger: 0.03,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: '.contact-title',
              start: 'top 90%',
              onRefresh: (self) => {
                if (self.progress > 0) {
                  gsap.set('.contact-title .char', { opacity: 1, y: '0%', rotateX: 0 });
                }
              },
            },
          }
        );
      }

      // Number counters
      document.querySelectorAll('[data-count]').forEach((el) => {
        const targetVal = parseInt(el.getAttribute('data-count'), 10);
        gsap.to(
          { val: 0 },
          {
            val: targetVal,
            duration: 2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 90%',
              once: true,
            },
            onUpdate: function () {
              el.textContent = Math.round(this.targets()[0].val);
            },
          }
        );
      });

      // Refresh ScrollTrigger after DOM setup
      refreshTimer = setTimeout(() => {
        ScrollTrigger.refresh();
        revealHashTarget();
      }, 150);
    };

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(initScrollAnimations, { timeout: 1200 });
    } else {
      fallbackAnimTimer = setTimeout(initScrollAnimations, 60);
    }

    // Magnetic elements interaction (desktop only)
    if (!isMobile && window.matchMedia('(pointer: fine)').matches) {
      document.querySelectorAll('[data-magnetic]').forEach((el) => {
        const inner = el.querySelector('span') || el;
        let magRaf = null;
        let magX = 0;
        let magY = 0;

        const updateMag = () => {
          if (!inner) return;
          inner.style.transition = 'none';
          inner.style.transform = `translate(${magX}px, ${magY}px)`;
          magRaf = null;
        };

        const handleMove = (e) => {
          const rect = el.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          magX = (e.clientX - centerX) * 0.3;
          magY = (e.clientY - centerY) * 0.3;
          if (!magRaf) {
            magRaf = requestAnimationFrame(updateMag);
          }
        };

        const handleLeave = () => {
          if (magRaf) {
            cancelAnimationFrame(magRaf);
            magRaf = null;
          }
          inner.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
          inner.style.transform = 'translate(0px, 0px)';
        };

        el.addEventListener('mousemove', handleMove, { passive: true });
        el.addEventListener('mouseleave', handleLeave, { passive: true });
      });
    }

    return () => {
      if (fallbackTimer) clearTimeout(fallbackTimer);
      if (refreshTimer) clearTimeout(refreshTimer);
      if (fallbackAnimTimer) clearTimeout(fallbackAnimTimer);
      if (idleId && typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleId);
      }
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return null;
}
