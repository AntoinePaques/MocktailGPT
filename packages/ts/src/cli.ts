#!/usr/bin/env node
import ora from 'ora';
import { runCLI } from 'orval';
import { resolve } from 'path';
import { existsSync, readdirSync } from 'fs';
import { initConfig } from './cli/init.js';
import { loadConfig } from './config/loadConfig.js';
import { generateMockFiles } from './generator/generateMockFiles.js';
import { generateOrvalConfig } from './generator/generateOrvalConfig.js';
import { generatePostFiles } from './generator/generatePostFiles.js';

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (existsSync('.env')) {
    await import('dotenv').then((m) => m.config());
  }

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
    if (!existsSync(config.input)) {
      console.error(`❌ Swagger file not found: ${config.input}`);
      process.exit(1);
    }
    console.log('📄 Swagger input:', config.input);
    console.log('📂 Output dir:', config.output || 'generated');

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

    try {
      const files = readdirSync(resolve(process.cwd(), config.output));
      if (files.length) {
        console.log('Generated files:');
        for (const f of files) console.log(' -', f);
      }
    } catch {}
  } catch (error) {
    spinner.fail('Generation failed');
    const message = error instanceof Error ? error.message : String(error);
    console.error(message);
    process.exit(1);
  }
}

main();
