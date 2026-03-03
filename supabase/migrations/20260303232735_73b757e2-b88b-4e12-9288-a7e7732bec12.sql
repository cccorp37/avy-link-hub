
-- Ticket replies table
CREATE TABLE public.ticket_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message text NOT NULL,
  is_admin boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.ticket_replies ENABLE ROW LEVEL SECURITY;

-- Ticket owner can read replies on their tickets
CREATE POLICY "Users can read replies on own tickets"
ON public.ticket_replies FOR SELECT
USING (
  ticket_id IN (
    SELECT id FROM public.support_tickets WHERE user_id = auth.uid()
  )
  OR public.has_role(auth.uid(), 'admin')
);

-- Users can insert replies on their own tickets
CREATE POLICY "Users can reply to own tickets"
ON public.ticket_replies FOR INSERT
WITH CHECK (
  auth.uid() = user_id
  AND (
    ticket_id IN (SELECT id FROM public.support_tickets WHERE user_id = auth.uid())
    OR public.has_role(auth.uid(), 'admin')
  )
);

-- Admins can manage all replies
CREATE POLICY "Admins can manage all replies"
ON public.ticket_replies FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Enable realtime for ticket_replies
ALTER PUBLICATION supabase_realtime ADD TABLE public.ticket_replies;
