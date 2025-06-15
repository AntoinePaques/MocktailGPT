# @mocktailgpt/ts

[![npm](https://img.shields.io/npm/v/@mocktailgpt/ts.svg)](https://www.npmjs.com/package/@mocktailgpt/ts)

CLI and utilities to turn an OpenAPI specification into a TypeScript SDK with optional [MSW](https://mswjs.io/) mocks.

## Présentation

Mocktail transforme un fichier Swagger/OpenAPI en client TypeScript prêt à l'emploi. Sous le capot, il s'appuie sur [Orval](https://orval.dev) et ajoute l'injection de mutators ainsi que la génération de mocks pour MSW.

## Installation

```bash
pnpm add @mocktailgpt/ts -D
```

Le package suppose l'existence d'un fichier `mocktail.config.ts` à la racine de votre projet.

## Utilisation

Initialiser la configuration :

```bash
mocktail init
# ou directement
mocktail init --yes
```

Générer le SDK :

```bash
mocktail generate
```

Exemple de `mocktail.config.ts` :

```ts
import type { MocktailConfig } from '@mocktailgpt/ts'

const config: MocktailConfig = {
  input: 'swagger.yaml',
  output: 'src/api',
  projectName: 'default',
  clientName: 'client',
  mock: true,
  postFiles: {
    enabled: true,
  },
}

export default config
```

## Exemple

Le dossier [`example/vanScrapper`](../../example/vanScrapper) montre l'intégration dans une application Vite. Après exécution de `mocktail generate` on obtient le SDK dans `src/api` ainsi que les handlers MSW dans `public/`.

## À venir

- Ajout de tests supplémentaires
- Systèmes de presets (OpenAI, etc.)
- Publication sur npm avec CI
