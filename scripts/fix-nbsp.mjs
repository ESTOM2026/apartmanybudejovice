// Inserts NBSP between Czech prepositions and following word
import { readFile, writeFile } from 'node:fs/promises';

const file = 'src/i18n/ui.ts';
let content = await readFile(file, 'utf8');

const NBSP = String.fromCharCode(0xA0); // explicit U+00A0

// Replace 'byt k pronájmu v Českých' with NBSP versions
const before = 'byt k pronájmu v Českých Budějovicích';
const after = `byt k${NBSP}pronájmu v${NBSP}Českých Budějovicích`;

const count = (content.match(new RegExp(before, 'g')) || []).length;
console.log(`Found ${count} occurrences of pattern.`);

if (count === 0) {
  console.error('Pattern not found!');
  process.exit(1);
}

content = content.replaceAll(before, after);

await writeFile(file, content);

// Verify NBSP is present
const verify = await readFile(file, 'utf8');
const buf = Buffer.from(verify);
let nbspCount = 0;
for (let i = 0; i < buf.length - 1; i++) {
  // UTF-8 encoding of U+00A0 is C2 A0
  if (buf[i] === 0xC2 && buf[i+1] === 0xA0) nbspCount++;
}
console.log(`NBSP (U+00A0) characters in file: ${nbspCount}`);
