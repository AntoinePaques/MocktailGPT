import { writeFile } from 'fs/promises';
import { join, resolve, parse } from 'path';
import { createRequire } from 'module';
import type { Config } from '../config/types';
import { formatWithPrettier } from '../utils/formatWithPrettier';

const require = createRequire(import.meta.url);

export type OrvalConfigObject = Record<string, unknown>;

export function getOrvalConfigObject(config: Config): OrvalConfigObject {
  const apiName = parse(config.swagger).name;
  return {
    [apiName]: {
      input: config.swagger,
      output: {
        target: join(config.output, 'client.ts'),
        schemas: join(config.output, 'model'),
        client: 'fetch',
        mock: config.mock,
      },
      mutator: {
        path: require.resolve('../logic/mutators/globalMutatorFactory.ts'),
        name: 'globalMutator',
      },
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
