# CrowdStaking v4.0 – Deployment Status

**Datum:** 2025-01-XX  
**Status:** 🟡 **Teilweise deployed**

---

## ✅ Erfolgreich deployed (Base Sepolia)

### Smart Contracts
- **CrowdStakingTreasury:** `0x2ca13F0c12fDdC9f9b5452c55d5d40858b91aE27`
- **MockERC20_Payout:** `0xD3853D3526bD977268489CCe9136AADeb2c33438`
- **MockERC20_Capital:** `0x927aC6159502a07e1dbF98B02dAd7079f1cDB49a`

### Deployment-Details
- **Network:** Base Sepolia (Chain ID: 84532)
- **Deployer:** `0xA79021eC2Bf5F6041065fF511EC43F9103dB6F27`
- **Basescan:** https://sepolia.basescan.org/address/0x2ca13F0c12fDdC9f9b5452c55d5d40858b91aE27

---

## ⚠️ Noch nicht deployed

### ProjectFactory
- **Status:** Zu groß für Base Sepolia (29191 bytes > 24576 bytes Limit)
- **Problem:** Contract-Size-Limit überschritten trotz Optimierungen
- **Lösung:** Wird später deployiert nach weiterer Optimierung oder auf Base Mainnet

---

## 📋 Environment Variables für DigitalOcean

### Bereits vorhanden (Core Services)
- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ✅ `SUPABASE_SERVICE_ROLE_KEY`
- ✅ `NEXT_PUBLIC_THIRDWEB_CLIENT_ID`
- ✅ `NEXT_PUBLIC_APP_URL`

### V4 Protocol (zu setzen)
```bash
# Feature Flags
ENABLE_V4_PROTOCOL=true
ENABLE_LEGACY_PROTOCOL=true

# Blockchain Configuration
V4_DEPLOY_RPC_URL=https://sepolia.base.org
V4_CHAIN_ID=84532

# Contract Addresses (aus Deployment)
V4_TREASURY_ADDRESS=0x2ca13F0c12fDdC9f9b5452c55d5d40858b91aE27
V4_PAYOUT_TOKEN_ADDRESS=0xD3853D3526bD977268489CCe9136AADeb2c33438
V4_CAPITAL_TOKEN_ADDRESS=0x927aC6159502a07e1dbF98B02dAd7079f1cDB49a
V4_FACTORY_ADDRESS=0x0000000000000000000000000000000000000000  # Placeholder - wird später gesetzt

# Deployer Wallet (benötigt)
V4_DEPLOYER_KEY=0x...  # Private Key (sicher speichern!)

# Optional
V4_ORACLE_SECRET=your_hmac_secret_here
V4_FEE_BPS=200
```

---

## 🔄 Nächste Schritte

1. **DigitalOcean Environment Variables setzen**
   - Alle V4-Variablen hinzufügen
   - `V4_DEPLOYER_KEY` sicher speichern

2. **Factory optimieren**
   - Contract weiter optimieren (Libraries, Aufteilung)
   - Oder auf Base Mainnet deployen

3. **App deployen**
   - DigitalOcean App mit v4.0 Konfiguration aktualisieren
   - Deployment triggern

---

## 📝 Notizen

- Factory kann später deployed werden, wenn optimiert
- App funktioniert ohne Factory (nur Factory-Features sind nicht verfügbar)
- Treasury und Tokens sind vollständig funktionsfähig


