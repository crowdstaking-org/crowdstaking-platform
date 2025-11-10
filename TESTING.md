# Blog System Testing Guide

## ⚠️ WICHTIG: Worktree-Problem erkannt!

Der Next.js Server lädt Code aus dem falschen Worktree (`gWmvI` statt `LEBBn`).

**Lösungsvorschläge:**

### Option 1: Haupt-Projekt verwenden (Empfohlen)
```bash
# Kopiere alle Änderungen ins Haupt-Projekt
cd /Users/thomashuhn/Code/CS
git worktree list

# Merge den Worktree (wenn bereit)
# Oder kopiere die Dateien manuell
```

### Option 2: Next.js Config anpassen
Füge in `next.config.ts` hinzu:
```typescript
const config: NextConfig = {
  experimental: {
    turbo: {
      root: '/Users/thomashuhn/.cursor/worktrees/CS/LEBBn'
    }
  },
  // ... rest
}
```

### Option 3: Server mit absolutem Pfad starten
```bash
cd /Users/thomashuhn/.cursor/worktrees/CS/LEBBn
NODE_OPTIONS="--max-old-space-size=4096" \
  ./node_modules/.bin/next dev
```

## 🚀 Quick Start

### 1. Environment Setup

Die `.env.local` Datei **existiert bereits** im Worktree und enthält die Supabase Credentials.

**Füge jetzt die neue Variable hinzu:**

```bash
# Öffne .env.local und füge hinzu:
SUPER_ADMIN_EMAILS=dispatcher@crowdstaking.org,th@consensus.ventures
```

**Optional:** Füge deine eigene Email hinzu für Tests:
```bash
SUPER_ADMIN_EMAILS=dispatcher@crowdstaking.org,th@consensus.ventures,deine@email.com
```

### 2. Datenbank Setup

✅ **Migrationen bereits ausgeführt!** Die Tabellen sind bereit:
- `profiles.email` (hinzugefügt)
- `blog_posts` (neu erstellt)
- `blog_comments` (neu erstellt)

**Setze deine Super-Admin Email im Profil:**

1. Gehe zu [Supabase Dashboard](https://supabase.com/dashboard)
2. Wähle dein Projekt: "CrowdStaking"
3. Navigiere zu: Table Editor → `profiles`
4. Finde deine Wallet Address
5. Setze das `email` Feld auf eine der Emails aus `SUPER_ADMIN_EMAILS`
6. Save

**Oder per SQL:**
```sql
-- In Supabase SQL Editor:
UPDATE profiles 
SET email = 'dispatcher@crowdstaking.org'
WHERE wallet_address = '0xDEINE_WALLET_ADRESSE';
```

### 3. Server starten

```bash
cd /Users/thomashuhn/.cursor/worktrees/CS/LEBBn

# Server läuft bereits auf Port 3000!
# Falls nicht:
npm run dev
```

## 🧪 Testing Checkliste

### ✅ Phase 1: Navigation & Routing

1. **Startseite:**
   - [ ] Öffne: http://localhost:3000
   - [ ] "Blog" Link in Navigation sichtbar (zwischen "About" und "Dashboard")
   - [ ] Klicke auf "Blog" → Weiterleitung zu `/blog`

2. **Blog Übersicht:**
   - [ ] URL: http://localhost:3000/blog
   - [ ] Hero Section: "CrowdStaking Blog" angezeigt
   - [ ] Leerer Zustand: "Noch keine Blog-Posts" Message

### ✅ Phase 2: Admin Access

1. **Login mit Super-Admin Wallet:**
   - [ ] Klicke "Login" in Navigation
   - [ ] Verbinde Wallet (muss Email in Profil haben)
   - [ ] Navigiere zu: http://localhost:3000/admin/blog

2. **Admin Blog Management:**
   - [ ] Keine "Zugriff verweigert" Meldung
   - [ ] "Blog Management" Header angezeigt
   - [ ] "Neuer Post" Button vorhanden
   - [ ] Leere Tabelle (noch keine Posts)

### ✅ Phase 3: Blog Post erstellen

1. **Neuen Post erstellen:**
   - [ ] Klicke "Neuer Post" → `/admin/blog/new`
   - [ ] Formular wird geladen
   
2. **Formular ausfüllen:**
   ```
   Title: "Willkommen beim CrowdStaking Blog! 🚀"
   Content (Markdown):
   # Unser erster Blog-Post
   
   Willkommen zur **CrowdStaking Blog-Platform**!
   
   ## Was ist CrowdStaking?
   
   CrowdStaking revolutioniert die Art, wie *Startups finanziert* werden:
   
   - 💰 Keine Kapitalinvestitionen nötig
   - 🤝 Equity statt Gehalt
   - 🔄 Sofortige Liquidität
   
   ### Next Steps
   
   1. Browse Projects
   2. Submit Proposal
   3. Earn Equity
   
   [Learn more](/about)
   
   Tags: "Announcement,Web3,CrowdStaking,Launch"
   Status: "Published"
   ```

3. **Features testen:**
   - [ ] Slug Preview: "willkommen-beim-crowdstaking-blog"
   - [ ] Tags werden als Chips angezeigt
   - [ ] Klicke "Preview" → Modal öffnet sich mit gerenderten Markdown
   - [ ] Close Preview → Modal schließt
   - [ ] Character Counter funktioniert

4. **Post erstellen:**
   - [ ] Klicke "Post erstellen"
   - [ ] Loading State wird angezeigt
   - [ ] Weiterleitung zu `/admin/blog`
   - [ ] Post erscheint in der Tabelle mit:
     - ✅ Status: "Published" (grünes Badge)
     - ✅ Published Date: Heute
     - ✅ Views: 0
     - ✅ Tags: 4 Tags angezeigt

### ✅ Phase 4: Blog Post anzeigen

1. **Öffentliche Blog-Übersicht:**
   - [ ] Navigiere zu: http://localhost:3000/blog
   - [ ] Post-Card wird im Grid angezeigt
   - [ ] Card zeigt: Title, Excerpt, Author, Date, Tags, View Count
   - [ ] Klicke auf Card → Weiterleitung zu `/blog/willkommen-beim-crowdstaking-blog`

2. **Blog Post Detail:**
   - [ ] Title wird angezeigt
   - [ ] Author Info mit Avatar/Initialen
   - [ ] Published Date
   - [ ] Tags als Chips
   - [ ] View Count (sollte jetzt 1 sein!)
   - [ ] Markdown Content korrekt gerendert:
     - Headers (# ## ###)
     - Bold (**text**)
     - Italic (*text*)
     - Lists (- item)
     - Links ([text](url))

3. **Zurück-Navigation:**
   - [ ] "Zurück zum Blog" Link oben
   - [ ] Klicke darauf → Zurück zu `/blog`
   - [ ] View Count erhöht sich bei erneutem Besuch

### ✅ Phase 5: Kommentar-System

1. **Nicht eingeloggt:**
   - [ ] Navigiere zu Post-Detail
   - [ ] "Bitte verbinde dein Wallet" Message angezeigt
   - [ ] Kein Kommentar-Formular

2. **Einloggen:**
   - [ ] Klicke "Login" in Navigation
   - [ ] Verbinde Wallet
   - [ ] Zurück zur Post-Detail-Seite

3. **Kommentar schreiben:**
   - [ ] Kommentar-Formular erscheint
   - [ ] Schreibe Test-Kommentar:
     ```
     "Großartiger erster Post! Freue mich auf mehr Inhalte. 🎉"
     ```
   - [ ] Klicke "Kommentar absenden"
   - [ ] Loading State
   - [ ] Kommentar erscheint in der Liste mit:
     - ✅ Author Name
     - ✅ Avatar/Initialen
     - ✅ Timestamp
     - ✅ "Löschen" Button (nur bei eigenem Kommentar)

4. **Kommentar löschen:**
   - [ ] Klicke "Löschen" auf eigenem Kommentar
   - [ ] Bestätigungs-Modal erscheint
   - [ ] Klicke "Löschen" → Kommentar verschwindet
   - [ ] Klicke "Abbrechen" → Modal schließt, Kommentar bleibt

### ✅ Phase 6: Post bearbeiten

1. **Admin Dashboard:**
   - [ ] Navigiere zu: http://localhost:3000/admin/blog
   - [ ] Klicke "Edit" beim ersten Post
   - [ ] Formular mit vorausgefüllten Daten

2. **Post aktualisieren:**
   - [ ] Ändere Title zu: "Willkommen beim CrowdStaking Blog - Updated!"
   - [ ] Füge Tag hinzu: "Update"
   - [ ] Slug Preview ändert sich: "willkommen-beim-crowdstaking-blog-updated"
   - [ ] Klicke "Änderungen speichern"
   - [ ] Weiterleitung zu `/admin/blog`
   - [ ] Änderungen in der Tabelle sichtbar

3. **Status ändern (Draft/Published):**
   - [ ] Edit Post
   - [ ] Ändere Status zu "Draft"
   - [ ] Save
   - [ ] Post verschwindet aus `/blog` (öffentlich)
   - [ ] Post bleibt in `/admin/blog` sichtbar mit "Draft" Badge

### ✅ Phase 7: Post löschen

1. **Delete aus Admin:**
   - [ ] Gehe zu `/admin/blog`
   - [ ] Klicke "Delete" beim Post
   - [ ] Bestätigungs-Modal erscheint
   - [ ] Klicke "Löschen"
   - [ ] Post verschwindet aus Tabelle
   - [ ] Alle Kommentare werden CASCADE gelöscht

### ✅ Phase 8: Edge Cases

1. **Nicht-existierender Post:**
   - [ ] Navigiere zu: http://localhost:3000/blog/does-not-exist
   - [ ] 404 Seite mit "Post nicht gefunden"
   - [ ] "Zurück zum Blog" Button funktioniert

2. **Admin ohne Super-Admin Email:**
   - [ ] Logout
   - [ ] Login mit anderem Wallet (ohne Email in `.env.local`)
   - [ ] Navigiere zu `/admin/blog`
   - [ ] "Zugriff verweigert" Meldung

3. **Slug-Generierung:**
   - [ ] Erstelle Post mit Title: "Test Post!!! Mit Umlauten (ÄÖÜ)"
   - [ ] Slug sollte sein: "test-post-mit-umlauten-aeoeuee"

4. **Tag-Parsing:**
   - [ ] Tags: "Web3, DeFi,   Blockchain  , NFT" (mit Leerzeichen)
   - [ ] Sollte 4 saubere Tags ergeben

5. **Markdown-Rendering:**
   - [ ] Code Blocks
   - [ ] Listen (ordered/unordered)
   - [ ] Links
   - [ ] Bold/Italic
   - [ ] Headers

### ✅ Phase 9: Pagination

1. **Erstelle 5+ Posts:**
   - [ ] Über Admin erstellen
   - [ ] Alle als "Published"

2. **Test Pagination:**
   - [ ] Gehe zu `/blog`
   - [ ] Pagination Controls erscheinen (wenn >20 Posts)
   - [ ] "Weiter" Button funktioniert
   - [ ] "Zurück" Button funktioniert
   - [ ] Seitenzahl wird korrekt angezeigt

### ✅ Phase 10: Mobile Responsiveness

1. **Desktop (aktuell):**
   - [ ] Blog-Link in Desktop Navigation

2. **Mobile (< 768px):**
   - [ ] Resize Browser: Cmd+Opt+I → Device Toolbar → iPhone
   - [ ] Hamburger Menu
   - [ ] Klicke Menu → "Blog" Link vorhanden
   - [ ] Post Cards stapeln sich (1 Spalte)
   - [ ] Kommentar-Formular responsive

## 🐛 Troubleshooting

### "Zugriff verweigert" beim Admin-Bereich

**Checkliste:**
1. ✅ `SUPER_ADMIN_EMAILS` in `.env.local` gesetzt?
2. ✅ Email im Profil in Supabase gesetzt?
3. ✅ Server neu gestartet nach `.env.local` Änderung?
4. ✅ Mit dem richtigen Wallet eingeloggt?
5. ✅ Email stimmt überein (case-insensitive)?

**Debug:**
```bash
# Prüfe Server-Logs:
# Sollte sehen: "⚠️ SUPER_ADMIN_EMAILS not set" (wenn fehlt)

# Prüfe Profil in Supabase:
SELECT wallet_address, email FROM profiles WHERE email IS NOT NULL;
```

### "Failed to fetch blog posts"

**Ursache:** Supabase Connection Problem

**Lösung:**
1. Prüfe `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL` gesetzt?
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` gesetzt?
2. Browser Console öffnen (F12) → Fehler prüfen
3. Network Tab → API Call zu `/api/blog/posts` prüfen

### Build-Fehler

```bash
# Clean build:
rm -rf .next
npm run build

# Sollte ausgeben: "✓ Compiled successfully"
```

### Linter-Fehler

```bash
npm run lint
# Sollte ausgeben: "No linter errors found"
```

## 📊 Erwartete Ergebnisse

### Nach vollständigem Test:

**Datenbank:**
- `blog_posts`: 1+ Rows
- `blog_comments`: 1+ Rows
- `profiles.email`: Mindestens 1 gesetzt

**URLs funktionieren:**
- ✅ http://localhost:3000/blog
- ✅ http://localhost:3000/blog/[slug]
- ✅ http://localhost:3000/admin/blog (nur Super-Admin)
- ✅ http://localhost:3000/admin/blog/new (nur Super-Admin)
- ✅ http://localhost:3000/admin/blog/[id]/edit (nur Super-Admin)

**API Endpoints:**
- ✅ GET `/api/blog/posts` (öffentlich)
- ✅ GET `/api/blog/posts/[slug]` (öffentlich)
- ✅ GET `/api/blog/posts/[slug]/comments` (öffentlich)
- ✅ POST `/api/blog/posts/[slug]/comments` (authentifiziert)
- ✅ DELETE `/api/blog/comments/[id]` (authentifiziert + owner)
- ✅ GET `/api/blog/admin/posts` (super-admin)
- ✅ POST `/api/blog/admin/posts` (super-admin)
- ✅ PUT `/api/blog/admin/posts/[id]` (super-admin)
- ✅ DELETE `/api/blog/admin/posts/[id]` (super-admin)

## 🎯 Feature-Matrix

| Feature | Status | Notes |
|---------|--------|-------|
| Blog Übersicht | ✅ | Grid Layout, Pagination |
| Post Detail | ✅ | Markdown Rendering, View Counter |
| Kommentare | ✅ | Create, Delete (own only) |
| Admin Dashboard | ✅ | Liste aller Posts (inkl. Drafts) |
| Post erstellen | ✅ | Markdown Editor, Preview |
| Post bearbeiten | ✅ | Pre-filled Form, Slug Update |
| Post löschen | ✅ | Confirmation Modal, CASCADE |
| Slug Auto-Gen | ✅ | Umlaute, Special Chars |
| Excerpt Auto-Gen | ✅ | Erste 200 Zeichen |
| Tag System | ✅ | Komma-getrennt, Chips |
| View Counter | ✅ | Inkrementiert bei jedem View |
| Draft/Published | ✅ | Status Badges, Visibility |
| Super-Admin Auth | ✅ | Email-basiert, .env konfigurierbar |

## 🔍 Manuelle API Tests (Optional)

### Mit curl testen:

```bash
# 1. Liste published Posts (öffentlich)
curl http://localhost:3000/api/blog/posts

# 2. Hole spezifischen Post (öffentlich)
curl http://localhost:3000/api/blog/posts/willkommen-beim-crowdstaking-blog

# 3. Liste Kommentare (öffentlich)
curl http://localhost:3000/api/blog/posts/willkommen-beim-crowdstaking-blog/comments

# 4. Admin: Liste alle Posts (braucht Session Cookie)
curl -H "Cookie: session_id=YOUR_SESSION" \
     http://localhost:3000/api/blog/admin/posts
```

## 📸 Screenshot-Locations

Nach dem Testing solltest du Screenshots haben von:
1. `/blog` - Blog Übersicht mit Posts
2. `/blog/[slug]` - Post Detail mit Kommentaren
3. `/admin/blog` - Admin Dashboard
4. `/admin/blog/new` - Post erstellen Formular

## ✅ Success Criteria

Das Blog-System ist vollständig getestet, wenn:

- [x] Alle 3 Migrationen ausgeführt
- [x] `SUPER_ADMIN_EMAILS` in `.env.local` gesetzt
- [ ] Mindestens 1 Super-Admin Email im Profil gesetzt
- [ ] Mindestens 1 Blog-Post erstellt (published)
- [ ] Mindestens 1 Kommentar erstellt
- [ ] Admin-Zugriff funktioniert
- [ ] Öffentlicher Zugriff funktioniert
- [ ] Alle CRUD-Operationen getestet
- [ ] Keine Console-Errors
- [ ] Build erfolgreich: `npm run build`

---

**Viel Erfolg beim Testing! 🚀**

Bei Fragen oder Problemen, schaue in `/dev-docs/PHASE-6-BLOG-ENV-VARS.md` für Details.

