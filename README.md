# MocktailGPT Monorepo

Built with ChatGPT for CHATGPT but reviewed by human.

This repository contains a TypeScript SDK generator and an example project.

## Packages

- **packages/@mocktailgpt/ts** – generic SDK generator based on OpenAPI.
- **example/vanScrapper** – example project using the generator.

## Workflow

Use `npm run gen` to generate API clients and mocks from OpenAPI specs.
Lint, format and build are available through workspace scripts.

```bash
npm run gen
npm run lint
npm run build
```
