import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

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

    // Build complete system prompt
    let systemPrompt = globalPrompt + agentPrompt;
    
    // Add context prompt if provided
    if (context?.contextPrompt) {
      systemPrompt += `\n\n## Contexto da Página\n${context.contextPrompt}`;
    }

    // Add context data if provided
    if (context?.contextData) {
      systemPrompt += `\n\n## Dados do Contexto\n${JSON.stringify(context.contextData, null, 2)}`;
    }

    // Prepare messages with system prompt
    const aiMessages = [
      { role: 'system', content: systemPrompt },
      ...messages,
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
        input_text: messages[messages.length - 1]?.content || '',
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
        error: errorMessage,
        content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.',
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
