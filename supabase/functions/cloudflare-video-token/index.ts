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
  'pre_iniciada': 2,
  'iniciada': 5,
  'oracula': 5,
  'admin': 6,
};

// Base64URL encode helper
function base64UrlEncode(data: string): string {
  return btoa(data)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

// Generate signed token for Cloudflare Stream using HS256
async function generateSignedToken(
  videoId: string,
  signingKey: string,
  expiresInSeconds: number = 21600 // 6 hours default
): Promise<string> {
  const header = {
    alg: "HS256",
    typ: "JWT",
    kid: "default"
  };

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    sub: videoId,
    kid: "default",
    exp: now + expiresInSeconds,
    nbf: now - 60, // Allow 60 seconds clock skew
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signingInput = `${encodedHeader}.${encodedPayload}`;

  // Create HMAC signature using HS256
  const encoder = new TextEncoder();
  const keyData = encoder.encode(signingKey);
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign(
    'HMAC',
    cryptoKey,
    encoder.encode(signingInput)
  );

  const encodedSignature = base64UrlEncode(
    String.fromCharCode(...new Uint8Array(signature))
  );

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
    const CLOUDFLARE_STREAM_SIGNING_KEY = Deno.env.get('CLOUDFLARE_STREAM_SIGNING_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

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

    // Generate signed token (expires in 6 hours)
    const expiresIn = 21600; // 6 hours in seconds
    const signedToken = await generateSignedToken(videoId, CLOUDFLARE_STREAM_SIGNING_KEY, expiresIn);
    const tokenHash = await hashToken(signedToken);

    // Build the manifest URL with signed token (HLS format)
    const manifestUrl = `https://videodelivery.net/${videoId}/manifest/video.m3u8?token=${signedToken}`;

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
        manifestUrl,
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
