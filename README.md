# MocktailGPT Monorepo

Built with ChatGPT for CHATGPT but reviewed by human.

This monorepo provides a generic OpenAPI SDK generator and an example project.

## Packages

- **packages/@mocktailgpt/ts** – generic SDK generator based on OpenAPI.
- **example/vanScrapper** – example project using the generator.

## Workflow

Run `./scripts/init.sh` once to install dependencies.
`./scripts/generate.sh` calls the `mocktail` CLI to create clients and mocks.
`./scripts/lint.sh` and `./scripts/test.sh` run quality checks.

Vendor extension defaults are defined in `packages/@mocktailgpt/ts/src/vendorExtensions.ts`.

```bash
./scripts/generate.sh
./scripts/lint.sh
./scripts/test.sh
```
