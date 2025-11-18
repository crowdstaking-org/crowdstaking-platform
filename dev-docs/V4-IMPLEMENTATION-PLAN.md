# CrowdStaking v4.0 – Implementierungsplan

**Ziel:** Schrittweise Migration vom Legacy-$CSTAKE-Stack hin zum Digitalen Partnerschafts-Protokoll (Soulbound Tokens + Dividendenvaults), inklusive vollständiger Ablösung alter Komponenten.

---

## Teilabschnitt 1 – Contracts & Backend-Fundament

Zur besseren Umsetzbarkeit in vier Unterabschnitte gegliedert. Jeder Abschnitt baut auf dem vorherigen auf.

### 1A – Architektur & Datenmodell
**Status:** ✅ ADR + Migration + Typen erstellt (2025-11-15)
**Ziele**
- Architektur-Decision-Record (ADR) für Contract-Suite und Off-Chain-Komponenten.
- Datenmodellierung (Supabase) für Projekte, Partner Shares, Governance-Votes, Claims.

**Tasks**
1. ADR erstellen (`dev-docs/ADR/000x-v4-architecture.md`) mit: Contractübersicht, Interaktionen, Zugriffssicherheit, Upgrade-Strategie.
2. Datenmodell-Schema beschreiben (ER-Diagramm, Tabellen-Spec).
3. SQL-Migration + Seed-Skript vorbereiten, TS-Typen generieren.

**Deliverables**
- ADR-Datei
- Supabase-Migration + Seed + generierte Typen

### 1B – Smart-Contract-Suite
**Status:** ✅ Abgeschlossen (2025-01-XX)
**Ziele**
- Implementierung und Tests der neuen Verträge.

**Tasks**
1. `ProjectFactory`: Deploys Clones, speichert Mapping. ✅
2. `PartnerRegister`: Share-Storage, SBT-Mint Hook, Leave/Revoke. ✅
3. `GovernanceModule`: Proposal/Voting-Logic mit Event Hooks. ✅
4. `GewinnTresor` + `KapitalTresor`: Einnahmen, 2%-Fee, claim() pro Periode; Kapital-Deposit-Tracking. ✅
5. `CrowdStakingHauptTresor`: Plattform-Treasury + claim(). ✅
6. Unit-Tests + Integration-Tests (Hardhat) + Deployment-Skripte. ✅ ProfitVault, ProjectFactory, GovernanceModule, CapitalVault, E2E, ProfitVaultPeriods, GovernancePayoutFlow Tests vorhanden; ✅ Deployment-Skripte für Treasury, Factory, Mock-Tokens und vollständiges Deployment vorhanden.

**Deliverables**
- Solidity-Code (unter `contracts/v4/`) ✅
- Test-Suite (Hardhat) ✅
- Deployment/Config-Skripte ✅ (`hardhat/scripts/deploy-*.ts` mit Netzwerk-Konfiguration für Local, Sepolia, Base Sepolia, Base Mainnet)

### 1C – Backend-Jobs & Core-APIs
**Status:** ✅ Abgeschlossen (2025-01-XX)
**Ziele**
- Grundlegende Server-Logik & Integrationen.

**Tasks**
1. Queue/Worker Setup (BullMQ/Redis) für `registerPartnerShare`, `markWorkDelivered`, `activateCapitalShare`. ✅ (In-Memory Worker als Platzhalter)
2. Oracle-Webhooks (`/api/oracle/capital`) mit HMAC-Verifikation, Logging. ✅
3. Projekt-Anlage (`POST /api/projects`) inkl. Factory-Call, Persistenz. ✅ (API + on-chain Deploy + Scripts)
4. Proposal Lifecycle APIs (`/api/projects/:id/proposals`, Voting, Acceptance). ✅
5. Service-Layer (`partnerShareService`, `vaultService`, `governanceService`). ✅ (Projects/Governance/PartnerShares/Dividends/Vault vorhanden; Vault-RPC für `startDistributionOwner` und `confirmCapitalDeposit` implementiert; Queue-Job für `startDistribution` mit Idempotenz-Behandlung hinzugefügt; Accept-Endpoint triggert Distribution-Start bei PAYOUT-Proposals)
6. Tests (unit + integration). ✅ 22 API-Tests für alle v4-Endpunkte (Vitest) mit vollständiger Mock-Abdeckung

**Deliverables**
- Queue-Worker Code
- Neue API-Routen
- Service-Layer + Tests

### 1D – Datenbank/Legacy-Sync & Feature Flagging
**Status:** ✅ abgeschlossen (Repos auf v4 ergänzt, Flags & Legacy abgesichert)
**Ziele**
- Backend vollständig auf neues Schema heben, Legacy parallel halten aber isolieren.

**Tasks**
1. Repositorys/Queries auf neue Tabellen umstellen. ✅ (v4 Services und Migrations 017/018/019 vorhanden)
2. Legacy-Services (`vestingService`, `$CSTAKE`-APIs) in `legacy/` verschieben; Feature Flag `legacyMode`. ✅ (Legacy-Service verschoben, APIs flag-geschützt)
3. Monitoring/Logging für Jobs (Sentry, console). ✅ (Konsolenlogging im Queue-Worker; Sentry folgt in Ops)
4. Dokumentation aktualisieren (README, ENV-Beispiele, Deployment-Guides). ✅ (README + PHASE-5-ENV-VARS aktualisiert)

**Deliverables**
- Aktualisierte Backend-Module
- Dokumentierte Feature Flags
- Überarbeitete ENV/Doku

**Risiken / Notes**
- Legacy-Contracts müssen parallel bestehen, bis neue Pfade produktiv (Feature Flags/Namespaces).
- Off-Chain Jobs benötigen robuste Retry-Strategien.

---

## Teilabschnitt 2 – Frontend, Ops & Legacy-Bereinigung

**Status:** ✅ Abgeschlossen (2025-01-XX)
**Ziele**
- Frontend-Integration für v4.0 Protocol
- Projekt-Wizard für v4-Projekte
- Proposal-UI für Governance-Proposals
- Partner Dashboard mit Share-Übersicht
- Dividend-Claim-Interface
- Orakel/Compliance UX

**Tasks**
1. Projekt-Wizard für v4-Projekte (Factory-Integration). ✅ Route `/wizard/v4` erstellt mit 3-Step-Wizard (Welcome → Details → Review), Integration zu `/api/v4/projects`, Wallet-Integration, Feature-Flag-Check
2. Proposal-UI für Governance-Proposals (WORK, CAPITAL, PAYOUT, etc.). ✅ Route `/projects/[projectId]/proposals/v4/new` erstellt mit Type-Selection, dynamischen Formularen je nach Proposal-Typ, Wallet-Integration, API-Integration zu `/api/v4/projects/[projectId]/proposals`
3. Partner Dashboard: Share-Übersicht, SBT-Anzeige, Dividend-Claims. ✅ Route `/dashboard/v4/partner` erstellt mit Share-Übersicht, SBT-Anzeige, Dividend-Claim-Liste, Stats, API-Endpunkte `/api/v4/partners/shares` und `/api/v4/partners/dividends`
4. Governance-UI: Proposal-Erstellung, Voting, Execution. ✅ Route `/projects/[projectId]/proposals/v4/[proposalId]` erstellt mit Proposal-Details, Voting-Interface (YES/NO), Vote-Anzeige, Execution-Button, GET-Endpunkte für Proposal und Votes
5. Dividend-Claim-Interface: Period-Übersicht, Claim-Button. ✅ Vollständig implementiert mit Frontend-Transaction-Signing, Amount-Berechnung, automatischer Datenbank-Synchronisation
6. Oracle/Compliance UX (optional, für Capital-Events)

**Deliverables**
- Frontend-Komponenten für v4-Features
- Integration mit v4-APIs
- User-Flows für alle v4-Protokoll-Features

**Risiken / Notes**
- Frontend muss parallel zu Legacy-UI existieren (Feature Flags)
- Wallet-Integration für on-chain Actions (Proposals, Voting, Claims)
- ✅ Voting-Power-Berechnung aus PartnerRegister implementiert
- ✅ Proposal-Execution on-chain implementiert
- ✅ Dividend-Claim on-chain: Vollständig implementiert mit Frontend-Transaction-Signing (ThirdWeb hooks)

---

**Update-Verlauf**
- _2025-11-15:_ Grundstruktur & Teilabschnitt 1 definiert.
- _2025-01-XX:_ Distribution-Orchestration implementiert: Queue-Job `startDistribution` mit Idempotenz, Accept-Endpoint triggert Distribution bei PAYOUT-Proposals, Hardhat-Tests für Governance-Payout-Flow und Idempotenz hinzugefügt.
- _2025-01-XX:_ Backend-API-Tests komplett: 22 Tests für alle v4-API-Endpunkte (Vitest), Deployment-Skripte für v4-Contracts (Hardhat) mit Netzwerk-Konfiguration und Deployment-Tracking.
- _2025-01-XX:_ Frontend-Implementierung gestartet: v4-Projekt-Wizard, Proposal-UI, Governance-UI (Voting), Partner Dashboard mit Share-Übersicht, SBT-Anzeige und Dividend-Claim-Interface. On-Chain-Integration: Voting-Power-Berechnung, Proposal-Execution, Dividend-Claim-Validierung implementiert.
- _2025-01-XX:_ Dividend-Claim Frontend-Transaction-Signing vollständig implementiert: User signiert Transaktionen mit ThirdWeb hooks, automatische Datenbank-Synchronisation nach erfolgreichem Claim. Amount-Berechnung basierend auf Share-Prozentsatz und Period-Total implementiert.
- _2025-01-XX:_ Navigation-Integration abgeschlossen: v4-Routen in Navigation, UserAccountButton, Dashboards und Hero-Sections integriert. Feature-Flag-basierte Weiterleitung zu v4-Wizard. Link zu v4-Proposal-Erstellung im Founder Dashboard ProposalsTab hinzugefügt.
- _2025-01-XX:_ USERFLOW.md aktualisiert: v4.0 User Flows als vollständig implementiert markiert, alle Gaps geschlossen.

