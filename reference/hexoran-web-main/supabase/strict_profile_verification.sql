-- ==============================================================================
-- STRICT PROFILE VERIFICATION & UNIQUENESS
-- Run this script in the SQL Editor of your Hexoran Supabase Project to apply changes.
-- ==============================================================================

-- 1. Ensure Email Uniqueness in Profiles Table
-- This prevents multiple profiles from claiming the same email address.
ALTER TABLE public.profiles
ADD CONSTRAINT profiles_email_key UNIQUE (email);


-- 2. Redefine 'handle_new_user' to support Deferred Creation
-- This function will now be smart enough to handle both INSERT (OAuth) and UPDATE (Email Verification).

CREATE OR REPLACE FUNCTION public.handle_verified_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Logic: Only proceed if the user is VERIFIED.
  -- Case A: UPDATE - User clicked email verification link (OLD was unverified, NEW is verified)
  -- Case B: INSERT - User signed up with a pre-verified method (e.g., Google OAuth)
  
  IF (TG_OP = 'INSERT' AND NEW.email_confirmed_at IS NOT NULL) OR 
     (TG_OP = 'UPDATE' AND OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL) THEN
     
     INSERT INTO public.profiles (id, email, full_name, avatar_url)
     VALUES (
       NEW.id,
       NEW.email,
       COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
       NEW.raw_user_meta_data->>'avatar_url'
     )
     ON CONFLICT (id) DO UPDATE SET
       email = EXCLUDED.email,
       full_name = EXCLUDED.full_name,
       avatar_url = EXCLUDED.avatar_url;
       
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 3. Update Triggers on auth.users

-- A. Drop the old "Create on Insert" trigger if it exists (legacy behavior)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- B. Create Trigger for INSERT (Handles OAuth which is verified immediately)
CREATE TRIGGER on_auth_user_created_verified
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_verified_user();

-- C. Create Trigger for UPDATE (Handles Email Verification flow)
CREATE TRIGGER on_auth_user_updated_verification
AFTER UPDATE ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_verified_user();

-- ==============================================================================
-- NOTE: 
-- Existing unverified users will NOT have profiles created until they verify.
-- Users who are already verified but missing profiles won't be backfilled automatically by this trigger 
-- unless their user record is updated again.
-- ==============================================================================
