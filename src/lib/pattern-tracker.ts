import { supabase } from '@/integrations/supabase/client';

/**
 * Tracks a pattern occurrence for a client.
 * Uses the upsert_pattern_stat RPC to increment counters.
 */
export async function trackPattern(
  clientId: string,
  patternType: 'district' | 'tower' | 'oracle_card' | 'intervention' | 'archetype' | 'tool',
  patternName: string
) {
  if (!patternName || !clientId) return;

  const { error } = await supabase.rpc('upsert_pattern_stat', {
    _client_id: clientId,
    _pattern_type: patternType,
    _pattern_name: patternName,
  });

  if (error) {
    console.error('Pattern tracking error:', error);
  }
}

/**
 * Track all patterns from a session at once.
 */
export async function trackSessionPatterns(
  clientId: string,
  session: {
    districtName?: string;
    towerName?: string;
    oracleCardName?: string;
    interventionName?: string;
    archetypeName?: string;
    toolName?: string;
  }
) {
  const promises: Promise<void>[] = [];

  if (session.districtName) {
    promises.push(trackPattern(clientId, 'district', session.districtName));
  }
  if (session.towerName) {
    promises.push(trackPattern(clientId, 'tower', session.towerName));
  }
  if (session.oracleCardName) {
    promises.push(trackPattern(clientId, 'oracle_card', session.oracleCardName));
  }
  if (session.interventionName) {
    promises.push(trackPattern(clientId, 'intervention', session.interventionName));
  }
  if (session.archetypeName) {
    promises.push(trackPattern(clientId, 'archetype', session.archetypeName));
  }
  if (session.toolName) {
    promises.push(trackPattern(clientId, 'tool', session.toolName));
  }

  await Promise.all(promises);
}

/**
 * Get patterns with high occurrence for GPS integration.
 * Returns patterns with 3+ occurrences for priority suggestions.
 */
export async function getRecurringPatterns(clientId: string) {
  const { data } = await supabase
    .from('client_pattern_stats')
    .select('*')
    .eq('client_id', clientId)
    .gte('occurrence_count', 3)
    .order('occurrence_count', { ascending: false });

  return (data || []) as Array<{
    pattern_type: string;
    pattern_name: string;
    occurrence_count: number;
  }>;
}
