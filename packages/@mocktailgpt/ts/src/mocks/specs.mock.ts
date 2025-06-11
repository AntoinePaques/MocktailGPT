import { faker } from '@faker-js/faker';
import type { Van, SpecsData, ChatCompletion } from '../generated/models';
import { getChatCompletionMock } from './utils';

export const getSpecsDataMock = (van: Van): ChatCompletion => {
  const specsData: SpecsData = {
    van,
    dimensions: {
      length_mm: faker.number.int({ min: 5000, max: 7000 }),
      width_mm: faker.number.int({ min: 1800, max: 2200 }),
      height_mm: faker.number.int({ min: 2200, max: 2700 }),
      wheelbase_mm: faker.number.int({ min: 3500, max: 4100 }),
    },
    structure: {
      frame_type: faker.helpers.arrayElement(['monocoque', 'châssis séparé']),
      chassis: faker.helpers.arrayElement(['standard', 'renforcé']),
    },
    mechanics: {
      fuel: faker.helpers.arrayElement(['diesel', 'essence']),
      power_hp: faker.number.int({ min: 90, max: 200 }),
      euro_norm: faker.helpers.arrayElement(['Euro 6d', 'Euro 5', 'Euro 4']),
    },
    layouts: {
      seat_count: faker.number.int({ min: 2, max: 7 }),
      bed_count: faker.number.int({ min: 1, max: 4 }),
    },
    schematics: {
      electrical: faker.internet.url(),
      plumbing: faker.internet.url(),
    },
    features: faker.helpers.arrayElements(['AC', 'cruise', 'towbar', 'solar', 'panoramic roof'], 2),
    compatibility: faker.helpers.arrayElements(['L1H1', 'L2H2', 'L3H2', 'L4H3'], 2),
    notes: faker.lorem.sentence(),
    deprecated: faker.datatype.boolean(),
    resale_difficulty: faker.helpers.arrayElement(['facile', 'moyenne', 'difficile']),
  };
  // Important : passer [specsData] (array), pas specsData seul
  return getChatCompletionMock([specsData]);
};
