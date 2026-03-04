import { supabase } from '@/integrations/supabase/client';

export interface ArchetypalProfile {
  arquetipo_predominante: { nome: string; descricao: string };
  arquetipo_sombra: { nome: string; descricao: string };
  movimento_psiquico: string;
  chamado_evolutivo: string;
  pergunta_clinica: string;
  fontes: string[];
  gerado_em: string;
}

interface Scores {
  porta_possivel?: number;
  torre_interna?: number;
  campo_outro?: number;
  voz_mundo?: number;
  porta_abalo?: number;
}

const ARCHETYPES: Record<string, { nome: string; descricao: string; sombra: { nome: string; descricao: string } }> = {
  guardia: {
    nome: 'Guardiã / Estrategista',
    descricao: 'Estrutura, proteção e controle como forma de sobrevivência psíquica.',
    sombra: { nome: 'Controladora Rígida', descricao: 'Quando a proteção se torna prisão e a estrutura impede o fluxo.' },
  },
  curadora: {
    nome: 'Curadora / Sensitiva',
    descricao: 'Sensibilidade profunda, capacidade de acolher a dor e transformá-la.',
    sombra: { nome: 'Mártir Silenciosa', descricao: 'Quando acolher o outro se torna auto-abandono e sacrifício.' },
  },
  cuidadora: {
    nome: 'Cuidadora / Mediadora',
    descricao: 'Conexão relacional, escuta do outro e busca de harmonia.',
    sombra: { nome: 'Codependente', descricao: 'Quando o cuidado do outro substitui o cuidado de si.' },
  },
  visionaria: {
    nome: 'Visionária / Líder',
    descricao: 'Voz própria, coragem criativa e impulso de manifestar no mundo.',
    sombra: { nome: 'Impostora', descricao: 'Quando a voz interior é silenciada pelo medo de ser vista.' },
  },
};

const MOVIMENTOS: Record<string, string> = {
  'Torres': 'Reorganização das estruturas internas — momento de revisão dos padrões de sustentação.',
  'Portas': 'Confronto emocional e travessia — enfrentando o que estava trancado.',
  'Labirinto': 'Confronto emocional e travessia — caminhando pelas portas internas.',
  'Praça do Abalo': 'Atravessar crise — o campo psíquico pede acolhimento e presença.',
  'A Forja': 'Transformação ativa — algo novo está sendo forjado internamente.',
  'Praça da Integração': 'Assimilação e síntese — reunindo os fragmentos da jornada.',
  'Portal de Renascimento': 'Encerramento e passagem — ciclo se completa, novo começo se anuncia.',
  'Casa dos Sonhos': 'Escuta do inconsciente — as imagens noturnas pedem atenção.',
  'Espelho dos Vínculos': 'Espelhamento relacional — o outro como portal de autoconhecimento.',
  'Jardim dos Arquétipos': 'Reconhecimento de forças internas — mapeando os arquétipos vivos.',
  'Conselho Interior': 'Diálogo interno — ouvindo as vozes que habitam o campo psíquico.',
  'Portão da Chegada': 'Início da jornada — abertura do campo e primeiro contato.',
};

function classifyScores(scores: Scores): string | null {
  const entries: [string, number][] = [
    ['torre_interna', scores.torre_interna ?? 0],
    ['porta_abalo', scores.porta_abalo ?? 0],
    ['campo_outro', scores.campo_outro ?? 0],
    ['voz_mundo', scores.voz_mundo ?? 0],
  ];
  const sorted = entries.sort((a, b) => b[1] - a[1]);
  const top = sorted[0];
  if (top[1] < 40) return null;

  switch (top[0]) {
    case 'torre_interna': return 'guardia';
    case 'porta_abalo': return 'curadora';
    case 'campo_outro': return 'cuidadora';
    case 'voz_mundo': return 'visionaria';
    default: return null;
  }
}

function getShadowKey(primary: string): string {
  const keys = Object.keys(ARCHETYPES).filter(k => k !== primary);
  // Shadow = lowest scoring archetype mapping
  return keys[keys.length - 1] || 'guardia';
}

export async function generateArchetypalProfile(clientId: string): Promise<ArchetypalProfile> {
  const fontes: string[] = [];

  // 1. Cartography scores
  const { data: carto } = await supabase
    .from('cartographies')
    .select('scores_json, classification_json')
    .eq('client_id', clientId)
    .order('date', { ascending: false })
    .limit(1);

  let scores: Scores = {};
  if (carto?.[0]) {
    const s = (carto[0].scores_json || {}) as Record<string, number>;
    const c = (carto[0].classification_json || {}) as Record<string, string>;
    const toNum = (key: string) => {
      if (c[key] === 'alto') return s[key] ?? 80;
      if (c[key] === 'baixo') return s[key] ?? 20;
      return s[key] ?? 50;
    };
    scores = {
      porta_possivel: toNum('porta_possivel'),
      torre_interna: toNum('torre_interna'),
      campo_outro: toNum('campo_outro'),
      voz_mundo: toNum('voz_mundo'),
      porta_abalo: toNum('porta_abalo'),
    };
    fontes.push('Cartografia Psíquica');
  }

  // 2. Current district
  const { data: journeys } = await supabase
    .from('journeys').select('current_district_id').eq('client_id', clientId).limit(1);

  let districtName = 'Portão da Chegada';
  if (journeys?.[0]?.current_district_id) {
    const { data: dist } = await supabase
      .from('districts').select('nome').eq('id', journeys[0].current_district_id).single();
    if (dist) { districtName = dist.nome; fontes.push('Jornada/Distrito'); }
  }

  // 3. Dreams count
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 30);
  const { count: dreamCount } = await supabase
    .from('dreams').select('id', { count: 'exact', head: true })
    .eq('client_id', clientId).gte('date', sevenDaysAgo.toISOString().split('T')[0]);
  if ((dreamCount ?? 0) > 0) fontes.push('Sonhos recentes');

  // 4. Labyrinth records
  const { count: labCount } = await supabase
    .from('labyrinth_records').select('id', { count: 'exact', head: true })
    .eq('client_id', clientId);
  if ((labCount ?? 0) > 0) fontes.push('Labirinto das Portas');

  // 5. Sessions
  const { count: sessCount } = await supabase
    .from('sessions').select('id', { count: 'exact', head: true })
    .eq('client_id', clientId);
  if ((sessCount ?? 0) > 0) fontes.push('Sessões');

  // Derive archetype
  const primaryKey = classifyScores(scores) || 'guardia';
  const primary = ARCHETYPES[primaryKey];

  // Shadow = archetype from lowest score
  const scoreEntries: [string, number][] = [
    ['torre_interna', scores.torre_interna ?? 50],
    ['porta_abalo', scores.porta_abalo ?? 50],
    ['campo_outro', scores.campo_outro ?? 50],
    ['voz_mundo', scores.voz_mundo ?? 50],
  ];
  const lowest = scoreEntries.sort((a, b) => a[1] - b[1])[0][0];
  const shadowKeyMap: Record<string, string> = {
    torre_interna: 'guardia', porta_abalo: 'curadora',
    campo_outro: 'cuidadora', voz_mundo: 'visionaria',
  };
  const shadowKey = shadowKeyMap[lowest] || 'curadora';
  const shadow = ARCHETYPES[shadowKey === primaryKey ? 'curadora' : shadowKey];

  // Movimento
  const movimento = MOVIMENTOS[districtName] || 'Início da jornada — campo aberto para exploração.';

  // Chamado evolutivo
  const chamados: Record<string, string> = {
    guardia: 'Soltar o controle para encontrar a confiança.',
    curadora: 'Acolher a própria dor antes de acolher a do outro.',
    cuidadora: 'Devolver ao outro o que é do outro.',
    visionaria: 'Dar voz ao que quer nascer, sem esperar permissão.',
  };

  // Pergunta
  const perguntas: Record<string, string> = {
    guardia: 'O que aconteceria se você soltasse o controle, mesmo que por um instante?',
    curadora: 'O que em você precisa ser acolhido antes de acolher o outro?',
    cuidadora: 'De quem é a dor que você está carregando?',
    visionaria: 'O que impede sua voz de ocupar o espaço que é seu?',
  };

  const profile: ArchetypalProfile = {
    arquetipo_predominante: { nome: primary.nome, descricao: primary.descricao },
    arquetipo_sombra: { nome: shadow.sombra.nome, descricao: shadow.sombra.descricao },
    movimento_psiquico: movimento,
    chamado_evolutivo: chamados[primaryKey],
    pergunta_clinica: perguntas[primaryKey],
    fontes,
    gerado_em: new Date().toISOString(),
  };

  // Save to DB
  const { data: existing } = await supabase
    .from('clientes').select('archetypal_profile_json, archetypal_profile_history')
    .eq('id', clientId).single();

  const history = Array.isArray(existing?.archetypal_profile_history) 
    ? existing.archetypal_profile_history : [];
  if (existing?.archetypal_profile_json) {
    history.push(existing.archetypal_profile_json);
  }
  // Keep last 10 versions
  const trimmed = history.slice(-10);

  await supabase.from('clientes').update({
    archetypal_profile_json: profile as any,
    archetypal_profile_history: trimmed as any,
  } as any).eq('id', clientId);

  return profile;
}
