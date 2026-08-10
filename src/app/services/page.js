'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Footer from '@/components/Footer';

export default function ServicesPage() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

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

    // Initialize detail canvases
    document.querySelectorAll('.service-detail-canvas').forEach((canvas) => {
      const ctx = canvas.getContext('2d');
      const pattern = canvas.getAttribute('data-pattern');
      let w, h, time = 0, isVisible = false, rafId = null;

      function resize() {
        w = canvas.clientWidth || canvas.parentElement.clientWidth;
        h = canvas.clientHeight || 200;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      resize();
      window.addEventListener('resize', resize);

      let points = [];
      if (pattern === 'geometry') {
        for (let i = 0; i < 30; i++) {
          points.push({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
          });
        }
      }

      function draw() {
        if (!isVisible) {
          rafId = null;
          return;
        }
        ctx.clearRect(0, 0, w, h);
        time += 0.01;

        if (pattern === 'contour') {
          ctx.strokeStyle = 'rgba(122,158,126,0.15)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          for (let i = 0; i < 20; i++) {
            const yOff = (i / 20) * h;
            for (let x = 0; x < w; x += 5) {
              const y = yOff + Math.sin(x * 0.015 + time + i) * 20 + Math.sin(x * 0.008 - time * 0.5) * 15;
              x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
            }
          }
          ctx.stroke();
        } else if (pattern === 'geometry') {
          ctx.strokeStyle = 'rgba(122,158,126,0.08)';
          ctx.fillStyle = 'rgba(122,158,126,0.25)';
          ctx.lineWidth = 1;
          points.forEach((p) => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > w) p.vx *= -1;
            if (p.y < 0 || p.y > h) p.vy *= -1;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
            ctx.fill();
          });
          ctx.beginPath();
          for (let i = 0; i < points.length; i++) {
            for (let j = i + 1; j < points.length; j++) {
              const dx = points[i].x - points[j].x;
              const dy = points[i].y - points[j].y;
              if (Math.sqrt(dx * dx + dy * dy) < 120) {
                ctx.moveTo(points[i].x, points[i].y);
                ctx.lineTo(points[j].x, points[j].y);
              }
            }
          }
          ctx.stroke();
        } else if (pattern === 'flow') {
          ctx.strokeStyle = 'rgba(122,158,126,0.1)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          for (let i = 0; i < 15; i++) {
            for (let x = 0; x < w; x += 10) {
              const y = h / 2 + Math.sin(x * 0.01 + time + i * 0.5) * (50 + i * 5) + Math.cos(x * 0.02 - time) * 20;
              x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
            }
          }
          ctx.stroke();
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
      obs.observe(canvas.closest('.benefits-card-wrap') || canvas);
      draw();
    });

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
      if (window.location.hash) {
        const hashEl = document.querySelector(window.location.hash);
        if (hashEl) {
          const animEls = hashEl.querySelectorAll("[data-animate='fade-up']");
          gsap.set(animEls, { opacity: 1, y: 0 });
          hashEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }, 200);

    return () => {
      clearTimeout(refreshTimer);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <main>
      {/* ─── HERO ─── */}
      <section className="services-hero">
        <span className="services-hero-tag" data-animate="fade-up">
          What We Offer
        </span>
        <h1 data-animate="fade-up">Our Services</h1>
        <p data-animate="fade-up">
          Expert bodywork tailored to your unique needs &mdash; because every body is different, and true healing is never one-size-fits-all.
        </p>
      </section>

      {/* ─── STRUCTURAL INTEGRATION ─── */}
      <section className="service-detail" id="structural-integration">
        <div className="container">
          <div className="service-detail-inner">
            <div className="service-detail-content" data-animate="fade-up">
              <span className="service-detail-tag">01</span>
              <h2 className="service-detail-name">
                Structural
                <br />
                Integration
              </h2>
              <p className="service-detail-tagline">Realign. Rebalance. Restore.</p>
              <div className="service-detail-body">
                <p>
                  Structural Integration is a holistic bodywork approach that aims to realign and balance the body's structure within its gravitational field. This method, developed by Dr. Ida Rolf, focuses on manipulating the body's myofascial system &mdash; the network of connective tissues that surrounds muscles, bones, and organs.
                </p>
                <p>
                  By working with this fascial network, Structural Integration seeks to improve posture, enhance flexibility, and alleviate chronic pain patterns, ultimately leading to better overall physical function and well-being.
                </p>
                <p>
                  During your appointment, you will lie on a massage table in different positions, depending on the specific work being done. The practitioner will use firm, precise pressure to manipulate the fascia, focusing on different areas of your body in each session. While the pressure can be intense at times, you may feel a variety of sensations, from warmth and tingling to a feeling of release.
                </p>
                <p>
                  As your body adapts to these changes, you might notice improvements in your posture, movement, and overall sense of ease in your body. It's common to feel taller, more balanced, and more aware of your body after a session.
                </p>
              </div>
              <div className="service-detail-cta">
                <a
                  href="https://www.massagebook.com/therapists/GoodrichMassage"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--primary"
                >
                  <span>Book a Structural Integration Session</span>
                </a>
              </div>
            </div>
            <div className="service-detail-visual" data-animate="fade-up">
              <div className="benefits-card-wrap">
                <canvas className="service-detail-canvas" data-pattern="contour" aria-hidden="true" />
                <div className="benefits-card">
                  <h3>Key Benefits</h3>
                  <ul className="benefits-list">
                    <li>
                      <span className="benefit-check" />
                      Improved posture and alignment
                    </li>
                    <li>
                      <span className="benefit-check" />
                      Enhanced flexibility and range of motion
                    </li>
                    <li>
                      <span className="benefit-check" />
                      Reduced chronic pain patterns
                    </li>
                    <li>
                      <span className="benefit-check" />
                      Better overall physical function
                    </li>
                    <li>
                      <span className="benefit-check" />
                      Greater body awareness
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── DEEP TISSUE MASSAGE ─── */}
      <section className="service-detail" id="deep-tissue">
        <div className="container">
          <div className="service-detail-inner">
            <div className="service-detail-content" data-animate="fade-up">
              <span className="service-detail-tag">02</span>
              <h2 className="service-detail-name">
                Deep Tissue
                <br />
                Massage
              </h2>
              <p className="service-detail-tagline">Targeted Relief for Deep Tension.</p>
              <div className="service-detail-body">
                <p>
                  For those seeking relief from chronic muscle tension and deep-seated pain, deep tissue massage is an exceptional choice. This specialized massage technique targets the deeper layers of muscle and connective tissue, focusing on areas of tightness and restriction.
                </p>
                <p>
                  By applying firm, deliberate pressure, deep tissue massage can help break up adhesions, increase blood flow, and release tight muscles &mdash; all of which contribute to reduced pain and improved mobility. Clients often report feeling a significant decrease in neck, back, and shoulder discomfort after a deep tissue session.
                </p>
                <p>
                  Additionally, this massage style can aid in the recovery process from injuries or overuse, as it helps to restore balance and flexibility to the musculoskeletal system. Beyond the physical benefits, deep tissue massage also has the potential to alleviate stress and anxiety by promoting a deep sense of relaxation.
                </p>
                <p>
                  For those looking to address chronic pain and enhance overall bodily function, deep tissue massage is a valuable therapeutic option worth considering.
                </p>
              </div>
              <div className="service-detail-cta">
                <a
                  href="https://www.massagebook.com/therapists/GoodrichMassage"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--primary"
                >
                  <span>Book a Deep Tissue Session</span>
                </a>
              </div>
            </div>
            <div className="service-detail-visual" data-animate="fade-up">
              <div className="benefits-card-wrap">
                <canvas className="service-detail-canvas" data-pattern="geometry" aria-hidden="true" />
                <div className="benefits-card">
                  <h3>Key Benefits</h3>
                  <ul className="benefits-list">
                    <li>
                      <span className="benefit-check" />
                      Relief from chronic muscle tension
                    </li>
                    <li>
                      <span className="benefit-check" />
                      Breaks up adhesions and scar tissue
                    </li>
                    <li>
                      <span className="benefit-check" />
                      Increased blood flow and mobility
                    </li>
                    <li>
                      <span className="benefit-check" />
                      Reduced neck, back, and shoulder pain
                    </li>
                    <li>
                      <span className="benefit-check" />
                      Stress and anxiety relief
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SWEDISH MASSAGE ─── */}
      <section className="service-detail" id="swedish-massage">
        <div className="container">
          <div className="service-detail-inner">
            <div className="service-detail-content" data-animate="fade-up">
              <span className="service-detail-tag">03</span>
              <h2 className="service-detail-name">
                Swedish
                <br />
                Massage
              </h2>
              <p className="service-detail-tagline">Gentle Relaxation for Body &amp; Mind.</p>
              <div className="service-detail-body">
                <p>
                  Swedish massage offers a multitude of benefits for both body and mind, making it an excellent choice for those seeking relaxation and overall wellness.
                </p>
                <p>
                  This gentle yet effective technique uses long, flowing strokes, kneading, and circular movements to ease muscle tension, improve circulation, and promote deep relaxation.
                </p>
                <p>
                  By choosing a Swedish massage, you're opting for a versatile treatment that can be tailored to your specific needs &mdash; whether you're looking to reduce stress, alleviate minor aches and pains, or simply indulge in some self-care. It's particularly beneficial for those new to massage or those who prefer a softer touch, as the pressure can be easily adjusted.
                </p>
                <p>
                  Regular Swedish massage sessions can lead to improved sleep quality, increased flexibility, and a boosted immune system. Moreover, the calming nature of this massage style can help decrease anxiety and depression, leaving you feeling refreshed, rejuvenated, and ready to take on the world.
                </p>
              </div>
              <div className="service-detail-cta">
                <a
                  href="https://www.massagebook.com/therapists/GoodrichMassage"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--primary"
                >
                  <span>Book a Swedish Massage Session</span>
                </a>
              </div>
            </div>
            <div className="service-detail-visual" data-animate="fade-up">
              <div className="benefits-card-wrap">
                <canvas className="service-detail-canvas" data-pattern="flow" aria-hidden="true" />
                <div className="benefits-card">
                  <h3>Key Benefits</h3>
                  <ul className="benefits-list">
                    <li>
                      <span className="benefit-check" />
                      Deep relaxation and stress relief
                    </li>
                    <li>
                      <span className="benefit-check" />
                      Improved circulation
                    </li>
                    <li>
                      <span className="benefit-check" />
                      Enhanced sleep quality
                    </li>
                    <li>
                      <span className="benefit-check" />
                      Increased flexibility
                    </li>
                    <li>
                      <span className="benefit-check" />
                      Boosted immune system
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── MEMBERSHIP CALLOUT ─── */}
      <section className="container" style={{ padding: '40px 5%' }}>
        <div className="membership-callout-banner" data-animate="fade-up">
          <div className="membership-callout-text">
            <h3>Save &amp; Stay Balanced with Monthly Memberships</h3>
            <p>
              Looking for regular bodywork? Receive discounted rates, unused session rollover, and priority booking with our monthly membership plans.
            </p>
          </div>
          <div>
            <a
              href="https://www.massagebook.com/therapists/GoodrichMassage/deals"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--primary btn--lg"
              data-magnetic
            >
              <span>Explore Memberships</span>
            </a>
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section className="services-cta-banner">
        <h2 data-animate="fade-up">Not Sure Which Service Is Right for You?</h2>
        <p data-animate="fade-up">
          Give us a call and we'll help you find the perfect treatment for your needs. Every body is different, and we're here to help.
        </p>
        <div className="services-cta-actions" data-animate="fade-up">
          <a
            href="https://www.massagebook.com/therapists/GoodrichMassage"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--primary btn--lg"
          >
            <span>Book Now</span>
          </a>
          <a href="tel:+17049311074" className="btn btn--ghost btn--lg">
            <span>Call (704) 931-1074</span>
          </a>
        </div>
      </section>

      <Footer />

      <Link href="/" className="back-link">
        &larr; Home
      </Link>
    </main>
  );
}
