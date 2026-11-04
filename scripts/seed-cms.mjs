// Loads the original website content into MongoDB. Existing documents are left alone,
// so this is safe to run again and cannot overwrite edits.
// usage: node scripts/seed-cms.mjs
import fs from 'node:fs';
import dns from 'node:dns';
import { MongoClient } from 'mongodb';
import { createServer } from 'vite';

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {}

if (fs.existsSync('.env.local')) {
  for (const line of fs.readFileSync('.env.local', 'utf8').split('\n')) {
    const match = line.match(/^([A-Z_]+)=(.*)$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2].trim();
  }
}

const vite = await createServer({ configFile: false, server: { middlewareMode: true }, appType: 'custom', logLevel: 'silent' });
const { createSeedDocument } = await vite.ssrLoadModule('/src/cms/migration/index.ts');
const client = await new MongoClient(process.env.MONGODB_URI).connect();
const docs = client.db(process.env.MONGODB_DB || 'knowza_cms').collection('documents');

// Draft and published start identical, so a fresh install has nothing waiting to publish.
const seed = createSeedDocument();

for (const stage of ['published', 'draft']) {
  const result = await docs.updateOne(
    { _id: stage },
    { $setOnInsert: { document: seed, updatedAt: new Date(), updatedBy: 'seed' } },
    { upsert: true }
  );
  console.log(`${stage}: ${result.upsertedCount ? 'seeded' : 'already exists, left unchanged'}`);
}

await client.close();
await vite.close();
