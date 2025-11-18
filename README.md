# CrowdStaking Platform

[![Deploy to DigitalOcean](https://github.com/crowdstaking-org/crowdstaking-platform/actions/workflows/deploy.yml/badge.svg)](https://github.com/crowdstaking-org/crowdstaking-platform/actions/workflows/deploy.yml)

**Digital Partnership Protocol for the AI Era**

CrowdStaking is a proof-of-work protocol that converts creative initiative into non-tradable partner stakes (Soulbound Tokens) with earned-dividend rights. Shares can never be bought - they are earned through work or approved capital-partner contributions.

🌐 **Live:** https://crowdstaking.org  
📖 **Vision (Model 4.0):** [dev-docs/VISION.md](./dev-docs/VISION.md)  
🚀 **MVP Features:** [dev-docs/MVP_FEATURES.md](./dev-docs/MVP_FEATURES.md)

---

## 🏗️ Tech Stack

- **Framework:** Next.js 16 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Web3:** ThirdWeb SDK (Wallets, smart contracts for SBTs & vaults)
- **Deployment:** DigitalOcean App Platform
- **Region:** Frankfurt (EU)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 22+ and npm 10+

### Installation

```bash
# Clone the repository
git clone git@github-thuhn:crowdstaking-org/crowdstaking-platform.git
cd crowdstaking-platform

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local and add your ThirdWeb Client ID

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Environment Setup

1. **ThirdWeb Configuration**
   - Visit [thirdweb.com/dashboard](https://thirdweb.com/dashboard)
   - Create a new project (or use existing)
   - Copy your Client ID
   - Add it to `.env.local` as `NEXT_PUBLIC_THIRDWEB_CLIENT_ID`

2. **Supabase Configuration** (optional - for database features)
   - Will be added when implementing backend features

See `.env.example` for all available environment variables.

3. **Feature Flags (Model 4.0)**
   - `ENABLE_V4_PROTOCOL=true` aktiviert die neuen v4-Routen (SBTs, Governance, Dividendenvaults)
   - `ENABLE_LEGACY_PROTOCOL=false` deaktiviert alte $CSTAKE-APIs (Standard: true für schrittweise Migration)

4. **V4 On-Chain Deployment (dev)**
   - Hardhat lokal verwenden:
     ```bash
     npm run test:contracts   # führt die Hardhat-Tests aus
     npm run deploy:v4        # deployt alle v4-Contracts (siehe hardhat/scripts/README.md)
     ```
   - Contracts liegen unter `contracts/v4/`, Tests unter `hardhat/test/*.ts`
   - **📋 Vollständige Deployment-Anleitung:** [dev-docs/V4-DEPLOYMENT-CHECKLIST.md](./dev-docs/V4-DEPLOYMENT-CHECKLIST.md)

### Available Scripts

```bash
npm run dev              # Start development server
npm run build            # Create production build
npm run start            # Start production server
npm run lint             # Run ESLint
npm run test             # Run Vitest API tests
npm run test:contracts   # Run Hardhat contract tests

# v4 Contract Deployment
npm run deploy:v4              # Deploy all v4 contracts
npm run deploy:v4:treasury     # Deploy Treasury only
npm run deploy:v4:factory      # Deploy Factory only
npm run deploy:v4:tokens       # Deploy Mock tokens only
```

---

## 📦 Deployment

This project uses **GitHub Actions** for automatic deployment to DigitalOcean App Platform.

**Quick Deploy:**
```bash
git add .
git commit -m "Your message"
git push origin main
# 🚀 Automatic deployment starts!
```

**Full Deployment Guide:** [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 🤝 Contributing

We're building the platform for decentralized building **decentrally**.

**Interested in contributing?** Check out our vision and join the movement:
1. Read [VISION.md](./VISION.md) to understand our mission
2. Join discussions in GitHub Issues
3. Submit proposals for improvements
4. Become a co-founder through contributions

---

## 📚 Documentation

### Core Documentation
- [VISION.md](./dev-docs/VISION.md) - Core thesis and long-term vision
- [MVP_FEATURES.md](./dev-docs/MVP_FEATURES.md) - Current feature set
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide

### v4.0 Protocol Documentation
- [V4-IMPLEMENTATION-PLAN.md](./dev-docs/V4-IMPLEMENTATION-PLAN.md) - Implementation plan and progress
- [V4-IMPLEMENTATION-SUMMARY.md](./dev-docs/V4-IMPLEMENTATION-SUMMARY.md) - Detailed implementation summary
- [V4-FINAL-STATUS.md](./dev-docs/V4-FINAL-STATUS.md) - Final status report
- [V4-DEPLOYMENT-CHECKLIST.md](./dev-docs/V4-DEPLOYMENT-CHECKLIST.md) - Step-by-step deployment guide
- [ADR/0001-v4-architecture.md](./dev-docs/ADR/0001-v4-architecture.md) - Architecture decisions

---

## 📄 License

Open Source 3.0 - Ownership through contribution

---

Built with ❤️ by the CrowdStaking community
