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
    // Read raw body for signature verification
    const rawBody = await req.text();

    // Require webhook signature
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

    // Compute HMAC-SHA256 signature
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

    // Parse and validate payload
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

    // Sanitize optional fields
    const customer_name = typeof rawPayload.customer_name === 'string' ? rawPayload.customer_name.slice(0, 200).trim() : undefined;
    const subscription_id = typeof rawPayload.subscription_id === 'string' ? rawPayload.subscription_id.slice(0, 100) : undefined;
    const status = typeof rawPayload.status === 'string' ? rawPayload.status.slice(0, 50) : undefined;
    const plan_id = typeof rawPayload.plan_id === 'string' ? rawPayload.plan_id.slice(0, 100) : undefined;
    const current_period_start = typeof rawPayload.current_period_start === 'string' ? rawPayload.current_period_start.slice(0, 50) : undefined;
    const current_period_end = typeof rawPayload.current_period_end === 'string' ? rawPayload.current_period_end.slice(0, 50) : undefined;
    const next_billing_date = typeof rawPayload.next_billing_date === 'string' ? rawPayload.next_billing_date.slice(0, 50) : undefined;
    const transaction_id = typeof rawPayload.transaction_id === 'string' ? rawPayload.transaction_id.slice(0, 100) : undefined;

    // Build a unique event_id for idempotency
    const event_id = transaction_id || subscription_id || `${event_type}_${customer_email}_${Date.now()}`;

    // --- IDEMPOTENCY CHECK ---
    const { data: existingEvent } = await supabase
      .from('webhook_events')
      .select('id')
      .eq('provider', 'rockty')
      .eq('event_id', event_id)
      .maybeSingle();

    if (existingEvent) {
      console.log(`Duplicate webhook event ${event_id}, skipping`);
      return new Response(
        JSON.stringify({ success: true, message: 'Event already processed', deduplicated: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Record event for idempotency (insert before processing)
    await supabase.from('webhook_events').insert({
      provider: 'rockty',
      event_id,
      event_type,
      customer_email,
      payload: rawPayload,
    });

    const payload: RocktyWebhookPayload = {
      event_type, customer_email, customer_name, subscription_id,
      status, plan_id, current_period_start, current_period_end,
      next_billing_date, transaction_id,
    };

    console.log('Rockty webhook:', event_type, 'for', customer_email);

    // Log webhook
    await supabase.from('webhook_logs').insert({
      provider: 'rockty', event_type, payload, processed: false,
    });

    // 1. Find user by email
    let userId: string | null = null;

    const { data: existingProfile } = await supabase
      .from('profiles').select('id')
      .eq('email', customer_email).maybeSingle();

    if (existingProfile) {
      userId = existingProfile.id;
    } else {
      const { data: authUsers } = await supabase.auth.admin.listUsers();
      const authUser = authUsers?.users?.find(u => u.email?.toLowerCase() === customer_email);
      if (authUser) {
        userId = authUser.id;
      }
    }

    if (!userId) {
      // User not found — store pending enrollment
      console.log('User not found, storing in matriculas_pendentes');
      await supabase.from('matriculas_pendentes').upsert({
        email: customer_email,
        curso_id: plan_id || 'clube_oracular',
        portal_destino: 'assinante',
        produto_rockty: plan_id,
        transaction_id: subscription_id,
        processado: false,
      }, { onConflict: 'email' });

      return new Response(
        JSON.stringify({ success: true, message: 'Stored in pending matriculas' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 2. Determine new statuses
    let newPortal: string;
    let newSubscriptionStatus: string;
    let newProfileSubscriptionStatus: string;

    switch (event_type) {
      case 'subscription_created':
      case 'subscription_renewed':
      case 'payment_confirmed':
        newPortal = 'assinante';
        newSubscriptionStatus = 'active';
        newProfileSubscriptionStatus = 'active';
        break;

      case 'payment_failed':
        newPortal = 'assinante'; // Keep access during grace
        newSubscriptionStatus = 'past_due';
        newProfileSubscriptionStatus = 'active';
        break;

      case 'subscription_canceled':
        if (current_period_end && new Date(current_period_end) > new Date()) {
          newPortal = 'assinante';
          newSubscriptionStatus = 'canceled';
          newProfileSubscriptionStatus = 'active';
        } else {
          newPortal = 'visitante';
          newSubscriptionStatus = 'canceled';
          newProfileSubscriptionStatus = 'expired';
        }
        break;

      case 'subscription_expired':
        newPortal = 'visitante';
        newSubscriptionStatus = 'expired';
        newProfileSubscriptionStatus = 'expired';
        break;

      default:
        console.log('Unknown event type:', event_type);
        newPortal = 'visitante';
        newSubscriptionStatus = status || 'pending';
        newProfileSubscriptionStatus = 'none';
    }

    // 3. Upsert subscription (unique on user_id + provider)
    const subscriptionData = {
      user_id: userId,
      provider: 'rockty',
      plan_id: plan_id || 'clube_oracular',
      status: newSubscriptionStatus,
      current_period_start: current_period_start ? new Date(current_period_start).toISOString() : new Date().toISOString(),
      current_period_end: current_period_end ? new Date(current_period_end).toISOString() : null,
      next_billing_date: next_billing_date ? new Date(next_billing_date).toISOString() : null,
      external_subscription_id: subscription_id || null,
      last_event_at: new Date().toISOString(),
    };

    const { data: existingSub } = await supabase
      .from('subscriptions').select('id')
      .eq('user_id', userId).eq('provider', 'rockty').maybeSingle();

    if (existingSub) {
      await supabase.from('subscriptions').update(subscriptionData).eq('id', existingSub.id);
      console.log('Updated subscription for user:', userId);
    } else {
      await supabase.from('subscriptions').insert(subscriptionData);
      console.log('Created subscription for user:', userId);
    }

    // 4. Update profile
    const profileUpdate: Record<string, any> = {
      subscription_status: newProfileSubscriptionStatus,
      portal: newPortal,
      updated_at: new Date().toISOString(),
    };
    if (newSubscriptionStatus === 'active') {
      profileUpdate.access_expires_at = null; // No expiration for active subs
    }
    if (customer_name) {
      profileUpdate.nome = customer_name;
    }
    await supabase.from('profiles').update(profileUpdate).eq('id', userId);

    // 5. Update user_roles portal
    await supabase.from('user_roles').update({ portal: newPortal }).eq('user_id', userId);
    console.log('Updated portal to:', newPortal);

    // 6. Mark webhook log as processed
    await supabase.from('webhook_logs')
      .update({ processed: true })
      .eq('event_type', event_type)
      .eq('payload->>customer_email', customer_email)
      .order('created_at', { ascending: false })
      .limit(1);

    console.log('Webhook processed successfully for user:', userId);

    return new Response(
      JSON.stringify({
        success: true,
        user_id: userId,
        portal: newPortal,
        subscription_status: newSubscriptionStatus,
      }),
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
      console.error('Error logging webhook error:', logError);
    }

    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
