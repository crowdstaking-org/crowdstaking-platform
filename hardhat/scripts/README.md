# v4 Contract Deployment Scripts

Deployment-Skripte für das CrowdStaking v4.0 Protocol.

## Übersicht

Die Skripte deployen die v4-Contracts in der richtigen Reihenfolge:

1. **CrowdStakingTreasury** - Plattform-Treasury für Fee-Sammlung
2. **MockERC20 Tokens** (optional) - Für Testnet/Local Development
3. **ProjectFactory** - Factory für per-project Contract-Suites

## Voraussetzungen

### Environment Variables

Erstelle eine `.env` Datei im Projekt-Root oder setze die folgenden Variablen:

```bash
# Deployer Wallet (Private Key)
DEPLOYER_PRIVATE_KEY=0x...

# Optional: RPC URLs (falls nicht Standard)
SEPOLIA_RPC_URL=https://rpc.sepolia.org
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
BASE_RPC_URL=https://mainnet.base.org

# Optional: V4-spezifische Konfiguration
V4_TREASURY_ADDRESS=0x...  # Falls Treasury bereits deployed
V4_PAYOUT_TOKEN=0x...      # Falls Token bereits deployed
V4_CAPITAL_TOKEN=0x...     # Falls Token bereits deployed
V4_FEE_BPS=200             # Fee in Basis-Punkten (200 = 2%)
```

## Verwendung

### Alle Contracts deployen (empfohlen)

```bash
npm run deploy:v4
```

Oder für ein spezifisches Netzwerk:

```bash
# Local Hardhat Network
npx hardhat run hardhat/scripts/deploy-all.ts

# Sepolia Testnet
npx hardhat run hardhat/scripts/deploy-all.ts --network sepolia

# Base Sepolia Testnet
npx hardhat run hardhat/scripts/deploy-all.ts --network baseSepolia

# Base Mainnet
npx hardhat run hardhat/scripts/deploy-all.ts --network base
```

### Einzelne Contracts deployen

```bash
# Nur Treasury
npm run deploy:v4:treasury

# Nur Factory (benötigt Treasury)
npm run deploy:v4:factory

# Nur Mock Tokens
npm run deploy:v4:tokens
```

## Deployment-Reihenfolge

Das `deploy-all.ts` Skript deployed automatisch in der richtigen Reihenfolge:

1. **CrowdStakingTreasury**
   - Owner: Deployer-Wallet
   - Keine Constructor-Parameter außer Owner

2. **MockERC20 Tokens** (nur wenn nicht via ENV bereitgestellt)
   - Payout Token (für ProfitVault)
   - Capital Token (für CapitalVault)

3. **ProjectFactory**
   - Treasury: Adresse von Schritt 1
   - Fee BPS: 200 (2%) - konfigurierbar via `V4_FEE_BPS`
   - Payout Token: Adresse von Schritt 2 oder ENV
   - Capital Token: Adresse von Schritt 2 oder ENV

## Deployment-Informationen

Alle Deployments werden in `hardhat/deployments/deployments.json` gespeichert:

```json
{
  "CrowdStakingTreasury": {
    "address": "0x...",
    "chainId": 84532,
    "network": "baseSepolia",
    "owner": "0x...",
    "deployedAt": "2025-01-XX..."
  },
  "ProjectFactory": {
    "address": "0x...",
    "chainId": 84532,
    "network": "baseSepolia",
    "treasury": "0x...",
    "feeBps": 200,
    "payoutToken": "0x...",
    "capitalToken": "0x...",
    "deployedAt": "2025-01-XX..."
  }
}
```

## Nach dem Deployment

Nach erfolgreichem Deployment werden die Contract-Adressen ausgegeben. Aktualisiere deine `.env.local`:

```bash
V4_TREASURY_ADDRESS=0x...
V4_PAYOUT_TOKEN=0x...
V4_CAPITAL_TOKEN=0x...
V4_FACTORY_ADDRESS=0x...
V4_FEE_BPS=200
V4_CHAIN_ID=84532
V4_DEPLOY_RPC_URL=https://sepolia.base.org
V4_DEPLOYER_KEY=0x...  # Private Key des Deployers
```

## Verifikation

Die Contracts können auf Block Explorers verifiziert werden:

- **Base Sepolia**: https://sepolia.basescan.org
- **Base Mainnet**: https://basescan.org
- **Sepolia**: https://sepolia.etherscan.io

```bash
npx hardhat verify --network baseSepolia <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

## Troubleshooting

### "Insufficient funds"
- Stelle sicher, dass das Deployer-Wallet genug ETH/Gas-Token hat
- Für Testnet: Nutze einen Faucet

### "Treasury address is required"
- Deploye zuerst die Treasury oder setze `V4_TREASURY_ADDRESS` in der ENV

### "Contract already deployed"
- Das Skript erkennt bereits deployed Contracts und überspringt sie
- Um neu zu deployen, lösche den Eintrag aus `deployments.json` oder deploye auf einem anderen Netzwerk

