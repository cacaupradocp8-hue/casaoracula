import { supabase } from '@/integrations/supabase/client';

// District → symbolic movement mapping
const DISTRICT_MOVEMENTS: Record<string, string> = {
  'torres': 'A cliente parece atravessar um momento de reorganização das estruturas internas.',
  'portas': 'A cliente parece estar em um processo de abertura emocional.',
  'praca_do_abalo': 'A cliente parece estar atravessando uma crise ou abalo profundo.',
  'casa_dos_sonhos': 'A cliente parece estar em um momento de escuta do inconsciente.',
  'espelho_dos_vinculos': 'A cliente parece estar em um processo de revisão de relações.',
  'a_forja': 'A cliente parece estar em um momento de transformação ativa.',
  'labirinto': 'Padrões repetitivos parecem estar emergindo na jornada da cliente.',
  'praca_da_integracao': 'A cliente parece estar em um momento de assimilação de aprendizados.',
  'portal_de_renascimento': 'A cliente parece estar passando para uma nova etapa em sua jornada.',
  'jardim_dos_arquetipos': 'A cliente parece estar em contato com forças simbólicas profundas.',
  'portao_da_chegada': 'A cliente parece estar no início de uma nova travessia.',
  'conselho_interior': 'A cliente parece estar em diálogo com suas vozes internas.',
};

// Shadow archetype mapping based on tower patterns
const TOWER_SHADOW_MAP: Record<string, { archetype: string; description: string }> = {
  'controle': { archetype: 'A Sobrevivente', description: 'Parte que mantém estratégias de sobrevivência mesmo quando o perigo já passou.' },
  'perfeccionismo': { archetype: 'A Estrategista', description: 'Parte que organiza excessivamente para evitar vulnerabilidade.' },
  'silencio': { archetype: 'A Sensitiva', description: 'Parte que se recolhe em excesso para se proteger do campo emocional.' },
  'performance': { archetype: 'A Criadora', description: 'Parte que precisa produzir para se sentir válida.' },
  'negacao': { archetype: 'A Visionária', description: 'Parte que foge da realidade presente em busca de um futuro idealizado.' },
  'vitimizacao': { archetype: 'A Curadora', description: 'Parte que cuida dos outros para evitar cuidar de si.' },
};

// Evolutionary calls based on archetype combinations
const EVOLUTION_CALLS: Record<string, string[]> = {
  'A Guardiã': ['Transformar proteção em presença.', 'Permitir que o cuidado se torne leveza.'],
  'A Visionária': ['Ancorar a visão no corpo e no presente.', 'Deixar que o sonho ganhe forma concreta.'],
  'A Curadora': ['Incluir a si mesma no círculo de cuidado.', 'Permitir ser cuidada antes de cuidar.'],
  'A Selvagem': ['Dar espaço ao instinto sem perder o chão.', 'Honrar a liberdade como presença, não fuga.'],
  'A Tecelã': ['Soltar os fios que não são seus.', 'Tecer a própria história antes de unir outras.'],
  'A Exploradora': ['Encontrar profundidade na permanência.', 'Explorar as raízes, não apenas os horizontes.'],
  'A Mediadora': ['Permitir o conflito como caminho de verdade.', 'Mediar consigo mesma antes de mediar o mundo.'],
  'A Estrategista': ['Permitir que o corpo guie além do plano.', 'Deixar espaço para o inesperado.'],
  'A Sensitiva': ['Transformar sensibilidade em discernimento.', 'Dar voz ao que a percepção revela.'],
  'A Criadora': ['Criar sem a necessidade de aprovação.', 'Permitir a imperfeição como expressão.'],
  'A Sobrevivente': ['Reconhecer que sobreviver já foi suficiente.', 'Dar espaço para viver além da sobrevivência.'],
  'A Mestra': ['Escutar a sabedoria sem impor direção.', 'Permitir não saber como forma de mestria.'],
};

// Clinical question templates
const CLINICAL_QUESTIONS: Record<string, string> = {
  'A Guardiã': 'O que dentro de você pede espaço para existir sem precisar se proteger tanto?',
  'A Visionária': 'Que possibilidade quer nascer, e o que impede que ela se enraíze no presente?',
  'A Curadora': 'De que cuidado você mesma está precisando e ainda não se permitiu receber?',
  'A Selvagem': 'Que parte selvagem sua deseja viver com mais liberdade — e o que a contém?',
  'A Tecelã': 'Que fios da sua história precisam ser soltos para que novos possam ser tecidos?',
  'A Exploradora': 'O que você encontraria se parasse de buscar e simplesmente ficasse?',
  'A Mediadora': 'Que conflito interior está pedindo que você pare de mediar e comece a sentir?',
  'A Estrategista': 'O que aconteceria se você permitisse algo que não foi planejado?',
  'A Sensitiva': 'O que sua sensibilidade está percebendo que você ainda não deu nome?',
  'A Criadora': 'O que em você quer ser criado, mas ainda espera permissão?',
  'A Sobrevivente': 'Que parte sua aprendeu a sobreviver e ainda não sabe que pode viver?',
  'A Mestra': 'Que sabedoria sua deseja ser escutada sem precisar ensinar ninguém?',
};

export interface ArchetypalProfile {
  dominantArchetype: { name: string; description: string; count: number } | null;
  shadowArchetype: { name: string; description: string } | null;
  psychicMovement: string | null;
  evolutionCall: string | null;
  clinicalQuestion: string | null;
  sourceData: {
    archetypeCounts: Record<string, number>;
    activeDistricts: string[];
    towerPatterns: string[];
    totalSessions: number;
  };
}

export async function generateArchetypalProfile(clientId: string): Promise<ArchetypalProfile> {
  // 1. Fetch archetype occurrences from session_archetypes
  const { data: sessionArchetypes } = await supabase
    .from('session_archetypes')
    .select('archetype_id')
    .eq('client_id', clientId);

  // Fetch archetype details separately
  const { data: allArchetypes } = await supabase
    .from('atlas_arquetipos_femininos')
    .select('id, nome, descricao_clinica')
    .eq('ativo', true);

  const archetypeMap = new Map((allArchetypes || []).map(a => [a.id, a]));

  // 2. Fetch pattern stats (archetypes tracked)
  const { data: patternStats } = await supabase
    .from('client_pattern_stats')
    .select('*')
    .eq('client_id', clientId);

  // 3. Fetch sessions for district data
  const { data: sessions } = await supabase
    .from('sessions')
    .select('district_id, tool, created_at')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })
    .limit(20);

  // 4. Fetch journey districts
  const { data: journeyDistricts } = await supabase
    .from('journey_districts' as any)
    .select('district_id, status')
    .eq('client_id', clientId);

  // Count archetype frequencies
  const archetypeCounts: Record<string, number> = {};
  const archetypeDescriptions: Record<string, string> = {};

  // From session_archetypes
  sessionArchetypes?.forEach((sa: any) => {
    const arch = archetypeMap.get(sa.archetype_id);
    if (arch) {
      archetypeCounts[arch.nome] = (archetypeCounts[arch.nome] || 0) + 1;
      archetypeDescriptions[arch.nome] = arch.descricao_clinica || '';
    }
  });

  // From pattern stats (archetype type)
  patternStats?.filter(p => p.pattern_type === 'archetype').forEach(p => {
    archetypeCounts[p.pattern_name] = (archetypeCounts[p.pattern_name] || 0) + p.occurrence_count;
  });

  // DOMINANT ARCHETYPE
  let dominantArchetype: ArchetypalProfile['dominantArchetype'] = null;
  const sortedArchetypes = Object.entries(archetypeCounts).sort(([, a], [, b]) => b - a);
  if (sortedArchetypes.length > 0) {
    const [name, count] = sortedArchetypes[0];
    dominantArchetype = {
      name,
      description: archetypeDescriptions[name] || getDefaultDescription(name),
      count,
    };
  }

  // SHADOW ARCHETYPE
  let shadowArchetype: ArchetypalProfile['shadowArchetype'] = null;
  const towerPatterns = patternStats
    ?.filter(p => p.pattern_type === 'tower' && p.occurrence_count >= 2)
    .sort((a, b) => b.occurrence_count - a.occurrence_count) || [];

  if (towerPatterns.length > 0) {
    const topTower = towerPatterns[0].pattern_name.toLowerCase();
    const mapped = Object.entries(TOWER_SHADOW_MAP).find(([key]) => topTower.includes(key));
    if (mapped) {
      shadowArchetype = { name: mapped[1].archetype, description: mapped[1].description };
    } else {
      // Fallback: use least frequent archetype as shadow
      if (sortedArchetypes.length > 1) {
        const [name] = sortedArchetypes[sortedArchetypes.length - 1];
        shadowArchetype = { name, description: `Parte menos integrada que pode estar operando na sombra.` };
      }
    }
  } else if (sortedArchetypes.length > 1) {
    const [name] = sortedArchetypes[sortedArchetypes.length - 1];
    shadowArchetype = { name, description: 'Força menos ativa que pode conter potencial inexplorado.' };
  }

  // PSYCHIC MOVEMENT
  let psychicMovement: string | null = null;
  const activeDistricts = (journeyDistricts as any[] || [])
    .filter((jd: any) => jd.status === 'ativo')
    .map((jd: any) => jd.district_id || '');

  if (activeDistricts.length > 0) {
    const primaryDistrict = activeDistricts[0];
    psychicMovement = DISTRICT_MOVEMENTS[primaryDistrict] || 
      `A cliente parece estar em movimento no distrito ${primaryDistrict}.`;
  } else if (sessions && sessions.length > 0) {
    // Fallback: use most recent session's district
    const recentDistrict = (sessions[0] as any).district_id;
    if (recentDistrict) {
      psychicMovement = 'A cliente apresenta movimentos recentes em sua jornada interior.';
    }
  }

  // EVOLUTION CALL
  let evolutionCall: string | null = null;
  if (dominantArchetype) {
    const calls = EVOLUTION_CALLS[dominantArchetype.name];
    if (calls) {
      evolutionCall = calls[Math.floor(Math.random() * calls.length)];
    }
  }

  // CLINICAL QUESTION
  let clinicalQuestion: string | null = null;
  if (dominantArchetype) {
    clinicalQuestion = CLINICAL_QUESTIONS[dominantArchetype.name] || null;
  }

  return {
    dominantArchetype,
    shadowArchetype,
    psychicMovement,
    evolutionCall,
    clinicalQuestion,
    sourceData: {
      archetypeCounts,
      activeDistricts,
      towerPatterns: towerPatterns.map(t => t.pattern_name),
      totalSessions: sessions?.length || 0,
    },
  };
}

export async function saveProfileSnapshot(clientId: string, profile: ArchetypalProfile) {
  const { error } = await supabase
    .from('archetypal_profile_snapshots')
    .insert({
      client_id: clientId,
      dominant_archetype: profile.dominantArchetype?.name || null,
      shadow_archetype: profile.shadowArchetype?.name || null,
      psychic_movement: profile.psychicMovement,
      evolution_call: profile.evolutionCall,
      clinical_question: profile.clinicalQuestion,
      source_data_json: profile.sourceData as any,
    });
  if (error) throw error;
}

function getDefaultDescription(name: string): string {
  const map: Record<string, string> = {
    'A Guardiã': 'Força psíquica voltada à proteção do que é precioso.',
    'A Visionária': 'Capacidade de imaginar novos caminhos.',
    'A Curadora': 'Cuidado e regeneração emocional.',
    'A Selvagem': 'Instinto, liberdade e autenticidade.',
    'A Tecelã': 'Conexão entre histórias e significados.',
    'A Exploradora': 'Busca por novos territórios internos e externos.',
    'A Mediadora': 'Construção de pontes entre pessoas ou partes internas.',
    'A Estrategista': 'Inteligência organizadora e visão estrutural.',
    'A Sensitiva': 'Percepção profunda do campo emocional.',
    'A Criadora': 'Expressão e manifestação de ideias no mundo.',
    'A Sobrevivente': 'Resiliência diante de adversidades.',
    'A Mestra': 'Sabedoria integradora da jornada.',
  };
  return map[name] || 'Força simbólica em movimento.';
}
