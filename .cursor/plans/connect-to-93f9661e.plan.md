<!-- 93f9661e-beb0-424e-a6cd-412bdf23208e 6d063a62-919d-4d3a-a627-b9dc62eab937 -->
# Minimal Filter Implementation - Refinement

Zweistufiger Ansatz für minimale Invasivität und schnelle Umsetzbarkeit.

---

## STUFE 1: Sofort nutzbar (KEINE DB-Änderung)

Diese Filter funktionieren mit vorhandenen Daten und können SOFORT deployed werden.

### TICKET 1: Search Filter implementieren

**Datei:** `src/components/discover-projects/ProjectMarketplace.tsx`

**Änderungen:**

- State: `const [searchTerm, setSearchTerm] = useState('')`
- onChange Handler für Search Input (Zeile 86-91)
- Filter-Logik: Suche in `project.name` und `project.description`

**Code:**

```typescript
const filteredProjects = projects.filter(p => {
  if (!searchTerm) return true
  const term = searchTerm.toLowerCase()
  return p.name.toLowerCase().includes(term) || 
         p.description?.toLowerCase().includes(term)
})
```

**DoD:**

- [ ] Search Input ist kontrolliert (value + onChange)
- [ ] Tippen filtert Projekte live
- [ ] Case-insensitive Suche
- [ ] Funktioniert auf name + description

---

### TICKET 2: "Only Liquid Tokens" Filter implementieren

**Datei:** `src/components/discover-projects/ProjectMarketplace.tsx`

**Änderungen:**

- State: `const [onlyLiquid, setOnlyLiquid] = useState(false)`
- onChange Handler für Checkbox (Zeile 133-143)
- Filter-Logik: `project.token_status === 'live'`

**Code:**

```typescript
const matchesLiquidity = !onlyLiquid || project.token_status === 'live'
```

**DoD:**

- [ ] Checkbox ist kontrolliert (checked + onChange)
- [ ] Aktiviert zeigt nur Projekte mit token_status='live'
- [ ] Deaktiviert zeigt alle Projekte
- [ ] Funktioniert kombiniert mit Suche

---

### TICKET 3: Filter Count & No Results State

**Datei:** `src/components/discover-projects/ProjectMarketplace.tsx`

**Änderungen:**

- Count-Badge über Project-Cards: "Showing X of Y projects"
- No Results State wenn `filteredProjects.length === 0`

**Code:**

```typescript
{filteredProjects.length === 0 ? (
  <div className="text-center py-12">
    <p>No projects match your filters.</p>
    <button onClick={clearFilters}>Clear Filters</button>
  </div>
) : (
  <div>
    <p>Showing {filteredProjects.length} of {projects.length}</p>
    {/* Cards */}
  </div>
)}
```

**DoD:**

- [ ] Count Badge zeigt korrekte Zahlen
- [ ] No Results State erscheint bei 0 Ergebnissen
- [ ] Clear Filters Button setzt alle Filter zurück

---

## STUFE 2: Erweiterte Filter (1 DB-Feld)

Minimale DB-Änderung für maximale Flexibilität.

### TICKET 4: Database Migration - Tags Feld

**Datei:** `supabase-migrations/009_add_tags_to_projects.sql`

**SQL:**

```sql
-- Add tags array for flexible categorization
ALTER TABLE projects ADD COLUMN tags TEXT[] DEFAULT '{}';

-- GIN Index for efficient array searches
CREATE INDEX idx_projects_tags ON projects USING GIN (tags);

-- Comment
COMMENT ON COLUMN projects.tags IS 
  'Flexible tags for tech stack, categories, and features (e.g., ["React", "DeFi", "AI/ML"])';
```

**Ausführung:** Manuell in Supabase SQL Editor

**DoD:**

- [ ] SQL-Datei erstellt
- [ ] Migration in Supabase ausgeführt
- [ ] Index funktioniert
- [ ] Keine bestehenden Daten beschädigt

---

### TICKET 5: TypeScript Types erweitern

**Datei:** `src/types/project.ts`

**Änderung:**

```typescript
export interface Project {
  // ... existing
  tags?: string[]  // Optional: Tech stack, category, features
}
```

**DoD:**

- [ ] tags-Feld im Interface
- [ ] Optional (bestehende Projekte haben keine Tags)
- [ ] TypeScript kompiliert ohne Fehler

---

### TICKET 6: Minimal Seed für wichtigste Projekte

**Datei:** `scripts/seed-project-tags.ts`

**Strategie:** Nur die 5 sichtbarsten Projekte (Homepage + Top of Discover) taggen

**Mapping (Beispiel):**

```typescript
const tagMappings: Record<string, string[]> = {
  'awesome': ['Community', 'Lists', 'Open Source'],
  'freeCodeCamp': ['Education', 'JavaScript', 'Open Source'],
  'build-your-own-x': ['Education', 'Tutorial', 'Programming'],
  'React': ['React', 'JavaScript', 'UI', 'Framework'],
  'Vue.js': ['Vue', 'JavaScript', 'UI', 'Framework'],
}
```

**DoD:**

- [ ] Script erstellt mit minimalen Mappings
- [ ] Nur 5-10 Projekte getaggt
- [ ] Tags sind sinnvoll und konsistent
- [ ] Script ausgeführt

---

### TICKET 7: Tech Stack Filter implementieren

**Datei:** `src/components/discover-projects/ProjectMarketplace.tsx`

**Änderungen:**

- State: `const [techStackFilter, setTechStackFilter] = useState('')`
- onChange Handler für Select
- Filter-Logik: `project.tags?.includes(techStackFilter)`
- Statische Options vorerst (später dynamisch)

**DoD:**

- [ ] Dropdown ist kontrolliert
- [ ] Filtert korrekt nach Tags
- [ ] Funktioniert mit anderen Filtern kombiniert
- [ ] TypeScript Errors: 0

---

### TICKET 8: Category-as-Tag Lösung

**Strategie:** Nutze Tags für ALLES (Tech Stack + Category)

**Kategorien als Tags:**

- "DeFi", "SaaS", "Infrastructure" sind einfach Tags wie "React"
- Kein separates category-Feld nötig
- Maximale Flexibilität

**UI-Anpassung:**

- "Tech Stack" Dropdown → filtert nach Tech-Tags (React, Python, Rust)
- "Category" Dropdown → filtert nach Category-Tags (DeFi, SaaS, Infrastructure)
- Beide nutzen das gleiche tags-Array

**DoD:**

- [ ] Category Dropdown implementiert
- [ ] Filtert nach Category-Tags
- [ ] Projekte haben sowohl Tech- als auch Category-Tags
- [ ] UI macht Unterschied klar

---

## Zusammenfassung: Minimalinvasiv

**DB-Änderungen:** Nur 1 Feld (`tags TEXT[]`)

**Warum minimal:**

- Tags-Array ist flexibel für Tech Stack UND Categories
- Keine komplexe Normalisierung (kein separate Tags-Tabelle)
- Einfach zu seeden
- Einfach zu erweitern

**Sofort nutzbar:**

- Tickets 1-3 funktionieren OHNE DB-Änderung
- Können deployed werden während Migration vorbereitet wird

**Erweiterte Filter:**

- Tickets 4-8 nach Migration
- Nutzen 1 flexibles Feld für alles

### To-dos

- [ ] Search Filter - Name/Description Suche ohne DB-Änderung
- [ ] Only Liquid Tokens Filter - Nutzt token_status ohne DB-Änderung
- [ ] Filter UI Polish - Count Badge, No Results, Clear Filters
- [ ] DB Migration - tags TEXT[] Feld hinzufügen
- [ ] TypeScript Types - Project Interface erweitern
- [ ] Minimal Seed - Top 5-10 Projekte mit Tags versehen
- [ ] Tech Stack Filter - Filtert nach Tech-Tags
- [ ] Category Filter - Filtert nach Category-Tags (nutzt gleiches tags-Feld)