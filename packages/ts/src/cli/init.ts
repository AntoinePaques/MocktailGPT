import { existsSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import prompts from 'prompts';
import type { MocktailConfig } from '../config/types';
    clientName: 'client',
      {
        type: 'text',
        name: 'clientName',
        message: 'Client name:',
        initial: defaults.clientName,
      },
      clientName: answers.clientName,
    `  clientName: '${config.clientName}',\n` +
import { formatWithPrettier } from '../utils/formatWithPrettier.js';

export async function initConfig(args: string[] = []): Promise<void> {
  const yes = args.includes('--yes');
  const configPath = resolve(process.cwd(), 'mocktail.config.ts');
  if (existsSync(configPath)) {
    console.error('mocktail.config.ts already exists');
    process.exit(1);
  }

  const defaults: MocktailConfig = {
    input: 'swagger.yaml',
    output: 'src/api',
    projectName: 'default',
    clientName: 'client',
    mock: true,
  };

  let config: MocktailConfig;

  if (yes) {
    config = defaults;
  } else {
    const answers = await prompts([
      {
        type: 'text',
        name: 'input',
        message: 'OpenAPI file path:',
        initial: defaults.input,
      },
      {
        type: 'text',
        name: 'output',
        message: 'Output directory:',
        initial: defaults.output,
      },
      {
        type: 'text',
        name: 'projectName',
        message: 'Project name:',
        initial: defaults.projectName,
      },
      {
        type: 'toggle',
        name: 'mock',
        message: 'Generate MSW mocks?',
        initial: defaults.mock,
        active: 'yes',
        inactive: 'no',
      },
      {
        type: 'text',
        name: 'clientName',
        message: 'Client name (default: client)',
        initial: 'client',
      },
    ]);

    config = {
      input: answers.input,
      output: answers.output,
      projectName: answers.projectName,
      clientName: answers.clientName ?? 'client',
      mock: answers.mock,
    };
  }

  const content =
    `import type { MocktailConfig } from '@mocktailgpt/ts';\n\n` +
    `const config: MocktailConfig = {\n` +
    `  input: '${config.input}',\n` +
    `  output: '${config.output}',\n` +
    `  projectName: '${config.projectName}',\n` +
    `  mock: ${config.mock},\n` +
    `};\n\n` +
    `export default config;\n`;

  writeFileSync(configPath, content);
  await formatWithPrettier(configPath);
  console.log('✅ mocktail.config.ts created');
}
