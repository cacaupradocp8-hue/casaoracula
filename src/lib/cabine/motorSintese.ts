/**
 * MOTOR DE SÍNTESE CLÍNICA
 * 
 * Gera automaticamente a partir da sessão atual + mapa vivo + estado final:
 * - O que sustentar
 * - O que evitar
 * - O que ficou em aberto
 * - Direção da próxima sessão
 * - Mensagem simbólica para o Jardim
 */

import type { LeituraCampo, EstadoCampo } from './motorOracular';
import type { MapaVivoState } from './motorMapaVivo';
import type { FluxoClinicoResult, FluxoClinico } from './motorSessaoVivo';
import type { SessionData } from '@/pages/casa-maquinas/CabineTerapeutaPage';
import type { SessionUpdateResult } from './motorDeteccaoVivo';

export interface SinteseSessao {
  sustentar: string;
  evitar: string;
  em_aberto: string;
  direcao_proxima: string;
  mensagem_simbolica: string;
}

interface SinteseInput {
  sessionData: SessionData;
  leitura: LeituraCampo | null;
  mapaVivo: MapaVivoState | null;
  fluxoFinal: FluxoClinicoResult | null;
  liveUpdate: SessionUpdateResult | null;
}

// ========================================
// SUSTENTAR — baseado no que emergiu
// ========================================

function deriveSustentar(input: SinteseInput): string {
  const { leitura, mapaVivo, fluxoFinal, sessionData } = input;

  if (mapaVivo?.integracao_em_curso) {
    return 'O processo de integração que está em curso. Não apressar, não redirecionar — permitir que se complete.';
  }
  if (fluxoFinal?.fluxo === 'integracao' || fluxoFinal?.fluxo === 'continuidade') {
    return 'O que foi vivido na sessão. Manter presença sem interpretar. Permitir que o campo se reorganize.';
  }
  if (leitura?.direcao === 'espelho' || leitura?.direcao === 'espelho_contencao') {
    return 'O espelhamento como direção. A cliente precisa se ver antes de avançar.';
  }
  if (sessionData.ferramentaEscolhida) {
    return `A direção aberta com ${sessionData.ferramentaEscolhida}. Manter continuidade sem dispersar.`;
  }
  return 'A presença e a escuta. O campo ainda está se revelando.';
}

// ========================================
// EVITAR — baseado no risco e padrão
// ========================================

function deriveEvitar(input: SinteseInput): string {
  const { leitura, mapaVivo, liveUpdate } = input;

  if (leitura?.risco === 'elevado') {
    return 'Aprofundar sem contenção. Não abrir novos campos. Priorizar segurança sobre insight.';
  }
  if (mapaVivo?.repeticao_detectada) {
    return 'Interpretar o padrão repetitivo. Espelhar sem nomear — evitar que a cliente se sinta "diagnosticada".';
  }
  if (liveUpdate?.padrao === 'racionalizacao') {
    return 'Alimentar a racionalização. Não entrar em explicações. Redirecionar para o corpo e a experiência.';
  }
  if (liveUpdate?.padrao === 'desorganizacao') {
    return 'Estimular mais material. Reduzir inputs. Conter antes de explorar.';
  }
  if (liveUpdate?.padrao === 'conflito') {
    return 'Resolver o conflito. Não tomar partido entre as partes. Sustentar a tensão criativa.';
  }
  return 'Excesso de interpretação. Manter o campo aberto sem direcionar prematuramente.';
}

// ========================================
// EM ABERTO — baseado no que não se completou
// ========================================

function deriveEmAberto(input: SinteseInput): string {
  const { sessionData, fluxoFinal, mapaVivo } = input;

  if (fluxoFinal?.fluxo === 'campo_responde' || fluxoFinal?.fluxo === 'escuta') {
    return 'O campo começou a responder mas não chegou à intervenção. Há material emergente que precisa de continuidade.';
  }
  if (mapaVivo?.travessia_travada) {
    return 'A travessia permanece no mesmo ponto. Algo ainda não foi visto ou nomeado. Observar o que resiste.';
  }
  if (!sessionData.resumoSessao && !sessionData.hipoteseSimbólica) {
    return 'A sessão não chegou à síntese. O que foi vivido ainda está se organizando internamente.';
  }
  if (sessionData.hipoteseSimbólica) {
    return `Hipótese em aberto: "${sessionData.hipoteseSimbólica.slice(0, 100)}${sessionData.hipoteseSimbólica.length > 100 ? '...' : ''}"`;
  }
  return 'Nenhum ponto específico ficou pendente. A sessão teve encerramento natural.';
}

// ========================================
// DIREÇÃO PRÓXIMA SESSÃO
// ========================================

function deriveDirecaoProxima(input: SinteseInput): string {
  const { leitura, mapaVivo, fluxoFinal, liveUpdate } = input;

  if (leitura?.risco === 'elevado') {
    return 'Contenção e acolhimento. Não avançar em material novo. Verificar estabilidade antes de explorar.';
  }
  if (mapaVivo?.repeticao_detectada) {
    return 'Revisitar o campo que insiste em aparecer. Usar espelho antes de qualquer intervenção.';
  }
  if (mapaVivo?.integracao_em_curso) {
    return 'Verificar o que se integrou desde esta sessão. Observar mudanças no cotidiano.';
  }
  if (fluxoFinal?.fluxo === 'intervencao') {
    return 'Dar continuidade à intervenção iniciada. Verificar reverberações. Não mudar de direção.';
  }
  if (liveUpdate?.padrao === 'conflito') {
    return 'Retomar o conflito interno com presença. Ajudar a nomear as partes sem resolver.';
  }
  if (leitura?.direcao) {
    return `Manter a direção: ${leitura.mensagem_direcao}`;
  }
  return 'Escuta aberta. Observar o que emerge espontaneamente. Não direcionar prematuramente.';
}

// ========================================
// MENSAGEM SIMBÓLICA PARA O JARDIM
// ========================================

function deriveMensagemSimbolica(input: SinteseInput): string {
  const { mapaVivo, fluxoFinal, leitura } = input;

  if (mapaVivo?.repeticao_detectada) {
    return 'Hoje revisitamos um campo que insiste em ser visto. Sua terapeuta sustentou a presença nesse lugar — sem pressa de mudar. Permita que o que apareceu continue trabalhando.';
  }
  if (mapaVivo?.integracao_em_curso) {
    return 'Algo em você está se reorganizando. Sua terapeuta acompanhou esse movimento com cuidado. Não tente entender tudo agora — permita que continue.';
  }
  if (mapaVivo?.travessia_travada) {
    return 'Ainda estamos no mesmo campo — e isso não é estagnação. É permanência necessária. Confie no tempo do seu processo.';
  }
  if (fluxoFinal?.fluxo === 'integracao' || fluxoFinal?.fluxo === 'continuidade') {
    return 'A sessão de hoje chegou a um ponto de integração. Algo foi visto e sustentado. Leve isso com você nos próximos dias.';
  }
  if (fluxoFinal?.fluxo === 'intervencao') {
    return 'Hoje abrimos um campo para exploração. O que apareceu merece atenção — observe o que surge nos próximos dias.';
  }
  if (leitura?.risco === 'elevado') {
    return 'Sua terapeuta esteve presente com você hoje em um momento delicado. O cuidado continua. Você não precisa resolver nada agora.';
  }
  return 'Sua terapeuta esteve presente com você hoje. O que foi vivido continua trabalhando dentro de você.';
}

// ========================================
// FUNÇÃO PRINCIPAL
// ========================================

export function gerarSinteseSessao(input: SinteseInput): SinteseSessao {
  return {
    sustentar: deriveSustentar(input),
    evitar: deriveEvitar(input),
    em_aberto: deriveEmAberto(input),
    direcao_proxima: deriveDirecaoProxima(input),
    mensagem_simbolica: deriveMensagemSimbolica(input),
  };
}
