// One-off migration helper: lifts the hardcoded About page data arrays out of the
// original component so the CMS seed keeps the exact original wording.
// usage: node scripts/build-about-seed.mjs <original About.tsx> <output.ts>
import fs from 'node:fs';

const [input, output] = process.argv.slice(2);
const source = fs.readFileSync(input, 'utf8');

const take = (name) => {
  const start = source.indexOf(`const ${name}:`);
  const open = source.indexOf('= [', start) + 2;
  let depth = 0;
  for (let i = open; i < source.length; i++) {
    if (source[i] === '[') depth++;
    if (source[i] === ']' && --depth === 0) return source.slice(open, i + 1);
  }
  throw new Error(`Could not find ${name}`);
};

const quoteIcons = (text) => text.replace(/icon: ([A-Z]\w+)/g, "icon: '$1'");

const parts = ['ROADMAP_STAGES', 'VISION_POINTS', 'MISSION_POINTS', 'CORE_VALUES'].map(
  (name) => `export const ${name} = ${quoteIcons(take(name))};`
);

fs.writeFileSync(
  output,
  `// Generated from the original About page by scripts/build-about-seed.mjs.\n\n${parts.join('\n\n')}\n`
);
