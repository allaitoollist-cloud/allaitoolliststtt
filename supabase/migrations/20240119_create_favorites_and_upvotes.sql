-- Create favorites table
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    tool_id UUID REFERENCES public.tools(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(user_id, tool_id)
);

-- RLS for favorites
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own favorites"
    ON public.favorites FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites"
    ON public.favorites FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
    ON public.favorites FOR DELETE
    USING (auth.uid() = user_id);

-- Create upvotes table
CREATE TABLE IF NOT EXISTS public.upvotes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    tool_id UUID REFERENCES public.tools(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(user_id, tool_id)
);

-- RLS for upvotes
ALTER TABLE public.upvotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view upvotes"
    ON public.upvotes FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own upvotes"
    ON public.upvotes FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own upvotes"
    ON public.upvotes FOR DELETE
    USING (auth.uid() = user_id);

-- Add upvotes_count to tools table
ALTER TABLE public.tools ADD COLUMN IF NOT EXISTS upvotes_count INTEGER DEFAULT 0;

-- Function and trigger to automatically update upvotes_count
CREATE OR REPLACE FUNCTION update_tool_upvotes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.tools SET upvotes_count = upvotes_count + 1 WHERE id = NEW.tool_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.tools SET upvotes_count = upvotes_count - 1 WHERE id = OLD.tool_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_tool_upvotes ON public.upvotes;
CREATE TRIGGER tr_tool_upvotes
AFTER INSERT OR DELETE ON public.upvotes
FOR EACH ROW EXECUTE FUNCTION update_tool_upvotes();
