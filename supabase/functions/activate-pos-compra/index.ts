import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * activate-pos-compra — READ-ONLY status check
 * 
 * This function does NOT activate subscriptions or grant access.
 * It only checks the current subscription status for the authenticated user.
 * All activation happens exclusively via the rockty-webhook.
 */
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
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Verify user identity
    const anonClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await anonClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Invalid user" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = claimsData.claims.sub;

    // Use service role ONLY to read subscription status (not to write anything)
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    // Check subscription status
    const { data: subscription } = await adminClient
      .from("subscriptions")
      .select("id, status, plan_id, current_period_start, current_period_end")
      .eq("user_id", userId)
      .eq("provider", "rockty")
      .maybeSingle();

    // Check portal from user_roles
    const { data: userRole } = await adminClient
      .from("user_roles")
      .select("portal")
      .eq("user_id", userId)
      .maybeSingle();

    const portal = userRole?.portal || "visitante";
    const subscriptionStatus = subscription?.status || "none";
    const isActive = subscriptionStatus === "active";

    return new Response(
      JSON.stringify({
        status: subscriptionStatus,
        portal,
        is_active: isActive,
        plan_id: subscription?.plan_id || null,
        current_period_end: subscription?.current_period_end || null,
        // Explicitly: this function does NOT activate anything
        message: isActive
          ? "Assinatura ativa. Acesso liberado."
          : subscriptionStatus === "pending"
          ? "Pagamento em processamento. Aguarde a confirmação."
          : "Nenhuma assinatura encontrada. Verifique seu pagamento.",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("activate-pos-compra status check error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
