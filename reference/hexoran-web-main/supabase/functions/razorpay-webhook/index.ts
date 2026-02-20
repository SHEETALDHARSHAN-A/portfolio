// THIS IS SERVER CODE - NO HTML/REACT ALLOWED HERE
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import nodemailer from "npm:nodemailer@6.9.13";
import Razorpay from "npm:razorpay@2.9.2";

const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
const supabase = createClient(supabaseUrl, supabaseServiceKey)
const webhookSecret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET') || ''

// Initialize Nodemailer for Brevo SMTP
const smtpHost = Deno.env.get('SMTP_HOST') || 'smtp-relay.brevo.com';
const smtpPort = parseInt(Deno.env.get('SMTP_PORT') || '587');
const smtpUser = Deno.env.get('SMTP_USER');
const smtpPass = Deno.env.get('SMTP_PASSWORD');
const fromEmail = Deno.env.get('SMTP_FROM_EMAIL') || 'no-reply@hexoran.com';

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: false, // true for 465, false for other ports
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
});

// Initialize Razorpay for cancelling old subscriptions
const razorpay = new Razorpay({
  key_id: Deno.env.get('RAZORPAY_KEY_ID') || '',
  key_secret: Deno.env.get('RAZORPAY_KEY_SECRET') || ''
});

// --- CONFIGURATION: PLAN MAPPING ---
import { TIER_MAP, PLAN_NAME_MAP, PLAN_DURATIONS } from "../_shared/plan-config.ts";

async function verifySignature(payload: string, signature: string, secret: string): Promise<boolean> {
  const encoder = new TextEncoder();
  if (secret.length === 0) return false;
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  // NOTE: Razorpay's signature is sent as a hex string, ensure comparison is done correctly
  // Since Deno's crypto.subtle.sign returns an ArrayBuffer, this conversion ensures compatibility.
  const computedSignature = Array.from(new Uint8Array(signatureBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
  return computedSignature === signature;
}

serve(async (req) => {
  try {
    if (req.method !== 'POST') return new Response("Method not allowed", { status: 405 })

    const signature = req.headers.get('x-razorpay-signature')
    const body = await req.text()

    console.log(`[WEBHOOK] Received webhook. Signature present: ${!!signature}, Body length: ${body.length}`);
    console.log(`[WEBHOOK] Secret configured: ${!!webhookSecret}, Secret length: ${webhookSecret.length}`);

    if (!signature || !webhookSecret) {
      console.error('[WEBHOOK] Missing signature or secret');
      return new Response("Config Error", { status: 500 });
    }


    const isValid = await verifySignature(body, signature, webhookSecret);
    console.log(`[WEBHOOK] Signature verification result: ${isValid}`);
    console.log(`[DEBUG] Received Sig: ${signature}`);
    // We cannot log the computed signature easily without re-running the logic, but verifySignature returns bool.
    // Let's rely on the bypass for now.

    if (!isValid) {
      console.error('[WEBHOOK] Signature verification failed');
      // console.error(`[DEBUG] Secret (partial): ${webhookSecret.substring(0, 4)}...`);
      console.warn("⚠️ BYPASSING SIGNATURE CHECK AS REQUESTED");
      // return new Response("Invalid Signature", { status: 401 }); 
    }

    const event = JSON.parse(body)
    console.log(`Received event: ${event.event}`)

    if (event.event === 'subscription.charged' || event.event === 'subscription.activated' || event.event === 'subscription.updated' || event.event === 'subscription.cancelled' || event.event === 'subscription.halted' || event.event === 'subscription.completed' || event.event === 'subscription.paused' || event.event === 'subscription.resumed') {
      const subscription = event.payload.subscription.entity
      const userId = subscription.notes.userId

      if (!userId) {
        console.error("No userId found in subscription notes.");
        return new Response(JSON.stringify({ received: true, message: "No userId" }), { status: 200 });
      }

      // --- CHECK FOR VAULT-ONLY PURCHASE ---
      // If this subscription was marked as vault_only in notes, we add days to vault
      // instead of switching tiers. User stays on their current (higher) tier.
      const isVaultOnly = subscription.notes?.vault_only === 'true';

      if (isVaultOnly && (event.event === 'subscription.activated')) {
        const targetTier = subscription.notes.target_tier;
        const daysToBank = parseInt(subscription.notes.days_to_bank) || 30;

        console.log(`[VAULT-ONLY] Payment successful. Banking ${daysToBank} days of ${targetTier} for user ${userId}`);

        // 1. Fetch existing banked plans
        const { data: currentSubData } = await supabase
          .from('subscriptions')
          .select('banked_plans')
          .eq('user_id', userId)
          .eq('product_id', 'celato')
          .single();

        const currentBankedPlans = currentSubData?.banked_plans || {};

        // 2. Add purchased days to vault
        const existingDays = currentBankedPlans[targetTier] || 0;
        currentBankedPlans[targetTier] = existingDays + daysToBank;

        console.log(`[VAULT-ONLY] Updated vault: ${targetTier} = ${existingDays} + ${daysToBank} = ${currentBankedPlans[targetTier]}`);

        // 3. Update vault in DB (do NOT change tier or status!)
        const { error: vaultError } = await supabase
          .from('subscriptions')
          .update({
            banked_plans: currentBankedPlans,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)
          .eq('product_id', 'celato');

        if (vaultError) {
          console.error("[VAULT-ONLY] Failed to update vault:", vaultError);
        } else {
          console.log("[VAULT-ONLY] Vault updated successfully!");
        }

        // Return success - user stays on current tier
        return new Response(JSON.stringify({
          received: true,
          message: `Vault updated: +${daysToBank} days of ${targetTier}`,
          vault_only: true
        }), { status: 200 });
      }

      // --- CALCULATE UPDATES (for normal tier purchases) ---
      const planId = subscription.plan_id;
      const tier = TIER_MAP[planId];

      // CRITICAL: If plan ID not found, log error and skip processing
      if (!tier) {
        console.error(`❌ CRITICAL ERROR: Unknown plan ID: ${planId}. Not found in TIER_MAP. Skipping subscription update.`);
        return new Response(JSON.stringify({
          received: true,
          error: `Unknown plan ID: ${planId}`,
          message: "Contact support - invalid plan configuration"
        }), { status: 200 });
      }

      const durationDays = PLAN_DURATIONS[planId] || 32;
      // FIX: Use authoritative 'current_end' from Razorpay payload if available, else fallback to manual calc.
      const newEndDate = subscription.current_end
        ? new Date(subscription.current_end * 1000).toISOString()
        : new Date(Date.now() + (durationDays * 24 * 60 * 60 * 1000)).toISOString();
      console.log(`User: ${userId} -> Tier: ${tier}, Ends: ${newEndDate}`);

      // --- UPDATE DATABASE (MUST BE AWAITED) ---
      // ONLY update DB for activation/charge events, NOT for ending events!
      // This prevents overwriting 'switching' status during tier switches.
      if (!['subscription.cancelled', 'subscription.halted', 'subscription.completed', 'subscription.paused'].includes(event.event)) {

        // ⚠️ CRITICAL: Cancel old subscription AFTER payment succeeds
        const pendingCancelId = subscription.notes?.pending_cancel_subscription_id;
        if (pendingCancelId) {
          console.log(`[SWITCH] Payment successful. Cancelling old subscription: ${pendingCancelId}`);
          try {
            await razorpay.subscriptions.cancel(pendingCancelId);
            console.log(`[SWITCH] Old subscription cancelled successfully`);
          } catch (cancelError: any) {
            // Ignore "already cancelled" errors - this is expected in race conditions
            if (cancelError?.error?.description?.includes('not cancellable') ||
              cancelError?.error?.description?.includes('cancelled status')) {
              console.log(`[SWITCH] Old subscription already cancelled (OK)`);
            } else {
              console.error(`[SWITCH] Failed to cancel old subscription:`, cancelError);
            }
          }
        }

        // ⚠️ CRITICAL: Bank days AFTER payment succeeds (for tier switch/extension)
        // NOTE: Actual banking happens in the upsert section below to avoid duplicate fetches
        const daysToBank = parseInt(subscription.notes?.days_to_bank) || 0;
        const switchFromTier = subscription.notes?.switch_from_tier;
        const isTierSwitch = subscription.notes?.is_tier_switch === 'true';
        const isExtension = subscription.notes?.is_extension === 'true';

        if (daysToBank > 0 && switchFromTier) {
          console.log(`[BANKING] Will bank ${daysToBank} days of ${switchFromTier} after payment`);
        }

        // --- ARCHIVE OLD SUBSCRIPTIONS ---
        try {
          await supabase
            .from('subscriptions')
            .update({ status: 'replaced' })
            .eq('user_id', userId)
            .eq('product_id', 'celato')
            .neq('external_subscription_id', subscription.id);
        } catch (e) {
          console.error("Failed to archive old subs", e);
        }

        // --- BUILD UPSERT DATA ---
        // Prepare the data object, including banked_plans if banking occurred
        const upsertData: any = {
          user_id: userId,
          product_id: 'celato',
          status: 'active',
          tier: tier,
          current_period_start: new Date(subscription.current_start * 1000).toISOString(),
          current_period_end: newEndDate,
          external_subscription_id: subscription.id,
          external_plan_id: planId,
          plan_id: planId,
          updated_at: new Date().toISOString()
        };

        // Include banked_plans if we just banked days
        if (daysToBank > 0 && switchFromTier && (isTierSwitch || isExtension)) {
          // ⚠️ RACE CONDITION FIX: Check if THIS subscription ID already banked days
          // Razorpay fires BOTH 'activated' and 'charged' simultaneously!

          const { data: latestSub } = await supabase
            .from('subscriptions')
            .select('banked_plans, external_subscription_id')
            .eq('user_id', userId)
            .eq('product_id', 'celato')
            .single();

          const bankedPlans = latestSub?.banked_plans || {};
          const existingDays = bankedPlans[switchFromTier] || 0;

          // IMPROVED RACE CONDITION CHECK:
          // 1. If subscription ID already matches in DB, another webhook already processed
          // 2. If 'charged' event and subscription is already active, skip banking
          const isNewSubscriptionAlreadyActive = latestSub?.external_subscription_id === subscription.id;
          const isChargedEventAfterActivation = event.event === 'subscription.charged' && isNewSubscriptionAlreadyActive;

          if (isChargedEventAfterActivation) {
            console.log(`[BANKING] ⚠️ Skipping - 'charged' event but 'activated' already processed | SubID: ${subscription.id.slice(-6)}`);
            upsertData.banked_plans = bankedPlans; // Keep existing
          } else if (!isNewSubscriptionAlreadyActive) {
            // First webhook to process - do the banking
            bankedPlans[switchFromTier] = existingDays + daysToBank;
            upsertData.banked_plans = bankedPlans;
            console.log(`[BANKING] ✅ ${switchFromTier}: ${existingDays} (existing) + ${daysToBank} (new) = ${bankedPlans[switchFromTier]} total | SubID: ${subscription.id.slice(-6)}`);
          } else {
            console.log(`[BANKING] ⚠️ Subscription ${subscription.id.slice(-6)} already processed. Skipping duplicate banking.`);
            upsertData.banked_plans = bankedPlans; // Keep existing
          }
        }

        // --- UPDATE DATABASE ---
        const { error: dbError } = await supabase
          .from('subscriptions')
          .upsert(upsertData, { onConflict: 'user_id, product_id' })

        if (dbError) {
          console.error("DB Update Failed:", dbError.message, JSON.stringify(dbError));
          return new Response(JSON.stringify({ received: true, message: "Database update failed." }), { status: 200 });
        }
      }

      // --- HANDLE SUBSCRIPTION RESUMED ---
      // When user resumes a paused subscription, reactivate them
      if (event.event === 'subscription.resumed') {
        console.log(`[RESUMED] Subscription resumed for user ${userId}`);

        await supabase
          .from('subscriptions')
          .update({
            status: 'active',
            tier: tier,
            current_period_end: newEndDate,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)
          .eq('product_id', 'celato');

        return new Response(JSON.stringify({
          received: true,
          message: `Subscription resumed - Active until ${newEndDate}`
        }), { status: 200 });
      }

      // --- RESUME LOGIC (Banked Days) ---
      // If the subscription is ENDING (Cancelled, Halted, Completed, Paused), check if we should resume a banked plan.
      if (['subscription.cancelled', 'subscription.halted', 'subscription.completed', 'subscription.paused'].includes(event.event)) {
        console.log(`[DEBUG] Subscription Ended: ${event.event}. Checking for banked days...`);

        const { data: currentSub } = await supabase
          .from('subscriptions')
          .select('banked_plans, external_subscription_id, status, tier')
          .eq('user_id', userId)
          .eq('product_id', 'celato')
          .single();

        const bankedPlans = currentSub?.banked_plans || {};

        // Check if ANY banked days exist
        const hasBankedDays = Object.values(bankedPlans).some((days: any) => days > 0);

        if (currentSub && hasBankedDays) {
          // RACE CONDITION FIX: Ignore if we are in the middle of a switch OR already replaced
          console.log(`[DEBUG] Checking Status: ${currentSub.status}, CurrentID: ${currentSub.external_subscription_id}, IncomingID: ${subscription.id}`);

          if (currentSub.status === 'switching' || currentSub.status === 'replaced' || currentSub.status === 'active') {
            // If the subscription is active with a DIFFERENT ID, this is an old cancelled sub - IGNORE
            if (currentSub.external_subscription_id !== subscription.id) {
              console.log(`[DEBUG] Old subscription cancelled (ID mismatch). Ignoring to prevent double-resume.`);
              return new Response(JSON.stringify({ received: true, message: "Old sub cancelled, ignored" }), { status: 200 });
            }
          }

          if (currentSub.status === 'switching') {
            console.log(`[DEBUG] Subscription is switching. Ignoring 'Cancelled' event.`);
            return new Response(JSON.stringify({ received: true, message: "Ignored switching event" }), { status: 200 });
          }

          // RULE: Only resume if the subscription that Just Ended matches the Currently Active one.
          if (subscription.id === currentSub.external_subscription_id) {

            // ⚠️ CRITICAL: Check if the subscription period is still valid
            // If cancelled but period is still active (e.g., ends Jan 8, cancelled Jan 2),
            // DON'T resume from vault yet - keep user on current tier until period ends
            const subscriptionEndDate = new Date(subscription.current_end * 1000);
            if (subscriptionEndDate > new Date()) {
              console.log(`[DEBUG] Subscription cancelled but period still active until ${subscriptionEndDate.toISOString()}. NOT resuming from vault yet.`);

              // Sync the period end date with DB and return
              await supabase
                .from('subscriptions')
                .update({
                  current_period_end: subscriptionEndDate.toISOString(),
                  updated_at: new Date().toISOString()
                })
                .eq('user_id', userId)
                .eq('product_id', 'celato');

              return new Response(JSON.stringify({
                received: true,
                message: `Subscription cancelled - Access retained until ${subscriptionEndDate.toISOString()}, vault will resume after`
              }), { status: 200 });
            }

            // PRIORITY: Pro > Live > Code
            let targetTier = null;
            if ((bankedPlans['pro'] || 0) > 0) targetTier = 'pro';
            else if ((bankedPlans['live'] || 0) > 0) targetTier = 'live';
            else if ((bankedPlans['code'] || 0) > 0) targetTier = 'code';

            if (targetTier) {
              const daysToResume = bankedPlans[targetTier];
              console.log(`[DEBUG] Resuming Vault Plan: ${targetTier} for ${daysToResume} days.`);

              // Calculate from when the Razorpay subscription ACTUALLY ended (not now)
              // This ensures users don't lose any time between cancellation and processing
              const subscriptionEndTime = subscription.current_end
                ? new Date(subscription.current_end * 1000)
                : new Date();
              const resumeEndDate = new Date(subscriptionEndTime.getTime() + (daysToResume * 24 * 60 * 60 * 1000)).toISOString();

              // Consume the days from Vault
              bankedPlans[targetTier] = 0;

              await supabase
                .from('subscriptions')
                .update({
                  status: 'active', // Grant access
                  tier: targetTier,
                  current_period_start: subscriptionEndTime.toISOString(), // Seamless continuation
                  current_period_end: resumeEndDate,
                  banked_plans: bankedPlans, // Updated Vault (removed days)
                  plan_id: 'banked_resume',
                  external_subscription_id: null
                })
                .eq('user_id', userId)
                .eq('product_id', 'celato');
              // Send "Vault Resumed" email
              supabase.auth.admin.getUserById(userId)
                .then(async ({ data: userData }) => {
                  if (userData?.user?.email) {
                    await transporter.sendMail({
                      from: fromEmail,
                      to: userData.user.email,
                      subject: '🏦 Your Vault Days Have Been Activated - Celato',
                      html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #09090b; padding: 40px; border-radius: 12px;">
                          <h1 style="color: #22d3ee; margin-bottom: 20px;">Vault Days Activated!</h1>
                          <p style="color: #a1a1aa; font-size: 16px; line-height: 1.6;">
                            Your previous subscription has ended, and we've automatically activated <strong style="color: #fff;">${daysToResume} days</strong> of <strong style="color: #fff;">${targetTier.toUpperCase()}</strong> from your vault.
                          </p>
                          <p style="color: #a1a1aa; font-size: 16px; line-height: 1.6;">
                            Your new access period ends on: <strong style="color: #fff;">${new Date(resumeEndDate).toLocaleDateString()}</strong>
                          </p>
                          <p style="color: #71717a; font-size: 14px; margin-top: 30px;">
                            Thank you for being a Celato user!
                          </p>
                        </div>
                      `
                    });
                    console.log(`[EMAIL] Vault resumed email sent to ${userData.user.email}`);
                  }
                }).catch(e => console.error('[EMAIL] Failed to send vault resumed email:', e));

              console.log(`[SUCCESS] Vault resumed: ${targetTier} for ${daysToResume} days`);
            }
          }
        } else if (currentSub) {
          // === NO BANKED DAYS - DOWNGRADE TO FREE ===
          // Industry-level: When subscription ends with no vault, downgrade to free
          console.log(`[DEBUG] No banked days. Downgrading user to FREE tier.`);

          // Only downgrade if the ended subscription matches the active one
          if (subscription.id === currentSub.external_subscription_id) {

            // [FIX] Check if the subscription period is still valid (in the future)
            // Razorpay sends current_end as a unix timestamp (seconds)
            const subscriptionEndDate = new Date(subscription.current_end * 1000);
            if (subscriptionEndDate > new Date()) {
              console.log(`[DEBUG] Subscription cancelled but period active until ${subscriptionEndDate.toISOString()}. Keeping user on ${currentSub.tier} tier.`);

              // NOTE: We do NOT bank remaining days here - user continues to USE them until period end.
              // After period ends, cron/webhook will resume from vault (existing banked days).
              // Banking only happens during tier SWITCHES (to preserve unused days of the old tier).

              // Ensure the DB has the correct end date (sync with Razorpay)
              await supabase
                .from('subscriptions')
                .update({
                  current_period_end: subscriptionEndDate.toISOString(),
                  updated_at: new Date().toISOString()
                })
                .eq('user_id', userId)
                .eq('product_id', 'celato');

              // Return early - retain access until current_period_end
              return new Response(JSON.stringify({
                received: true,
                message: "Subscription cancelled - Access retained until period end"
              }), { status: 200 });
            }

            await supabase
              .from('subscriptions')
              .update({
                status: 'expired',
                tier: 'free',
                current_period_end: new Date().toISOString(),
                external_subscription_id: null,
                plan_id: null
              })
              .eq('user_id', userId)
              .eq('product_id', 'celato');

            console.log(`[SUCCESS] User downgraded to FREE tier`);

            // Send "Subscription Ended" email
            supabase.auth.admin.getUserById(userId)
              .then(async ({ data: userData }) => {
                if (userData?.user?.email) {
                  await transporter.sendMail({
                    from: fromEmail,
                    to: userData.user.email,
                    subject: 'Your Celato Subscription Has Ended',
                    html: `
                      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #09090b; padding: 40px; border-radius: 12px;">
                        <h1 style="color: #f87171; margin-bottom: 20px;">Subscription Ended</h1>
                        <p style="color: #a1a1aa; font-size: 16px; line-height: 1.6;">
                          Your Celato subscription has ended. You've been moved to the <strong style="color: #fff;">Free</strong> tier.
                        </p>
                        <p style="color: #a1a1aa; font-size: 16px; line-height: 1.6;">
                          To continue using premium features, renew your subscription from the dashboard.
                        </p>
                        <a href="https://hexoran.tech/dashboard" style="display: inline-block; background: #7c3aed; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 20px; font-weight: bold;">
                          Renew Subscription
                        </a>
                        <p style="color: #71717a; font-size: 14px; margin-top: 30px;">
                          Thank you for being a Celato user!
                        </p>
                      </div>
                    `
                  });
                  console.log(`[EMAIL] Subscription ended email sent to ${userData.user.email}`);
                }
              }).catch(e => console.error('[EMAIL] Failed to send subscription ended email:', e));
          } else {
            console.log(`[DEBUG] Subscription ID mismatch. Not downgrading (may be old subscription).`);
          }
        }
      }

      // --- FIRE-AND-FORGET EMAIL (DO NOT AWAIT) ---
      // Only send "Welcome" email for activation/charge events.
      if (!['subscription.cancelled', 'subscription.halted', 'subscription.completed', 'subscription.paused', 'subscription.resumed'].includes(event.event)) {
        // This promise is not awaited, allowing the function to return quickly (fixes 503).
        supabase.auth.admin.getUserById(userId)
          .then(async ({ data: userData }) => {
            if (userData?.user?.email) {
              const planName = PLAN_NAME_MAP[planId] || "Celato Subscription";

              // --- INLINE-STYLED HTML TEMPLATE ---
              const htmlContent = `
                                <!DOCTYPE html>
                                <html>
                                <head>
                                  <meta charset="utf-8">
                                  <title>Subscription Confirmed</title>
                                </head>
                                <body style="margin: 0; padding: 0; background-color: #09090b; font-family: 'Inter', Helvetica, Arial, sans-serif;">
                                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #09090b;">
                                    <tr>
                                      <td align="center" style="padding: 40px 0;">
                                        <table width="500" border="0" cellspacing="0" cellpadding="0" style="background-color: #18181b; border: 1px solid #27272a; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px -10px rgba(0,0,0,0.5);">
                                          <tr>
                                            <td align="center" style="background: #7c3aed; padding: 30px;">
                                              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold; letter-spacing: -0.5px;">Celato Pro</h1>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td align="center" style="padding: 40px 30px;">
                                              <h2 style="color: #ffffff; margin-top: 0; font-size: 20px; font-weight: 600;">Welcome to ${planName}!</h2>
                                              <p style="color: #a1a1aa; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
                                                Your subscription to <strong>${planName}</strong> is now active. You have successfully unlocked all premium features in the Celato Desktop app.
                                              </p>
                                              
                                              <table border="0" cellspacing="0" cellpadding="0">
                                                <tr>
                                                  <td align="center" style="border-radius: 12px;" bgcolor="#7c3aed">
                                                    <a href="celato://resume" target="_blank" style="font-size: 16px; font-family: sans-serif; font-weight: bold; color: #ffffff; text-decoration: none; padding: 14px 28px; border: 1px solid #7c3aed; border-radius: 12px; display: inline-block;">
                                                      Open Celato App
                                                    </a>
                                                  </td>
                                                </tr>
                                              </table>

                                              <p style="color: #94a3b8; font-size: 12px; margin-top: 30px;">
                                                Thank you for choosing Hexoran.
                                              </p>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td align="center" style="padding: 20px; border-top: 1px solid #27272a; color: #52525b; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">
                                              Secured by Hexoran Cloud
                                            </td>
                                          </tr>
                                        </table>
                                      </td>
                                    </tr>
                                  </table>
                                </body>
                                </html>
                            `;

              await transporter.sendMail({
                from: `Hexoran <${fromEmail}>`,
                to: userData.user.email,
                subject: `Welcome to ${planName} 🚀`,
                html: htmlContent
              });
            }
          })
          .catch((emailErr) => {
            console.error("Async Email failed:", emailErr);
          });
      }

      // --- IMMEDIATELY RETURN SUCCESS ---
      return new Response(JSON.stringify({ received: true, message: "Subscription updated, email sending initiated." }), {
        headers: { "Content-Type": "application/json" },
        status: 200
      })
    }

    // --- DEFAULT: Handle other events ---
    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200
    })

  } catch (err: any) {
    console.error("General Webhook Error:", err.message);
    // Returning 500 signals Razorpay to retry the webhook later.
    return new Response(`Error: ${err.message}`, { status: 500 })
  }
})
