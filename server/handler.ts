import { createHash, randomBytes } from 'node:crypto';
import type { IncomingMessage, ServerResponse } from 'node:http';
import bcrypt from 'bcryptjs';
import { v2 as cloudinary } from 'cloudinary';
import type { Db } from 'mongodb';
import { getDb } from './db.js';

type Role = 'admin' | 'editor' | 'viewer';

interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

class HttpError extends Error {
  constructor(readonly status: number, message: string) {
    super(message);
  }
}

const COOKIE = 'knowza_cms_session';
const SESSION_DAYS = 7;
const MAX_BODY_BYTES = 4 * 1024 * 1024;
const UPLOAD_FOLDER = () => process.env.CLOUDINARY_FOLDER || 'knowza';
const LOGIN_MAX_FAILURES = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;

const sha256 = (value: string) => createHash('sha256').update(value).digest('hex');

const clientIp = (req: IncomingMessage) => {
  const forwarded = req.headers['x-forwarded-for'];
  return (Array.isArray(forwarded) ? forwarded[0] : forwarded)?.split(',')[0].trim() || req.socket?.remoteAddress || 'unknown';
};

const readCookie = (req: IncomingMessage, name: string) => {
  for (const part of (req.headers.cookie ?? '').split(';')) {
    const [key, ...rest] = part.trim().split('=');
    if (key === name) return rest.join('=');
  }
  return null;
};

const isSecureRequest = (req: IncomingMessage) =>
  req.headers['x-forwarded-proto'] === 'https' || process.env.NODE_ENV === 'production' && !/^localhost|^127\./.test(req.headers.host ?? '');

const sessionCookie = (req: IncomingMessage, token: string, maxAge: number) =>
  `${COOKIE}=${token}; Path=/api/cms; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${isSecureRequest(req) ? '; Secure' : ''}`;

async function readBody(req: IncomingMessage & { body?: unknown }): Promise<any> {
  // Vercel has already parsed the body by the time the handler runs.
  let parsed: unknown;
  try {
    parsed = req.body;
    if (typeof parsed === 'string') parsed = parsed ? JSON.parse(parsed) : {};
  } catch {
    throw new HttpError(400, 'The request body is not valid JSON.');
  }
  if (parsed !== undefined) return parsed ?? {};
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req) {
    size += (chunk as Buffer).length;
    if (size > MAX_BODY_BYTES) throw new HttpError(413, 'This request is too large.');
    chunks.push(chunk as Buffer);
  }
  if (!chunks.length) return {};
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    throw new HttpError(400, 'The request body is not valid JSON.');
  }
}

async function currentUser(db: Db, req: IncomingMessage): Promise<SessionUser | null> {
  const token = readCookie(req, COOKIE);
  if (!token) return null;
  const session = await db.collection('sessions').findOne({ tokenHash: sha256(token), expiresAt: { $gt: new Date() } });
  if (!session) return null;
  const user = await db.collection('admin_users').findOne({ email: session.email, disabled: { $ne: true } });
  if (!user) return null;
  return { id: String(user._id), name: user.name, email: user.email, role: user.role };
}

const RANK: Record<Role, number> = { viewer: 1, editor: 2, admin: 3 };

function requireRole(user: SessionUser | null, role: Role): asserts user is SessionUser {
  if (!user) throw new HttpError(401, 'Please sign in again.');
  if (RANK[user.role] < RANK[role]) throw new HttpError(403, 'Your role does not allow this action.');
}

/** Counts events per key in Mongo, because serverless instances share no memory. */
async function hitRateLimit(db: Db, key: string, limit: number, windowMs: number) {
  const now = new Date();
  const result = await db.collection<{ _id: string; count: number; expiresAt: Date }>('rate_limits').findOneAndUpdate(
    { _id: key },
    [
      {
        $set: {
          count: { $cond: [{ $gt: ['$expiresAt', now] }, { $add: ['$count', 1] }, 1] },
          expiresAt: { $cond: [{ $gt: ['$expiresAt', now] }, '$expiresAt', new Date(now.getTime() + windowMs)] },
        },
      },
    ],
    { upsert: true, returnDocument: 'after' }
  );
  return (result?.count ?? 1) > limit;
}

const isValidDocument = (doc: any) =>
  Boolean(doc) &&
  typeof doc === 'object' &&
  ['home', 'about', 'gallery', 'blog', 'contact'].every((id) => Array.isArray(doc.pages?.[id]?.sections)) &&
  Boolean(doc.global?.header) &&
  Array.isArray(doc.gallery?.items) &&
  Array.isArray(doc.blog?.posts);

const text = (value: unknown, max: number) => (typeof value === 'string' ? value.trim().slice(0, max) : '');
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const stripId = <T extends Record<string, any>>(row: T | null) => {
  if (!row) return null;
  const { _id, ...rest } = row;
  return rest;
};

const FORMATS: Record<string, { resource: 'image' | 'video'; formats: string }> = {
  image: { resource: 'image', formats: 'jpg,png,webp,gif,avif' },
  video: { resource: 'video', formats: 'mp4,webm' },
};

function cloudConfig() {
  const config = cloudinary.config(true);
  if (!config.cloud_name || !config.api_key || !config.api_secret) throw new HttpError(500, 'Cloudinary is not configured.');
  return config;
}

async function route(req: IncomingMessage, res: ServerResponse, method: string, path: string, query: URLSearchParams): Promise<unknown> {
  const db = await getDb();
  const segments = path.split('/').filter(Boolean).map(decodeURIComponent);
  const [area, second] = segments;
  const docs = db.collection<any>('documents');
  const revisions = db.collection<any>('revisions');
  const media = db.collection<any>('media');
  const records = db.collection<any>('records');

  // Cookie-carrying writes must come from our own pages.
  if (method !== 'GET') {
    if (req.headers['x-knowza-cms'] !== '1') throw new HttpError(403, 'Request rejected.');
    const origin = req.headers.origin;
    if (origin && new URL(origin).host !== req.headers.host) throw new HttpError(403, 'Request rejected.');
  }

  // --- Public endpoints -----------------------------------------------------
  if (area === 'documents' && second === 'published' && method === 'GET') {
    return (await docs.findOne({ _id: 'published' }))?.document ?? null;
  }

  if (area === 'media-urls' && method === 'GET') {
    const ids = (query.get('ids') ?? '').split(',').filter(Boolean).slice(0, 200);
    const rows = await media.find({ id: { $in: ids } }, { projection: { id: 1, url: 1 } }).toArray();
    return Object.fromEntries(rows.filter((row) => row.url).map((row) => [row.id, row.url]));
  }

  if (area === 'auth' && second === 'login' && method === 'POST') {
    const body = await readBody(req);
    const email = text(body.email, 200).toLowerCase();
    const password = typeof body.password === 'string' ? body.password.slice(0, 200) : '';
    const key = `login:${sha256(`${email}|${clientIp(req)}`)}`;
    const [limited, user] = await Promise.all([
      db.collection<any>('rate_limits').findOne({ _id: key, expiresAt: { $gt: new Date() }, count: { $gte: LOGIN_MAX_FAILURES } }),
      db.collection('admin_users').findOne({ email, disabled: { $ne: true } }),
    ]);
    if (limited) throw new HttpError(429, 'Too many failed attempts. Try again in 15 minutes.');
    // Always run a comparison so response time does not reveal which emails exist.
    const ok = await bcrypt.compare(password, user?.passwordHash ?? '$2a$12$C6UzMDM.H6dfI/f/IKcEeO7ZCgJqRgoHvmWc5nxH8p8c1m4Hg0G9a');
    if (!user || !ok) {
      await hitRateLimit(db, key, LOGIN_MAX_FAILURES, LOGIN_WINDOW_MS);
      throw new HttpError(401, 'That email or password is not correct.');
    }
    const token = randomBytes(32).toString('hex');
    await Promise.all([
      db.collection('rate_limits').deleteOne({ _id: key as any }),
      db.collection('sessions').insertOne({
        tokenHash: sha256(token),
        email,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + SESSION_DAYS * 86400000),
      }),
    ]);
    res.setHeader('Set-Cookie', sessionCookie(req, token, SESSION_DAYS * 86400));
    return { name: user.name, email: user.email, role: user.role };
  }

  const user = await currentUser(db, req);

  // Enquiries and newsletter sign-ups are the only public writes.
  if (area === 'records' && method === 'PUT' && !user) {
    const body = await readBody(req);
    if (await hitRateLimit(db, `public:${sha256(clientIp(req))}`, 10, 60 * 60 * 1000)) {
      throw new HttpError(429, 'Too many messages. Please try again later.');
    }
    const email = text(body.email, 200);
    if (!EMAIL.test(email)) throw new HttpError(400, 'Please provide a valid email address.');
    const base = { id: `${body.kind === 'enquiry' ? 'enq' : 'sub'}-${randomBytes(9).toString('hex')}`, createdAt: new Date().toISOString(), email };
    if (body.kind === 'enquiry') {
      const name = text(body.name, 200);
      const message = text(body.message, 5000);
      if (!name || !message) throw new HttpError(400, 'Please complete the required fields.');
      await records.insertOne({ ...base, kind: 'enquiry', name, phone: text(body.phone, 60), purpose: text(body.purpose, 120), message, read: false });
      return null;
    }
    if (body.kind === 'subscriber') {
      await records.updateOne({ kind: 'subscriber', email: email.toLowerCase() }, { $setOnInsert: { ...base, email: email.toLowerCase(), kind: 'subscriber' } }, { upsert: true });
      return null;
    }
    throw new HttpError(401, 'Please sign in again.');
  }

  // --- Account --------------------------------------------------------------
  if (area === 'auth') {
    if (second === 'me' && method === 'GET') return user ? { name: user.name, email: user.email, role: user.role } : null;
    if (second === 'logout' && method === 'POST') {
      const token = readCookie(req, COOKIE);
      if (token) await db.collection('sessions').deleteOne({ tokenHash: sha256(token) });
      res.setHeader('Set-Cookie', sessionCookie(req, '', 0));
      return null;
    }
    if (second === 'password' && method === 'POST') {
      requireRole(user, 'viewer');
      const body = await readBody(req);
      const next = typeof body.next === 'string' ? body.next : '';
      if (next.length < 12 || next.length > 200) throw new HttpError(400, 'Use a password of at least 12 characters.');
      const record = await db.collection('admin_users').findOne({ email: user.email });
      if (!record || !(await bcrypt.compare(String(body.current ?? ''), record.passwordHash))) throw new HttpError(401, 'Your current password is not correct.');
      await db.collection('admin_users').updateOne({ email: user.email }, { $set: { passwordHash: await bcrypt.hash(next, 12) } });
      // Other devices must sign in again with the new password.
      const token = readCookie(req, COOKIE)!;
      await db.collection('sessions').deleteMany({ email: user.email, tokenHash: { $ne: sha256(token) } });
      return null;
    }
  }

  // --- Documents ------------------------------------------------------------
  if (area === 'documents') {
    if (!second && method === 'DELETE') {
      requireRole(user, 'admin');
      await docs.deleteMany({});
      return null;
    }
    if (second === 'draft' && method === 'GET') {
      requireRole(user, 'viewer');
      return (await docs.findOne({ _id: 'draft' }))?.document ?? null;
    }
    if ((second === 'draft' || second === 'published') && method === 'PUT') {
      requireRole(user, second === 'published' ? 'admin' : 'editor');
      const document = await readBody(req);
      if (!isValidDocument(document)) throw new HttpError(400, 'This is not a valid CMS document.');
      await docs.updateOne({ _id: second }, { $set: { document, updatedAt: new Date(), updatedBy: user.email } }, { upsert: true });
      return null;
    }
  }

  // --- Revisions ------------------------------------------------------------
  if (area === 'revisions') {
    if (method === 'GET' && !second) {
      requireRole(user, 'viewer');
      return (await revisions.find({}, { projection: { document: 0, _id: 0 } }).sort({ createdAt: -1 }).toArray());
    }
    if (method === 'GET') {
      requireRole(user, 'viewer');
      return stripId(await revisions.findOne({ id: second }));
    }
    if (method === 'POST') {
      requireRole(user, 'editor');
      const revision = await readBody(req);
      if (typeof revision.id !== 'string' || !isValidDocument(revision.document)) throw new HttpError(400, 'Invalid revision.');
      await revisions.updateOne({ id: revision.id }, { $set: { ...revision, author: user.name } }, { upsert: true });
      return null;
    }
    if (method === 'DELETE') {
      requireRole(user, 'editor');
      await revisions.deleteOne({ id: second });
      return null;
    }
  }

  // --- Media ----------------------------------------------------------------
  if (area === 'media') {
    if (method === 'GET' && !second) {
      requireRole(user, 'viewer');
      return (await media.find({}, { projection: { _id: 0, publicId: 0, resourceType: 0 } }).toArray());
    }
    if (second === 'sign' && method === 'POST') {
      requireRole(user, 'editor');
      const body = await readBody(req);
      const format = FORMATS[body.kind];
      const id = text(body.id, 80);
      if (!format || !/^[\w-]+$/.test(id)) throw new HttpError(400, 'Invalid upload request.');
      const config = cloudConfig();
      const params = {
        timestamp: Math.round(Date.now() / 1000),
        public_id: id,
        folder: UPLOAD_FOLDER(),
        overwrite: 'true',
        invalidate: 'true',
        allowed_formats: format.formats,
      };
      return {
        ...params,
        cloudName: config.cloud_name,
        apiKey: config.api_key,
        resourceType: format.resource,
        signature: cloudinary.utils.api_sign_request(params, config.api_secret!),
      };
    }
    if (method === 'POST') {
      requireRole(user, 'editor');
      const body = await readBody(req);
      const item = body.item;
      if (typeof item?.id !== 'string') throw new HttpError(400, 'Invalid media item.');
      const set: Record<string, unknown> = { ...item };
      delete set.url;
      delete set.publicId;
      delete set.resourceType;
      if (body.upload) {
        const config = cloudConfig();
        const { url, publicId, resourceType } = body.upload;
        // Only ever store assets that live in this account's upload folder.
        const expectedPrefix = `https://res.cloudinary.com/${config.cloud_name}/`;
        if (typeof url !== 'string' || !url.startsWith(expectedPrefix) || publicId !== `${UPLOAD_FOLDER()}/${item.id}` || !['image', 'video'].includes(resourceType)) {
          throw new HttpError(400, 'This upload could not be verified.');
        }
        Object.assign(set, { url, publicId, resourceType });
      }
      await media.updateOne({ id: item.id }, { $set: set }, { upsert: true });
      return null;
    }
    if (method === 'DELETE') {
      requireRole(user, 'editor');
      const ref = `media:${second}`;
      const stored = await docs.find({}).toArray();
      if (stored.some((row) => JSON.stringify(row.document).includes(`"${ref}"`))) {
        throw new HttpError(409, 'This file is still used by the website.');
      }
      const row = await media.findOne({ id: second });
      if (row?.publicId) {
        cloudConfig();
        await cloudinary.uploader.destroy(row.publicId, { resource_type: row.resourceType ?? 'image', invalidate: true });
      }
      await media.deleteOne({ id: second });
      return null;
    }
  }

  // --- Records --------------------------------------------------------------
  if (area === 'records') {
    if (method === 'GET') {
      const kind = query.get('kind');
      // Enquiries hold personal data, so read-only viewers cannot open them.
      requireRole(user, kind === 'activity' ? 'viewer' : 'editor');
      if (!['enquiry', 'subscriber', 'activity'].includes(kind ?? '')) throw new HttpError(400, 'Unknown record type.');
      return (await records.find({ kind }, { projection: { _id: 0 } }).sort({ createdAt: -1 }).limit(1000).toArray());
    }
    if (method === 'PUT') {
      requireRole(user, 'editor');
      const record = await readBody(req);
      if (typeof record.id !== 'string' || !['enquiry', 'subscriber', 'activity'].includes(record.kind)) throw new HttpError(400, 'Invalid record.');
      await records.updateOne({ id: record.id }, { $set: record }, { upsert: true });
      return null;
    }
    if (method === 'DELETE') {
      requireRole(user, 'editor');
      await records.deleteOne({ id: second });
      return null;
    }
  }

  if (area === 'usage' && method === 'GET') {
    requireRole(user, 'viewer');
    const stored = await docs.find({}).toArray();
    const documentBytes = stored.reduce((sum, row) => sum + JSON.stringify(row.document).length, 0);
    const uploads = await media.find({ origin: 'upload' }, { projection: { size: 1 } }).toArray();
    const mediaBytes = uploads.reduce((sum, row) => sum + (row.size ?? 0), 0);
    return { documentBytes, mediaBytes, usedBytes: documentBytes + mediaBytes, quotaBytes: 0 };
  }

  throw new HttpError(404, 'Not found.');
}

export async function handleCmsRequest(req: IncomingMessage, res: ServerResponse) {
  const url = new URL(req.url ?? '/', 'http://localhost');
  const path = url.searchParams.get('path') ?? url.pathname.replace(/^\/api\/cms\/?/, '');
  url.searchParams.delete('path');
  const send = (status: number, body: unknown) => {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.end(JSON.stringify(body));
  };
  try {
    const result = await route(req, res, req.method ?? 'GET', path, url.searchParams);
    send(200, result ?? null);
  } catch (err) {
    if (err instanceof HttpError) {
      send(err.status, { error: err.message });
    } else {
      console.error('CMS API error:', err);
      // Internal details such as connection strings never reach the browser.
      send(500, { error: 'The server could not complete this request.' });
    }
  }
}
