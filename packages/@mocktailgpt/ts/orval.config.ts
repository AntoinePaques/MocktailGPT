// ./orval.config.ts
import { defineConfig } from 'orval';
import { globalMutator } from './src/api/mutators/globalMutator';
import { globalMockMutator } from './src/api/mutators/globalMutatorMock';

export default defineConfig({
  VanScrapper: {
    input: { target: process.env.SWAGGER_PATH || './src/vanScrapper.yaml' },
    output: {
      mode: 'split',
      client: 'fetch',
      target: './src/api/generated/',
      schemas: './src/api/generated/models',
      prettier: true,
      mock: true,
      override: {
        operations: {
          '*': {
            mutator: globalMutator,
            mock: {
              properties: globalMockMutator,
              delay: 250,
            },
          },
        },
      },
    },
    hooks: {
      afterAllFilesWrite: 'prettier --write',
    },
  },
});
