import type { MutatorOptions } from '../mutator.types';
import { getVendorExtensionKeys } from './getVendorExtensionKeys';
import type { VendorMeta } from '../bridge/vendor';

export const getSwaggerMeta = (operation: MutatorOptions['operation']): VendorMeta => {
  return getVendorExtensionKeys(operation);
};
