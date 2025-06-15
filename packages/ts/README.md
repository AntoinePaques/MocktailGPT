# @mocktailgpt/ts

CLI tool scaffold for generating TypeScript clients from OpenAPI with MSW mocks.

## Configuration

Create a `mocktail.config.ts` at the root of your project:

```ts
import { defineMocktailConfig } from '@mocktailgpt/ts';

export default defineMocktailConfig({
  swagger: './swagger.yaml',
  output: './src/api/generated',
  mock: true,
});
```

Load it in your scripts with:

```ts
import { loadConfig } from '@mocktailgpt/ts';

const config = await loadConfig('./mocktail.config.ts');
```

`loadConfig` will throw a readable error if the file does not exist or if the
configuration fails validation.

### Generate an Orval configuration

With the validated config you can create a `.mocktail/orval.temp.config.ts` for programmatic usage:

```ts
import { generateOrvalConfig } from '@mocktailgpt/ts';

const orvalConfigPath = generateOrvalConfig(config);
// orvalConfigPath points to .mocktail/orval.temp.config.ts
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
to scaffold a `mocktail.config.ts` from a Swagger file:

```bash
mocktail init --swagger ./swagger.yaml
```

It also creates an
`.mocktail/orval.temp.config.ts` in the current directory and runs Orval programmatically.
After Orval completes it also generates helper files in the output directory:

- `index.ts` that re-exports all generated modules
- `msw.ts` exposing a `handlers` array from the mocks
- `mockServiceWorker.js` starting an MSW worker

You can pass `-c` or `--config` to use a custom Orval configuration path:

```bash
npx mocktail generate --config ./mocktail.config.ts -c ./.mocktail/orval.temp.config.ts
```

## Development

Available scripts:

```bash
pnpm build         # compile TypeScript
pnpm clean         # remove build output and generated config
pnpm dev           # clean then build
```

Formatting and linting are handled from the repository root with `pnpm format` and `pnpm lint`.
Installing dependencies will run `pnpm prepare` to set up Husky at the root.
The pre-commit hook formats and lints staged files via `lint-staged`.
