-- Add profile customization fields
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS theme TEXT NOT NULL DEFAULT 'default',
  ADD COLUMN IF NOT EXISTS background_color TEXT,
  ADD COLUMN IF NOT EXISTS button_style TEXT NOT NULL DEFAULT 'rounded',
  ADD COLUMN IF NOT EXISTS font_style TEXT NOT NULL DEFAULT 'inter',
  ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}';

-- Page views table for analytics
CREATE TABLE IF NOT EXISTS public.page_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  referrer TEXT,
  country TEXT,
  device TEXT
);

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Public insert (anyone visiting a profile can log a view)
CREATE POLICY "Anyone can insert page views"
  ON public.page_views FOR INSERT
  WITH CHECK (true);

-- Only owner can read their views
CREATE POLICY "Profile owner can read their views"
  ON public.page_views FOR SELECT
  USING (
    profile_id IN (
      SELECT id FROM public.profiles WHERE user_id = auth.uid()
    )
  );

-- Link clicks table
CREATE TABLE IF NOT EXISTS public.link_clicks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  link_id UUID NOT NULL REFERENCES public.profile_links(id) ON DELETE CASCADE,
  clicked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  referrer TEXT
);

ALTER TABLE public.link_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert link clicks"
  ON public.link_clicks FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Link owner can read clicks"
  ON public.link_clicks FOR SELECT
  USING (
    link_id IN (
      SELECT pl.id FROM public.profile_links pl
      JOIN public.profiles p ON p.id = pl.profile_id
      WHERE p.user_id = auth.uid()
    )
  );
