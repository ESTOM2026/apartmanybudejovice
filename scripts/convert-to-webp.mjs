// Converts all JPEGs in public/images/ to WebP format.
// Keeps original JPEGs as fallback for older browsers.
// Usage: node scripts/convert-to-webp.mjs
//
// WebP gives 25-35% smaller files than JPEG with same visual quality.

import sharp from 'sharp';
import { readdir, stat, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

const QUALITY = 82; // WebP quality (80-85 is sweet spot)

const targets = [
  join(projectRoot, 'public/images/hero.jpg'),
  join(projectRoot, 'public/images/gallery'),
  join(projectRoot, 'public/images/og-default.jpg'),
];

async function* walkJpegs(path) {
  let stats;
  try { stats = await stat(path); } catch { return; }

  if (stats.isDirectory()) {
    for (const name of await readdir(path)) {
      if (name.startsWith('_') || name.startsWith('.')) continue;
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
    const webpPath = file.replace(/\.jpe?g$/i, '.webp');

    const buffer = await sharp(file)
      .rotate()
      .webp({ quality: QUALITY, effort: 6 }) // effort 6 = best compression (slower but worth it)
      .toBuffer();

    await writeFile(webpPath, buffer);

    const after = buffer.length;
    totalBefore += before;
    totalAfter += after;
    count++;

    const saved = ((1 - after / before) * 100).toFixed(0);
    const rel = file.replace(projectRoot + '\\', '').replace(projectRoot + '/', '');
    console.log(`  ${rel.padEnd(38)} ${fmt(before).padStart(10)}  →  ${fmt(after).padStart(10)} WebP  (-${saved}%)`);
  }
}

console.log('');
console.log(`Converted ${count} files to WebP.`);
console.log(`Total: ${fmt(totalBefore)} JPEG  →  ${fmt(totalAfter)} WebP  (saved ${fmt(totalBefore - totalAfter)}, -${((1 - totalAfter / totalBefore) * 100).toFixed(0)}%)`);
console.log('');
console.log('Original JPEGs preserved as fallback. Use <picture> element to serve both.');
