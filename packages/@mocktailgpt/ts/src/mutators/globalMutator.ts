import { dispatchOpenAIRequest } from '../bridge/dispatcher';
import { globalMutatorFactory } from './globalMutatorFactory';

export const globalMutator = globalMutatorFactory((operationType, params) => {
  return dispatchOpenAIRequest({ operationType, params });
});
