import { resolve } from 'path';
import { existsSync } from 'fs';
import { ZodError } from 'zod';
import { tsImport } from 'tsx/api';
import { MocktailConfigSchema } from './schema';
import type { Config } from './types';

export async function loadConfig(configPath = './mocktail.config.ts'): Promise<Config> {
  const resolvedPath = resolve(configPath);
  if (!existsSync(resolvedPath)) {
    console.warn(`Config file not found at ${configPath}, using defaults`);
    return MocktailConfigSchema.parse({});
  }
  try {
    const mod = await tsImport(resolvedPath, import.meta.url);
    const rawConfig = mod.default ?? mod;
    return MocktailConfigSchema.parse(rawConfig);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(`Invalid config: ${JSON.stringify(error.format(), null, 2)}`);
    }
    const msg = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to load config at ${configPath}: ${msg}`);
  }
}
