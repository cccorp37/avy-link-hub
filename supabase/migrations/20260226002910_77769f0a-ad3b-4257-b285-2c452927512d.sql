
-- Custom templates saved by users
CREATE TABLE public.custom_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL DEFAULT 'Mon modèle',
  theme TEXT NOT NULL DEFAULT 'default',
  button_style TEXT NOT NULL DEFAULT 'rounded',
  font_style TEXT NOT NULL DEFAULT 'inter',
  background_color TEXT,
  avatar_position TEXT NOT NULL DEFAULT 'center',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.custom_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own custom templates"
  ON public.custom_templates
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
