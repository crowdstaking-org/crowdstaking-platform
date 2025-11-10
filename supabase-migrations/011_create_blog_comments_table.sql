-- Migration: Create blog_comments table
-- Author: CrowdStaking Team
-- Date: 2025-11-10
-- Description: Stores comments on blog posts with author information

CREATE TABLE IF NOT EXISTS blog_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL,
  author_wallet_address TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Constraints
  CONSTRAINT blog_comments_content_length 
    CHECK (length(content) >= 1 AND length(content) <= 1000),
  
  -- Foreign key to blog_posts
  CONSTRAINT fk_blog_comments_post 
    FOREIGN KEY (post_id) 
    REFERENCES blog_posts(id) 
    ON DELETE CASCADE,
  
  -- Foreign key to profiles
  CONSTRAINT fk_blog_comments_author 
    FOREIGN KEY (author_wallet_address) 
    REFERENCES profiles(wallet_address) 
    ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_blog_comments_post_id 
  ON blog_comments(post_id, created_at ASC);

CREATE INDEX IF NOT EXISTS idx_blog_comments_author 
  ON blog_comments(author_wallet_address);

-- Add comments for documentation
COMMENT ON TABLE blog_comments IS 
  'Comments on blog posts with author information';

COMMENT ON COLUMN blog_comments.post_id IS 
  'Reference to the blog post being commented on';

COMMENT ON COLUMN blog_comments.author_wallet_address IS 
  'Wallet address of the comment author';

COMMENT ON COLUMN blog_comments.content IS 
  'Comment text content (max 1000 characters)';

