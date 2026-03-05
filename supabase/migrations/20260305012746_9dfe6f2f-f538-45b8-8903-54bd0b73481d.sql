
-- Create storage bucket for background images
INSERT INTO storage.buckets (id, name, public) VALUES ('backgrounds', 'backgrounds', true);

-- RLS: users can upload their own background
CREATE POLICY "Users can upload own background"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'backgrounds' AND (storage.foldername(name))[1] = auth.uid()::text);

-- RLS: users can update their own background
CREATE POLICY "Users can update own background"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'backgrounds' AND (storage.foldername(name))[1] = auth.uid()::text);

-- RLS: anyone can view backgrounds
CREATE POLICY "Anyone can view backgrounds"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'backgrounds');

-- Add background_image_url to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS background_image_url text DEFAULT NULL;
