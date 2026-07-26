'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import WebGLBackground from '@/components/WebGLBackground';
import ServiceCard from '@/components/ServiceCard';
import Footer from '@/components/Footer';

export default function Home() {
  const contactCanvasRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Split character helper
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

    // Split hero title lines & contact title
    const heroTitle1 = document.querySelector('.hero-title .title-line:nth-child(1)');
    const heroTitle2 = document.querySelector('.hero-title .title-line:nth-child(2)');
    const contactTitle = document.querySelector('.contact-title');

    splitChars(heroTitle1);
    splitChars(heroTitle2);
    splitChars(contactTitle);

    let heroAnimated = false;
    // Hero entrance animation
    const animateHeroEntrance = () => {
      if (heroAnimated) return;
      heroAnimated = true;
      const tl = gsap.timeline();
      tl.to('.hero-tag', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
        .to('.hero-title .char', { opacity: 1, y: '0%', rotateX: 0, stagger: 0.02, duration: 0.9, ease: 'power3.out' }, '-=0.6')
        .to('.hero-sub', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
        .to('.hero-actions', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
        .to('.scroll-indicator', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5');
    };

    if (typeof window !== 'undefined' && sessionStorage.getItem('preloaderShown')) {
      animateHeroEntrance();
    } else {
      const handlePreloaderComplete = () => animateHeroEntrance();
      window.addEventListener('preloaderComplete', handlePreloaderComplete);
      var fallbackTimer = setTimeout(() => animateHeroEntrance(), 1800);
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
          duration: 0.9,
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

    // Hero Parallax
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

    // Hero Orbs Parallax
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

    // Philosophy Word Reveal
    const philEl = document.querySelector('[data-reveal-words]');
    if (philEl && !philEl.querySelector('.word')) {
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
    if (contactTitle) {
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
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
      // Reveal any sections if URL contains a hash
      if (window.location.hash) {
        const hashEl = document.querySelector(window.location.hash);
        if (hashEl) {
          const animEls = hashEl.querySelectorAll("[data-animate='fade-up'], .char, .word-inner");
          gsap.set(animEls, { opacity: 1, y: 0, rotateX: 0 });
          hashEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }, 200);

    // Magnetic elements interaction
    if (window.matchMedia('(pointer: fine)').matches) {
      document.querySelectorAll('[data-magnetic]').forEach((el) => {
        const inner = el.querySelector('span') || el;
        const handleMove = (e) => {
          const rect = el.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          inner.style.transition = 'none';
          inner.style.transform = `translate(${(e.clientX - centerX) * 0.3}px, ${(e.clientY - centerY) * 0.3}px)`;
        };
        const handleLeave = () => {
          inner.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
          inner.style.transform = 'translate(0px, 0px)';
        };
        el.addEventListener('mousemove', handleMove);
        el.addEventListener('mouseleave', handleLeave);
      });
    }

    return () => {
      if (fallbackTimer) clearTimeout(fallbackTimer);
      clearTimeout(refreshTimer);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  // Contact section canvas gradient mesh
  useEffect(() => {
    const canvas = contactCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let w, h, time = 0, isVisible = false, rafId = null;

    function resize() {
      w = canvas.parentElement.offsetWidth || window.innerWidth;
      h = canvas.parentElement.offsetHeight || window.innerHeight * 0.8;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    const colors = ['rgba(122,158,126,0.3)', 'rgba(200,169,110,0.2)', 'rgba(122,158,126,0.15)'];

    function draw() {
      if (!isVisible) {
        rafId = null;
        return;
      }
      ctx.clearRect(0, 0, w, h);
      time += 0.003;

      for (let i = 0; i < 3; i++) {
        const x = (Math.sin(time + i * 2) * 0.3 + 0.5) * w;
        const y = (Math.cos(time * 0.8 + i * 1.5) * 0.3 + 0.5) * h;
        const radius = Math.min(w, h) * 0.5;

        const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
        grad.addColorStop(0, colors[i]);
        grad.addColorStop(1, 'transparent');

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }
      rafId = requestAnimationFrame(draw);
    }

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          isVisible = e.isIntersecting;
          if (isVisible && !rafId) draw();
        });
      },
      { threshold: 0 }
    );
    obs.observe(canvas.parentElement || canvas);
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      obs.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <main>
      <WebGLBackground />

      {/* ─── HERO ─── */}
      <section id="hero" className="hero">
        <div className="hero-bg-wrapper">
          <img src="/hero.jpg" alt="" className="hero-bg-image" />
        </div>
        <div className="hero-orb hero-orb--1" data-parallax="0.1" aria-hidden="true" />
        <div className="hero-orb hero-orb--2" data-parallax="0.25" aria-hidden="true" />
        <div className="hero-orb hero-orb--3" data-parallax="0.15" aria-hidden="true" />

        <div className="hero-content">
          <span className="hero-tag">Massage Therapy &amp; Structural Integration</span>
          <h1 className="hero-title">
            <span className="title-line">Goodrich</span>
            <span className="title-line title-line--alt">Therapeutics</span>
          </h1>
          <p className="hero-sub">
            Precision bodywork to realign your posture, release chronic pain, and restore your body to effortless balance in Cornelius, NC.
          </p>
          <div className="hero-actions">
            <a
              href="https://www.massagebook.com/therapists/GoodrichMassage"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--primary btn--lg"
              data-magnetic
            >
              <span>Book a Session</span>
            </a>
            <a href="#services" className="btn btn--ghost btn--lg" data-magnetic>
              <span>Explore Services</span>
            </a>
          </div>
        </div>

        <div className="scroll-indicator" aria-hidden="true">
          <span>Scroll</span>
          <div className="scroll-line" />
        </div>
      </section>

      {/* ─── PHILOSOPHY ─── */}
      <section id="philosophy" className="section philosophy">
        <div className="container">
          <span className="section-tag" data-animate="fade-up">
            Our Philosophy
          </span>
          <h2 className="philosophy-text" data-reveal-words>
            We believe the body holds an innate wisdom &mdash; a deep intelligence that knows how to heal, realign, and restore itself. Our work is to listen, understand, and guide it back to balance.
          </h2>
          <div className="philosophy-line" />
        </div>
      </section>

      {/* ─── SERVICES ─── */}
      <section id="services" className="section services">
        <div className="container">
          <span className="section-tag" data-animate="fade-up">
            What We Do
          </span>
          <h2 className="section-title" data-animate="fade-up">
            Services
          </h2>
          <div className="services-grid">
            <ServiceCard
              pattern="contour"
              title="Deep Tissue<br>Massage"
              desc="Specialized technique targeting deeper layers of muscle and connective tissue to relieve chronic tension and deep-seated pain patterns."
              link="/services#deep-tissue"
              delay={0}
            />
            <ServiceCard
              pattern="geometry"
              title="Structural<br>Integration"
              desc="A holistic approach that realigns and balances the body's structure within its gravitational field, improving posture and alleviating chronic pain."
              link="/services#structural-integration"
              delay={0.15}
            />
            <ServiceCard
              pattern="flow"
              title="Swedish<br>Massage"
              desc="A gentle, relaxing massage using long, flowing strokes to ease muscle tension, improve circulation, and promote deep relaxation."
              link="/services#swedish-massage"
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* ─── ABOUT ─── */}
      <section id="about" className="section about">
        <div className="container about-grid">
          <div className="about-visual" data-animate="fade-up">
            <div className="about-image-wrap">
              <img
                src="/about.jpg"
                alt="Therapeutic bodywork — balance and restoration"
                className="about-image"
                loading="lazy"
                decoding="async"
              />
              <div className="about-image-overlay" />
            </div>
            <div className="about-visual-frame" />
          </div>
          <div className="about-content" data-animate="fade-up">
            <span className="section-tag">About David Goodrich</span>

            {/* BIO HEADSHOT + NAME HEADER */}
            <div className="about-bio-header">
              <div className="about-headshot-wrap">
                <img
                  src="/david-headshot-561x403.jpg"
                  alt="David Goodrich, LMT"
                  className="about-headshot"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <h2 className="about-name">
                David Goodrich, <em>LMT</em>
              </h2>
            </div>

            <p className="about-bio">
              With over 20 years of hands-on experience, David Goodrich specializes in Structural Integration and deep-tissue bodywork. His approach combines clinical precision with an intuitive understanding of the body's fascial network.
            </p>
            <p className="about-bio">
              Based in Cornelius, NC, David has helped hundreds of clients recover from chronic pain, overcome posture restrictions, and rediscover freedom of movement.
            </p>
            <div className="about-stats">
              <div className="stat">
                <span className="stat-number" data-count="20">
                  20
                </span>
                <span className="stat-plus">+</span>
                <p className="stat-label">Years Experience</p>
              </div>
              <div className="stat-divider" />
              <div className="stat">
                <span className="stat-number" data-count="1000">
                  1000
                </span>
                <span className="stat-plus">+</span>
                <p className="stat-label">Clients Helped</p>
              </div>
              <div className="stat-divider" />
              <div className="stat">
                <span className="stat-number">NC #7796</span>
                <p className="stat-label">Licensed LMT</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── MARQUEE ─── */}
      <section className="marquee" aria-hidden="true">
        <div className="marquee-track">
          <div className="marquee-item">
            <span>Structural Integration</span>
            <span className="marquee-dot">&bull;</span>
            <span>Deep Tissue Massage</span>
            <span className="marquee-dot">&bull;</span>
            <span>Swedish Massage</span>
            <span className="marquee-dot">&bull;</span>
            <span>Posture Realignment</span>
            <span className="marquee-dot">&bull;</span>
            <span>Pain Relief</span>
            <span className="marquee-dot">&bull;</span>
          </div>
          <div className="marquee-item">
            <span>Structural Integration</span>
            <span className="marquee-dot">&bull;</span>
            <span>Deep Tissue Massage</span>
            <span className="marquee-dot">&bull;</span>
            <span>Swedish Massage</span>
            <span className="marquee-dot">&bull;</span>
            <span>Posture Realignment</span>
            <span className="marquee-dot">&bull;</span>
            <span>Pain Relief</span>
            <span className="marquee-dot">&bull;</span>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section id="testimonials" className="section testimonials">
        <div className="container">
          <span className="section-tag" data-animate="fade-up">
            Client Stories
          </span>
          <h2 className="section-title" data-animate="fade-up">
            Words of Restoration
          </h2>
          <div className="testimonials-grid">
            <div className="testimonial-card" data-animate="fade-up">
              <span className="testimonial-quote">&ldquo;</span>
              <p>
                David&rsquo;s work transformed how I feel every single day. After years of chronic back pain, his Structural Integration sessions gave me back freedom of movement I thought was gone forever.
              </p>
              <footer>
                <cite className="testimonial-author">Sarah M.</cite>
                <span className="testimonial-service">Structural Integration</span>
              </footer>
            </div>
            <div className="testimonial-card" data-animate="fade-up" data-delay="0.15">
              <span className="testimonial-quote">&ldquo;</span>
              <p>
                The deep tissue massage here is unmatched in Lake Norman. David knows exactly how to work through deep muscle knots without overwhelming your body. Highly recommended!
              </p>
              <footer>
                <cite className="testimonial-author">Mark T.</cite>
                <span className="testimonial-service">Deep Tissue Massage</span>
              </footer>
            </div>
            <div className="testimonial-card" data-animate="fade-up" data-delay="0.3">
              <span className="testimonial-quote">&ldquo;</span>
              <p>
                Professional, knowledgeable, and incredibly effective. I leave every appointment feeling completely rejuvenated and realignment-conscious.
              </p>
              <footer>
                <cite className="testimonial-author">Elena R.</cite>
                <span className="testimonial-service">Swedish Massage</span>
              </footer>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CONTACT ─── */}
      <section id="contact" className="section contact">
        <canvas ref={contactCanvasRef} id="contact-gradient" aria-hidden="true" />
        <div className="container contact-inner">
          <span className="section-tag" data-animate="fade-up">
            Get In Touch
          </span>
          <h2 className="contact-title">Begin Your Healing Journey</h2>
          <p className="contact-sub">
            Ready to experience deep relief and structural balance? Book your appointment online or reach out directly with any questions.
          </p>
          <div className="contact-actions" data-animate="fade-up">
            <a
              href="https://www.massagebook.com/therapists/GoodrichMassage"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--primary btn--lg"
              data-magnetic
            >
              <span>Book a Session</span>
            </a>
            <a
              href="https://www.massagebook.com/therapists/GoodrichMassage/gift-certificates?src=external-certificates"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--outline btn--lg"
              data-magnetic
            >
              <span>Buy Gift Certificate</span>
            </a>
            <a href="tel:+17049311074" className="btn btn--ghost btn--lg" data-magnetic>
              <span>Call (704) 931-1074</span>
            </a>
          </div>
          <div className="contact-details" data-animate="fade-up">
            <div className="contact-item">
              <h4>Location</h4>
              <p>
                20905 Torrence Chapel Rd, Suite 204
                <br />
                Cornelius, NC 28031
              </p>
            </div>
            <div className="contact-item">
              <h4>Phone</h4>
              <p>
                <a href="tel:+17049311074">(704) 931-1074</a>
              </p>
            </div>
            <div className="contact-item">
              <h4>Email</h4>
              <p>
                <a href="mailto:GoodrichTherapeutics@gmail.com">GoodrichTherapeutics@gmail.com</a>
              </p>
            </div>
          </div>
          <div className="contact-map-container" data-animate="fade-up">
            <div className="contact-map-header">
              <div className="map-header-info">
                <h3>Our Location</h3>
                <p>20905 Torrence Chapel Rd, Suite 204 &bull; Cornelius, NC 28031</p>
              </div>
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=20905+Torrence+Chapel+Rd+Suite+204+Cornelius+NC+28031"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--ghost btn--sm map-directions-btn"
                data-magnetic
              >
                <span>Get Directions &rarr;</span>
              </a>
            </div>
            <div className="contact-map-frame">
              <iframe
                title="Goodrich Therapeutics Location Map"
                src="https://maps.google.com/maps?q=20905+Torrence+Chapel+Rd+Suite+204+Cornelius+NC+28031&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="340"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
