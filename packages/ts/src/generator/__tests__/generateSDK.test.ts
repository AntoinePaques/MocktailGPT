import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mkdtemp, writeFile, rm, access, readFile } from 'fs/promises';
import { tmpdir } from 'os';
import { join, resolve } from 'path';
import type { Config } from '../../config/types';
import { generateSDKFromConfig } from '../generateSDKFromConfig';

const runCLIMock = vi.fn().mockResolvedValue(undefined);
vi.mock('orval', () => ({ runCLI: runCLIMock }));

describe('generateSDKFromConfig integration', () => {
  let tmp: string;

  beforeEach(async () => {
    tmp = await mkdtemp(join(tmpdir(), 'mocktail-'));
    await writeFile(join(tmp, 'swagger.yaml'), '');
  });

  afterEach(async () => {
    await rm(tmp, { recursive: true, force: true });
    await rm(resolve(process.cwd(), 'mocktail.orval.config.ts'), { force: true });
  });

  it('calls orval, injects mutator and generates files', async () => {
    const config: Config = {
      input: join(tmp, 'swagger.yaml'),
      output: join(tmp, 'out'),
      projectName: 'api',
      mock: false,
    };

    await generateSDKFromConfig(config);

    expect(runCLIMock).toHaveBeenCalled();
    const orvalPath = runCLIMock.mock.calls[0][0] as string;
    const content = await readFile(orvalPath, 'utf8');
    expect(content).toMatch('mutator');

    await expect(access(join(config.output, 'msw.ts'))).resolves.toBeUndefined();
    await expect(access(join(config.output, 'index.ts'))).resolves.toBeUndefined();
  });
});
