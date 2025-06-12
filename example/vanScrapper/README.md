# vanScrapper example

Built with ChatGPT for CHATGPT but reviewed by human.

This example consumes the `@mocktailgpt/ts` package.

## Quick start

```bash
pnpm install
pnpm generate
```

The provided `swagger.yaml` is used to generate types, API client and mocks.

Vendor extensions (`x-*`) can be used inside the spec to control the OpenAI request:

- `x-model`
- `x-temperature`
- `x-operation-type`
- `x-prompt`

Edit these keys in `swagger.yaml` to change how the OpenAI requests behave before running `pnpm generate`.
