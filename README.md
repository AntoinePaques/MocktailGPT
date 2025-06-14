# MocktailGPT Monorepo

Built with ChatGPT for CHATGPT but reviewed by human.

This monorepo provides a generic OpenAPI SDK generator and an example project.

## Packages

- **packages/@mocktailgpt/ts** – generic SDK generator based on OpenAPI.
- **example/vanScrapper** – example project using the generator.

## Workflow

Run `pnpm install` to set up the workspace. Build the generator with `pnpm --filter @mocktailgpt/ts build` and generate the example client with `cd example/vanScrapper && pnpm generate` (which internally calls `mocktail generate`). Use `pnpm lint` and `pnpm test` for quality checks. The `mocktail generate` command accepts `--config`, `--input`, `--output` and `--force` options.

The generator produces a full mocking environment based on MSW. After running
`mocktail generate` you can start the worker in development mode:

```ts
if ((import.meta as any).env?.MODE === 'development') {
  const { worker } = await import('./generated/msw')
  await worker.start()
}
```

Vendor extension defaults are defined in `packages/@mocktailgpt/ts/src/vendorExtensions.ts`.

```bash
pnpm install
pnpm --filter @mocktailgpt/ts build
cd example/vanScrapper && pnpm generate
```

Copy `.env.example` to `.env` and fill in your OpenAI credentials. If no API key
is provided the example will run in mock mode.
