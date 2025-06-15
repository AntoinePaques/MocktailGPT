# MocktailGPT Monorepo

This repository houses multiple packages for the MocktailGPT project.

## Packages

[@mocktailgpt/ts](packages/ts): CLI scaffold for generating TypeScript clients
with MSW mocks and a `mocktail` command line interface. The package can generate
a `mocktail.orval.config.ts`, run [Orval](https://orval.dev) either via the CLI
or programmatically with `generateSDKFromConfig`, and produce MSW mocks. When
`mock` is enabled, `msw.ts`, `index.ts` and `mockServiceWorker.js` are created in
the output directory.

The CLI offers an `init` command to interactively create a `mocktail.config.ts`.
Run it without flags to answer prompts, or pass `--yes` to generate a default
configuration:

```bash
mocktail init
# or non-interactive
mocktail init --yes
```

The configuration file supports the following options with defaults:

```ts
import type { MocktailConfig } from '@mocktailgpt/ts';

const config: MocktailConfig = {
  input: 'swagger.yaml',
  output: 'src/api',
  projectName: 'default',
  clientName: 'client',
  mock: true,
  // postFiles: { enabled: true },
};

export default config;
```

## Development

Standard tooling is configured at the repository root:

- Prettier for code formatting (`pnpm format`)
- ESLint with TypeScript support (`pnpm lint`)
- Shared TypeScript settings in `tsconfig.base.json`
- Husky pre-commit hook running lint-staged

See the package README for configuration details.

## Examples

A minimal React application demonstrating the Mocktail CLI is located in [example/vanScrapper](example/vanScrapper).
Run `pnpm install` and `pnpm dev` inside this directory to start the app with MSW mocks enabled.
Use `pnpm generate` to regenerate the API client from the provided OpenAPI spec.
