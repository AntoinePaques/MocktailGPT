import type { Van, VanRequest, VanSearchRequest } from '../generated/models';

export const OPERATION_TYPE = {
  CHAT: 'chat',
  EMBEDDING: 'embedding',
} as const;

export type OperationType = (typeof OPERATION_TYPE)[keyof typeof OPERATION_TYPE];

export type OperationId =
  | 'getSpecs'
  | 'getMarket'
  | 'getUsage'
  | 'getTips'
  | 'getHistory'
  | 'getDocs'
  | 'getAllVanInfo'
  | 'search'
  | 'error';

export type OperationParams = {
  [OPERATION_TYPE.CHAT]: VanRequest;
  [OPERATION_TYPE.EMBEDDING]: VanSearchRequest;
};

export interface MutatorOptions {
  operation: {
    operationId: OperationId;
    meta?: Record<string, unknown>;
    [key: string]: unknown;
  };
  body?: Partial<Van> | VanSearchRequest | Record<string, unknown>;
  query?: Record<string, unknown>;
}

export type APIBody = VanRequest | VanSearchRequest | Record<string, unknown>;
