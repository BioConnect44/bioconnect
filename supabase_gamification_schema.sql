-- Supabase Gamification Schema for BioConnect Platform
CREATE TABLE IF NOT EXISTS public.user_gamification (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  total_xp INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 14,
  papers_read INTEGER DEFAULT 1,
  quizzes_completed INTEGER DEFAULT 10,
  notes_accessed INTEGER DEFAULT 50,
  perfect_quizzes INTEGER DEFAULT 0,
  group_studies_joined INTEGER DEFAULT 0,
  papers_saved INTEGER DEFAULT 0,
  courses_completed INTEGER DEFAULT 0,
  unlocked_badge_ids TEXT[] DEFAULT ARRAY['streak-master', 'bio-pioneer', 'challenge-champion', 'knowledge-seeker'],
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.user_gamification ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own gamification stats"
ON public.user_gamification FOR ALL
USING (auth.uid() = user_id);
