import { describe, it, expect, vi, type Mock } from 'vitest';
  globalThis.oraStart = start as unknown as Mock<unknown[], unknown>;
      clientName: 'client',
      clientName: 'client',
import { describe, expect, it, vi } from 'vitest';
import type { Config } from '../config/types';
import { generateSDKFromConfig } from '../generator/generateSDKFromConfig';
declare global {
  var oraStart: ReturnType<typeof vi.fn> | undefined;
  var oraSucceed: ReturnType<typeof vi.fn> | undefined;
}

vi.mock('../generator/generateOrvalConfig', () => ({
  generateOrvalConfig: vi.fn(async () => 'mock-orval.temp.config.ts'),
}));

vi.mock('../generator/generatePostFiles', () => ({
  generatePostFiles: vi.fn(),
}));

vi.mock('../generator/generateMockFiles', () => ({
  generateMockFiles: vi.fn(),
}));

const runCLIMock = vi.fn().mockResolvedValue(undefined);
vi.mock('orval', () => ({ runCLI: runCLIMock }));

vi.mock('ora', () => {
  const succeed = vi.fn();
  const fail = vi.fn();
  const start = vi.fn(() => ({ succeed, fail }));
  globalThis.oraStart = start as unknown as Mock<any[], unknown>;
  globalThis.oraSucceed = succeed;
  return { default: () => ({ start, succeed, fail }) };
});

describe('generateSDKFromConfig', () => {
  it('runs orval and updates spinner', async () => {
    const config: Config = {
      input: './mocktail.yaml',
      output: './generated',
      projectName: 'test-project',
      clientName: 'client',
      mock: false,
      postFiles: {
        enabled: true,
      },
    };

    const { generatePostFiles } = await import('../generator/generatePostFiles');

    await generateSDKFromConfig(config);

    const start = globalThis.oraStart!;
    const succeed = globalThis.oraSucceed!;

    expect(start).toHaveBeenCalled();
    expect(runCLIMock).toHaveBeenCalledWith('mock-orval.temp.config.ts');
    expect(generatePostFiles).toHaveBeenCalledWith(
      resolve(process.cwd(), config.output),
      resolve(process.cwd(), config.output),
    );
    expect(succeed).toHaveBeenCalledWith('✅ SDK generated for swagger');
  });

  it('generates mocks when enabled', async () => {
    const config: Config = {
      input: './mocktail.yaml',
      output: './generated',
      projectName: 'test-project',
      clientName: 'client',
      mock: true,
    };

    const { generateMockFiles } = await import('../generator/generateMockFiles');

    await generateSDKFromConfig(config);

    expect(generateMockFiles).toHaveBeenCalledWith(
      resolve(process.cwd(), config.output),
      resolve(process.cwd(), 'public'),
    );
  });
});
