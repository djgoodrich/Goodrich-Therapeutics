// Single source of truth for the homepage therapies (Sensory Selector + Therapeutics matrix).
export const BOOKING_URL = 'https://www.massagebook.com/therapists/GoodrichMassage';
export const MEMBERSHIPS_URL = 'https://www.massagebook.com/therapists/GoodrichMassage/deals';
export const GIFT_URL = 'https://www.massagebook.com/therapists/GoodrichMassage/gift-certificates?src=external-certificates';
export const REVIEWS_URL = 'https://www.massagebook.com/therapists/GoodrichMassage/reviews';

export const TISSUE_LAYERS = ['Skin', 'Superficial fascia', 'Superficial muscle', 'Deep muscle', 'Deep fascia & structure'];

// Each focus owns a palette: c1 = glow, c2 = body, c3 = shadow, base = room
export const PALETTES = {
  neutral:    { c1: '#c9b08c', c2: '#4d5a66', c3: '#1d2026', base: '#0c0c0e', accent: '#b8a488', accent2: '#4a5560' },
  relief:     { c1: '#e0b48e', c2: '#7c6a93', c3: '#2a2231', base: '#0e0c10', accent: '#dcb38f', accent2: '#6b5a82' },
  deep:       { c1: '#d57a4a', c2: '#7a2f28', c3: '#2a1411', base: '#0f0a09', accent: '#d98a5c', accent2: '#6e2c25' },
  structural: { c1: '#8fc0b8', c2: '#3b5e78', c3: '#121d27', base: '#090d10', accent: '#93c2ba', accent2: '#34566e' },
};

export const THERAPIES = [
  {
    id: 'relief', no: '01', focus: 'Stress Relief', service: 'Swedish Massage', nodeSub: 'Swedish massage',
    tagline: 'Soften. Slow. Breathe.',
    desc: 'Long, flowing strokes, kneading and circular work that ease muscle tension, lift circulation and settle a busy mind.',
    physiology: 'Rhythmic, even pressure helps shift the nervous system toward rest-and-digest: breath deepens, heart rate eases, and superficial muscle tone lets go.',
    depth: 2, depthRange: [0, 2], pace: 'Slow, continuous', ns: 'Parasympathetic',
    benefits: ['Deep relaxation & stress relief', 'Improved circulation', 'Better sleep quality', 'Eased everyday aches', 'Calmer, clearer mind'],
    rates: [['60 min', '$90'], ['90 min', '$125'], ['2 hr', '$160']], pos: [0.24, 0.3],
  },
  {
    id: 'deep', no: '02', focus: 'Deep Tissue', service: 'Deep Tissue Massage', nodeSub: 'Deep tissue massage',
    tagline: 'Reach the layer that holds on.',
    desc: 'Slow, specific pressure into deeper muscle and connective tissue to release chronic tension and long-held pain patterns.',
    physiology: 'Sustained pressure works through superficial layers to address adhesions, restore glide between tissues and increase local blood flow and mobility.',
    depth: 4, depthRange: [1, 3], pace: 'Slow, sustained', ns: 'Down-regulating',
    benefits: ['Relief from chronic muscle tension', 'Addresses adhesions & scar tissue', 'Increased blood flow & mobility', 'Less neck, back & shoulder pain', 'Stress and anxiety relief'],
    rates: [['60 min', '$90'], ['90 min', '$125'], ['2 hr', '$160']], pos: [0.76, 0.24],
  },
  {
    id: 'structural', no: '03', focus: 'Structural Integration', service: 'Structural Integration', nodeSub: 'Fascial re-patterning',
    tagline: 'Realign. Rebalance. Restore.',
    desc: 'A holistic method rooted in the work of Dr. Ida Rolf that reorganises the fascial network so the body can stand easily within gravity.',
    physiology: 'Firm, precise work across the fascial web changes how the body is organised — often leaving clients taller, more balanced and more aware of how they move.',
    depth: 5, depthRange: [1, 4], pace: 'Precise, progressive', ns: 'Re-patterning',
    benefits: ['Improved posture & alignment', 'Greater flexibility & range of motion', 'Fewer chronic pain patterns', 'Better overall physical function', 'Heightened body awareness'],
    rates: [['90 min', '$135']], pos: [0.5, 0.64],
  },
];

export const TESTIMONIALS = [
  { quote: 'I suffer from constant neck issues and he gets rid of the pain. He always whips my body into shape.', name: 'Melissa M.', service: 'Therapeutic massage' },
  { quote: 'I am very active, and he was able to get me relief after all the physical stress I put my body through.', name: 'Kaleb I.', service: 'Deep tissue & recovery' },
  { quote: 'One of the best massages I have ever had — I feel he can keep my back pain and tightness taken care of.', name: 'Deborah C.', service: 'Back pain & tightness' },
];
