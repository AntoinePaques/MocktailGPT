# @mocktailgpt/ts

CLI tool scaffold for generating TypeScript clients from OpenAPI with MSW mocks.

## Configuration

Create a `mocktail.config.ts` at the root of your project:

```ts
import type { MocktailConfig } from '@mocktailgpt/ts';

const config: MocktailConfig = {
  input: 'swagger.yaml',
  output: 'src/api',
  projectName: 'default',
  mock: true,
  postFiles: {
    enabled: true,
    // output: '.', // optional path relative to `output`
  },
};

export default config;
```

Available options (all optional):

- `input` _(default: `'swagger.yaml'`)_ – path to the OpenAPI file
- `output` _(default: `'src/api'`)_ – destination folder for the generated SDK
- `projectName` _(default: `'default'`)_ – name used for the Orval entry
- `mock` _(default: `true`)_ – enable MSW mock generation
- `postFiles` – generate helper files (`index.ts`, `msw.ts`, `mockServiceWorker.js`)

Load it in your scripts with:

```ts
import { loadConfig } from '@mocktailgpt/ts';

const config = await loadConfig('./mocktail.config.ts');
```

`loadConfig` returns defaults when the file is missing and throws if the
configuration fails validation.

### Generate an Orval configuration

With the validated config you can create a `mocktail.orval.config.ts` for programmatic usage:

```ts
import { generateOrvalConfig } from '@mocktailgpt/ts';

const orvalConfigPath = await generateOrvalConfig(config);
// orvalConfigPath points to mocktail.orval.config.ts
// await generate(orvalConfigPath)
```

### Generate the SDK programmatically

If you prefer to run Orval directly, use `generateSDKFromConfig`:

```ts
import { generateSDKFromConfig } from '@mocktailgpt/ts';

await generateSDKFromConfig(config);
```

## CLI

Run the generator directly from your terminal. The CLI offers an `init` command
to scaffold a `mocktail.config.ts` from an OpenAPI file:

```bash
mocktail init --input ./swagger.yaml
```

It also creates a `mocktail.orval.config.ts` in the current directory and runs Orval programmatically.
If `postFiles.enabled` is true, helper files are generated after Orval:

- `index.ts` re-exporting the client, models and mocks
- `msw.ts` exposing a ready-to-use MSW `worker`
- `mockServiceWorker.js` copied from the `msw` package

Future versions may add extra helpers or type definitions.

## Development

Available scripts:

```bash
pnpm build         # compile TypeScript
pnpm clean         # remove build output and generated config
pnpm dev           # clean then build
pnpm generate      # run the CLI to generate the SDK
```

Formatting and linting are handled from the repository root with `pnpm format` and `pnpm lint`.
Installing dependencies will run `pnpm prepare` to set up Husky at the root.
The pre-commit hook formats and lints staged files via `lint-staged`.
