-- Add tags array for flexible categorization
-- This enables filtering by tech stack, categories, and features
-- without needing separate normalized tables

-- Add tags column to projects table
ALTER TABLE projects ADD COLUMN tags TEXT[] DEFAULT '{}';

-- Create GIN index for efficient array searches
-- This allows fast filtering like: WHERE 'React' = ANY(tags)
CREATE INDEX idx_projects_tags ON projects USING GIN (tags);

-- Add helpful comment
COMMENT ON COLUMN projects.tags IS 
  'Flexible tags for tech stack, categories, and features (e.g., ["React", "DeFi", "AI/ML"])';



