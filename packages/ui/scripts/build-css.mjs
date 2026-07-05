// Concatenates the source stylesheets into dist/styles.css in cascade order.
// Order matters: tokens (custom properties) → base (reset/keyframes) → components.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(root, '..', 'src', 'styles');
const dist = path.join(root, '..', 'dist');

const order = ['tokens.css', 'base.css', 'components.css'];

const chunks = await Promise.all(
  order.map(async (name) => {
    const css = await readFile(path.join(src, name), 'utf8');
    return `/* ---- ${name} ---- */\n${css}`;
  }),
);

await mkdir(dist, { recursive: true });
await writeFile(path.join(dist, 'styles.css'), chunks.join('\n'), 'utf8');
console.log(`[build-css] wrote dist/styles.css (${order.join(' + ')})`);
