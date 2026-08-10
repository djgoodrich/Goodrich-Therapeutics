'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Footer from '@/components/Footer';

export default function MembershipsPage() {
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

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--text)' }}>
      {/* ─── HERO ─── */}
      <section className="services-hero">
        <span className="services-hero-tag">Recurring Wellness Care</span>
        <h1>Massage Memberships</h1>
        <p>
          Invest in consistent, long-term bodywork. Designed to keep chronic pain at bay, optimize your posture, and provide regular, restorative relief.
        </p>
      </section>

      {/* ─── MEMBERSHIP OPTIONS ─── */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="memberships-grid" style={{ marginTop: 0 }}>
            {/* Tier 1: 60-Minute Membership */}
            <div className="membership-card" data-animate="fade-up">
              <span className="membership-badge">Popular Choice</span>
              <h2 className="membership-tier-name">Monthly Wellness</h2>
              <p className="membership-tier-desc">
                Ideal for regular stress management, muscle maintenance, and posture alignment.
              </p>
              <div className="membership-price-wrap">
                <span className="membership-price">60 Min</span>
                <span className="membership-period">/ session per month</span>
              </div>
              <ul className="membership-features">
                <li>
                  <span className="membership-feature-icon" />
                  1 Full 60-Minute Therapeutic Session included each month
                </li>
                <li>
                  <span className="membership-feature-icon" />
                  Member-discounted rates on any additional monthly appointments
                </li>
                <li>
                  <span className="membership-feature-icon" />
                  Unused sessions safely roll over — never lose a session
                </li>
                <li>
                  <span className="membership-feature-icon" />
                  Transferable to immediate family members
                </li>
                <li>
                  <span className="membership-feature-icon" />
                  Priority weekend and evening booking privileges
                </li>
              </ul>
              <div className="membership-card-cta">
                <a
                  href="https://www.massagebook.com/therapists/GoodrichMassage/deals"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--outline btn--lg"
                  data-magnetic
                >
                  <span>Purchase Membership</span>
                </a>
              </div>
            </div>

            {/* Tier 2: 90-Minute Membership */}
            <div className="membership-card membership-card--featured" data-animate="fade-up" data-delay="0.15">
              <span className="membership-badge membership-badge--gold">Deep Restorative</span>
              <h2 className="membership-tier-name">Deep Restorative</h2>
              <p className="membership-tier-desc">
                Designed for comprehensive deep tissue massage, chronic pain relief, and targeted muscle recovery.
              </p>
              <div className="membership-price-wrap">
                <span className="membership-price">90 Min</span>
                <span className="membership-period">/ session per month</span>
              </div>
              <ul className="membership-features">
                <li>
                  <span className="membership-feature-icon" />
                  1 Extended 90-Minute Massage Therapy Session (Deep Tissue or Swedish)
                </li>
                <li>
                  <span className="membership-feature-icon" />
                  Maximum cost savings &amp; exclusive discounts on session upgrades
                </li>
                <li>
                  <span className="membership-feature-icon" />
                  Customized bodywork plan focused on deep muscle release &amp; relaxation
                </li>
                <li>
                  <span className="membership-feature-icon" />
                  Unused session rollover protection
                </li>
                <li style={{ fontSize: '13px', color: 'var(--accent)', fontStyle: 'italic' }}>
                  <span className="membership-feature-icon" />
                  Valid for massage therapy sessions (Structural Integration excluded)
                </li>
              </ul>
              <div className="membership-card-cta">
                <a
                  href="https://www.massagebook.com/therapists/GoodrichMassage/deals"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--primary btn--lg"
                  data-magnetic
                >
                  <span>Purchase Membership</span>
                </a>
              </div>
            </div>
          </div>

          {/* ─── WHY BECOME A MEMBER ─── */}
          <div style={{ marginTop: '100px' }}>
            <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px' }}>
              <span className="section-tag" data-animate="fade-up">
                Membership Advantages
              </span>
              <h2 className="section-title" data-animate="fade-up">
                Why Choose Monthly Care?
              </h2>
            </div>

            <div className="membership-benefits-grid" data-animate="fade-up">
              <div className="membership-benefit-card">
                <div className="benefit-icon-bubble">🧠</div>
                <h4>Prevent Cumulative Pain</h4>
                <p>
                  Chronic tension builds up over weeks of sitting and activity. Monthly sessions break pain cycles before they become debilitating.
                </p>
              </div>
              <div className="membership-benefit-card">
                <div className="benefit-icon-bubble">💰</div>
                <h4>Guaranteed Cost Savings</h4>
                <p>
                  Members unlock reduced per-session pricing on all bookings compared to single standard appointments.
                </p>
              </div>
              <div className="membership-benefit-card">
                <div className="benefit-icon-bubble">🔄</div>
                <h4>Flexibility &amp; Rollover</h4>
                <p>
                  Life happens. If you skip a month due to travel or scheduling, your unused credits roll over to the next month.
                </p>
              </div>
              <div className="membership-benefit-card">
                <div className="benefit-icon-bubble">⭐</div>
                <h4>Priority Scheduling</h4>
                <p>
                  Enjoy hassle-free auto-booking and access to popular appointment slots in Cornelius, NC.
                </p>
              </div>
            </div>
          </div>

          {/* ─── FREQUENTLY ASKED QUESTIONS ─── */}
          <div style={{ marginTop: '100px' }}>
            <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px' }}>
              <span className="section-tag" data-animate="fade-up">
                Got Questions?
              </span>
              <h2 className="section-title" data-animate="fade-up">
                Membership FAQs
              </h2>
            </div>

            <div className="membership-faq" data-animate="fade-up">
              <div className="faq-item">
                <h3 className="faq-question">Which services are covered by monthly memberships?</h3>
                <p className="faq-answer">
                  Memberships apply exclusively to standard 60-minute and 90-minute massage therapy sessions (such as Deep Tissue Massage and Swedish Massage). Please note that Structural Integration series and specialized structural bodywork are separate clinical protocols and are not included under monthly membership plans.
                </p>
              </div>

              <div className="faq-item">
                <h3 className="faq-question">How does the monthly membership billing work?</h3>
                <p className="faq-answer">
                  Your payment method is securely billed on a recurring monthly schedule via MassageBook. Each month, your massage credit is automatically added to your account for immediate booking.
                </p>
              </div>

              <div className="faq-item">
                <h3 className="faq-question">What happens if I miss a month?</h3>
                <p className="faq-answer">
                  Don't worry! Unused session credits remain active and roll over into the following month, so you can use multiple credits when your schedule permits.
                </p>
              </div>

              <div className="faq-item">
                <h3 className="faq-question">Can I gift or share my session credit with someone else?</h3>
                <p className="faq-answer">
                  Yes! Members are welcome to transfer session credits to family or friends if they are unable to use their credit during a given billing period.
                </p>
              </div>

              <div className="faq-item">
                <h3 className="faq-question">Is there a contract or cancellation fee?</h3>
                <p className="faq-answer">
                  We believe in hassle-free wellness. You can pause or cancel your membership anytime through your MassageBook client account or by contacting us directly.
                </p>
              </div>
            </div>
          </div>

          {/* ─── FINAL CTA BANNER ─── */}
          <div className="services-cta-banner" style={{ marginTop: '80px' }} data-animate="fade-up">
            <h2>Ready to Elevate Your Wellness Routine?</h2>
            <p>
              Select your preferred membership tier online and start experiencing consistent, expert therapeutic bodywork.
            </p>
            <div className="services-cta-actions">
              <a
                href="https://www.massagebook.com/therapists/GoodrichMassage/deals"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--primary btn--lg"
                data-magnetic
              >
                <span>Purchase Membership on MassageBook</span>
              </a>
              <Link href="/#contact" className="btn btn--ghost btn--lg" data-magnetic>
                <span>Have Questions? Contact Us</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Back Link */}
      <Link href="/" className="back-link">
        &larr; Back to Home
      </Link>

      <Footer />
    </main>
  );
}
