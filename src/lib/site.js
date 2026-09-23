// Shared site-wide SEO: used by both root layouts (home + classic pages).

export const siteMetadata = {
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
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export const businessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'MassageTherapist',
  name: 'Goodrich Therapeutics',
  image: 'https://goodrichtherapeutics.com/logo.png',
  '@id': 'https://goodrichtherapeutics.com/#business',
  url: 'https://goodrichtherapeutics.com',
  telephone: '+17049311074',
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '20905 Torrence Chapel Rd, Suite 204',
    addressLocality: 'Cornelius',
    addressRegion: 'NC',
    postalCode: '28031',
    addressCountry: 'US',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 35.4856,
    longitude: -80.8879,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Monday',
      opens: '12:00',
      closes: '19:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Tuesday',
      opens: '13:00',
      closes: '20:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Thursday',
      opens: '09:00',
      closes: '15:00',
    },
  ],
  areaServed: [
    { '@type': 'City', name: 'Cornelius' },
    { '@type': 'City', name: 'Davidson' },
    { '@type': 'City', name: 'Huntersville' },
    { '@type': 'City', name: 'Mooresville' },
    { '@type': 'AdministrativeArea', name: 'Lake Norman' },
    { '@type': 'City', name: 'Charlotte' },
  ],
  sameAs: [
    'https://www.massagebook.com/therapists/GoodrichMassage',
    'https://www.massagebook.com/therapists/GoodrichMassage/reviews',
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5.0',
    reviewCount: '38',
    bestRating: '5',
    worstRating: '1',
  },
  review: [
    {
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: 'Melissa M.',
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: '5',
        bestRating: '5',
      },
      reviewBody:
        'I have been going to David for years and he always whips my body in shape. I suffer from constant neck issues and he gets rid of the pain.',
    },
    {
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: 'Kaleb I.',
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: '5',
        bestRating: '5',
      },
      reviewBody:
        'David was phenomenal—I am very active and he was able to get me relief after all the physical stress I put my body through.',
    },
    {
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: 'Deborah C.',
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: '5',
        bestRating: '5',
      },
      reviewBody:
        'One of the best massages I have ever had plus I feel like he will be able to help me keep my back pain and tightness taken care of.',
    },
  ],
};
