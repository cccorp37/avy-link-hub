-- Backfill wallets for any existing user without one
INSERT INTO public.wallets (user_id)
SELECT p.user_id
FROM public.profiles p
LEFT JOIN public.wallets w ON w.user_id = p.user_id
WHERE w.id IS NULL
GROUP BY p.user_id;