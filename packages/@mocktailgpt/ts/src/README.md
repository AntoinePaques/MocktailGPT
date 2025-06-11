# 🚐 VanScrapper API SDK & Mocks

[![npm version](https://img.shields.io/npm/v/@vanscrapper/api?style=flat-square)](https://www.npmjs.com/package/@vanscrapper/api)
[![build](https://img.shields.io/github/actions/workflow/status/<GITHUB_ORG>/<REPO>/ci.yml?branch=main&style=flat-square)](https://github.com/<GITHUB_ORG>/<REPO>/actions)
[![types](https://img.shields.io/npm/types/@vanscrapper/api?style=flat-square)](https://www.npmjs.com/package/@vanscrapper/api)
[![MIT License](https://img.shields.io/npm/l/@vanscrapper/api?style=flat-square)](LICENSE)

> TypeScript-first SDK and mocking toolkit for the VanScrapper API
> Ultra-typed, Swagger-first, 100% auto-generated, zero drift, "deutsche Qualität" DX.

---

## ✨ Features

- OpenAPI/Swagger-first: All types and endpoints are strictly generated from your swagger.
- SDK Ready: Plug for prod, dev, and test—mock or real, hot-swap in one line.
- Fully Typed: Types (VanRequest, SpecsData, etc.) always up-to-date, never write types by hand.
- Mocks Out-of-the-Box: Faker-powered, response-perfect, pluggable for CI/dev.
- DRY & Scalable: Centralized operationId/type maps, vendor/meta keys, auto-generated enums.
- Self-documented: All params and response schemas stay in sync with the API spec.

---

## 🚀 Quick Start

npm install @vanscrapper/api

In your TypeScript/Node project:

import { globalMutator, globalMockMutator } from '@vanscrapper/api'
// Types: import { VanRequest, SpecsData, ChatCompletion } from '@vanscrapper/api/generated/models'

const realApiResponse = await globalMutator({
operation: { operationId: 'getSpecs' },
body: { brand: 'Volkswagen', model: 'Transporter', year: 2020, engine: 'TDI' }
})

const fakeApiResponse = await globalMockMutator({
operation: { operationId: 'getSpecs' },
body: { brand: 'Fiat', model: 'Ducato', year: 2018, engine: 'Multijet' }
})

---

## 📚 API Overview

- globalMutator: Main adapter, routes all requests to the real VanScrapper API.
- globalMockMutator: Swap in for testing/dev, returns fully-typed faker mocks, 100% response-compatible.
- Types: All request/response types auto-generated from Swagger.
- Utils: ChatCompletion/SpecsData factories, mock helpers, vendor key enums.

---

## 🤖 Usage Examples

Get specs (real API):

const res = await globalMutator({
operation: { operationId: 'getSpecs' },
body: { brand: 'Renault', model: 'Master', year: 2021, engine: '2.3dCi' }
})

Get specs (mock API):

const res = await globalMockMutator({
operation: { operationId: 'getSpecs' },
body: { brand: 'Renault', model: 'Master', year: 2021, engine: '2.3dCi' }
})

---

## 🧪 Test & Dev Patterns

- Mock everything: No need to start a backend to test your frontend or scripts.
- Prod/test parity: The same mutator interface everywhere—swap mock/real as needed.
- Ultra-maintainable: Just update the swagger, regenerate, and go. No drift.

---

## 🛠️ How It Works

- OpenAPI is the source of truth: All code is generated or type-checked from your Swagger spec.
- OperationId autogen: No more manual enums—never break your dispatcher.
- Centralized vendor/meta keys: No stringly-typed mistakes, all enums/types are in one place.

---

## 🤝 Contributing

- PRs welcome!
- Please regenerate all types/mocks before submitting changes:
  npm run orval && npm run gen:operationid
- OpenAPI changes? Please update the swagger file and re-run codegen.

---

## 📄 License

MIT

---

Handcrafted with ❤️ and TypeScript. Zero drift. 100% "Deutsche Qualität".
