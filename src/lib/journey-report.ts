import { supabase } from '@/integrations/supabase/client';

export interface JourneyReportData {
  cliente: { nome: string; data_inicio: string | null; codigo_interno: string | null };
  terapeuta: { nome: string };
  cartografia: { scores: Record<string, number>; classification: Record<string, string> } | null;
  torres: string[];
  distritos: { nome: string; state: string; sessions_count: number; last_session_at: string | null }[];
  arquetipos: { nome: string; momento: string }[];
  sintese: string;
  chamado: string;
  totalSessoes: number;
  dataGeracao: string;
}

const TERRITORY_LABELS: Record<string, string> = {
  porta_possivel: 'Porta do Possível',
  torre_interna: 'Torre Interna',
  campo_outro: 'Campo do Outro',
  voz_mundo: 'Voz no Mundo',
  porta_abalo: 'Porta do Abalo',
};

export async function gatherReportData(clientId: string, userId: string): Promise<JourneyReportData> {
  // 1. Cliente
  const { data: cliente } = await supabase
    .from('clientes').select('nome, data_inicio, codigo_interno').eq('id', clientId).single();

  // 2. Terapeuta
  const { data: profile } = await supabase
    .from('profiles').select('nome').eq('id', userId).single();

  // 3. Cartografia (latest)
  const { data: carto } = await supabase
    .from('cartographies').select('scores_json, classification_json')
    .eq('client_id', clientId).order('date', { ascending: false }).limit(1);

  const cartografia = carto?.[0] ? {
    scores: (carto[0].scores_json || {}) as Record<string, number>,
    classification: (carto[0].classification_json || {}) as Record<string, string>,
  } : null;

  // 4. Torres (from tower_records)
  const { data: towerRecs } = await supabase
    .from('tower_records').select('tower_name').eq('client_id', clientId).order('created_at', { ascending: false }).limit(5);
  const torres = [...new Set((towerRecs || []).map(t => t.tower_name))].slice(0, 3);

  // 5. Journey districts
  const { data: journeys } = await supabase
    .from('journeys').select('id').eq('client_id', clientId).limit(1);

  let distritosData: JourneyReportData['distritos'] = [];
  if (journeys?.length) {
    const { data: jd } = await supabase
      .from('journey_districts').select('district_id, state, sessions_count, last_session_at')
      .eq('journey_id', journeys[0].id);

    if (jd?.length) {
      const distIds = jd.map(j => j.district_id);
      const { data: dists } = await supabase
        .from('districts').select('id, nome').in('id', distIds);
      const nameMap = Object.fromEntries((dists || []).map(d => [d.id, d.nome]));
      distritosData = jd.map(j => ({
        nome: nameMap[j.district_id] || 'Desconhecido',
        state: j.state,
        sessions_count: j.sessions_count,
        last_session_at: j.last_session_at,
      }));
    }
  }

  // 6. Archetypal profile
  const { data: clienteFull } = await supabase
    .from('clientes').select('archetypal_profile_json').eq('id', clientId).single();

  const archProfile = clienteFull?.archetypal_profile_json as any;
  const arquetipos: JourneyReportData['arquetipos'] = [];
  if (archProfile?.arquetipo_predominante) {
    arquetipos.push({ nome: archProfile.arquetipo_predominante.nome, momento: 'Predominante na jornada atual' });
  }
  if (archProfile?.arquetipo_sombra) {
    arquetipos.push({ nome: archProfile.arquetipo_sombra.nome, momento: 'Em sombra — campo a ser integrado' });
  }

  // 7. Total sessions
  const { count: totalSessoes } = await supabase
    .from('sessions').select('id', { count: 'exact', head: true }).eq('client_id', clientId);

  // 8. Síntese
  const activeDistricts = distritosData.filter(d => d.state !== 'inativo');
  const sintese = buildSintese(activeDistricts, torres, arquetipos, totalSessoes ?? 0);

  // 9. Chamado
  const chamado = archProfile?.chamado_evolutivo || 'Continuar a jornada com presença e escuta.';

  return {
    cliente: { nome: cliente?.nome || '', data_inicio: cliente?.data_inicio, codigo_interno: cliente?.codigo_interno },
    terapeuta: { nome: profile?.nome || '' },
    cartografia,
    torres,
    distritos: distritosData,
    arquetipos,
    sintese,
    chamado,
    totalSessoes: totalSessoes ?? 0,
    dataGeracao: new Date().toISOString(),
  };
}

function buildSintese(
  distritos: JourneyReportData['distritos'],
  torres: string[],
  arquetipos: JourneyReportData['arquetipos'],
  totalSessoes: number,
): string {
  const parts: string[] = [];
  parts.push(`Ao longo de ${totalSessoes} sessão(ões), a cliente atravessou ${distritos.length} distrito(s) da CidaDELA Interior.`);

  if (torres.length > 0) {
    parts.push(`As torres identificadas — ${torres.join(', ')} — revelam padrões de defesa e sustentação.`);
  }

  const integrados = distritos.filter(d => d.state === 'integrado');
  if (integrados.length > 0) {
    parts.push(`${integrados.length} distrito(s) foram integrado(s): ${integrados.map(d => d.nome).join(', ')}.`);
  }

  if (arquetipos.length > 0) {
    parts.push(`O campo arquetípico predominante é ${arquetipos[0].nome}.`);
  }

  return parts.join(' ');
}

export { TERRITORY_LABELS };
