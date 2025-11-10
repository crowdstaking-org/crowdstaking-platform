# Production Deployment Checklist

**Project:** CrowdStaking Platform  
**Target:** Vercel (Recommended) or Self-Hosted  
**Last Updated:** 2025-11-10  

---

## 🎯 Pre-Deployment Overview

This checklist ensures a smooth, secure, and reliable production deployment. Follow steps in order.

**Estimated Time:** 4-6 hours (first deployment)  
**Subsequent Deployments:** 30-60 minutes  

---

## 📋 Phase 1: Environment & Infrastructure (2-3 hours)

### 1.1 Environment Variables Setup

**Critical:** These must be configured before deployment!

#### Production Environment Variables
Create `.env.production` or configure in hosting platform:

```bash
# ✅ REQUIRED - Core Services
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # Server-side only, NEVER expose!

# ✅ REQUIRED - ThirdWeb
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_client_id_here

# ✅ REQUIRED - Authentication
ADMIN_WALLET_ADDRESS=0x1234...  # Comma-separated for multiple admins

# ✅ REQUIRED - Smart Contracts
NEXT_PUBLIC_CSTAKE_TOKEN_ADDRESS=0xa746...  # Token address
VESTING_CONTRACT_ADDRESS=0x...              # Mainnet
VESTING_CONTRACT_ADDRESS_TESTNET=0x...      # Testnet

# 🔴 CRITICAL - Foundation Wallet (NEVER COMMIT!)
FOUNDATION_WALLET_PRIVATE_KEY=0x...  # TODO: Migrate to Thirdweb Engine!

# ✅ REQUIRED - Network RPCs
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
BASE_MAINNET_RPC_URL=https://mainnet.base.org

# 🟡 OPTIONAL - Rate Limiting (Recommended)
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...

# 🟡 OPTIONAL - Price Feeds
CSTAKE_MANUAL_PRICE=0.50  # If no Uniswap pool yet
CSTAKE_UNISWAP_POOL_ADDRESS=0x...  # When pool exists

# ✅ REQUIRED - App URL
NEXT_PUBLIC_APP_URL=https://crowdstaking.io

# Node Environment (auto-set by Vercel)
NODE_ENV=production
```

**Checklist:**
- [ ] All REQUIRED variables configured
- [ ] Private keys stored securely (not in .env files!)
- [ ] Admin wallet addresses verified
- [ ] Token addresses match deployed contracts
- [ ] RPC URLs tested and responsive

---

### 1.2 Database (Supabase) Setup

**Prerequisites:**
- Supabase project created
- Database migrations applied

**Checklist:**
- [ ] **Run all migrations:**
  ```sql
  -- From supabase-migrations/ directory
  -- 001_create_proposals_table.sql
  -- 002_add_deliverable_to_proposals.sql
  -- 003_add_contract_fields_to_proposals.sql
  ```

- [ ] **Enable Row Level Security (RLS):**
  ```sql
  -- On proposals table
  ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
  
  -- Policy: Anyone can read
  CREATE POLICY "Anyone can view proposals"
    ON proposals FOR SELECT
    USING (true);
  
  -- Policy: Only creator can insert
  CREATE POLICY "Users can create own proposals"
    ON proposals FOR INSERT
    WITH CHECK (auth.uid() = creator_wallet_address);
  ```

- [ ] **Test database connection:**
  ```bash
  # From local dev
  npm run dev
  # Check API routes work: /api/proposals
  ```

- [ ] **Backup configuration:**
  - Supabase auto-backups enabled (daily)
  - Point-in-time recovery configured

- [ ] **Connection pooling:**
  - Verify Supabase connection limits
  - Configure pool size if needed

---

### 1.3 Smart Contract Deployment

**Prerequisites:**
- Contracts compiled (`contracts/compiled/`)
- Testnet deployed and tested

**Checklist:**
- [ ] **Deploy to Mainnet:**
  ```bash
  # From scripts/
  node deploy-vesting-api.js --network=mainnet
  ```

- [ ] **Verify on Basescan:**
  - Go to https://basescan.org/address/YOUR_CONTRACT
  - Submit source code for verification
  - Test read functions

- [ ] **Update contract addresses:**
  - Update `VESTING_CONTRACT_ADDRESS` in env
  - Update `NEXT_PUBLIC_CSTAKE_TOKEN_ADDRESS` in env

- [ ] **Test contract interactions:**
  ```bash
  # Test from local dev
  # Try creating/releasing vesting agreement
  ```

- [ ] **Document contract addresses:**
  - Add to `contracts/deployed/VestingContract-mainnet.json`

---

## 📋 Phase 2: Code & Security Review (1-2 hours)

### 2.1 Security Audit

**Critical Issues (Must Fix):**
- [ ] ✅ Debug endpoints disabled in production
  - `src/app/api/debug-auth/route.ts` - Protected ✅
  - `src/app/api/test-auth/route.ts` - Protected ✅

- [ ] 🔴 Private key NOT in environment variables
  - **TODO:** Migrate to Thirdweb Engine
  - **Temporary:** Use separate production key
  - **Verify:** Key never committed to Git

- [ ] ✅ Security headers configured
  - `next.config.ts` - HSTS, CSP, X-Frame-Options ✅

- [ ] 🟡 Rate limiting implemented
  - **MVP:** In-memory (works for limited users)
  - **Production:** Upstash Redis required

- [ ] ✅ Error messages sanitized
  - `src/lib/api.ts` - Production-safe errors ✅

**Checklist:**
- [ ] Review `dev-docs/SECURITY-AUDIT.md`
- [ ] All CRITICAL issues resolved
- [ ] HIGH issues resolved or accepted as risk
- [ ] Security testing completed

---

### 2.2 Code Quality

**Checklist:**
- [ ] **Linter passes:**
  ```bash
  npm run lint
  # Fix any errors
  ```

- [ ] **TypeScript compiles:**
  ```bash
  npm run build
  # No type errors
  ```

- [ ] **No console.logs with sensitive data:**
  ```bash
  # Search for console.log
  grep -r "console.log" src/
  # Remove any with wallet addresses, keys, etc.
  ```

- [ ] **Dependencies updated:**
  ```bash
  npm audit
  # Fix critical vulnerabilities
  npm audit fix
  ```

- [ ] **Unused code removed:**
  - No commented-out code
  - No unused imports
  - No dead components

---

### 2.3 Testing

**Checklist:**
- [ ] **E2E tests pass:**
  ```bash
  npm run test:e2e
  # All tests pass
  ```

- [ ] **Manual testing on staging:**
  - Deploy to staging environment first
  - Test all critical flows:
    - [ ] Homepage loads
    - [ ] Wallet connection works
    - [ ] Proposal submission works
    - [ ] Admin panel accessible
    - [ ] Contract interactions work

- [ ] **Mobile testing:**
  - [ ] iPhone Safari
  - [ ] Android Chrome
  - [ ] Responsive layouts work
  - [ ] Mobile menu functions

- [ ] **Browser testing:**
  - [ ] Chrome (latest)
  - [ ] Firefox (latest)
  - [ ] Safari (latest)
  - [ ] Edge (latest)

---

## 📋 Phase 3: Performance Optimization (30-60 min)

### 3.1 Bundle Size

**Checklist:**
- [ ] **Run bundle analyzer:**
  ```bash
  npm run build:analyze
  ```

- [ ] **Check bundle sizes:**
  - Main bundle < 500KB gzipped ✅
  - First Load JS < 250KB ✅
  - No duplicate dependencies

- [ ] **Dynamic imports configured:**
  - `src/app/page.tsx` - Below-fold components ✅
  - Heavy components lazy-loaded

---

### 3.2 Performance Metrics

**Checklist:**
- [ ] **Run Lighthouse audit:**
  ```bash
  npm run build
  npm start
  # Open Chrome DevTools > Lighthouse
  # Run audit in "Navigation" mode
  ```

- [ ] **Target Metrics:**
  - Performance Score: > 80
  - First Contentful Paint: < 2s
  - Time to Interactive: < 4s
  - Largest Contentful Paint: < 2.5s
  - Cumulative Layout Shift: < 0.1
  - Total Blocking Time: < 300ms

- [ ] **Document results:**
  ```
  Performance: ___/100
  FCP: ___s
  LCP: ___s
  TTI: ___s
  TBT: ___ms
  CLS: ___
  ```

---

## 📋 Phase 4: Deployment to Production (30 min)

### 4.1 Vercel Deployment (Recommended)

**Prerequisites:**
- Vercel account created
- Project connected to GitHub

**Checklist:**
- [ ] **Configure Vercel Project:**
  - Framework: Next.js (auto-detected)
  - Build Command: `npm run build`
  - Output Directory: `.next` (auto)
  - Install Command: `npm install`

- [ ] **Add Environment Variables:**
  - Go to Vercel Dashboard > Settings > Environment Variables
  - Add all production env vars (from 1.1)
  - Select "Production" environment

- [ ] **Configure Domains:**
  - Add custom domain: `crowdstaking.io`
  - Add `www.crowdstaking.io` redirect
  - Enable automatic HTTPS

- [ ] **Deploy:**
  ```bash
  # Option 1: Push to main branch (auto-deploys)
  git push origin main
  
  # Option 2: Manual deploy
  vercel --prod
  ```

- [ ] **Verify deployment:**
  - Visit https://crowdstaking.io
  - Check homepage loads
  - Test wallet connection
  - Check API routes work

---

### 4.2 Self-Hosted Deployment (Alternative)

**Prerequisites:**
- Server with Node.js 18+
- Domain with SSL certificate

**Checklist:**
- [ ] **Build application:**
  ```bash
  npm run build
  ```

- [ ] **Configure PM2 or systemd:**
  ```bash
  # PM2 example
  pm2 start npm --name "crowdstaking" -- start
  pm2 save
  pm2 startup
  ```

- [ ] **Configure Nginx reverse proxy:**
  ```nginx
  server {
    listen 443 ssl http2;
    server_name crowdstaking.io;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
      proxy_pass http://localhost:3000;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection 'upgrade';
      proxy_set_header Host $host;
      proxy_cache_bypass $http_upgrade;
    }
  }
  ```

- [ ] **Test deployment:**
  - Visit https://crowdstaking.io
  - All features work

---

## 📋 Phase 5: Post-Deployment (30 min)

### 5.1 Monitoring Setup

**Checklist:**
- [ ] **Enable Vercel Analytics:**
  - Vercel Dashboard > Analytics > Enable

- [ ] **Setup Error Monitoring (Optional):**
  ```bash
  # Option: Sentry
  npm install @sentry/nextjs
  # Configure in next.config.ts
  ```

- [ ] **Database Monitoring:**
  - Check Supabase Dashboard > Database > Health
  - Verify connection count < limits

- [ ] **Smart Contract Monitoring:**
  - Add contract to Etherscan watchlist
  - Setup alerts for events

---

### 5.2 DNS & SSL

**Checklist:**
- [ ] **DNS configured:**
  - A record: `crowdstaking.io` → Vercel IP
  - CNAME: `www.crowdstaking.io` → Vercel domain

- [ ] **SSL certificate:**
  - HTTPS working
  - No mixed content warnings
  - SSL Labs A+ rating

- [ ] **Security headers verified:**
  ```bash
  curl -I https://crowdstaking.io
  # Check for HSTS, CSP, X-Frame-Options
  ```

---

### 5.3 SEO & Meta Tags

**Checklist:**
- [ ] **Meta tags configured:**
  - `<title>` tags on all pages
  - `<meta description>` tags
  - Open Graph tags
  - Twitter Card tags

- [ ] **Sitemap generated:**
  - Add `public/sitemap.xml`
  - Submit to Google Search Console

- [ ] **robots.txt:**
  - Add `public/robots.txt`
  - Allow crawling

- [ ] **Google Search Console:**
  - Verify domain ownership
  - Submit sitemap
  - Monitor coverage

---

## 📋 Phase 6: Launch Day (1 hour)

### 6.1 Pre-Launch Checklist

**30 minutes before launch:**

- [ ] **Team notification:**
  - All team members ready
  - Support channels monitored

- [ ] **Final checks:**
  - Staging tests pass
  - All services green
  - Database healthy
  - No open critical bugs

- [ ] **Rollback plan ready:**
  - Previous deployment saved
  - Rollback procedure documented
  - Emergency contacts list

---

### 6.2 Launch Sequence

**T-minus 5 minutes:**
- [ ] Final production deployment
- [ ] Wait for Vercel build to complete
- [ ] Run smoke tests on production

**T-minus 0: LAUNCH!**
- [ ] Announce on social media
- [ ] Monitor error logs
- [ ] Watch analytics

---

### 6.3 Post-Launch Monitoring (First 24h)

**First Hour:**
- [ ] Check error rates (should be < 1%)
- [ ] Monitor response times (< 500ms avg)
- [ ] Verify all critical flows work
- [ ] Check database connections (< 50% of limit)

**First Day:**
- [ ] Review analytics data
- [ ] Check user feedback
- [ ] Monitor server resources
- [ ] No critical issues

---

## 📋 Ongoing Maintenance

### Daily
- [ ] Check error logs
- [ ] Monitor uptime (target: 99.9%)
- [ ] Review user feedback

### Weekly
- [ ] Review analytics
- [ ] Check database performance
- [ ] Update dependencies if needed

### Monthly
- [ ] Full security audit
- [ ] Performance optimization review
- [ ] Backup verification
- [ ] Cost optimization

---

## 🚨 Emergency Procedures

### If Site is Down

1. **Check Vercel Status:**
   - https://www.vercel-status.com/

2. **Check Supabase Status:**
   - https://status.supabase.com/

3. **Check Logs:**
   ```bash
   vercel logs
   ```

4. **Rollback if needed:**
   ```bash
   vercel rollback
   ```

---

### If Database is Down

1. Check Supabase dashboard
2. Check connection count (may be at limit)
3. Restart database if needed
4. Scale up if necessary

---

### If Contract Fails

1. Check Basescan for transaction details
2. Verify gas prices not too high
3. Check wallet balance (ETH for gas)
4. Contact support if needed

---

## 📞 Support Contacts

**Hosting:** Vercel Support  
**Database:** Supabase Support  
**Blockchain:** Base Network Discord  

**Team:**
- Dev Lead: [TBD]
- On-Call: [TBD]
- Security: [TBD]

---

## 📚 Related Documentation

- [Security Audit](./SECURITY-AUDIT.md)
- [Performance Optimization](./PERFORMANCE-OPTIMIZATION.md)
- [E2E Testing](./E2E-TESTING.md)
- [Environment Variables](./PHASE-6-ENV-VARS.md)

---

## ✅ Final Sign-Off

Before going live:

- [ ] All checklist items completed
- [ ] Security review passed
- [ ] Performance targets met
- [ ] Testing completed
- [ ] Team ready for launch
- [ ] Monitoring configured
- [ ] Emergency procedures documented

**Deployed by:** ___________  
**Date:** ___________  
**Version:** ___________  

---

**🎉 Ready for Launch!**

