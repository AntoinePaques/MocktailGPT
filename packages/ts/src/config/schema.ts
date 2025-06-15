import { z } from 'zod';

export const schema = z.object({
  swagger: z.string(),
  output: z.string(),
  mock: z.boolean().optional().default(false),
  customMutators: z.boolean().optional().default(false),
  postFiles: z
    .object({
      enabled: z.boolean(),
      output: z.string().optional(),
    })
    .optional(),
});
