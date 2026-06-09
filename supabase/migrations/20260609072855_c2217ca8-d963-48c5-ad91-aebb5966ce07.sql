ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_user_id_key;

CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON public.profiles(user_id);