import { writeFileSync } from 'fs';
import { join, resolve, dirname, parse } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import type { Config } from '../config/types';

const require = createRequire(import.meta.url);

export function getOrvalConfigObject(config: Config) {
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

export function generateOrvalConfig(config: Config): string {
  const orvalConfig = getOrvalConfigObject(config);
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const filePath = resolve(__dirname, '../../orval.config.js');
  const content = `module.exports = ${JSON.stringify(orvalConfig, null, 2)}\n`;
  writeFileSync(filePath, content);
  return filePath;
}
