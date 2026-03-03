
-- Add status column to profiles for ban/suspend
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active';

-- App settings table for maintenance mode etc.
CREATE TABLE public.app_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id)
);
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read app settings (needed for maintenance mode check)
CREATE POLICY "Anyone can read app settings" ON public.app_settings FOR SELECT USING (true);
-- Only admins can modify
CREATE POLICY "Admins can manage app settings" ON public.app_settings FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Insert default maintenance mode setting
INSERT INTO public.app_settings (key, value) VALUES ('maintenance_mode', '{"enabled": false, "message": "L''application est en maintenance. Veuillez réessayer plus tard."}'::jsonb);

-- Notifications table
CREATE TABLE public.admin_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL DEFAULT 'info',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  expires_at timestamp with time zone
);
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

-- Anyone can read active notifications
CREATE POLICY "Anyone can read notifications" ON public.admin_notifications FOR SELECT USING (is_active = true);
-- Admins can manage
CREATE POLICY "Admins can manage notifications" ON public.admin_notifications FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- User notification dismissals
CREATE TABLE public.notification_dismissals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  notification_id uuid NOT NULL REFERENCES public.admin_notifications(id) ON DELETE CASCADE,
  dismissed_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, notification_id)
);
ALTER TABLE public.notification_dismissals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own dismissals" ON public.notification_dismissals FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Allow admins to read all support tickets
CREATE POLICY "Admins can read all tickets" ON public.support_tickets FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update all tickets" ON public.support_tickets FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
