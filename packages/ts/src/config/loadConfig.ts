import { resolve } from 'path';
import { existsSync } from 'fs';
import { ZodError } from 'zod';
import { tsImport as baseImport } from 'tsx';
import { tsImport as fallbackImport } from 'tsx/esm/api';

const tsImport = baseImport ?? fallbackImport;
import { MocktailConfigSchema } from './schema';
import type { Config } from './types';

export async function loadConfig(configPath = './mocktail.config.ts'): Promise<Config> {
  const resolvedPath = resolve(configPath);
  if (!existsSync(resolvedPath)) {
    console.warn(`Config file not found at ${configPath}, using defaults`);
    return MocktailConfigSchema.parse({});
  }
  try {
    const mod = (await tsImport(resolvedPath, import.meta.url)) as {
      default?: unknown;
    };
    const rawConfig = mod.default ?? mod;
    const parsed = MocktailConfigSchema.safeParse(rawConfig);
    if (!parsed.success) {
      throw new Error(`Invalid config: ${JSON.stringify(parsed.error.format(), null, 2)}`);
    }
    return parsed.data;
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(`Invalid config: ${JSON.stringify(error.format(), null, 2)}`);
    }
    const msg = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to load config at ${configPath}: ${msg}`);
  }
}
