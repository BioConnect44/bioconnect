-- 1. Create reading_history table to track user literature progress
CREATE TABLE IF NOT EXISTS public.reading_history (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    paper_id TEXT NOT NULL,
    last_page INT DEFAULT 1,
    progress_percentage FLOAT DEFAULT 0.0,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_paper UNIQUE (user_id, paper_id)
);

-- 2. Create paper_annotations table to store text highlights & personal notes
CREATE TABLE IF NOT EXISTS public.paper_annotations (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    paper_id TEXT NOT NULL,
    page_number INT DEFAULT 1,
    selected_text TEXT NOT NULL,
    color TEXT DEFAULT 'yellow', -- 'yellow', 'blue', 'green', 'purple'
    note TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_reading_history_user_paper ON public.reading_history(user_id, paper_id);
CREATE INDEX IF NOT EXISTS idx_paper_annotations_paper ON public.paper_annotations(paper_id);
CREATE INDEX IF NOT EXISTS idx_paper_annotations_user ON public.paper_annotations(user_id);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.reading_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paper_annotations ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for reading_history
CREATE POLICY "Users can view their own reading history"
ON public.reading_history FOR SELECT
USING (auth.uid() = user_id OR auth.role() = 'service_role');

CREATE POLICY "Users can insert/update their reading history"
ON public.reading_history FOR ALL
USING (auth.uid() = user_id OR auth.role() = 'service_role');

-- 6. RLS Policies for paper_annotations
CREATE POLICY "Users can view their own annotations"
ON public.paper_annotations FOR SELECT
USING (auth.uid() = user_id OR auth.role() = 'service_role');

CREATE POLICY "Users can manage their own annotations"
ON public.paper_annotations FOR ALL
USING (auth.uid() = user_id OR auth.role() = 'service_role');
