import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PushPayload {
  title: string;
  body: string;
  url?: string;
  icon?: string;
}

// Web Push requires specific JWT format for VAPID
async function generateVapidJwt(
  endpoint: string,
  privateKeyBase64: string,
  publicKeyBase64: string,
  subject: string,
): Promise<string> {
  const aud = new URL(endpoint).origin;
  const exp = Math.floor(Date.now() / 1000) + 12 * 60 * 60; // 12 hours

  const header = { typ: 'JWT', alg: 'ES256' };
  const payload = { aud, exp, sub: subject };

  const enc = new TextEncoder();
  const headerB64 = btoa(JSON.stringify(header)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const payloadB64 = btoa(JSON.stringify(payload)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const signingInput = `${headerB64}.${payloadB64}`;

  // Import private key
  const rawPrivateKey = Uint8Array.from(
    atob(privateKeyBase64.replace(/-/g, '+').replace(/_/g, '/')),
    c => c.charCodeAt(0)
  );
  
  const jwk = {
    kty: 'EC',
    crv: 'P-256',
    d: privateKeyBase64,
    x: publicKeyBase64.substring(0, 43),
    y: publicKeyBase64.substring(43),
  };

  // For VAPID, we need raw ECDSA signing
  // This is simplified - in production use web-push library
  const key = await crypto.subtle.importKey(
    'jwk',
    { ...jwk, key_ops: ['sign'] },
    { name: 'ECDSA', namedCurve: 'P-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' },
    key,
    enc.encode(signingInput)
  );

  // Convert DER signature to raw r||s format
  const sigBytes = new Uint8Array(signature);
  const sigB64 = btoa(String.fromCharCode(...sigBytes))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  return `${signingInput}.${sigB64}`;
}

async function sendPushToSubscription(
  subscription: { endpoint: string; p256dh: string; auth_key: string },
  payload: PushPayload,
  vapidPublicKey: string,
  vapidPrivateKey: string,
  vapidSubject: string,
): Promise<{ success: boolean; endpoint: string; status?: number; error?: string }> {
  try {
    // For now, use fetch with VAPID headers
    // This is a simplified implementation
    const jwt = await generateVapidJwt(
      subscription.endpoint,
      vapidPrivateKey,
      vapidPublicKey,
      vapidSubject
    );

    const body = JSON.stringify(payload);
    const enc = new TextEncoder();

    const response = await fetch(subscription.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Encoding': 'aes128gcm',
        'Authorization': `vapid t=${jwt}, k=${vapidPublicKey}`,
        'TTL': '86400',
        'Content-Length': enc.encode(body).byteLength.toString(),
      },
      body: enc.encode(body),
    });

    const responseText = await response.text();

    if (response.status === 201 || response.status === 200) {
      return { success: true, endpoint: subscription.endpoint, status: response.status };
    }

    // 410 Gone means subscription expired
    if (response.status === 410 || response.status === 404) {
      return { success: false, endpoint: subscription.endpoint, status: response.status, error: 'expired' };
    }

    return { success: false, endpoint: subscription.endpoint, status: response.status, error: responseText };
  } catch (error) {
    return { success: false, endpoint: subscription.endpoint, error: error.message };
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { user_id, notification_id, title, body, url } = await req.json();

    if (!user_id || !title || !body) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check user push preference
    const { data: prefs } = await supabaseAdmin
      .from('notification_preferences')
      .select('push')
      .eq('user_id', user_id)
      .single();

    if (!prefs?.push) {
      return new Response(JSON.stringify({ skipped: true, reason: 'push_disabled' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get user's push subscriptions
    const { data: subscriptions, error: subError } = await supabaseAdmin
      .from('push_subscriptions')
      .select('*')
      .eq('user_id', user_id);

    if (subError || !subscriptions?.length) {
      return new Response(JSON.stringify({ skipped: true, reason: 'no_subscriptions' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const vapidPublicKey = Deno.env.get('VAPID_PUBLIC_KEY');
    const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY');

    if (!vapidPublicKey || !vapidPrivateKey) {
      return new Response(JSON.stringify({ error: 'VAPID keys not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const payload: PushPayload = { title, body, url, icon: '/pwa-192x192.png' };
    const results = [];
    const expiredEndpoints: string[] = [];

    for (const sub of subscriptions) {
      const result = await sendPushToSubscription(
        sub,
        payload,
        vapidPublicKey,
        vapidPrivateKey,
        'mailto:suporte@casaoracula.com.br'
      );
      results.push(result);
      if (result.error === 'expired') {
        expiredEndpoints.push(sub.endpoint);
      }
    }

    // Clean up expired subscriptions
    if (expiredEndpoints.length > 0) {
      await supabaseAdmin
        .from('push_subscriptions')
        .delete()
        .eq('user_id', user_id)
        .in('endpoint', expiredEndpoints);
    }

    return new Response(JSON.stringify({ results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
