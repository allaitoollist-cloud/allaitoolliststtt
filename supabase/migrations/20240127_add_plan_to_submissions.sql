-- Add plan column to tool_submissions if missing
ALTER TABLE tool_submissions ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'featured';
