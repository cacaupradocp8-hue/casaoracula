import { createHmac } from "crypto";

const secret = process.env.ROCKTY_WEBHOOK_SECRET;
if (!secret) {
  console.error("ROCKTY_WEBHOOK_SECRET not found");
  process.exit(1);
}

const payload = {
  event_type: "subscription_created",
  customer_email: "teste.mensal+01@example.com",
  plan_id: "karv9y4bewbdjcwbmvtwq",
  subscription_id: "TEST_SUB_MENSAL",
  transaction_id: "TEST_TX_MENSAL",
  status: "active"
};

const body = JSON.stringify(payload);
const signature = createHmac("sha256", secret).update(body).digest("hex");

console.log("--- TEST T01 PREP ---");
console.log("Payload:", body);
console.log("Signature:", signature);
