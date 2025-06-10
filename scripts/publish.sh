#!/usr/bin/env bash

echo "🚀 Publishing SDK @mocktailgpt/ts..."

# Se placer dans le package SDK
cd packages/@mocktailgpt/ts

# Incrémenter la version (patch par défaut, modifie si tu veux)
echo "🔖 Bumping version (patch)..."
npm version patch --no-git-tag-version

# Build du SDK
echo "🔨 Build SDK..."
npm run build

# Publish sur NPM
echo "🚀 Publishing on NPM..."
npm publish --access public

# Récupérer la version pour le tag Git
VERSION=$(node -p "require('./package.json').version")
TAG="v${VERSION}"

# Revenir à la racine du monorepo
cd ../../..

# Créer un commit et un tag
echo "🔖 Creating Git tag ${TAG}..."
git add packages/@mocktailgpt/ts/package.json
git commit -m "chore(release): publish @mocktailgpt/ts@${VERSION}"
git tag ${TAG}
git push origin main --tags

echo "✅ Publish done !"
exit 0
