import type { MocktailConfig } from '@mocktailgpt/ts';

const config: MocktailConfig = {
  input: './openapi.yaml',
  output: './src/api/generated',
  projectName: 'vanScrapper',
  clientName: 'client',
  mock: true,
  postFiles: { enabled: true, output: '..' },
};

export default config;
