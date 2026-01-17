-- Add Email Tracking Columns and tool_submissions table if missing

-- 1. Ensure tool_submissions exists (Standard check)
CREATE TABLE IF NOT EXISTS tool_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tool_name TEXT NOT NULL,
    tool_url TEXT NOT NULL,
    description TEXT,
    category TEXT,
    pricing TEXT,
    submitter_name TEXT,
    submitter_email TEXT,
    status TEXT DEFAULT 'pending', -- pending, approved, rejected
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    
    -- New Email Tracking
    confirmation_email_sent BOOLEAN DEFAULT FALSE
);

-- 2. Add columns to Tools table for email automation
ALTER TABLE tools 
ADD COLUMN IF NOT EXISTS submitter_email TEXT, -- We need this to contact the owner
ADD COLUMN IF NOT EXISTS last_freshness_email_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS approval_email_sent BOOLEAN DEFAULT FALSE;

-- 3. Trigger Function to set defaults (Optional but good practice)
-- (Already handled in previous migrations for status)
