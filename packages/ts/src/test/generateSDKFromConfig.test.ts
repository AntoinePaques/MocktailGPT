import { describe, it, expect, vi } from 'vitest';
import type { Config } from '../config/types';
import { generateSDKFromConfig } from '../generator/generateSDKFromConfig';

declare global {
  var oraStart: ReturnType<typeof vi.fn> | undefined;
  var oraSucceed: ReturnType<typeof vi.fn> | undefined;
}

vi.mock('../generator/generateOrvalConfig', () => ({
  generateOrvalConfig: vi.fn(() => 'mock-orval.temp.config.ts'),
}));

vi.mock('../generator/generatePostFiles', () => ({
  generatePostFiles: vi.fn(),
}));

const runCLIMock = vi.fn().mockResolvedValue(undefined);
vi.mock('orval', () => ({ runCLI: runCLIMock }));

vi.mock('ora', () => {
  const succeed = vi.fn();
  const fail = vi.fn();
  const start = vi.fn(() => ({ succeed, fail }));
  globalThis.oraStart = start;
  globalThis.oraSucceed = succeed;
  return { default: () => ({ start, succeed, fail }) };
});

describe('generateSDKFromConfig', () => {
  it('runs orval and updates spinner', async () => {
    const config: Config = {
      swagger: './swagger.yaml',
      output: './out',
      mock: false,
      customMutators: false,
    };

    await generateSDKFromConfig(config);

    const start = globalThis.oraStart!;
    const succeed = globalThis.oraSucceed!;

    expect(start).toHaveBeenCalled();
    expect(runCLIMock).toHaveBeenCalledWith(['--config', 'mock-orval.temp.config.ts']);
    expect(succeed).toHaveBeenCalledWith('✅ SDK generated for swagger');
  });
});
