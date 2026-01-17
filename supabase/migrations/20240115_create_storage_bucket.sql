-- Create Storage Bucket for Tool Screenshots
INSERT INTO storage.buckets (id, name, public)
VALUES ('tool-screenshots', 'tool-screenshots', true)
ON CONFLICT (id) DO NOTHING;

-- RLS Policies for Storage
-- 1. Allow Public Read
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'tool-screenshots' );

-- 2. Allow Public Upload (since our form is public)
-- Restricted by file type/size in frontend, but here we allow insert for anyone
CREATE POLICY "Public Upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'tool-screenshots' );

-- 3. Allow Public Update (optional, if we want them to overwrite their own? No, secure it)
-- Skip update policy for anon users to prevent defacement.
