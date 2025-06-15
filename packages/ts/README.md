# @mocktailgpt/ts

[![npm version](https://img.shields.io/npm/v/@mocktailgpt/ts?color=green&label=npm)](https://www.npmjs.com/package/@mocktailgpt/ts)
[![pnpm workspace](https://img.shields.io/badge/monorepo-pnpm-blueviolet)](https://pnpm.io)
[![ESM](https://img.shields.io/badge/esm-compatible-blue)](https://nodejs.org/api/esm.html)

> CLI tool scaffold for generating TypeScript clients from OpenAPI with MSW mocks.

## Configuration

Create a `mocktail.config.ts` at the root of your project:

```ts
import type { MocktailConfig } from '@mocktailgpt/ts';

const config: MocktailConfig = {
  input: 'swagger.yaml',
  output: 'src/api',
  projectName: 'default',
  clientName: 'client',
  mock: true,
  postFiles: {
    enabled: true,
};
export default config;
};

export default config;
```

Available options (all optional):

- `input` (default: `'swagger.yaml'`) – path to the OpenAPI file
- `output` (default: `'src/api'`) – destination folder for the generated SDK
- `projectName` (default: `'default'`) – name used for the Orval entry
- `clientName` (default: `'client'`) – name of the generated client file
- `mock` (default: `true`) – enable MSW mock generation
- `postFiles` – generate helper files (`index.ts`, `msw.ts`, `mockServiceWorker.js`)

Load it in your scripts with:

```ts
import { loadConfig } from '@mocktailgpt/ts';

const config = await loadConfig('./mocktail.config.ts');
```

`loadConfig` returns defaults when the file is missing and throws if the configuration fails validation.

## Generate an Orval configuration

```ts
import { generateOrvalConfig } from '@mocktailgpt/ts';

const orvalConfigPath = await generateOrvalConfig(config);
// orvalConfigPath points to mocktail.orval.config.ts
```

## Generate the SDK programmatically

```ts
import { generateSDKFromConfig } from '@mocktailgpt/ts';

await generateSDKFromConfig(config);
```

## CLI

```bash
mocktail init
mocktail init --yes
mocktail generate
```

When `mock` is enabled, `msw.ts`, `index.ts`, and `mockServiceWorker.js` are created inside the configured output directory. Existing files are left untouched.

## Example

See `example/vanScrapper/` for a working React + MSW + Swagger integration.

## Development

```bash
pnpm build         # compile TypeScript
pnpm clean         # remove build output and generated config
pnpm dev           # clean then build
pnpm generate      # run the CLI to generate the SDK
```

Formatting and linting are handled with:

```bash
pnpm format
pnpm lint
```

Installing dependencies will run `pnpm prepare` to set up Husky. The pre-commit hook formats and lints staged files via `lint-staged`.

## License

MIT © Antoine Paques
