-- Create a table to track upvotes for each app
CREATE TABLE public.app_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  app_day INTEGER NOT NULL UNIQUE,
  vote_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.app_votes ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read vote counts
CREATE POLICY "Anyone can view vote counts" 
ON public.app_votes 
FOR SELECT 
USING (true);

-- Allow anyone to update vote counts (we'll control spam via localStorage on frontend)
CREATE POLICY "Anyone can update vote counts" 
ON public.app_votes 
FOR UPDATE 
USING (true);

-- Allow inserts for initializing vote records
CREATE POLICY "Anyone can insert vote records" 
ON public.app_votes 
FOR INSERT 
WITH CHECK (true);

-- Insert initial record for Day 1 (Secret Santa)
INSERT INTO public.app_votes (app_day, vote_count) VALUES (1, 0);