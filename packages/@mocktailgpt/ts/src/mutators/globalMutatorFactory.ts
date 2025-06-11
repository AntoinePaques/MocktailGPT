import type { OperationObject } from "openapi-typescript";
import { getVendorMeta } from "../getVendorMeta";

export type OperationType = "chat" | "embedding";

export interface MutatorOptions {
  operation: OperationObject;
  body?: Record<string, unknown>;
}

export type Dispatcher = (
  operationType: OperationType,
  params: Record<string, unknown>,
) => Promise<unknown> | unknown;

export const globalMutatorFactory = (dispatch: Dispatcher) => {
  return async (options: MutatorOptions) => {
    const meta = getVendorMeta(options.operation);
    const params = options.body ?? {};
    const opType = meta["x-operation-type"] as OperationType;
    return dispatch(opType, { ...params, ...meta });
  };
};
