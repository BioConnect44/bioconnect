-- ============================================================================
-- BIOCONNECT PUBMED AI RESEARCH SUMMARIES DB SCHEMA & MIGRATION SCRIPT
-- ============================================================================

-- 1. Create research_summaries Table
CREATE TABLE IF NOT EXISTS public.research_summaries (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    summary_text TEXT NOT NULL,
    query TEXT NOT NULL,
    citations JSONB DEFAULT '[]'::jsonb,
    source_url TEXT DEFAULT '',
    pmid TEXT DEFAULT '',
    authors TEXT DEFAULT '',
    journal TEXT DEFAULT '',
    publication_date TEXT DEFAULT '',
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Performance Indexes on query & created_at
CREATE INDEX IF NOT EXISTS idx_research_summaries_query ON public.research_summaries(query);
CREATE INDEX IF NOT EXISTS idx_research_summaries_created_at ON public.research_summaries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_research_summaries_pmid ON public.research_summaries(pmid);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.research_summaries ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
-- Allow anyone (public and authenticated) to read research summaries
DROP POLICY IF EXISTS "Public research summaries are viewable by everyone" ON public.research_summaries;
CREATE POLICY "Public research summaries are viewable by everyone" 
ON public.research_summaries FOR SELECT 
USING (true);

-- Allow authenticated users & server service-role to insert research summaries
DROP POLICY IF EXISTS "Authenticated users and service role can insert research summaries" ON public.research_summaries;
CREATE POLICY "Authenticated users and service role can insert research summaries" 
ON public.research_summaries FOR INSERT 
WITH CHECK (true);

-- Allow users to update their own summaries or service role to update any summary
DROP POLICY IF EXISTS "Users can update their own summaries" ON public.research_summaries;
CREATE POLICY "Users can update their own summaries" 
ON public.research_summaries FOR UPDATE 
USING (auth.uid() = user_id OR auth.role() = 'service_role');
