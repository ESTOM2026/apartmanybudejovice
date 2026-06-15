// Re-compresses WebP files larger than threshold using lower quality + resize.
// Run after convert-to-webp.mjs to catch outliers.

import sharp from 'sharp';
import { readdir, stat, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

const SIZE_THRESHOLD = 150 * 1024; // 150 KB
const MAX_DIMENSION = 1600;        // Max longer side
const QUALITY = 75;                // Lower quality for big files

const galleryDir = join(projectRoot, 'public/images/gallery');

let totalBefore = 0;
let totalAfter = 0;
let count = 0;

const files = await readdir(galleryDir);
for (const name of files) {
  if (!name.endsWith('.webp')) continue;
  const file = join(galleryDir, name);
  const before = (await stat(file)).size;
  if (before < SIZE_THRESHOLD) continue;

  // Re-encode from the matching JPEG (better than re-encoding WebP)
  const jpgFile = file.replace(/\.webp$/, '.jpg');
  const sourceFile = await stat(jpgFile).then(() => jpgFile).catch(() => file);

  const buffer = await sharp(sourceFile)
    .rotate()
    .resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: QUALITY, effort: 6 })
    .toBuffer();

  await writeFile(file, buffer);

  const after = buffer.length;
  totalBefore += before;
  totalAfter += after;
  count++;

  const saved = ((1 - after / before) * 100).toFixed(0);
  console.log(`  ${name.padEnd(15)} ${(before/1024).toFixed(0)} KB  →  ${(after/1024).toFixed(0)} KB  (-${saved}%)`);
}

console.log('');
console.log(`Recompressed ${count} files. Saved ${((totalBefore - totalAfter) / 1024).toFixed(0)} KB.`);
