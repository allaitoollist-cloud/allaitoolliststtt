-- Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tool_id UUID REFERENCES public.tools(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    status TEXT DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- RLS Policies
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved reviews" 
ON public.reviews FOR SELECT 
USING (status = 'approved');

CREATE POLICY "Users can insert their own reviews" 
ON public.reviews FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" 
ON public.reviews FOR DELETE 
USING (auth.uid() = user_id);

-- Add review_count and rating to tools table (rating already exists, but we'll update it)
ALTER TABLE public.tools ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;

-- Function to update tool rating and review count
CREATE OR REPLACE FUNCTION update_tool_rating()
RETURNS TRIGGER AS $$
DECLARE
    avg_rating NUMERIC;
    total_reviews INTEGER;
BEGIN
    -- Only calculate based on approved reviews
    IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND NEW.status = 'approved' AND OLD.status != 'approved') THEN
        SELECT ROUND(AVG(rating)::NUMERIC, 1), COUNT(*) 
        INTO avg_rating, total_reviews
        FROM public.reviews 
        WHERE tool_id = NEW.tool_id AND status = 'approved';
        
        UPDATE public.tools 
        SET rating = COALESCE(avg_rating, 0), review_count = COALESCE(total_reviews, 0)
        WHERE id = NEW.tool_id;
        
    ELSIF TG_OP = 'DELETE' OR (TG_OP = 'UPDATE' AND NEW.status != 'approved' AND OLD.status = 'approved') THEN
        SELECT ROUND(AVG(rating)::NUMERIC, 1), COUNT(*) 
        INTO avg_rating, total_reviews
        FROM public.reviews 
        WHERE tool_id = OLD.tool_id AND status = 'approved';
        
        UPDATE public.tools 
        SET rating = COALESCE(avg_rating, 0), review_count = COALESCE(total_reviews, 0)
        WHERE id = OLD.tool_id;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_tool_rating ON public.reviews;
CREATE TRIGGER tr_tool_rating 
AFTER INSERT OR UPDATE OR DELETE ON public.reviews 
FOR EACH ROW EXECUTE FUNCTION update_tool_rating();
