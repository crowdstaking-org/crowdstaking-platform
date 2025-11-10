<!-- 42968d3e-f6b3-4afc-8285-0fab4a46a041 2a9f9c34-d213-44ed-98f8-8d63cf4ddc79 -->
# Mock-Daten Production-Ready - Minimalinvasiver Ansatz

## Strategie

**MVP-First:** Nur das Nötigste für production-ready

- **Ein Project pro Founder** (initially)
- **Tokenomics aus DB** (VestingContract später)
- **Missions optional** (Proposals direkt zu Projects)
- **Stats on-the-fly** (keine separate Table)

**Kern-Prinzip:** Jedes Ticket ist eigenständig deploybar und testbar.

---

## 🎫 TICKET #1: Database Foundation

**Dateien:**

- `supabase-migrations/004_create_projects_table.sql`
- `supabase-migrations/005_create_missions_table.sql`  
- `supabase-migrations/006_add_project_foreign_keys.sql`

**Schema:**

```sql
-- Projects: Token-Metadata + Founder-Info
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  founder_wallet_address TEXT NOT NULL,
  name TEXT NOT NULL,
  token_name TEXT NOT NULL,
  token_symbol TEXT NOT NULL,
  total_supply NUMERIC DEFAULT 1000000000,
  token_status TEXT DEFAULT 'illiquid',
  status TEXT DEFAULT 'active'
);

-- Missions: Gruppierung für Proposals
CREATE TABLE missions (
  id UUID PRIMARY KEY,
  project_id UUID REFERENCES projects(id),
  title TEXT NOT NULL,
  status TEXT DEFAULT 'active'
);

-- Proposals erweitern
ALTER TABLE proposals 
  ADD COLUMN project_id UUID REFERENCES projects(id),
  ADD COLUMN mission_id UUID REFERENCES missions(id);
```

**DoD:**

- [ ] Tables existieren in Supabase
- [ ] Test-Insert funktioniert
- [ ] Foreign Keys validieren

---

## 🎫 TICKET #2: TypeScript Types

**Dateien:**

- `src/types/project.ts` (neu)
- `src/types/mission.ts` (neu)

**Content:**

```typescript
// project.ts
export interface Project {
  id: string
  name: string
  token_name: string
  token_symbol: string
  total_supply: number
  token_status: 'illiquid' | 'pending' | 'live'
  founder_wallet_address: string
}

export interface ProjectStats {
  active_missions_count: number
  total_proposals_count: number
  pending_proposals_count: number
}
```

**DoD:**

- [ ] Beide Dateien erstellt
- [ ] `npm run type-check` ohne Fehler

---

## 🎫 TICKET #3: Projects API

**Dateien:**

- `src/app/api/projects/route.ts` (neu)
- `src/app/api/projects/[id]/route.ts` (neu)

**Endpoints:**

- `GET /api/projects?founder=0x...` → Array von Projects
- `POST /api/projects` → Create Project
- `GET /api/projects/[id]` → Single Project

**DoD:**

- [ ] curl Tests erfolgreich
- [ ] Auth funktioniert (requireAuth)
- [ ] Error handling (404 für invalid ID)

---

## 🎫 TICKET #4: Project Stats API

**Datei:** `src/app/api/projects/[id]/stats/route.ts` (neu)

**Logic:**

- Count Missions (WHERE project_id)
- Count Proposals (WHERE project_id)
- Count Pending (WHERE project_id AND status='pending_review')

**DoD:**

- [ ] Returns correct counts
- [ ] Performance <500ms

---

## 🎫 TICKET #5: Missions API

**Dateien:**

- `src/app/api/missions/route.ts` (neu)
- `src/app/api/projects/[id]/missions/route.ts` (neu)

**DoD:**

- [ ] GET, POST funktionieren
- [ ] Filter nach project_id

---

## 🎫 TICKET #6: Proposals API erweitern

**Datei:** `src/app/api/proposals/route.ts` (ändern)

**Änderung:** Add filters für `project_id`, `mission_id`, `status`

**DoD:**

- [ ] Filter funktionieren
- [ ] Bestehende Funktionalität nicht broken

---

## 🎫 TICKET #7: Dashboard - Echte Project-Daten

**Datei:** `src/app/dashboard/page.tsx` (ändern)

**Strategie:**

- Lade erstes Project des Founders
- Lade Stats, Proposals, Missions

**Änderungen:**

```typescript
const [project, setProject] = useState<Project | null>(null)
const [stats, setStats] = useState<ProjectStats | null>(null)

useEffect(() => {
  // Load project from /api/projects?founder=...
  // Load stats from /api/projects/[id]/stats
}, [walletAddress])

// Ersetze Zeile 92: {project?.name}
// Ersetze Zeilen 189-199: {stats?....}
```

**DoD:**

- [ ] Kein "Project Flight-AI" hardcodiert
- [ ] Stats zeigen echte Zahlen
- [ ] Loading-State funktioniert

---

## 🎫 TICKET #8: MissionsTab mit echten Daten

**Datei:** `src/components/founder/MissionsTab.tsx` (ändern)

**Änderung:** Props `projectId`, load via API

**DoD:**

- [ ] Keine hardcodierten Missions
- [ ] Loading-State

---

## 🎫 TICKET #9: ProposalsTab dynamische Counts

**Datei:** `src/components/founder/ProposalsTab.tsx` (ändern)

**Änderung:** Lade Proposals, berechne Counts client-side

**DoD:**

- [ ] Counts dynamisch
- [ ] Sub-Tabs filtern korrekt

---

## 🎫 TICKET #10: TokenomicsTab & TeamTab

**Dateien:**

- `src/components/founder/TokenomicsTab.tsx` (ändern)
- `src/components/founder/TeamTab.tsx` (ändern)

**Änderung:** Nutze Project-Metadaten, vorerst ohne VestingContract

**DoD:**

- [ ] Token-Symbol/Supply aus DB
- [ ] TODO-Kommentare für VestingContract

---

## 🎫 TICKET #11: ProjectMarketplace

**Datei:** `src/components/discover-projects/ProjectMarketplace.tsx` (ändern)

**Änderung:** Load Projects via API

**DoD:**

- [ ] Keine hardcodierten Projects
- [ ] Stats werden geladen

---

## 🎫 TICKET #12: ContextSwitcher (optional)

**Datei:** `src/components/dashboard/ContextSwitcher.tsx` (ändern)

**Änderung:** Load Projects dynamic

**DoD:**

- [ ] Zeigt echte Projects
- [ ] Loading-State

---

## 🎫 TICKET #13: Seed-Data Script

**Datei:** `scripts/seed-dev-data.ts` (neu)

**Content:** Erstellt Test-Projects, Missions, Proposals

**DoD:**

- [ ] `npm run seed:dev` funktioniert
- [ ] Idempotent

---

## 🎫 TICKET #14: VestingContract Integration (Phase 2)

**Dateien:**

- `src/lib/contracts/tokenomics.ts` (neu)
- `src/app/api/projects/[id]/tokenomics/route.ts` (neu)

**Beschreibung:** Echte Token-Balances vom Contract laden

**DoD:**

- [ ] TokenomicsTab zeigt echte Balances
- [ ] Fallback wenn Contract nicht deployed

---

## Rollout

**MVP (Tickets #1-#10):**

1. Database + Types (#1, #2)
2. APIs (#3, #4, #6)
3. Dashboard (#7) ← Quick Win!
4. Tabs (#8, #9, #10)
5. Marketplace (#11)

**Post-MVP (#11-#14):**

- ContextSwitcher
- VestingContract Integration

**Deploy-Check:**

- [ ] Kein "Project Flight-AI" hardcodiert
- [ ] Stats zeigen echte Zahlen
- [ ] Ein Founder sieht echtes Project

---

## Risiken

**User hat kein Project:** → "Create First Project" CTA

**VestingContract nicht deployed:** → Fallback zu DB-Daten

**Performance:** → Indexes, Pagination später

### To-dos

- [ ] Database Foundation: Supabase Migrations für Projects, Missions, Foreign Keys
- [ ] TypeScript Types: project.ts, mission.ts erstellen
- [ ] Projects API: GET, POST, GET by ID Endpoints
- [ ] Project Stats API: Aggregierte Counts berechnen
- [ ] Missions API: CRUD + Proposals per Mission
- [ ] Proposals API erweitern: Filter für project_id, mission_id, status
- [ ] Dashboard-Page: Echte Project-Daten statt Hardcoded
- [ ] MissionsTab: API-Integration statt Hardcoded Array
- [ ] ProposalsTab: Dynamische Counts statt Hardcoded
- [ ] TokenomicsTab & TeamTab: Project-Metadaten nutzen (ohne VestingContract)
- [ ] ProjectMarketplace: Echte Projects via API laden
- [ ] ContextSwitcher: Dynamisch aus User-Projects laden
- [ ] Seed-Data Script: Test-Daten für Development
- [ ] VestingContract Integration: Echte Token-Balances laden (Phase 2)