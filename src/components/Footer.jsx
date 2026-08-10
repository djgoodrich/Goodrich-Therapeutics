import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-wave" aria-hidden="true">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,10 1440,50 L1440,100 L0,100 Z" />
        </svg>
      </div>
      <div className="container footer-content">
        <div className="footer-brand">
          <img src="/logo.png" alt="Goodrich Therapeutics" className="footer-logo-img" />
          <span className="footer-logo">Goodrich Therapeutics</span>
          <p>
            Massage Therapy &amp; Structural Integration
            <br />
            Cornelius, NC
          </p>
        </div>
        <div className="footer-nav">
          <Link href="/services">Services</Link>
          <Link href="/memberships">Memberships</Link>
          <Link href="/#about">About</Link>
          <Link href="/#contact">Contact</Link>
          <a
            href="https://www.massagebook.com/therapists/GoodrichMassage/gift-certificates?src=external-certificates"
            target="_blank"
            rel="noopener noreferrer"
          >
            Gift Certificates
          </a>
        </div>
        <div className="footer-copy">
          <p>&copy; {new Date().getFullYear()} Goodrich Therapeutics. All rights reserved.</p>
          <p className="footer-address">
            20905 Torrence Chapel Rd, Suite 204, Cornelius, NC 28031 &middot; <a href="tel:+17049311074">(704) 931-1074</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
