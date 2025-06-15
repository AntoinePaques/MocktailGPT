import type { Config } from './config/types';
export { loadConfig } from './config/loadConfig';
export type { Config } from './config/types';
export { generateOrvalConfig } from './generator/generateOrvalConfig';
export { getOrvalConfigObject } from './generator/generateOrvalConfig';

export const defineMocktailConfig = <T extends Config>(config: T): T => config;
