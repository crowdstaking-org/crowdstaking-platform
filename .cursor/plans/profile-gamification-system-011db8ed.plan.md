<!-- 011db8ed-e075-42ca-a9aa-a2980b878fc2 2f09b8fb-4380-434d-bcf7-4aa04a650f08 -->
# Profile Gamification System - Minimal Viable Implementation

**Fokus:** Vertrauen & Reputation für Maria (Skeptische Pragmatikerin) etablieren

## TICKET-001: Profile Extended Schema (Database)

### 1.1 Profile Table Erweiterung

**Datei:** `supabase-migrations/009_extend_profiles_for_gamification.sql`

Erweitere bestehende `profiles` Tabelle um:

- `skills` (TEXT[]): Array von Skill-Tags (z.B. ["Solidity", "React", "Design"])
- `availability_status` (TEXT): "open", "busy", "unavailable"
- `twitter_username`, `linkedin_url`, `website_url` (TEXT): Zusätzliche Social Links
- `total_earned_tokens` (NUMERIC): Cache für Gesamtverdienst
- `trust_score` (NUMERIC): 0-100, wird regelmäßig berechnet
- `profile_views` (INTEGER): Counter für Profile-Aufrufe

### 1.2 Profile Stats Table (Cached Metrics)

**Datei:** `supabase-migrations/010_create_profile_stats.sql`

```sql
CREATE TABLE profile_stats (
  wallet_address TEXT PRIMARY KEY REFERENCES profiles(wallet_address),
  
  -- Contributor Metrics
  proposals_submitted INTEGER DEFAULT 0,
  proposals_accepted INTEGER DEFAULT 0,
  proposals_completed INTEGER DEFAULT 0,
  missions_completed INTEGER DEFAULT 0,
  completion_rate NUMERIC, -- % completed vs accepted
  avg_response_time_hours NUMERIC,
  
  -- Founder Metrics
  projects_created INTEGER DEFAULT 0,
  projects_live INTEGER DEFAULT 0,
  missions_created INTEGER DEFAULT 0,
  total_missions_payout NUMERIC DEFAULT 0,
  
  -- Social Metrics
  followers_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  endorsements_count INTEGER DEFAULT 0,
  
  -- Activity Metrics
  last_active_at TIMESTAMPTZ,
  streak_days INTEGER DEFAULT 0,
  total_activity_days INTEGER DEFAULT 0,
  
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### 1.3 Badges System

**Datei:** `supabase-migrations/011_create_badges_system.sql`

```sql
-- Badge Definitions (system-defined)
CREATE TABLE badge_definitions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_emoji TEXT,
  category TEXT NOT NULL, -- 'contributor', 'founder', 'community', 'special'
  rarity TEXT DEFAULT 'common', -- 'common', 'rare', 'epic', 'legendary'
  criteria JSONB NOT NULL, -- Criteria für automatische Badge-Vergabe
  sort_order INTEGER DEFAULT 0
);

-- User Badges (earned badges)
CREATE TABLE user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT NOT NULL REFERENCES profiles(wallet_address),
  badge_id TEXT NOT NULL REFERENCES badge_definitions(id),
  earned_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(wallet_address, badge_id)
);

CREATE INDEX idx_user_badges_wallet ON user_badges(wallet_address);
```

**Initial Badges:**

- `first_mission`: "First Mission Complete" - Erste Mission abgeschlossen
- `speed_demon`: "Speed Demon" - Mission in < 48h abgeschlossen
- `reliable`: "Reliable Contributor" - 90%+ Completion Rate bei 5+ Missions
- `lift_off`: "Lift-Off" - Erstes Projekt erstellt
- `token_launcher`: "Token Launcher" - Token auf DEX gebracht
- `fair_founder`: "Fair Founder" - 100% Payout bei 10+ Missions
- `networker`: "Networker" - Mit 10+ verschiedenen Users zusammengearbeitet
- `early_adopter`: "Early Adopter" - Zu den ersten 100 Usern

### 1.4 Social Features Tables

**Datei:** `supabase-migrations/012_create_social_features.sql`

```sql
-- Follow System
CREATE TABLE follows (
  follower_address TEXT NOT NULL REFERENCES profiles(wallet_address),
  following_address TEXT NOT NULL REFERENCES profiles(wallet_address),
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (follower_address, following_address),
  CHECK (follower_address != following_address)
);

CREATE INDEX idx_follows_follower ON follows(follower_address);
CREATE INDEX idx_follows_following ON follows(following_address);

-- Bookmarks (save users for later)
CREATE TABLE user_bookmarks (
  bookmarker_address TEXT NOT NULL REFERENCES profiles(wallet_address),
  bookmarked_address TEXT NOT NULL REFERENCES profiles(wallet_address),
  created_at TIMESTAMPTZ DEFAULT now(),
  notes TEXT, -- Private notes
  PRIMARY KEY (bookmarker_address, bookmarked_address)
);

-- Endorsements (LinkedIn-style)
CREATE TABLE endorsements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  endorser_address TEXT NOT NULL REFERENCES profiles(wallet_address),
  endorsed_address TEXT NOT NULL REFERENCES profiles(wallet_address),
  skill TEXT NOT NULL, -- Welches Skill wird endorsed
  message TEXT, -- Optional testimonial
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(endorser_address, endorsed_address, skill),
  CHECK (endorser_address != endorsed_address)
);

CREATE INDEX idx_endorsements_endorsed ON endorsements(endorsed_address);
```

### 1.5 Privacy Settings Table

**Datei:** `supabase-migrations/013_create_privacy_settings.sql`

```sql
CREATE TABLE profile_privacy (
  wallet_address TEXT PRIMARY KEY REFERENCES profiles(wallet_address),
  
  -- What's visible on profile
  show_token_holdings BOOLEAN DEFAULT false,
  show_earnings BOOLEAN DEFAULT false,
  show_wallet_address BOOLEAN DEFAULT false, -- If false: show as 0x123...abc
  show_activity_feed BOOLEAN DEFAULT true,
  show_github_activity BOOLEAN DEFAULT true,
  
  -- Who can interact
  allow_follows BOOLEAN DEFAULT true,
  allow_endorsements BOOLEAN DEFAULT true,
  
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Default privacy for new users (trigger)
CREATE OR REPLACE FUNCTION create_default_privacy()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profile_privacy (wallet_address)
  VALUES (NEW.wallet_address)
  ON CONFLICT (wallet_address) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_profile_created
AFTER INSERT ON profiles
FOR EACH ROW EXECUTE FUNCTION create_default_privacy();
```

### 1.6 Activity Timeline Table

**Datei:** `supabase-migrations/014_create_activity_timeline.sql`

```sql
CREATE TABLE activity_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT NOT NULL REFERENCES profiles(wallet_address),
  event_type TEXT NOT NULL, -- 'proposal_submitted', 'proposal_completed', 'project_created', etc.
  event_data JSONB NOT NULL, -- Flexible JSON data
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_activity_wallet ON activity_events(wallet_address, created_at DESC);
CREATE INDEX idx_activity_public ON activity_events(is_public, created_at DESC);
```

---

## Phase 2: Backend - Trust Score & Stats Calculation

### 2.1 Trust Score Algorithm

**Datei:** `src/lib/gamification/trustScore.ts`

```typescript
interface TrustScoreFactors {
  completionRate: number // 30% weight
  responseTime: number    // 20% weight
  endorsements: number    // 25% weight
  tokenHoldings: number   // 15% weight (Skin in the game)
  timeOnPlatform: number  // 10% weight
}

export async function calculateTrustScore(
  walletAddress: string
): Promise<number>
```

**Berechnung:**

1. Completion Rate: proposals_completed / proposals_accepted × 30
2. Response Time: Score basierend auf avg_response_time (< 2h = 100%, > 48h = 0)
3. Endorsements: Min(endorsements_count × 5, 25) - max 25 Punkte
4. Token Holdings: Diversity + Amount in eigenen Projects
5. Time on Platform: Tage seit Registrierung (Log-Scale)

### 2.2 Stats Update Service

**Datei:** `src/lib/gamification/statsUpdater.ts`

Funktionen zum Update von `profile_stats`:

- `updateContributorStats(walletAddress)`: Nach Proposal-Statusänderungen
- `updateFounderStats(walletAddress)`: Nach Projekt/Mission-Änderungen
- `updateSocialStats(walletAddress)`: Nach Follow/Endorsement
- `recalculateTrustScore(walletAddress)`: Nach jeder Stats-Änderung

### 2.3 Badge Award Service

**Datei:** `src/lib/gamification/badgeAwarder.ts`

```typescript
export async function checkAndAwardBadges(
  walletAddress: string
): Promise<string[]> // Returns newly awarded badge IDs
```

Prüft automatisch nach jeder Aktivität ob neue Badges verdient wurden.

---

## Phase 3: Backend API Routes

### 3.1 Profile API

**Datei:** `src/app/api/profiles/[address]/route.ts`

```
GET /api/profiles/[address]
  - Returns: Profile + Stats + Badges + Privacy-filtered data
  - Respects privacy settings
  - Increments profile_views counter

PUT /api/profiles/[address]
  - Update profile fields (only owner)
  - Skills, bio, social links, avatar, availability
  
GET /api/profiles/[address]/portfolio
  - Returns completed missions + projects
  - With deliverable links, testimonials
```

### 3.2 Privacy API

**Datei:** `src/app/api/profiles/privacy/route.ts`

```
GET /api/profiles/privacy
  - Returns privacy settings for authenticated user
  
PUT /api/profiles/privacy
  - Update privacy settings
```

### 3.3 Social API

**Datei:** `src/app/api/social/route.ts`

```
POST /api/social/follow
  - Follow a user
  
DELETE /api/social/follow/[address]
  - Unfollow
  
GET /api/social/followers/[address]
  - Get followers list
  
GET /api/social/following/[address]
  - Get following list

POST /api/social/bookmark
DELETE /api/social/bookmark/[address]
GET /api/social/bookmarks

POST /api/social/endorse
  - body: { endorsed_address, skill, message? }
GET /api/social/endorsements/[address]
  - Get endorsements for user
```

### 3.4 Leaderboards API

**Datei:** `src/app/api/leaderboards/route.ts`

```
GET /api/leaderboards?type=contributors&period=all
  - Types: 'contributors', 'founders', 'rising_stars'
  - Period: 'week', 'month', 'all'
  - Returns: Top 100 users sorted by relevant metric
  
Contributors: Sort by missions_completed
Founders: Sort by projects_live + total_missions_payout
Rising Stars: New users (< 30 days) by activity
```

### 3.5 Discovery API

**Datei:** `src/app/api/discover/contributors/route.ts`

```
GET /api/discover/contributors?skill=React&minTrustScore=70
  - Filter by skills, trust score, availability
  - Pagination support
```

---

## Phase 4: Frontend Components

### 4.1 Profile Page

**Datei:** `src/app/profiles/[address]/page.tsx`

**Layout:**

```
┌─────────────────────────────────────┐
│ Profile Header                      │
│ Avatar | Name | Trust Score | Badges│
│ Bio | Social Links | Skills         │
│ [Follow] [Bookmark] [Endorse]       │
├─────────────────────────────────────┤
│ Tabs:                               │
│  [Overview] [Portfolio] [Activity]  │
│                                     │
│ Overview Tab:                       │
│  • Stats Cards (Missions, Projects) │
│  • Badges Grid                      │
│  • Trust Score Breakdown            │
│  • Collaboration Network Viz        │
│                                     │
│ Portfolio Tab:                      │
│  • Completed Missions (Grid)        │
│  • Founded Projects (Grid)          │
│  • Testimonials                     │
│                                     │
│ Activity Tab:                       │
│  • Timeline of recent activities    │
│  • Filtered by privacy settings     │
└─────────────────────────────────────┘
```

### 4.2 Profile Components

**Dateien in:** `src/components/profile/`

- `ProfileHeader.tsx`: Avatar, Name, Trust Score, Action Buttons
- `TrustScoreDisplay.tsx`: Visual Score mit Breakdown-Modal
- `BadgesGrid.tsx`: Earned Badges mit Hover-Tooltips
- `StatsCards.tsx`: Key metrics als Cards
- `PortfolioGrid.tsx`: Completed work showcase
- `ActivityTimeline.tsx`: Recent activities
- `SkillTags.tsx`: Skill pills mit Endorsement counts
- `EndorsementsList.tsx`: Testimonials von anderen Usern

### 4.3 Leaderboards Page

**Datei:** `src/app/leaderboards/page.tsx`

3 Tabs: Top Contributors | Top Founders | Rising Stars

Table Format:

```
Rank | Avatar | Name | Key Metric | Trust Score | Badges | [View Profile]
```

### 4.4 Profile Settings Page

**Datei:** `src/app/settings/profile/page.tsx`

Tabs:

1. **Basic Info**: Display Name, Bio, Avatar, Skills, Social Links
2. **Privacy**: Toggle controls für alle privacy settings
3. **Availability**: Status + Calendar integration (future)

### 4.5 Social Interaction Components

**Dateien in:** `src/components/social/`

- `FollowButton.tsx`: Follow/Unfollow with count
- `BookmarkButton.tsx`: Bookmark user
- `EndorseModal.tsx`: Modal für Skill-Endorsement
- `FollowersList.tsx`: Modal mit Followers/Following
- `EndorsementCard.tsx`: Display endorsement mit Message

### 4.6 Integration in bestehende Seiten

**Dashboard (`src/app/dashboard/page.tsx`):**

- Link zu eigenem Profil prominent
- "View My Profile" Button im Header

**Proposals/Missions:**

- User-Avatars sind klickbar → Profil-Link
- Hover zeigt Trust Score + Top 3 Badges

**Project Pages:**

- Founder Profile Link
- Top Contributors Sektion (Top 3 Contributors für dieses Projekt)

---

## Phase 5: Automatic Stats & Badge Updates

### 5.1 Event Hooks einbauen

In bestehenden API Routes Hooks einfügen:

**Proposal Status Changes** (`src/app/api/proposals/*/route.ts`):

```typescript
// After status update
await updateContributorStats(proposal.creator_wallet_address)
await checkAndAwardBadges(proposal.creator_wallet_address)
await createActivityEvent(...)
```

**Project Creation** (`src/app/api/projects/route.ts`):

```typescript
await updateFounderStats(project.founder_wallet_address)
await checkAndAwardBadges(project.founder_wallet_address)
```

### 5.2 Cron Job für Trust Score

**Datei:** `src/app/api/cron/update-trust-scores/route.ts`

Vercel Cron (täglicher Update):

```typescript
export async function GET() {
  // Update Trust Scores für alle aktiven User (last 30 days)
  // Badge check für zeitbasierte Badges (z.B. Streaks)
}
```

---

## Phase 6: Testing & Polish

### 6.1 Seed Script für Test Data

**Datei:** `scripts/seed-gamification-data.ts`

- Erstelle 20 Test-Profile mit verschiedenen Stats
- Award diverse Badges
- Create Follow-Relationships
- Add Endorsements

### 6.2 Manual Testing Checklist

- [ ] Profile Page rendered korrekt
- [ ] Privacy Settings funktionieren
- [ ] Trust Score wird berechnet
- [ ] Badges werden automatisch vergeben
- [ ] Follow/Bookmark/Endorse funktioniert
- [ ] Leaderboards zeigen korrekte Rankings
- [ ] Activity Timeline zeigt Events
- [ ] Mobile responsive
- [ ] Profile-Links in Proposals/Projects funktionieren

### 6.3 Performance Optimization

- [ ] Add caching für Leaderboards (Redis oder Vercel KV)
- [ ] Lazy loading für Activity Timeline
- [ ] Image optimization für Avatars
- [ ] DB Indexes prüfen mit EXPLAIN ANALYZE

---

## Offene Design-Entscheidungen

1. **Avatar System**: Eigene Uploads oder Integration mit ENS/Lens/Farcaster Avatars?
2. **Profile URLs**: `/profiles/0x123...abc` oder `/profiles/@username` (custom handles)?
3. **Testimonials**: Separate Feature oder nur via Endorsement-Messages?
4. **Collaboration Network Viz**: Simple Liste oder interaktiver Graph?
5. **Skills Taxonomy**: Frei wählbar oder vordefinierte Liste?

---

## Erwartete Entwicklungszeit

- Phase 1 (DB): 6-8h
- Phase 2 (Backend Logic): 8-10h
- Phase 3 (API Routes): 10-12h
- Phase 4 (Frontend): 16-20h
- Phase 5 (Integration): 4-6h
- Phase 6 (Testing): 4-6h

**Total: ~50-62h** (1-1.5 Wochen bei Vollzeit)