import { OPERATION_TYPE } from './mutator.types';
import type { OperationId, OperationType } from './mutator.types';

export const OPERATION_TYPE_MAP: Record<OperationId, OperationType> = {
  getSpecs: OPERATION_TYPE.CHAT,
  getMarket: OPERATION_TYPE.CHAT,
  getUsage: OPERATION_TYPE.CHAT,
  getTips: OPERATION_TYPE.CHAT,
  getHistory: OPERATION_TYPE.CHAT,
  getDocs: OPERATION_TYPE.CHAT,
  getAllVanInfo: OPERATION_TYPE.CHAT,
  search: OPERATION_TYPE.EMBEDDING,
  error: OPERATION_TYPE.CHAT,
};
