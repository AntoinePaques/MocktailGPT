# MocktailGPT Monorepo

This repository houses multiple packages for the MocktailGPT project.

## Packages

[@mocktailgpt/ts](packages/ts): CLI scaffold for generating TypeScript clients
with MSW mocks and a `mocktail` command line interface. The package can
generate an `orval.config.js`, run [Orval](https://orval.dev), and create
helper files (`index.ts`, `msw.ts`, `mockServiceWorker.js`).
Use `-c` or `--config` to point to a custom Orval configuration.

The CLI also offers an `init` command to scaffold a `mocktail.config.ts` from a
Swagger file:

```bash
mocktail init --swagger ./path/to/swagger.yaml
```

## Development

Standard tooling is configured at the repository root:

- Prettier for code formatting (`pnpm format`)
- ESLint with TypeScript support (`pnpm lint`)
- Shared TypeScript settings in `tsconfig.base.json`
- Husky pre-commit hook running lint-staged

See the package README for configuration details.
