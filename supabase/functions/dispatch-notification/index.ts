import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// This function is called by a database trigger (pg_net) whenever a new notification is inserted.
// It dispatches to push and email channels based on user preferences.
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { record } = await req.json();

    if (!record || !record.user_id) {
      return new Response(JSON.stringify({ error: 'No record provided' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const notification = record;
    const basePayload = {
      user_id: notification.user_id,
      notification_id: notification.id,
      title: notification.title,
      body: notification.body,
      cta_label: notification.cta_label,
      cta_url: notification.cta_url,
      type: notification.type,
    };

    // Dispatch to push (fire and forget)
    const pushPromise = fetch(`${supabaseUrl}/functions/v1/send-push-notification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${serviceRoleKey}`,
      },
      body: JSON.stringify({
        user_id: notification.user_id,
        notification_id: notification.id,
        title: notification.title,
        body: notification.body,
        url: notification.cta_url,
      }),
    }).then(r => r.text()).catch(e => console.error('Push error:', e));

    // Dispatch to email (fire and forget)
    const emailPromise = fetch(`${supabaseUrl}/functions/v1/send-notification-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${serviceRoleKey}`,
      },
      body: JSON.stringify(basePayload),
    }).then(r => r.text()).catch(e => console.error('Email error:', e));

    // Wait for both
    await Promise.allSettled([pushPromise, emailPromise]);

    return new Response(JSON.stringify({ dispatched: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Dispatch error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
