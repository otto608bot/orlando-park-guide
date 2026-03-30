#!/bin/bash
# Hybrid build script: Eleventy (main site) + Next.js (blog)
# Merges both outputs into _site for unified deployment

set -e

echo "=== Building Eleventy site (main content) ==="
npm run build

echo "=== Building Next.js blog (static export) ==="
cd web
npm install
npm run build
cd ..

echo "=== Merging Next.js output into Eleventy _site ==="
# Next.js static export outputs to web/out
# Copy Next.js blog content into _site
if [ -d "web/out" ]; then
  # Copy all Next.js static files to _site
  cp -r web/out/* _site/
  echo "=== Merged Next.js output into _site ==="
else
  echo "Warning: web/out directory not found, skipping merge"
fi

echo "=== Hybrid build complete ==="
