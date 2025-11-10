<!-- 0e452642-10d5-43da-aeff-6c5aa4562814 71cf3c55-5912-421a-a48f-8548c4ae1188 -->
# GitHub Project Connect Feature

## Überblick

Open-Source-Projekte können sich via GitHub OAuth authentifizieren und automatisch Projekt-Metadaten sowie offene Pull Requests als Missions importieren. Nur Projektadministratoren haben Zugriff. MVP: einmaliger Import (keine kontinuierliche Synchronisation).

## 1. Datenbank-Schema erweitern

**Migration:** `009_add_github_integration.sql`

Erweitere `projects` Tabelle:

- `github_repo_url` (TEXT, nullable, unique)
- `github_owner` (TEXT, nullable)
- `github_repo_name` (TEXT, nullable)
- `github_synced_at` (TIMESTAMPTZ, nullable)
- `github_admin_username` (TEXT, nullable)

Erstelle neue Tabelle `github_imported_prs`:

- `id` (UUID, primary key)
- `project_id` (UUID, FK → projects)
- `mission_id` (UUID, FK → missions)
- `pr_number` (INTEGER)
- `pr_url` (TEXT)
- `github_user` (TEXT)
- `imported_at` (TIMESTAMPTZ)

## 2. GitHub OAuth & API Integration

**Neue Datei:** `src/lib/github/oauth.ts`

- GitHub OAuth Flow (authorize URL generieren)
- Token Exchange nach Callback
- Admin-Rechte validieren via `/repos/{owner}/{repo}/collaborators/{username}/permission`

**Neue Datei:** `src/lib/github/api.ts`

- Repository-Metadaten fetchen (Name, Description, Topics, README)
- Offene Pull Requests abrufen (Titel, Body, Creator, URL)
- Contributors-Liste optional

**Environment Variables (.env.local):**

```
GITHUB_CLIENT_ID=xxx
GITHUB_CLIENT_SECRET=xxx
GITHUB_REDIRECT_URI=http://localhost:3000/api/github/callback
```

## 3. API-Endpoints

**`/api/github/authorize` (GET)**

- Generiert GitHub OAuth URL mit scopes: `repo`, `read:org`
- Speichert state im Cookie für CSRF-Schutz

**`/api/github/callback` (GET)**

- Empfängt OAuth code
- Tauscht gegen Access Token
- Validiert Admin-Rechte für gewähltes Repo
- Speichert Token temporär (Session/Cookie)
- Redirect zu `/github-import` mit Repository-Daten

**`/api/github/import` (POST)**

```json
{
  "github_repo_url": "https://github.com/owner/repo",
  "name": "Angepasster Projektname",
  "description": "Angepasste Beschreibung",
  "token_name": "Project Token",
  "token_symbol": "PROJ",
  "total_supply": 1000000000,
  "import_prs": true
}
```

- Authentifizierung erforderlich (Founder)
- Validiert GitHub Token & Admin-Rechte
- Erstellt Projekt in Supabase
- Importiert offene PRs als Missions (wenn `import_prs: true`)
- Speichert Mapping in `github_imported_prs`
- Gibt Projekt + Anzahl importierter PRs zurück

## 4. UI: GitHub Import Flow (`/github-import`)

**Neue Seite:** `src/app/github-import/page.tsx`

**Schritt 1 - Repository-Daten Preview:**

- Zeigt automatisch geparste Daten (Name, Description, Topics)
- Zeigt README (erste 500 Zeichen)
- Liste offener PRs (Anzahl)

**Schritt 2 - Anpassungen:**

- Form-Felder editierbar:
  - Project Name (vorausgefüllt mit Repo-Name)
  - Description (vorausgefüllt mit GitHub Description)
  - Token Name (z.B. "MyProject Token")
  - Token Symbol (2-10 Zeichen, z.B. "MYPROJ")
  - Total Supply (default: 1B)
- Checkbox: "Import offene Pull Requests als Missions" (default: checked)

**Schritt 3 - Review & Import:**

- Zusammenfassung aller Daten
- "Import Project" Button
- POST zu `/api/github/import`
- Success: Redirect zu `/dashboard` (Founder Dashboard)

## 5. Wizard-Integration (Alternativer Pfad)

**Erweitere:** `src/app/wizard/page.tsx`

**Neue Option in WelcomeStep:**

- Zwei Buttons statt einem:

  1. "Start from Scratch" (bisheriger Flow)
  2. "Connect GitHub Project" (neu)

     - Redirect zu `/api/github/authorize`
     - Nach Callback → `/github-import`

Visuell: Nebeneinander, gleichwertig dargestellt.

## 6. Dashboard-Integration (Nachträgliches Connect)

**Erweitere:** `src/components/founder/SettingsTab.tsx`

**Neue Sektion: "GitHub Integration"**

- Wenn `github_repo_url` leer:
  - Button: "Connect GitHub Repository"
  - Hinweis: "Link your project to GitHub for better visibility"
  - Click → `/api/github/authorize`

- Wenn `github_repo_url` gesetzt:
  - Zeige verknüpftes Repository (Logo + Link)
  - Zeige `github_synced_at` timestamp
  - Badge: "Synced" (grün)
  - [MVP: Kein "Re-sync" Button, da keine kontinuierliche Sync]

## 7. Components

**Neue Component:** `src/components/github/GitHubRepoPreview.tsx`

- Zeigt Repository-Details schön formatiert
- GitHub-Logo, Stars, Forks (optional)
- Topics als Tags

**Neue Component:** `src/components/github/PRImportList.tsx`

- Liste offener PRs
- Checkbox pro PR (optional für v2, MVP: alle oder keine)
- PR-Titel, Autor, Created Date

## 8. Type Definitions

**Erweitere:** `src/types/project.ts`

```typescript
export interface Project {
  // ... existing fields
  github_repo_url?: string
  github_owner?: string
  github_repo_name?: string
  github_synced_at?: string
  github_admin_username?: string
}
```

**Neue Datei:** `src/types/github.ts`

```typescript
export interface GitHubRepository {
  full_name: string
  name: string
  description: string | null
  html_url: string
  topics: string[]
  default_branch: string
  stargazers_count: number
  forks_count: number
}

export interface GitHubPullRequest {
  number: number
  title: string
  body: string | null
  html_url: string
  user: { login: string }
  created_at: string
  state: 'open' | 'closed'
}

export interface GitHubImportData {
  repository: GitHubRepository
  open_pull_requests: GitHubPullRequest[]
  readme_content?: string
}
```

## 9. Security & Validation

- GitHub Access Token nie im Frontend speichern
- Token-Speicherung: Server-side Session oder encrypted Cookie (1h TTL)
- Validierung: User muss Admin/Owner des Repos sein
- Rate Limiting für GitHub API Calls
- CSRF-Protection via state parameter

## 10. Error Handling

- OAuth Fehler: "GitHub authorization failed"
- Nicht-Admin: "You must be an admin of this repository"
- Repo nicht gefunden: "Repository not found or private"
- API-Fehler: Fallback mit manuellem Setup
- Duplicate-Check: "This repository is already connected to a project"

## Minimalinvasive Implementierung - Erkenntnisse

**Bestehende Infrastruktur nutzen:**

- ✅ Session-System (`sessions.ts`) → Erweitere um GitHub-Token-Speicherung
- ✅ `/api/projects` POST → Erweitere um optionale GitHub-Felder
- ✅ `/api/missions` POST → Nutze für PR-Import
- ✅ `SettingsTab.tsx` → Füge GitHub-Sektion hinzu (Zeilen 89-123)

**Neue Komponenten (minimal):**

- GitHub OAuth Flow (authorize + callback)
- Import-Preview-Page (ähnlich Wizard-Steps)
- GitHub API Wrapper (nur Repo + PRs)

## ACTIONABLE TICKETS (mit Definition of Done)

### TICKET #1: Database Schema & Types

**Title:** Add GitHub Integration Fields to Database

**Description:**

Erweitere die `projects` Tabelle um GitHub-Metadaten und erstelle eine Tracking-Tabelle für importierte PRs.

**Tasks:**

1. Migration `009_add_github_integration.sql` erstellen
2. TypeScript Types in `project.ts` erweitern
3. Neue Type-Datei `github.ts` erstellen

**Files to Modify:**

- `supabase-migrations/009_add_github_integration.sql` (neu)
- `src/types/project.ts` (erweitern)
- `src/types/github.ts` (neu)

**Definition of Done:**

- [ ] Migration läuft erfolgreich mit `npm run db:migrate`
- [ ] Tabelle `projects` hat neue Spalten: `github_repo_url`, `github_owner`, `github_repo_name`, `github_synced_at`
- [ ] Tabelle `github_imported_prs` existiert mit korrekten Foreign Keys
- [ ] TypeScript Types kompilieren ohne Fehler
- [ ] Keine bestehenden Tests brechen

---

### TICKET #2: GitHub API Wrapper

**Title:** Implement GitHub REST API Client

**Description:**

Erstelle einen leichtgewichtigen Wrapper für GitHub REST API. Nur die Funktionen, die wir wirklich brauchen: Repository-Daten abrufen, offene PRs listen.

**Tasks:**

1. `src/lib/github/api.ts` erstellen
2. Funktionen: `fetchRepository()`, `fetchOpenPullRequests()`
3. Error Handling für Rate Limits und 404s

**Files to Create:**

- `src/lib/github/api.ts`

**Definition of Done:**

- [ ] `fetchRepository(owner, repo, token)` gibt Repository-Metadaten zurück
- [ ] `fetchOpenPullRequests(owner, repo, token)` gibt Array von PRs zurück
- [ ] Error Handling für 404, 403, Rate Limit implementiert
- [ ] Type-safe mit GitHub TypeScript Types
- [ ] Testbar mit Mock-Daten oder echtem Public Repo

---

### TICKET #3: GitHub OAuth Flow (Backend)

**Title:** Implement GitHub OAuth Authorization Flow

**Description:**

Erstelle GitHub OAuth Endpoints für Authorization und Callback. Speichere temporär das Access Token im Session-System (1h TTL).

**Tasks:**

1. Erweitere `sessions.ts` um `githubAccessToken` Feld
2. Erstelle `/api/github/authorize` (GET) → Redirect zu GitHub
3. Erstelle `/api/github/callback` (GET) → Token Exchange + Session
4. Validiere Admin-Rechte des Users für Repo

**Files to Modify/Create:**

- `src/lib/auth/sessions.ts` (erweitern)
- `src/app/api/github/authorize/route.ts` (neu)
- `src/app/api/github/callback/route.ts` (neu)
- `.env.local` (add `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`)

**Definition of Done:**

- [ ] OAuth Flow funktioniert: `/api/github/authorize` → GitHub → `/api/github/callback`
- [ ] Access Token wird im Session gespeichert (1h TTL)
- [ ] Admin-Rechte werden geprüft via GitHub API
- [ ] CSRF-Schutz via `state` parameter implementiert
- [ ] Bei Nicht-Admin: Fehlerseite mit klarer Message
- [ ] Session enthält: `walletAddress`, `githubToken`, `githubUsername`

---

### TICKET #4: Project Import Endpoint

**Title:** Extend /api/projects to Support GitHub Import

**Description:**

Erweitere den bestehenden `/api/projects` POST Endpoint um optionale GitHub-Felder. Wenn GitHub-Daten vorhanden, importiere auch offene PRs als Missions.

**Tasks:**

1. Erweitere `/api/projects/route.ts` POST Handler
2. Wenn `github_repo_url` vorhanden: Fetch PRs, erstelle Missions
3. Speichere PR-Mission-Mapping in `github_imported_prs`

**Files to Modify:**

- `src/app/api/projects/route.ts` (erweitern)

**Definition of Done:**

- [ ] POST `/api/projects` akzeptiert neue optionale Felder: `github_repo_url`, `github_owner`, `github_repo_name`
- [ ] Wenn GitHub-Felder vorhanden: PRs werden automatisch importiert
- [ ] Jede PR wird als Mission erstellt mit Titel, Description aus PR-Body
- [ ] PR-Mission-Mapping wird in `github_imported_prs` gespeichert
- [ ] Response enthält: `project` + `imported_prs_count`
- [ ] Backward-kompatibel: Funktioniert auch ohne GitHub-Daten
- [ ] Error Handling: GitHub API Fehler brechen nicht Projekt-Erstellung

---

### TICKET #5: GitHub Import Preview Page

**Title:** Create /github-import Preview & Configuration Page

**Description:**

Erstelle eine neue Seite `/github-import`, die nach OAuth-Callback die Repository-Daten zeigt und User Anpassungen erlaubt (wie Wizard-Steps).

**Tasks:**

1. Erstelle `/app/github-import/page.tsx`
2. Zeige Repository-Preview (Name, Description, Open PRs Count)
3. Editierbare Felder: Project Name, Token Symbol, Import PRs (Checkbox)
4. Submit → POST `/api/projects` mit GitHub-Daten

**Files to Create:**

- `src/app/github-import/page.tsx`
- `src/components/github/RepoPreview.tsx` (optional, kann inline sein)

**Definition of Done:**

- [ ] Seite zeigt Repository-Daten aus URL-Parametern oder Session
- [ ] Form mit Feldern: `name`, `description`, `token_name`, `token_symbol`
- [ ] Checkbox: "Import X open Pull Requests as Missions"
- [ ] "Import Project" Button → POST `/api/projects`
- [ ] Success: Redirect zu `/dashboard`
- [ ] Error Handling: Zeige Fehler, erlaube Retry
- [ ] Loading States während API Call
- [ ] Responsive Design (mobile-friendly)

---

### TICKET #6: Wizard Integration (Alternative Path)

**Title:** Add "Connect GitHub" Option to Wizard Welcome Step

**Description:**

Erweitere den `WelcomeStep` im Wizard um eine zweite Option: "Connect GitHub Project". Beide Optionen gleichwertig nebeneinander.

**Tasks:**

1. Erweitere `WelcomeStep.tsx` um zweiten Button
2. GitHub-Button → Redirect zu `/api/github/authorize`
3. Layout: Zwei Karten/Buttons nebeneinander

**Files to Modify:**

- `src/components/wizard/WelcomeStep.tsx`

**Definition of Done:**

- [ ] Zwei Optionen sichtbar: "Start from Scratch" und "Connect GitHub"
- [ ] Visuell gleichwertig (keine Option dominant)
- [ ] GitHub-Button hat Icon (GitHub-Logo)
- [ ] Click auf GitHub → Redirect zu `/api/github/authorize`
- [ ] Responsive: Auf Mobile stapeln sich die Buttons vertikal
- [ ] Bestehender Flow (Start from Scratch) funktioniert unverändert

---

### TICKET #7: Dashboard Settings Integration

**Title:** Add GitHub Integration Section to Settings Tab

**Description:**

Erweitere den bestehenden `SettingsTab` um eine neue Sektion "GitHub Integration" (nach "Legal Wrapper", vor "Danger Zone").

**Tasks:**

1. Füge neue Sektion in `SettingsTab.tsx` hinzu (ca. Zeile 123)
2. Wenn `github_repo_url` leer: Button "Connect GitHub"
3. Wenn gesetzt: Zeige verknüpftes Repo, Sync-Datum, Badge

**Files to Modify:**

- `src/components/founder/SettingsTab.tsx`

**Definition of Done:**

- [ ] Neue Sektion "GitHub Integration" existiert im SettingsTab
- [ ] Fall 1 (nicht verknüpft): Button "Connect GitHub Repository" → `/api/github/authorize`
- [ ] Fall 2 (verknüpft): Zeige Repository-Name, GitHub-Link, Synced-Datum
- [ ] Badge "Connected" (grün) wenn verknüpft
- [ ] Konsistenter Styling mit anderen Sektionen
- [ ] Kein Re-Sync Button (MVP: nur einmaliger Import)

---

### TICKET #8: End-to-End Testing

**Title:** Test Complete GitHub Import Flow

**Description:**

Teste den vollständigen Flow mit einem echten GitHub Repository: OAuth → Import → Dashboard.

**Tasks:**

1. GitHub OAuth App registrieren (Test-Credentials)
2. Manueller Test: Wizard → Connect GitHub → Import
3. Manueller Test: Dashboard → Settings → Connect GitHub
4. Verifiziere: Projekt erstellt, PRs als Missions importiert
5. Edge Cases: Repo ohne PRs, Private Repo, Nicht-Admin

**Definition of Done:**

- [ ] GitHub OAuth App registriert (Dev-Credentials in `.env.local`)
- [ ] Test 1: Wizard-Path funktioniert komplett
- [ ] Test 2: Dashboard-Settings-Path funktioniert komplett
- [ ] Imported Project erscheint in `/dashboard` mit korrekten Daten
- [ ] PRs sind als Missions sichtbar in MissionsTab
- [ ] Edge Case 1: Repo ohne PRs → Projekt erstellt, 0 Missions
- [ ] Edge Case 2: Nicht-Admin → Klare Fehlermeldung
- [ ] Edge Case 3: OAuth Abbruch → User landet auf sinnvoller Seite

---

### TICKET #9: Documentation & User Flow Update

**Title:** Update USERFLOW.md with GitHub Integration

**Description:**

Erweitere `USERFLOW.md` um die neuen GitHub-Integration-Flows in der Founder Journey.

**Tasks:**

1. Neuer Abschnitt: "GitHub Project Import Flow"
2. Update Wizard Journey mit alternativer Path
3. Update Dashboard/Settings mit GitHub-Sektion

**Files to Modify:**

- `dev-docs/USERFLOW.md`

**Definition of Done:**

- [ ] Neuer Flow dokumentiert: Wizard → Connect GitHub → Import
- [ ] Dashboard Settings-Integration dokumentiert
- [ ] ASCII-Diagramm zeigt beide Pfade (manual vs GitHub)
- [ ] Alle neuen Routes gelistet (`/github-import`, `/api/github/*`)
- [ ] Status Update: Completeness percentage aktualisiert

---

## Implementation Order (Empfohlen)

**Phase 1 - Foundation (Tickets #1, #2):**

- Datenbank + Types
- GitHub API Wrapper

→ **Testbar:** API-Calls zu GitHub funktionieren

**Phase 2 - OAuth Flow (Ticket #3):**

- OAuth Endpoints

→ **Testbar:** OAuth-Flow funktioniert, Token in Session

**Phase 3 - Import Logic (Tickets #4, #5):**

- Project Import Endpoint
- Import Preview Page

→ **Testbar:** Kompletter Import funktional

**Phase 4 - UI Integration (Tickets #6, #7):**

- Wizard Alternative
- Dashboard Settings

→ **Testbar:** Beide Entry Points funktionieren

**Phase 5 - Testing & Docs (Tickets #8, #9):**

- E2E Testing
- Documentation

→ **Done:** Feature ist production-ready

## Dependencies & Prerequisites

**Environment Variables benötigt:**

```bash
# In .env.local hinzufügen
GITHUB_CLIENT_ID=your_github_oauth_app_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_app_client_secret
GITHUB_REDIRECT_URI=http://localhost:3000/api/github/callback
```

**GitHub OAuth App Setup:**

1. Gehe zu GitHub Settings → Developer Settings → OAuth Apps
2. Erstelle neue OAuth App
3. Authorization callback URL: `http://localhost:3000/api/github/callback`
4. Kopiere Client ID und Secret in `.env.local`

**Keine neuen NPM-Pakete:** Alles mit Node.js `fetch` API