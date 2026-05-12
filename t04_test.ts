import { createHmac } from "crypto";

const secret = process.env.ROCKTY_WEBHOOK_SECRET;
if (!secret) {
  console.error("ROCKTY_WEBHOOK_SECRET not found");
  process.exit(1);
}

const payload = {
  event_type: "subscription_created",
  customer_email: "teste.desconhecido+01@example.com",
  plan_id: "TEST_UNKNOWN_OFFER",
  subscription_id: "TEST_SUB_UNKNOWN",
  transaction_id: "TEST_TX_UNKNOWN",
  status: "active"
};

const body = JSON.stringify(payload);
const signature = createHmac("sha256", secret).update(body).digest("hex");

console.log("--- TEST T04 START ---");
console.log("Payload:", body);
console.log("Signature (calculated):", signature);

const response = await fetch("http://localhost:54321/functions/v1/rockty-webhook", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-Rockty-Signature": signature
  },
  body: body
});

console.log("Status Code:", response.status);
const responseText = await response.text();
console.log("Response Body:", responseText);
console.log("--- TEST T04 END ---");
