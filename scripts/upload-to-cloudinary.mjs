import fs from 'node:fs';
import path from 'node:path';
import dns from 'node:dns';
import { v2 as cloudinary } from 'cloudinary';
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

cloudinary.config(true);

console.log('Cloudinary Config:', {
  cloud_name: cloudinary.config().cloud_name,
  api_key: cloudinary.config().api_key ? '***' : undefined,
});

// All UI images in public/
const publicDir = path.resolve('public');

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, fileList);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.webp', '.svg'].includes(ext)) {
        // Skip the 31MB uncompressed founder.png since founder.jpg is used
        if (file === 'founder.png') continue;
        fileList.push(fullPath);
      }
    }
  }
  return fileList;
}

const allImageFiles = getAllFiles(publicDir);
console.log(`Found ${allImageFiles.length} images to upload.`);

const mapping = {};
const mediaRecords = [];

for (let i = 0; i < allImageFiles.length; i++) {
  const filePath = allImageFiles[i];
  const relativePath = '/' + path.relative(publicDir, filePath).replace(/\\/g, '/');
  
  // Determine folder and public_id
  const parts = relativePath.replace(/^\//, '').split('/');
  const filename = parts.pop();
  const nameWithoutExt = filename.replace(/\.[^.]+$/, '');
  const subFolder = parts.length > 0 ? parts.join('/') : 'misc';
  const folder = `knowza/${subFolder}`;

  console.log(`[${i + 1}/${allImageFiles.length}] Uploading ${relativePath} to ${folder}/${nameWithoutExt}...`);

  try {
    const res = await cloudinary.uploader.upload(filePath, {
      folder,
      public_id: nameWithoutExt,
      overwrite: true,
      resource_type: 'auto',
    });

    const secureUrl = res.secure_url;
    mapping[relativePath] = secureUrl;
    console.log(`  -> URL: ${secureUrl}`);

    mediaRecords.push({
      id: `cloud-${nameWithoutExt}`,
      ref: `media:cloud-${nameWithoutExt}`,
      origin: 'upload',
      name: filename,
      kind: 'image',
      mime: res.format ? `image/${res.format}` : 'image/jpeg',
      size: res.bytes || fs.statSync(filePath).size,
      width: res.width,
      height: res.height,
      alt: nameWithoutExt.replace(/[-_]/g, ' '),
      caption: '',
      category: parts[0] || 'general',
      url: secureUrl,
      publicId: res.public_id,
      resourceType: 'image',
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error(`  Failed to upload ${relativePath}:`, err.message || err);
  }
}

// Map founder.png to founder.jpg url as fallback
if (mapping['/founder.jpg']) {
  mapping['/founder.png'] = mapping['/founder.jpg'];
}

// Save mapping file
const mappingPath = path.resolve('src/cms/cloudinaryMapping.json');
fs.writeFileSync(mappingPath, JSON.stringify(mapping, null, 2), 'utf8');
console.log(`Saved Cloudinary mapping to ${mappingPath}`);

// Update MongoDB documents
if (process.env.MONGODB_URI) {
  console.log('Connecting to MongoDB to update documents and media collections...');
  const client = new MongoClient(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
  await client.connect();
  const db = client.db(process.env.MONGODB_DB || 'knowza_cms');

  // Helper to recursively replace all local paths with Cloudinary URLs in documents
  function replaceUrls(obj) {
    if (!obj || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) {
      return obj.map(replaceUrls);
    }
    const result = {};
    for (const [key, val] of Object.entries(obj)) {
      if (typeof val === 'string') {
        if (mapping[val]) {
          result[key] = mapping[val];
        } else {
          // Check if string contains any of the mapped paths
          let updated = val;
          for (const [localPath, cloudUrl] of Object.entries(mapping)) {
            if (updated === localPath) {
              updated = cloudUrl;
              break;
            }
          }
          result[key] = updated;
        }
      } else if (typeof val === 'object' && val !== null) {
        result[key] = replaceUrls(val);
      } else {
        result[key] = val;
      }
    }
    return result;
  }

  const docsCol = db.collection('documents');
  for (const stage of ['published', 'draft']) {
    const docRow = await docsCol.findOne({ _id: stage });
    if (docRow && docRow.document) {
      const updatedDoc = replaceUrls(docRow.document);
      await docsCol.updateOne(
        { _id: stage },
        { $set: { document: updatedDoc, updatedAt: new Date(), updatedBy: 'cloudinary-migration' } }
      );
      console.log(`Updated ${stage} document in MongoDB with Cloudinary URLs.`);
    }
  }

  // Populate media collection
  const mediaCol = db.collection('media');
  for (const record of mediaRecords) {
    await mediaCol.updateOne({ id: record.id }, { $set: record }, { upsert: true });
  }
  console.log(`Upserted ${mediaRecords.length} records into media collection.`);

  await client.close();
  console.log('MongoDB updates completed successfully.');
}

console.log('ALL IMAGES PROPERLY MIGRATED TO CLOUDINARY!');
