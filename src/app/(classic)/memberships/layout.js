export const metadata = {
  alternates: { canonical: '/memberships' },
  title: 'Massage Memberships & Monthly Wellness Plans | Goodrich Therapeutics - Cornelius, NC',
  description:
    'Save with recurring monthly massage therapy memberships in Cornelius & Lake Norman, NC. Enjoy member discounts, priority booking, and rollover session credits.',
  openGraph: {
    images: [{ url: '/og.jpg', width: 1200, height: 630, alt: 'Goodrich Therapeutics — massage and Structural Integration in Cornelius, NC' }],
    title: 'Massage Memberships & Wellness Plans | Goodrich Therapeutics',
    description:
      'Monthly massage wellness memberships with rollover credits and priority booking at Goodrich Therapeutics in Cornelius, NC.',
    url: 'https://www.goodrichtherapeutics.com/memberships',
  },
};

export default function MembershipsLayout({ children }) {
  return children;
}
