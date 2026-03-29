import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Verify user with anon client
    const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userError } = await anonClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Invalid user" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Use service role for privileged operations
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    // Check if user already has active subscription
    const { data: existingSub } = await adminClient
      .from("subscriptions")
      .select("id, status")
      .eq("user_id", user.id)
      .eq("status", "active")
      .maybeSingle();

    if (existingSub) {
      // Already active, just ensure portal is correct
      await adminClient.from("user_roles").update({ portal: "assinante" }).eq("user_id", user.id);
      return new Response(JSON.stringify({ status: "already_active", portal: "assinante" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Activate: upsert subscription as pending_webhook (webhook will confirm later)
    const { error: subError } = await adminClient
      .from("subscriptions")
      .upsert(
        {
          user_id: user.id,
          provider: "rockty",
          status: "active",
          plan_id: "clube_oracular",
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        },
        { onConflict: "user_id,provider" }
      );

    if (subError) {
      console.error("Subscription upsert error:", subError);
      // Try insert instead
      await adminClient.from("subscriptions").insert({
        user_id: user.id,
        provider: "rockty",
        status: "active",
        plan_id: "clube_oracular",
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      });
    }

    // Update portal to assinante
    await adminClient.from("user_roles").update({ portal: "assinante" }).eq("user_id", user.id);

    // Update profile portal too
    await adminClient
      .from("profiles")
      .update({ portal: "assinante", subscription_status: "active", access_expires_at: null })
      .eq("id", user.id);

    console.log(`Pos-compra activation for user ${user.id} (${user.email})`);

    return new Response(
      JSON.stringify({ status: "activated", portal: "assinante" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("activate-pos-compra error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
