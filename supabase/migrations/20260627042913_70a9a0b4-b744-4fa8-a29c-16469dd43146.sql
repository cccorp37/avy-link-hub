
-- 1. Webhook events dedup table
CREATE TABLE IF NOT EXISTS public.webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL DEFAULT 'mesomb',
  event_id TEXT NOT NULL,
  event_type TEXT,
  reference TEXT,
  payload JSONB,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  result TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT webhook_events_provider_event_unique UNIQUE (provider, event_id)
);

GRANT ALL ON public.webhook_events TO service_role;
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;
-- No client policies: service role only

-- 2. Transactions enrichment
ALTER TABLE public.transactions
  ADD COLUMN IF NOT EXISTS fee_amount INTEGER,
  ADD COLUMN IF NOT EXISTS net_amount INTEGER,
  ADD COLUMN IF NOT EXISTS recipient_name TEXT,
  ADD COLUMN IF NOT EXISTS failure_reason TEXT,
  ADD COLUMN IF NOT EXISTS processed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS provider_event_id TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS transactions_provider_event_unique
  ON public.transactions(provider_event_id)
  WHERE provider_event_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS transactions_reference_idx
  ON public.transactions(reference);

-- 3. Orders enrichment
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS refund_status TEXT,
  ADD COLUMN IF NOT EXISTS refunded_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS failure_reason TEXT;
