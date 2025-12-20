#!/bin/bash

# Script to help set V4.0 Environment Variables in DigitalOcean App Platform
# 
# Usage: 
#   1. Read this script to see what variables need to be set
#   2. Manually set them in DigitalOcean Dashboard
#   3. Or use doctl CLI (if configured)

APP_ID="613df1af-5622-43a6-b599-39dca3c745e6"

echo "🔧 V4.0 Environment Variables für DigitalOcean App Platform"
echo "============================================================"
echo ""
echo "App ID: $APP_ID"
echo "Dashboard: https://cloud.digitalocean.com/apps/$APP_ID/settings"
echo ""
echo "📋 Zu setzende Environment Variables:"
echo ""
echo "1. ENABLE_V4_PROTOCOL=true"
echo "2. ENABLE_LEGACY_PROTOCOL=true"
echo "3. V4_DEPLOY_RPC_URL=https://sepolia.base.org"
echo "4. V4_CHAIN_ID=84532"
echo "5. V4_TREASURY_ADDRESS=0x2ca13F0c12fDdC9f9b5452c55d5d40858b91aE27"
echo "6. V4_PAYOUT_TOKEN_ADDRESS=0xD3853D3526bD977268489CCe9136AADeb2c33438"
echo "7. V4_CAPITAL_TOKEN_ADDRESS=0x927aC6159502a07e1dbF98B02dAd7079f1cDB49a"
echo "8. V4_FACTORY_ADDRESS=0x0000000000000000000000000000000000000000"
echo "9. V4_DEPLOYER_KEY=<aus .env.local kopieren>"
echo "10. V4_FEE_BPS=200"
echo ""
echo "⚠️  WICHTIG: V4_DEPLOYER_KEY als SECRET setzen!"
echo ""
echo "📝 V4_DEPLOYER_KEY finden:"
echo "   grep DEPLOYER_PRIVATE_KEY .env.local"
echo ""



