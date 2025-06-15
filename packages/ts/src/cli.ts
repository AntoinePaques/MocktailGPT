#!/usr/bin/env node
import ora from 'ora';
import { resolve } from 'path';
import { runCLI } from 'orval';
import { loadConfig } from './config/loadConfig';
import { generateOrvalConfig } from './generator/generateOrvalConfig';
import { generatePostFiles } from './generator/generatePostFiles';
import { generateMockFiles } from './generator/generateMockFiles';
import { initConfig } from './cli/init';

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (command === 'init') {
    await initConfig(args.slice(1));
    return;
  }

  if (command !== 'generate') {
    console.error('Unknown command:', command);
    process.exit(1);
  }

  const configFlagIndex = args.indexOf('--config');
  const configPath = configFlagIndex !== -1 ? args[configFlagIndex + 1] : './mocktail.config.ts';

  const spinner = ora('Loading config...').start();

  try {
    const config = await loadConfig(configPath);
    spinner.succeed('Config loaded');

    spinner.start('Writing Orval config...');
    const orvalConfigPath = await generateOrvalConfig(config);
    spinner.succeed('✔ Orval config written');

    spinner.start('Generating Orval client...');
    await runCLI(orvalConfigPath);
    spinner.succeed('✔ Orval client generated');

    if (config.postFiles?.enabled) {
      await generatePostFiles(
        resolve(process.cwd(), config.output),
        resolve(process.cwd(), config.output, config.postFiles.output ?? '.'),
      );
    }
    if (config.mock) {
      await generateMockFiles(
        resolve(process.cwd(), config.output),
        resolve(process.cwd(), 'public'),
      );
    }
  } catch (error) {
    spinner.fail('Generation failed');
    const message = error instanceof Error ? error.message : String(error);
    console.error(message);
    process.exit(1);
  }
}

main();
