-- Migration: Add featured_image to blog_posts
-- Author: CrowdStaking Team
-- Date: 2025-11-11
-- Description: Adds optional featured_image column for blog post header images

-- Add featured_image column (nullable, optional)
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS featured_image TEXT;

-- Add comment for documentation
COMMENT ON COLUMN blog_posts.featured_image IS 
  'Optional URL/path to featured image (e.g., /blog/images/slug.jpg)';

-- Verify column was added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'blog_posts' 
  AND column_name = 'featured_image';

