// Generates a 2x2 collage from hero images.
// Output: public/collage-1600x1200.jpg

import sharp from 'sharp';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

const SOURCES = [
  'public/images/gallery/01.jpg',  // top-left: red sofa
  'public/images/gallery/02.jpg',  // top-right: LEGO display
  'public/images/gallery/13.jpg',  // bottom-left: toys/LEGO
  'public/images/gallery/24.jpeg', // bottom-right: bedroom (new)
];

const TOTAL_WIDTH = 1600;
const TOTAL_HEIGHT = 1200;
const GAP = 8; // px between tiles
const CELL_WIDTH = (TOTAL_WIDTH - GAP) / 2;   // 796
const CELL_HEIGHT = (TOTAL_HEIGHT - GAP) / 2; // 596

console.log(`Creating ${TOTAL_WIDTH}×${TOTAL_HEIGHT} collage with ${CELL_WIDTH}×${CELL_HEIGHT} cells...\n`);

// Process each image: resize + crop to cell size
const tiles = await Promise.all(
  SOURCES.map((src, i) => {
    const path = join(projectRoot, src);
    return sharp(path)
      .rotate() // honor EXIF
      .resize(Math.round(CELL_WIDTH), Math.round(CELL_HEIGHT), {
        fit: 'cover',
        position: 'center',
      })
      .toBuffer()
      .then((buf) => {
        console.log(`  ${i + 1}. ${src.split('/').pop()} → ${Math.round(CELL_WIDTH)}×${Math.round(CELL_HEIGHT)}`);
        return buf;
      });
  })
);

// Compose 2x2 with gaps on white background
const composite = await sharp({
  create: {
    width: TOTAL_WIDTH,
    height: TOTAL_HEIGHT,
    channels: 3,
    background: { r: 255, g: 255, b: 255 },
  },
})
  .composite([
    { input: tiles[0], left: 0, top: 0 },
    { input: tiles[1], left: Math.round(CELL_WIDTH) + GAP, top: 0 },
    { input: tiles[2], left: 0, top: Math.round(CELL_HEIGHT) + GAP },
    { input: tiles[3], left: Math.round(CELL_WIDTH) + GAP, top: Math.round(CELL_HEIGHT) + GAP },
  ])
  .jpeg({ quality: 88, mozjpeg: true, progressive: true })
  .toBuffer();

const outPath = join(projectRoot, 'public/collage-1600x1200.jpg');
await (await import('node:fs/promises')).writeFile(outPath, composite);

const sizeKB = (composite.length / 1024).toFixed(0);
console.log(`\nSaved: ${outPath}`);
console.log(`Size:  ${TOTAL_WIDTH}×${TOTAL_HEIGHT} px, ${sizeKB} KB`);
