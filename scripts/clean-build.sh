#!/bin/bash

# Clean Build Script for SharifRo
# This script clears all build caches to ensure clean CSS loading

echo "🧹 Cleaning build cache..."

# Remove Next.js build directory
if [ -d ".next" ]; then
  rm -rf .next
  echo "✅ Removed .next directory"
else
  echo "ℹ️  .next directory not found"
fi

# Remove node_modules cache
if [ -d "node_modules/.cache" ]; then
  rm -rf node_modules/.cache
  echo "✅ Removed node_modules/.cache"
else
  echo "ℹ️  node_modules/.cache not found"
fi

# Remove TypeScript build info
if [ -f "tsconfig.tsbuildinfo" ]; then
  rm tsconfig.tsbuildinfo
  echo "✅ Removed tsconfig.tsbuildinfo"
else
  echo "ℹ️  tsconfig.tsbuildinfo not found"
fi

echo ""
echo "✨ Clean complete!"
echo ""
echo "Next steps:"
echo "1. Run 'npm run build' to rebuild the application"
echo "2. Run 'npm run dev' for development"
echo "3. Run 'npm start' for production"

