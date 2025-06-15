import { copyFile, writeFile } from 'fs/promises';
import { join, relative } from 'path';
import { formatWithPrettier } from '../utils/formatWithPrettier';

export async function generatePostFiles(generatedDir: string, outputDir: string) {
  const mswSource = require.resolve('msw/browser');
  const workerDest = join(outputDir, 'mockServiceWorker.js');
  await copyFile(mswSource, workerDest);

  const rel = relative(outputDir, generatedDir).replace(/\\/g, '/');
  const mswPath = join(outputDir, 'msw.ts');
  const mswContent =
    "import { setupWorker } from 'msw'\n" +
    `import { handlers } from './${rel ? rel + '/' : ''}client.msw'\n` +
    'export { handlers }\n' +
    'export const worker = setupWorker(...handlers)\n';
  await writeFile(mswPath, mswContent);

  const indexPath = join(outputDir, 'index.ts');
  const indexContent =
    `export * from './${rel ? rel + '/' : ''}client'\n` +
    `export * from './${rel ? rel + '/' : ''}model'\n` +
    "export * from './msw'\n";
  await writeFile(indexPath, indexContent);

  await formatWithPrettier(mswPath);
  await formatWithPrettier(indexPath);
  await formatWithPrettier(workerDest);
}
