import type { OperationObject } from "openapi-typescript";
import { VENDOR_KEY, VENDOR_KEY_FALLBACKS, VendorMeta } from "./vendor";

export const getVendorMeta = (
  operation: OperationObject,
): Required<VendorMeta> => {
  const op: Record<string, unknown> = operation as any;
  return {
    [VENDOR_KEY.MODEL]:
      (op[VENDOR_KEY.MODEL] as string) ??
      VENDOR_KEY_FALLBACKS[VENDOR_KEY.MODEL],
    [VENDOR_KEY.TEMPERATURE]:
      (op[VENDOR_KEY.TEMPERATURE] as number) ??
      VENDOR_KEY_FALLBACKS[VENDOR_KEY.TEMPERATURE],
    [VENDOR_KEY.OPERATION_TYPE]:
      (op[VENDOR_KEY.OPERATION_TYPE] as string) ??
      VENDOR_KEY_FALLBACKS[VENDOR_KEY.OPERATION_TYPE],
    [VENDOR_KEY.PROMPT]:
      (op[VENDOR_KEY.PROMPT] as string) ??
      VENDOR_KEY_FALLBACKS[VENDOR_KEY.PROMPT],
  };
};
