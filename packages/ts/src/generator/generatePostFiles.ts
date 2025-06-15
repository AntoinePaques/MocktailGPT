import { readdir, writeFile } from 'fs/promises';
import { join, relative } from 'path';
import { formatWithPrettier } from '../utils/formatWithPrettier';

async function collectTsFiles(dir: string, base: string = dir): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectTsFiles(fullPath, base)));
    } else if (
      entry.isFile() &&
      entry.name.endsWith('.ts') &&
      entry.name !== 'index.ts' &&
      entry.name !== 'msw.ts'
    ) {
      files.push(relative(base, fullPath).replace(/\\/g, '/'));
    }
  }
  return files;
}

async function collectMswFiles(dir: string, base: string = dir): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectMswFiles(fullPath, base)));
    } else if (entry.isFile() && entry.name.endsWith('.msw.ts') && entry.name !== 'msw.ts') {
      files.push(relative(base, fullPath).replace(/\\/g, '/'));
    }
  }
  return files;
}

export async function generatePostFiles(baseDir: string) {
  const files = await collectTsFiles(baseDir);
  const exportLines = files
    .map((file) => `export * from './${file.replace(/\.ts$/, '')}';`)
    .join('\n');
  const indexPath = join(baseDir, 'index.ts');
  await writeFile(indexPath, exportLines + '\n');

  const mswFiles = await collectMswFiles(baseDir);
  const imports = mswFiles
    .map((file, i) => `import { handlers as h${i} } from './${file.replace(/\.ts$/, '')}';`)
    .join('\n');
  const handlersArray = mswFiles.map((_f, i) => `...h${i}`).join(', ');
  const mswContent = `${imports}\n\nexport const handlers = [${handlersArray}];\n`;
  const mswPath = join(baseDir, 'msw.ts');
  await writeFile(mswPath, mswContent);

  const workerContent =
    "import { setupWorker } from 'msw';\n" +
    "import { handlers } from './msw';\n" +
    'export const worker = setupWorker(...handlers);\n';
  await writeFile(join(baseDir, 'mockServiceWorker.js'), workerContent);

  await formatWithPrettier(indexPath);
  await formatWithPrettier(mswPath);
}
