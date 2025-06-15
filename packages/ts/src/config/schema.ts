import { z } from 'zod';

export const MocktailConfigSchema = z.object({
  input: z.string().optional().default('swagger.yaml'),
  output: z.string().optional().default('src/api'),
  projectName: z.string().optional().default('default'),
  mock: z.boolean().optional().default(true),
  postFiles: z
    .object({
      enabled: z.boolean(),
      output: z.string().optional(),
    })
    .optional(),
});

export type MocktailConfig = z.infer<typeof MocktailConfigSchema>;
