-- Allow users to delete their own profiles (needed for multi-page feature)
CREATE POLICY "Users can delete own profile"
ON public.profiles
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Allow deleting page_views for cleanup
CREATE POLICY "Profile owner can delete views"
ON public.page_views
FOR DELETE
TO authenticated
USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- Allow deleting page_blocks for cleanup  
CREATE POLICY "Users can delete own blocks"
ON public.page_blocks
FOR DELETE
TO authenticated
USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- Allow deleting profile_links for cleanup
CREATE POLICY "Users can delete own links"
ON public.profile_links
FOR DELETE
TO authenticated
USING (auth.uid() = (SELECT user_id FROM profiles WHERE id = profile_links.profile_id));
