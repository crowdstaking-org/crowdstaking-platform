# V4.0 Environment Variables für DigitalOcean

**Datum:** 2025-01-XX  
**Status:** Bereit zum Setzen in DigitalOcean App Platform

---

## 📋 Environment Variables Liste

### V4 Protocol Configuration

```bash
# Feature Flags
ENABLE_V4_PROTOCOL=true
ENABLE_LEGACY_PROTOCOL=true

# Blockchain Configuration
V4_DEPLOY_RPC_URL=https://sepolia.base.org
V4_CHAIN_ID=84532

# Contract Addresses (Base Sepolia)
V4_TREASURY_ADDRESS=0x2ca13F0c12fDdC9f9b5452c55d5d40858b91aE27
V4_PAYOUT_TOKEN_ADDRESS=0xD3853D3526bD977268489CCe9136AADeb2c33438
V4_CAPITAL_TOKEN_ADDRESS=0x927aC6159502a07e1dbF98B02dAd7079f1cDB49a
V4_FACTORY_ADDRESS=0x0000000000000000000000000000000000000000  # Placeholder - wird später gesetzt

# Deployer Wallet (BENÖTIGT!)
V4_DEPLOYER_KEY=0x...  # Private Key aus .env.local

# Optional
V4_ORACLE_SECRET=your_hmac_secret_here
V4_FEE_BPS=200
```

---

## 🔐 V4_DEPLOYER_KEY

**WICHTIG:** Der Private Key muss sicher gespeichert werden!

1. Öffne `.env.local` im Projekt-Root
2. Suche nach `DEPLOYER_PRIVATE_KEY=0x...`
3. Kopiere den vollständigen Key (66 Zeichen: 0x + 64 hex chars)
4. Setze ihn in DigitalOcean als `V4_DEPLOYER_KEY` (als SECRET!)

**Sicherheit:**
- ✅ Nur in DigitalOcean Secrets speichern
- ❌ NIEMALS in Git committen
- ❌ NIEMALS in Logs ausgeben

---

## 📝 Anleitung zum Setzen in DigitalOcean

1. Gehe zu: https://cloud.digitalocean.com/apps/613df1af-5622-43a6-b599-39dca3c745e6/settings
2. Navigiere zu "Environment Variables"
3. Klicke auf "Add Variable" für jede Variable
4. Setze `V4_DEPLOYER_KEY` als **SECRET** (Type: SECRET)
5. Setze alle anderen Variablen als normale Environment Variables

---

## ⚠️ Hinweis zur Factory

Die Factory ist noch nicht deployed (zu groß für Base Sepolia). Die App funktioniert trotzdem:
- ✅ Treasury, Tokens, Vaults funktionieren
- ⚠️ Projekt-Erstellung über Factory ist deaktiviert (bis Factory deployed ist)
- ✅ Alle anderen v4.0 Features funktionieren

---

## ✅ Nach dem Setzen

1. Redeploy die App in DigitalOcean
2. Prüfe Logs auf Fehler
3. Teste v4.0 Features (außer Projekt-Erstellung)


