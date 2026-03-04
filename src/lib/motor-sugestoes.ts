/**
 * Motor de Sugestões Orácula
 * 
 * Advanced recommendation engine for therapeutic interventions.
 * Scores interventions based on session context and client state.
 * Works independently of Oracle cards or GPS.
 */

// Family-to-district name mapping for oracle card integration
const FAMILY_DISTRICT_MAP: Record<string, string> = {
  TORRES: 'Torres',
  PORTAS: 'Portas',
  'ARQUÉTIPOS': 'Jardim dos Arquétipos',
  SONHOS: 'Casa dos Sonhos',
  LABIRINTOS: 'Labirinto',
  'TRANSFORMAÇÕES': 'Praça da Integração',
};

export interface ScoringContext {
  /** District selected for the session */
  sessionDistrictId?: string | null;
  /** Client's current active district */
  clientDistrictId?: string | null;
  /** Predominant tower key (if any) */
  towerKey?: string | null;
  /** Check-in emotional state */
  checkinState?: string | null;
  /** Active archetype key (if any) */
  archetypeKey?: string | null;
  /** Oracle card used in the session (optional) */
  oracleCard?: { district_id?: string | null; family?: string } | null;
  /** IDs of interventions used in the last session */
  lastSessionInterventionIds?: string[];
  /** Map of intervention_id → usage count across the client journey */
  usageCountMap?: Record<string, number>;
}

export interface ScoredIntervention {
  intervention: any;
  score: number;
  reasons: string[];
}

/**
 * Scores a single intervention based on the session context.
 */
export function scoreIntervention(
  intervention: any,
  ctx: ScoringContext
): ScoredIntervention {
  let score = 0;
  const reasons: string[] = [];

  // +5: district matches session district
  if (ctx.sessionDistrictId && intervention.district_id === ctx.sessionDistrictId) {
    score += 5;
    reasons.push('distrito da sessão');
  }

  // +3: district matches client's current district
  if (ctx.clientDistrictId && intervention.district_id === ctx.clientDistrictId) {
    score += 3;
    reasons.push('distrito atual da cliente');
  }

  // +3: basic level when check-in is unstable
  if (intervention.level === 'basico' && ctx.checkinState === 'instavel') {
    score += 3;
    reasons.push('nível básico + check-in instável');
  }

  // +2: intermediate level when check-in is present
  if (intervention.level === 'intermediario' && ctx.checkinState === 'presente') {
    score += 2;
    reasons.push('nível intermediário + check-in presente');
  }

  // +2: tower match
  if (ctx.towerKey && intervention.tower_key === ctx.towerKey) {
    score += 2;
    reasons.push('torre predominante');
  }

  // +2: archetype match
  if (ctx.archetypeKey && intervention.archetype_key === ctx.archetypeKey) {
    score += 2;
    reasons.push('arquétipo ativo');
  }

  // Oracle card integration (optional)
  if (ctx.oracleCard) {
    // +2 if intervention district matches oracle card district
    if (ctx.oracleCard.district_id && intervention.district_id === ctx.oracleCard.district_id) {
      score += 2;
      reasons.push('distrito da carta oracular');
    }
    // +2 if family maps to a district name that matches
    if (ctx.oracleCard.family) {
      const familyDistrictName = FAMILY_DISTRICT_MAP[ctx.oracleCard.family];
      if (familyDistrictName && intervention.district_name === familyDistrictName) {
        score += 2;
        reasons.push(`família ${ctx.oracleCard.family}`);
      }
    }
  }

  // -2: overused in this journey (>=3 times)
  const usageCount = ctx.usageCountMap?.[intervention.id] || 0;
  if (usageCount >= 3) {
    score -= 2;
    reasons.push('usada frequentemente');
  }

  // -4: used in the last session
  if (ctx.lastSessionInterventionIds?.includes(intervention.id)) {
    score -= 4;
    reasons.push('usada na última sessão');
  }

  return { intervention, score, reasons };
}

/**
 * Ranks all interventions and returns the top N.
 */
export function rankInterventions(
  interventions: any[],
  ctx: ScoringContext,
  topN = 5
): ScoredIntervention[] {
  return interventions
    .map(i => scoreIntervention(i, ctx))
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);
}
