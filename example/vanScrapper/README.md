# VanScrapper example

This demo shows how to use **Mocktail** to build an OpenAI powered client from a business Swagger file.

## 🎯 Goal

Generate a typed SDK for the van scrapper API and try it in both real and mock modes.

## ⚙️ Generate the SDK

```bash
pnpm install    # builds and links the local mocktail CLI
pnpm run generate
```

The generation uses `mocktail.config.ts` to locate `swagger.yaml` and the output folder.

The swagger file can be found at `swagger.yaml`.

Copy `.env.example` to `.env` in the repository root and add your OpenAI credentials if you want real calls. Without a key all calls are mocked.

## 🧪 Test with MSW

Start the worker in development to intercept requests:

```ts
if (process.env.NODE_ENV === 'development') {
  const { worker } = await import('./generated/msw');
  await worker.start();
}
```

The project depends on [`@mocktailgpt/ts`](../../packages/@mocktailgpt/ts).
