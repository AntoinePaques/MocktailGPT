import { dirname, resolve } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
await import(pathToFileURL(resolve(root, 'fix-import-extensions.mjs')).href);
