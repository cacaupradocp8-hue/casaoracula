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

    // 1. Call the database function to check and expire access (profiles)
    const { data: expiredCount, error } = await supabase.rpc('check_and_expire_access');

    if (error) {
      console.error('Error running profile expiration check:', error);
      throw error;
    }

    // 2. Expire degustação requests that have passed their expiration time
    const { data: expiredDegustacoes, error: degustacaoError } = await supabase
      .from('degustacao_requests')
      .update({ status: 'expirado' })
      .eq('status', 'aprovado')
      .lt('expira_em', new Date().toISOString())
      .select('id, user_id');

    if (degustacaoError) {
      console.error('Error expiring degustações:', degustacaoError);
    }

    // 3. Revert portal for users whose degustação just expired
    let degustacaoExpiredCount = 0;
    if (expiredDegustacoes && expiredDegustacoes.length > 0) {
      degustacaoExpiredCount = expiredDegustacoes.length;
      
      for (const deg of expiredDegustacoes) {
        // Revert user portal to visitante
        await supabase
          .from('profiles')
          .update({ portal: 'visitante' })
          .eq('id', deg.user_id);

        await supabase
          .from('user_roles')
          .update({ portal: 'visitante' })
          .eq('user_id', deg.user_id);

        // Notify user that degustação expired
        await supabase
          .from('notifications')
          .insert({
            user_id: deg.user_id,
            type: 'info',
            title: 'Degustação encerrada',
            body: 'Seu período de degustação de 24h foi encerrado. Conheça nossos planos para continuar acessando a Casa.',
          });
      }
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

    console.log(`Access expiration check completed. Expired users: ${expiredCount}, Expired degustações: ${degustacaoExpiredCount}`);

    return new Response(
      JSON.stringify({
        success: true,
        expired_count: expiredCount,
        degustacao_expired_count: degustacaoExpiredCount,
        message: `Checked and expired ${expiredCount} user(s), ${degustacaoExpiredCount} degustação(ões)`,
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
