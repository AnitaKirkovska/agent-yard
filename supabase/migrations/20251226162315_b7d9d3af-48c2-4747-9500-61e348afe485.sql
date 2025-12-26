-- Create a cache table for workflow stats
CREATE TABLE public.workflow_stats_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workflow_name TEXT NOT NULL UNIQUE,
  execution_count INTEGER NOT NULL DEFAULT 0,
  cached_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.workflow_stats_cache ENABLE ROW LEVEL SECURITY;

-- Allow public read access (no auth needed for viewing counts)
CREATE POLICY "Anyone can view workflow stats" 
ON public.workflow_stats_cache 
FOR SELECT 
USING (true);

-- Create index for fast lookup by workflow name
CREATE INDEX idx_workflow_stats_cache_name ON public.workflow_stats_cache(workflow_name);