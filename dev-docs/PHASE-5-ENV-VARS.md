# Phase 5 Environment Variables

> **Legacy Hinweis:** Diese Datei dokumentiert die `$CSTAKE` + `VestingContract` Umgebung aus Modell v3.0.  
> Für das Digitale Partnerschafts-Protokoll (v4.0) gelten neue Variablen (PartnerSBT, DividendVault, Oracle).  
> Belasse diese Werte nur für Regressionstests; produktive Deployments nutzen die unten ergänzten v4.0-Keys.

## Smart Contract Integration (Optional)

Diese Umgebungsvariablen werden für die Smart Contract Integration benötigt. Wenn sie nicht gesetzt sind, funktioniert die Anwendung normal, aber ohne Blockchain-Features.

### Testnet (Base Sepolia)

```bash
# RPC Endpoint für Base Sepolia
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org

# Deployed VestingContract Address auf Testnet
VESTING_CONTRACT_ADDRESS_TESTNET=0x...

# $CSTAKE Token Address auf Testnet
CSTAKE_TOKEN_ADDRESS_TESTNET=0x...

# Foundation Wallet Private Key (NIEMALS COMMITTEN!)
FOUNDATION_WALLET_PRIVATE_KEY=0x...
```

### Mainnet (Base)

```bash
# RPC Endpoint für Base Mainnet
BASE_MAINNET_RPC_URL=https://mainnet.base.org

# Deployed VestingContract Address auf Mainnet
VESTING_CONTRACT_ADDRESS=0x...

# $CSTAKE Token Address auf Mainnet  
CSTAKE_TOKEN_ADDRESS=0x...

# Foundation Wallet Private Key (NIEMALS COMMITTEN!)
FOUNDATION_WALLET_PRIVATE_KEY=0x...
```

## Modell 4.0 Environment Additions

| Zweck | Variable | Beschreibung |
|-------|----------|--------------|
| Soulbound Token Factory | `PARTNER_SBT_ADDRESS[_TESTNET]` | Adresse des PartnerSBT (ERC-5192, nicht transferierbar) |
| Dividendenvault Registry | `DIVIDEND_VAULT_REGISTRY_ADDRESS[_TESTNET]` | Registry für Share-Registration und Aktivierung |
| Vault RPC (optional) | `DIVIDEND_VAULT_RPC_URL` | Dedizierter RPC für Vault-Interaktionen (falls nicht Base) |
| Oracle Endpoint | `HONEST_FOUNDATION_ORACLE_URL` | HTTPS Endpoint für Open-Banking Events |
| Oracle Auth | `HONEST_FOUNDATION_WEBHOOK_SECRET` | Secret zur Signaturprüfung der Oracle-Calls |
| Honesty Bond Treasury | `HONESTY_BOND_TREASURY_ADDRESS` | Multisig, das Ehrlichkeits-Bonds verwaltet |
| Provider Auswahl | `OPEN_BANKING_PROVIDER` | `tink`, `finicity`, `plaid`, ... |

> ⚠️ **Migration:** Legacy-Variablen (`CSTAKE_*`, `VESTING_CONTRACT_*`) beibehalten nur für Regressionstests. Neue Deployments nutzen ausschließlich die Modell-4.0-Variablen.

## Deployment Steps (Manual via ThirdWeb)

### 1. Deploy Mock $CSTAKE Token (Testnet Only)

1. Gehe zu [ThirdWeb Dashboard](https://thirdweb.com/dashboard)
2. Navigiere zu "Deploy Contract"
3. Wähle "Token" (ERC20)
4. Konfiguration:
   - Name: CrowdStaking Test Token
   - Symbol: CSTAKE
   - Initial Supply: 1,000,000
   - Mint to: Foundation Wallet Address
5. Deploy to Base Sepolia
6. Kopiere Contract Address zu `CSTAKE_TOKEN_ADDRESS_TESTNET`

### 2. Deploy VestingContract

1. Gehe zu ThirdWeb Dashboard
2. Navigiere zu "Deploy Contract"
3. Wähle "Custom Contract"
4. Upload `contracts/VestingContract.sol`
5. Constructor Parameters:
   - `_cstakeToken`: CSTAKE_TOKEN_ADDRESS_TESTNET
   - `_foundationWallet`: Admin Wallet Address
6. Deploy to Base Sepolia
7. Verify on Basescan
8. Kopiere Contract Address zu `VESTING_CONTRACT_ADDRESS_TESTNET`

### 3. Approve VestingContract to Spend Tokens

Foundation Wallet muss VestingContract erlauben, Tokens auszugeben:

```javascript
// Mit ThirdWeb SDK oder Etherscan:
CSTAKE.approve(VESTING_CONTRACT_ADDRESS, MAX_UINT256)
```

## Testing Without Smart Contracts

Die Anwendung kann auch ohne Smart Contract Integration getestet werden:

- Proposals können erstellt, genehmigt und akzeptiert werden
- Status bleibt bei 'accepted' statt 'work_in_progress'
- Confirm Work und Release Tokens Buttons erscheinen nicht
- Normale Double Handshake Flow funktioniert

## Security Notes

⚠️ **FOUNDATION_WALLET_PRIVATE_KEY darf NIEMALS ins Repository committed werden!**

- Verwende .env.local (ist in .cursorignore und .gitignore)
- Für Production: Verwende sichere Key Management Lösungen
- Für Testnet: Verwende separate Wallet mit kleinen Mengen
- Rotiere Keys regelmäßig

## Troubleshooting

### "Vesting service not configured" Error

→ Umgebungsvariablen nicht gesetzt. Check .env.local

### "insufficient allowance" Error

→ Foundation Wallet muss VestingContract approve (siehe Schritt 3)

### "insufficient funds" Error

→ Foundation Wallet hat nicht genug $CSTAKE Tokens

### Transaction fails silently

→ Check Basescan für detaillierte Error Messages
→ Verify RPC_URL ist korrekt

