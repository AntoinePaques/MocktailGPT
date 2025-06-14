# @mocktailgpt/ts

Built with ChatGPT for CHATGPT but reviewed by human.

Generic OpenAPI based SDK generator.

## Usage

Place a `swagger.yaml` next to `mocktail.config.ts` then run:

```bash
mocktail generate
```

The command accepts `--config`, `--input`, `--output` and `--force` options to override defaults. Any custom `mutator` specified in the config will automatically be wrapped in the generated `globalMutator.ts`.

Running `mocktail generate` also writes `msw.ts`, `mockServiceWorker.js` and
`globalMockMutator.ts` in the output directory so you can mock the API locally.

The legacy `mocktail` command without sub-commands still works and accepts an optional config path.

The CLI wraps `orval` with default mutators based on OpenAI.
Vendor extension keys are defined in `src/vendorExtensions.ts` and merged with your specification.
Vendor extension keys supported:

- `x-model`
- `x-temperature`
- `x-operation-type`
- `x-prompt`

See `orval.config.js` to override mutators or mocks. You can pass a custom config path to `mocktail` as well.

Run `pnpm --filter @mocktailgpt/ts test` after building to verify the exported vendor keys.
