-- ==============================================================================
-- CLEANUP MIGRATION: PROFILES & FLOW OPTIMIZATION
-- Rationale: Removing legacy subscription columns from 'profiles'. 
-- Subscription data is now strictly hosted in the 'subscriptions' table.
-- ==============================================================================

-- 1. Remove Legacy Columns from Profiles
-- We use DO structure to avoid errors if columns don't exist
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'subscription_status') THEN
        ALTER TABLE public.profiles DROP COLUMN subscription_status;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'subscription_tier') THEN
        ALTER TABLE public.profiles DROP COLUMN subscription_tier;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'stripe_customer_id') THEN
        ALTER TABLE public.profiles DROP COLUMN stripe_customer_id;
    END IF;
    
    -- Add any other Legacy columns here
END $$;

-- 2. Ensure Profiles serves only Identity
-- The profiles table should only contain: id, email, full_name, avatar_url, created_at.

-- 3. Optimization Indexes for the New Flow
-- Since we will frequent query subscriptions by user+product, let's index it.
CREATE INDEX IF NOT EXISTS idx_subscriptions_lookup ON public.subscriptions(user_id, product_id);

-- 4. Updated 'check_subscription' RPC helper (Optional but recommended)
-- This makes it easy for the Electron App to check status with one RPC call.
CREATE OR REPLACE FUNCTION public.check_user_access(target_product text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result json;
    curr_user_id uuid;
BEGIN
    curr_user_id := auth.uid();
    
    SELECT json_build_object(
        'status', coalesce(status, 'inactive'),
        'tier', coalesce(tier, 'free')
    )
    INTO result
    FROM public.subscriptions
    WHERE user_id = curr_user_id AND product_id = target_product
    LIMIT 1;
    
    RETURN coalesce(result, json_build_object('status', 'inactive', 'tier', 'free'));
END;
$$;
