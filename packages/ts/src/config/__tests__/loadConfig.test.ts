import { describe, it, expect } from 'vitest';
import { resolve } from 'path';
import { writeFileSync, unlinkSync } from 'fs';
import { loadConfig } from '../loadConfig';

function createTempConfig(content: string, name: string) {
  const file = resolve(process.cwd(), `.temp-${name}.config.ts`);
  writeFileSync(file, content);
  return file;
}

describe('loadConfig', () => {
  it('loads a complete config file', async () => {
    const file = createTempConfig(
      "export default { input: './api.yaml', output: './api', projectName: 'test', clientName: 'cli', mock: false }",
      'complete',
    );
    const config = await loadConfig(file);
    unlinkSync(file);
    expect(config).toEqual({
      input: './api.yaml',
      output: './api',
      projectName: 'test',
      clientName: 'cli',
      mock: false,
    });
  });
  it('returns defaults when config file is missing', async () => {
    const config = await loadConfig('./missing.config.ts');
    expect(config).toEqual({
      input: 'swagger.yaml',
      output: 'src/api',
      projectName: 'default',
      clientName: 'client',
      mock: true,
    });
  });

  it('merges partial config', async () => {
    const file = createTempConfig("export default { output: './api', mock: false }", 'partial');
    const config = await loadConfig(file);
    unlinkSync(file);
    expect(config.output).toBe('./api');
    expect(config.mock).toBe(false);
    expect(config.input).toBe('swagger.yaml');
  });

  it('throws when required postFiles fields are missing', async () => {
    const file = createTempConfig('export default { postFiles: {} }', 'missing');
    await expect(loadConfig(file)).rejects.toThrow();
    unlinkSync(file);
  });

  it('throws for invalid config', async () => {
    const file = createTempConfig("export default { mock: 'yes' }", 'invalid');
    await expect(loadConfig(file)).rejects.toThrow();
    unlinkSync(file);
  });

  it('throws on invalid TypeScript', async () => {
    const file = createTempConfig('export default', 'broken');
    await expect(loadConfig(file)).rejects.toThrow();
    unlinkSync(file);
  });
});
