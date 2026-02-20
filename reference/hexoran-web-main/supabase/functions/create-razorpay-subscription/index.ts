import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import Razorpay from "npm:razorpay@2.9.2"
import { TIER_MAP, PLAN_DURATIONS } from "../_shared/plan-config.ts";

// === TIER HIERARCHY ===
// Higher number = higher tier. Pro includes all features of Code and Live.
const TIER_PRIORITY: Record<string, number> = {
    'free': 0,
    'code': 1,
    'live': 1,  // Same priority as code (different features, lateral switch)
    'pro': 2   // Highest - includes both code and live
};

// Helper: Check if target tier is lower than current (downgrade = vault-only purchase)
function isDowngrade(currentTier: string, targetTier: string): boolean {
    return TIER_PRIORITY[targetTier] < TIER_PRIORITY[currentTier];
}

serve(async (req) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    }

    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    let planId: string | null = null;
    try {
        const authHeader = req.headers.get('Authorization')
        if (!authHeader) throw new Error('Missing Authorization header')

        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: authHeader } } }
        )

        // Admin Client for DB Updates (Bypassing RLS)
        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );

        const key_id = Deno.env.get('RAZORPAY_KEY_ID');
        const key_secret = Deno.env.get('RAZORPAY_KEY_SECRET');

        if (!key_id || !key_secret) {
            throw new Error('Missing Razorpay keys');
        }
        const razorpay = new Razorpay({ key_id, key_secret });
        const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
        if (userError || !user) {
            throw new Error('Unauthorized');
        }
        const body = await req.json().catch(() => ({}));
        planId = body.planId;

        if (!planId || !TIER_MAP[planId]) {
            return new Response(JSON.stringify({ error: 'Invalid or Missing planId' }), {
                status: 200,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        // === DYNAMIC TOTAL COUNT to avoid 'end_time' overflow ===
        // Yearly plans (100 years) exceed max timestamp. Limit Yearly to 10.
        const duration = PLAN_DURATIONS[planId as string] || 30;
        const safeTotalCount = duration >= 365 ? 10 : 100;

        // === 1. FETCH ACTIVE SUBSCRIPTION ===
        // Include 'switching' status to detect pending tier changes
        const { data: activeSub } = await supabaseClient
            .from('subscriptions')
            .select('external_subscription_id, plan_id, current_period_end, tier, status, banked_plans')
            .eq('user_id', user.id)
            .eq('product_id', 'celato')
            .in('status', ['active', 'trialing'])
            .maybeSingle();

        let subscription_id;
        let is_upgrade = false;

        // Note: We no longer need skipBanking or switching status handling
        // because banking only happens in webhook AFTER successful payment.

        if (activeSub) {
            console.log(`[DEBUG] Active Sub Found: ${activeSub.external_subscription_id}, Plan: ${activeSub.plan_id}`);

            if (activeSub.plan_id === planId) {
                // === A. EXACT SAME PLAN ===
                // Industry Standard: Subscriptions auto-renew. No need to "Stack".
                // We inform the user they are already covered.
                return new Response(JSON.stringify({
                    message: "You are already active on this plan. It will auto-renew.",
                    already_active: true
                }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                });

            } else {
                // === B. CHANGE PLAN (EXTENSION OR UPGRADE OR LATERAL SWITCH OR VAULT-ONLY) ===
                const targetTier = TIER_MAP[planId];

                if (!targetTier) {
                    console.error(`❌ Invalid plan ID: ${planId}`);
                    return new Response(JSON.stringify({
                        error: 'Invalid plan ID',
                        receivedPlanId: planId
                    }), {
                        status: 200,
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    });
                }

                const purchasedDays = PLAN_DURATIONS[planId] || 30;

                // === VAULT-ONLY PURCHASE (Downgrade) ===
                // If user is on a HIGHER tier (e.g., pro) and buys a LOWER tier (e.g., code),
                // we CREATE a subscription but mark it as vault_only.
                // The WEBHOOK will add days to vault after successful payment.
                if (isDowngrade(activeSub.tier, targetTier)) {
                    console.log(`[DEBUG] Vault-Only Purchase: ${activeSub.tier} -> ${targetTier}. Creating subscription for payment.`);

                    // Create subscription with vault_only flag in notes
                    // This will trigger Razorpay checkout - payment is required!
                    const subscription = await razorpay.subscriptions.create({
                        plan_id: planId,
                        customer_notify: 1,
                        quantity: 1,
                        total_count: 1, // One-time purchase for vault
                        notes: {
                            userId: user.id,
                            vault_only: 'true',  // Flag for webhook
                            target_tier: targetTier,
                            current_tier: activeSub.tier,
                            days_to_bank: purchasedDays.toString()
                        }
                    });

                    console.log(`[DEBUG] Vault-Only Subscription Created: ${subscription.id}`);

                    // Return subscription details - frontend will open Razorpay checkout
                    return new Response(JSON.stringify({
                        subscription_id: subscription.id,
                        key_id: key_id,
                        is_vault_only: true,
                        target_tier: targetTier,
                        days_to_bank: purchasedDays,
                        already_active: false
                    }), {
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    });
                }

                // === TIER SWITCH (Upgrade or Lateral) ===
                // Logic: Calculate remaining days - WEBHOOK will bank them after payment
                const shouldSwitch = activeSub.tier !== targetTier;

                if (shouldSwitch) {
                    console.log(`[DEBUG] Tier Switch: ${activeSub.tier} -> ${targetTier}`);

                    // Calculate remaining days (to be banked by webhook AFTER payment)
                    const now = new Date();
                    const currentEnd = new Date(activeSub.current_period_end);
                    const remainingMs = currentEnd.getTime() - now.getTime();
                    const remainingDays = Math.max(0, Math.ceil(remainingMs / (1000 * 60 * 60 * 24)));

                    console.log(`[DEBUG] Calculated days to bank (pending payment): ${remainingDays} of ${activeSub.tier}`);

                    // ⚠️ IMPORTANT: We do NOT bank days here!
                    // Banking happens in WEBHOOK after successful payment.
                    // This prevents exploitation by repeatedly opening/closing checkout.

                    // Create new subscription - old one cancelled by webhook after payment
                    console.log(`[DEBUG] Creating NEW ${targetTier} Subscription`);
                    const subscription = await razorpay.subscriptions.create({
                        plan_id: planId,
                        customer_notify: 1,
                        quantity: 1,
                        total_count: safeTotalCount,
                        notes: {
                            userId: user.id,
                            pending_cancel_subscription_id: activeSub.external_subscription_id,
                            switch_from_tier: activeSub.tier,
                            days_to_bank: remainingDays.toString(), // Webhook will bank these
                            is_tier_switch: 'true'
                        }
                    });
                    subscription_id = subscription.id;
                    is_upgrade = false; // Trigger Razorpay checkout

                } else {
                    // === CYCLE EXTENSION (Same Tier, Different Cycle) ===
                    // Example: Code Monthly → Code Yearly
                    console.log(`[DEBUG] Extension: ${activeSub.tier} cycle change`);

                    // Calculate remaining days (to be banked by webhook AFTER payment)
                    const now = new Date();
                    const currentEnd = new Date(activeSub.current_period_end);
                    const remainingMs = currentEnd.getTime() - now.getTime();
                    const remainingDays = Math.max(0, Math.ceil(remainingMs / (1000 * 60 * 60 * 24)));

                    console.log(`[DEBUG] Days to bank after payment: ${remainingDays} of ${activeSub.tier}`);

                    // ⚠️ IMPORTANT: We do NOT bank days here!
                    // Banking happens in WEBHOOK after successful payment.

                    // Create new subscription - old one cancelled by webhook after payment
                    console.log(`[DEBUG] Creating extension subscription`);
                    const subscription = await razorpay.subscriptions.create({
                        plan_id: planId,
                        customer_notify: 1,
                        quantity: 1,
                        total_count: safeTotalCount,
                        notes: {
                            userId: user.id,
                            pending_cancel_subscription_id: activeSub.external_subscription_id,
                            is_extension: 'true',
                            switch_from_tier: activeSub.tier,
                            days_to_bank: remainingDays.toString() // Webhook will bank these
                        }
                    });
                    subscription_id = subscription.id;
                    is_upgrade = false; // Trigger Razorpay checkout
                }
                // Code block end
            }
        } else {
            // === C. NEW SUBSCRIPTION ===
            console.log('[DEBUG] Mode: NEW CREATE');
            const subscription = await razorpay.subscriptions.create({
                plan_id: planId,
                customer_notify: 1,
                quantity: 1,
                total_count: safeTotalCount,
                notes: { userId: user.id }
            });
            subscription_id = subscription.id;
        }

        // === UPGRADE: Return ID and Key for Frontend Checkout ===
        return new Response(JSON.stringify({
            subscription_id: subscription_id,
            key_id: key_id,
            is_upgrade: is_upgrade, // Flag to frontend
            already_active: false
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

    } catch (error: any) {
        console.error("Razorpay Error:", error)
        // Return MORE details for debugging
        return new Response(JSON.stringify({
            error: error.message,
            details: error.error || 'No additional details',
            receivedPlanId: planId || 'Unknown'
        }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }
})
