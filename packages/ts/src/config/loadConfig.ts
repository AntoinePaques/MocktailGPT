import { resolve } from 'path';
import { existsSync } from 'fs';
import { ZodError } from 'zod';
import { tsImport } from 'tsx/api';
import { MocktailConfigSchema } from './schema';
import type { Config } from './types';

export async function loadConfig(configPath: string): Promise<Config> {
  const resolvedPath = resolve(configPath);
  if (!existsSync(resolvedPath)) {
    throw new Error(`Config file not found: ${configPath}`);
  }
  const module = await tsImport(resolvedPath, import.meta.url);
  const rawConfig = module.default ?? module;
  try {
    return MocktailConfigSchema.parse(rawConfig);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(`Invalid config: ${JSON.stringify(error.format(), null, 2)}`);
    }
    throw error instanceof Error ? error : new Error(String(error));
  }
}
