import { TrainingCase, RespostaAluna } from './types';

export interface ScoreBreakdown {
  distrito: number;     // 0, 2, or 3
  hipotese: number;     // 0, 1, 2, or 3
  ferramenta: number;   // 0, 2, or 3
  total: number;        // 0-9
}

export interface PerfilSimbolico {
  padrao_dominante: string;
  estado_atual: string;
  vetor_crescimento: string;
}

function normalizar(text: string): string {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function palavrasChave(texto: string): string[] {
  return normalizar(texto).split(/\s+/).filter(p => p.length > 3);
}

function similaridade(textoA: string, textoB: string): number {
  const pA = palavrasChave(textoA);
  const pB = palavrasChave(textoB);
  if (pA.length === 0 || pB.length === 0) return 0;
  const matches = pA.filter(p => pB.some(b => b.includes(p) || p.includes(b)));
  return matches.length / Math.max(pA.length, pB.length);
}

/**
 * Sistema de pontuação 0-9 para treinamento clínico.
 * 
 * Distrito: correto=3, alternativo=2, incoerente=0
 * Hipótese: alta coerência=3, média=2, fraca=1, incoerente=0
 * Ferramenta: principal=3, apoio=2, inadequada=0
 */
export function calculateTrainingScore(caso: TrainingCase, resposta: RespostaAluna): ScoreBreakdown {
  const distritoNorm = normalizar(resposta.distrito_escolhido);
  const esperadoNorm = normalizar(caso.distrito_esperado || '');
  const alternativosNorm = (caso.distritos_alternativos || []).map(normalizar);

  // Distrito
  let distrito = 0;
  if (distritoNorm === esperadoNorm) {
    distrito = 3;
  } else if (alternativosNorm.includes(distritoNorm)) {
    distrito = 2;
  }

  // Hipótese (comparação semântica por keywords)
  let hipotese = 0;
  const simHip = similaridade(resposta.hipotese_texto, caso.hipotese_esperada || '');
  if (simHip >= 0.5) hipotese = 3;
  else if (simHip >= 0.3) hipotese = 2;
  else if (simHip >= 0.15) hipotese = 1;

  // Ferramenta
  let ferramenta = 0;
  const ferrNorm = normalizar(resposta.ferramenta_escolhida);
  const principalNorm = normalizar(caso.ferramenta_principal || '');
  const apoioNorm = (caso.ferramentas_apoio || []).map(normalizar);

  if (ferrNorm === principalNorm) {
    ferramenta = 3;
  } else if (apoioNorm.includes(ferrNorm)) {
    ferramenta = 2;
  }

  return {
    distrito,
    hipotese,
    ferramenta,
    total: distrito + hipotese + ferramenta,
  };
}

/**
 * Gera perfil simbólico emergente baseado no caso e na resposta.
 */
export function gerarPerfilSimbolico(caso: TrainingCase, resposta: RespostaAluna): PerfilSimbolico {
  const distrito = caso.distrito_esperado || resposta.distrito_escolhido;
  const estado = caso.estado_esperado || resposta.estado_escolhido;
  const vetor = caso.vetor_esperado || resposta.vetor_texto || 'não identificado';

  // Determinar padrão dominante com base no caso
  const padrao = caso.movimento_esperado || caso.tema || 'padrão não mapeado';

  return {
    padrao_dominante: padrao,
    estado_atual: `${estado} — campo ${distrito}`,
    vetor_crescimento: vetor,
  };
}

/**
 * Gerar feedback estruturado em JSON para armazenamento.
 */
export function gerarFeedbackJson(
  caso: TrainingCase,
  resposta: RespostaAluna,
  score: ScoreBreakdown
) {
  const leituras = caso.readings || [];
  const errosComuns = leituras.filter(r => r.tipo === 'erro_comum');
  const esperadas = leituras.filter(r => r.tipo === 'esperada');

  return {
    leitura_padrao: esperadas.map(e => e.leitura).join('; ') || 'sem referência',
    analise_distrito: score.distrito === 3
      ? `Distrito correto: ${caso.distrito_esperado}`
      : score.distrito === 2
      ? `Distrito alternativo válido. Referência principal: ${caso.distrito_esperado}`
      : `Distrito incorreto. Esperado: ${caso.distrito_esperado}`,
    analise_ferramenta: score.ferramenta === 3
      ? `Ferramenta principal identificada: ${caso.ferramenta_principal}`
      : score.ferramenta === 2
      ? `Ferramenta de apoio válida. Principal: ${caso.ferramenta_principal}`
      : `Ferramenta inadequada. Sugerida: ${caso.ferramenta_principal}`,
    erro_comum: caso.erro_comum || errosComuns.map(e => e.leitura).join('; ') || null,
    direcao_sugerida: caso.vetor_esperado || 'sem vetor definido',
    score,
  };
}
