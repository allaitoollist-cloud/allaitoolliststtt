-- Fix tool_submissions RLS policies to allow admins to update and delete

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can update submissions" ON tool_submissions;
DROP POLICY IF EXISTS "Admins can delete submissions" ON tool_submissions;

-- Allow authenticated users (admins) to update submissions
CREATE POLICY "Admins can update submissions"
  ON tool_submissions FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Allow authenticated users (admins) to delete submissions  
CREATE POLICY "Admins can delete submissions"
  ON tool_submissions FOR DELETE
  USING (auth.role() = 'authenticated');
