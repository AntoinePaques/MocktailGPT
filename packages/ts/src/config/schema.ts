import { z } from 'zod';

export const MocktailConfigSchema = z
  .object({
    input: z.string().optional().default('swagger.yaml'),
    output: z.string().optional().default('src/api'),
    projectName: z.string().optional().default('default'),
    clientName: z.string().optional().default('client'),
    mock: z.boolean().optional().default(true),
    postFiles: z
      .object({
        enabled: z.boolean(),
        output: z.string().optional(),
      })
      .optional(),
  })
  .strict();

export type MocktailConfig = z.infer<typeof MocktailConfigSchema>;
