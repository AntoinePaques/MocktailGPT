#!/usr/bin/env bash

echo "🚀 Build complet de MocktailGPT..."

# Clean dist global du SDK
echo "🧹 Suppression des anciens builds du SDK..."
find packages/@mocktailgpt/ts/dist -type f -delete

# Build principal du SDK
echo "🔨 Build de @mocktailgpt/ts..."
npm run --workspace=@mocktailgpt/ts build

echo "✅ Build finalisé proprement !"
exit 0
