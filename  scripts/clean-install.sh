#!/usr/bin/env bash

echo "🚀 Clean complet du monorepo..."

# Supprimer tous les node_modules et lockfiles éventuels
echo "🧹 Suppression des node_modules et lockfiles..."
rm -rf node_modules pnpm-lock.yaml examples/vanScrapper/node_modules packages/@mocktailgpt/ts/node_modules

echo "✅ Clean complet terminé !"
