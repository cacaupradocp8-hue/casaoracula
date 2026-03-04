import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailPayload {
  user_id: string;
  notification_id?: string;
  title: string;
  body: string;
  cta_label?: string;
  cta_url?: string;
  type: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      return new Response(JSON.stringify({ error: 'RESEND_API_KEY not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const payload: EmailPayload = await req.json();
    const { user_id, title, body, cta_label, cta_url, type } = payload;

    if (!user_id || !title || !body) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check user email preference
    const { data: prefs } = await supabaseAdmin
      .from('notification_preferences')
      .select('email, novo_conteudo, expiracao_assinatura, mensagens_suporte, atividade_comunidade')
      .eq('user_id', user_id)
      .single();

    if (!prefs?.email) {
      return new Response(JSON.stringify({ skipped: true, reason: 'email_disabled' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check specific event type preference
    const typePreferenceMap: Record<string, string> = {
      'info': 'novo_conteudo',
      'pre_expiracao': 'expiracao_assinatura',
      'expiracao': 'expiracao_assinatura',
      'retorno': 'mensagens_suporte',
    };
    const prefKey = typePreferenceMap[type];
    if (prefKey && prefs[prefKey as keyof typeof prefs] === false) {
      return new Response(JSON.stringify({ skipped: true, reason: `${prefKey}_disabled` }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get user email
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('email, nome')
      .eq('id', user_id)
      .single();

    if (!profile?.email) {
      return new Response(JSON.stringify({ error: 'User email not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Build email HTML
    const ctaHtml = cta_url && cta_label
      ? `<div style="text-align:center;margin:24px 0">
           <a href="${cta_url}" style="display:inline-block;padding:12px 24px;background:#8b5cf6;color:#fff;text-decoration:none;border-radius:8px;font-weight:600">${cta_label}</a>
         </div>`
      : '';

    const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
      <div style="max-width:560px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1)">
        <div style="background:#0a0d14;padding:24px;text-align:center">
          <h1 style="color:#c4b5fd;margin:0;font-size:18px;letter-spacing:1px">CASA ORÁCULA</h1>
        </div>
        <div style="padding:32px 24px">
          <h2 style="color:#1a1a2e;margin:0 0 16px;font-size:20px">${title}</h2>
          <p style="color:#4a4a68;line-height:1.6;margin:0 0 16px">${body}</p>
          ${ctaHtml}
        </div>
        <div style="padding:16px 24px;background:#f9fafb;text-align:center">
          <p style="color:#9ca3af;font-size:12px;margin:0">
            Você recebeu este email porque está cadastrada na Casa Orácula.
            <br>Para gerenciar suas notificações, acesse Minha Conta.
          </p>
        </div>
      </div>
    </body>
    </html>`;

    // Send via Resend
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Casa Orácula <notificacoes@casaoracula.com.br>',
        to: [profile.email],
        subject: title,
        html,
      }),
    });

    const resendResult = await resendResponse.json();

    if (!resendResponse.ok) {
      return new Response(JSON.stringify({ error: 'Failed to send email', details: resendResult }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, id: resendResult.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
