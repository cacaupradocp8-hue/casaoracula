import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Call the database function to check and expire access
    const { data: expiredCount, error } = await supabase.rpc('check_and_expire_access');

    if (error) {
      console.error('Error running expiration check:', error);
      throw error;
    }

    // Log the expiration run
    const { error: logError } = await supabase
      .from('access_expiration_logs')
      .insert({
        reason: 'cron_job',
        previous_portal: null,
        user_id: null,
      });

    if (logError) {
      console.warn('Could not log expiration run:', logError);
    }

    console.log(`Access expiration check completed. Expired users: ${expiredCount}`);

    return new Response(
      JSON.stringify({
        success: true,
        expired_count: expiredCount,
        message: `Checked and expired ${expiredCount} user(s)`,
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in check-access-expiration function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
