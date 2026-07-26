import { Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';
import SvgFilters from '@/components/SvgFilters';
import CustomCursor from '@/components/CustomCursor';
import GrainOverlay from '@/components/GrainOverlay';
import Preloader from '@/components/Preloader';
import Navbar from '@/components/Navbar';
import MobileMenu from '@/components/MobileMenu';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  title: 'Goodrich Therapeutics | Massage Therapy & Structural Integration in Cornelius, NC',
  description: 'Goodrich Therapeutics provides expert massage therapy and structural integration in Cornelius, NC. Licensed therapist David Goodrich, LMT with 20+ years of experience serving the greater Charlotte area.',
  keywords: ['massage therapy Cornelius NC', 'structural integration Charlotte', 'deep tissue massage Lake Norman', 'Swedish massage Cornelius', 'licensed massage therapist NC'],
  authors: [{ name: 'David Goodrich' }],
  metadataBase: new URL('https://goodrichtherapeutics.com'),
  openGraph: {
    title: 'Goodrich Therapeutics | Massage Therapy & Structural Integration',
    description: 'Expert massage therapy and structural integration in Cornelius, NC. 20+ years of experience. Book your appointment today.',
    url: 'https://goodrichtherapeutics.com',
    siteName: 'Goodrich Therapeutics',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Goodrich Therapeutics | Massage Therapy & Structural Integration',
    description: 'Expert massage therapy and structural integration in Cornelius, NC. Book your appointment today.',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
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
