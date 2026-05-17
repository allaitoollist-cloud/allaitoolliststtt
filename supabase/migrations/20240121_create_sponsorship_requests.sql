-- Create sponsorship requests table
CREATE TABLE IF NOT EXISTS public.sponsorship_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tool_slug TEXT NOT NULL,
    tool_name TEXT NOT NULL,
    user_email TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- RLS Policies
ALTER TABLE public.sponsorship_requests ENABLE ROW LEVEL SECURITY;

-- Admins can view all requests
CREATE POLICY "Admins can view all sponsorship requests" 
ON public.sponsorship_requests FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- Admins can update all requests
CREATE POLICY "Admins can update sponsorship requests" 
ON public.sponsorship_requests FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- Users can view their own requests (by email for simplicity)
CREATE POLICY "Users can view their own requests" 
ON public.sponsorship_requests FOR SELECT 
USING (
  user_email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

-- Anyone authenticated can insert requests (we will rely on API or direct insert)
CREATE POLICY "Authenticated users can request sponsorship" 
ON public.sponsorship_requests FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');
