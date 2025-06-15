import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  vi,
  type Mock,
  type SpyInstance,
} from 'vitest';
import { mkdtemp, rm, readFile } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import { initConfig } from '../init';

vi.mock('../utils/formatWithPrettier', () => ({ formatWithPrettier: vi.fn() }));
vi.mock('prompts', () => ({ default: vi.fn() }));

describe('initConfig', () => {
  let tmp: string;
  let cwdSpy: SpyInstance;
  let prompts: Mock;

  beforeEach(async () => {
    tmp = await mkdtemp(join(tmpdir(), 'mocktail-'));
    cwdSpy = vi.spyOn(process, 'cwd').mockReturnValue(tmp);
    prompts = (await import('prompts')).default as unknown as Mock;
  });

  afterEach(async () => {
    cwdSpy.mockRestore();
    await rm(tmp, { recursive: true, force: true });
  });

  it('creates config file from prompts', async () => {
    prompts.mockResolvedValue({
      input: './swagger.yaml',
      output: './src/api',
      projectName: 'demo',
      mock: true,
    });
    await initConfig();
    const content = await readFile(join(tmp, 'mocktail.config.ts'), 'utf8');
    expect(content).toMatch('projectName: \"demo\"');
  });

  it('creates default config with --yes', async () => {
    prompts.mockResolvedValue({});
    await initConfig(['--yes']);
    const content = await readFile(join(tmp, 'mocktail.config.ts'), 'utf8');
    expect(content).toMatch('projectName: \"default\"');
  });
});
