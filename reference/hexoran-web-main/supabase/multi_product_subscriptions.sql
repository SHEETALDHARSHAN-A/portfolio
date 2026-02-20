-- ==============================================================================
-- MULTI-PRODUCT SUBSCRIPTION SCHEMA
-- Rationale: Decouple "Who you are" (Profile) from "What you own" (Subscriptions).
-- This allows one user to have independent statuses for Celato, Stook, etc.
-- ==============================================================================

-- 1. Create Subscriptions Table
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    
    -- Which product is this for? ('celato', 'stook', 'hexoran-bundle')
    product_id text NOT NULL, 
    
    -- Status of this specific product (active, trialing, past_due, canceled, unpaid)
    status text NOT NULL DEFAULT 'inactive',
    
    -- Specific plan details
    tier text DEFAULT 'free', -- e.g. 'pro', 'enterprise', 'free'
    plan_id text,             -- ID from Razorpay/Stripe (e.g., plan_RqPCH5fYA3pbs3)
    
    -- Billing Cycles
    current_period_start timestamptz,
    current_period_end timestamptz,
    
    cancel_at_period_end boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    
    -- Prevent duplicate active rows for the same product to simplify logic
    -- A user should have only one "row" per product, which we update.
    UNIQUE(user_id, product_id)
);

-- 2. Enable RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
-- Users can view their own subscriptions
CREATE POLICY "Users can view own subscriptions" 
ON public.subscriptions FOR SELECT 
USING (auth.uid() = user_id);

-- Service Role (Payment Webhook) can manage everything (Implicit, but good to know)

-- 4. Migration Helper (Optional)
-- If you want to migrate existing data from 'profiles' to 'subscriptions'
-- INSERT INTO public.subscriptions (user_id, product_id, status, tier)
-- SELECT id, 'celato', subscription_status, subscription_tier 
-- FROM public.profiles 
-- WHERE subscription_status IS NOT NULL;

-- 5. Helper Function: check_subscription(user_id, product_name)
-- Usage: select check_subscription(auth.uid(), 'celato')
CREATE OR REPLACE FUNCTION check_product_access(
    user_uuid uuid, 
    product_key text
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_status text;
BEGIN
    SELECT status 
    INTO current_status
    FROM public.subscriptions
    WHERE user_id = user_uuid 
    AND product_id = product_key
    AND (current_period_end > now() OR status = 'active' OR status = 'lifetime');
    
    RETURN COALESCE(current_status, 'free');
END;
$$;
