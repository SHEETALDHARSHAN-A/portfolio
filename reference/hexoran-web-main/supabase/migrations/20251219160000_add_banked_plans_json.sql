-- Add JSONB column for storing multiple banked plans
ALTER TABLE public.subscriptions 
ADD COLUMN IF NOT EXISTS banked_plans JSONB DEFAULT '{}'::jsonb;

-- Migrate existing data (if any) to the new structure
-- Example: 'code' -> 100 days becomes '{"code": 100}'
UPDATE public.subscriptions 
SET banked_plans = jsonb_build_object(banked_tier, banked_days)
WHERE banked_tier IS NOT NULL AND banked_days > 0;

-- Optional: Drop old columns if you want to clean up immediately
-- ALTER TABLE public.subscriptions DROP COLUMN banked_tier;
-- ALTER TABLE public.subscriptions DROP COLUMN banked_days;
