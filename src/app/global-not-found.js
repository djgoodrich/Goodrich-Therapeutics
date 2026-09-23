import { Cormorant_Garamond, Inter_Tight } from 'next/font/google';
import './(home)/home.css';

const display = Cormorant_Garamond({ subsets: ['latin'], weight: ['300'], style: ['normal', 'italic'], variable: '--font-display' });
const text = Inter_Tight({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-text' });

export const metadata = {
  title: 'Page not found | Goodrich Therapeutics',
  description: 'The page you are looking for does not exist.',
};

export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${display.variable} ${text.variable}`}>
      <body className="grid min-h-[100svh] place-items-center px-5"
        style={{ background: 'radial-gradient(80% 60% at 70% 30%, #2a2622, #0c0c0e)' }}>
        <main className="max-w-2xl text-center">
          <p className="eyebrow">404 — Page not found</p>
          <h1 className="display mt-6 text-[clamp(3.5rem,11vw,8rem)]">
            Let&rsquo;s find your <em className="italic accent">way back.</em>
          </h1>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <a className="btn btn-solid" href="/"><span>Return home</span></a>
            <a className="btn btn-ghost" href="https://www.massagebook.com/therapists/GoodrichMassage" target="_blank" rel="noopener"><span>Book a session</span></a>
          </div>
        </main>
      </body>
    </html>
  );
}
