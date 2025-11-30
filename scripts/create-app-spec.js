#!/usr/bin/env node

/**
 * Script to create DigitalOcean App Spec with V4.0 Environment Variables
 * 
 * Usage: node scripts/create-app-spec.js
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const deployerKey = process.env.DEPLOYER_PRIVATE_KEY;

if (!deployerKey) {
  console.error('❌ DEPLOYER_PRIVATE_KEY not found in .env.local');
  process.exit(1);
}

const spec = {
  name: 'crowdstaking-platform',
  region: 'fra',
  services: [{
    name: 'web',
    git: {
      repo_clone_url: 'https://github.com/crowdstaking-org/crowdstaking-platform.git',
      branch: 'main'
    },
    build_command: 'npm run build',
    run_command: 'npm start',
    environment_slug: 'node-js',
    instance_count: 1,
    instance_size_slug: 'basic-xxs',
    http_port: 3000,
    envs: [
      { key: 'NODE_ENV', value: 'production', scope: 'RUN_AND_BUILD_TIME' },
      { key: 'NEXT_PUBLIC_THIRDWEB_CLIENT_ID', value: 'ce354da832525e0a5b35810270a39a7a', scope: 'RUN_AND_BUILD_TIME' },
      { key: 'NEXT_PUBLIC_SUPABASE_URL', value: 'https://zpzxmtrdlutikvgifhrc.supabase.co', scope: 'RUN_AND_BUILD_TIME' },
      { key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwenhtdHJkbHV0aWt2Z2lmaHJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3MTU5MTgsImV4cCI6MjA3ODI5MTkxOH0.1A4okHpwDjXULIFfIGGfH7XvO1qA9J5LI1L68LZ4DyQ', scope: 'RUN_AND_BUILD_TIME' },
      { key: 'SUPABASE_SERVICE_ROLE_KEY', value: 'EV[1:QTeP7GZU2AobbWezFhmzPOkq5JWyOZp7:g1E+4V/yi6MzJhRmuax2Rz1wIhxtof8N0xtipJ8yyf5ZCMK+Nd2R5mzpCqfIKzLCFh9DImQJJ4XHDo5dHrl8vouruw8RgTVgw/dOJ8xshVOmPHhDnk3xBkuU4DnPWCwW+12zWd97OK6pqjRrIglNF3RRMq72DEK8Cn6I47EHrj1E28WXlJqtkZO+F96gWlGzIbuNRbFcUCCWOeUjhGIFgidiK46Mug/ea4dYaERTyjwKPRb/e3iUBGZSje/PGaYFMkCFOC5Ipwpe2G9aB6867H0Sp4iYFmcnKyDtpMEb1CT4ulpM7QIgyQctzQ==]', scope: 'RUN_TIME', type: 'SECRET' },
      { key: 'THIRDWEB_SECRET_KEY', value: 'EV[1:aEYpd4HYqCvTGak9iwg8+EhLNrxZw+6X:/BsEyyDMifPfLcnsG11+cj1b2FhffEO+bXTzoeihiyVhxzwFqEmyuX4Qp3XvVBJ8LVwUS3Z2cJywtfK9MiA9apQlwb+1/j9sK5c8Nux/MiUs7II7vzYCG6dWMg+zr59ZWGrOiRPg]', scope: 'RUN_AND_BUILD_TIME', type: 'SECRET' },
      { key: 'THIRDWEB_GAS_MODE', value: 'server-wallet', scope: 'RUN_AND_BUILD_TIME' },
      { key: 'NEXT_PUBLIC_DAO_WALLET_ADDRESS', value: '0x252825B2DD9d4ea3489070C09Be63ea18879E5ab', scope: 'RUN_AND_BUILD_TIME' },
      { key: 'NEXT_PUBLIC_CSTAKE_TOKEN_ADDRESS', value: '0xa746381E05aE069846726Eb053788D4879B458DA', scope: 'RUN_AND_BUILD_TIME' },
      { key: 'VESTING_CONTRACT_ADDRESS_TESTNET', value: '0x417cba6236848dcaf3cfeb83146c74ae7768c812', scope: 'RUN_AND_BUILD_TIME' },
      { key: 'BASE_SEPOLIA_RPC_URL', value: 'https://sepolia.base.org', scope: 'RUN_AND_BUILD_TIME' },
      { key: 'BASE_MAINNET_RPC_URL', value: 'https://mainnet.base.org', scope: 'RUN_AND_BUILD_TIME' },
      { key: 'ADMIN_WALLET_ADDRESS', value: '0x252825B2DD9d4ea3489070C09Be63ea18879E5ab', scope: 'RUN_AND_BUILD_TIME' },
      { key: 'SUPER_ADMIN_EMAILS', value: 'admin@crowdstaking.io', scope: 'RUN_AND_BUILD_TIME' },
      { key: 'CSTAKE_MANUAL_PRICE', value: '0.50', scope: 'RUN_AND_BUILD_TIME' },
      { key: 'NEXT_PUBLIC_APP_URL', value: 'https://crowdstaking.org', scope: 'RUN_AND_BUILD_TIME' },
      // V4 Protocol Variables
      { key: 'ENABLE_V4_PROTOCOL', value: 'true', scope: 'RUN_AND_BUILD_TIME' },
      { key: 'ENABLE_LEGACY_PROTOCOL', value: 'true', scope: 'RUN_AND_BUILD_TIME' },
      { key: 'V4_DEPLOY_RPC_URL', value: 'https://sepolia.base.org', scope: 'RUN_AND_BUILD_TIME' },
      { key: 'V4_CHAIN_ID', value: '84532', scope: 'RUN_AND_BUILD_TIME' },
      { key: 'V4_TREASURY_ADDRESS', value: '0x2ca13F0c12fDdC9f9b5452c55d5d40858b91aE27', scope: 'RUN_AND_BUILD_TIME' },
      { key: 'V4_PAYOUT_TOKEN_ADDRESS', value: '0xD3853D3526bD977268489CCe9136AADeb2c33438', scope: 'RUN_AND_BUILD_TIME' },
      { key: 'V4_CAPITAL_TOKEN_ADDRESS', value: '0x927aC6159502a07e1dbF98B02dAd7079f1cDB49a', scope: 'RUN_AND_BUILD_TIME' },
      { key: 'V4_FACTORY_ADDRESS', value: '0x318Be50910845103d7EcB1566B817219c33AF0ca', scope: 'RUN_AND_BUILD_TIME' },
      { key: 'V4_DEPLOYER_KEY', value: deployerKey, scope: 'RUN_TIME', type: 'SECRET' },
      { key: 'V4_FEE_BPS', value: '200', scope: 'RUN_AND_BUILD_TIME' }
    ]
  }],
  domains: [
    { domain: 'crowdstaking.org', type: 'PRIMARY' },
    { domain: 'www.crowdstaking.org', type: 'ALIAS' }
  ],
  ingress: {
    rules: [{
      match: { path: { prefix: '/' } },
      component: { name: 'web' }
    }]
  }
};

const outputPath = '/tmp/app-spec.json';
fs.writeFileSync(outputPath, JSON.stringify(spec, null, 2));
console.log(`✅ App-Spec JSON created: ${outputPath}`);
console.log(`📋 V4 Variables included: ${spec.services[0].envs.filter(e => e.key.startsWith('V4_') || e.key.startsWith('ENABLE_V4')).length}`);

