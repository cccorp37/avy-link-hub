-- Add is_verified column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_verified BOOLEAN NOT NULL DEFAULT false;

-- Only admins can toggle verified status (via RLS on update)
-- The existing "Users can update own profile" policy applies, but we need to prevent
-- non-admins from setting is_verified=true via a separate check.
-- We use a trigger to enforce this server-side.

CREATE OR REPLACE FUNCTION public.prevent_self_verify()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- If a non-admin tries to change is_verified, revert it to old value
  IF NEW.is_verified IS DISTINCT FROM OLD.is_verified THEN
    IF NOT public.has_role(auth.uid(), 'admin') THEN
      NEW.is_verified := OLD.is_verified;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_verified_by_admin ON public.profiles;
CREATE TRIGGER enforce_verified_by_admin
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_self_verify();