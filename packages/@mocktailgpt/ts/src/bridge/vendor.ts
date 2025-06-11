export const VENDOR_KEY = {
  MODEL: 'x-model',
  TEMPERATURE: 'x-temperature',
  OPERATION_TYPE: 'x-operation-type',
  PROMPT: 'x-prompt',
} as const;

export type VendorKey = (typeof VENDOR_KEY)[keyof typeof VENDOR_KEY];

export interface VendorMeta {
  [VENDOR_KEY.MODEL]: string;
  [VENDOR_KEY.TEMPERATURE]: number;
  [VENDOR_KEY.OPERATION_TYPE]: string;
  [VENDOR_KEY.PROMPT]: string;
}

export const VENDOR_KEY_FALLBACKS: VendorMeta = {
  [VENDOR_KEY.MODEL]: process.env.OPENAI_MODEL_FALLBACK || 'gpt-4o',
  [VENDOR_KEY.TEMPERATURE]: Number(process.env.OPENAI_DEFAULT_TEMPERATURE) || 0.3,
  [VENDOR_KEY.OPERATION_TYPE]: 'chat',
  [VENDOR_KEY.PROMPT]: '',
};
