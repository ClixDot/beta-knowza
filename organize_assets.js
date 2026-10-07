const fs = require('fs');
const path = require('path');

const folders = [
  'public/images/hero',
  'public/images/nature',
  'public/images/culture',
  'public/images/connection',
  'public/images/gallery',
  'public/images/about',
  'public/images/brand',
  'public/images/blog',
  'public/images/contact'
];

folders.forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Copy verified brand photos
const copies = [
  ['extracted_assets/img_p0_1.png', 'public/images/hero/hero-sanctuary.png'],
  ['extracted_assets/img_p14_2.png', 'public/images/nature/fern.png'],
  ['extracted_assets/img_p14_3.png', 'public/images/culture/meditation.png'],
  ['extracted_assets/img_p14_1.png', 'public/images/connection/connection-hands.png'],
  ['extracted_assets/img_p2_3.png', 'public/images/gallery/rooted-earth.png'],
  ['extracted_assets/img_p2_6.png', 'public/images/gallery/warmth-connection.png'],
  ['extracted_assets/img_p2_9.png', 'public/images/gallery/treehouse-retreat.png'],
  ['extracted_assets/img_p12_1.png', 'public/images/about/grounding.png'],
  ['extracted_assets/img_p12_2.png', 'public/images/about/canopy.png'],
  ['extracted_assets/img_p12_3.png', 'public/images/about/presence.png'],
  ['extracted_assets/img_p12_4.png', 'public/images/about/water-ripple.png'],
  ['extracted_assets/img_p7_1.png', 'public/images/brand/leaf-texture.png'],
  ['extracted_assets/img_p11_1.png', 'public/images/brand/forest-texture.png'],
  ['extracted_assets/img_p17_4.png', 'public/images/gallery/peace-meadow.png'],
  ['extracted_assets/img_p18_1.png', 'public/images/brand/brand-card.png'],
  ['extracted_assets/img_p19_1.png', 'public/images/brand/billboard.png'],
  ['extracted_assets/img_p20_1.png', 'public/images/brand/mural.png'],
  ['extracted_assets/img_p15_1.png', 'public/images/brand/stationery.png'],
  ['extracted_assets/img_p16_1.png', 'public/images/brand/laptop-mockup.png'],
  ['extracted_assets/img_p21_1.png', 'public/images/brand/macro-leaf.png']
];

copies.forEach(([src, dest]) => {
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copied ${src} -> ${dest}`);
  }
});

console.log('Asset organization complete.');
