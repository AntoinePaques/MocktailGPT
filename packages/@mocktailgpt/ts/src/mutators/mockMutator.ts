import { globalMutatorFactory, OperationType } from "./globalMutatorFactory";

const dispatcher = (_type: OperationType, _params: Record<string, unknown>) => {
  return {};
};

export const mockMutator = globalMutatorFactory(dispatcher);
