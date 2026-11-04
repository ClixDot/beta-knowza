// Creates an admin user, or resets an existing user's password, in MongoDB.
// usage: node scripts/create-admin.mjs <email> "<name>" [admin|editor|viewer] [customPassword]
import { randomBytes } from 'node:crypto';
import dns from 'node:dns';
import fs from 'node:fs';
import bcrypt from 'bcryptjs';
import { MongoClient } from 'mongodb';

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {}

if (fs.existsSync('.env.local')) {
  for (const line of fs.readFileSync('.env.local', 'utf8').split('\n')) {
    const match = line.match(/^([A-Z_]+)=(.*)$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2].trim();
  }
}

const [email, name = 'Knowza Admin', role = 'admin', customPassword] = process.argv.slice(2);
if (!email || !['admin', 'editor', 'viewer'].includes(role)) {
  console.error('usage: node scripts/create-admin.mjs <email> "<name>" [admin|editor|viewer] [customPassword]');
  process.exit(1);
}

const password = customPassword || randomBytes(15).toString('base64url');

async function connectWithRetry(uri, maxAttempts = 3) {
  let lastErr;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const client = new MongoClient(uri, { serverSelectionTimeoutMS: 15000 });
      await client.connect();
      return client;
    } catch (err) {
      lastErr = err;
      if (attempt < maxAttempts) {
        console.log(`Connection attempt ${attempt} failed (${err.message}). Retrying in 2s...`);
        await new Promise((r) => setTimeout(r, 2000));
      }
    }
  }
  throw lastErr;
}

const client = await connectWithRetry(process.env.MONGODB_URI);
const db = client.db(process.env.MONGODB_DB || 'knowza_cms');
const normalized = email.toLowerCase();
await db.collection('admin_users').updateOne(
  { email: normalized },
  { $set: { email: normalized, name, role, passwordHash: await bcrypt.hash(password, 12) }, $setOnInsert: { createdAt: new Date() } },
  { upsert: true }
);
await db.collection('sessions').deleteMany({ email: normalized });
await client.close();
console.log(`${normalized} (${role})\nPassword: ${password}`);
