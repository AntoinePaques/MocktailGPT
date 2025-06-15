import { readdirSync, writeFileSync } from 'fs';
import { join, relative } from 'path';

function collectTsFiles(dir: string, base: string = dir): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      return collectTsFiles(fullPath, base);
    }
    if (
      entry.isFile() &&
      entry.name.endsWith('.ts') &&
      entry.name !== 'index.ts' &&
      entry.name !== 'msw.ts'
    ) {
      return [relative(base, fullPath).replace(/\\/g, '/')];
    }
    return [];
  });
}

export function generatePostFiles(baseDir: string) {
  const files = collectTsFiles(baseDir);
  const exportLines = files
    .map((file) => `export * from './${file.replace(/\.ts$/, '')}';`)
    .join('\n');
  writeFileSync(join(baseDir, 'index.ts'), exportLines + '\n');

  const mswContent =
    "import { handlers as defaultHandlers } from './default/default.msw';\n" +
    'export const handlers = [...defaultHandlers];\n';
  writeFileSync(join(baseDir, 'msw.ts'), mswContent);

  const workerContent =
    "import { setupWorker } from 'msw';\n" +
    "import { handlers } from './msw';\n" +
    'export const worker = setupWorker(...handlers);\n';
  writeFileSync(join(baseDir, 'mockServiceWorker.js'), workerContent);
}
