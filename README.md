# MocktailGPT Monorepo

Built with ChatGPT for CHATGPT but reviewed by human.

This monorepo provides a generic OpenAPI SDK generator and an example project.

## Packages

- **packages/@mocktailgpt/ts** – generic SDK generator based on OpenAPI.
- **example/vanScrapper** – example project using the generator.

## Workflow

Run `pnpm install` to set up the workspace. Build the generator with `pnpm --filter @mocktailgpt/ts build` and generate the example client with `cd example/vanScrapper && pnpm generate` (which internally calls `mocktail generate`). Use `pnpm lint` and `pnpm test` for quality checks.

Vendor extension defaults are defined in `packages/@mocktailgpt/ts/src/vendorExtensions.ts`.

```bash
pnpm install
pnpm --filter @mocktailgpt/ts build
cd example/vanScrapper && pnpm generate
```
