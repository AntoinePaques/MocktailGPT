import { resolve, parse, join, dirname } from 'path';
import { createRequire } from 'module';
import { spawn } from 'child_process';
import { existsSync } from 'fs';
import { writeFile, copyFile, mkdir } from 'fs/promises';
import ora from 'ora';
import { generateOrvalConfig } from './generateOrvalConfig';
import { generatePostFiles } from './generatePostFiles';
import { generateMockFiles } from './generateMockFiles';
import type { Config } from '../config/types';

const require = createRequire(import.meta.url);

export async function generateSDKFromConfig(config: Config) {
  const name = config.projectName ?? parse(config.input).name;
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
    if (config.mock) {
      await generateMockFiles(
        resolve(process.cwd(), config.output),
        resolve(process.cwd(), 'public'),
      );
    }
    await generateExtraFiles(resolve(process.cwd(), config.output), config.clientName ?? 'client');
    spinner.succeed(`✅ SDK generated for ${name}`);
  } catch (error) {
    spinner.fail('SDK generation failed');
    throw error instanceof Error ? error : new Error(String(error));
  }
}

async function generateExtraFiles(outputDir: string, clientName: string) {
  await mkdir(outputDir, { recursive: true });
  const mswPath = join(outputDir, 'msw.ts');
  if (existsSync(mswPath)) {
    console.log('msw.ts already exists, skipped');
  } else {
    const mswContent =
      '// \ud83e\udd2a Auto-generated by Mocktail\n' +
      "import { rest } from 'msw';\n\n" +
      'export const handlers = [\n' +
      "  rest.post('/fake', (_req, res, ctx) => res(ctx.json({ message: 'mock' }))),\n" +
      '];\n';
    await writeFile(mswPath, mswContent);
  }

  const workerPkg = require.resolve('msw/package.json');
  const workerSource = join(dirname(workerPkg), 'lib', 'mockServiceWorker.js');
  const workerDest = join(outputDir, 'mockServiceWorker.js');
  if (existsSync(workerDest)) {
    console.log('mockServiceWorker.js already exists, skipped');
  } else {
    await copyFile(workerSource, workerDest);
  }

  const indexPath = join(outputDir, 'index.ts');
  if (existsSync(indexPath)) {
    console.log('index.ts already exists, skipped');
  } else {
    const indexContent =
      `// \ud83e\udd2a Auto-generated by Mocktail\n` +
      `export * from './${clientName}';\n` +
      "export * from './msw';\n";
    await writeFile(indexPath, indexContent);
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
