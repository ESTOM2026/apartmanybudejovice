// Optimizes all photos in public/images/ in-place.
// Usage: node scripts/optimize-images.mjs
//
// What it does:
// - Resizes longer side to MAX_DIMENSION px (does NOT enlarge smaller images)
// - Honors EXIF orientation (important for iPhone photos that look rotated)
// - Re-encodes as JPEG with mozjpeg (much better compression than libjpeg)
// - Strips metadata (EXIF, GPS) — privacy + smaller files
// - Overwrites originals (uses temp file then atomic rename)
//
// Tweak MAX_DIMENSION / QUALITY at the top.

import sharp from 'sharp';
import { readdir, stat, writeFile, rename, unlink } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

const MAX_DIMENSION = 1800;   // px on longer side — sharp on retina, small enough on mobile
const QUALITY = 80;           // 78–82 is the sweet spot for photos

const targets = [
  join(projectRoot, 'public/images/hero.jpg'),
  join(projectRoot, 'public/images/gallery'),
  join(projectRoot, 'public/images/og-default.jpg'), // optional, ignored if missing
];

async function* walkJpegs(path) {
  let stats;
  try { stats = await stat(path); } catch { return; }

  if (stats.isDirectory()) {
    for (const name of await readdir(path)) {
      if (name.startsWith('_') || name.startsWith('.')) continue; // skip _unused, .gitkeep
      yield* walkJpegs(join(path, name));
    }
  } else if (/\.jpe?g$/i.test(path)) {
    yield path;
  }
}

function fmt(bytes) {
  if (bytes > 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  return `${(bytes / 1024).toFixed(0)} KB`;
}

let totalBefore = 0;
let totalAfter = 0;
let count = 0;

for (const target of targets) {
  for await (const file of walkJpegs(target)) {
    const before = (await stat(file)).size;
    const tmp = file + '.tmp';

    const buffer = await sharp(file)
      .rotate() // honor EXIF orientation, then bake it in
      .resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: QUALITY, mozjpeg: true, progressive: true })
      .withMetadata({ orientation: 1 }) // strip everything but normalized orientation
      .toBuffer();

    await writeFile(tmp, buffer);
    await rename(tmp, file);

    const after = buffer.length;
    totalBefore += before;
    totalAfter += after;
    count++;

    const saved = ((1 - after / before) * 100).toFixed(0);
    console.log(`  ${file.replace(projectRoot + '\\', '').replace(projectRoot + '/', '').padEnd(38)} ${fmt(before).padStart(10)}  →  ${fmt(after).padStart(10)}  (-${saved}%)`);
  }
}

console.log('');
console.log(`Optimized ${count} files.`);
console.log(`Total:    ${fmt(totalBefore)}  →  ${fmt(totalAfter)}  (saved ${fmt(totalBefore - totalAfter)}, -${((1 - totalAfter / totalBefore) * 100).toFixed(0)}%)`);
