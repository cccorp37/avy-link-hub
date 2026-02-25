
-- 1. Add pixel columns to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS tiktok_pixel_id text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS snapchat_pixel_id text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS pinterest_tag_id text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS linkedin_insight_tag text DEFAULT NULL;

-- 2. Support tickets
CREATE TABLE public.support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'open',
  priority text NOT NULL DEFAULT 'normal',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can create own tickets" ON public.support_tickets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own tickets" ON public.support_tickets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own tickets" ON public.support_tickets FOR UPDATE USING (auth.uid() = user_id);

-- 3. Team members (multi-users)
CREATE TABLE public.team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'viewer',
  status text NOT NULL DEFAULT 'pending',
  invited_by uuid REFERENCES auth.users(id) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profile owner can manage team" ON public.team_members FOR ALL USING (
  invited_by = auth.uid() OR user_id = auth.uid()
);

-- 4. API keys
CREATE TABLE public.api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL DEFAULT 'Default',
  key_hash text NOT NULL,
  key_preview text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  last_used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own API keys" ON public.api_keys FOR ALL USING (auth.uid() = user_id);

-- 5. Webhooks
CREATE TABLE public.webhooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  url text NOT NULL,
  events text[] NOT NULL DEFAULT '{}',
  is_active boolean NOT NULL DEFAULT true,
  secret text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.webhooks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own webhooks" ON public.webhooks FOR ALL USING (auth.uid() = user_id);

-- 6. Click heatmap tracking
CREATE TABLE public.click_heatmap (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL,
  element_type text NOT NULL,
  element_id text,
  x_percent numeric NOT NULL,
  y_percent numeric NOT NULL,
  viewport_width integer,
  viewport_height integer,
  clicked_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.click_heatmap ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert heatmap clicks" ON public.click_heatmap FOR INSERT WITH CHECK (true);
CREATE POLICY "Profile owner can view heatmap" ON public.click_heatmap FOR SELECT USING (
  profile_id IN (SELECT p.id FROM profiles p WHERE p.user_id = auth.uid())
);

-- 7. A/B tests
CREATE TABLE public.ab_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL,
  name text NOT NULL,
  status text NOT NULL DEFAULT 'draft',
  variant_a jsonb NOT NULL DEFAULT '{}',
  variant_b jsonb NOT NULL DEFAULT '{}',
  variant_a_views integer NOT NULL DEFAULT 0,
  variant_b_views integer NOT NULL DEFAULT 0,
  variant_a_clicks integer NOT NULL DEFAULT 0,
  variant_b_clicks integer NOT NULL DEFAULT 0,
  winner text,
  started_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.ab_tests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own AB tests" ON public.ab_tests FOR ALL USING (
  profile_id IN (SELECT p.id FROM profiles p WHERE p.user_id = auth.uid())
);
