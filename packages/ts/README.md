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

## CLI

Run the generator directly from your terminal:

```bash
npx mocktail generate --config ./mocktail.config.ts
```
