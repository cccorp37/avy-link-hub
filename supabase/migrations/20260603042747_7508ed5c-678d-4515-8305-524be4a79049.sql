
-- Fix withdrawal_notifications open INSERT policy
DROP POLICY IF EXISTS "System can insert withdrawal notifications" ON public.withdrawal_notifications;

-- Only admins may insert via API; service_role bypasses RLS for edge functions
CREATE POLICY "Admins can insert withdrawal notifications"
ON public.withdrawal_notifications
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Allow users to see their own withdrawal notifications
CREATE POLICY "Users can view own withdrawal notifications"
ON public.withdrawal_notifications
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);
