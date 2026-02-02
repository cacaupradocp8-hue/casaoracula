import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Portal levels hierarchy
const PORTAL_LEVELS: Record<string, number> = {
  'visitante': 1,
  'mentorada': 2,
  'aluna_formacao': 3,
  'assinante': 4,
  'pre_iniciada': 2, // Legacy
  'iniciada': 5, // Legacy
  'oracula': 5,
  'admin': 6,
};

// Generate signed token for Cloudflare Stream
async function generateSignedToken(
  videoId: string,
  signingKey: string,
  expiresInSeconds: number = 3600
): Promise<string> {
  // Cloudflare Stream uses JWT for signed URLs
  const header = {
    alg: "RS256",
    kid: signingKey.split('.')[0], // Key ID is before the dot
  };

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    sub: videoId,
    kid: signingKey.split('.')[0],
    exp: now + expiresInSeconds,
    nbf: now - 60, // Allow 60 seconds clock skew
    accessRules: [
      {
        type: "any",
        action: "allow",
      },
    ],
  };

  // For Cloudflare Stream, we use the signing key directly
  // The key format is: keyId.base64EncodedPrivateKey
  const keyParts = signingKey.split('.');
  if (keyParts.length !== 2) {
    throw new Error("Invalid signing key format");
  }

  const keyId = keyParts[0];
  const privateKeyPem = atob(keyParts[1]);
  
  // Encode header and payload
  const encodedHeader = btoa(JSON.stringify(header)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const encodedPayload = btoa(JSON.stringify(payload)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  
  const signingInput = `${encodedHeader}.${encodedPayload}`;
  
  // Import the private key
  const pemContents = privateKeyPem
    .replace('-----BEGIN RSA PRIVATE KEY-----', '')
    .replace('-----END RSA PRIVATE KEY-----', '')
    .replace(/\s/g, '');
  
  const binaryKey = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0));
  
  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    binaryKey,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  // Sign the token
  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    new TextEncoder().encode(signingInput)
  );
  
  const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  
  return `${signingInput}.${encodedSignature}`;
}

// Hash token for logging (security measure)
async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 16);
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const CLOUDFLARE_ACCOUNT_ID = Deno.env.get('CLOUDFLARE_ACCOUNT_ID');
    const CLOUDFLARE_STREAM_SIGNING_KEY = Deno.env.get('CLOUDFLARE_STREAM_SIGNING_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!CLOUDFLARE_ACCOUNT_ID) {
      throw new Error('CLOUDFLARE_ACCOUNT_ID is not configured');
    }
    if (!CLOUDFLARE_STREAM_SIGNING_KEY) {
      throw new Error('CLOUDFLARE_STREAM_SIGNING_KEY is not configured');
    }
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Supabase credentials not configured');
    }

    // Parse request body
    const { videoId, contextType, contextId, requiredPortal } = await req.json();

    if (!videoId) {
      return new Response(
        JSON.stringify({ error: 'Video ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    let userId: string | null = null;
    let userPortal = 'visitante';
    let ipAddress = req.headers.get('cf-connecting-ip') || req.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      
      if (user && !authError) {
        userId = user.id;
        
        // Get user portal level
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('portal')
          .eq('user_id', user.id)
          .single();
        
        if (roleData) {
          userPortal = roleData.portal;
        }
      }
    }

    console.log(`[cloudflare-video-token] User: ${userId || 'anonymous'}, Portal: ${userPortal}, Video: ${videoId}`);

    // Check access level
    const userLevel = PORTAL_LEVELS[userPortal] || 1;
    const requiredLevel = PORTAL_LEVELS[requiredPortal || 'visitante'] || 1;

    if (userLevel < requiredLevel) {
      // Log blocked attempt
      await supabase.from('video_playback_logs').insert({
        user_id: userId,
        video_id: videoId,
        context_type: contextType || 'unknown',
        context_id: contextId,
        portal_level: userPortal,
        action: 'blocked',
        ip_address: ipAddress,
        user_agent: userAgent,
        success: false,
        error_message: `Insufficient access level. Required: ${requiredPortal}, User: ${userPortal}`,
      });

      return new Response(
        JSON.stringify({ 
          error: 'Access denied',
          message: 'Você não tem permissão para acessar este vídeo.',
          requiredPortal,
          userPortal,
        }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate signed token (expires in 1 hour)
    const expiresIn = 3600;
    const signedToken = await generateSignedToken(videoId, CLOUDFLARE_STREAM_SIGNING_KEY, expiresIn);
    const tokenHash = await hashToken(signedToken);

    // Build the embed URL with signed token
    const embedUrl = `https://customer-${CLOUDFLARE_ACCOUNT_ID}.cloudflarestream.com/${videoId}/iframe?signed=${signedToken}`;

    // Log successful access attempt
    await supabase.from('video_playback_logs').insert({
      user_id: userId,
      video_id: videoId,
      context_type: contextType || 'unknown',
      context_id: contextId,
      portal_level: userPortal,
      action: 'play_attempt',
      ip_address: ipAddress,
      user_agent: userAgent,
      token_used: tokenHash,
      success: true,
    });

    console.log(`[cloudflare-video-token] Token generated successfully for video: ${videoId}`);

    return new Response(
      JSON.stringify({
        success: true,
        embedUrl,
        expiresAt: new Date(Date.now() + expiresIn * 1000).toISOString(),
        videoId,
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('[cloudflare-video-token] Error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate video token',
        message: errorMessage,
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
