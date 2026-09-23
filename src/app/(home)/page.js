import Image from 'next/image';
import Experience from '@/components/home/Experience';
import { faqData } from '@/data/faqData';
import {
  THERAPIES, TISSUE_LAYERS, TESTIMONIALS,
  BOOKING_URL, MEMBERSHIPS_URL, GIFT_URL, REVIEWS_URL,
} from '@/data/therapies';

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqData.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
};

const ext = { target: '_blank', rel: 'noopener noreferrer' };

function Line({ children }) {
  return <span className="line"><span className="line-inner">{children}</span></span>;
}

// SVG arrows: text arrows (→ ↗) render as colour emoji on some systems.
function Arrow({ diag = false }) {
  return (
    <svg className="arrow inline-block shrink-0" width="12" height="12" viewBox="0 0 12 12" fill="none"
      stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {diag ? <path d="M3 9 9 3M4.5 3H9v4.5" /> : <path d="M1.5 6h9M7 2.5 10.5 6 7 9.5" />}
    </svg>
  );
}

export default function Home() {
  const year = new Date().getFullYear();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* Canvases, intro curtain, veil, cursor + all motion/interaction */}
      <Experience />

      {/* ───────── NAV ───────── */}
      <header id="nav" className="fixed inset-x-0 top-0 z-50">
        <nav className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-5 md:px-10" aria-label="Primary">
          <a href="#top" data-veil className="group flex items-baseline gap-2" aria-label="Goodrich Therapeutics — home">
            <span className="display text-2xl">Goodrich</span>
            <span className="eyebrow hidden sm:inline">Therapeutics</span>
          </a>
          <div className="hidden items-center gap-10 lg:flex">
            <a className="nav-link" href="#focus" data-veil>Focus</a>
            <a className="nav-link" href="#matrix" data-veil>Therapeutics</a>
            <a className="nav-link" href="#practitioner" data-veil>Practitioner</a>
            <a className="nav-link" href="#faq" data-veil>FAQ</a>
            <a className="nav-link" href="#visit" data-veil>Visit</a>
          </div>
          <a className="btn btn-ghost !h-11 !px-5" href={BOOKING_URL} {...ext} data-magnetic>
            <span>Book</span><Arrow diag />
          </a>
        </nav>
      </header>

      <main className="page" id="top">
        {/* ───────── HERO ───────── */}
        <section id="hero" className="relative flex min-h-[100svh] flex-col justify-end px-5 pb-10 pt-28 md:px-10 md:pb-14">
          <div className="mx-auto w-full max-w-[1600px]">
            <p className="eyebrow hero-fade mb-8 flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="hidden sm:inline">Massage Therapy &amp; Structural Integration</span>
              <span className="hidden h-px w-10 bg-current opacity-40 sm:block" />
              <span>Cornelius · Lake Norman, NC</span>
            </p>

            <h1 className="display text-[clamp(3.1rem,min(9.2vw,13.2vh),10rem)]">
              <Line>Release what</Line>
              <Line>the body <em className="italic accent">has been</em></Line>
              <Line><em className="italic">holding.</em></Line>
            </h1>

            <div className="mt-8 grid gap-10 md:mt-10 md:grid-cols-12 md:items-end">
              <div className="hero-fade hidden md:col-span-4 md:block" aria-hidden="true">
                <p className="eyebrow">Fig. 01 — Myofascial bundle</p>
                <p className="mt-2 text-sm text-linen/50">Live render · move to release tension</p>
                <div className="mt-4 flex items-center gap-4 text-sm">
                  <span className="eyebrow !tracking-[.2em]">Tension</span>
                  <div className="h-px max-w-40 flex-1 bg-linen/15">
                    <div id="tension-bar" className="h-px bg-[rgb(var(--accent))]" style={{ width: '72%' }} />
                  </div>
                  <span id="tension-val" className="num w-10 text-linen/70">0.72</span>
                </div>
              </div>

              <div className="hero-fade md:col-span-5 md:col-start-8">
                <p className="max-w-md text-[17px] leading-relaxed text-linen/70">
                  Precision bodywork that realigns posture, unwinds chronic pain and returns the body to effortless
                  balance — with David Goodrich, LMT, and twenty years of hands-on practice in Cornelius, NC.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a className="btn btn-solid" href={BOOKING_URL} {...ext} data-magnetic>
                    <span>Reserve a session</span><Arrow />
                  </a>
                  <a className="btn btn-ghost" href="#focus" data-veil data-magnetic><span>Find your focus</span></a>
                </div>
              </div>
            </div>

            <div className="hero-fade mt-10 flex items-center justify-between border-t border-linen/10 pt-5 text-linen/50">
              <span className="eyebrow">Scroll</span>
              <div className="flex items-center gap-3" aria-hidden="true">
                <div className="breath-line" /><span id="breath-cue" className="eyebrow w-16">Inhale</span>
              </div>
              <span className="eyebrow num">NC LMT #7796</span>
            </div>
          </div>
        </section>

        {/* ───────── KINETIC MANIFESTO ───────── */}
        <section id="philosophy" className="kinetic relative" aria-label="Philosophy">
          <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
            <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2" aria-hidden="true">
              <div id="ghost" className="ghost-word relative">unwind<span className="ghost-fill">unwind</span></div>
            </div>
            <div className="relative mx-auto w-full max-w-[1600px] px-5 md:px-10">
              <p className="eyebrow mb-10">(02) — Philosophy</p>
              <p id="manifesto" className="display max-w-[22ch] text-[clamp(2rem,5.2vw,5.4rem)] !leading-[1.02]">
                The body keeps an honest record — of posture, of stress, of every long drive and restless night.
                Our work is to read it closely, and gently rewrite it.
              </p>
              <div className="mt-14 overflow-hidden whitespace-nowrap" aria-hidden="true">
                <div id="kinetic-strip" className="display inline-block text-[clamp(1.4rem,2.6vw,2.4rem)] italic text-linen/35">
                  Structural Integration &nbsp;—&nbsp; Deep Tissue &nbsp;—&nbsp; Swedish &nbsp;—&nbsp; Posture &nbsp;—&nbsp; Fascia &nbsp;—&nbsp; Relief &nbsp;—&nbsp; Structural Integration &nbsp;—&nbsp; Deep Tissue &nbsp;—&nbsp; Swedish &nbsp;—&nbsp; Posture &nbsp;—&nbsp; Fascia &nbsp;—&nbsp; Relief
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ───────── SENSORY SELECTOR ───────── */}
        <section id="focus" className="relative px-5 py-28 md:px-10 md:py-40">
          <div className="mx-auto max-w-[1600px]">
            <div className="mb-14 grid gap-8 md:grid-cols-12">
              <p className="eyebrow md:col-span-3">(03) — Sensory Selector</p>
              <h2 className="display text-[clamp(2.6rem,6vw,6rem)] md:col-span-9">
                <Line>Drag the light toward</Line>
                <Line>what your body <em className="italic accent">needs.</em></Line>
              </h2>
            </div>

            <div className="grid gap-10 lg:grid-cols-12">
              <div className="relative lg:col-span-7">
                <div id="selector-wrap" className="relative h-[62vh] max-h-[680px] min-h-[420px] overflow-hidden rounded-[28px] border border-linen/10 bg-black/20">
                  <canvas id="selector-stage" className="absolute inset-0 h-full w-full" aria-hidden="true" />
                  <div id="node-layer" role="radiogroup" aria-label="Choose a therapeutic focus">
                    {THERAPIES.map((t, i) => (
                      <button
                        key={t.id} type="button" role="radio" aria-checked="false" tabIndex={i === 0 ? 0 : -1}
                        className="node-btn" data-id={t.id}
                        style={{ left: `${t.pos[0] * 100}%`, top: `${t.pos[1] * 100}%` }}
                      >
                        <span className="n-name">{t.focus}</span>
                        <span className="n-sub">{t.nodeSub}</span>
                      </button>
                    ))}
                  </div>
                  <p className="eyebrow pointer-events-none absolute bottom-5 left-6 !text-[10px] text-linen/40">Drag the orb · or tap a focus</p>
                  <p className="eyebrow num pointer-events-none absolute right-6 top-5 !text-[10px] text-linen/40" id="sel-coords" aria-hidden="true">x 0.50 · y 0.50</p>
                </div>
              </div>

              <aside id="focus-panel" className="flex flex-col justify-between rounded-[28px] border border-linen/10 bg-white/[.02] p-7 md:p-10 lg:col-span-5" aria-live="polite">
                <div data-panel>
                  <p className="eyebrow" data-f="service">Your focus</p>
                  <h3 className="display mt-4 text-[clamp(2.4rem,4vw,3.8rem)]" data-f="name">Choose a direction</h3>
                  <p className="mt-3 font-serif text-2xl italic text-linen/60" data-f="tagline">Every body is different. Start where it feels right.</p>
                  <p className="mt-6 max-w-md leading-relaxed text-linen/65" data-f="desc">
                    Move the orb toward a focus. The room will shift with you — colour, light and pace all follow your choice.
                  </p>
                  <dl className="mt-9 grid grid-cols-2 gap-x-8 gap-y-6">
                    <div><dt className="eyebrow !text-[10px]">Pressure depth</dt><dd className="meter mt-3" data-f="depth"><i /><i /><i /><i /><i /></dd></div>
                    <div><dt className="eyebrow !text-[10px]">Pace</dt><dd className="mt-2 text-linen/80" data-f="pace">—</dd></div>
                    <div><dt className="eyebrow !text-[10px]">Nervous system</dt><dd className="mt-2 text-linen/80" data-f="ns">—</dd></div>
                    <div><dt className="eyebrow !text-[10px]">Sessions</dt><dd className="num mt-2 text-linen/80" data-f="rates">—</dd></div>
                  </dl>
                </div>
                <div className="mt-10 flex flex-wrap gap-3">
                  <a className="btn btn-solid" href={BOOKING_URL} {...ext} data-magnetic><span>Book this focus</span><Arrow /></a>
                  <a className="btn btn-ghost" href="#matrix" data-veil><span>Compare all</span></a>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* ───────── THERAPEUTICS MATRIX ───────── */}
        <section id="matrix" className="relative px-5 py-28 md:px-10 md:py-40">
          <span id="services" className="absolute top-0" aria-hidden="true" />
          <div className="mx-auto max-w-[1600px]">
            <div className="mb-16 grid gap-8 md:grid-cols-12 md:items-end">
              <p className="eyebrow md:col-span-3">(04) — The Therapeutics</p>
              <h2 className="display text-[clamp(2.6rem,6vw,6rem)] md:col-span-6">
                <Line>Three depths.</Line>
                <Line><em className="italic">One</em> intention.</Line>
              </h2>
              <p className="leading-relaxed text-linen/60 md:col-span-3">
                Open any therapy to see how deep it works, what it changes physiologically, and when you can begin.
              </p>
            </div>

            <div className="eyebrow hidden grid-cols-[4rem_minmax(0,1.6fr)_1fr_1fr_3rem] gap-6 pb-4 !text-[10px] text-linen/40 lg:grid">
              <span>No.</span><span>Therapy</span><span>Depth</span><span>Sessions</span><span />
            </div>

            <div id="matrix-rows">
              {THERAPIES.map((t) => (
                <article className="m-row" data-id={t.id} key={t.id}>
                  <button className="m-head" aria-expanded="false" aria-controls={`mb-${t.id}`}>
                    <span className="eyebrow num">{t.no}</span>
                    <span>
                      <span className="m-title block">{t.service}</span>
                      <span className="mt-3 block text-sm text-linen/50 lg:hidden">{t.tagline}</span>
                    </span>
                    <span className="hidden lg:block">
                      <span className="meter max-w-40">
                        {[1, 2, 3, 4, 5].map((i) => <i key={i} className={i <= t.depth ? 'on' : ''} />)}
                      </span>
                      <span className="eyebrow mt-3 block !text-[10px]">{t.focus}</span>
                    </span>
                    <span className="num hidden text-linen/70 lg:block">
                      {t.rates.map((r) => r[0]).join(' / ')}
                      <span className="block text-sm text-linen/40">from {t.rates[0][1]}</span>
                    </span>
                    <span className="m-plus" aria-hidden="true" />
                  </button>
                  <div className="m-body" id={`mb-${t.id}`} role="region" aria-label={t.service}>
                    <div className="grid gap-12 pb-14 pt-2 lg:grid-cols-[4rem_1fr_1fr_1fr] lg:gap-10">
                      <span className="hidden lg:block" />
                      <div data-stagger>
                        <p className="eyebrow !text-[10px]">Treatment depth</p>
                        <div className="mt-5 space-y-1.5">
                          {TISSUE_LAYERS.map((l, i) => (
                            <div className="tissue-layer" key={l}>
                              <div className="fill" data-on={i >= t.depthRange[0] && i <= t.depthRange[1] ? 1 : 0} />
                              <span>{l}</span>
                            </div>
                          ))}
                        </div>
                        <p className="mt-5 text-sm text-linen/50">Pace · {t.pace}</p>
                      </div>
                      <div data-stagger>
                        <p className="eyebrow !text-[10px]">Physiological effect</p>
                        <p className="mt-5 font-serif text-2xl italic leading-snug text-linen/85">{t.tagline}</p>
                        <p className="mt-4 leading-relaxed text-linen/60">{t.physiology}</p>
                        <ul className="mt-6 space-y-2.5 text-sm text-linen/70">
                          {t.benefits.map((b) => (
                            <li className="flex gap-3" key={b}>
                              <span className="mt-2 h-px w-4 shrink-0 bg-[rgb(var(--accent))]" />{b}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div data-stagger>
                        <p className="eyebrow !text-[10px]">Schedule</p>
                        <div className="mt-5 flex flex-wrap gap-2">
                          {t.rates.map((r) => (
                            <a key={r[0]} className="chip" href={BOOKING_URL} {...ext}>
                              <span className="text-xs uppercase tracking-[.16em] text-linen/50">{r[0]}</span>
                              <span className="num font-serif text-3xl">{r[1]}</span>
                            </a>
                          ))}
                        </div>
                        <a className="btn btn-solid mt-8" href={BOOKING_URL} {...ext} data-magnetic>
                          <span>Book this session</span><Arrow diag />
                        </a>
                        <p className="mt-4 text-xs text-linen/40">Opens MassageBook · live availability</p>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div id="memberships" className="mt-16 grid gap-6 rounded-[28px] border border-linen/10 p-7 md:grid-cols-12 md:items-center md:p-10">
              <div className="md:col-span-7">
                <p className="eyebrow">Memberships</p>
                <p className="display mt-3 text-4xl md:text-5xl">Relief that <em className="italic accent">compounds.</em></p>
                <p className="mt-4 max-w-xl leading-relaxed text-linen/60">
                  Monthly Wellness (60 min) or Deep Restorative (90 min). Member rates on extra sessions, roll-over credits and priority weekend booking.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 md:col-span-5 md:justify-self-end">
                <a className="btn btn-ghost" href={MEMBERSHIPS_URL} {...ext} data-magnetic><span>View memberships</span><Arrow diag /></a>
                <a className="btn btn-ghost" href="/memberships"><span>Details</span></a>
              </div>
            </div>
          </div>
        </section>

        {/* ───────── PRACTITIONER ───────── */}
        <section id="practitioner" className="relative px-5 py-28 md:px-10 md:py-40">
          <span id="about" className="absolute top-0" aria-hidden="true" />
          <div className="mx-auto grid max-w-[1600px] gap-14 lg:grid-cols-12">
            <div className="lg:col-span-5 lg:self-center">
              <div className="portrait-wrap reveal-clip relative aspect-[561/403] overflow-hidden rounded-[28px] bg-ink">
                <Image
                  className="portrait h-full w-full object-cover object-[50%_35%]"
                  src="/david-headshot-561x403.jpg" width={561} height={403}
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  alt="Portrait of David Goodrich, LMT"
                />
                <div className="portrait-tint pointer-events-none absolute inset-0" aria-hidden="true" />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian/70 via-transparent" />
                <p className="eyebrow absolute bottom-6 left-6">Fig. 02 — David Goodrich, LMT</p>
              </div>
            </div>
            <div className="flex flex-col justify-center lg:col-span-6 lg:col-start-7">
              <p className="eyebrow">(05) — Practitioner</p>
              <h2 className="display mt-6 text-[clamp(2.8rem,6vw,6rem)]">
                <Line>David Goodrich,</Line>
                <Line><em className="italic accent">LMT</em></Line>
              </h2>
              <p className="mt-8 max-w-xl text-lg leading-relaxed text-linen/70">
                For over twenty years David has specialised in Structural Integration and deep-tissue bodywork — pairing
                clinical precision with an intuitive read of the body&rsquo;s fascial network.
              </p>
              <p className="mt-4 max-w-xl leading-relaxed text-linen/55">
                From chronic neck pain to athletic recovery, his clients come to him for lasting change: freer movement,
                taller posture, and a body that finally feels like its own again.
              </p>
              <div className="mt-12 grid grid-cols-3 border-t border-linen/10 pt-8">
                <div><div className="display num text-5xl md:text-6xl"><span data-count="20">20</span><span className="accent">+</span></div><p className="eyebrow mt-3 !text-[10px]">Years of practice</p></div>
                <div><div className="display num text-5xl md:text-6xl"><span data-count="1000">1,000</span><span className="accent">+</span></div><p className="eyebrow mt-3 !text-[10px]">Clients helped</p></div>
                <div><div className="display num text-5xl md:text-6xl"><span data-count="5" data-decimals="1">5.0</span></div><p className="eyebrow mt-3 !text-[10px]">MassageBook rating</p></div>
              </div>
            </div>
          </div>
        </section>

        {/* ───────── WORDS ───────── */}
        <section id="words" className="relative px-5 py-28 md:px-10 md:py-36">
          <span id="testimonials" className="absolute top-0" aria-hidden="true" />
          <div className="mx-auto max-w-[1300px] text-center">
            <p className="eyebrow">(06) — Words of restoration</p>
            <div className="quote-stack mt-12" id="quotes">
              {TESTIMONIALS.map((q, i) => (
                <figure key={q.name} style={i ? { opacity: 0 } : undefined}>
                  <blockquote className="display text-[clamp(1.9rem,4.2vw,3.8rem)] !leading-[1.08]">&ldquo;{q.quote}&rdquo;</blockquote>
                  <figcaption className="eyebrow mt-8">{q.name} — {q.service}</figcaption>
                </figure>
              ))}
            </div>
            <div className="mt-10 flex justify-center gap-2" id="quote-dots" aria-hidden="true">
              {TESTIMONIALS.map((q) => <i key={q.name} className="block h-px w-8 bg-linen/20 transition-colors duration-700" />)}
            </div>
            <a className="mt-10 inline-flex items-center gap-3 text-sm text-linen/60 transition-colors hover:text-linen" href={REVIEWS_URL} {...ext}>
              <span className="accent tracking-[.2em]">★★★★★</span> 5.0 · 38 verified reviews on MassageBook <Arrow diag />
            </a>
          </div>
        </section>

        {/* ───────── FAQ ───────── */}
        <section id="faq" className="relative px-5 py-28 md:px-10 md:py-36">
          <div className="mx-auto max-w-[1600px]">
            <div className="mb-14 grid gap-8 md:grid-cols-12 md:items-end">
              <p className="eyebrow md:col-span-3">(07) — Questions</p>
              <h2 className="display text-[clamp(2.6rem,6vw,6rem)] md:col-span-6">
                <Line>Before you</Line>
                <Line><em className="italic accent">arrive.</em></Line>
              </h2>
              <p className="leading-relaxed text-linen/60 md:col-span-3">
                What to expect, how it feels, and the practical details — answered plainly.
              </p>
            </div>
            <div id="faq-rows">
              {faqData.map((f, i) => (
                <article className="m-row" key={f.question}>
                  <button className="faq-head" aria-expanded="false" aria-controls={`faq-${i}`}>
                    <span className="eyebrow num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="faq-q">{f.question}</span>
                    <span className="m-plus" aria-hidden="true" />
                  </button>
                  <div className="m-body" id={`faq-${i}`} role="region" aria-label={f.question}>
                    <p data-stagger className="max-w-3xl pb-10 leading-relaxed text-linen/65 lg:ml-[calc(4rem+1.5rem)]">{f.answer}</p>
                  </div>
                </article>
              ))}
            </div>
            <p className="mt-10 text-linen/55">
              Still wondering about your specific situation? Call <a className="accent hover:underline" href="tel:+17049311074">(704) 931-1074</a> or{' '}
              <a className="accent hover:underline" href="mailto:GoodrichTherapeutics@gmail.com">email David</a>.
            </p>
          </div>
        </section>

        {/* ───────── VISIT ───────── */}
        <section id="visit" className="relative px-5 pb-10 pt-28 md:px-10 md:pt-40">
          <span id="contact" className="absolute top-0" aria-hidden="true" />
          <div className="mx-auto max-w-[1600px]">
            <p className="eyebrow">(08) — Visit</p>
            <h2 className="display mt-6 text-[clamp(4.5rem,17vw,17rem)] !leading-[.82]">
              <Line>Begin</Line>
              <Line><em className="italic accent">softly.</em></Line>
            </h2>

            <div className="mt-16 grid gap-12 border-t border-linen/10 pt-10 md:grid-cols-12">
              <div className="md:col-span-5">
                <div className="flex flex-wrap gap-3">
                  <a className="btn btn-solid" href={BOOKING_URL} {...ext} data-magnetic><span>Book on MassageBook</span><Arrow diag /></a>
                  <a className="btn btn-ghost" href={GIFT_URL} {...ext} data-magnetic><span>Gift a session</span></a>
                </div>
              </div>
              <dl className="grid gap-8 sm:grid-cols-3 md:col-span-7">
                <div>
                  <dt className="eyebrow !text-[10px]">Studio</dt>
                  <dd className="mt-3 leading-relaxed text-linen/75">
                    <a className="hover:text-linen" href="https://www.google.com/maps/dir/?api=1&destination=20905+Torrence+Chapel+Rd+Suite+204+Cornelius+NC+28031" {...ext}>
                      20905 Torrence Chapel Rd<br />Suite 204, Cornelius NC 28031 <Arrow diag />
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="eyebrow !text-[10px]">Contact</dt>
                  <dd className="mt-3 leading-relaxed text-linen/75">
                    <a className="hover:text-linen" href="tel:+17049311074">(704) 931-1074</a><br />
                    <a className="hover:text-linen" href="mailto:GoodrichTherapeutics@gmail.com">GoodrichTherapeutics<wbr />@gmail.com</a>
                  </dd>
                </div>
                <div>
                  <dt className="eyebrow !text-[10px]">Serving</dt>
                  <dd className="mt-3 leading-relaxed text-linen/75">Cornelius, Davidson, Huntersville, Mooresville &amp; Lake Norman</dd>
                </div>
              </dl>
            </div>

            <footer className="mt-24 flex flex-col gap-4 border-t border-linen/10 pt-6 text-xs text-linen/40 lg:flex-row lg:items-center lg:justify-between">
              <span>© {year} Goodrich Therapeutics · goodrichtherapeutics.com</span>
              <nav className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Footer">
                <a className="hover:text-linen" href="/services">Service details</a>
                <a className="hover:text-linen" href="/memberships">Memberships</a>
                <a className="hover:text-linen" href={GIFT_URL} {...ext}>Gift certificates</a>
                <a className="hover:text-linen" href={REVIEWS_URL} {...ext}>Reviews</a>
              </nav>
              <span>David Goodrich, LMT · NC License #7796</span>
            </footer>
          </div>
        </section>
      </main>
    </>
  );
}
