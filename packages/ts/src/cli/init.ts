import { existsSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import prompts from 'prompts';
import YAML from 'yaml';
import type { MocktailConfig } from '../config/types';
import { formatWithPrettier } from '../utils/formatWithPrettier';

export async function initConfig(args: string[] = []): Promise<void> {
  const yes = args.includes('--yes');
  const formatIndex = args.indexOf('--format');
  const format = formatIndex !== -1 ? args[formatIndex + 1] : 'ts';
  if (!['ts', 'json', 'yml'].includes(format)) {
    console.error('Invalid --format value. Use ts, json or yml');
    process.exit(1);
  }
  const configPath = resolve(process.cwd(), `mocktail.config.${format}`);
  if (existsSync(configPath)) {
    console.error(`${configPath.split('/').pop()} already exists`);
    process.exit(1);
  }

  const defaults: MocktailConfig = {
    input: './swagger.yaml',
    output: './src/api',
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
        message: 'Client name:',
        initial: defaults.clientName,
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

  let content = '';
  switch (format) {
    case 'json':
      content = JSON.stringify(config, null, 2) + '\n';
      break;
    case 'yml':
      content = YAML.stringify(config);
      break;
    default:
      content =
        `import type { MocktailConfig } from '@mocktailgpt/ts';\n\n` +
        `const config: MocktailConfig = {\n` +
        `  input: '${config.input}',\n` +
        `  output: '${config.output}',\n` +
        `  projectName: '${config.projectName}',\n` +
        `  clientName: '${config.clientName}',\n` +
        `  mock: ${config.mock},\n` +
        `};\n\n` +
        `export default config;\n`;
  }

  writeFileSync(configPath, content);
  await formatWithPrettier(configPath);
  console.log(`✅ ${configPath.split('/').pop()} created`);
}
