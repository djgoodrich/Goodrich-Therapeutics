import Link from 'next/link';
import Image from 'next/image';
import ServiceCard from '@/components/ServiceCard';
import Footer from '@/components/Footer';
import HomeAnimations from '@/components/HomeAnimations';
import ContactCanvas from '@/components/ContactCanvas';
import WebGLBackground from '@/components/WebGLBackground';

export default function Home() {
  return (
    <main>
      <HomeAnimations />
      <WebGLBackground />

      {/* ─── HERO ─── */}
      <section id="hero" className="hero">
        <div className="hero-bg-wrapper">
          <Image
            src="/hero.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            quality={75}
            className="hero-bg-image"
          />
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

      {/* ─── MEMBERSHIPS ─── */}
      <section id="memberships" className="section memberships">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto' }}>
            <span className="section-tag" data-animate="fade-up">
              Wellness Committed
            </span>
            <h2 className="section-title" data-animate="fade-up">
              Massage Memberships
            </h2>
            <p
              style={{ fontSize: '18px', color: 'var(--text-dim)', lineHeight: 1.7, marginTop: '-12px' }}
              data-animate="fade-up"
            >
              Prioritize your health with consistent, recurring bodywork. Save on every session and maintain lasting relief, posture alignment, and physical well-being.
            </p>
          </div>

          <div className="memberships-grid">
            {/* Tier 1: Monthly 60 Min */}
            <div className="membership-card" data-animate="fade-up">
              <span className="membership-badge">Popular Choice</span>
              <h3 className="membership-tier-name">Monthly Wellness</h3>
              <p className="membership-tier-desc">Ideal for consistent stress relief and posture maintenance.</p>
              <div className="membership-price-wrap">
                <span className="membership-price">60 Min</span>
                <span className="membership-period">/ session per month</span>
              </div>
              <ul className="membership-features">
                <li>
                  <span className="membership-feature-icon" />
                  1 Full 60-Minute Therapeutic Session included every month
                </li>
                <li>
                  <span className="membership-feature-icon" />
                  Exclusive member rate on additional sessions throughout the month
                </li>
                <li>
                  <span className="membership-feature-icon" />
                  Flexible unused session rollover &amp; transfer options
                </li>
                <li>
                  <span className="membership-feature-icon" />
                  Priority online scheduling &amp; convenient auto-renewal
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
                  <span>Select Membership</span>
                </a>
              </div>
            </div>

            {/* Tier 2: Monthly 90 Min */}
            <div className="membership-card membership-card--featured" data-animate="fade-up" data-delay="0.15">
              <span className="membership-badge membership-badge--gold">Deep Transformation</span>
              <h3 className="membership-tier-name">Deep Restorative</h3>
              <p className="membership-tier-desc">Designed for comprehensive deep tissue massage and targeted muscle relief.</p>
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
                  Maximum cost savings &amp; member-only rates on add-ons
                </li>
                <li>
                  <span className="membership-feature-icon" />
                  Customized treatment plan focused on chronic tension &amp; deep muscle relief
                </li>
                <li>
                  <span className="membership-feature-icon" />
                  Priority weekend scheduling &amp; seamless monthly billing
                </li>
                <li style={{ fontSize: '13px', color: 'var(--accent)', fontStyle: 'italic' }}>
                  <span className="membership-feature-icon" />
                  Applies to massage therapy sessions (Structural Integration excluded)
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
                  <span>Select Membership</span>
                </a>
              </div>
            </div>
          </div>

          <div className="membership-benefits-grid" data-animate="fade-up">
            <div className="membership-benefit-card">
              <div className="benefit-icon-bubble">⚡</div>
              <h4>Consistent Healing</h4>
              <p>Regular massage prevents tension accumulation before chronic pain takes over.</p>
            </div>
            <div className="membership-benefit-card">
              <div className="benefit-icon-bubble">💎</div>
              <h4>Member Savings</h4>
              <p>Enjoy discounted rates on every monthly session and additional bookings.</p>
            </div>
            <div className="membership-benefit-card">
              <div className="benefit-icon-bubble">🔄</div>
              <h4>Roll-Over Credits</h4>
              <p>Busy month? Unused sessions safely roll over so you never lose your investment.</p>
            </div>
            <div className="membership-benefit-card">
              <div className="benefit-icon-bubble">📅</div>
              <h4>Priority Booking</h4>
              <p>Get first pick of prime weekend and evening appointment slots.</p>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '40px' }} data-animate="fade-up">
            <Link href="/memberships" className="btn btn--ghost btn--md" data-magnetic>
              <span>View Full Membership Details &amp; FAQs &rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── ABOUT ─── */}
      <section id="about" className="section about">
        <div className="container about-grid">
          <div className="about-visual" data-animate="fade-up">
            <div className="about-image-wrap">
              <Image
                src="/about.jpg"
                alt="Therapeutic bodywork — balance and restoration"
                width={800}
                height={597}
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
                <Image
                  src="/david-headshot-561x403.jpg"
                  alt="David Goodrich, LMT"
                  width={561}
                  height={403}
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
          <div style={{ textAlign: 'center', marginBottom: '40px' }} data-animate="fade-up">
            <a
              href="https://www.massagebook.com/therapists/GoodrichMassage/reviews"
              target="_blank"
              rel="noopener noreferrer"
              className="verified-reviews-badge"
              data-magnetic
            >
              <span className="verified-stars">★★★★★</span>
              <span><strong>5.0 Rating</strong> &bull; 36 Verified Reviews on MassageBook &rarr;</span>
            </a>
          </div>
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
        <ContactCanvas />
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
            <div className="contact-item">
              <h4>Service Area</h4>
              <p>
                Cornelius, Davidson, Huntersville,
                <br />
                Mooresville &amp; Lake Norman
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
