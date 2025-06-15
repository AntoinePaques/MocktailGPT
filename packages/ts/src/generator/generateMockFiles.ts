import { readdir, mkdir, copyFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join, relative, dirname } from 'path';
import { formatWithPrettier } from '../utils/formatWithPrettier';

async function findMswFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await findMswFiles(full)));
    } else if (entry.isFile() && entry.name.endsWith('.msw.ts')) {
      files.push(full);
    }
  }
  return files;
}

export async function generateMockFiles(outputDir: string, publicDir: string) {
  const mswFiles = await findMswFiles(outputDir);
  if (mswFiles.length === 0) {
    return;
  }

  const imports: string[] = [];
  const spreads: string[] = [];
  mswFiles.forEach((file, idx) => {
    const rel = relative(outputDir, file).replace(/\\/g, '/').replace(/\.ts$/, '');
    const varName = `handlers${idx}`;
    imports.push(`import { handlers as ${varName} } from './${rel}';`);
    spreads.push(`...${varName}`);
  });
  const content = `${imports.join('\n')}\n\nexport const handlers = [${spreads.join(', ')}];\n`;
  const mswPath = join(outputDir, 'msw.ts');
  await writeFile(mswPath, content);
  await formatWithPrettier(mswPath);

  const workerSource = require.resolve('msw/lib/mockServiceWorker.js');
  const workerDest = join(publicDir, 'mockServiceWorker.js');
  if (!existsSync(workerDest)) {
    await mkdir(dirname(workerDest), { recursive: true });
    await copyFile(workerSource, workerDest);
  }
}
