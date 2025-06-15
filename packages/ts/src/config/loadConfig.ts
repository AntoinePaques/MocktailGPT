import { pathToFileURL } from 'url';
import { resolve } from 'path';
import { ZodError } from 'zod';
import { schema } from './schema';
import type { Config } from './types';

export async function loadConfig(configPath: string): Promise<Config> {
  const module = await import(pathToFileURL(resolve(configPath)).href);
  const rawConfig = module.default ?? module;
  try {
    return schema.parse(rawConfig);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(`Invalid config: ${JSON.stringify(error.format(), null, 2)}`);
    }
    throw error;
  }
}
