import { writeFileSync, mkdirSync } from 'fs';
import { join, resolve, parse } from 'path';
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
  const dir = resolve(process.cwd(), '.mocktail');
  mkdirSync(dir, { recursive: true });
  const filePath = join(dir, 'orval.temp.config.ts');
  const content = `export default ${JSON.stringify(orvalConfig, null, 2)}\n`;
  writeFileSync(filePath, content);
  return filePath;
}
