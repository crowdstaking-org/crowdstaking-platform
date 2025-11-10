# Super-Admin Setup für Wallet 0x41533aB1Fd6B05DECDA46827b47170826199621D

## Schritt 1: Email in Supabase setzen

Gehe zu deinem **Supabase Dashboard**:
https://supabase.com/dashboard/project/zpzxmtrdlutikvgifhrc

### Option A: Via Table Editor (einfacher)
1. Navigiere zu: **Table Editor** → **profiles**
2. Suche nach Wallet: `0x41533ab1fd6b05decda46827b47170826199621d`
3. Klicke auf die Zeile
4. Setze `email` Feld auf: `dispatcher@crowdstaking.org`
5. Save

### Option B: Via SQL Editor
1. Navigiere zu: **SQL Editor**
2. "New Query"
3. Füge ein und führe aus:

```sql
-- Setze Super-Admin Email
UPDATE profiles 
SET email = 'dispatcher@crowdstaking.org'
WHERE wallet_address = '0x41533ab1fd6b05decda46827b47170826199621d';

-- Prüfe ob es funktioniert hat:
SELECT wallet_address, display_name, email 
FROM profiles 
WHERE wallet_address = '0x41533ab1fd6b05decda46827b47170826199621d';
```

### Falls Profil noch nicht existiert:

```sql
-- Erstelle Profil mit Email
INSERT INTO profiles (wallet_address, display_name, email)
VALUES (
  '0x41533ab1fd6b05decda46827b47170826199621d', 
  'Thomas Huhn', 
  'dispatcher@crowdstaking.org'
)
ON CONFLICT (wallet_address) 
DO UPDATE SET email = 'dispatcher@crowdstaking.org';

-- Verifiziere:
SELECT * FROM profiles WHERE wallet_address = '0x41533ab1fd6b05decda46827b47170826199621d';
```

## Schritt 2: Environment Variable prüfen

In deiner `.env.local` sollte stehen:

```bash
SUPER_ADMIN_EMAILS=dispatcher@crowdstaking.org,th@consensus.ventures
```

Falls nicht, füge es hinzu!

## Schritt 3: Server neu starten

```bash
cd /Users/thomashuhn/.cursor/worktrees/CS/LEBBn
npm run dev
```

## Schritt 4: Testen

1. Öffne: http://localhost:3000
2. Klicke "Login"
3. Verbinde mit Wallet: `0x41533aB1Fd6B05DECDA46827b47170826199621D`
4. Navigiere zu: http://localhost:3000/admin/blog
5. Du solltest jetzt Zugriff haben! ✅

---

**Deine Wallet-Adresse:** 0x41533aB1Fd6B05DECDA46827b47170826199621D
**Super-Admin Email:** dispatcher@crowdstaking.org

