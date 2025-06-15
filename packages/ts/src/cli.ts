#!/usr/bin/env node
import ora from 'ora'
import { resolve } from 'path'
import { runCLI } from 'orval'
import { loadConfig } from './config/loadConfig'
import { generateOrvalConfig } from './generator/generateOrvalConfig'
import { generatePostFiles } from './generator/generatePostFiles'

async function main() {
  const args = process.argv.slice(2)
  const command = args[0]

  if (command !== 'generate') {
    console.error('Unknown command:', command)
    process.exit(1)
  }

  const configFlagIndex = args.indexOf('--config')
  const configPath = configFlagIndex !== -1 ? args[configFlagIndex + 1] : './mocktail.config.ts'

  const spinner = ora('Loading config...').start()

  try {
    const config = await loadConfig(configPath)
    spinner.succeed('Config loaded')

    generateOrvalConfig(config)

    const configArgIndex = args.findIndex((arg) => arg === '--config' || arg === '-c')
    const orvalConfigPath =
      configArgIndex !== -1
        ? resolve(process.cwd(), args[configArgIndex + 1])
        : resolve(process.cwd(), 'orval.config.js')

    try {
      await runCLI(['--config', orvalConfigPath])
      console.log('✅ Orval generation complete')
      generatePostFiles(resolve(process.cwd(), config.output))
    } catch (err) {
      console.error('❌ Orval generation failed:', err)
      process.exit(1)
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    if (message.startsWith('Invalid config')) {
      spinner.fail('❌ Invalid config')
    } else {
      spinner.fail('Error loading config')
    }
    console.error(message)
    process.exit(1)
  }
}

main()
