import { supabase } from '@/integrations/supabase/client';

export interface GpsSuggestion {
  rule: string;
  distrito_sugerido: string;
  ferramenta_recomendada: string;
  pergunta_clinica: string;
  postura: {
    sustentar: string;
    evitar: string;
  };
}

interface CartographyScores {
  porta_possivel: number;
  torre_interna: number;
  campo_outro: number;
  voz_mundo: number;
  porta_abalo: number;
}

const HIGH_THRESHOLD = 65;
const LOW_THRESHOLD = 40;

function isHigh(v: number | undefined) { return (v ?? 0) >= HIGH_THRESHOLD; }
function isLow(v: number | undefined) { return (v ?? 0) <= LOW_THRESHOLD; }

function applyRules(
  scores: CartographyScores | null,
  hasRecentDream: boolean,
  currentDistrictName: string | null,
): GpsSuggestion {
  // R0 — sonho recente
  if (hasRecentDream) {
    return {
      rule: 'R0',
      distrito_sugerido: 'Casa dos Sonhos',
      ferramenta_recomendada: 'Decodificação Onírica',
      pergunta_clinica: 'Que imagem do sonho ainda habita você?',
      postura: { sustentar: 'escuta imagética, acolhimento', evitar: 'interpretação apressada' },
    };
  }

  if (scores) {
    // R1 — Porta do Abalo alta
    if (isHigh(scores.porta_abalo)) {
      return {
        rule: 'R1',
        distrito_sugerido: 'Praça do Abalo',
        ferramenta_recomendada: 'Labirinto das 39 Portas',
        pergunta_clinica: 'O que dentro de você pede acolhimento neste momento?',
        postura: { sustentar: 'presença silenciosa, continência', evitar: 'racionalização do sofrimento' },
      };
    }

    // R2 — Torre Interna alta + Porta do Possível baixa
    if (isHigh(scores.torre_interna) && isLow(scores.porta_possivel)) {
      return {
        rule: 'R2',
        distrito_sugerido: 'Torres',
        ferramenta_recomendada: 'Torre Viva',
        pergunta_clinica: 'O que em você acredita que precisa manter tudo sob controle?',
        postura: { sustentar: 'presença, curiosidade', evitar: 'confronto prematuro' },
      };
    }

    // R3 — Campo do Outro alto + Voz no Mundo baixa
    if (isHigh(scores.campo_outro) && isLow(scores.voz_mundo)) {
      return {
        rule: 'R3',
        distrito_sugerido: 'Espelho dos Vínculos',
        ferramenta_recomendada: 'Atlas de Arquétipos',
        pergunta_clinica: 'O que nesta relação revela algo sobre você?',
        postura: { sustentar: 'espelhamento empático', evitar: 'julgamento relacional' },
      };
    }

    // R4 — Voz no Mundo alta + Torre Interna baixa
    if (isHigh(scores.voz_mundo) && isLow(scores.torre_interna)) {
      return {
        rule: 'R4',
        distrito_sugerido: 'A Forja',
        ferramenta_recomendada: 'Ritual Simbólico',
        pergunta_clinica: 'Que verdade sua quer nascer no mundo?',
        postura: { sustentar: 'encorajamento simbólico', evitar: 'pressa de concretizar' },
      };
    }
  }

  // Fallback
  return {
    rule: 'fallback',
    distrito_sugerido: currentDistrictName || 'Portão da Chegada',
    ferramenta_recomendada: 'Cartografia Psíquica',
    pergunta_clinica: 'O que precisa de atenção agora?',
    postura: { sustentar: 'presença aberta', evitar: 'direcionamento excessivo' },
  };
}

export async function getGpsSuggestion(
  clientId: string,
  _checkin: string,
): Promise<{ suggestion: GpsSuggestion; meta: { currentDistrict: string | null; lastTool: string | null } }> {
  // 1. Latest cartography scores
  const { data: carto } = await supabase
    .from('cartographies')
    .select('scores_json, classification_json')
    .eq('client_id', clientId)
    .order('date', { ascending: false })
    .limit(1);

  const scores: CartographyScores | null = carto?.[0]?.classification_json
    ? (() => {
        const c = carto[0].classification_json as Record<string, string>;
        const s = (carto[0].scores_json || {}) as Record<string, number>;
        // Map classification labels to numeric thresholds for rule matching
        const toNum = (key: string) => {
          if (c[key] === 'alto') return s[key] ?? 80;
          if (c[key] === 'baixo') return s[key] ?? 20;
          return s[key] ?? 50;
        };
        return {
          porta_possivel: toNum('porta_possivel'),
          torre_interna: toNum('torre_interna'),
          campo_outro: toNum('campo_outro'),
          voz_mundo: toNum('voz_mundo'),
          porta_abalo: toNum('porta_abalo'),
        };
      })()
    : null;

  // 2. Recent dream (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const { count: dreamCount } = await supabase
    .from('dreams')
    .select('id', { count: 'exact', head: true })
    .eq('client_id', clientId)
    .gte('date', sevenDaysAgo.toISOString().split('T')[0]);

  const hasRecentDream = (dreamCount ?? 0) > 0;

  // 3. Current district from journey
  const { data: journeys } = await supabase
    .from('journeys')
    .select('current_district_id')
    .eq('client_id', clientId)
    .limit(1);

  let currentDistrictName: string | null = null;
  if (journeys?.[0]?.current_district_id) {
    const { data: dist } = await supabase
      .from('districts')
      .select('nome')
      .eq('id', journeys[0].current_district_id)
      .single();
    currentDistrictName = dist?.nome ?? null;
  }

  // 4. Last tool used
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

  const suggestion = applyRules(scores, hasRecentDream, currentDistrictName);

  return {
    suggestion,
    meta: {
      currentDistrict: currentDistrictName,
      lastTool: lastToolName,
    },
  };
}
