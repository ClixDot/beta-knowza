import fs from 'node:fs';
import path from 'node:path';

const mappingPath = path.resolve('src/cms/cloudinaryMapping.json');
const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));

// Sort keys by length descending to avoid partial prefix replacement
const sortedKeys = Object.keys(mapping).sort((a, b) => b.length - a.length);

const targetDirs = ['src/data', 'src/cms/migration', 'src/components', 'src/admin', 'src/cms/schemas'];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  for (const key of sortedKeys) {
    if (content.includes(`'${key}'`) || content.includes(`"${key}"`)) {
      const cloudUrl = mapping[key];
      content = content.replaceAll(`'${key}'`, `'${cloudUrl}'`);
      content = content.replaceAll(`"${key}"`, `"${cloudUrl}"`);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${path.relative('.', filePath)} with Cloudinary URLs.`);
  }
}

function walkDir(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath);
    } else if (/\.(ts|tsx|js|mjs)$/.test(entry.name)) {
      processFile(fullPath);
    }
  }
}

for (const dir of targetDirs) {
  walkDir(path.resolve(dir));
}

console.log('Finished updating src files!');

