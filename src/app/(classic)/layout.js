import { Cormorant_Garamond, Inter } from 'next/font/google';
import '../globals.css';
import { siteMetadata, businessJsonLd } from '@/lib/site';
import SvgFilters from '@/components/SvgFilters';
import CustomCursor from '@/components/CustomCursor';
import GrainOverlay from '@/components/GrainOverlay';
import Preloader from '@/components/Preloader';
import Navbar from '@/components/Navbar';
import MobileMenu from '@/components/MobileMenu';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal'],
  variable: '--font-cormorant',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#070707',
};

export const metadata = siteMetadata;

// Root layout for the classic pages (/services, /memberships).
// The homepage has its own root layout in app/(home) — navigating between them is a full page load.
export default function ClassicRootLayout({ children }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`} data-scroll-behavior="smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }}
        />
      </head>
      <body>
        <SvgFilters />
        <Preloader />
        <CustomCursor />
        <GrainOverlay />
        <Navbar />
        <MobileMenu />
        {children}
      </body>
    </html>
  );
}

