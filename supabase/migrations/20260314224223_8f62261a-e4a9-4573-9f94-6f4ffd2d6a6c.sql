
ALTER TABLE public.store_items 
  ADD COLUMN IF NOT EXISTS item_type text NOT NULL DEFAULT 'article',
  ADD COLUMN IF NOT EXISTS redirect_url text,
  ADD COLUMN IF NOT EXISTS seller_name text,
  ADD COLUMN IF NOT EXISTS seller_phone text,
  ADD COLUMN IF NOT EXISTS seller_email text,
  ADD COLUMN IF NOT EXISTS header_text text;

-- Add withdrawal_notifications table for admin alerts
CREATE TABLE IF NOT EXISTS public.withdrawal_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  username text,
  display_name text,
  amount integer NOT NULL,
  fee_amount integer NOT NULL,
  net_amount integer NOT NULL,
  currency text NOT NULL DEFAULT 'XAF',
  recipient_name text,
  recipient_phone text,
  recipient_service text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.withdrawal_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read all withdrawal notifications" ON public.withdrawal_notifications
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert withdrawal notifications" ON public.withdrawal_notifications
  FOR INSERT WITH CHECK (true);
