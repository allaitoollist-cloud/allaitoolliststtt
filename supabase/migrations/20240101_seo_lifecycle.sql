-- 1. Create Lifecycle Status Enum
CREATE TYPE content_status AS ENUM ('draft', 'under_review', 'published', 'archived');

-- 2. Add Status and Publish Info columns to tools table
ALTER TABLE tools 
ADD COLUMN status content_status NOT NULL DEFAULT 'draft',
ADD COLUMN published_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN archived_at TIMESTAMP WITH TIME ZONE;

-- 3. RLS Logic (SEO Gatekeeper)

-- Enable RLS
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;

-- Allow Public to View ONLY Published content
CREATE POLICY "Public can view published tools" 
ON tools FOR SELECT 
USING (status = 'published');

-- Allow Admins full access (assuming they have specific role or claim)
-- Note: Replace 'admin_role' with your actual admin claim check
-- CREATE POLICY "Admins can do everything" 
-- ON tools FOR ALL 
-- USING (auth.jwt() ->> 'role' = 'service_role'); 

-- 4. Prevent invalid status transitions via Trigger
CREATE OR REPLACE FUNCTION validate_content_status_change()
RETURNS TRIGGER AS $$
BEGIN
    -- Prevent moving from Draft -> Published directly (Must go to Under Review first)
    IF OLD.status = 'draft' AND NEW.status = 'published' THEN
        RAISE EXCEPTION 'Cannot move directly from Draft to Published. Must be Reviewed first.';
    END IF;

    -- Automatically set published_at when status becomes published
    IF NEW.status = 'published' AND OLD.status != 'published' THEN
        NEW.published_at = NOW();
    END IF;

    -- Automatically set archived_at
    IF NEW.status = 'archived' THEN
        NEW.archived_at = NOW();
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER content_status_trigger
BEFORE UPDATE ON tools
FOR EACH ROW
EXECUTE FUNCTION validate_content_status_change();


-- 5. Helper Index for Performance
CREATE INDEX idx_tools_status_published ON tools(status) WHERE status = 'published';
