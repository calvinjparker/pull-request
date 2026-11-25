// Validates every play file. Runs before each build (see package.json "prebuild").
import { readdir } from 'node:fs/promises';
import { pathToFileURL, fileURLToPath } from 'node:url';
import path from 'node:path';
import { validateAll } from '../src/validate.js';

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '../src/plays');
const files = (await readdir(dir)).filter((f) => f.endsWith('.js') && f !== 'index.js');
const plays = [];
for (const f of files) plays.push((await import(pathToFileURL(path.join(dir, f)))).default);

const errs = validateAll(plays);
if (errs.length) {
  console.error(`✗ ${errs.length} problem(s) in plays:\n  ` + errs.join('\n  '));
  process.exit(1);
}
console.log(`✓ ${plays.length} plays OK`);
