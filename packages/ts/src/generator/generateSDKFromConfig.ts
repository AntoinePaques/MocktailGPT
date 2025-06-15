import { resolve, parse } from 'path';
import { spawn } from 'child_process';
import ora from 'ora';
import { generateOrvalConfig } from './generateOrvalConfig';
import { generatePostFiles } from './generatePostFiles';
import type { Config } from '../config/types';

export async function generateSDKFromConfig(config: Config) {
  const name = parse(config.swagger).name;
  const spinner = ora(`Generating SDK for ${name}...`).start();

  try {
    const orvalConfigPath = await generateOrvalConfig(config);

    const runOrval = await getOrvalRunner();
    await runOrval(orvalConfigPath);

    if (config.postFiles?.enabled) {
      await generatePostFiles(
        resolve(process.cwd(), config.output),
        resolve(process.cwd(), config.output, config.postFiles.output ?? '.'),
      );
    }
    spinner.succeed(`✅ SDK generated for ${name}`);
  } catch (error) {
    spinner.fail('SDK generation failed');
    throw error instanceof Error ? error : new Error(String(error));
  }
}

async function getOrvalRunner() {
  try {
    const mod = await import('orval');
    return async (configPath: string) => {
      await mod.runCLI(configPath);
    };
  } catch {
    return async (configPath: string) => {
      await new Promise<void>((resolvePromise, reject) => {
        const child = spawn('npx', ['orval', '--config', configPath], {
          stdio: 'inherit',
        });
        child.on('exit', (code) => {
          code === 0 ? resolvePromise() : reject(new Error(`Orval CLI exited with code ${code}`));
        });
        child.on('error', reject);
      });
    };
  }
}
