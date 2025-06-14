# @mocktailgpt/ts

Mocktail generates a fully typed TypeScript SDK from a Swagger specification and provides mocking utilities out of the box. It is ideal for building clients that interact with OpenAI compatible APIs while remaining fully testable offline.

## Features

- **Swagger to client SDK** – create a thin client directly from your API description using Orval.
- **OpenAI typed wrapper** – automatically generate a wrapper exposing `ChatCompletion`, `Message` and other OpenAI completion models.
- **Automatic mocks** – generate `globalMockMutator.ts` and MSW handlers so your SDK can run without a backend.
- **Orval as peer dependency** – reuse your existing Orval installation to keep the generator lightweight.

## Installation

```bash
pnpm add -D @mocktailgpt/ts orval
```

Orval is required as a peer dependency and must be installed in your project.

## Quick start

Create a `mocktail.config.ts` next to your `swagger.yaml`:

```ts
export default {
  input: './swagger.yaml',
}
```

Run the generator:

```bash
mocktail generate
```

Set `msw: false` in `mocktail.config.ts` if you don't need MSW handlers.

### Generated structure

```
/generated
├─ client.ts               # SDK from your Swagger file
├─ sdk.ts                  # OpenAI typed SDK
├─ globalMutator.ts        # injects x-model, x-temperature, ...
├─ globalMockMutator.ts    # mocked implementation
├─ msw.ts                  # MSW handlers
├─ mockServiceWorker.js    # MSW worker script
└─ index.ts                # unified exports
```

### Example usage

```ts
import { search } from './generated/sdk'

const res = await search({ brand: 'Renault', model: 'Trafic' })
console.log(res.choices[0].message.content)
```

The request will automatically send vendor extensions such as `x-model` or `x-temperature`. If you supply your own mutator in `mocktail.config.ts`, it will be wrapped by `globalMutator.ts` so your custom logic runs first.

### globalMutator.ts snippet

```ts
export const globalMutator = async (config: RequestInit) => {
  // call custom mutator if any
  const baseConfig = await customMutator?.(config)
  return {
    ...baseConfig,
    headers: {
      ...(baseConfig?.headers || {}),
      'X-Model': 'gpt-3.5-turbo',
    },
  }
}
```

The generated MSW setup allows you to run the SDK completely offline by starting the worker in development mode.

## Environment variables

Create a `.env` file based on the provided `.env.example` and set your OpenAI credentials:

```
OPENAI_API_KEY=
OPENAI_ORG_ID=
OPENAI_API_BASE_URL=
```

If `OPENAI_API_KEY` is missing the generated `globalMutator` uses `globalMockMutator` instead and logs `"Mock mode (no OPENAI_API_KEY)"`.

## Example project

See [`example/VanScrapper`](../../example/vanScrapper) for a reference integration using Vite and MSW.

## License

MIT © Antoine Paques
