import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

export async function formatWithPrettier(filePath: string) {
  try {
    const prettier = await import('prettier');
    const resolved = resolve(filePath);
    const content = readFileSync(resolved, 'utf8');
    const formatted = await prettier.format(content, { filepath: resolved });
    writeFileSync(resolved, formatted);
  } catch {
    // Prettier not installed
  }
}
