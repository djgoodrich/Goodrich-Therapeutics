import { Cormorant_Garamond, Inter_Tight } from 'next/font/google';
import './home.css';
import { siteMetadata, businessJsonLd } from '@/lib/site';

const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

const text = Inter_Tight({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-text',
  display: 'swap',
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0c0c0e',
};

export const metadata = siteMetadata;

// Runs before first paint: flags JS for progressive reveals, and skips the
// intro curtain for visitors who already saw it this session.
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');try{if(sessionStorage.getItem('gt-intro'))d.classList.add('intro-seen')}catch(e){}})();`;

// Root layout for the immersive homepage only.
export default function HomeRootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${text.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
