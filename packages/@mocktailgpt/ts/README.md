# @mocktailgpt/ts

Generic OpenAPI based SDK generator.

## Usage

Place a `swagger.yaml` next to `orval.config.ts` then run:

```bash
mocktail
```

The CLI wraps `orval` with default mutators based on OpenAI.
Vendor extension keys are defined in `src/vendorExtensions.ts` and merged with your specification.
Vendor extension keys supported:

- `x-model`
- `x-temperature`
- `x-operation-type`
- `x-prompt`

See `orval.config.ts` to override mutators or mocks. You can pass a custom config path to `mocktail` as well.
