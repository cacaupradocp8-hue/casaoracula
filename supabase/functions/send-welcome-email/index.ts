import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  email: string;
  userName?: string;
  includeWaitingListLink?: boolean;
}

function generateWelcomeEmailHtml(userName?: string, includeWaitingListLink = true): string {
  const firstName = userName?.split(' ')[0] || 'Você';
  const waitingListUrl = 'https://casaoracula.lovable.app/lista-espera';

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bem-vinda à Casa ORÁCULA</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: Georgia, 'Times New Roman', serif;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="width: 100%; max-width: 520px; border-collapse: collapse;">
          
          <!-- Header -->
          <tr>
            <td align="center" style="padding-bottom: 32px;">
              <div style="width: 64px; height: 64px; border-radius: 50%; background: rgba(212, 175, 55, 0.15); text-align: center; line-height: 64px;">
                <span style="font-size: 28px; color: #d4af37;">✓</span>
              </div>
            </td>
          </tr>

          <!-- Confirmation -->
          <tr>
            <td align="center" style="padding-bottom: 24px;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 400; color: #fafafa; line-height: 1.4;">
                ${firstName}, o portal foi atravessado.
              </h1>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding-bottom: 32px;">
              <p style="margin: 0; font-size: 16px; color: #d4af37; font-weight: 500;">
                Sua entrada na Casa ORÁCULA está confirmada.
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td align="center" style="padding-bottom: 32px;">
              <div style="width: 40px; height: 1px; background-color: rgba(212, 175, 55, 0.3);"></div>
            </td>
          </tr>

          <!-- Orientation -->
          <tr>
            <td align="center" style="padding-bottom: 32px;">
              <p style="margin: 0 0 12px 0; font-size: 16px; color: #a1a1aa; line-height: 1.6;">
                Não é preciso fazer tudo agora.
              </p>
              <p style="margin: 0 0 12px 0; font-size: 16px; color: #a1a1aa; line-height: 1.6;">
                O Jardim se revela aos poucos.
              </p>
              <p style="margin: 0; font-size: 16px; color: #a1a1aa; line-height: 1.6;">
                O ritmo é pessoal — e a Casa respeita isso.
              </p>
            </td>
          </tr>

          ${includeWaitingListLink ? `
          <!-- Waiting List Option -->
          <tr>
            <td style="padding: 24px; background-color: rgba(255,255,255,0.03); border-radius: 8px; border: 1px solid rgba(255,255,255,0.06);">
              <p style="margin: 0 0 12px 0; font-size: 14px; color: #a1a1aa;">
                Se quiser, você pode receber avisos de:
              </p>
              <ul style="margin: 0 0 16px 0; padding-left: 20px; font-size: 14px; color: #71717a; line-height: 1.8;">
                <li>Encontros abertos</li>
                <li>Eventos gratuitos</li>
                <li>Portais temporários</li>
              </ul>
              <a href="${waitingListUrl}" style="display: inline-block; padding: 10px 20px; font-size: 14px; color: #a1a1aa; text-decoration: none; border: 1px solid rgba(255,255,255,0.1); border-radius: 6px;">
                Quero ser avisada →
              </a>
            </td>
          </tr>
          ` : ''}

          <!-- Closing Quote -->
          <tr>
            <td style="padding: 32px 0;">
              <table role="presentation" style="border-collapse: collapse;">
                <tr>
                  <td style="width: 2px; background-color: rgba(212, 175, 55, 0.3);"></td>
                  <td style="padding-left: 16px;">
                    <p style="margin: 0 0 4px 0; font-size: 18px; font-style: italic; color: #fafafa;">
                      "Aqui, você não precisa correr."
                    </p>
                    <p style="margin: 0; font-size: 14px; color: #71717a;">
                      A Casa respeita ciclos.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top: 32px; border-top: 1px solid rgba(255,255,255,0.06);">
              <p style="margin: 0; font-size: 12px; color: #52525b;">
                Casa ORÁCULA — Formação Simbólica
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const { email, userName, includeWaitingListLink = true }: WelcomeEmailRequest = await req.json();

    if (!email) {
      throw new Error("Email is required");
    }

    const html = generateWelcomeEmailHtml(userName, includeWaitingListLink);
    const firstName = userName?.split(' ')[0] || 'Você';

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Casa ORÁCULA <noreply@casaoracula.com.br>",
        to: [email],
        subject: `${firstName}, o portal foi atravessado`,
        html,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Resend API error: ${error}`);
    }

    const data = await res.json();

    return new Response(JSON.stringify({ success: true, id: data.id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error sending welcome email:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
