export const metadata = {
  alternates: { canonical: '/services' },
  title: 'Massage Therapy & Structural Integration Services | Goodrich Therapeutics - Cornelius, NC',
  description:
    'Deep Tissue Massage ($90/60min, $125/90min), Structural Integration ($135/90min), and Swedish Massage in Cornelius, NC. Over 20 years of therapeutic bodywork experience.',
  openGraph: {
    images: [{ url: '/og.jpg', width: 1200, height: 630, alt: 'Goodrich Therapeutics — massage and Structural Integration in Cornelius, NC' }],
    title: 'Massage & Structural Integration Services | Goodrich Therapeutics',
    description:
      'Explore therapeutic massage and structural bodywork in Cornelius & Lake Norman, NC with licensed therapist David Goodrich, LMT.',
    url: 'https://www.goodrichtherapeutics.com/services',
  },
};

export default function ServicesLayout({ children }) {
  return children;
}
