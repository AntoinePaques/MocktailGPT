import type { VendorMeta } from '../bridge/vendor';
import { VENDOR_KEY, VENDOR_KEY_FALLBACKS } from '../bridge/vendor';
import type { MutatorOptions } from '../mutators/mutator.types';

export const getVendorExtensionKeys = (operation: MutatorOptions['operation']): VendorMeta => {
  const meta = (operation?.meta ?? {}) as Partial<VendorMeta>;
  return {
    [VENDOR_KEY.MODEL]:
      typeof meta[VENDOR_KEY.MODEL] === 'string' && meta[VENDOR_KEY.MODEL] !== ''
        ? meta[VENDOR_KEY.MODEL]!
        : VENDOR_KEY_FALLBACKS[VENDOR_KEY.MODEL],
    [VENDOR_KEY.TEMPERATURE]:
      typeof meta[VENDOR_KEY.TEMPERATURE] === 'number'
        ? meta[VENDOR_KEY.TEMPERATURE]!
        : VENDOR_KEY_FALLBACKS[VENDOR_KEY.TEMPERATURE],
    [VENDOR_KEY.OPERATION_TYPE]:
      typeof meta[VENDOR_KEY.OPERATION_TYPE] === 'string' && meta[VENDOR_KEY.OPERATION_TYPE] !== ''
        ? meta[VENDOR_KEY.OPERATION_TYPE]!
        : VENDOR_KEY_FALLBACKS[VENDOR_KEY.OPERATION_TYPE],
    [VENDOR_KEY.PROMPT]:
      typeof meta[VENDOR_KEY.PROMPT] === 'string' && meta[VENDOR_KEY.PROMPT] !== ''
        ? meta[VENDOR_KEY.PROMPT]!
        : VENDOR_KEY_FALLBACKS[VENDOR_KEY.PROMPT],
  };
};
