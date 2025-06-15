#!/usr/bin/env node
import ora from 'ora'
import { loadConfig } from './config/loadConfig'

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
    console.log(config)
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
