import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

// Security: Patterns that indicate prompt injection attempts
const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|above|prior)\s+(instructions?|prompts?|rules?)/i,
  /disregard\s+(all\s+)?(previous|above|prior)\s+(instructions?|prompts?|rules?)/i,
  /forget\s+(all\s+)?(previous|above|prior)\s+(instructions?|prompts?|rules?)/i,
  /you\s+are\s+now\s+(an?\s+)?unrestricted/i,
  /new\s+instructions?:/i,
  /system\s*:\s*/i,
  /\[INST\]/i,
  /\[\/INST\]/i,
  /<\|system\|>/i,
  /<\|user\|>/i,
  /<\|assistant\|>/i,
];

// Security: Maximum lengths for context fields to prevent abuse
const MAX_CONTEXT_PROMPT_LENGTH = 2000;
const MAX_CONTEXT_DATA_SIZE = 5000;
const MAX_MESSAGE_LENGTH = 10000;

/**
 * Sanitize and validate context prompt to prevent injection
 */
function sanitizeContextPrompt(prompt: string | undefined): string {
  if (!prompt || typeof prompt !== 'string') return '';
  
  // Truncate to max length
  let sanitized = prompt.slice(0, MAX_CONTEXT_PROMPT_LENGTH);
  
  // Check for injection patterns
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(sanitized)) {
      console.warn('Potential prompt injection detected in contextPrompt');
      return ''; // Return empty string if injection detected
    }
  }
  
  return sanitized;
}

/**
 * Sanitize context data to prevent injection via JSON
 */
function sanitizeContextData(data: unknown): string {
  if (!data || typeof data !== 'object') return '';
  
  try {
    const jsonStr = JSON.stringify(data);
    
    // Check size limit
    if (jsonStr.length > MAX_CONTEXT_DATA_SIZE) {
      console.warn('Context data exceeds size limit, truncating');
      return JSON.stringify({ note: 'Context data truncated for security' });
    }
    
    // Check for injection patterns in stringified data
    for (const pattern of INJECTION_PATTERNS) {
      if (pattern.test(jsonStr)) {
        console.warn('Potential prompt injection detected in contextData');
        return '';
      }
    }
    
    return jsonStr;
  } catch {
    return '';
  }
}

/**
 * Validate and sanitize user messages
 */
function sanitizeMessages(messages: Array<{ role: string; content: string }>): Array<{ role: string; content: string }> {
  return messages
    .filter(m => m && typeof m.content === 'string' && ['user', 'assistant'].includes(m.role))
    .map(m => ({
      role: m.role,
      content: m.content.slice(0, MAX_MESSAGE_LENGTH),
    }));
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    
    const { messages, context } = await req.json();
    
    // Validate input
    if (!messages || !Array.isArray(messages)) {
      throw new Error('Messages array is required');
    }

    // Sanitize messages
    const sanitizedMessages = sanitizeMessages(messages);
    if (sanitizedMessages.length === 0) {
      throw new Error('No valid messages provided');
    }

    // Check if AI is enabled
    const { data: aiEnabled } = await supabase
      .from('ai_global_settings')
      .select('valor')
      .eq('chave', 'ai_enabled')
      .eq('ativo', true)
      .single();

    if (aiEnabled?.valor === 'false') {
      return new Response(
        JSON.stringify({ content: 'O sistema de IA está temporariamente desativado.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get global system prompt
    const { data: globalPromptData } = await supabase
      .from('ai_global_settings')
      .select('valor')
      .eq('chave', 'global_system_prompt')
      .eq('ativo', true)
      .single();

    const globalPrompt = globalPromptData?.valor || '';

    // Resolve agent
    let agent = null;
    let agentPrompt = '';
    let modelo = 'google/gemini-2.5-flash';
    let temperatura = 0.7;
    let maxTokens = 1024;

    if (context?.agentId) {
      const { data: agentData } = await supabase
        .from('agentes')
        .select('*')
        .eq('id', context.agentId)
        .eq('status', 'ativo')
        .single();

      if (agentData) {
        agent = agentData;
        if (agent.prompt_personalidade) {
          agentPrompt += `\n\n## Personalidade\n${agent.prompt_personalidade}`;
        }
        if (agent.instrucoes_base) {
          agentPrompt += `\n\n## Instruções\n${agent.instrucoes_base}`;
        }
        modelo = agent.modelo_preferido || modelo;
        temperatura = agent.temperatura ?? temperatura;
        maxTokens = agent.max_tokens ?? maxTokens;
      }
    }

    // Build complete system prompt with SANITIZED context
    let systemPrompt = globalPrompt + agentPrompt;

    // Symbolic book listening directive (fallback for clube_livro context)
    if (context?.contextType === 'clube_livro') {
      systemPrompt += `\n\n## Protocolo de Escuta sobre Livros
Quando uma usuária escreve sobre um livro:
1. Identificar:
   - Arquétipo presente na narrativa
   - Emoção dominante
   - Fase da jornada (início, crise, travessia, integração)
2. Responder com:
   - Uma ampliação simbólica (não explicação)
   - Uma pergunta aberta
Exemplo: "Essa imagem aponta para um limiar interno. O que em você ainda não atravessou esse portal?"
Nunca resumir o livro. Nunca dar interpretação fechada.`;
    }
    
    // Add context prompt if provided (SANITIZED)
    const sanitizedContextPrompt = sanitizeContextPrompt(context?.contextPrompt);
    if (sanitizedContextPrompt) {
      systemPrompt += `\n\n## Contexto da Página\n${sanitizedContextPrompt}`;
    }

    // Add context data if provided (SANITIZED)
    const sanitizedContextData = sanitizeContextData(context?.contextData);
    if (sanitizedContextData) {
      systemPrompt += `\n\n## Dados do Contexto\n${sanitizedContextData}`;
    }

    // Prepare messages with system prompt
    const aiMessages = [
      { role: 'system', content: systemPrompt },
      ...sanitizedMessages,
    ];

    const startTime = Date.now();

    // Call Lovable AI Gateway
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: modelo,
        messages: aiMessages,
        temperature: temperatura,
        max_tokens: maxTokens,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const latencyMs = Date.now() - startTime;
    const content = data.choices?.[0]?.message?.content || '';
    const tokensUsed = data.usage?.total_tokens;

    // Log interaction
    if (context?.userId) {
      await supabase.from('ai_interaction_logs').insert({
        user_id: context.userId,
        agente_id: context.agentId || null,
        context_type: context.contextType || null,
        context_id: context.contextId || null,
        input_text: sanitizedMessages[sanitizedMessages.length - 1]?.content || '',
        output_text: content,
        modelo_usado: modelo,
        tokens_used: tokensUsed,
        latency_ms: latencyMs,
        success: true,
      });
    }

    return new Response(
      JSON.stringify({ 
        content,
        tokensUsed,
        modelo,
        latencyMs,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in ai-chat function:', errorMessage);

    return new Response(
      JSON.stringify({ 
        error: 'Erro ao processar mensagem',
        content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.',
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});