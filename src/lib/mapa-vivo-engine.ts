/**
 * Mapa Vivo da Psique — Motor de Detecção de Padrões
 * 
 * Analisa sessões, sonhos, e dados do labirinto para gerar pattern flags.
 * Usa linguagem de hipótese (nunca diagnóstica).
 */

export type FlagType = 'district_recurrence' | 'door_recurrence' | 'tower_recurrence' | 'loop_detected' | 'abalo_persistente' | 'integration_signal' | 'conduction_risk';
export type Severity = 'low' | 'medium' | 'high';

export interface PatternFlag {
  flag_type: FlagType;
  title: string;
  message: string;
  severity: Severity;
  supporting_data: Record<string, any>;
  suggestions?: string[];
}

export interface NextStepSuggestion {
  distrito_sugerido: string;
  ferramenta: string;
  pergunta_clinica: string;
  micro_ritual: string;
}

interface SessionData {
  id: string;
  date: string;
  district_id: string | null;
  district_name?: string | null;
  tool_id: string | null;
  checkin_state: string | null;
  oracle_card_id: string | null;
  insight: string | null;
}

interface DistrictFrequency {
  district_id: string;
  name: string;
  count: number;
}

// ─── RULE A: District recurrence ───
function detectDistrictRecurrence(sessions: SessionData[]): PatternFlag[] {
  const last5 = sessions.slice(0, 5);
  const freq: Record<string, { count: number; name: string }> = {};
  
  last5.forEach(s => {
    if (s.district_id) {
      if (!freq[s.district_id]) freq[s.district_id] = { count: 0, name: s.district_name || s.district_id };
      freq[s.district_id].count++;
    }
  });

  const flags: PatternFlag[] = [];
  Object.entries(freq).forEach(([id, data]) => {
    if (data.count >= 3) {
      flags.push({
        flag_type: 'district_recurrence',
        title: 'Distrito predominante do ciclo atual',
        message: `Há um movimento de retorno ao Distrito ${data.name}. Isso pode indicar um ciclo de trabalho em curso.`,
        severity: 'medium',
        supporting_data: { district_id: id, district_name: data.name, count: data.count, window: 'last_5' },
      });
    }
  });
  return flags;
}

// ─── RULE B: Door recurrence ───
function detectDoorRecurrence(labyrinthRecords: any[]): PatternFlag[] {
  const last5 = labyrinthRecords.slice(0, 5);
  const doorFreq: Record<string, number> = {};

  last5.forEach(r => {
    const door = r.crossing || r.emotional_field;
    if (door) {
      doorFreq[door] = (doorFreq[door] || 0) + 1;
    }
  });

  const flags: PatternFlag[] = [];
  Object.entries(doorFreq).forEach(([door, count]) => {
    if (count >= 2) {
      flags.push({
        flag_type: 'door_recurrence',
        title: 'Porta insistente',
        message: `Uma Porta insiste (${door}). Isso pode apontar para algo que pede presença, não pressa.`,
        severity: 'medium',
        supporting_data: { door, count },
      });
    }
  });
  return flags;
}

// ─── RULE C: Tower recurrence ───
function detectTowerRecurrence(sessions: SessionData[], cartographyData: any[]): PatternFlag[] {
  // Use cartography data if available for tower info
  const towerFreq: Record<string, number> = {};
  const total = Math.min(sessions.length, 10);
  
  // Check sessions for tower patterns from GPS suggestion data
  sessions.slice(0, 10).forEach(s => {
    // Tower info might come from gps_suggestion or other fields
    // For now, we rely on cartography data
  });

  // Use cartography tower data
  cartographyData.forEach(c => {
    const scores = c.scores_json || {};
    // Find highest scoring territory as "tower"
    let maxKey = '';
    let maxVal = 0;
    Object.entries(scores).forEach(([k, v]) => {
      if (typeof v === 'number' && v > maxVal) {
        maxVal = v;
        maxKey = k;
      }
    });
    if (maxKey) {
      towerFreq[maxKey] = (towerFreq[maxKey] || 0) + 1;
    }
  });

  const flags: PatternFlag[] = [];
  if (total > 0) {
    Object.entries(towerFreq).forEach(([tower, count]) => {
      if (count / Math.max(cartographyData.length, 1) >= 0.6) {
        flags.push({
          flag_type: 'tower_recurrence',
          title: 'Estrutura de proteção dominante',
          message: `A Torre ${tower} aparece com frequência. Isso pode sugerir uma defesa central sustentando o campo.`,
          severity: 'medium',
          supporting_data: { tower, count, total: cartographyData.length },
        });
      }
    });
  }
  return flags;
}

// ─── RULE D: Abalo persistente ───
function detectAbaloPersistente(
  sessions: SessionData[],
  districtNames: Record<string, string>,
  daysWindow = 14
): PatternFlag[] {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - daysWindow);

  // Find "Praça do Abalo" district
  const abaloDistrictId = Object.entries(districtNames).find(([, name]) =>
    name.toLowerCase().includes('abalo')
  )?.[0];

  if (!abaloDistrictId) return [];

  const recentSessions = sessions.filter(s => new Date(s.date) >= cutoff);
  const abaloCount = recentSessions.filter(s => s.district_id === abaloDistrictId).length;

  // Check if integration happened in last 3 sessions
  const integracaoDistrictId = Object.entries(districtNames).find(([, name]) =>
    name.toLowerCase().includes('integração')
  )?.[0];

  const last3 = sessions.slice(0, 3);
  const hasIntegration = last3.some(s => s.district_id === integracaoDistrictId);

  if (abaloCount >= 3 || (abaloCount >= 2 && !hasIntegration)) {
    return [{
      flag_type: 'abalo_persistente',
      title: 'Abalo persistente — cuidado com estabilização',
      message: 'Há sinais de Abalo sustentado. Pode ser útil priorizar estabilização e integração antes de aprofundar.',
      severity: 'high',
      supporting_data: { abalo_count: abaloCount, days: daysWindow, has_recent_integration: hasIntegration },
      suggestions: [
        'Respiração de acolhimento / grounding',
        'Escrita simbólica leve',
        'Ritual de fechamento',
      ],
    }];
  }
  return [];
}

// ─── RULE E: Integration signal ───
function detectIntegrationSignal(
  sessions: SessionData[],
  journeyDistricts: any[],
  districtNames: Record<string, string>
): PatternFlag[] {
  const integrated = journeyDistricts.filter(jd => jd.state === 'integrado');
  const flags: PatternFlag[] = [];

  integrated.forEach(jd => {
    const last3 = sessions.slice(0, 3);
    const reappeared = last3.some(s => s.district_id === jd.district_id);
    if (!reappeared) {
      const name = districtNames[jd.district_id] || jd.district_id;
      flags.push({
        flag_type: 'integration_signal',
        title: 'Integração estabilizada',
        message: `Há sinais de integração consolidada no distrito ${name}. Pode indicar um assentamento da travessia.`,
        severity: 'low',
        supporting_data: { district_id: jd.district_id, district_name: name },
      });
    }
  });
  return flags;
}

// ─── RULE F: Loop detection ───
function detectLoop(sessions: SessionData[]): PatternFlag[] {
  const last6 = sessions.slice(0, 6).map(s => s.district_id).filter(Boolean);
  if (last6.length < 6) return [];

  // Check if first 3 equal last 3
  const first3 = last6.slice(0, 3).join(',');
  const second3 = last6.slice(3, 6).join(',');

  if (first3 === second3) {
    const names = last6.slice(0, 3);
    return [{
      flag_type: 'loop_detected',
      title: 'Ciclo de travessia (loop)',
      message: `Parece haver um retorno em sequência (${names.join('→')}). Isso pode indicar um loop de proteção/abalo/silêncio.`,
      severity: 'medium',
      supporting_data: { sequence: last6 },
    }];
  }
  return [];
}

// ─── RULE G: Conduction risks ───
function detectConductionRisks(
  sessions: SessionData[],
  districtNames: Record<string, string>
): PatternFlag[] {
  const flags: PatternFlag[] = [];

  const integracaoIds = Object.entries(districtNames)
    .filter(([, n]) => n.toLowerCase().includes('integração') || n.toLowerCase().includes('renascimento'))
    .map(([id]) => id);

  const portasIds = Object.entries(districtNames)
    .filter(([, n]) => n.toLowerCase().includes('portas') || n.toLowerCase().includes('labirinto'))
    .map(([id]) => id);

  // Too much exploration without integration
  const last6 = sessions.slice(0, 6);
  const hasIntegration = last6.some(s => s.district_id && integracaoIds.includes(s.district_id));
  if (last6.length >= 6 && !hasIntegration) {
    flags.push({
      flag_type: 'conduction_risk',
      title: 'Muita exploração sem integração',
      message: 'Nenhum distrito de integração ou renascimento aparece nas últimas 6 sessões. Pode ser útil considerar um movimento de assentamento.',
      severity: 'medium',
      supporting_data: { window: 6 },
    });
  }

  // Many doors without closure
  const last4 = sessions.slice(0, 4);
  const doorSessions = last4.filter(s => s.district_id && portasIds.includes(s.district_id));
  const hasRitual = last4.some(s => s.district_id && integracaoIds.includes(s.district_id));
  if (doorSessions.length >= 3 && !hasRitual) {
    flags.push({
      flag_type: 'conduction_risk',
      title: 'Muitas portas abertas sem fechamento',
      message: 'Portas e Labirinto aparecem com frequência sem ritual de integração. Pode ser prudente incluir um momento de assentamento.',
      severity: 'medium',
      supporting_data: { door_count: doorSessions.length },
    });
  }

  // Repeated unstable check-ins
  const unstableCheckins = last6.filter(s => s.checkin_state === 'contraida' || s.checkin_state === 'instavel');
  if (unstableCheckins.length >= 4) {
    flags.push({
      flag_type: 'conduction_risk',
      title: 'Instabilidade persistente nos check-ins',
      message: 'Check-ins instáveis ou contraídos aparecem com frequência. Pode ser útil priorizar estabilização antes de aprofundar.',
      severity: 'high',
      supporting_data: { unstable_count: unstableCheckins.length },
    });
  }

  return flags;
}

// ─── MAIN DETECTION ───
export interface DetectionInput {
  sessions: SessionData[];
  labyrinthRecords: any[];
  cartographyData: any[];
  journeyDistricts: any[];
  districtNames: Record<string, string>;
  dreams: any[];
}

export function detectAllPatterns(input: DetectionInput): PatternFlag[] {
  const { sessions, labyrinthRecords, cartographyData, journeyDistricts, districtNames, dreams } = input;

  return [
    ...detectDistrictRecurrence(sessions),
    ...detectDoorRecurrence(labyrinthRecords),
    ...detectTowerRecurrence(sessions, cartographyData),
    ...detectAbaloPersistente(sessions, districtNames),
    ...detectIntegrationSignal(sessions, journeyDistricts, districtNames),
    ...detectLoop(sessions),
    ...detectConductionRisks(sessions, districtNames),
  ];
}

// ─── NEXT STEP SUGGESTION ───
export function getNextStepSuggestion(
  flags: PatternFlag[],
  dreams: any[],
  districtNames: Record<string, string>
): NextStepSuggestion {
  // Priority: abalo > loop > dream > district_recurrence > tower > default
  const hasAbalo = flags.find(f => f.flag_type === 'abalo_persistente');
  if (hasAbalo) {
    return {
      distrito_sugerido: 'Praça da Integração',
      ferramenta: 'Escrita Simbólica',
      pergunta_clinica: 'O que dentro de você pede acolhimento agora?',
      micro_ritual: 'Respiração de acolhimento: inspire contando até 4, segure 4, expire contando até 6. Repita 3 vezes.',
    };
  }

  const hasLoop = flags.find(f => f.flag_type === 'loop_detected');
  if (hasLoop) {
    return {
      distrito_sugerido: 'Praça da Integração',
      ferramenta: 'Ritual de Fechamento',
      pergunta_clinica: 'O que precisa ser reconhecido para que essa travessia possa se assentar?',
      micro_ritual: 'Convide a cliente a escolher um objeto simbólico e nomeá-lo como "o que já sei".',
    };
  }

  // Recent dream (last 7 days)
  const recentDream = dreams.find(d => {
    const diff = Date.now() - new Date(d.date || d.created_at).getTime();
    return diff < 7 * 24 * 60 * 60 * 1000;
  });
  if (recentDream) {
    return {
      distrito_sugerido: 'Casa dos Sonhos',
      ferramenta: 'Decodificação Onírica',
      pergunta_clinica: 'Se esse sonho fosse uma mensagem, o que ele tenta comunicar?',
      micro_ritual: 'Convide a cliente a desenhar a imagem central do sonho sem interpretar.',
    };
  }

  const districtRec = flags.find(f => f.flag_type === 'district_recurrence');
  if (districtRec) {
    const count = districtRec.supporting_data.count || 0;
    if (count >= 4) {
      return {
        distrito_sugerido: 'Praça da Integração',
        ferramenta: 'Exercício Narrativo',
        pergunta_clinica: 'O que você aprendeu sobre si mesma nesse retorno ao mesmo lugar?',
        micro_ritual: 'Escreva uma carta de despedida simbólica a esse distrito.',
      };
    }
    return {
      distrito_sugerido: districtRec.supporting_data.district_name || 'Distrito recorrente',
      ferramenta: 'Continuar trabalho no distrito',
      pergunta_clinica: 'O que mais esse território quer revelar?',
      micro_ritual: 'Nomeie o que já foi colhido nesse distrito.',
    };
  }

  const towerRec = flags.find(f => f.flag_type === 'tower_recurrence');
  if (towerRec) {
    return {
      distrito_sugerido: 'Torres',
      ferramenta: 'Torre Viva',
      pergunta_clinica: 'O que essa estrutura de proteção tentou proteger?',
      micro_ritual: 'Convide a cliente a dar um nome e uma idade a essa torre.',
    };
  }

  // Default
  return {
    distrito_sugerido: 'Portão da Chegada',
    ferramenta: 'Check-in aprofundado',
    pergunta_clinica: 'O que precisa de atenção neste momento?',
    micro_ritual: 'Três respirações conscientes antes de iniciar.',
  };
}

// ─── DISTRICT FREQUENCY for chart ───
export function getDistrictFrequency(sessions: SessionData[], districtNames: Record<string, string>): DistrictFrequency[] {
  const freq: Record<string, number> = {};
  sessions.slice(0, 10).forEach(s => {
    if (s.district_id) {
      freq[s.district_id] = (freq[s.district_id] || 0) + 1;
    }
  });

  return Object.entries(freq)
    .map(([id, count]) => ({ district_id: id, name: districtNames[id] || id, count }))
    .sort((a, b) => b.count - a.count);
}

// ─── MONTHLY SYNTHESIS (template) ───
export function generateMonthlySynthesis(flags: PatternFlag[], sessions: SessionData[], districtNames: Record<string, string>): string {
  const lines: string[] = [];
  const sessionCount = sessions.length;

  lines.push(`Nas últimas ${sessionCount} sessões analisadas, alguns movimentos parecem emergir:`);
  lines.push('');

  const distRec = flags.filter(f => f.flag_type === 'district_recurrence');
  if (distRec.length) {
    lines.push(`Há um retorno frequente ao distrito ${distRec[0].supporting_data.district_name}. Isso pode indicar um ciclo de trabalho importante.`);
  }

  const abalo = flags.find(f => f.flag_type === 'abalo_persistente');
  if (abalo) {
    lines.push('Sinais de abalo sustentado sugerem a importância de priorizar estabilização e integração.');
  }

  const integration = flags.filter(f => f.flag_type === 'integration_signal');
  if (integration.length) {
    lines.push(`Há sinais de integração consolidada em ${integration.map(f => f.supporting_data.district_name).join(', ')}.`);
  }

  const loop = flags.find(f => f.flag_type === 'loop_detected');
  if (loop) {
    lines.push('Um padrão de repetição foi identificado. Pode ser útil observar se há algo que pede assentamento.');
  }

  const risks = flags.filter(f => f.flag_type === 'conduction_risk');
  risks.forEach(r => {
    lines.push(`Atenção: ${r.message}`);
  });

  if (lines.length <= 2) {
    lines.push('Sem padrões significativos detectados neste período. A jornada segue em observação.');
  }

  lines.push('');
  lines.push('Esta leitura é simbólica e de uso interno. Não substitui julgamento clínico.');

  return lines.join('\n');
}
