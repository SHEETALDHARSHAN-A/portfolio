import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
const supabase = createClient(supabaseUrl, supabaseServiceKey)

serve(async (req) => {
    try {
        // 1. Get current time in ISO format
        const now = new Date().toISOString()

        console.log(`[CRON] Checking for expired subscriptions at ${now}...`)

        // 2. Find all subscriptions that are ACTIVE but have passed their End Date
        const { data: expiredSubs, error: fetchError } = await supabase
            .from('subscriptions')
            .select('user_id, product_id, tier, current_period_end, banked_plans')
            .in('status', ['active', 'trialing']) // Check both active and trialing
            .lt('current_period_end', now)        // "Less Than" current time
            .limit(1000) // Process in batches to avoid timeouts

        if (fetchError) {
            throw new Error(`Fetch failed: ${fetchError.message}`)
        }

        if (!expiredSubs || expiredSubs.length === 0) {
            console.log("[CRON] No expired subscriptions found.")
            return new Response(JSON.stringify({ message: "No expired subscriptions found" }), {
                headers: { "Content-Type": "application/json" },
            })
        }

        console.log(`[CRON] Found ${expiredSubs.length} expired subscriptions. Processing...`)

        // 3. Process each subscription
        const updates = expiredSubs.map(async (sub) => {
            console.log(`[EXPIRE-CHECK] User: ${sub.user_id} | Tier: ${sub.tier} | Ended: ${sub.current_period_end}`)

            const bankedPlans = sub.banked_plans || {};

            // LOGIC: Check for banked days (Priority: Pro > Live > Code)
            let targetTier = null;
            if ((bankedPlans['pro'] || 0) > 0) targetTier = 'pro';
            else if ((bankedPlans['live'] || 0) > 0) targetTier = 'live';
            else if ((bankedPlans['code'] || 0) > 0) targetTier = 'code';

            // --- SCENARIO A: RESUME FROM VAULT ---
            if (targetTier) {
                const daysToResume = bankedPlans[targetTier];
                console.log(`[VAULT-RESUME] Found ${daysToResume} banked days of ${targetTier}. Activating...`);

                // Calculate new end date from when the subscription ACTUALLY ended (not now)
                // This ensures users don't lose any time between expiration and cron processing
                const periodEndDate = new Date(sub.current_period_end);
                const newEndDate = new Date(periodEndDate.getTime() + (daysToResume * 24 * 60 * 60 * 1000)).toISOString();

                // Zero out the banked days for this tier
                bankedPlans[targetTier] = 0;

                return supabase
                    .from('subscriptions')
                    .update({
                        status: 'active',
                        tier: targetTier,
                        current_period_start: sub.current_period_end, // Seamless continuation from when prev ended
                        current_period_end: newEndDate,
                        banked_plans: bankedPlans, // Update vault
                        plan_id: 'banked_resume_cron',
                        updated_at: new Date().toISOString()
                    })
                    .eq('user_id', sub.user_id)
                    .eq('product_id', sub.product_id);
            }

            // --- SCENARIO B: EXPIRE (Downgrade to Free) ---
            console.log(`[EXPIRE] No banked days. Downgrading to FREE.`);
            return supabase
                .from('subscriptions')
                .update({
                    status: 'expired',
                    tier: 'free',
                    updated_at: new Date().toISOString()
                })
                .eq('user_id', sub.user_id)
                .eq('product_id', sub.product_id)
        })

        await Promise.all(updates)

        console.log(`[CRON] Successfully expired ${expiredSubs.length} subscriptions.`)

        return new Response(JSON.stringify({
            success: true,
            processed: expiredSubs.length,
            message: "Expired subscriptions processed successfully"
        }), {
            headers: { "Content-Type": "application/json" },
        })

    } catch (error: any) {
        console.error("[CRON] Error:", error.message)
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { "Content-Type": "application/json" },
            status: 500
        })
    }
})
