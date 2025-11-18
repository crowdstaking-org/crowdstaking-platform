# ADR 0001 – CrowdStaking v4 Architektur

## Status
Accepted – 2025-11-15

## Kontext
Die Legacy-Architektur basiert auf einem einzelnen ERC20-Token ($CSTAKE) und einem VestingContract, der Token-Anteile linear freigibt. Das neue Geschäftsmodell (Soulbound Partneranteile, Dividendenvaults, 2%-Plattform-Gebühr) erfordert:
- Nicht handelbare Partner-Anteile (Proof-of-Work/Capital).
- Pro-Projekt-Contracts (Register, Governance, Gewinn-/Kapital-Tresore).
- Automatisierte 2%-Abführung an den CrowdStaking-Haupttresor.
- Off-Chain-Services (Oracle, Queue) zur Synchronisierung von Vorschlags-/Liefer-Workflows.

## Entscheidung
1. **Contract-Suite pro Projekt**
   - `ProjectFactory`: Deployt pro Projekt Minimal-Clones der Standard-Contracts, registriert Adressen und initiale Partner (Gründer).
   - `PartnerRegister`: Verwaltet Anteile in Basis-Punkten, mintet ERC-5192-Soulbound-Token, unterstützt `renouncePartnership` & `revokePartner`.
   - `GovernanceModule`: Proposal/Voting-System (Typed Proposals für WORK, BOUNTY, CAPITAL, PAYOUT, REVOKE). Stellt Hooks für Register/Vault bereit.
   - `GewinnTresor`: Empfängt Einnahmen, zieht 2% Fee ab (Weiterleitung an Haupttresor), schaltet claimable Perioden frei.
   - `KapitalTresor`: Verwaltet kapitalgebundene Einzahlungen, tracked Zweckbindung, signalisiert Governance bei Zahlungseingang.
   - `CrowdStakingHauptTresor`: Globaler Treasury-Contract; $CROWDSTAKING-SBT-Anteile können Dividenden claimen.

2. **Off-Chain Orchestrierung**
   - Queue/Worker (BullMQ) verantwortet aufwendige Schritte (registerPartnerShare, markWorkDelivered, activateCapitalShare).
   - Oracle-Webhook (Open Banking) liefert signierte Events; Worker ruft `activateCapitalShare` auf.

3. **Datenmodell**
   - Neue Tabellen: `projects_v4`, `project_contracts`, `partner_shares`, `governance_proposals`, `governance_votes`, `dividend_claims`.
   - Legacy-Tabellen bleiben bis zur vollständigen Migration bestehen.

4. **Feature Flag**
   - Runtime-Schalter `ENABLE_V4_PROTOCOL` entscheidet, ob APIs/Frontend den neuen Stack nutzen.

## Konsequenzen
- Größere Anzahl an Contracts/Deployments → Deployment-Skripte und Config-Management erforderlich.
- Off-Chain Services sind kritischer; müssen monitorbar und fehlertolerant sein.
- Doppelter Codepfad (Legacy vs. v4) während Migration; strikte Namespace-Trennung notwendig.

