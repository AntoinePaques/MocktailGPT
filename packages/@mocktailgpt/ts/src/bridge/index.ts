// ./src/api/bridge/index.ts

import type { OpenAI as OpenAIType } from 'openai';
import { OpenAI } from 'openai';
import { getOpenAiClientOptions } from '../utils/getOpenAiClientOptions';

const openAiClientOptions = Object.fromEntries(
  Object.entries(getOpenAiClientOptions()).filter(([, value]) => value !== undefined),
);

const OpenAiInstance: OpenAIType = new OpenAI(openAiClientOptions);

export default OpenAiInstance;
