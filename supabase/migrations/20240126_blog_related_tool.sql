-- Add related tool slug to blogs
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS related_tool_slug TEXT DEFAULT NULL;
