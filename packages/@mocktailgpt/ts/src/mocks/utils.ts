// ./src/api/mocks/utils.ts
import { faker } from '@faker-js/faker';
import type {
  ChatCompletion,
  ChatCompletionChoice,
  ChatCompletionMessage,
  SpecsData,
} from '../generated/models';

export const getChatCompletionMessageMock = (specsData: SpecsData[]): ChatCompletionMessage => ({
  role: 'assistant',
  content: specsData,
});

export const getChatCompletionChoiceMock = (
  message: ChatCompletionMessage,
): ChatCompletionChoice => ({
  index: 0,
  finish_reason: 'stop',
  message,
});

export const getChatCompletionMock = (specsData: SpecsData[]): ChatCompletion => ({
  id: faker.string.uuid(),
  object: 'chat.completion',
  created: Math.floor(Date.now() / 1000),
  model: 'gpt-4o',
  choices: [getChatCompletionChoiceMock(getChatCompletionMessageMock(specsData))],
});
