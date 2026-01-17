-- Add semantic columns to tools table for "Phase 1: Foundation" of Semantic SEO
-- This enables granular filtering and entity mapping.

ALTER TABLE tools 
ADD COLUMN IF NOT EXISTS pricing_model text, -- Enum: 'Free', 'Freemium', 'Paid', 'Open Source', 'Contact for Pricing'
ADD COLUMN IF NOT EXISTS has_api boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS user_type text[] DEFAULT '{}'; -- Enum: 'Enterprise', 'Student', 'Developer', 'Business', 'Creative'

-- Create index for faster filtering on these new columns
CREATE INDEX IF NOT EXISTS tools_pricing_model_idx ON tools(pricing_model);
CREATE INDEX IF NOT EXISTS tools_has_api_idx ON tools(has_api);
