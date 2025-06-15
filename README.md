# MocktailGPT Monorepo

This repository houses multiple packages for the MocktailGPT project.

## Packages

- [@mocktailgpt/ts](packages/ts): CLI scaffold for generating TypeScript clients
  with MSW mocks and a `mocktail` command line interface. The package can also
  generate an `orval.config.js` for programmatic use of [Orval](https://orval.dev).

## Development

Standard tooling is configured at the repository root:

- Prettier for code formatting
- ESLint with TypeScript support
- Shared TypeScript settings in `tsconfig.base.json`

See the package README for configuration details.
