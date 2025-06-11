import type { VendorMeta } from '../bridge/vendor';
import { getSwaggerMeta } from '../utils/getSwaggerMeta';
import type { MutatorOptions, OperationId, OperationType } from './mutator.types';
import { OPERATION_TYPE_MAP } from './operation-type.map';

type Dispatcher = (
  operationType: OperationType,
  params: Record<string, unknown>,
) => Promise<unknown> | unknown;

export const globalMutatorFactory = (dispatchImpl: Dispatcher) => {
  return async (options: MutatorOptions) => {
    const meta: VendorMeta & { operationId?: OperationId } = getSwaggerMeta(
      options.operation,
    ) as VendorMeta & { operationId?: OperationId };
    const { operationId, ...otherMeta } = meta;
    if (!operationId) {
      if (process.env.NODE_ENV !== 'production' && process.env.VERBOSE) {
        console.warn('WARN: makeGlobalMutator called with no operationId! options:', options);
      }
      return undefined;
    }
    const params = options.body ?? {};
    const operationType = OPERATION_TYPE_MAP[operationId];
    if (!operationType) throw new Error(`Unknown operation type for ${operationId}`);
    return dispatchImpl(operationType, { ...params, ...otherMeta });
  };
};
