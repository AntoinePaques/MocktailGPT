#!/usr/bin/env bash

echo "🚀 Build complet de MocktailGPT..."

# Clean dist global du SDK
echo "🧹 Suppression des anciens builds du SDK..."
find packages/@mocktailgpt/ts/dist -type f -delete

# Build principal du SDK
echo "🔨 Build de @mocktailgpt/ts..."
pnpm exec tsc -b packages/@mocktailgpt/ts

echo "✅ Build finalisé proprement !"
