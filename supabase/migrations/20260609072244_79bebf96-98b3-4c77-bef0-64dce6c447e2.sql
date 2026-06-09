
-- Prevent users from self-upgrading plan / verified badge / verification on profiles
CREATE OR REPLACE FUNCTION public.prevent_profile_privilege_escalation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    IF NEW.is_verified IS DISTINCT FROM OLD.is_verified THEN
      NEW.is_verified := OLD.is_verified;
    END IF;
    IF NEW.verified_badge_style IS DISTINCT FROM OLD.verified_badge_style THEN
      NEW.verified_badge_style := OLD.verified_badge_style;
    END IF;
    IF NEW.plan IS DISTINCT FROM OLD.plan THEN
      NEW.plan := OLD.plan;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS prevent_self_verify_trigger ON public.profiles;
DROP TRIGGER IF EXISTS prevent_profile_privilege_escalation_trigger ON public.profiles;
CREATE TRIGGER prevent_profile_privilege_escalation_trigger
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.prevent_profile_privilege_escalation();

-- Remove user-facing UPDATE on subscriptions (managed by edge functions w/ service_role)
DROP POLICY IF EXISTS "Users can update own subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can insert own subscriptions" ON public.subscriptions;

-- Remove user-facing UPDATE on wallets (balance only changes via service_role)
DROP POLICY IF EXISTS "Users can update own wallet" ON public.wallets;

-- Storage DELETE policies so users can delete their own files only
DROP POLICY IF EXISTS "Users can delete own avatars" ON storage.objects;
CREATE POLICY "Users can delete own avatars" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "Users can delete own covers" ON storage.objects;
CREATE POLICY "Users can delete own covers" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'covers' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "Users can delete own backgrounds" ON storage.objects;
CREATE POLICY "Users can delete own backgrounds" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'backgrounds' AND (storage.foldername(name))[1] = auth.uid()::text);
