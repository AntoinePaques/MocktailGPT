import type {
  ChatCompletionCreateParamsNonStreaming,
  EmbeddingCreateParams,
} from 'openai/resources';
import OpenAiInstance from './index';
import type { OpenAIRequest } from './openai-types';

export const dispatchOpenAIRequest = async (request: OpenAIRequest) => {
  switch (request.operationType) {
    case 'chat':
      // Intentionally casting: params prepared via adapter are ChatCompletionCreateParamsNonStreaming
      return OpenAiInstance.chat.completions.create(
        request.params as unknown as ChatCompletionCreateParamsNonStreaming,
      );
    case 'embedding':
      // Intentionally casting: params prepared via adapter are EmbeddingCreateParams
      return OpenAiInstance.embeddings.create(request.params as unknown as EmbeddingCreateParams);
    default:
      throw new Error(`Unknown operationType: ${request.operationType}`);
  }
};

