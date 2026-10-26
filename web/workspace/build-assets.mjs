// Generated outputs belong only to this concrete workspace bundle.
import { createHash } from 'node:crypto';
import { readFile, readdir, mkdir, writeFile, unlink } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
const names = (await readdir('dist')).sort();
if (names.join(',') !== 'workspace.css,workspace.js') throw new Error('Unexpected workspace chunks; retention contract must be reviewed');
const directory = '../../crates/hub/static/workspace';
await mkdir(directory, { recursive: true });
const entries = [];
for (const name of names) {
  const bytes = Buffer.concat([Buffer.from("/* Generated from web/workspace; do not edit. */\n"), await readFile(`dist/${name}`)]);
  const extension = name.endsWith('.js') ? 'js' : 'css';
  const hash = createHash('sha256').update(bytes).digest('hex');
  const file = name;
  const compressed = gzipSync(bytes, { level: 9 }).length;
  if (compressed > (extension === 'js' ? 250 : 100) * 1024) throw new Error('Initial 2D workspace exceeds proposed payload budget');
  await writeFile(`${directory}/${file}`, bytes);
  entries.push({ file, extension, sha256: hash, bytes: bytes.length, gzip: compressed });
}
for (const file of await readdir(directory)) {
  if (!entries.some((entry) => entry.file === file)) {
    if (!/^(?:[a-f0-9]{64}|workspace)\.(js|css)$/.test(file)) throw new Error('Unexpected file in owned generated directory');
    await unlink(`${directory}/${file}`);
  }
}
process.stdout.write(`Workspace assets ${JSON.stringify(entries)}\n`);
