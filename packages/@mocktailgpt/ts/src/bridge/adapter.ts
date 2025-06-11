import type {
  ChatCompletionCreateParamsNonStreaming,
  EmbeddingCreateParams,
} from 'openai/resources';
import type { VanRequest, VanSearchRequest } from '../generated/models';
import type { VendorMeta } from './vendor';
import { VENDOR_KEY, VENDOR_KEY_FALLBACKS } from './vendor';

export const mapVanRequestToChatParams = (
  body: VanRequest,
  meta: Partial<VendorMeta> = {},
): ChatCompletionCreateParamsNonStreaming => ({
  model: meta[VENDOR_KEY.MODEL] ?? body.model ?? VENDOR_KEY_FALLBACKS[VENDOR_KEY.MODEL],
  messages: [
    {
      role: 'user',
      content: `Brand: ${body.brand}, Engine: ${body.engine}`,
    },
  ],
  temperature: meta[VENDOR_KEY.TEMPERATURE] ?? VENDOR_KEY_FALLBACKS[VENDOR_KEY.TEMPERATURE],
  // Ajoute ici d'autres params OpenAI si besoin...
});

export const mapVanSearchRequestToEmbeddingParams = (
  body: VanSearchRequest,
  meta: Partial<VendorMeta> = {},
): EmbeddingCreateParams => ({
  model: meta[VENDOR_KEY.MODEL] ?? VENDOR_KEY_FALLBACKS[VENDOR_KEY.MODEL],
  input: body.brand || body.model || 'default',
  // Ajoute ici d'autres params OpenAI si besoin...
});
