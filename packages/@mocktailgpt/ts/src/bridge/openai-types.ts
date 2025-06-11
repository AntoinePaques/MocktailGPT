import type {
  ChatCompletionCreateParamsNonStreaming,
  EmbeddingCreateParams,
} from 'openai/resources';

export type { ChatCompletionCreateParamsNonStreaming, EmbeddingCreateParams };

export interface OpenAIRequest {
  operationType: 'chat' | 'embedding';
  params: Record<string, unknown>;
  // Ajoute ici tout param discriminant OpenAI attendu par dispatcher
}
