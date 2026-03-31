import { TrainingCase, TrainingCaseFeedback, TrainingCaseReading, RespostaAluna } from './types';

export type FeedbackNivel = 'coerente' | 'ajuste' | 'erro';

export interface FeedbackResult {
  nivel: FeedbackNivel;
  score: number; // 0-100
  distritoMatch: boolean;
  estadoMatch: boolean;
  ferramentaMatch: boolean;
  feedbacksAtivos: TrainingCaseFeedback[];
  leiturasRelevantes: TrainingCaseReading[];
  resumo: string;
}

/**
 * Compara as respostas da aluna com as referências do caso
 * e determina qual nível de feedback mostrar.
 * 
 * Regras:
 * 1. distrito + estado + ferramenta alinhados + leitura esperada → coerente
 * 2. parcialmente alinhado (2 de 3, ou leitura aceitável) → ajuste
 * 3. erro comum detectado ou desalinhamento total → erro
 */
export function calcularFeedback(caso: TrainingCase, resposta: RespostaAluna): FeedbackResult {
  const readings = caso.readings || [];
  const feedbacks = caso.feedbacks || [];

  // --- Comparação estrutural ---
  const distritoMatch = normalizar(resposta.distrito_escolhido) === normalizar(caso.distrito_esperado || '');
  const estadoMatch = normalizar(resposta.estado_escolhido) === normalizar(caso.estado_esperado || '');
  const ferramentaMatch = normalizar(resposta.ferramenta_escolhida) === normalizar(caso.ferramenta_principal || '');

  const matchCount = [distritoMatch, estadoMatch, ferramentaMatch].filter(Boolean).length;

  // --- Análise de leitura textual ---
  const leituraTexto = normalizar(resposta.leitura_texto + ' ' + resposta.hipotese_texto);

  const errosComuns = readings.filter(r => r.tipo === 'erro_comum');
  const leitEsperadas = readings.filter(r => r.tipo === 'esperada');
  const leitAceitaveis = readings.filter(r => r.tipo === 'aceitavel');

  // Verificar se a leitura da aluna contém termos de erro comum
  const erroDetectado = errosComuns.some(r => textoContem(leituraTexto, r.leitura));
  
  // Verificar se contém termos de leitura esperada
  const leituraEsperadaDetectada = leitEsperadas.some(r => textoContem(leituraTexto, r.leitura));
  
  // Verificar se contém termos de leitura aceitável
  const leituraAceitavelDetectada = leitAceitaveis.some(r => textoContem(leituraTexto, r.leitura));

  // --- Determinar nível ---
  let nivel: FeedbackNivel;
  let score: number;
  let resumo: string;

  if (erroDetectado && matchCount <= 1) {
    // Erro claro: leitura com erro comum + desalinhamento estrutural
    nivel = 'erro';
    score = Math.max(10, matchCount * 15);
    resumo = 'Sua leitura tocou em pontos que costumam gerar confusão neste caso. Revise os sinais com mais calma.';
  } else if (matchCount >= 2 && (leituraEsperadaDetectada || leituraAceitavelDetectada) && !erroDetectado) {
    // Coerente: boa parte alinhada + leitura esperada/aceitável
    nivel = 'coerente';
    score = 70 + (matchCount * 10) + (leituraEsperadaDetectada ? 10 : 0);
    resumo = 'Sua leitura demonstra coerência com o campo apresentado. Os pontos de referência estão alinhados.';
  } else if (matchCount >= 2 && !erroDetectado) {
    // Coerente estrutural mesmo sem detecção textual
    nivel = 'coerente';
    score = 65 + (matchCount * 10);
    resumo = 'Seus posicionamentos estão alinhados com a referência. Continue refinando a leitura textual.';
  } else if (matchCount >= 1 || leituraAceitavelDetectada) {
    // Ajuste: parcialmente correto
    nivel = 'ajuste';
    score = 40 + (matchCount * 15) + (leituraAceitavelDetectada ? 10 : 0);
    resumo = 'Sua leitura está no caminho, mas precisa de refinamento em alguns pontos. Observe os indicadores abaixo.';
  } else if (erroDetectado) {
    // Erro: detectou erro comum
    nivel = 'erro';
    score = 20;
    resumo = 'Atenção: sua leitura contém elementos que costumam indicar uma interpretação precipitada deste campo.';
  } else {
    // Ajuste genérico: nem alinhado nem erro claro
    nivel = 'ajuste';
    score = 35;
    resumo = 'Sua leitura está distante da referência, mas isso não significa que esteja errada. Compare com os pontos abaixo.';
  }

  // --- Selecionar feedbacks ativos ---
  const feedbacksAtivos = feedbacks.filter(f => f.tipo === nivel);
  
  // Se coerente mas com algum desalinhamento, adicionar ajustes também
  if (nivel === 'coerente' && matchCount < 3) {
    feedbacksAtivos.push(...feedbacks.filter(f => f.tipo === 'ajuste'));
  }

  // --- Leituras relevantes para mostrar ---
  const leiturasRelevantes: TrainingCaseReading[] = [];
  if (nivel === 'coerente') {
    leiturasRelevantes.push(...leitEsperadas);
  } else if (nivel === 'ajuste') {
    leiturasRelevantes.push(...leitEsperadas, ...leitAceitaveis);
  } else {
    leiturasRelevantes.push(...leitEsperadas, ...errosComuns);
  }

  return {
    nivel,
    score: Math.min(100, score),
    distritoMatch,
    estadoMatch,
    ferramentaMatch,
    feedbacksAtivos,
    leiturasRelevantes,
    resumo,
  };
}

// --- Helpers ---

function normalizar(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Verifica se o texto da aluna contém palavras-chave da leitura de referência.
 * Usa matching por palavras significativas (>3 chars) com threshold.
 */
function textoContem(textoAluna: string, leituraRef: string): boolean {
  const palavrasRef = normalizar(leituraRef)
    .split(/\s+/)
    .filter(p => p.length > 3);
  
  if (palavrasRef.length === 0) return false;

  const matches = palavrasRef.filter(p => textoAluna.includes(p));
  // Pelo menos 40% das palavras significativas devem estar presentes
  return matches.length / palavrasRef.length >= 0.4;
}
