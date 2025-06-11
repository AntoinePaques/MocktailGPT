// ./src/api/mutators/globalMockMutator.ts
import type { VanRequest, VanSearchRequest } from '../generated/models';
import { mockError, mockSearch, getSpecsDataMock } from '../mocks';
import { globalMutatorFactory } from './globalMutatorFactory';

type MockParams = {
  getSpecs: VanRequest;
  search: VanSearchRequest;
};

type MockFn<K extends keyof MockParams> = (body: MockParams[K]) => unknown;

const mockMap: { [K in keyof MockParams]: MockFn<K> } = {
  getSpecs: getSpecsDataMock,
  search: mockSearch,
};

export const globalMockMutator = globalMutatorFactory((_, params) => {
  const opId = params.operationId as keyof MockParams;
  const mockFn = mockMap[opId];
  // TS safe: cast params en MockParams[typeof opId] pour le bon mock
  return mockFn ? mockFn(params as MockParams[typeof opId]) : mockError(params);
});
