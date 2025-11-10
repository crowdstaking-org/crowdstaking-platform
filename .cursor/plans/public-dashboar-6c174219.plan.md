<!-- 6c174219-33d3-42ad-b053-25d8a1988632 b3b8c389-0565-4963-82d2-221fefeca045 -->
# Refinement: Dashboard-Architektur Fix

## Analyse der aktuellen Situation

**Kernproblem:** Dashboard wurde fälschlicherweise öffentlich gemacht (nutzt `useProjects` statt `useFounderProjects`)

**Betroffene Dateien:**

- `src/app/dashboard/page.tsx` - nutzt falschen Hook
- `src/components/discover-projects/ProjectCard.tsx` - linkt zu Dashboard statt öffentlicher Seite
- `src/lib/thirdweb.ts` - muss für Multi-Auth erweitert werden
- `src/hooks/useAuth.ts` - bereits korrekt, minimale Anpassungen
- Fehlende Dateien: `/projects/[id]/page.tsx` und Missions-Detail-Seite

---

## TICKET 1: Dashboard privatisieren

**Beschreibung:** Dashboard wieder hinter Login-Wall stellen und nur Founder-Projekte zeigen

**Änderungen:**

- **Datei:** `src/app/dashboard/page.tsx`
  - Zeile 27: Ändere `import { useProjects }` zu `import { useFounderProjects }`
  - Zeile 28: Entferne `import { ProtectedButton }`
  - Zeile 38: Ändere `useProjects(projectId)` zu `useFounderProjects(wallet)`
  - Füge Auth-Check hinzu: `const { wallet, isAuthenticated, login } = useAuth()`
  - Restore "Connect Wallet" Screen wenn `!isAuthenticated`
  - Entferne alle `<ProtectedButton>` und ersetze mit normalen Buttons/Links
  - Entferne `ProtectedButton` Import

**Definition of Done:**

- [ ] Dashboard zeigt "Connect Wallet" Screen ohne Auth
- [ ] Dashboard zeigt nur Projekte des eingeloggten Founders
- [ ] Keine ProtectedButtons mehr vorhanden
- [ ] TypeScript Errors: 0
- [ ] Manual Test: Dashboard mit/ohne Wallet funktioniert

---

## TICKET 2: ProtectedButton-Komponenten aufräumen

**Beschreibung:** Lösche nicht mehr benötigte Auth-Wrapper-Komponenten

**Änderungen:**

- **Dateien zu löschen:**
  - `src/components/modals/ConnectWalletModal.tsx`
  - `src/components/auth/ProtectedButton.tsx`

- **Dateien zu bereinigen:**
  - `src/components/founder/MissionsTab.tsx`: Entferne ProtectedButton, nutze normale Buttons
  - `src/components/founder/ProposalsTab.tsx`: Entferne ProtectedButton
  - `src/components/founder/SettingsTab.tsx`: Entferne ProtectedButton, Info-Banner, disabled-States

**Definition of Done:**

- [ ] Beide Dateien gelöscht
- [ ] Keine Imports von ProtectedButton/ConnectWalletModal mehr
- [ ] Alle Tabs nutzen normale Buttons
- [ ] TypeScript Errors: 0
- [ ] Linter Errors: 0

---

## TICKET 3: Öffentliche Projekt-Detail-Seite erstellen

**Beschreibung:** Neue Route `/projects/[id]` für öffentliche Projekt-Ansicht

**Neue Dateien:**

- **`src/app/projects/[id]/page.tsx`** (Server Component):
```typescript
import { fetchProject, fetchProjectStats } from '@/hooks/useProject'
import { notFound } from 'next/navigation'
// Layout mit Projekt-Details, Missions-Liste, Team, Tokenomics
```


**Komponenten-Struktur:**

- Header: Projekt-Name, Beschreibung, Token-Info
- Tabs: Overview, Missions, Team, Tokenomics
- Missions-Liste mit Links zu `/projects/[id]/missions/[missionId]`
- "Apply Now" Button → zu `/submit-proposal?project=[id]`

**Definition of Done:**

- [ ] Route `/projects/[id]` existiert
- [ ] Lädt Projekt-Daten per Server-Side
- [ ] Zeigt vollständige Projekt-Informationen
- [ ] Missions-Liste mit funktionierenden Links
- [ ] 404 für nicht-existierende Projekte
- [ ] SEO-optimiert (Server Component)
- [ ] Responsive Design
- [ ] Manual Test: Navigation funktioniert

---

## TICKET 4: Mission-Detail-Seite erstellen

**Beschreibung:** Neue Route `/projects/[projectId]/missions/[missionId]` für Mission-Details

**Neue Datei:**

- **`src/app/projects/[projectId]/missions/[missionId]/page.tsx`**

**Inhalt:**

- Mission-Titel, Beschreibung, Status
- Liste aller Proposals (öffentlich sichtbar)
- "Apply Now" Button → zu `/submit-proposal?mission=[missionId]`
- Zurück-Navigation zu Projekt

**Definition of Done:**

- [ ] Route existiert und lädt korrekt
- [ ] Zeigt Mission-Details
- [ ] Zeigt alle Proposals für diese Mission
- [ ] "Apply Now" Button funktioniert
- [ ] 404 für nicht-existierende Missions
- [ ] Manual Test: Navigation von Projekt zu Mission funktioniert

---

## TICKET 5: Navigation-Links korrigieren

**Beschreibung:** Alle Links auf neue öffentliche Seiten umbiegen

**Änderungen:**

- **`src/components/discover-projects/ProjectCard.tsx`**:
  - Zeile 37: Ändere `/dashboard?project=${projectId}` zu `/projects/${projectId}`

- **`src/components/founder/MissionsTab.tsx`**:
  - "View Details" Links zu `/projects/${projectId}/missions/${missionId}` ändern

- **`src/app/page.tsx`** (Homepage):
  - "Live Missions" Links zu `/projects/[id]` prüfen/anpassen

**Definition of Done:**

- [ ] ProjectCard navigiert zu öffentlicher Seite
- [ ] Missions "View Details" funktioniert
- [ ] Homepage-Links korrekt
- [ ] Keine toten Links
- [ ] Manual Test: Alle Navigationen funktionieren

---

## TICKET 6: Thirdweb Multi-Auth konfigurieren

**Beschreibung:** Email + Wallet Login parallel ermöglichen

**Änderungen:**

- **`src/lib/thirdweb.ts`**:
```typescript
import { inAppWallet } from "thirdweb/wallets"

export const wallets = [
  inAppWallet({
    auth: {
      options: ["email", "google", "wallet"],
    },
  }),
]
```

- **`src/components/Navigation.tsx`**:
  - Ersetze `ConnectButton` durch erweiterte Version:
```typescript
<ConnectButton
  client={client}
  wallets={wallets}
  connectModal={{
    title: "Login to CrowdStaking",
    size: "wide",
    showThirdwebBranding: false,
  }}
/>
```


**Definition of Done:**

- [ ] `wallets` Export in thirdweb.ts
- [ ] Navigation nutzt erweiterten ConnectButton
- [ ] Email-Login funktioniert (Code wird versendet)
- [ ] Wallet-Login funktioniert (wie bisher)
- [ ] Google OAuth funktioniert
- [ ] Beide Auth-Methoden parallel nutzbar
- [ ] Manual Test: Email-Flow + Wallet-Flow

---

## TICKET 7: useAuth für Multi-Auth erweitern

**Beschreibung:** Auth-Hook für verschiedene Login-Typen vorbereiten

**Änderungen:**

- **`src/hooks/useAuth.ts`**:
  - Keine großen Änderungen nötig (Thirdweb SDK handled automatisch)
  - Optional: Auth-Type tracking hinzufügen (email vs wallet vs oauth)
  - Funktion `getAuthMethod()` für Debugging

**Definition of Done:**

- [ ] useAuth funktioniert mit allen Auth-Methoden
- [ ] `wallet` enthält korrekte Adresse (auch bei Email-Login)
- [ ] `isAuthenticated` korrekt für alle Methoden
- [ ] Console-Logs für Debugging
- [ ] Manual Test: Alle Auth-Flows setzen korrekte States

---

## TICKET 8: End-to-End Testing

**Beschreibung:** Alle Flows manuell testen

**Test-Szenarien:**

1. **Öffentlicher Flow:**

   - [ ] `/discover-projects` lädt Projekte
   - [ ] Klick auf Projekt → `/projects/[id]` funktioniert
   - [ ] Mission-Details aufrufbar
   - [ ] "Apply Now" leitet korrekt weiter

2. **Auth-Flow Email:**

   - [ ] Email eingeben → Code erhalten
   - [ ] Code eingeben → Login erfolgreich
   - [ ] Dashboard zeigt meine Projekte

3. **Auth-Flow Wallet:**

   - [ ] Wallet verbinden → Signatur anfordern
   - [ ] Dashboard zeigt meine Projekte

4. **Dashboard (privat):**

   - [ ] Ohne Login: "Connect Wallet" Screen
   - [ ] Mit Login: Nur meine Projekte sichtbar
   - [ ] Tabs funktionieren
   - [ ] Actions funktionieren (Create Mission, etc.)

**Definition of Done:**

- [ ] Alle Test-Szenarien bestanden
- [ ] Keine Console Errors
- [ ] Keine TypeScript Errors
- [ ] Performance akzeptabel (< 2s Ladezeit)

---

## Migrations-Hinweise

**Keine Datenbank-Änderungen nötig:**

- `projects.founder_wallet_address` bleibt bestehen
- Email-User bekommen automatisch Wallet-Adresse von Thirdweb
- Keine neuen Tabellen/Felder erforderlich

**Session-Management:**

- Thirdweb SDK handled Sessions automatisch
- Keine Änderungen an Cookies/JWT nötig
- Bestehende `/api/auth/*` Endpoints bleiben kompatibel

---

## Priorität der Tickets

**Phase 1 (kritisch):** Tickets 1, 2 (Dashboard fix)

**Phase 2 (wichtig):** Tickets 3, 4, 5 (Öffentliche Seiten)

**Phase 3 (enhancement):** Tickets 6, 7 (Multi-Auth)

**Phase 4 (validation):** Ticket 8 (Testing)

### To-dos

- [ ] Dashboard wieder privatisieren und Auth-Check wiederherstellen
- [ ] Öffentliche Projekt-Detail-Seiten erstellen (/projects/[id])
- [ ] Thirdweb Multi-Auth implementieren (Email + Wallet)
- [ ] Navigation und Links korrigieren
- [ ] End-to-End Testing aller Flows