#!/bin/bash

echo "🚀 Starting Cloudflare Workers deployment..."

# Step 1: Build Next.js application
echo "📦 Building Next.js application..."
npm run build

# Step 2: Convert to Cloudflare Workers format
echo "🔄 Converting to Cloudflare Workers format..."
npx @cloudflare/next-on-pages

# Step 3: Deploy to Cloudflare Workers
echo "☁️ Deploying to Cloudflare Workers..."
wrangler deploy

echo "✅ Deployment complete!"
echo "Your application should be available at: https://vm-personal-website.your-subdomain.workers.dev"
