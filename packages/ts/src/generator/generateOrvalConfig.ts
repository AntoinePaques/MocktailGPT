import { writeFile } from 'fs/promises';
import { join, resolve } from 'path';
import { createRequire } from 'module';
import type { Config } from '../config/types';
import { formatWithPrettier } from '../utils/formatWithPrettier';

const require = createRequire(import.meta.url);

export type OrvalConfigObject = Record<string, unknown>;

export function getOrvalConfigObject(config: Config): OrvalConfigObject {
  const apiName = config.projectName ?? '';
  let mutatorPath: string | undefined;
  try {
    mutatorPath = require.resolve('../logic/mutators/globalMutatorFactory.ts');
  } catch {
    console.warn('⚠️ No globalMutatorFactory found, skipping custom mutator.');
  }
  return {
    [apiName]: {
      input: config.input,
      output: {
        target: join(config.output, 'client.ts'),
        schemas: join(config.output, 'model'),
        client: 'fetch',
        mock: config.mock,
      },
      ...(mutatorPath ? { mutator: { path: mutatorPath, name: 'globalMutator' } } : {}),
    },
  };
}

export async function writeOrvalConfig(config: OrvalConfigObject): Promise<string> {
  const filePath = resolve(process.cwd(), 'mocktail.orval.config.ts');
  const content = `export default ${JSON.stringify(config, null, 2)}\n`;
  await writeFile(filePath, content);
  await formatWithPrettier(filePath);
  return filePath;
}

export async function generateOrvalConfig(config: Config): Promise<string> {
  const orvalConfig = getOrvalConfigObject(config);
  return writeOrvalConfig(orvalConfig);
}
