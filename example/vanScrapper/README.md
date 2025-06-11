# vanScrapper example

This example consumes the `@mocktailgpt/ts` package.

## Quick start

```bash
npm install
npm run gen
```

The provided `swagger.yaml` is used to generate types, API client and mocks.

Vendor extensions (`x-*`) can be used inside the spec to control the OpenAI request:

- `x-model`
- `x-temperature`
- `x-operation-type`
- `x-prompt`
