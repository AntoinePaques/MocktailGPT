# @mocktailgpt/ts

Generic OpenAPI based SDK generator.

## Usage

Place a `swagger.yaml` next to `orval.config.ts` then run:

```bash
npm run gen
```

The generator uses `orval` with default mutators based on OpenAI.
Vendor extension keys supported:

- `x-model`
- `x-temperature`
- `x-operation-type`
- `x-prompt`

See `orval.config.ts` to override mutators or mocks.
