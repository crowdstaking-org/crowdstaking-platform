# CrowdStaking v4.0 – DigitalOcean Setup Anleitung

**Datum:** 2025-01-XX  
**Status:** 🟡 **Bereit zum Konfigurieren**

---

## ✅ Was bereits erledigt ist

1. **Smart Contracts deployed (Base Sepolia):**
   - ✅ Treasury: `0x2ca13F0c12fDdC9f9b5452c55d5d40858b91aE27`
   - ✅ Payout Token: `0xD3853D3526bD977268489CCe9136AADeb2c33438`
   - ✅ Capital Token: `0x927aC6159502a07e1dbF98B02dAd7079f1cDB49a`
   - ⚠️ Factory: Noch nicht deployed (zu groß, wird später optimiert)

2. **Code angepasst:**
   - ✅ Config-Funktion unterstützt optional Factory
   - ✅ Factory-Funktion gibt klare Fehlermeldung, wenn nicht deployed

---

## 📋 Schritt-für-Schritt Anleitung

### Schritt 1: Environment Variables in DigitalOcean setzen

1. **Gehe zu DigitalOcean Dashboard:**
   - URL: https://cloud.digitalocean.com/apps/613df1af-5622-43a6-b599-39dca3c745e6/settings
   - Navigiere zu **"Environment Variables"**

2. **Füge folgende Variablen hinzu:**

   **Feature Flags:**
   - `ENABLE_V4_PROTOCOL` = `true` (Scope: RUN_AND_BUILD_TIME)
   - `ENABLE_LEGACY_PROTOCOL` = `true` (Scope: RUN_AND_BUILD_TIME)

   **Blockchain Configuration:**
   - `V4_DEPLOY_RPC_URL` = `https://sepolia.base.org` (Scope: RUN_AND_BUILD_TIME)
   - `V4_CHAIN_ID` = `84532` (Scope: RUN_AND_BUILD_TIME)

   **Contract Addresses:**
   - `V4_TREASURY_ADDRESS` = `0x2ca13F0c12fDdC9f9b5452c55d5d40858b91aE27` (Scope: RUN_AND_BUILD_TIME)
   - `V4_PAYOUT_TOKEN_ADDRESS` = `0xD3853D3526bD977268489CCe9136AADeb2c33438` (Scope: RUN_AND_BUILD_TIME)
   - `V4_CAPITAL_TOKEN_ADDRESS` = `0x927aC6159502a07e1dbF98B02dAd7079f1cDB49a` (Scope: RUN_AND_BUILD_TIME)
   - `V4_FACTORY_ADDRESS` = `0x0000000000000000000000000000000000000000` (Scope: RUN_AND_BUILD_TIME)

   **Deployer Wallet (WICHTIG - als SECRET!):**
   - `V4_DEPLOYER_KEY` = `<Private Key aus .env.local>` (Scope: RUN_TIME, **Type: SECRET**)

   **Optional:**
   - `V4_FEE_BPS` = `200` (Scope: RUN_AND_BUILD_TIME)
   - `V4_ORACLE_SECRET` = `<dein-hmac-secret>` (Scope: RUN_TIME, Type: SECRET, optional)

3. **V4_DEPLOYER_KEY finden:**
   ```bash
   # Im Projekt-Root ausführen:
   grep DEPLOYER_PRIVATE_KEY .env.local
   ```
   - Kopiere den vollständigen Key (66 Zeichen: `0x` + 64 hex chars)
   - Setze ihn in DigitalOcean als **SECRET** (Type: SECRET)

### Schritt 2: Deployment triggern

**Option A: Automatisch (via GitHub)**
```bash
git add .
git commit -m "feat: v4.0 deployment configuration"
git push origin main
# → GitHub Actions deployed automatisch
```

**Option B: Manuell (via DigitalOcean Dashboard)**
1. Gehe zu: https://cloud.digitalocean.com/apps/613df1af-5622-43a6-b599-39dca3c745e6
2. Klicke auf **"Create Deployment"**
3. Warte auf Build-Completion

**Option C: Via CLI**
```bash
doctl apps create-deployment 613df1af-5622-43a6-b599-39dca3c745e6 --wait
```

### Schritt 3: Verification

Nach dem Deployment:

1. **Prüfe Logs:**
   - DigitalOcean Dashboard → Runtime Logs
   - Suche nach Fehlern oder Warnungen

2. **Teste v4.0 Features:**
   - Homepage: https://crowdstaking.org
   - Partner Dashboard: https://crowdstaking.org/dashboard/v4/partner
   - Proposal-Erstellung: `/projects/[id]/proposals/v4/new` (funktioniert, aber Factory-Features deaktiviert)

3. **Erwartete Warnung:**
   - `⚠️ V4_FACTORY_ADDRESS not set - Factory features will be disabled until Factory is deployed`
   - Das ist normal und erwartet, da Factory noch nicht deployed ist

---

## ⚠️ Wichtige Hinweise

### Factory noch nicht deployed
- Die Factory ist zu groß für Base Sepolia (29191 bytes > 24576 bytes Limit)
- Die App funktioniert trotzdem:
  - ✅ Treasury, Tokens, Vaults funktionieren
  - ✅ Governance, Voting, Dividends funktionieren
  - ⚠️ Projekt-Erstellung über Factory ist deaktiviert (bis Factory deployed ist)

### V4_DEPLOYER_KEY Sicherheit
- ✅ Nur in DigitalOcean Secrets speichern
- ❌ NIEMALS in Git committen
- ❌ NIEMALS in Logs ausgeben
- ✅ Als SECRET-Type in DigitalOcean setzen

---

## 📝 Checkliste

- [ ] Alle Environment-Variablen in DigitalOcean gesetzt
- [ ] `V4_DEPLOYER_KEY` als SECRET gesetzt
- [ ] Deployment getriggert
- [ ] Logs geprüft (keine kritischen Fehler)
- [ ] v4.0 Features getestet
- [ ] Factory-Optimierung geplant (für später)

---

## 🔄 Nächste Schritte (nach Deployment)

1. **Factory optimieren:**
   - Contract weiter optimieren (Libraries, Aufteilung)
   - Oder auf Base Mainnet deployen (größeres Limit)

2. **Factory deployen:**
   - Nach Optimierung auf Base Sepolia deployen
   - `V4_FACTORY_ADDRESS` in DigitalOcean aktualisieren
   - App redeployen

3. **Vollständige v4.0 Features aktivieren:**
   - Projekt-Erstellung über Factory
   - Alle v4.0 Features vollständig funktionsfähig

---

## 📚 Weitere Ressourcen

- **Deployment Status:** `dev-docs/V4-DEPLOYMENT-STATUS.md`
- **Environment Variables:** `dev-docs/V4-DIGITALOCEAN-ENV-VARS.md`
- **Deployment Checklist:** `dev-docs/V4-DEPLOYMENT-CHECKLIST.md`
- **DigitalOcean Deployment Guide:** `dev-docs/V4-DIGITALOCEAN-DEPLOYMENT.md`



