-- Create Comparisons Table for "Tool A vs Tool B" pages
CREATE TABLE IF NOT EXISTS comparisons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tool_a_id UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
    tool_b_id UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    overview TEXT, -- Short summary
    content TEXT, -- Full content (Rich text or JSON)
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'under_review', 'published', 'archived')),
    seo_noindex BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Prevent comparing a tool to itself
    CONSTRAINT different_tools CHECK (tool_a_id != tool_b_id)
);

-- RLS Policies
ALTER TABLE comparisons ENABLE ROW LEVEL SECURITY;

-- Admins full access
CREATE POLICY "Admins can manage comparisons" ON comparisons
    FOR ALL
    USING (auth.role() = 'service_role');

-- Public read only published
CREATE POLICY "Public can view published comparisons" ON comparisons
    FOR SELECT
    USING (status = 'published');

-- Trigger for updated_at
CREATE TRIGGER update_comparisons_updated_at
    BEFORE UPDATE ON comparisons
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Optional: Index for detecting duplicates efficiently
-- We usually enforce sorting in app logic, but unique constraint on sorted pair is harder in plain SQL without a function.
-- We rely on App logic + Slug Uniqueness (tool-a-vs-tool-b should be canonical).
