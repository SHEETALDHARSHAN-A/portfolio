-- Add columns to store banked subscription details
ALTER TABLE public.subscriptions 
ADD COLUMN IF NOT EXISTS banked_tier text,
ADD COLUMN IF NOT EXISTS banked_days integer DEFAULT 0;

-- Comment on columns
COMMENT ON COLUMN public.subscriptions.banked_tier IS 'The tier of the subscription that was active before upgrading, to be resumed later.';
COMMENT ON COLUMN public.subscriptions.banked_days IS 'The number of days remaining on the banked subscription.';
