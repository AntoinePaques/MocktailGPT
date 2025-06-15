import { z } from 'zod';
import { schema } from './schema';

export type Config = z.infer<typeof schema>;
