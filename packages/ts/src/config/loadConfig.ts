import { pathToFileURL } from 'url';
import { resolve } from 'path';
import { existsSync } from 'fs';
import { ZodError } from 'zod';
import { schema } from './schema';
import type { Config } from './types';

export async function loadConfig(configPath: string): Promise<Config> {
  const resolvedPath = resolve(configPath);
  if (!existsSync(resolvedPath)) {
    throw new Error(`Config file not found: ${configPath}`);
  }
  const module = await import(pathToFileURL(resolvedPath).href);
  const rawConfig = module.default ?? module;
  try {
    return schema.parse(rawConfig);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(`Invalid config: ${JSON.stringify(error.format(), null, 2)}`);
    }
    throw error instanceof Error ? error : new Error(String(error));
  }
}
