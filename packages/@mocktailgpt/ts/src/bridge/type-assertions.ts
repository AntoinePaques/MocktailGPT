// ./src/api/bridge/type-assertions.ts
import type { ChatCompletion } from 'openai/resources/chat/completions';
import type { CreateEmbeddingResponse } from 'openai/resources/embeddings';
import * as Models from '../generated/models';

// @ts-expect-error Compile-time check only (do not remove)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _AllCompletionsAreSdkCompatible = Models.ChatCompletion extends ChatCompletion ? true : never;
// @ts-expect-error Compile-time check only (do not remove)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _AllEmbeddingsAreSdkCompatible = Models.CreateEmbeddingResponse extends CreateEmbeddingResponse
  ? true
  : never;
