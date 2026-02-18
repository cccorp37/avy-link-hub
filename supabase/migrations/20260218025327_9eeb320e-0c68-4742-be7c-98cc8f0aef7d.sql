
-- Fix the form_submissions INSERT policy to be more specific (only allows insert for valid profile_ids)
DROP POLICY IF EXISTS "Anyone can submit a form" ON public.form_submissions;

CREATE POLICY "Anyone can submit a form"
  ON public.form_submissions FOR INSERT
  WITH CHECK (
    profile_id IN (SELECT id FROM public.profiles)
  );
