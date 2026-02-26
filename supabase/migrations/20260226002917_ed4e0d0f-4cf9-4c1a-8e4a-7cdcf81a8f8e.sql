
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_position TEXT NOT NULL DEFAULT 'center';
