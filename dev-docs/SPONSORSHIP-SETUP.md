# ThirdWeb Sponsored Transactions - Setup Anleitung

**Datum:** 2025-11-12  
**Status:** Code implementiert - ThirdWeb Dashboard Konfiguration erforderlich

---

## Was wurde implementiert?

✅ **Smart Account mit `sponsorGas: true`** aktiviert in `src/lib/thirdweb.ts`  
✅ **Frontend Token-Deployment** implementiert in `src/lib/contracts/deployToken.ts`  
✅ **useLaunchMission** updated, nutzt jetzt Smart Account  
✅ **Backend-Route** vereinfacht, nur noch Validierung  

---

## Was du jetzt tun musst:

### Schritt 1: ThirdWeb Dashboard Login

1. **Gehe zu:** https://thirdweb.com/dashboard/settings/gas
2. **Logge dich ein** mit deinem ThirdWeb Account

---

### Schritt 2: Sponsored Transactions aktivieren

**Im Dashboard:**

1. **Navigiere zu:** Settings → Gas (oder direkt: https://thirdweb.com/dashboard/settings/gas)
2. **Aktiviere:** "Sponsor Transactions"
3. **Wähle Chain:** Base Sepolia (Testnet)
4. **Status:** Enabled

---

### Schritt 3: Sponsorship Rules konfigurieren

**Setze folgende Limits:**

1. **Global Spend Limit:**
   - $100/month (für Testing ausreichend)

2. **Per-Transaction Limit:**
   - $5.00 (hohe Token-Deployment-Kosten)

3. **Contract Types:**
   - TokenERC20
   - ERC20

4. **Rate Limiting:**
   - 10 Deployments pro Stunde (verhindert Missbrauch)

---

### Schritt 4: Test Deployment

**Nach der Konfiguration:**

1. Klicke auf "Test" im Dashboard
2. Wähle eine Test-Transaktion (z.B. Token Transfer)
3. **Erwartung:** Dashboard zeigt "Sponsored Transaction Successful"

---

### Alternative: Über Account Abstraction Settings

**Wenn Gas Settings nicht verfügbar:**

1. Gehe zu: **Settings → Account Abstraction**
2. Aktiviere: **"Enable Sponsored Transactions"**
3. Chain: **Base Sepolia**
4. Paymaster Settings:
   - Spend Limit: $100/month
   - Per-TX Limit: $5

---

## Wie funktioniert es?

### Smart Account

Deine In-App-Wallet wird automatisch zu einem **Smart Account (EIP-4337)**:

- In-App-Wallet = Owner (deine Google-Wallet)
- Smart Account = Contract auf der Blockchain
- User signiert Transaktionen
- ThirdWeb Paymaster zahlt Gas

### Flow

```
User (In-App-Wallet)
  ↓ signiert
Smart Account (Contract)
  ↓ sendet TX
ThirdWeb Bundler
  ↓ sponsort Gas
ThirdWeb Paymaster
  ↓ zahlt Gas
Blockchain (Base Sepolia)
```

---

## Nach der Konfiguration

### Nächste Schritte:

1. ✅ Sponsorship aktiviert im Dashboard
2. ⏳ Lokales Testing mit In-App-Wallet
3. ⏳ Code committen & pushen
4. ⏳ Live-Testing auf crowdstaking.org

---

## Kosten

**Testnet (Base Sepolia):**
- Komplett KOSTENLOS
- ThirdWeb sponsert alle Testnet-Transaktionen gratis

**Mainnet (später):**
- ~$2-5 pro Token-Deployment
- Wird gegen dein ThirdWeb Account abgerechnet
- First $100/month oft im Free Tier inklusive

---

## Wichtig!

**User braucht KEIN ETH:**
- In-App-Wallet bleibt bei 0 ETH
- ThirdWeb zahlt alle Gas-Fees
- User signiert nur Transaktionen (keine Kosten!)

**Das war das Ziel!** ✅

---

## Troubleshooting

**Dashboard zeigt "Sponsored Transactions" nicht:**
→ Verwende "Account Abstraction" Settings stattdessen

**"Insufficient Funds" Fehler:**
→ Prüfe ThirdWeb Account Balance
→ Füge Credits hinzu

**Test-Transaction schlägt fehl:**
→ Prüfe ob Base Sepolia richtig ausgewählt ist
→ Prüfe Spend Limits

---

## Dokumentation

Offizielle ThirdWeb Docs:
- [Sponsored Transactions](https://portal.thirdweb.com/react/v5/in-app-wallet/enable-gasless)
- [Account Abstraction](https://portal.thirdweb.com/account-abstraction)
- [Smart Accounts](https://portal.thirdweb.com/smart-wallet)

---

**Sobald du die Dashboard-Konfiguration abgeschlossen hast, können wir mit dem Testing fortfahren!** 🚀



