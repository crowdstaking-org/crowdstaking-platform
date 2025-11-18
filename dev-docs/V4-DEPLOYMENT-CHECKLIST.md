# CrowdStaking v4.0 – Deployment-Checkliste

**Datum:** 2025-01-XX  
**Status:** ✅ Implementierung abgeschlossen, bereit für Deployment

---

## 🎯 Übersicht

Diese Checkliste führt durch den vollständigen Deployment-Prozess für CrowdStaking v4.0. Folge den Schritten in der angegebenen Reihenfolge.

**Geschätzte Zeit:** 2-4 Stunden (erste Deployment)

---

## 📋 Phase 1: Environment Variables Setup

### 1.1 V4-Protokoll Environment Variables

Füge diese Variablen zu `.env.local` hinzu (oder in deiner Hosting-Plattform):

```bash
# ============================================
# V4 PROTOCOL CONFIGURATION
# ============================================

# Feature Flags
ENABLE_V4_PROTOCOL=true
ENABLE_LEGACY_PROTOCOL=true  # Optional: false, um Legacy zu deaktivieren

# Blockchain Configuration
V4_DEPLOY_RPC_URL=https://sepolia.base.org  # Oder Base Mainnet
V4_CHAIN_ID=84532  # Base Sepolia: 84532, Base Mainnet: 8453

# Contract Addresses (werden nach Deployment gesetzt)
V4_FACTORY_ADDRESS=0x...  # Wird nach Factory-Deployment gesetzt
V4_TREASURY_ADDRESS=0x...  # Wird nach Treasury-Deployment gesetzt
V4_PAYOUT_TOKEN_ADDRESS=0x...  # Mock-Token oder echte Token-Adresse
V4_CAPITAL_TOKEN_ADDRESS=0x...  # Mock-Token oder echte Token-Adresse

# Deployer Wallet (für Server-seitige Transaktionen)
V4_DEPLOYER_KEY=0x...  # Private Key (NIEMALS COMMITTEN!)

# Oracle Configuration (optional, für Capital-Events)
V4_ORACLE_SECRET=your_hmac_secret_here  # Für HMAC-Verifikation

# Fee Configuration (optional, Standard: 200 = 2%)
V4_FEE_BPS=200
```

### 1.2 Bestehende Environment Variables

Stelle sicher, dass diese bereits gesetzt sind:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # Server-side only

# ThirdWeb
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_client_id_here

# App URL
NEXT_PUBLIC_APP_URL=https://your-app-url.com
```

**Checklist:**
- [ ] Alle V4-Environment-Variablen vorbereitet (Adressen werden nach Deployment gesetzt)
- [ ] `V4_DEPLOYER_KEY` sicher gespeichert (nicht in Git!)
- [ ] `V4_ORACLE_SECRET` generiert (falls Oracle verwendet wird)
- [ ] Bestehende ENV-Vars verifiziert

---

## 📋 Phase 2: Smart Contract Deployment

### 2.1 Vorbereitung

**Voraussetzungen:**
- Node.js und npm installiert
- Hardhat konfiguriert
- Deployer-Wallet mit ausreichend Gas (ETH auf Base Sepolia/Mainnet)

**Checklist:**
- [ ] Hardhat-Dependencies installiert: `npm install`
- [ ] Deployer-Wallet erstellt/importiert
- [ ] Deployer-Wallet mit Gas gefüllt (für Testnet: Faucet verwenden)
- [ ] `.env` Datei im Projekt-Root erstellt (für Hardhat)

### 2.2 Hardhat Environment Variables

Erstelle `.env` im Projekt-Root (separat von `.env.local`):

```bash
# Hardhat Deployment Configuration
DEPLOYER_PRIVATE_KEY=0x...  # Deployer-Wallet Private Key

# Optional: Custom RPC URLs
SEPOLIA_RPC_URL=https://rpc.sepolia.org
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
BASE_RPC_URL=https://mainnet.base.org
```

### 2.3 Deployment-Reihenfolge

#### Schritt 1: Treasury deployen

```bash
npm run deploy:v4:treasury -- --network baseSepolia
```

**Output speichern:**
- Treasury-Adresse: `V4_TREASURY_ADDRESS=0x...`

**Checklist:**
- [ ] Treasury erfolgreich deployed
- [ ] Contract auf Basescan verifiziert
- [ ] Treasury-Adresse in `.env.local` gesetzt

#### Schritt 2: Mock-Tokens deployen (nur Testnet)

```bash
npm run deploy:v4:tokens -- --network baseSepolia
```

**Output speichern:**
- Payout-Token-Adresse: `V4_PAYOUT_TOKEN_ADDRESS=0x...`
- Capital-Token-Adresse: `V4_CAPITAL_TOKEN_ADDRESS=0x...`

**Checklist:**
- [ ] Mock-Tokens erfolgreich deployed
- [ ] Contracts auf Basescan verifiziert
- [ ] Token-Adressen in `.env.local` gesetzt

**Hinweis:** Für Mainnet verwende echte Token-Adressen (z.B. USDC).

#### Schritt 3: Factory deployen

```bash
npm run deploy:v4:factory -- --network baseSepolia
```

**Benötigt:**
- Treasury-Adresse (aus Schritt 1)
- Payout-Token-Adresse (aus Schritt 2 oder ENV)
- Capital-Token-Adresse (aus Schritt 2 oder ENV)
- Fee in Basis-Punkten (Standard: 200 = 2%)

**Output speichern:**
- Factory-Adresse: `V4_FACTORY_ADDRESS=0x...`

**Checklist:**
- [ ] Factory erfolgreich deployed
- [ ] Contract auf Basescan verifiziert
- [ ] Factory-Adresse in `.env.local` gesetzt
- [ ] Factory-Konfiguration verifiziert (Treasury, Tokens, Fee)

#### Alternative: Alles auf einmal deployen

```bash
npm run deploy:v4 -- --network baseSepolia
```

Dieses Skript deployed automatisch in der richtigen Reihenfolge:
1. Treasury
2. Mock-Tokens (falls nicht via ENV bereitgestellt)
3. Factory

**Checklist:**
- [ ] Alle Contracts erfolgreich deployed
- [ ] Alle Contracts auf Basescan verifiziert
- [ ] Alle Adressen in `.env.local` gesetzt

---

## 📋 Phase 3: Application Configuration

### 3.1 Environment Variables finalisieren

Nach dem Contract-Deployment alle Adressen in `.env.local` setzen:

```bash
# Nach Deployment gesetzt:
V4_FACTORY_ADDRESS=0x...  # Aus deploy-all.ts Output
V4_TREASURY_ADDRESS=0x...  # Aus deploy-all.ts Output
V4_PAYOUT_TOKEN_ADDRESS=0x...  # Aus deploy-all.ts Output
V4_CAPITAL_TOKEN_ADDRESS=0x...  # Aus deploy-all.ts Output
```

### 3.2 Feature Flag aktivieren

```bash
ENABLE_V4_PROTOCOL=true
```

### 3.3 Application neu starten

```bash
# Development
npm run dev

# Production Build
npm run build
npm start
```

**Checklist:**
- [ ] Alle Environment-Variablen gesetzt
- [ ] Feature Flag aktiviert
- [ ] Application startet ohne Fehler
- [ ] Keine "V4_* is not set" Errors in Logs

---

## 📋 Phase 4: Testing & Verification

### 4.1 Contract-Verification

**Checklist:**
- [ ] Treasury auf Basescan verifiziert
- [ ] Factory auf Basescan verifiziert
- [ ] Mock-Tokens auf Basescan verifiziert (falls verwendet)
- [ ] Alle Contracts haben korrekte Owner/Controller

### 4.2 API-Tests

```bash
npm run test
```

**Checklist:**
- [ ] Alle API-Tests bestehen (22 Tests)
- [ ] Keine Fehler in Test-Logs

### 4.3 Frontend-Flow-Tests

**Manuelle Tests:**

1. **Projekt-Wizard:**
   - [ ] `/wizard/v4` erreichbar
   - [ ] Wizard-Flow funktioniert (Welcome → Details → Review)
   - [ ] Projekt wird erfolgreich erstellt
   - [ ] Contracts werden on-chain deployed

2. **Proposal-Erstellung:**
   - [ ] `/projects/[id]/proposals/v4/new` erreichbar
   - [ ] Proposal-Typen können ausgewählt werden
   - [ ] Proposal wird erfolgreich erstellt

3. **Voting:**
   - [ ] `/projects/[id]/proposals/v4/[proposalId]` erreichbar
   - [ ] Voting-Interface funktioniert
   - [ ] Votes werden on-chain gespeichert

4. **Proposal-Execution:**
   - [ ] Proposal kann ausgeführt werden
   - [ ] On-chain Execution funktioniert

5. **Partner Dashboard:**
   - [ ] `/dashboard/v4/partner` erreichbar
   - [ ] Shares werden angezeigt
   - [ ] SBTs werden angezeigt
   - [ ] Dividend-Claims funktionieren

6. **Dividend-Claim:**
   - [ ] Perioden werden angezeigt
   - [ ] Claim-Button funktioniert
   - [ ] Transaction wird signiert
   - [ ] Claim wird in DB gespeichert

**Checklist:**
- [ ] Alle Frontend-Flows getestet
- [ ] Keine JavaScript-Errors in Browser-Console
- [ ] Wallet-Integration funktioniert
- [ ] On-chain Transaktionen funktionieren

---

## 📋 Phase 5: Production Deployment

### 5.1 Pre-Deployment Checks

**Checklist:**
- [ ] Alle Environment-Variablen in Hosting-Plattform gesetzt
- [ ] Private Keys sicher gespeichert (nicht in Git!)
- [ ] Contracts auf Mainnet deployed (falls Production)
- [ ] Feature Flag aktiviert
- [ ] Monitoring/Logging konfiguriert

### 5.2 Deployment

**Vercel:**
```bash
vercel --prod
```

**Andere Plattformen:**
- Environment-Variablen in Hosting-Dashboard setzen
- Build und Deploy ausführen

**Checklist:**
- [ ] Deployment erfolgreich
- [ ] Application läuft ohne Fehler
- [ ] v4-Routen erreichbar
- [ ] Feature Flag aktiviert

### 5.3 Post-Deployment Verification

**Checklist:**
- [ ] Homepage lädt
- [ ] `/wizard/v4` erreichbar
- [ ] Wallet-Connection funktioniert
- [ ] Keine 500-Errors in Logs
- [ ] Monitoring zeigt keine kritischen Fehler

---

## 🔧 Troubleshooting

### "V4_FACTORY_ADDRESS is not set"

→ Environment-Variable nicht gesetzt. Prüfe `.env.local` oder Hosting-Plattform.

### "V4_DEPLOYER_KEY is not set"

→ Deployer-Key nicht gesetzt. Stelle sicher, dass er in `.env.local` ist (nicht in Git!).

### "Contract deployment failed"

→ Prüfe:
- Deployer-Wallet hat genug Gas
- RPC-URL ist korrekt
- Network ist korrekt (Base Sepolia vs. Mainnet)

### "Transaction failed"

→ Prüfe:
- Wallet hat genug Gas
- Contract-Adressen sind korrekt
- Feature Flag ist aktiviert

### "Proposal execution failed"

→ Prüfe:
- Proposal-Status ist "approved"
- Voting-Deadline ist abgelaufen
- Quorum/Threshold sind erfüllt

---

## 📚 Weitere Ressourcen

- **Implementierungsplan:** `dev-docs/V4-IMPLEMENTATION-PLAN.md`
- **Implementierungs-Zusammenfassung:** `dev-docs/V4-IMPLEMENTATION-SUMMARY.md`
- **Finaler Status:** `dev-docs/V4-FINAL-STATUS.md`
- **Environment-Variablen:** `dev-docs/PHASE-5-ENV-VARS.md`
- **Deployment-Scripts:** `hardhat/scripts/README.md`

---

## ✅ Deployment-Status

**Letzte Aktualisierung:** 2025-01-XX

**Status:** 🟡 **BEREIT FÜR DEPLOYMENT**

Nach erfolgreichem Deployment: 🟢 **PRODUCTION-READY**


