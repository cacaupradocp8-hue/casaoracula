import { supabase } from '@/integrations/supabase/client';
import { adjustSuggestionForVoz } from '@/lib/voz-gps-integration';

export interface GpsSuggestion {
  rule: string;
  distrito_sugerido: string;
  ferramenta_recomendada: string;
  ferramenta_complementar?: string;
  pergunta_clinica: string;
  ritual?: string;
  confianca: number;
  postura: {
    sustentar: string;
    evitar: string;
  };
  carta_simbolica?: {
    id: string;
    nome: string;
    mensagem: string;
  } | null;
}

interface CartographerRule {
  id: string;
  nome: string;
  prioridade: number;
  distrito: string | null;
  arquetipo: string | null;
  torre: string | null;
  porta: string | null;
  fase_jornada: string | null;
  ferramenta_principal_slug: string | null;
  ferramenta_complementar_slug: string | null;
  pergunta: string | null;
  ritual: string | null;
  confianca_base: number | null;
}

/**
 * Match cartographer_rules against the client's current state.
 * Rules are pre-sorted by prioridade DESC from the database.
 */
function matchRules(
  rules: CartographerRule[],
  context: {
    distrito?: string | null;
    torre?: string | null;
    arquetipo?: string | null;
    fase?: string | null;
  },
): { best: CartographerRule | null; alternative: CartographerRule | null } {
  const scored: Array<{ rule: CartographerRule; score: number }> = [];

  for (const r of rules) {
    let score = r.prioridade;
    let matches = 0;

    // Boost score for matching context fields
    if (r.distrito && context.distrito && r.distrito.toLowerCase() === context.distrito.toLowerCase()) {
      matches++;
      score += 30;
    } else if (r.distrito && context.distrito && r.distrito.toLowerCase() !== context.distrito.toLowerCase()) {
      continue; // district mismatch = skip
    }

    if (r.torre && context.torre && r.torre.toLowerCase() === context.torre.toLowerCase()) {
      matches++;
      score += 20;
    } else if (r.torre && context.torre && r.torre.toLowerCase() !== context.torre.toLowerCase()) {
      continue;
    }

    if (r.arquetipo && context.arquetipo && r.arquetipo.toLowerCase() === context.arquetipo.toLowerCase()) {
      matches++;
      score += 15;
    }

    if (r.fase_jornada && context.fase && r.fase_jornada.toLowerCase() === context.fase.toLowerCase()) {
      matches++;
      score += 10;
    }

    // Generic rules (no specific filters) always match but with base score
    if (!r.distrito && !r.torre && !r.arquetipo && !r.fase_jornada) {
      matches = 1; // generic fallback
    }

    if (matches > 0 || (!r.distrito && !r.torre && !r.arquetipo)) {
      scored.push({ rule: r, score });
    }
  }

  scored.sort((a, b) => b.score - a.score);

  return {
    best: scored[0]?.rule || null,
    alternative: scored[1]?.rule || null,
  };
}

async function fetchRandomCard(): Promise<{ id: string; nome: string; mensagem: string } | null> {
  try {
    const { data } = await supabase
      .from('oracle_cards')
      .select('id, nome, mensagem_simbolica')
      .eq('ativa', true)
      .limit(50);

    if (!data || data.length === 0) return null;
    const card = data[Math.floor(Math.random() * data.length)];
    return {
      id: card.id,
      nome: card.nome,
      mensagem: card.mensagem_simbolica || '',
    };
  } catch {
    return null;
  }
}

export async function getGpsSuggestion(
  clientId: string,
  _checkin: string,
  vozAtiva?: string | null,
): Promise<{ suggestion: GpsSuggestion; meta: { currentDistrict: string | null; lastTool: string | null; vozInfluencia: string | null } }> {
  // 1. Load active rules from cartographer_rules
  const { data: rulesData } = await supabase
    .from('cartographer_rules')
    .select('*')
    .eq('ativa', true)
    .order('prioridade', { ascending: false });

  const rules = (rulesData || []) as CartographerRule[];

  // 2. Get client's current city state
  const { data: cityState } = await supabase
    .from('client_city_state')
    .select('distrito_ativo, arquetipo_ativo')
    .eq('client_id', clientId)
    .maybeSingle();

  // 3. Get client's cartografia for torre info
  const { data: clienteData } = await supabase
    .from('clientes')
    .select('cartografia_sessao')
    .eq('id', clientId)
    .single();

  const cartografia = (clienteData as any)?.cartografia_sessao as any;
  const torreFromCartografia = cartografia?.cidadela?.territorio_crescimento || null;

  // 4. Current district and last tool
  const currentDistrict = cityState?.distrito_ativo || null;

  const { data: lastSession } = await supabase
    .from('sessions')
    .select('tool_id')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })
    .limit(1);

  let lastToolName: string | null = null;
  if (lastSession?.[0]?.tool_id) {
    const { data: tool } = await supabase
      .from('tools')
      .select('nome')
      .eq('id', lastSession[0].tool_id)
      .single();
    lastToolName = tool?.nome ?? null;
  }

  // 5. Match rules
  const { best, alternative } = matchRules(rules, {
    distrito: currentDistrict,
    torre: torreFromCartografia,
    arquetipo: null,
    fase: null,
  });

  // 6. Resolve tool names from slugs
  const resolveToolName = async (slug: string | null): Promise<string> => {
    if (!slug) return 'Cartografia Psíquica';
    const { data } = await supabase.from('tools').select('nome').eq('slug', slug).single();
    return data?.nome || slug;
  };

  // 7. Get optional symbolic card
  const carta = await fetchRandomCard();

  if (best) {
    const [ferrPrincipal, ferrComplementar] = await Promise.all([
      resolveToolName(best.ferramenta_principal_slug),
      resolveToolName(best.ferramenta_complementar_slug),
    ]);

    return {
      suggestion: {
        rule: best.nome,
        distrito_sugerido: best.distrito || currentDistrict || 'Portão da Chegada',
        ferramenta_recomendada: ferrPrincipal,
        ferramenta_complementar: best.ferramenta_complementar_slug ? ferrComplementar : undefined,
        pergunta_clinica: best.pergunta || 'O que precisa de atenção agora?',
        ritual: best.ritual || undefined,
        confianca: best.confianca_base || 70,
        postura: {
          sustentar: 'presença e escuta atenta',
          evitar: 'interpretação apressada',
        },
        carta_simbolica: carta,
      },
      meta: { currentDistrict, lastTool: lastToolName },
    };
  }

  // Fallback
  return {
    suggestion: {
      rule: 'exploração-aberta',
      distrito_sugerido: currentDistrict || 'Portão da Chegada',
      ferramenta_recomendada: 'Cartografia Psíquica Orácula',
      pergunta_clinica: 'O que precisa de atenção agora?',
      confianca: 50,
      postura: {
        sustentar: 'presença aberta',
        evitar: 'direcionamento excessivo',
      },
      carta_simbolica: carta,
    },
    meta: { currentDistrict, lastTool: lastToolName },
  };
}
