import type { Config } from './config/types'
export { loadConfig } from './config/loadConfig'
export type { Config } from './config/types'

export const defineMocktailConfig = <T extends Config>(config: T): T => config
