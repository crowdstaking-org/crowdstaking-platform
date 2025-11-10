-- Migration: Create blog_posts table
-- Author: CrowdStaking Team
-- Date: 2025-11-10
-- Description: Stores blog posts with markdown content, tags, and view tracking

CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  author_wallet_address TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  tags TEXT[] DEFAULT '{}',
  view_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Constraints
  CONSTRAINT blog_posts_status_check 
    CHECK (status IN ('draft', 'published')),
  CONSTRAINT blog_posts_title_length 
    CHECK (length(title) >= 1 AND length(title) <= 200),
  CONSTRAINT blog_posts_slug_format 
    CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  CONSTRAINT blog_posts_content_length 
    CHECK (length(content) >= 1 AND length(content) <= 50000),
  
  -- Foreign key to profiles
  CONSTRAINT fk_blog_posts_author 
    FOREIGN KEY (author_wallet_address) 
    REFERENCES profiles(wallet_address) 
    ON DELETE CASCADE
);

-- Indexes for performance
CREATE UNIQUE INDEX IF NOT EXISTS idx_blog_posts_slug 
  ON blog_posts(slug);

CREATE INDEX IF NOT EXISTS idx_blog_posts_status 
  ON blog_posts(status);

CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at 
  ON blog_posts(published_at DESC) 
  WHERE published_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_blog_posts_author 
  ON blog_posts(author_wallet_address);

CREATE INDEX IF NOT EXISTS idx_blog_posts_tags 
  ON blog_posts USING GIN(tags);

CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at 
  ON blog_posts(created_at DESC);

-- Add comments for documentation
COMMENT ON TABLE blog_posts IS 
  'Blog posts with markdown content, tags, and view tracking';

COMMENT ON COLUMN blog_posts.slug IS 
  'URL-friendly slug generated from title (unique, lowercase, hyphen-separated)';

COMMENT ON COLUMN blog_posts.status IS 
  'Publication status: draft or published';

COMMENT ON COLUMN blog_posts.published_at IS 
  'Timestamp when the post was published (null for drafts)';

COMMENT ON COLUMN blog_posts.tags IS 
  'Array of tags for categorization and filtering';

COMMENT ON COLUMN blog_posts.view_count IS 
  'Number of times the post has been viewed';

