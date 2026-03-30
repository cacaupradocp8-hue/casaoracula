import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RocktyWebhookPayload {
  event_type: string;
  customer_email: string;
  customer_name?: string;
  subscription_id?: string;
  status?: string;
  plan_id?: string;
  current_period_start?: string;
  current_period_end?: string;
  next_billing_date?: string;
  transaction_id?: string;
}

/**
 * SOURCE OF TRUTH ARCHITECTURE:
 * 
 * 1. subscriptions table = authoritative source of subscription state
 * 2. profiles.portal / profiles.subscription_status = derived (synced via process_webhook_subscription)
 * 3. user_roles.portal = derived (synced via process_webhook_subscription)
 * 
 * Update order (atomic via DB function):
 *   subscriptions → profiles → user_roles
 * 
 * All three are updated in a single transaction by process_webhook_subscription().
 * If any step fails, the entire transaction rolls back — no partial state.
 */

/**
 * Generate a deterministic event ID from the webhook payload.
 * Uses SHA-256 hash of normalized key fields to ensure:
 * - Same payload always produces the same ID
 * - No reliance on Date.now() or other non-deterministic values
 */
async function computeEventId(payload: RocktyWebhookPayload): Promise<string> {
  // If the provider gives us a stable ID, prefer it
  if (payload.transaction_id) return `txn_${payload.transaction_id}`;
  if (payload.subscription_id && payload.event_type) {
    return `sub_${payload.subscription_id}_${payload.event_type}`;
  }

  // Fallback: deterministic hash of normalized payload fields
  const normalized = JSON.stringify({
    event_type: payload.event_type,
    customer_email: payload.customer_email,
    subscription_id: payload.subscription_id || '',
    plan_id: payload.plan_id || '',
    current_period_start: payload.current_period_start || '',
    current_period_end: payload.current_period_end || '',
  });

  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(normalized));
  const hashHex = Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0')).join('');

  return `hash_${hashHex.slice(0, 32)}`;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const rawBody = await req.text();

    // --- HMAC SIGNATURE VERIFICATION ---
    const webhookSecret = Deno.env.get('ROCKTY_WEBHOOK_SECRET');
    if (!webhookSecret) {
      console.error('ROCKTY_WEBHOOK_SECRET not configured');
      return new Response(
        JSON.stringify({ error: 'Webhook not properly configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const signature = req.headers.get('X-Rockty-Signature') || req.headers.get('x-webhook-signature');
    if (!signature) {
      console.error('Missing webhook signature header');
      return new Response(
        JSON.stringify({ error: 'Missing signature' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw', encoder.encode(webhookSecret),
      { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
    );
    const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(rawBody));
    const computedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map(b => b.toString(16).padStart(2, '0')).join('');

    if (signature !== computedSignature) {
      console.error('Invalid webhook signature');
      return new Response(
        JSON.stringify({ error: 'Invalid signature' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Webhook signature verified');

    // --- PARSE & VALIDATE PAYLOAD ---
    const rawPayload = JSON.parse(rawBody);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const customer_email = typeof rawPayload.customer_email === 'string'
      ? rawPayload.customer_email.trim().toLowerCase() : '';
    const event_type = typeof rawPayload.event_type === 'string'
      ? rawPayload.event_type.slice(0, 100) : '';

    if (!customer_email || !emailRegex.test(customer_email) || customer_email.length > 255) {
      return new Response(JSON.stringify({ error: 'Invalid customer_email' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    if (!event_type) {
      return new Response(JSON.stringify({ error: 'Missing event_type' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const customer_name = typeof rawPayload.customer_name === 'string' ? rawPayload.customer_name.slice(0, 200).trim() : undefined;
    const subscription_id = typeof rawPayload.subscription_id === 'string' ? rawPayload.subscription_id.slice(0, 100) : undefined;
    const status = typeof rawPayload.status === 'string' ? rawPayload.status.slice(0, 50) : undefined;
    const plan_id = typeof rawPayload.plan_id === 'string' ? rawPayload.plan_id.slice(0, 100) : undefined;
    const current_period_start = typeof rawPayload.current_period_start === 'string' ? rawPayload.current_period_start.slice(0, 50) : undefined;
    const current_period_end = typeof rawPayload.current_period_end === 'string' ? rawPayload.current_period_end.slice(0, 50) : undefined;
    const next_billing_date = typeof rawPayload.next_billing_date === 'string' ? rawPayload.next_billing_date.slice(0, 50) : undefined;
    const transaction_id = typeof rawPayload.transaction_id === 'string' ? rawPayload.transaction_id.slice(0, 100) : undefined;

    const payload: RocktyWebhookPayload = {
      event_type, customer_email, customer_name, subscription_id,
      status, plan_id, current_period_start, current_period_end,
      next_billing_date, transaction_id,
    };

    // --- DETERMINISTIC IDEMPOTENCY ---
    const event_id = await computeEventId(payload);

    const { data: existingEvent } = await supabase
      .from('webhook_events')
      .select('id')
      .eq('provider', 'rockty')
      .eq('event_id', event_id)
      .maybeSingle();

    if (existingEvent) {
      console.log(`Duplicate event ${event_id}, skipping`);
      return new Response(
        JSON.stringify({ success: true, message: 'Event already processed', deduplicated: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Processing webhook:', event_type, 'for', customer_email, 'event_id:', event_id);

    // Log raw webhook (before processing)
    await supabase.from('webhook_logs').insert({
      provider: 'rockty', event_type, payload, processed: false,
    });

    // --- FIND USER ---
    let userId: string | null = null;

    const { data: existingProfile } = await supabase
      .from('profiles').select('id')
      .eq('email', customer_email).maybeSingle();

    if (existingProfile) {
      userId = existingProfile.id;
    } else {
      const { data: authUsers } = await supabase.auth.admin.listUsers();
      const authUser = authUsers?.users?.find(u => u.email?.toLowerCase() === customer_email);
      if (authUser) userId = authUser.id;
    }

    if (!userId) {
      // User doesn't exist yet — store pending enrollment
      console.log('User not found, storing in matriculas_pendentes');
      const curso = plan_id || 'clube_oracular';

      await supabase.from('matriculas_pendentes').upsert({
        email: customer_email,
        curso_id: curso,
        portal_destino: 'assinante',
        produto_rockty: plan_id,
        transaction_id: subscription_id,
        processado: false,
      }, { onConflict: 'email,curso_id' });

      // Record event even for pending users (prevents reprocessing)
      await supabase.from('webhook_events').insert({
        provider: 'rockty', event_id, event_type, customer_email, payload: rawPayload,
      });

      return new Response(
        JSON.stringify({ success: true, message: 'Stored in pending matriculas' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // --- DETERMINE NEW STATE ---
    let newPortal: string;
    let newSubscriptionStatus: string;
    let newProfileSubStatus: string;

    switch (event_type) {
      case 'subscription_created':
      case 'subscription_renewed':
      case 'payment_confirmed':
        newPortal = 'assinante';
        newSubscriptionStatus = 'active';
        newProfileSubStatus = 'active';
        break;

      case 'payment_failed':
        newPortal = 'assinante'; // grace period
        newSubscriptionStatus = 'past_due';
        newProfileSubStatus = 'active';
        break;

      case 'subscription_canceled':
        if (current_period_end && new Date(current_period_end) > new Date()) {
          newPortal = 'assinante';
          newSubscriptionStatus = 'canceled';
          newProfileSubStatus = 'active';
        } else {
          newPortal = 'visitante';
          newSubscriptionStatus = 'canceled';
          newProfileSubStatus = 'expired';
        }
        break;

      case 'subscription_expired':
        newPortal = 'visitante';
        newSubscriptionStatus = 'expired';
        newProfileSubStatus = 'expired';
        break;

      default:
        console.log('Unknown event type:', event_type);
        newPortal = 'visitante';
        newSubscriptionStatus = status || 'pending';
        newProfileSubStatus = 'none';
    }

    // --- ATOMIC ACTIVATION via DB function ---
    // This updates subscriptions → profiles → user_roles in a single transaction.
    // If any step fails, the entire transaction rolls back.
    const { data: result, error: rpcError } = await supabase.rpc('process_webhook_subscription', {
      _user_id: userId,
      _provider: 'rockty',
      _plan_id: plan_id || 'clube_oracular',
      _status: newSubscriptionStatus,
      _portal: newPortal,
      _subscription_status_profile: newProfileSubStatus,
      _current_period_start: current_period_start ? new Date(current_period_start).toISOString() : new Date().toISOString(),
      _current_period_end: current_period_end ? new Date(current_period_end).toISOString() : null,
      _next_billing_date: next_billing_date ? new Date(next_billing_date).toISOString() : null,
      _external_subscription_id: subscription_id || null,
      _customer_name: customer_name || null,
    });

    if (rpcError) {
      console.error('Atomic subscription processing failed:', rpcError);
      // Do NOT record in webhook_events — allow retry
      return new Response(
        JSON.stringify({ error: 'Processing failed', detail: rpcError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // --- RECORD EVENT AFTER SUCCESS ---
    // Only mark as processed AFTER the atomic operation succeeds.
    // This ensures: if activation fails, the event can be retried.
    await supabase.from('webhook_events').insert({
      provider: 'rockty', event_id, event_type, customer_email, payload: rawPayload,
    });

    // Mark webhook log as processed
    await supabase.from('webhook_logs')
      .update({ processed: true })
      .eq('event_type', event_type)
      .eq('payload->>customer_email', customer_email)
      .order('created_at', { ascending: false })
      .limit(1);

    console.log('Webhook processed successfully:', result);

    return new Response(
      JSON.stringify({ success: true, ...result }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error processing webhook:', errorMessage);

    try {
      await supabase.from('webhook_logs').insert({
        provider: 'rockty', event_type: 'error',
        payload: { error: errorMessage }, processed: false, error: errorMessage,
      });
    } catch (logError) {
      console.error('Error logging:', logError);
    }

    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
