
import { crypto } from "https://deno.land/std@0.177.0/crypto/mod.ts";
import { encode as hexEncode } from "https://deno.land/std@0.177.0/encoding/hex.ts";

async function generateSignature(payload: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  return new TextDecoder().decode(hexEncode(new Uint8Array(signatureBuffer)));
}

async function testWebhook(name: string, payload: any) {
  const secret = Deno.env.get('ROCKTY_WEBHOOK_SECRET') || '';
  const url = Deno.env.get('WEBHOOK_URL') || '';
  
  const body = JSON.stringify(payload);
  const signature = await generateSignature(body, secret);
  
  console.log(`\n--- Running ${name} ---`);
  console.log(`Payload: ${body}`);
  console.log(`Signature: ${signature}`);
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Rockty-Signature': signature
    },
    body: body
  });
  
  const result = await response.text();
  console.log(`Status: ${response.status}`);
  console.log(`Result: ${result}`);
  return { status: response.status, body: result };
}

const WEBHOOK_URL = Deno.env.get('WEBHOOK_URL');
if (!WEBHOOK_URL) {
  console.error("WEBHOOK_URL env var is required");
  Deno.exit(1);
}

// F.TEST-1: Webhook Clube Mensal (Existing User)
await testWebhook("F.TEST-1: Clube Mensal (Existing User)", {
  event_type: "subscription_created",
  customer_email: "test_d1_clube_mensal@oracula.test",
  customer_name: "Test User F1",
  subscription_id: "sub_f_test_1",
  plan_id: "karv9y4bewbdjcwbmvtwq", // Rockty Offer ID for Clube Mensal
  status: "active"
});

// F.TEST-2: Webhook Formação Orácula (Existing User)
// We'll use the same user or another one if preferred.
await testWebhook("F.TEST-2: Formação Orácula (Existing User)", {
  event_type: "subscription_created",
  customer_email: "test_d1_clube_mensal@oracula.test", 
  customer_name: "Test User F1",
  subscription_id: "sub_f_test_2",
  plan_id: "qqqmfhyjku7ou9kc70gg", // Rockty Offer ID for Formação Orácula
  status: "active"
});

// F.TEST-3: Webhook compra sem conta (New Email)
const newEmail = `test_f3_pending_${Date.now()}@oracula.test`;
await testWebhook("F.TEST-3: Webhook compra sem conta", {
  event_type: "subscription_created",
  customer_email: newEmail,
  customer_name: "Test Pending User F3",
  subscription_id: "sub_f_test_3",
  plan_id: "karv9y4bewbdjcwbmvtwq",
  status: "active"
});

// F.TEST-4: Webhook unknown offer
await testWebhook("F.TEST-4: Unknown Offer", {
  event_type: "subscription_created",
  customer_email: "test_d1_clube_mensal@oracula.test",
  customer_name: "Test User F1",
  subscription_id: "sub_f_test_4",
  plan_id: "TEST_UNKNOWN_OFFER",
  status: "active"
});
