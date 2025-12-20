#!/bin/bash

# Script to set V4.0 Environment Variables in DigitalOcean App Platform via doctl
# 
# Prerequisites:
#   1. doctl installed: brew install doctl
#   2. doctl authenticated: doctl auth init
#   3. App ID: 613df1af-5622-43a6-b599-39dca3c745e6

APP_ID="613df1af-5622-43a6-b599-39dca3c745e6"

echo "🔧 Setting V4.0 Environment Variables in DigitalOcean App Platform"
echo "=================================================================="
echo ""

# Check if doctl is installed
if ! command -v doctl &> /dev/null; then
    echo "❌ doctl is not installed"
    echo "   Install: brew install doctl"
    echo "   Then: doctl auth init"
    exit 1
fi

# Read DEPLOYER_KEY from .env.local
DEPLOYER_KEY=$(grep -E "^DEPLOYER_PRIVATE_KEY=" .env.local | head -1 | cut -d'=' -f2)

if [ -z "$DEPLOYER_KEY" ]; then
    echo "❌ DEPLOYER_PRIVATE_KEY not found in .env.local"
    exit 1
fi

echo "✅ Found DEPLOYER_KEY (length: ${#DEPLOYER_KEY})"
echo ""

# Set Environment Variables
echo "📝 Setting Environment Variables..."

# Feature Flags
doctl apps spec set-env $APP_ID ENABLE_V4_PROTOCOL=true --scope RUN_AND_BUILD_TIME 2>/dev/null || echo "⚠️  Could not set ENABLE_V4_PROTOCOL (may need manual setup)"
doctl apps spec set-env $APP_ID ENABLE_LEGACY_PROTOCOL=true --scope RUN_AND_BUILD_TIME 2>/dev/null || echo "⚠️  Could not set ENABLE_LEGACY_PROTOCOL (may need manual setup)"

# Blockchain Configuration
doctl apps spec set-env $APP_ID V4_DEPLOY_RPC_URL=https://sepolia.base.org --scope RUN_AND_BUILD_TIME 2>/dev/null || echo "⚠️  Could not set V4_DEPLOY_RPC_URL (may need manual setup)"
doctl apps spec set-env $APP_ID V4_CHAIN_ID=84532 --scope RUN_AND_BUILD_TIME 2>/dev/null || echo "⚠️  Could not set V4_CHAIN_ID (may need manual setup)"

# Contract Addresses
doctl apps spec set-env $APP_ID V4_TREASURY_ADDRESS=0x2ca13F0c12fDdC9f9b5452c55d5d40858b91aE27 --scope RUN_AND_BUILD_TIME 2>/dev/null || echo "⚠️  Could not set V4_TREASURY_ADDRESS (may need manual setup)"
doctl apps spec set-env $APP_ID V4_PAYOUT_TOKEN_ADDRESS=0xD3853D3526bD977268489CCe9136AADeb2c33438 --scope RUN_AND_BUILD_TIME 2>/dev/null || echo "⚠️  Could not set V4_PAYOUT_TOKEN_ADDRESS (may need manual setup)"
doctl apps spec set-env $APP_ID V4_CAPITAL_TOKEN_ADDRESS=0x927aC6159502a07e1dbF98B02dAd7079f1cDB49a --scope RUN_AND_BUILD_TIME 2>/dev/null || echo "⚠️  Could not set V4_CAPITAL_TOKEN_ADDRESS (may need manual setup)"
doctl apps spec set-env $APP_ID V4_FACTORY_ADDRESS=0x0000000000000000000000000000000000000000 --scope RUN_AND_BUILD_TIME 2>/dev/null || echo "⚠️  Could not set V4_FACTORY_ADDRESS (may need manual setup)"

# Deployer Key (as SECRET)
doctl apps spec set-env $APP_ID V4_DEPLOYER_KEY="$DEPLOYER_KEY" --scope RUN_TIME --secret 2>/dev/null || echo "⚠️  Could not set V4_DEPLOYER_KEY (may need manual setup)"

# Optional
doctl apps spec set-env $APP_ID V4_FEE_BPS=200 --scope RUN_AND_BUILD_TIME 2>/dev/null || echo "⚠️  Could not set V4_FEE_BPS (may need manual setup)"

echo ""
echo "✅ Environment Variables set!"
echo ""
echo "📝 Note: If some variables failed, you may need to set them manually in DigitalOcean Dashboard:"
echo "   https://cloud.digitalocean.com/apps/$APP_ID/settings"
echo ""
echo "🚀 Next: Trigger deployment"
echo "   doctl apps create-deployment $APP_ID --wait"



