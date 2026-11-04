import { BrandPrinciple, FiveElement } from '../types';

export const siteConfig = {
  brandName: 'KNOWZA',
  tagline: 'Nature, Culture, Human Connection',
  positioning: 'Rooted in Place. Shaped by Culture. Connected by Heart.',
  description: 'Knowza is an experiential hospitality brand creating meaningful connections between people, places, culture, and nature.',
  fullPhilosophy: 'We believe the most memorable journeys are not simply visited — they are felt, experienced, and remembered.',
  subPhilosophy: 'Where the noise of the city fades into the rhythm of nature.',
  coreQuestion: 'WHAT MAKES A PLACE TRULY MEMORABLE?',
  coreAnswer: 'Not just where you stay, but what you experience, who you meet, and how a place makes you feel.',
  territory: 'South India & Beyond',
  
  // Official social and verified handles
  socials: {
    instagram: 'https://instagram.com/knowzagroup',
    instagramHandle: '@knowzagroup',
    website: 'https://www.knowzagroup.com',
  },
  
  // Editable configuration fields (as required by prompt, avoiding fake fabricated phone/addresses)
  contact: {
    email: 'hello@knowzagroup.com',
    generalEnquiries: 'experience@knowzagroup.com',
    locationContext: 'Rooted across the sanctuaries of South India — nestled amid ancient Western Ghats rain forests, fragrant tea hills, quiet backwaters, and heritage courtyards.',
    officeSchedule: 'Monday – Saturday · By Appointment',
  },
};

export const brandPrinciples: BrandPrinciple[] = [
  {
    number: '01',
    title: 'Rooted in Place',
    description: 'Every sanctuary is an organic extension of its natural habitat. We build in quiet rhythm with ancient trees, earth trails, and untouched riverways rather than imposing upon them.',
    image: 'https://res.cloudinary.com/mg4ku51f/image/upload/v1793760152/knowza/images/gallery/rooted-earth.png'
  },
  {
    number: '02',
    title: 'Shaped by Culture',
    description: 'Living heritage, localized wisdom, and traditional craftsmanship guide each experience. We honor the architectural soul and living memory of native communities.',
    image: 'https://res.cloudinary.com/mg4ku51f/image/upload/v1793760150/knowza/images/gallery/courtyard.jpg'
  },
  {
    number: '03',
    title: 'Connected by Heart',
    description: 'Hospitality is reimagined as genuine human presence. Meaningful encounters between travelers and local keepers foster quiet moments that outlast any itinerary.',
    image: 'https://res.cloudinary.com/mg4ku51f/image/upload/v1793760147/knowza/images/connection/connection-hands.jpg'
  },
  {
    number: '04',
    title: 'Thoughtfully Experienced',
    description: 'Slow travel elevated into an art form. Time slows to the cadence of rustling leaves, dawn birdsong, and the warmth of a shared morning fire.',
    image: 'https://res.cloudinary.com/mg4ku51f/image/upload/v1793760153/knowza/images/gallery/tea-hills.jpg'
  }
];

export const fiveElements: FiveElement[] = [
  {
    name: 'Fire & Space',
    geometry: 'Two Vertical Lines',
    description: 'Represent structure, warmth, passion, and boundless atmosphere.',
    meaning: 'The soaring vertical lines embody human aspiration, quiet strength, and the open celestial sky framing our destinations.'
  },
  {
    name: 'Earth',
    geometry: 'The Focal Circle',
    description: 'Represents stability, life, and the physical grounding of our destinations.',
    meaning: 'The central circle stands as the anchor—the fertile soil, mossy roots, and tangible landscapes from which all growth emerges.'
  },
  {
    name: 'Water & Air',
    geometry: 'Two Curved Lines',
    description: 'Symbolize fluidity, breath, lightness, and organic flow.',
    meaning: 'The gentle bowing arcs evoke the misty morning breeze, winding rivers, and flexible grace of nature in perpetual renewal.'
  }
];
