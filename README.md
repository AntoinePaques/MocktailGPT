# MocktailGPT

Contract-first TypeScript SDK and mock toolkit for OpenAI/ChatGPT APIs.
Define your schema in Swagger/OpenAPI, auto‑generate a fully typed JS/TS SDK, plus mocks for testing and development.
The contract‑driven approach makes it easy to add adapters or generators for any language (Python and more) — your API, your format, your ecosystem.

---

## 📦 Structure

- `/packages/@mocktailgpt/ts` → SDK principal, buildable en `/dist`.
- `/examples/vanScrapper` → Exemple complet (Swagger, usage du SDK, app Node ou front).
- `.env.local` à la racine pour les variables d’environnement partagées.

---

## 🚀 Workflow

### 🔧 Installer les dépendances
pnpm install

### 🔨 Builder le SDK
pnpm run build
👉 Compile `/packages/@mocktailgpt/ts/src` → `/dist`.

### 💡 Utiliser l’exemple VanScrapper
cd examples/vanScrapper
pnpm install
npx mocktailgpt generate:client --input ./swagger.yaml --output ./src/api
pnpm dev   # Front avec vite
pnpm build # Node build
pnpm start # Node prod

---

## 📜 Notes

- Le build final **n’inclut pas** les examples.
- Le package `@mocktailgpt/ts` est prêt à être **publish** sur NPM.

---

## 📦 Variables d’environnement

Dans `.env.local` à la racine (jamais commité) :
MOCKTAILGPT_API_URL=https://api.openai.com/v1
MOCKTAILGPT_API_KEY=sk-xxxxxxxxxxxx
MOCKTAILGPT_PROJECT_ID=mocktailgpt-core
MOCKTAILGPT_MODEL=gpt-4o
MOCKTAILGPT_TEMPERATURE=0.7

👉 Pour onboarder facilement les devs : ajoute un `.env.example` versionné.
