import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';
import { Resend } from 'https://esm.sh/resend@2.0.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface UserToNotify {
  id: string;
  email: string;
  nome: string | null;
  access_expires_at: string;
  subscription_status: string;
}

type EmailType = 'pre_expiracao' | 'expiracao' | 'retorno';

const APP_URL = 'https://casaoracula.lovable.app';
const FROM_EMAIL = 'Casa Orácula <noreply@casaoracula.com.br>';

// Templates de e-mail
const emailTemplates = {
  pre_expiracao: {
    subject: 'Seu acesso à Casa Orácula está prestes a se encerrar',
    getBody: (nome: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Georgia, serif; background-color: #0f1419; color: #e5e5e5; padding: 40px 20px; margin: 0;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #1a1f26; border-radius: 12px; padding: 40px; border: 1px solid #2a3441;">
    <h1 style="color: #d4af37; font-size: 24px; margin-bottom: 24px; font-weight: normal;">Olá, ${nome || 'querida'},</h1>
    
    <p style="font-size: 16px; line-height: 1.8; margin-bottom: 20px;">
      Seu acesso ao app da Casa Orácula se encerra em breve.
    </p>
    
    <p style="font-size: 16px; line-height: 1.8; margin-bottom: 20px;">
      Tudo o que você construiu — clientes, registros, ferramentas e percursos — <strong style="color: #d4af37;">permanece guardado</strong>.
    </p>
    
    <p style="font-size: 16px; line-height: 1.8; margin-bottom: 32px;">
      Para continuar usando o app profissionalmente, basta manter o acesso ativo.
    </p>
    
    <div style="text-align: center; margin: 32px 0;">
      <a href="${APP_URL}/planos" style="background-color: #d4af37; color: #0f1419; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
        Ver planos
      </a>
    </div>
    
    <hr style="border: none; border-top: 1px solid #2a3441; margin: 32px 0;">
    
    <p style="font-size: 14px; color: #888; line-height: 1.6;">
      Se preferir, você pode retomar o acesso quando quiser.<br>
      <strong>Nada é apagado.</strong>
    </p>
    
    <p style="font-size: 12px; color: #666; margin-top: 32px; text-align: center;">
      Casa Orácula — Formação Simbólica e Terapêutica
    </p>
  </div>
</body>
</html>
    `,
  },
  expiracao: {
    subject: 'Seu acesso foi encerrado — seu espaço permanece',
    getBody: (nome: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Georgia, serif; background-color: #0f1419; color: #e5e5e5; padding: 40px 20px; margin: 0;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #1a1f26; border-radius: 12px; padding: 40px; border: 1px solid #2a3441;">
    <h1 style="color: #d4af37; font-size: 24px; margin-bottom: 24px; font-weight: normal;">Olá, ${nome || 'querida'},</h1>
    
    <p style="font-size: 16px; line-height: 1.8; margin-bottom: 20px;">
      Seu período de acesso ao app da Casa Orácula foi encerrado.
    </p>
    
    <p style="font-size: 16px; line-height: 1.8; margin-bottom: 20px;">
      Seu conteúdo, histórico e estrutura <strong style="color: #d4af37;">continuam preservados</strong>.
    </p>
    
    <p style="font-size: 16px; line-height: 1.8; margin-bottom: 32px;">
      No momento, as funções profissionais estão pausadas.<br>
      Quando desejar reabrir seu acesso, é só ativar a assinatura.
    </p>
    
    <div style="text-align: center; margin: 32px 0;">
      <a href="${APP_URL}/planos" style="background-color: #d4af37; color: #0f1419; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
        Reativar acesso
      </a>
    </div>
    
    <hr style="border: none; border-top: 1px solid #2a3441; margin: 32px 0;">
    
    <p style="font-size: 14px; color: #888; line-height: 1.6; text-align: center;">
      Seu trabalho continua aqui. No seu tempo.
    </p>
    
    <p style="font-size: 12px; color: #666; margin-top: 32px; text-align: center;">
      Casa Orácula — Formação Simbólica e Terapêutica
    </p>
  </div>
</body>
</html>
    `,
  },
  retorno: {
    subject: 'Tudo o que você construiu ainda está aqui',
    getBody: (nome: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Georgia, serif; background-color: #0f1419; color: #e5e5e5; padding: 40px 20px; margin: 0;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #1a1f26; border-radius: 12px; padding: 40px; border: 1px solid #2a3441;">
    <h1 style="color: #d4af37; font-size: 24px; margin-bottom: 24px; font-weight: normal;">Olá, ${nome || 'querida'},</h1>
    
    <p style="font-size: 16px; line-height: 1.8; margin-bottom: 20px;">
      Passamos apenas para lembrar:
    </p>
    
    <p style="font-size: 18px; line-height: 1.8; margin-bottom: 20px; color: #d4af37;">
      seu espaço na Casa Orácula continua intacto.
    </p>
    
    <p style="font-size: 16px; line-height: 1.8; margin-bottom: 32px;">
      Clientes, registros, ferramentas e percursos seguem aguardando sua volta.<br>
      Você pode reativar o acesso quando sentir que é o momento.
    </p>
    
    <div style="text-align: center; margin: 32px 0;">
      <a href="${APP_URL}/planos" style="background-color: #d4af37; color: #0f1419; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
        Ver planos
      </a>
    </div>
    
    <hr style="border: none; border-top: 1px solid #2a3441; margin: 32px 0;">
    
    <p style="font-size: 14px; color: #888; line-height: 1.6; text-align: center;">
      Sem pressa. Sem perda. Sem recomeçar do zero.
    </p>
    
    <p style="font-size: 12px; color: #666; margin-top: 32px; text-align: center;">
      Casa Orácula — Formação Simbólica e Terapêutica
    </p>
  </div>
</body>
</html>
    `,
  },
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const resendApiKey = Deno.env.get('RESEND_API_KEY');

    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const resend = new Resend(resendApiKey);

    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const results = {
      pre_expiracao: { sent: 0, errors: 0 },
      expiracao: { sent: 0, errors: 0 },
      retorno: { sent: 0, errors: 0 },
    };

    // Função auxiliar para verificar se e-mail já foi enviado
    async function wasEmailSent(userId: string, tipoEmail: EmailType): Promise<boolean> {
      const { data } = await supabase
        .from('email_logs')
        .select('id')
        .eq('user_id', userId)
        .eq('tipo_email', tipoEmail)
        .single();
      return !!data;
    }

    // Função auxiliar para enviar e-mail e registrar log
    async function sendRetentionEmail(user: UserToNotify, tipoEmail: EmailType): Promise<boolean> {
      const template = emailTemplates[tipoEmail];
      const html = template.getBody(user.nome || '');

      try {
        console.log(`Sending ${tipoEmail} email to ${user.email}`);

        const { error: emailError } = await resend.emails.send({
          from: FROM_EMAIL,
          to: [user.email],
          subject: template.subject,
          html,
        });

        if (emailError) {
          throw emailError;
        }

        // Registrar sucesso
        await supabase.from('email_logs').insert({
          user_id: user.id,
          tipo_email: tipoEmail,
          success: true,
        });

        console.log(`Email ${tipoEmail} sent successfully to ${user.email}`);
        return true;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`Error sending ${tipoEmail} email to ${user.email}:`, errorMessage);

        // Registrar erro (mas não bloqueia reenvio futuro - ignora constraint)
        try {
          await supabase.from('email_logs').insert({
            user_id: user.id,
            tipo_email: tipoEmail,
            success: false,
            error_message: errorMessage,
          });
        } catch {
          // Ignora erro de insert se já existir (constraint unique)
        }

        return false;
      }
    }

    // ============================================
    // E-MAIL 1: PRÉ-EXPIRAÇÃO (7 dias antes)
    // ============================================
    console.log('Checking for pre-expiration emails (7 days before)...');
    
    const { data: preExpirationUsers, error: preError } = await supabase
      .from('profiles')
      .select('id, email, nome, access_expires_at, subscription_status')
      .neq('subscription_status', 'active')
      .not('access_expires_at', 'is', null)
      .gte('access_expires_at', sevenDaysFromNow)
      .lt('access_expires_at', new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

    if (preError) {
      console.error('Error fetching pre-expiration users:', preError);
    } else if (preExpirationUsers) {
      for (const user of preExpirationUsers as UserToNotify[]) {
        if (!(await wasEmailSent(user.id, 'pre_expiracao'))) {
          const success = await sendRetentionEmail(user, 'pre_expiracao');
          if (success) results.pre_expiracao.sent++;
          else results.pre_expiracao.errors++;
        }
      }
    }

    // ============================================
    // E-MAIL 2: EXPIRAÇÃO (no dia)
    // ============================================
    console.log('Checking for expiration emails (on the day)...');
    
    const { data: expirationUsers, error: expError } = await supabase
      .from('profiles')
      .select('id, email, nome, access_expires_at, subscription_status')
      .neq('subscription_status', 'active')
      .not('access_expires_at', 'is', null)
      .lt('access_expires_at', now.toISOString());

    if (expError) {
      console.error('Error fetching expiration users:', expError);
    } else if (expirationUsers) {
      for (const user of expirationUsers as UserToNotify[]) {
        if (!(await wasEmailSent(user.id, 'expiracao'))) {
          const success = await sendRetentionEmail(user, 'expiracao');
          if (success) results.expiracao.sent++;
          else results.expiracao.errors++;
        }
      }
    }

    // ============================================
    // E-MAIL 3: RETORNO (7 dias após expiração)
    // ============================================
    console.log('Checking for return emails (7 days after expiration)...');
    
    const { data: returnUsers, error: retError } = await supabase
      .from('profiles')
      .select('id, email, nome, access_expires_at, subscription_status')
      .neq('subscription_status', 'active')
      .not('access_expires_at', 'is', null)
      .lt('access_expires_at', sevenDaysAgo);

    if (retError) {
      console.error('Error fetching return users:', retError);
    } else if (returnUsers) {
      for (const user of returnUsers as UserToNotify[]) {
        if (!(await wasEmailSent(user.id, 'retorno'))) {
          const success = await sendRetentionEmail(user, 'retorno');
          if (success) results.retorno.sent++;
          else results.retorno.errors++;
        }
      }
    }

    const totalSent = results.pre_expiracao.sent + results.expiracao.sent + results.retorno.sent;
    const totalErrors = results.pre_expiracao.errors + results.expiracao.errors + results.retorno.errors;

    console.log('Retention emails job completed:', JSON.stringify(results));

    return new Response(
      JSON.stringify({
        success: true,
        message: `Sent ${totalSent} emails, ${totalErrors} errors`,
        results,
        timestamp: now.toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in send-retention-emails function:', error);
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
