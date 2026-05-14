
import crypto from "crypto";

async function generateSignature(payload: string, secret: string): Promise<string> {
  return crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
}

async function testWebhook(name: string, payload: any) {
  const secret = process.env.ROCKTY_WEBHOOK_SECRET || '';
  const url = process.env.WEBHOOK_URL || '';
  
  const body = JSON.stringify(payload);
  const signature = await generateSignature(body, secret);
  
  console.log(`\n--- Running ${name} ---`);
  // console.log(`Payload: ${body}`);
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

const WEBHOOK_URL = process.env.WEBHOOK_URL;
if (!WEBHOOK_URL) {
  console.error("WEBHOOK_URL env var is required");
  process.exit(1);
}

const ROCKTY_WEBHOOK_SECRET = process.env.ROCKTY_WEBHOOK_SECRET;
if (!ROCKTY_WEBHOOK_SECRET) {
  console.error("ROCKTY_WEBHOOK_SECRET env var is required");
  process.exit(1);
}

async function runTests() {
    // F.TEST-1: Webhook Clube Mensal (Existing User)
    await testWebhook("F.TEST-1: Clube Mensal (Existing User)", {
      event_type: "subscription_created",
      customer_email: "test_d1_clube_mensal@oracula.test",
      customer_name: "Test User F1",
      subscription_id: `sub_f1_${Date.now()}`,
      plan_id: "karv9y4bewbdjcwbmvtwq",
      status: "active"
    });

    // F.TEST-2: Webhook Formação Orácula (Existing User)
    await testWebhook("F.TEST-2: Formação Orácula (Existing User)", {
      event_type: "subscription_created",
      customer_email: "test_d1_clube_mensal@oracula.test", 
      customer_name: "Test User F1",
      subscription_id: `sub_f2_${Date.now()}`,
      plan_id: "qqqmfhyjku7ou9kc70gg",
      status: "active"
    });

    // F.TEST-3: Webhook compra sem conta (New Email)
    const newEmail = `test_f3_pending_${Date.now()}@oracula.test`;
    await testWebhook("F.TEST-3: Webhook compra sem conta", {
      event_type: "subscription_created",
      customer_email: newEmail,
      customer_name: "Test Pending User F3",
      subscription_id: `sub_f3_${Date.now()}`,
      plan_id: "karv9y4bewbdjcwbmvtwq",
      status: "active"
    });

    // F.TEST-4: Webhook unknown offer
    await testWebhook("F.TEST-4: Unknown Offer", {
      event_type: "subscription_created",
      customer_email: "test_d1_clube_mensal@oracula.test",
      customer_name: "Test User F1",
      subscription_id: `sub_f4_${Date.now()}`,
      plan_id: "TEST_UNKNOWN_OFFER",
      status: "active"
    });
}

runTests().catch(console.error);
