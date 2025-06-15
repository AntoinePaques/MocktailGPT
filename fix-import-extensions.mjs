import { promises as fs } from 'fs';
import { join, dirname, relative } from 'path';
import { fileURLToPath } from 'url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
let pkgDir = scriptDir;
try {
  await fs.access(join(pkgDir, 'src'));
} catch {
  pkgDir = join(scriptDir, 'packages/ts');
}

async function* walk(dir) {
  for await (const d of await fs.opendir(dir)) {
    const entry = join(dir, d.name);
    if (d.isDirectory()) {
      yield* walk(entry);
    } else if (d.isFile() && entry.endsWith('.ts')) {
      yield entry;
    }
  }
}

const extRe = /\.(?:js|ts|json)$/;
const patched = [];
for await (const file of walk(join(pkgDir, 'src'))) {
  const text = await fs.readFile(file, 'utf8');
  let updated = text.replace(/(from\s+['"])(\.{1,2}\/[^'"\n]+)(['"])/g, (m, p1, spec, p3) => {
    return p1 + (extRe.test(spec) ? spec : spec + '.js') + p3;
  });
  updated = updated.replace(
    /(import\(\s*['"])(\.{1,2}\/[^'"\n]+)(['"]\s*\))/g,
    (m, p1, spec, p3) => {
      return p1 + (extRe.test(spec) ? spec : spec + '.js') + p3;
    },
  );
  if (updated !== text) {
    await fs.writeFile(file, updated);
    patched.push(relative(process.cwd(), file));
  }
}

if (patched.length) {
  console.log('Patched files:');
  for (const f of patched) console.log(' -', f);
} else {
  console.log('No files patched.');
}
