import dns from 'node:dns';
import { MongoClient, type Db } from 'mongodb';

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {}

// Serverless instances reuse this connection between requests.
let clientPromise: Promise<MongoClient> | null = null;
let indexesReady: Promise<unknown> | null = null;

export async function getDb(): Promise<Db> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not configured.');
  if (!clientPromise) {
    clientPromise = new MongoClient(uri, { serverSelectionTimeoutMS: 15000, maxPoolSize: 5 }).connect().catch((err) => {
      clientPromise = null;
      throw err;
    });
  }
  const db = (await clientPromise).db(process.env.MONGODB_DB || 'knowza_cms');
  if (!indexesReady) {
    indexesReady = Promise.all([
      db.collection('admin_users').createIndex({ email: 1 }, { unique: true }),
      db.collection('sessions').createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
      // Every signed-in request looks its session up by this hash.
      db.collection('sessions').createIndex({ tokenHash: 1 }),
      db.collection('media').createIndex({ id: 1 }),
      db.collection('rate_limits').createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
      db.collection('revisions').createIndex({ createdAt: -1 }),
      db.collection('records').createIndex({ kind: 1, createdAt: -1 }),
    ]).catch((err) => {
      indexesReady = null;
      throw err;
    });
  }
  await indexesReady;
  return db;
}
