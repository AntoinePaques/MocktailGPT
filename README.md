# MocktailGPT Monorepo

This repository houses multiple packages for the MocktailGPT project.

## Packages

[@mocktailgpt/ts](packages/ts): CLI scaffold for generating TypeScript clients
with MSW mocks and a `mocktail` command line interface. The package can
generate a `mocktail.orval.config.ts`, run [Orval](https://orval.dev) (either via the
CLI or programmatically with `generateSDKFromConfig`), and create helper files
(`index.ts`, `msw.ts`, `mockServiceWorker.js` when `postFiles.enabled` is set).

The CLI also offers an `init` command to scaffold a `mocktail.config.ts` from an
OpenAPI file:

```bash
mocktail init --input ./path/to/swagger.yaml
```

The configuration file supports the following options with defaults:

```ts
import { defineMocktailConfig } from '@mocktailgpt/ts';

export default defineMocktailConfig({
  input: './swagger.yaml',
  output: './src/api',
  projectName: 'default',
  mock: true,
});
```

## Development

Standard tooling is configured at the repository root:

- Prettier for code formatting (`pnpm format`)
- ESLint with TypeScript support (`pnpm lint`)
- Shared TypeScript settings in `tsconfig.base.json`
- Husky pre-commit hook running lint-staged

See the package README for configuration details.
