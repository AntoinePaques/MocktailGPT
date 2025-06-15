# @mocktailgpt/ts

CLI tool scaffold for generating TypeScript clients from OpenAPI with MSW mocks.

## Configuration

Create a `mocktail.config.ts` at the root of your project:

```ts
import { defineMocktailConfig } from '@mocktailgpt/ts'

export default defineMocktailConfig({
  swagger: './swagger.yaml',
  output: './src/api/generated',
  mock: true,
})
```

Load it in your scripts with:

```ts
import { loadConfig } from '@mocktailgpt/ts'

const config = await loadConfig('./mocktail.config.ts')
```

### Generate an Orval configuration

With the validated config you can create an `orval.config.js` for programmatic usage:

```ts
import { generateOrvalConfig } from '@mocktailgpt/ts'

const orvalConfigPath = generateOrvalConfig(config)
// then use it with orval
// await generate(orvalConfigPath)
```

## CLI

Run the generator directly from your terminal. The CLI will create an
`orval.config.js` in the current directory and run Orval programmatically:

```bash
npx mocktail generate --config ./mocktail.config.ts
```

## Development

Available scripts:

```bash
pnpm build         # compile TypeScript
pnpm clean         # remove build output and generated config
pnpm dev           # clean then build
pnpm format        # format source files
pnpm format:check  # check formatting
pnpm lint          # run ESLint
pnpm lint:fix      # fix lint issues
```

Installing dependencies will run `pnpm prepare` to set up Husky.
The pre-commit hook formats and lints staged files via `lint-staged`.
