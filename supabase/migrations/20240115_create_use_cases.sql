-- Create Use Cases Table for SEO & Management
-- This allows dynamic management of use case pages instead of hardcoded tags

CREATE TABLE IF NOT EXISTS use_cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT, -- For SEO description injection
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies (Admin Only)
ALTER TABLE use_cases ENABLE ROW LEVEL SECURITY;

-- Allow public read of ONLY published use cases (for frontend dynamic fetching)
CREATE POLICY "Public can view published use cases" ON use_cases
    FOR SELECT
    USING (status = 'published');

-- Allow admins full access (assuming service role or admin auth)
-- (For now, we rely on Supabase Service Role in API routes, or disabled RLS for admin)
-- But ensuring standard policy:
CREATE POLICY "Admins can manage use cases" ON use_cases
    FOR ALL
    USING (auth.role() = 'service_role'); -- Minimalist approach match existing pattern

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_use_cases_updated_at
    BEFORE UPDATE ON use_cases
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
