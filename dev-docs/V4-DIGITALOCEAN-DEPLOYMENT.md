# CrowdStaking v4.0 – DigitalOcean Deployment Guide

**Datum:** 2025-01-XX  
**Status:** ✅ Vollständige Anleitung für Production-Deployment

> ⚠️ **WICHTIG:** Für eine schnelle Schritt-für-Schritt-Anleitung siehe: `dev-docs/V4-DIGITALOCEAN-SETUP.md`

---

## 🎯 Übersicht

Diese Anleitung führt durch den vollständigen Deployment-Prozess von CrowdStaking v4.0 zu DigitalOcean App Platform.

**Geschätzte Zeit:** 3-5 Stunden (erste Deployment)

---

## 📋 Phase 1: Smart Contract Deployment (VOR Application Deployment)

### 1.1 Voraussetzungen

**Checklist:**
- [ ] Node.js 18+ installiert
- [ ] Hardhat-Dependencies installiert: `npm install`
- [ ] Deployer-Wallet erstellt/importiert
- [ ] Deployer-Wallet mit Gas gefüllt (Base Sepolia für Testnet, Base Mainnet für Production)
- [ ] `.env` Datei im Projekt-Root erstellt (für Hardhat)

### 1.2 Hardhat Environment Variables

Erstelle `.env` im Projekt-Root (separat von `.env.local`):

```bash
# Deployer Wallet (Private Key)
DEPLOYER_PRIVATE_KEY=0x...  # NIEMALS COMMITTEN!

# RPC URLs
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
BASE_RPC_URL=https://mainnet.base.org

# Optional: V4-spezifische Konfiguration
V4_FEE_BPS=200  # Fee in Basis-Punkten (200 = 2%)
```

### 1.3 Contract Deployment

#### Option A: Alle Contracts auf einmal (empfohlen)

```bash
# Für Base Sepolia (Testnet)
npm run deploy:v4 -- --network baseSepolia

# Für Base Mainnet (Production)
npm run deploy:v4 -- --network base
```

#### Option B: Schrittweise Deployment

```bash
# 1. Treasury deployen
npm run deploy:v4:treasury -- --network baseSepolia

# 2. Mock-Tokens deployen (nur Testnet)
npm run deploy:v4:tokens -- --network baseSepolia

# 3. Factory deployen
npm run deploy:v4:factory -- --network baseSepolia
```

### 1.4 Deployment-Output speichern

Nach erfolgreichem Deployment werden die Contract-Adressen ausgegeben. **Speichere diese:**

```bash
# Beispiel Output:
✅ CrowdStakingTreasury deployed to: 0x1234...
✅ MockERC20 (Payout) deployed to: 0x5678...
✅ MockERC20 (Capital) deployed to: 0x9abc...
✅ ProjectFactory deployed to: 0xdef0...
```

**Checklist:**
- [ ] Treasury-Adresse gespeichert
- [ ] Factory-Adresse gespeichert
- [ ] Token-Adressen gespeichert (falls Mock-Tokens deployed)
- [ ] Contracts auf Basescan verifiziert

---

## 📋 Phase 2: DigitalOcean App Platform Konfiguration

### 2.1 App Platform Zugriff

**DigitalOcean Dashboard:**
- URL: https://cloud.digitalocean.com/apps/613df1af-5622-43a6-b599-39dca3c745e6
- App ID: `613df1af-5622-43a6-b599-39dca3c745e6`

### 2.2 Environment Variables konfigurieren

Gehe zu: **Settings → Environment Variables**

Füge alle folgenden Variablen hinzu:

#### Core Services (bereits vorhanden)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # Server-side only

# ThirdWeb
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_client_id_here

# App URL
NEXT_PUBLIC_APP_URL=https://crowdstaking-platform-uuex4.ondigitalocean.app
# Oder Custom Domain:
# NEXT_PUBLIC_APP_URL=https://crowdstaking.org

# Node Environment
NODE_ENV=production
```

#### V4 Protocol Configuration (NEU)

```bash
# ============================================
# V4 PROTOCOL CONFIGURATION
# ============================================

# Feature Flags
ENABLE_V4_PROTOCOL=true
ENABLE_LEGACY_PROTOCOL=true  # Optional: false, um Legacy zu deaktivieren

# Blockchain Configuration
V4_DEPLOY_RPC_URL=https://sepolia.base.org  # Oder https://mainnet.base.org für Production
V4_CHAIN_ID=84532  # Base Sepolia: 84532, Base Mainnet: 8453

# Contract Addresses (aus Phase 1.4)
V4_FACTORY_ADDRESS=0x...  # Aus deploy-all.ts Output
V4_TREASURY_ADDRESS=0x...  # Aus deploy-all.ts Output
V4_PAYOUT_TOKEN_ADDRESS=0x...  # Mock-Token oder echte Token-Adresse (z.B. USDC)
V4_CAPITAL_TOKEN_ADDRESS=0x...  # Mock-Token oder echte Token-Adresse (z.B. USDC)

# Deployer Wallet (für Server-seitige Transaktionen)
V4_DEPLOYER_KEY=0x...  # Private Key (NIEMALS COMMITTEN! Nur in DigitalOcean Secrets)

# Oracle Configuration (optional, für Capital-Events)
V4_ORACLE_SECRET=your_hmac_secret_here  # Für HMAC-Verifikation

# Fee Configuration (optional, Standard: 200 = 2%)
V4_FEE_BPS=200
```

#### Legacy Configuration (optional, für Regressionstests)

```bash
# Legacy v3.0 (nur falls Legacy-Protokoll aktiviert)
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
BASE_MAINNET_RPC_URL=https://mainnet.base.org
VESTING_CONTRACT_ADDRESS=0x...  # Falls Legacy verwendet wird
VESTING_CONTRACT_ADDRESS_TESTNET=0x...  # Falls Legacy verwendet wird
FOUNDATION_WALLET_PRIVATE_KEY=0x...  # Falls Legacy verwendet wird
```

**Checklist:**
- [ ] Alle Core-Service-Variablen gesetzt
- [ ] Alle V4-Protokoll-Variablen gesetzt
- [ ] Contract-Adressen aus Phase 1.4 eingetragen
- [ ] Private Keys sicher gespeichert (nur in DigitalOcean, nicht in Git!)
- [ ] Feature Flags korrekt gesetzt

### 2.3 Build & Deploy Settings

**Settings → App Spec:**

Stelle sicher, dass folgende Konfiguration aktiv ist:

```yaml
name: crowdstaking-platform
region: fra1  # Frankfurt
services:
  - name: web
    source_dir: /
    github:
      repo: crowdstaking-org/crowdstaking-platform
      branch: main
      deploy_on_push: true
    build_command: npm run build
    run_command: npm start
    environment_slug: node-js
    instance_count: 1
    instance_size_slug: basic-xxs  # 512MB RAM, 1 vCPU (~$5/month)
    envs:
      - key: NODE_ENV
        value: production
      # Weitere ENV-Vars werden über UI gesetzt
    health_check:
      http_path: /
      initial_delay_seconds: 10
      period_seconds: 10
      timeout_seconds: 5
      success_threshold: 1
      failure_threshold: 3
```

**Checklist:**
- [ ] Build-Command: `npm run build`
- [ ] Run-Command: `npm start`
- [ ] Health-Check konfiguriert
- [ ] Auto-Deploy bei Push zu `main` aktiviert

---

## 📋 Phase 3: GitHub Actions Setup (Optional, für Auto-Deploy)

### 3.1 GitHub Secrets konfigurieren

Gehe zu: https://github.com/crowdstaking-org/crowdstaking-platform/settings/secrets/actions

**Bereits vorhandene Secrets:**
- `DO_APP_ID`: `613df1af-5622-43a6-b599-39dca3c745e6`
- `DO_API_TOKEN`: `dop_v1_***...***`

**Checklist:**
- [ ] `DO_APP_ID` gesetzt
- [ ] `DO_API_TOKEN` gesetzt (mit "Read & Write" Berechtigung)

### 3.2 Auto-Deploy aktivieren

Die GitHub Actions Workflow-Datei (`.github/workflows/deploy.yml`) ist bereits konfiguriert.

**Automatisches Deployment:**
- Jeder Push zu `main` triggert automatisch ein Deployment
- Manuelles Deployment: GitHub Actions → "Run workflow"

**Checklist:**
- [ ] GitHub Actions Workflow aktiviert
- [ ] Secrets korrekt konfiguriert
- [ ] Test-Deployment erfolgreich

---

## 📋 Phase 4: Deployment ausführen

### 4.1 Option A: Automatisches Deployment (via GitHub)

```bash
# 1. Code committen
git add .
git commit -m "feat: v4.0 deployment ready"
git push origin main

# 2. GitHub Actions startet automatisch
# 3. Deployment wird in DigitalOcean ausgeführt
```

**Monitoring:**
- GitHub Actions: https://github.com/crowdstaking-org/crowdstaking-platform/actions
- DigitalOcean: https://cloud.digitalocean.com/apps/613df1af-5622-43a6-b599-39dca3c745e6

### 4.2 Option B: Manuelles Deployment (via DigitalOcean CLI)

```bash
# 1. doctl installieren (falls nicht vorhanden)
brew install doctl  # macOS
# Oder: https://docs.digitalocean.com/reference/doctl/how-to/install/

# 2. Authentifizieren
doctl auth init

# 3. Deployment triggern
doctl apps create-deployment 613df1af-5622-43a6-b599-39dca3c745e6 --wait
```

### 4.3 Option C: Manuelles Deployment (via DigitalOcean Dashboard)

1. Gehe zu: https://cloud.digitalocean.com/apps/613df1af-5622-43a6-b599-39dca3c745e6
2. Klicke auf **"Create Deployment"**
3. Warte auf Build-Completion

**Checklist:**
- [ ] Deployment erfolgreich gestartet
- [ ] Build-Logs zeigen keine Fehler
- [ ] Health-Check erfolgreich

---

## 📋 Phase 5: Post-Deployment Verification

### 5.1 Application Health Check

**URLs:**
- Production: https://crowdstaking-platform-uuex4.ondigitalocean.app
- Custom Domain: https://crowdstaking.org (falls konfiguriert)

**Checklist:**
- [ ] Homepage lädt ohne Fehler
- [ ] Keine 500-Errors in Browser-Console
- [ ] Keine JavaScript-Errors
- [ ] Health-Check zeigt "Healthy" in DigitalOcean Dashboard

### 5.2 V4 Protocol Features testen

#### 5.2.1 Projekt-Wizard

1. Navigiere zu: `/wizard/v4`
2. **Checklist:**
   - [ ] Wizard-Seite lädt
   - [ ] Feature Flag aktiviert (Wizard sichtbar)
   - [ ] Wallet-Connection funktioniert
   - [ ] Projekt kann erstellt werden

#### 5.2.2 Proposal-Erstellung

1. Navigiere zu: `/projects/[projectId]/proposals/v4/new`
2. **Checklist:**
   - [ ] Proposal-Seite lädt
   - [ ] Proposal-Typen können ausgewählt werden
   - [ ] Proposal kann erstellt werden

#### 5.2.3 Governance-UI

1. Navigiere zu: `/projects/[projectId]/proposals/v4/[proposalId]`
2. **Checklist:**
   - [ ] Proposal-Details werden angezeigt
   - [ ] Voting-Interface funktioniert
   - [ ] Votes werden on-chain gespeichert
   - [ ] Proposal-Execution funktioniert

#### 5.2.4 Partner Dashboard

1. Navigiere zu: `/dashboard/v4/partner`
2. **Checklist:**
   - [ ] Dashboard lädt
   - [ ] Shares werden angezeigt
   - [ ] SBTs werden angezeigt
   - [ ] Dividend-Claims funktionieren

#### 5.2.5 Dividend-Claim

1. Navigiere zu: `/dashboard/v4/partner`
2. **Checklist:**
   - [ ] Perioden werden angezeigt
   - [ ] Claim-Button funktioniert
   - [ ] Transaction wird signiert
   - [ ] Claim wird in DB gespeichert

### 5.3 API Endpoints testen

```bash
# Test: V4 Projects API
curl https://crowdstaking-platform-uuex4.ondigitalocean.app/api/v4/projects

# Test: V4 Partners API
curl https://crowdstaking-platform-uuex4.ondigitalocean.app/api/v4/partners/shares?walletAddress=0x...

# Test: Health Check
curl https://crowdstaking-platform-uuex4.ondigitalocean.app/api/health
```

**Checklist:**
- [ ] API-Endpunkte antworten
- [ ] Keine 500-Errors
- [ ] Response-Format korrekt

### 5.4 Monitoring & Logs

**DigitalOcean Logs:**
- Runtime Logs: https://cloud.digitalocean.com/apps/613df1af-5622-43a6-b599-39dca3c745e6/runtime_logs
- Build Logs: https://cloud.digitalocean.com/apps/613df1af-5622-43a6-b599-39dca3c745e6/deployments

**Checklist:**
- [ ] Keine kritischen Fehler in Logs
- [ ] Application läuft stabil
- [ ] Memory/CPU Usage im normalen Bereich

---

## 📋 Phase 6: Rollback (falls nötig)

### 6.1 Rollback via DigitalOcean Dashboard

1. Gehe zu: https://cloud.digitalocean.com/apps/613df1af-5622-43a6-b599-39dca3c745e6/deployments
2. Wähle eine vorherige, funktionierende Deployment-Version
3. Klicke auf **"Rollback to this deployment"**

### 6.2 Rollback via CLI

```bash
# Liste aller Deployments
doctl apps list-deployments 613df1af-5622-43a6-b599-39dca3c745e6

# Rollback zu spezifischer Deployment-ID
doctl apps create-deployment 613df1af-5622-43a6-b599-39dca3c745e6 --force-rebuild
```

**Checklist:**
- [ ] Rollback erfolgreich
- [ ] Application läuft wieder stabil
- [ ] Keine Datenverluste

---

## 🔧 Troubleshooting

### "V4_FACTORY_ADDRESS is not set"

**Problem:** Environment-Variable nicht gesetzt.

**Lösung:**
1. Gehe zu DigitalOcean → Settings → Environment Variables
2. Füge `V4_FACTORY_ADDRESS` hinzu (aus Phase 1.4)
3. Redeploy die App

### "V4_DEPLOYER_KEY is not set"

**Problem:** Deployer-Key nicht gesetzt.

**Lösung:**
1. Gehe zu DigitalOcean → Settings → Environment Variables
2. Füge `V4_DEPLOYER_KEY` hinzu (Private Key, NIEMALS COMMITTEN!)
3. Redeploy die App

### "Contract deployment failed"

**Problem:** Contract-Deployment schlägt fehl.

**Lösung:**
- Prüfe: Deployer-Wallet hat genug Gas
- Prüfe: RPC-URL ist korrekt
- Prüfe: Network ist korrekt (Base Sepolia vs. Mainnet)
- Prüfe: Hardhat-Logs für detaillierte Fehlermeldungen

### "Transaction failed"

**Problem:** On-chain Transaktionen schlagen fehl.

**Lösung:**
- Prüfe: Wallet hat genug Gas
- Prüfe: Contract-Adressen sind korrekt
- Prüfe: Feature Flag ist aktiviert
- Prüfe: RPC-URL ist erreichbar

### "Build failed"

**Problem:** Build-Prozess schlägt fehl.

**Lösung:**
- Prüfe: Build-Logs in DigitalOcean Dashboard
- Prüfe: Alle Dependencies in `package.json`
- Prüfe: Node.js Version (18+)
- Prüfe: Environment-Variablen sind gesetzt

### "Application not responding"

**Problem:** Application antwortet nicht.

**Lösung:**
- Prüfe: Health-Status in DigitalOcean Dashboard
- Prüfe: Runtime-Logs für Fehler
- Prüfe: Memory/CPU Usage
- Prüfe: Instance-Größe (evtl. upgraden)

### "Feature Flag not working"

**Problem:** V4-Features sind nicht sichtbar.

**Lösung:**
- Prüfe: `ENABLE_V4_PROTOCOL=true` ist gesetzt
- Prüfe: Application wurde nach ENV-Änderung redeployed
- Prüfe: Browser-Cache leeren
- Prüfe: Feature-Flag-Logik in Code

---

## 📚 Weitere Ressourcen

- **V4 Deployment Checklist:** `dev-docs/V4-DEPLOYMENT-CHECKLIST.md`
- **V4 Implementation Plan:** `dev-docs/V4-IMPLEMENTATION-PLAN.md`
- **V4 Implementation Summary:** `dev-docs/V4-IMPLEMENTATION-SUMMARY.md`
- **V4 Final Status:** `dev-docs/V4-FINAL-STATUS.md`
- **Deployment Scripts:** `hardhat/scripts/README.md`
- **General Deployment Guide:** `dev-docs/DEPLOYMENT.md`

---

## ✅ Deployment-Status

**Letzte Aktualisierung:** 2025-01-XX

**Status:** 🟡 **BEREIT FÜR DEPLOYMENT**

Nach erfolgreichem Deployment: 🟢 **PRODUCTION-READY**

---

## 📝 Deployment-Checkliste (Quick Reference)

### Pre-Deployment
- [ ] Smart Contracts deployed (Phase 1)
- [ ] Contract-Adressen gespeichert
- [ ] Contracts auf Basescan verifiziert

### DigitalOcean Configuration
- [ ] Environment-Variablen gesetzt (Phase 2)
- [ ] V4-Protokoll-Variablen konfiguriert
- [ ] Private Keys sicher gespeichert
- [ ] Feature Flags aktiviert

### Deployment
- [ ] Deployment ausgeführt (Phase 4)
- [ ] Build erfolgreich
- [ ] Health-Check erfolgreich

### Post-Deployment
- [ ] Application Health Check (Phase 5.1)
- [ ] V4 Features getestet (Phase 5.2)
- [ ] API Endpoints getestet (Phase 5.3)
- [ ] Monitoring konfiguriert (Phase 5.4)

---

**🎉 Deployment erfolgreich!**

Die CrowdStaking v4.0 Platform ist jetzt live auf DigitalOcean App Platform.

