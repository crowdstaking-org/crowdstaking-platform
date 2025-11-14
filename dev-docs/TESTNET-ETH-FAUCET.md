# Base Sepolia Testnet ETH Faucet

## Foundation Wallet Address
```
0x252825B2DD9d4ea3489070C09Be63ea18879E5ab
```

## Faucets für Base Sepolia ETH

### Option 1: Coinbase Faucet (Empfohlen)
1. Gehe zu: https://portal.cdp.coinbase.com/products/faucet
2. Wähle "Base Sepolia" Network
3. Füge Wallet Address ein: `0x252825B2DD9d4ea3489070C09Be63ea18879E5ab`
4. Klicke "Get ETH"
5. Du erhältst ~0.1 ETH auf Base Sepolia

### Option 2: Alchemy Faucet
1. Gehe zu: https://www.alchemy.com/faucets/base-sepolia
2. Verbinde deine Wallet oder füge die Address ein
3. Fordere Testnet ETH an

### Option 3: QuickNode Faucet
1. Gehe zu: https://faucet.quicknode.com/base/sepolia
2. Füge Wallet Address ein
3. Löse Captcha
4. Erhalte Testnet ETH

### Option 4: Sepolia Bridge (braucht Sepolia ETH)
Falls du bereits Sepolia ETH hast:
1. Gehe zu: https://bridge.base.org/
2. Wähle "Sepolia → Base Sepolia"
3. Bridge dein ETH

## Aktueller Status

**Wallet:** `0x252825B2DD9d4ea3489070C09Be63ea18879E5ab`  
**Network:** Base Sepolia (Chain ID: 84532)  
**Balance:** 0 ETH ❌  
**Benötigt:** ~0.05 ETH für Contract Deployments

## Nach dem Erhalten von Testnet ETH

Führe aus:
```bash
# Prüfe Balance
curl -X GET "http://localhost:3000/api/check-balance?address=0x252825B2DD9d4ea3489070C09Be63ea18879E5ab&chainId=84532"
```

Oder sage mir Bescheid, und ich deploye dann automatisch die Contracts mit den ThirdWeb MCP Tools!

## Deployment Plan (nach Testnet ETH)

1. ✅ Deploy ERC20 $CSTAKE Token
2. ✅ Deploy VestingContract  
3. ✅ Approve VestingContract to spend tokens
4. ✅ Update .env.local
5. ✅ Test complete flow

Alles wird automatisch mit ThirdWeb API gemacht! 🚀






