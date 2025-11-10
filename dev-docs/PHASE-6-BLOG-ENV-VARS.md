# Phase 6 Environment Variables - Blog System

## Super-Admin Konfiguration

### SUPER_ADMIN_EMAILS

**Beschreibung:** Komma-getrennte Liste von Email-Adressen, die Super-Admin-Zugriff auf das Blog-System haben.

**Erforderlich für:**
- Zugriff auf `/admin/blog` (Blog Management Dashboard)
- Erstellen, Bearbeiten und Löschen von Blog-Posts
- Verwaltung aller Blog-Posts (inkl. Drafts)

**Format:** Komma-getrennte Email-Adressen (case-insensitive)

**Beispiel:**
```bash
SUPER_ADMIN_EMAILS=dispatcher@crowdstaking.org,th@consensus.ventures
```

**Wie es funktioniert:**

1. User verbindet Wallet über ThirdWeb Login
2. User setzt Email in seinem Profil (in `profiles` Tabelle)
3. Beim Zugriff auf `/admin/blog` wird geprüft:
   - Ist User authentifiziert?
   - Hat User eine Email im Profil?
   - Ist diese Email in `SUPER_ADMIN_EMAILS`?
4. Nur bei allen 3 Bedingungen: Zugriff erlaubt

**Setup-Schritte:**

### 1. Environment Variable setzen

In `.env.local`:
```bash
# Blog System Super-Admins (komma-getrennt)
SUPER_ADMIN_EMAILS=deine-email@example.com,admin@crowdstaking.org
```

### 2. Email im Profil setzen

Nach dem ersten Login muss die Email in der Datenbank gesetzt werden:

```sql
-- In Supabase SQL Editor ausführen:
UPDATE profiles 
SET email = 'deine-email@example.com'
WHERE wallet_address = '0xYOUR_WALLET_ADDRESS';
```

**Oder** direkt in Supabase Table Editor:
1. Gehe zu Table Editor → `profiles`
2. Finde deine Wallet Address
3. Setze das `email` Feld
4. Save

### 3. Zugriff testen

1. Navigiere zu: `http://localhost:3000/admin/blog`
2. Bei Erfolg: Blog Management Dashboard wird angezeigt
3. Bei Fehler: "Zugriff verweigert - Super-Admin-Zugriff erforderlich"

## Sicherheitshinweise

⚠️ **Wichtig:**

1. **Niemals in Git committen!** Die `.env.local` ist in `.gitignore`
2. **Verwende echte Emails** - Diese werden mit den Profilen verglichen
3. **Case-insensitive** - "Admin@Example.com" = "admin@example.com"
4. **Leerzeichen werden entfernt** - "email1@test.com, email2@test.com" funktioniert
5. **Keine Wildcards** - Jede Email muss explizit aufgelistet werden

## Unterschied zu ADMIN_WALLET_ADDRESS

| Feature | ADMIN_WALLET_ADDRESS | SUPER_ADMIN_EMAILS |
|---------|---------------------|-------------------|
| **Zweck** | Proposal Review & Management | Blog System Management |
| **Zugriff auf** | `/admin/proposals` | `/admin/blog` |
| **Identifikation** | Wallet Address | Email in Profil |
| **Format** | Komma-getrennte Adressen | Komma-getrennte Emails |
| **Seit** | Phase 4 | Phase 6 |

## Troubleshooting

### "SUPER_ADMIN_EMAILS not set in environment"

**Ursache:** Environment Variable fehlt in `.env.local`

**Lösung:**
```bash
# In .env.local hinzufügen:
SUPER_ADMIN_EMAILS=deine-email@example.com
```

### "Zugriff verweigert" trotz korrekter Email

**Mögliche Ursachen:**

1. **Email nicht im Profil gesetzt:**
   ```sql
   SELECT wallet_address, email 
   FROM profiles 
   WHERE wallet_address = '0xYOUR_ADDRESS';
   ```

2. **Tippfehler in .env.local:**
   - Überprüfe Schreibweise
   - Keine Anführungszeichen nötig
   - Kommas ohne Leerzeichen (oder mit - werden automatisch entfernt)

3. **Server nicht neu gestartet:**
   ```bash
   # Nach Änderung der .env.local:
   npm run dev
   ```

4. **Falsches Profil:**
   - Stelle sicher, dass du mit der richtigen Wallet eingeloggt bist
   - Email muss zu dieser Wallet gehören

## Best Practices

### Für Entwicklung
```bash
# .env.local
SUPER_ADMIN_EMAILS=dev@localhost,test@localhost
```

### Für Produktion
```bash
# .env.local (auf Server)
SUPER_ADMIN_EMAILS=dispatcher@crowdstaking.org,th@consensus.ventures
```

### Für Team-Setup
```bash
# Mehrere Admins möglich:
SUPER_ADMIN_EMAILS=admin1@company.com,admin2@company.com,admin3@company.com
```

## Migration zu SUPER_ADMIN_EMAILS

Falls du vorher hardcoded Emails hattest:

```typescript
// ❌ ALT (hardcoded):
const superAdminEmails = [
  'dispatcher@crowdstaking.org',
  'th@consensus.ventures'
]

// ✅ NEU (konfigurierbar):
const superAdminEmailsEnv = process.env.SUPER_ADMIN_EMAILS
const superAdminEmails = superAdminEmailsEnv.split(',').map(e => e.trim())
```

---

**Letzte Aktualisierung:** 2025-11-10 (Phase 6 - Blog System Implementation)

