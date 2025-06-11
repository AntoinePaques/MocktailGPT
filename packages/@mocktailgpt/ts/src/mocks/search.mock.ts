import { faker } from '@faker-js/faker';
import type { ChatCompletion, VanSearchRequest } from '../generated/models';

export const mockSearch = ({
  brand,
  model,
  year,
  size,
  engine,
}: VanSearchRequest): ChatCompletion => ({
  id: faker.string.uuid(),
  object: 'chat.completion',
  created: Math.floor(Date.now() / 1000),
  model: 'text-davinci-003',
  choices: [
    {
      index: 0,
      finish_reason: 'stop',
      message: {
        role: 'assistant',
        content: {
          results: [
            {
              van: {
                brand,
                model,
                year,
                size,
                engine,
              },
              group: 'Stellantis',
            },
            {
              van: {
                brand: 'Citroën',
                model: 'Jumper',
                year: 2018,
                size: 'L3H2',
                engine: '2.2 BlueHDi 140',
              },
              group: 'Stellantis',
            },
          ],
        },
      },
    },
  ],
});
