/**
 * Available vendor extension keys for OpenAPI operations.
 * These can be used in any operation and are merged with defaults.
 */
export const VENDOR_EXTENSIONS = {
  MODEL: "x-model",
  TEMPERATURE: "x-temperature",
  OPERATION_TYPE: "x-operation-type",
  PROMPT: "x-prompt",
} as const;

export type VendorExtensionKey =
  (typeof VENDOR_EXTENSIONS)[keyof typeof VENDOR_EXTENSIONS];

export const DEFAULT_EXTENSION_VALUES = {
  [VENDOR_EXTENSIONS.MODEL]: "gpt-4o",
  [VENDOR_EXTENSIONS.TEMPERATURE]: 0.3,
  [VENDOR_EXTENSIONS.OPERATION_TYPE]: "chat",
  [VENDOR_EXTENSIONS.PROMPT]: "",
};
