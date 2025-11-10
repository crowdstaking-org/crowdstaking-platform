<!-- 885481ff-b980-4219-8f2f-f13db188957e 1a711cd2-a332-470a-98b5-2d368361ec8c -->
# Blog System - Minimalinvasives Refinement

## Wiederverwendete Patterns (Keine Änderungen nötig)

- ✅ API Response Utils: `successResponse()`, `errorResponse()` aus `lib/api.ts`
- ✅ Auth Pattern: `requireAuth()` aus `lib/auth.ts`
- ✅ Supabase Client: Direkter Import aus `lib/supabase.ts`
- ✅ Zod Validation Pattern: Wie in `types/proposal.ts`
- ✅ React Query Pattern: Wie in `hooks/useProposals.ts`
- ✅ Form Pattern: React Hook Form + MarkdownEditor (siehe `dashboard/propose/page.tsx`)

## MVP-Vereinfachungen

- ❌ **Kein Scheduled Publishing**: Nur `draft` / `published` Status
- ❌ **Kein Comment Editing**: Nur Create/Delete (kein Update)
- ❌ **Kein SEO-Feature**: Optional für Phase 2
- ❌ **Excerpt Auto-Generated**: Erste 200 Zeichen vom Content
- ✅ **Tags Simple**: TEXT[] Array, keine separate Tag-Tabelle
- ✅ **View Count Simple**: Einfacher Counter, kein Analytics

---

# TICKET 1: Database Schema

**Dateien:** 3 neue Migrations

**Definition of Done:**

- `supabase-migrations/009_add_email_to_profiles.sql` erstellt
- Fügt `email TEXT UNIQUE` zu `profiles` hinzu
- Index auf `email` WHERE `email IS NOT NULL`
- `supabase-migrations/010_create_blog_posts_table.sql` erstellt
- Felder: `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`, `title TEXT NOT NULL`, `slug TEXT UNIQUE NOT NULL`, `content TEXT NOT NULL`, `author_wallet_address TEXT NOT NULL` (FK), `status TEXT CHECK (status IN ('draft', 'published'))`, `published_at TIMESTAMPTZ`, `tags TEXT[]`, `view_count INTEGER DEFAULT 0`, `created_at TIMESTAMPTZ DEFAULT now()`, `updated_at TIMESTAMPTZ DEFAULT now()`
- Indexes: `slug` (unique), `status`, `published_at DESC`, `tags` (GIN index)
- FK constraint zu `profiles(wallet_address)` ON DELETE CASCADE
- `supabase-migrations/011_create_blog_comments_table.sql` erstellt
- Felder: `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`, `post_id UUID NOT NULL` (FK), `author_wallet_address TEXT NOT NULL` (FK), `content TEXT NOT NULL CHECK (length(content) >= 1 AND length(content) <= 1000)`, `created_at TIMESTAMPTZ DEFAULT now()`
- Indexes: `post_id`, `author_wallet_address`
- FK constraints zu `blog_posts(id)` und `profiles(wallet_address)` ON DELETE CASCADE

---

# TICKET 2: TypeScript Types & Validation

**Dateien:** 1 neue Datei

**Definition of Done:**

- `src/types/blog.ts` erstellt mit:
- `BlogPostStatus` Type: `'draft' | 'published'`
- `BlogPost` Interface mit allen DB-Feldern + optional `author` (Profile)
- `BlogComment` Interface mit allen DB-Feldern + optional `author` (Profile)
- `CreateBlogPostInput` Interface
- `UpdateBlogPostInput` Interface (partial)
- `CreateCommentInput` Interface
- Zod Schemas: `blogPostSchema`, `commentSchema`
- Slug-Generator Funktion: `generateSlug(title: string): string`

---

# TICKET 3: Super-Admin Auth

**Dateien:** `src/lib/auth.ts` erweitern

**Definition of Done:**

- Funktion `isSuperAdmin(walletAddress: string): Promise<boolean>` hinzugefügt
- Holt Profile aus Supabase via `wallet_address`
- Prüft ob `email` === `'dispatcher@crowdstaking.org'` ODER `'th@consensus.ventures'`
- Returnt `true` wenn match, sonst `false`
- Funktion `requireSuperAdmin(request: Request): Promise<string>` hinzugefügt
- Ruft `requireAuth(request)` auf
- Ruft `isSuperAdmin(wallet)` auf
- Wirft Error 403 wenn nicht Super-Admin
- Returnt wallet address wenn Super-Admin

---

# TICKET 4: Admin API - Blog Post Management

**Dateien:** 2 neue API Routes

**Definition of Done:**

- `src/app/api/blog/admin/posts/route.ts` erstellt
- `GET`: Liste aller Posts (inkl. drafts), joined mit profiles für author info, query params für pagination (`page`, `limit`), ordering nach `created_at DESC`, requireSuperAdmin
- `POST`: Neuen Post erstellen, Zod validation, slug auto-generiert aus title, requireSuperAdmin, returnt created post
- `src/app/api/blog/admin/posts/[id]/route.ts` erstellt
- `GET`: Einzelner Post by ID (auch drafts), joined mit author profile, requireSuperAdmin
- `PUT`: Post aktualisieren, Zod validation, slug regenerieren wenn title geändert, `updated_at` setzen, requireSuperAdmin
- `DELETE`: Post löschen (CASCADE löscht automatisch Comments), requireSuperAdmin

---

# TICKET 5: Public API - Blog Posts

**Dateien:** 2 neue API Routes

**Definition of Done:**

- `src/app/api/blog/posts/route.ts` erstellt
- `GET`: Liste published Posts, joined mit author profiles, query params: `page`, `limit`, `tag` (filter), ordering nach `published_at DESC`, nur status=published
- `src/app/api/blog/posts/[slug]/route.ts` erstellt
- `GET`: Einzelner Post by slug, nur published, joined mit author, inkrementiert `view_count` bei jedem call

---

# TICKET 6: Public API - Comments

**Dateien:** 2 neue API Routes

**Definition of Done:**

- `src/app/api/blog/posts/[id]/comments/route.ts` erstellt
- `GET`: Alle Comments zu einem Post, joined mit author profiles, ordering nach `created_at ASC`, öffentlich (kein auth)
- `POST`: Neuen Comment erstellen, requireAuth, Zod validation, returnt created comment with author
- `src/app/api/blog/comments/[id]/route.ts` erstellt
- `DELETE`: Comment löschen, requireAuth, nur wenn `author_wallet_address` === authenticated wallet

---

# TICKET 7: React Query Hooks

**Dateien:** 1 neue Datei

**Definition of Done:**

- `src/hooks/useBlog.ts` erstellt mit:
- `useAdminBlogPosts(page?: number)` - Fetch für Admin (alle posts)
- `useBlogPosts(page?: number, tag?: string)` - Fetch published posts
- `useBlogPost(slug: string)` - Fetch single post
- `useCreateBlogPost()` - Mutation für Post-Erstellung
- `useUpdateBlogPost(id: string)` - Mutation für Post-Update
- `useDeleteBlogPost(id: string)` - Mutation für Post-Deletion
- `useBlogComments(postId: string)` - Fetch comments
- `useCreateComment(postId: string)` - Mutation für Comment-Erstellung
- `useDeleteComment(commentId: string)` - Mutation für Comment-Deletion
- Alle mit QueryClient invalidation nach mutations

---

# TICKET 8: Admin UI - Blog Post Form

**Dateien:** 1 neue Component

**Definition of Done:**

- `src/components/blog/admin/BlogPostForm.tsx` erstellt
- React Hook Form mit Zod validation
- Felder: `title` (text input), `content` (MarkdownEditor, maxLength 50000), `tags` (text input mit comma-separated hint), `status` (select: draft/published)
- Slug preview (auto-generated from title, readonly)
- Preview Modal (zeigt rendered markdown)
- Submit button mit loading state
- Props: `initialData?: BlogPost`, `onSubmit: (data) => Promise<void>`

---

# TICKET 9: Admin UI - Blog Management Page

**Dateien:** 3 neue Pages

**Definition of Done:**

- `src/app/admin/blog/page.tsx` erstellt
- Super-Admin Protected (redirect zu `/` wenn nicht super-admin)
- Table mit allen Posts: title, status (badge), published_at, view_count, tags (chips)
- Actions: Edit (→ `/admin/blog/[id]/edit`), Delete (mit Confirmation)
- "New Post" Button (→ `/admin/blog/new`)
- Pagination
- Verwendet `useAdminBlogPosts()` Hook
- `src/app/admin/blog/new/page.tsx` erstellt
- Super-Admin Protected
- Verwendet `BlogPostForm` ohne initialData
- onSubmit → `useCreateBlogPost()` → redirect zu `/admin/blog`
- `src/app/admin/blog/[id]/edit/page.tsx` erstellt
- Super-Admin Protected
- Lädt Post via `useAdminBlogPosts()` oder separate fetch
- Verwendet `BlogPostForm` mit initialData
- onSubmit → `useUpdateBlogPost()` → redirect zu `/admin/blog`

---

# TICKET 10: Public UI - Blog Components

**Dateien:** 3 neue Components

**Definition of Done:**

- `src/components/blog/BlogPostCard.tsx` erstellt
- Props: `post: BlogPost`
- Card UI mit title, excerpt (first 200 chars of content), author display_name, published_at (formatted), tags (chips), view_count
- Link zu `/blog/[slug]`
- Responsive Grid-Item
- `src/components/blog/BlogPostDetail.tsx` erstellt
- Props: `post: BlogPost`
- Header mit title, author info (display_name + avatar_url wenn vorhanden), published_at, tags, view_count
- ReactMarkdown rendered content mit remarkGfm
- Back-to-blog Link
- `src/components/blog/CommentSection.tsx` erstellt
- Props: `postId: string`
- Verwendet `useBlogComments(postId)` Hook
- Liste aller Comments mit author info, created_at, content
- Delete button (nur bei eigenen comments, wenn authenticated)
- `CommentForm` component wenn authenticated
- "Bitte einloggen um zu kommentieren" wenn nicht authenticated

---

# TICKET 11: Public UI - Blog Pages

**Dateien:** 2 neue Pages

**Definition of Done:**

- `src/app/blog/page.tsx` erstellt
- Öffentlich (kein auth required)
- Hero Section: "CrowdStaking Blog"
- Grid von `BlogPostCard` components
- Pagination
- Verwendet `useBlogPosts()` Hook
- `src/app/blog/[slug]/page.tsx` erstellt
- Öffentlich
- Verwendet `useBlogPost(slug)` Hook
- Zeigt `BlogPostDetail` component
- `CommentSection` unterhalb
- 404 wenn post nicht found

---

# TICKET 12: Navigation & Documentation

**Dateien:** `Navigation.tsx`, `USERFLOW.md`

**Definition of Done:**

- `src/components/Navigation.tsx` erweitert
- "Blog" Link hinzugefügt zwischen "About" und "Whitepaper"
- Desktop & Mobile Navigation
- `dev-docs/USERFLOW.md` erweitert
- Blog-Reader-Flow: `Landing` → `Blog (/blog)` → `Post Detail (/blog/[slug])` → `Comments`
- Blog-Admin-Flow: `Admin Dashboard` → `Blog Management (/admin/blog)` → `Create/Edit Post`
- Keine [!GAP!] oder [!DEAD END!] markieren (vollständiger Flow)

### To-dos

- [ ] Erstelle 3 Datenbank-Migrationen (email zu profiles, blog_posts, blog_comments)
- [ ] Erstelle blog.ts types und erweitere auth.ts um Super-Admin-Funktionen
- [ ] Implementiere Admin API-Routes für Blog-Post-Management
- [ ] Implementiere öffentliche API-Routes für Posts und Comments
- [ ] Erstelle Admin-Components (BlogPostForm, BlogPostList)
- [ ] Erstelle Admin-Pages für Blog-Management
- [ ] Erstelle öffentliche Blog-Components (Cards, Detail, Comments)
- [ ] Erstelle öffentliche Blog-Pages (Übersicht, Detail)
- [ ] Implementiere Custom Hooks für Blog-Posts und Comments
- [ ] Update Navigation und USERFLOW-Dokumentation