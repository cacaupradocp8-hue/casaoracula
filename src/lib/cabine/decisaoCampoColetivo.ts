/**
 * CAMADA DE DECISÃO COLETIVA — Copiloto Clínico
 * 
 * Transforma a leitura do campo em decisão clínica actionable.
 * Determina: pode aprofundar? deve conter? deve recentrar? deve fechar?
 * 
 * Puramente determinístico.
 */

import type { LeituraCampoColetivo, EstadoCampoColetivo } from './motorLeituraColetiva';
import type { LeituraSimbolica, EstadoCirculo } from './motorLeituraSimbolica';

// ── Tipos ────────────────────────────────────────────────

export type NivelIntervencao = 'baixo' | 'medio' | 'alto';

export interface DecisaoCampoColetivo {
  pode_aprofundar: boolean;
  deve_conter: boolean;
  deve_recentrar: boolean;
  deve_fechar: boolean;
  deve_sustentar_silencio: boolean;
  deve_estimular_movimento: boolean;
  nivel_intervencao: NivelIntervencao;
  recomendacao_direta: string;
  bloqueio_acao: string | null;
}

// ── Mensagens de bloqueio ────────────────────────────────

const BLOQUEIO_MSG = 'O campo não sustenta essa condução neste momento.';

// ── Motor de Decisão — GRUPO ─────────────────────────────

export function avaliarCondutaColetiva(leitura: LeituraCampoColetivo): DecisaoCampoColetivo {
  const { estado_campo_coletivo: estado, risco_coletivo: risco, padrao_predominante: padrao } = leitura;

  // Base
  const decisao: DecisaoCampoColetivo = {
    pode_aprofundar: false,
    deve_conter: false,
    deve_recentrar: false,
    deve_fechar: false,
    deve_sustentar_silencio: false,
    deve_estimular_movimento: false,
    nivel_intervencao: 'baixo',
    recomendacao_direta: '',
    bloqueio_acao: null,
  };

  // ── Regras por estado ──

  switch (estado) {
    case 'descarga_emocional':
      decisao.deve_conter = true;
      decisao.nivel_intervencao = 'alto';
      decisao.recomendacao_direta = 'Conter a intensidade. Respiração coletiva. Não aprofundar.';
      decisao.bloqueio_acao = BLOQUEIO_MSG;
      break;

    case 'fragmentacao':
      decisao.deve_recentrar = true;
      decisao.nivel_intervencao = risco === 'elevado' ? 'alto' : 'medio';
      decisao.recomendacao_direta = 'Recentrar o campo com pergunta comum ou símbolo unificador.';
      decisao.bloqueio_acao = BLOQUEIO_MSG;
      break;

    case 'retracao_coletiva':
      decisao.deve_sustentar_silencio = true;
      decisao.nivel_intervencao = 'medio';
      decisao.recomendacao_direta = 'Criar segurança. Sustentar presença sem demanda.';
      decisao.bloqueio_acao = BLOQUEIO_MSG;
      break;

    case 'repeticao_narrativa':
      decisao.deve_estimular_movimento = false; // espelhar, não forçar
      decisao.nivel_intervencao = 'medio';
      decisao.recomendacao_direta = 'Espelhar o padrão repetitivo sem forçar ruptura. O grupo precisa elaborar.';
      decisao.bloqueio_acao = BLOQUEIO_MSG;
      break;

    case 'transicao_de_ciclo':
      decisao.deve_fechar = true;
      decisao.nivel_intervencao = 'medio';
      decisao.recomendacao_direta = 'Acompanhar o fechamento. Não abrir novo campo.';
      break;

    case 'integracao_coletiva':
      decisao.pode_aprofundar = false; // sustentar, não acelerar
      decisao.nivel_intervencao = 'baixo';
      decisao.recomendacao_direta = 'Sustentar a integração. O campo está maduro — não acelere.';
      break;

    case 'abertura_coletiva':
      decisao.pode_aprofundar = true;
      decisao.nivel_intervencao = 'baixo';
      decisao.recomendacao_direta = 'O campo sustenta aprofundamento. Conduzir com presença.';
      break;

    case 'campo_estavel':
    default:
      decisao.pode_aprofundar = true;
      decisao.nivel_intervencao = 'baixo';
      decisao.recomendacao_direta = 'Campo estável. Observar e acompanhar o movimento natural.';
      break;
  }

  // Override: risco elevado sempre bloqueia aprofundamento
  if (risco === 'elevado') {
    decisao.pode_aprofundar = false;
    decisao.bloqueio_acao = decisao.bloqueio_acao || BLOQUEIO_MSG;
    if (decisao.nivel_intervencao !== 'alto') {
      decisao.nivel_intervencao = 'alto';
    }
  }

  return decisao;
}

// ── Motor de Decisão — CÍRCULO ───────────────────────────

export function avaliarCondutaCirculo(leitura: LeituraSimbolica): DecisaoCampoColetivo {
  const { estado_circulo: estado, risco_coletivo: risco } = leitura;

  const decisao: DecisaoCampoColetivo = {
    pode_aprofundar: false,
    deve_conter: false,
    deve_recentrar: false,
    deve_fechar: false,
    deve_sustentar_silencio: false,
    deve_estimular_movimento: false,
    nivel_intervencao: 'baixo',
    recomendacao_direta: '',
    bloqueio_acao: null,
  };

  switch (estado) {
    case 'circulo_em_abertura_ritual':
      decisao.pode_aprofundar = true;
      decisao.recomendacao_direta = 'Abrir o campo com conto ou pergunta ritual.';
      break;

    case 'circulo_em_recolhimento':
      decisao.deve_sustentar_silencio = true;
      decisao.nivel_intervencao = 'medio';
      decisao.recomendacao_direta = 'Sustentar escuta. O círculo precisa de acolhimento.';
      decisao.bloqueio_acao = BLOQUEIO_MSG;
      break;

    case 'circulo_em_ativacao_simbolica':
      decisao.pode_aprofundar = true;
      decisao.recomendacao_direta = 'Ativar símbolo — trazer imagem ou gesto ao centro.';
      break;

    case 'circulo_em_travessia':
      decisao.deve_conter = risco === 'elevado';
      decisao.nivel_intervencao = risco === 'elevado' ? 'alto' : 'medio';
      decisao.recomendacao_direta = risco === 'elevado'
        ? 'Conter intensidade. O círculo está em travessia profunda.'
        : 'Acompanhar a travessia sem acelerar.';
      if (risco === 'elevado') decisao.bloqueio_acao = BLOQUEIO_MSG;
      break;

    case 'circulo_em_integracao':
      decisao.deve_fechar = true;
      decisao.nivel_intervencao = 'baixo';
      decisao.recomendacao_direta = 'Fechar com gesto ritual. O campo pede encerramento.';
      break;
  }

  if (risco === 'elevado') {
    decisao.pode_aprofundar = false;
    decisao.bloqueio_acao = decisao.bloqueio_acao || BLOQUEIO_MSG;
    decisao.nivel_intervencao = 'alto';
  }

  return decisao;
}
