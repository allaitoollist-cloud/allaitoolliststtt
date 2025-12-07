-- Add icon column to categories table
ALTER TABLE categories ADD COLUMN IF NOT EXISTS icon TEXT;

-- Add color column if not exists
ALTER TABLE categories ADD COLUMN IF NOT EXISTS color TEXT DEFAULT '#6366f1';
