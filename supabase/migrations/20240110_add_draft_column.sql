-- Add is_draft column to tools table
ALTER TABLE tools ADD COLUMN IF NOT EXISTS is_draft BOOLEAN DEFAULT false;

-- Update existing tools to be published (not draft)
UPDATE tools SET is_draft = false WHERE is_draft IS NULL;
