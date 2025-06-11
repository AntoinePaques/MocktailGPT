// src/api/generated/msw.ts
import { setupWorker } from 'msw/browser';
import { getVanScrapperAPIMock } from './vanScrapperAPI.msw';

export const worker = setupWorker(...getVanScrapperAPIMock());
