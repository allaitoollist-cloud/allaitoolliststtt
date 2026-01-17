-- Add SEO Control Fields
-- Allows manual noindex override for published pages

-- 1. Tools Table
ALTER TABLE tools 
ADD COLUMN IF NOT EXISTS seo_noindex BOOLEAN DEFAULT FALSE;

-- 2. Use Cases Table (if exists from previous step)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'use_cases') THEN
        ALTER TABLE use_cases ADD COLUMN IF NOT EXISTS seo_noindex BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- 3. Categories are currently hardcoded in code (types/index.ts) usually, 
-- but if we have a table for them later, we would add it there. 
-- For now, category pages are dynamic based on content presence.
