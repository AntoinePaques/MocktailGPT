import type { ClientOptions as OpenAIClientOptions } from 'openai';
import { OPENAI_ENV, OPENAI_HEADER } from '../bridge/openai-keys';

export const getOpenAiClientOptions = (): OpenAIClientOptions => ({
  apiKey: process.env[OPENAI_ENV.API_KEY] || undefined,
  organization: process.env[OPENAI_ENV.ORG_ID] || undefined,
  project: process.env[OPENAI_ENV.PROJECT_ID] || undefined,
  baseURL: process.env[OPENAI_ENV.BASE_URL] || 'https://api.openai.com/v1',
  timeout: process.env[OPENAI_ENV.TIMEOUT]
    ? parseInt(process.env[OPENAI_ENV.TIMEOUT] as string, 10)
    : undefined,
  fetchOptions: undefined,
  fetch: undefined,
  maxRetries: process.env[OPENAI_ENV.MAX_RETRIES]
    ? parseInt(process.env[OPENAI_ENV.MAX_RETRIES] as string, 10)
    : undefined,
  defaultHeaders: process.env[OPENAI_ENV.BASE_PROMPT]
    ? { [OPENAI_HEADER.VAN_SCRAPPER_PROMPT]: process.env[OPENAI_ENV.BASE_PROMPT] }
    : undefined,
  defaultQuery: undefined,
  dangerouslyAllowBrowser:
    process.env[OPENAI_ENV.DANGEROUSLY_ALLOW_BROWSER] === 'true' ? true : undefined,
});
