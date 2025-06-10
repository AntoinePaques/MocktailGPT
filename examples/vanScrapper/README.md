# VanScrapper Example

This is an example project that uses the `@mocktailgpt/ts` SDK locally, showcasing the usage of a Swagger-based API client in Node.js or Vite front-end.

---

## 🚀 Quick start
pnpm install
npx mocktailgpt generate:client --input ./swagger.yaml --output ./src/api

pnpm dev   # Front (vite)
pnpm build # Node build
pnpm start # Node prod

---

## 📦 Variables d’environnement

Chargées depuis le `.env.local` à la racine du monorepo.
Si besoin d’overrides, ajoute un `.env.local` dans ce dossier.

---

## 🤝 Licence
MIT
