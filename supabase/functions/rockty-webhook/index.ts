import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
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

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Only accept POST requests
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
    
    // Require webhook signature - reject if secret not configured
    const webhookSecret = Deno.env.get('ROCKTY_WEBHOOK_SECRET');
    if (!webhookSecret) {
      console.error('ROCKTY_WEBHOOK_SECRET not configured - rejecting request');
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
      'raw',
      encoder.encode(webhookSecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(rawBody));
    const computedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    if (signature !== computedSignature) {
      console.error('Invalid webhook signature');
      return new Response(
        JSON.stringify({ error: 'Invalid signature' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log('Webhook signature verified successfully');

    // Validate and parse payload
    const rawPayload = JSON.parse(rawBody);

    // Validate required fields and formats
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const customer_email = typeof rawPayload.customer_email === 'string' 
      ? rawPayload.customer_email.trim().toLowerCase() 
      : '';
    const event_type = typeof rawPayload.event_type === 'string' 
      ? rawPayload.event_type.slice(0, 100) 
      : '';

    if (!customer_email || !emailRegex.test(customer_email) || customer_email.length > 255) {
      console.error('Invalid or missing customer_email in webhook payload');
      return new Response(
        JSON.stringify({ error: 'Invalid customer_email' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!event_type) {
      console.error('Missing event_type in webhook payload');
      return new Response(
        JSON.stringify({ error: 'Missing event_type' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Sanitize optional string fields
    const customer_name = typeof rawPayload.customer_name === 'string' 
      ? rawPayload.customer_name.slice(0, 200).trim() 
      : undefined;
    const subscription_id = typeof rawPayload.subscription_id === 'string' 
      ? rawPayload.subscription_id.slice(0, 100) 
      : undefined;
    const status = typeof rawPayload.status === 'string' 
      ? rawPayload.status.slice(0, 50) 
      : undefined;
    const plan_id = typeof rawPayload.plan_id === 'string' 
      ? rawPayload.plan_id.slice(0, 100) 
      : undefined;
    const current_period_start = typeof rawPayload.current_period_start === 'string' 
      ? rawPayload.current_period_start.slice(0, 50) 
      : undefined;
    const current_period_end = typeof rawPayload.current_period_end === 'string' 
      ? rawPayload.current_period_end.slice(0, 50) 
      : undefined;
    const next_billing_date = typeof rawPayload.next_billing_date === 'string' 
      ? rawPayload.next_billing_date.slice(0, 50) 
      : undefined;

    const payload: RocktyWebhookPayload = {
      event_type,
      customer_email,
      customer_name,
      subscription_id,
      status,
      plan_id,
      current_period_start,
      current_period_end,
      next_billing_date,
      transaction_id: typeof rawPayload.transaction_id === 'string' 
        ? rawPayload.transaction_id.slice(0, 100) 
        : undefined,
    };
    
    console.log('Rockty webhook received:', event_type, 'for', customer_email);

    // Log the webhook event
    await supabase.from('webhook_logs').insert({
      provider: 'rockty',
      event_type: payload.event_type,
      payload: payload,
      processed: false,
    });

    // 1. Find or create user by email
    let userId: string | null = null;

    // Check if user exists in profiles
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', customer_email.toLowerCase())
      .maybeSingle();

    if (existingProfile) {
      userId = existingProfile.id;
      console.log('Found existing user:', userId);
    } else {
      // Check auth.users via admin API
      const { data: authUsers } = await supabase.auth.admin.listUsers();
      const authUser = authUsers?.users?.find(u => u.email?.toLowerCase() === customer_email.toLowerCase());
      
      if (authUser) {
        userId = authUser.id;
        console.log('Found user in auth:', userId);
      } else {
        // User doesn't exist - store in matriculas_pendentes for when they sign up
        console.log('User not found, storing in matriculas_pendentes');
        
        const { error: pendingError } = await supabase
          .from('matriculas_pendentes')
          .upsert({
            email: customer_email.toLowerCase(),
            curso_id: plan_id || 'formacao_oracula',
            portal_destino: 'iniciada',
            produto_rockty: plan_id,
            transaction_id: subscription_id,
            processado: false,
          }, { onConflict: 'email' });

        if (pendingError) {
          console.error('Error storing pending matricula:', pendingError);
        }

        // Update webhook log as processed
        await supabase.from('webhook_logs')
          .update({ processed: true })
          .eq('event_type', event_type)
          .eq('payload->>customer_email', customer_email);

        return new Response(
          JSON.stringify({ success: true, message: 'Stored in pending matriculas' }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // 2. Determine new access_status based on event
    let newAccessStatus: string;
    let newSubscriptionStatus: string;

    switch (event_type) {
      case 'subscription_created':
      case 'subscription_renewed':
      case 'payment_confirmed':
        newAccessStatus = 'member_continuity';
        newSubscriptionStatus = 'active';
        break;
      
      case 'payment_failed':
        newAccessStatus = 'member_continuity'; // Keep access during grace period
        newSubscriptionStatus = 'past_due';
        break;
      
      case 'subscription_canceled':
        // Keep access until period end, then becomes member_free
        if (current_period_end && new Date(current_period_end) > new Date()) {
          newAccessStatus = 'member_continuity';
        } else {
          newAccessStatus = 'member_free';
        }
        newSubscriptionStatus = 'canceled';
        break;
      
      case 'subscription_expired':
        newAccessStatus = 'member_free';
        newSubscriptionStatus = 'expired';
        break;
      
      default:
        console.log('Unknown event type:', event_type);
        newAccessStatus = 'member_free';
        newSubscriptionStatus = status || 'active';
    }

    // 3. Update or create subscription
    const subscriptionData = {
      user_id: userId,
      provider: 'rockty',
      plan_id: plan_id || null,
      status: newSubscriptionStatus,
      current_period_start: current_period_start ? new Date(current_period_start).toISOString() : null,
      current_period_end: current_period_end ? new Date(current_period_end).toISOString() : null,
      next_billing_date: next_billing_date ? new Date(next_billing_date).toISOString() : null,
      external_subscription_id: subscription_id || null,
      last_event_at: new Date().toISOString(),
    };

    // Check if subscription exists
    const { data: existingSub } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('user_id', userId)
      .eq('provider', 'rockty')
      .maybeSingle();

    if (existingSub) {
      const { error: updateSubError } = await supabase
        .from('subscriptions')
        .update(subscriptionData)
        .eq('id', existingSub.id);
      
      if (updateSubError) {
        console.error('Error updating subscription:', updateSubError);
      } else {
        console.log('Updated subscription for user:', userId);
      }
    } else {
      const { error: insertSubError } = await supabase
        .from('subscriptions')
        .insert(subscriptionData);
      
      if (insertSubError) {
        console.error('Error creating subscription:', insertSubError);
      } else {
        console.log('Created subscription for user:', userId);
      }
    }

    // 4. Update profile access_status and role
    const profileUpdate: Record<string, any> = {
      access_status: newAccessStatus,
      updated_at: new Date().toISOString(),
    };

    // If name is provided, update it
    if (customer_name) {
      profileUpdate.nome = customer_name;
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .update(profileUpdate)
      .eq('id', userId);

    if (profileError) {
      console.error('Error updating profile:', profileError);
    } else {
      console.log('Updated profile access_status to:', newAccessStatus);
    }

    // 5. Update user_roles portal if becoming member_continuity
    if (newAccessStatus === 'member_continuity') {
      const { error: roleError } = await supabase
        .from('user_roles')
        .update({ portal: 'iniciada' })
        .eq('user_id', userId);

      if (roleError) {
        console.error('Error updating user_roles:', roleError);
      } else {
        console.log('Updated user portal to iniciada');
      }

      // Also update/create matricula
      const { error: matriculaError } = await supabase
        .from('matriculas')
        .upsert({
          user_id: userId,
          curso_id: plan_id || 'formacao_oracula',
          ativa: true,
          data_inicio: new Date().toISOString(),
        }, { onConflict: 'user_id,curso_id' });

      if (matriculaError) {
        console.error('Error updating matricula:', matriculaError);
      }
    }

    // 6. Mark webhook as processed
    await supabase.from('webhook_logs')
      .update({ processed: true })
      .eq('event_type', event_type)
      .eq('payload->>customer_email', customer_email)
      .order('created_at', { ascending: false })
      .limit(1);

    console.log('Webhook processed successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        user_id: userId,
        access_status: newAccessStatus,
        subscription_status: newSubscriptionStatus
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error processing webhook:', errorMessage);
    
    // Log the error
    try {
      await supabase.from('webhook_logs').insert({
        provider: 'rockty',
        event_type: 'error',
        payload: { error: errorMessage },
        processed: false,
        error: errorMessage,
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
