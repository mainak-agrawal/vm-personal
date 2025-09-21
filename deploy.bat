@echo off

echo 🚀 Starting Cloudflare Workers deployment...

REM Step 1: Build Next.js application
echo 📦 Building Next.js application...
call npm run build
if %ERRORLEVEL% neq 0 (
    echo ❌ Next.js build failed
    exit /b %ERRORLEVEL%
)

REM Step 2: Convert to Cloudflare Workers format
echo 🔄 Converting to Cloudflare Workers format...
call npx @cloudflare/next-on-pages --experimental-minify
if %ERRORLEVEL% neq 0 (
    echo ❌ Next-on-pages conversion failed
    exit /b %ERRORLEVEL%
)

REM Step 3: Deploy to Cloudflare Workers
echo ☁️ Deploying to Cloudflare Workers...
call wrangler deploy
if %ERRORLEVEL% neq 0 (
    echo ❌ Wrangler deployment failed
    exit /b %ERRORLEVEL%
)

echo ✅ Deployment complete!
echo Your application should be available at: https://vm-personal-website.your-subdomain.workers.dev

pause
