import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      return new Response(JSON.stringify({ error: 'Email service not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const supabaseUser = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseUser.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { cliente_id, email, nome_cliente } = await req.json();

    if (!cliente_id || !email) {
      return new Response(JSON.stringify({ error: 'Missing cliente_id or email' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verify therapist owns this client
    const { data: cliente, error: clienteError } = await supabaseAdmin
      .from('clientes')
      .select('id, terapeuta_id, nome')
      .eq('id', cliente_id)
      .eq('terapeuta_id', user.id)
      .single();

    if (clienteError || !cliente) {
      return new Response(JSON.stringify({ error: 'Client not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get therapist name
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('nome')
      .eq('id', user.id)
      .single();

    const terapeutaNome = profile?.nome || 'Sua terapeuta';

    // Generate token
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days

    // Create invitation record
    const { error: conviteError } = await supabaseAdmin
      .from('co_convites')
      .insert({
        cliente_id,
        terapeuta_id: user.id,
        email: email.toLowerCase(),
        token,
        status: 'pending',
        expires_at: expiresAt,
      });

    if (conviteError) {
      console.error('Error creating invitation:', conviteError);
      return new Response(JSON.stringify({ error: 'Failed to create invitation' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Update client record
    await supabaseAdmin
      .from('clientes')
      .update({
        email: email.toLowerCase(),
        invited_by: user.id,
        invitation_sent_at: new Date().toISOString(),
      })
      .eq('id', cliente_id);

    // Build invite URL
    const siteUrl = Deno.env.get('SITE_URL') || 'https://casaoracula.lovable.app';
    const inviteUrl = `${siteUrl}/aceitar-convite?token=${token}`;

    // Send email via Resend
    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Casa Orácula <noreply@notify.appcasaoracula.institutotransfore.com.br>',
        to: [email.toLowerCase()],
        subject: `🌿 ${terapeutaNome} preparou um espaço para você`,
        html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;font-family:Georgia,'Times New Roman',serif;background-color:#0a0a0a;color:#e5e5e5;">
  <div style="max-width:520px;margin:40px auto;padding:40px 32px;background-color:#111;border:1px solid #1a1a1a;border-radius:16px;">
    <div style="text-align:center;margin-bottom:32px;">
      <div style="width:48px;height:48px;margin:0 auto 16px;border-radius:50%;background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.2);display:flex;align-items:center;justify-content:center;">
        <span style="font-size:24px;">🌿</span>
      </div>
      <p style="font-size:10px;text-transform:uppercase;letter-spacing:4px;color:rgba(16,185,129,0.5);margin:0;">Jardim da Heroína</p>
    </div>
    
    <h1 style="font-size:20px;text-align:center;color:#f5f5f5;margin:0 0 24px;font-weight:normal;">
      Um espaço foi preparado para você
    </h1>
    
    <p style="font-size:14px;line-height:1.8;color:#a1a1a1;text-align:center;margin:0 0 8px;">
      ${nome_cliente || 'Olá'},
    </p>
    <p style="font-size:14px;line-height:1.8;color:#a1a1a1;text-align:center;margin:0 0 32px;">
      <strong style="color:#d4d4d4;">${terapeutaNome}</strong> preparou um Jardim da Heroína para você — 
      um espaço seguro de integração e continuidade do seu processo terapêutico.
    </p>
    
    <div style="text-align:center;margin:32px 0;">
      <a href="${inviteUrl}" style="display:inline-block;padding:14px 32px;background-color:#059669;color:#ffffff;text-decoration:none;border-radius:10px;font-size:14px;font-weight:600;">
        🌿 Acessar meu Jardim
      </a>
    </div>
    
    <p style="font-size:12px;color:#666;text-align:center;margin-top:32px;">
      Este convite expira em 7 dias.
    </p>
    
    <div style="margin-top:40px;padding-top:20px;border-top:1px solid #1a1a1a;text-align:center;">
      <p style="font-size:10px;color:#444;margin:0;">Casa Orácula · Jardim da Heroína</p>
    </div>
  </div>
</body>
</html>
        `,
      }),
    });

    if (!emailRes.ok) {
      const errBody = await emailRes.text();
      console.error('Resend error:', errBody);
      return new Response(JSON.stringify({ error: 'Failed to send email', details: errBody }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('Error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
