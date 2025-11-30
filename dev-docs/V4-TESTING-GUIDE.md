# CrowdStaking v4.0 – Testing Guide 🧪

**Datum:** 2025-11-29  
**Deployment-Status:** ✅ ACTIVE  
**App URL:** https://crowdstaking.org

---

## 🎯 Was ist neu in v4.0?

### Hauptunterschiede zur Legacy-Version

| Feature | Legacy (v3) | v4.0 |
|---------|-------------|------|
| **Token-Modell** | ERC20 $CSTAKE (handelbar) | Soulbound Tokens (SBTs, nicht handelbar) |
| **Partnerschaft** | Token-Kauf | Governance-basierte Partner-Aufnahme |
| **Dividenden** | Token-Holding | Share-basierte Dividenden aus ProfitVault |
| **Governance** | Off-chain | On-chain Governance mit Voting Power |
| **Projekt-Erstellung** | Legacy Wizard | v4 Wizard mit Factory-Deployment |

---

## ✅ Sichtbare Unterschiede (sofort erkennbar)

### 1. Navigation & Links

#### ✅ **"Start Mission" Button**
- **Wo:** Navigation Bar (oben rechts)
- **Legacy:** Führt zu `/wizard`
- **v4.0:** Führt zu `/wizard/v4` (neuer 3-Schritt-Wizard)
- **Test:** Klicke auf "Start Mission" → sollte zu `/wizard/v4` führen

#### ✅ **Partner Dashboard (v4) Link**
- **Wo:** User Account Dropdown (nach Login)
- **Legacy:** Nicht vorhanden
- **v4.0:** Neuer Link "Partner Dashboard (v4)" → `/dashboard/v4/partner`
- **Test:** 
  1. Login mit Wallet
  2. Klicke auf User-Avatar (oben rechts)
  3. Prüfe Dropdown → sollte "Partner Dashboard (v4)" zeigen

#### ✅ **Hero Section CTAs**
- **Wo:** Homepage Hero Section
- **Legacy:** "Start Mission" → `/wizard`
- **v4.0:** "Start Mission" → `/wizard/v4`
- **Test:** Homepage öffnen → "Start Mission" Button sollte zu v4-Wizard führen

---

## 🧪 Test-Checkliste

### Phase 1: Sichtbare UI-Änderungen (5 Minuten)

#### ✅ Test 1.1: Navigation prüfen
1. Öffne https://crowdstaking.org
2. Prüfe Navigation Bar (oben)
3. **Erwartung:** "Start Mission" Button sichtbar
4. Klicke auf "Start Mission"
5. **Erwartung:** Weiterleitung zu `/wizard/v4` (nicht `/wizard`)

**✅ Erfolg:** URL zeigt `/wizard/v4` und Wizard startet

---

#### ✅ Test 1.2: User Account Dropdown
1. Login mit Wallet (Connect Button)
2. Klicke auf User-Avatar (oben rechts)
3. **Erwartung:** Dropdown öffnet sich
4. Prüfe Menü-Items
5. **Erwartung:** "Partner Dashboard (v4)" Link sichtbar

**✅ Erfolg:** "Partner Dashboard (v4)" Link vorhanden

---

#### ✅ Test 1.3: v4 Wizard öffnen
1. Navigiere zu `/wizard/v4`
2. **Erwartung:** 3-Schritt-Wizard öffnet sich
   - Step 1: Welcome Screen
   - Step 2: Project Details (Name, Slug, Mission)
   - Step 3: Review & Deploy
3. Prüfe UI-Elemente
4. **Erwartung:** Wallet-Connection-Button, Formular-Felder, Progress-Indicator

**✅ Erfolg:** Wizard lädt ohne Fehler

---

### Phase 2: Partner Dashboard (10 Minuten)

#### ✅ Test 2.1: Partner Dashboard öffnen
1. Navigiere zu `/dashboard/v4/partner`
2. **Erwartung:** Partner Dashboard lädt
3. Prüfe UI-Sektionen:
   - "My Shares" (Partner-Anteile)
   - "My SBTs" (Soulbound Token IDs)
   - "Dividend Claims" (Verfügbare Dividenden)
4. **Erwartung:** Dashboard zeigt Daten (oder "No shares yet" wenn leer)

**✅ Erfolg:** Dashboard lädt ohne Fehler

---

#### ✅ Test 2.2: Shares anzeigen
1. Im Partner Dashboard: "My Shares" Sektion
2. **Erwartung:** Liste von Projekten mit Share-BPS (Basis Points)
3. Beispiel: "Project X: 1000 BPS (10%)"
4. **Hinweis:** Wenn leer → normal (noch keine Partner-Aufnahme)

**✅ Erfolg:** Shares werden angezeigt (oder "No shares yet")

---

#### ✅ Test 2.3: SBT Token IDs anzeigen
1. Im Partner Dashboard: "My SBTs" Sektion
2. **Erwartung:** Liste von Token IDs pro Projekt
3. Beispiel: "Project X: Token #1"
4. **Hinweis:** SBTs werden nur nach Partner-Aufnahme gemint

**✅ Erfolg:** SBTs werden angezeigt (oder "No SBTs yet")

---

### Phase 3: Projekt-Erstellung (15 Minuten)

#### ✅ Test 3.1: v4 Wizard durchlaufen
1. Öffne `/wizard/v4`
2. **Step 1:** Welcome Screen → "Continue"
3. **Step 2:** Fülle Formular aus:
   - Project Name: "Test Project v4"
   - Slug: "test-project-v4"
   - Mission: "Testing v4.0 deployment"
4. **Step 3:** Review & Deploy
   - Prüfe Zusammenfassung
   - Klicke "Deploy Project"
5. **Erwartung:** 
   - Loading State
   - Success Message
   - Weiterleitung zu Projekt-Dashboard

**✅ Erfolg:** Projekt wird erstellt (on-chain via Factory)

**⚠️ Hinweis:** Wenn Factory-Fehler → normal (Factory-Features werden später aktiviert)

---

#### ✅ Test 3.2: Projekt-Details prüfen
1. Nach Projekt-Erstellung: Projekt-Dashboard öffnen
2. Prüfe:
   - Projekt-Name, Slug, Mission
   - Contract-Adressen (PartnerRegister, GovernanceModule, Vaults)
   - Projekt-Status
3. **Erwartung:** Alle Daten korrekt angezeigt

**✅ Erfolg:** Projekt-Details korrekt

---

### Phase 4: Governance & Proposals (20 Minuten)

#### ✅ Test 4.1: Proposal-Erstellung
1. Navigiere zu Projekt-Dashboard
2. Öffne "Proposals" Tab
3. **Erwartung:** "Create v4 Proposal" Button sichtbar
4. Klicke auf Button
5. **Erwartung:** Weiterleitung zu `/projects/[projectId]/proposals/v4/new`
6. Prüfe Proposal-Typen:
   - WORK (Arbeits-Proposal)
   - CAPITAL (Kapital-Proposal)
   - PAYOUT (Auszahlungs-Proposal)
   - BOUNTY (Bounty-Proposal)
   - REVOKE (Partner-Entfernung)

**✅ Erfolg:** Proposal-Formular lädt

---

#### ✅ Test 4.2: Proposal erstellen
1. Im Proposal-Formular:
   - Wähle Proposal-Typ (z.B. "WORK")
   - Fülle Formular aus (abhängig vom Typ)
   - Klicke "Create Proposal"
2. **Erwartung:**
   - Loading State
   - Success Message
   - Weiterleitung zu Proposal-Detail-Seite

**✅ Erfolg:** Proposal wird erstellt

---

#### ✅ Test 4.3: Proposal-Details anzeigen
1. Öffne Proposal-Detail-Seite: `/projects/[projectId]/proposals/v4/[proposalId]`
2. Prüfe:
   - Proposal-Typ, Status, Deadline
   - Voting-Interface (YES/NO Buttons)
   - Vote-Statistiken
   - Execution-Button (wenn Deadline erreicht)
3. **Erwartung:** Alle Daten korrekt angezeigt

**✅ Erfolg:** Proposal-Details korrekt

---

#### ✅ Test 4.4: Voting testen
1. Auf Proposal-Detail-Seite
2. Klicke "Vote YES" oder "Vote NO"
3. **Erwartung:**
   - Wallet-Popup (Transaction Signing)
   - Success Message
   - Vote-Statistiken aktualisieren sich
4. **Hinweis:** Voting ist off-chain (kann später on-chain erweitert werden)

**✅ Erfolg:** Voting funktioniert

---

### Phase 5: Dividend Claims (15 Minuten)

#### ✅ Test 5.1: Verfügbare Dividenden prüfen
1. Im Partner Dashboard: "Dividend Claims" Sektion
2. **Erwartung:** Liste von verfügbaren Dividend-Perioden
3. Beispiel: "Q1-2024: 100 USDC available"
4. **Hinweis:** Dividenden müssen erst durch Governance-Proposal gestartet werden

**✅ Erfolg:** Dividenden werden angezeigt (oder "No dividends available")

---

#### ✅ Test 5.2: Dividend Claim testen
1. Wenn Dividende verfügbar:
   - Klicke "Claim" Button
   - **Erwartung:** Wallet-Popup (Transaction Signing)
   - Signiere Transaction
   - **Erwartung:** Success Message, Balance aktualisiert
2. **Hinweis:** Claim ist on-chain (ProfitVault.claim())

**✅ Erfolg:** Dividend Claim funktioniert

---

## 🔍 Was sollte NICHT funktionieren (erwartet)

### ⚠️ Factory-Features (noch nicht aktiv)
- **Projekt-Erstellung via Factory:** Kann Fehler geben, wenn Factory nicht vollständig konfiguriert ist
- **Automatische Contract-Deployment:** Wird später aktiviert

### ⚠️ On-Chain Features (benötigen Testnet-Tokens)
- **Dividend Claims:** Benötigen Test-Tokens im ProfitVault
- **Proposal Execution:** Benötigen on-chain Voting Power

---

## 📊 Vergleich: Legacy vs. v4.0

### Legacy-Version (v3)
- ✅ Token-Kauf ($CSTAKE)
- ✅ Token-Holding
- ✅ Off-chain Governance
- ✅ Legacy Wizard (`/wizard`)

### v4.0 Version
- ✅ Soulbound Tokens (SBTs)
- ✅ Share-basierte Dividenden
- ✅ On-chain Governance
- ✅ v4 Wizard (`/wizard/v4`)
- ✅ Partner Dashboard (`/dashboard/v4/partner`)
- ✅ Proposal-Erstellung (`/projects/[id]/proposals/v4/new`)
- ✅ Dividend Claims (on-chain)

---

## 🐛 Bekannte Probleme & Workarounds

### Problem 1: Factory-Deployment schlägt fehl
**Symptom:** Fehler beim Projekt-Deployment  
**Ursache:** Factory noch nicht vollständig konfiguriert  
**Workaround:** Projekt-Erstellung manuell über API testen

### Problem 2: Keine Dividenden sichtbar
**Symptom:** Partner Dashboard zeigt "No dividends available"  
**Ursache:** Noch keine Distribution gestartet  
**Workaround:** Normal – Dividenden müssen erst durch Governance-Proposal gestartet werden

### Problem 3: Voting funktioniert nicht
**Symptom:** Vote-Button reagiert nicht  
**Ursache:** Wallet nicht verbunden oder Proposal-Status ungültig  
**Workaround:** Wallet verbinden, Proposal-Status prüfen

---

## ✅ Erfolgs-Kriterien

### Must-Have (kritisch)
- [x] Navigation zeigt v4.0 Links
- [x] v4 Wizard lädt ohne Fehler
- [x] Partner Dashboard lädt ohne Fehler
- [x] Proposal-Erstellung funktioniert
- [x] Proposal-Details werden angezeigt

### Nice-to-Have (optional)
- [ ] Projekt-Erstellung via Factory funktioniert
- [ ] Dividend Claims funktionieren (benötigt Test-Tokens)
- [ ] Proposal Execution funktioniert (benötigt Voting Power)

---

## 📝 Test-Protokoll

### Test-Datum: _______________
### Tester: _______________

#### Phase 1: UI-Tests
- [ ] Navigation prüfen
- [ ] User Account Dropdown prüfen
- [ ] v4 Wizard öffnen

#### Phase 2: Partner Dashboard
- [ ] Dashboard öffnen
- [ ] Shares anzeigen
- [ ] SBTs anzeigen

#### Phase 3: Projekt-Erstellung
- [ ] Wizard durchlaufen
- [ ] Projekt-Details prüfen

#### Phase 4: Governance
- [ ] Proposal-Erstellung
- [ ] Proposal-Details
- [ ] Voting testen

#### Phase 5: Dividenden
- [ ] Verfügbare Dividenden prüfen
- [ ] Dividend Claim testen

---

## 🚀 Nächste Schritte nach Testing

1. **Feedback sammeln:** Notiere alle gefundenen Probleme
2. **Factory optimieren:** Wenn Factory-Features nicht funktionieren
3. **Test-Tokens bereitstellen:** Für Dividend-Claim-Tests
4. **Dokumentation aktualisieren:** Basierend auf Test-Ergebnissen

---

## 📞 Support

Bei Problemen:
1. Prüfe Browser-Console (F12) auf Fehler
2. Prüfe Network-Tab auf fehlgeschlagene API-Calls
3. Prüfe DigitalOcean Logs: `doctl apps get-logs ...`
4. Erstelle Issue mit Screenshots und Fehler-Logs

---

**Viel Erfolg beim Testing! 🎉**

