/**
 * montarProfileJson.ts
 * 
 * Orquestrador central: monta o JSON estruturado final da Cartografia Psíquica.
 * Combina leituraComportamental + derivacaoCidadela em uma única estrutura persistível.
 * 
 * ZERO escolhas subjetivas. 100% determinístico.
 */

import { calcularLeitura, normalizarMedias, type ContextoLeitura, type LeituraComportamental, type MediasFatores } from './leituraComportamental';
import { derivarCidadela, type CidadelaDerivada } from './derivacaoCidadela';

// ─── Tipos do JSON final ───

export interface ProfileJsonInput {
  porta_do_possivel: number;
  torre_interna: number;
  campo_do_outro: number;
  voz_no_mundo: number;
  porta_do_abalo: number;
}

export type NivelDistrito = 'alto' | 'medio' | 'baixo';
export type NivelRisco = 'baixo' | 'moderado' | 'alto';

export interface ProfileJsonDerivacao {
  porta_inicial: string;
  porta_inicial_nome: string;
  torre_dominante: string;
  clima_cidadela: string;
  tensao_central: string;
  direcao_clinica: string;
  risco_conducao: NivelRisco;
  ritmo_recomendado: string;
  evitar: string[];
  priorizar: string[];
  distritos: {
    estrutura: NivelDistrito;
    expressao: NivelDistrito;
    vinculos: NivelDistrito;
    travessia: NivelDistrito;
    abalo: NivelDistrito;
  };
}

export interface ProfileJsonLeituraClinica {
  eixo_dominante: string;
  tensao_central_texto: string;
  estrategia_predominante: string;
  risco_texto: string;
  direcao_texto: string;
  ritmo_texto: string;
  porta_inicial_texto: string;
  torre_dominante_texto: string;
  clima_texto: string;
  observacao_etica: string;
}

export interface ProfileJsonLeituraSimbolica {
  forca_que_sustenta: string;
  tensao_que_pede_escuta: string;
  movimento_necessario: string;
  convite_inicial: string;
  frase_semente: string;
}

export interface ProfileJsonCidadela {
  porta_inicial: string;
  torre_dominante: string;
  clima_cidade: string;
  distritos_acesos: string[];
  indice_equilibrio: number;
}

export interface ProfileJsonFinal {
  input: ProfileJsonInput;
  derivacao: ProfileJsonDerivacao;
  leitura_clinica: ProfileJsonLeituraClinica;
  leitura_simbolica: ProfileJsonLeituraSimbolica;
  cidadela: ProfileJsonCidadela;
  oracula_inicial: string;
  intensidade_oracular: string;
}

// ─── Classificação de distritos ───

function classificarDistrito(media: number): NivelDistrito {
  if (media >= 3.5) return 'alto';
  if (media >= 2.5) return 'medio';
  return 'baixo';
}

// ─── Risco de condução ───

function calcularRiscoConductao(medias: MediasFatores): NivelRisco {
  const abalo = medias.porta_do_abalo;
  const torre = medias.torre_interna;

  // Abalo alto + torre alta = risco alto (hipervigilância + fragilidade)
  if (abalo >= 3.5 && torre >= 3.5) return 'alto';
  // Abalo alto solo = risco moderado
  if (abalo >= 3.5) return 'moderado';
  // Torre muito alta + voz muito baixa = risco moderado (rigidez)
  if (torre >= 4.0 && medias.voz_no_mundo <= 2.0) return 'moderado';
  return 'baixo';
}

// ─── Textos clínicos ───

const TEXTOS_TENSAO_CLINICA: Record<string, string> = {
  'controle vs colapso': 'Eixo controle–colapso: hipervigilância compensando fragilidade emocional.',
  'estrutura vs expressão': 'Eixo estrutura–expressão: rigidez defensiva pode bloquear autenticidade.',
  'pertencimento vs autonomia': 'Eixo pertencimento–autonomia: fusão relacional pode inibir individuação.',
  'expansão vs segurança': 'Eixo expansão–segurança: desejo de crescimento tensionado por medo de desestabilização.',
  'expressão vs aceitação': 'Eixo expressão–aceitação: autenticidade percebida como risco relacional.',
  'segurança vs movimento': 'Eixo segurança–movimento: estagnação defensiva.',
};

const TEXTOS_RISCO: Record<NivelRisco, string> = {
  alto: 'Risco alto de ruptura se houver confronto direto ou pressão por mudança rápida.',
  moderado: 'Risco moderado — cuidado com interpretações prematuras e excesso de estímulos.',
  baixo: 'Risco baixo — campo aberto para exploração com ritmo adequado.',
};

const TEXTOS_RITMO: Record<string, string> = {
  lento: 'Ritmo lento recomendado — contenção antes de aprofundamento.',
  medio: 'Ritmo médio — equilíbrio entre estrutura e exploração.',
  rapido: 'Ritmo dinâmico possível — abertura para experimentação ativa.',
};

// ─── Frases-semente por tensão central ───

const FRASES_SEMENTE: Record<string, string> = {
  'controle vs colapso': 'A estrutura que te protege também pode ser porta de travessia.',
  'estrutura vs expressão': 'O que não se diz não desaparece — busca outro caminho.',
  'pertencimento vs autonomia': 'Pertencer a si mesma é o primeiro vínculo verdadeiro.',
  'expansão vs segurança': 'Crescer não é abandonar a base — é expandi-la.',
  'expressão vs aceitação': 'Sua voz não precisa de permissão para existir.',
  'segurança vs movimento': 'O movimento começa onde o medo para de decidir.',
};

// ─── Movimento necessário por ritmo ───

const MOVIMENTO_POR_RITMO: Record<string, string> = {
  lento: 'Criar espaço seguro antes de qualquer travessia.',
  medio: 'Usar os recursos que já tem com mais intenção.',
  rapido: 'Explorar sem medo de errar — o campo sustenta.',
};

// ─── Observação ética por risco ───

const OBSERVACAO_ETICA: Record<NivelRisco, string> = {
  alto: 'Não confrontar diretamente. Priorizar vínculo e contenção antes de qualquer aprofundamento. Tolerância ao confronto reduzida.',
  moderado: 'Cautela com interpretações precoces. Manter ritmo estruturado e validar antes de expandir.',
  baixo: 'Campo aberto para exploração. Manter atenção ética à projeção e ao ritmo da cliente.',
};

// ─── Função principal ───

export interface MontarProfileParams {
  rawMedias: Record<string, number>;
  contexto: ContextoLeitura;
}

export interface MontarProfileResult {
  profileJson: ProfileJsonFinal;
  leitura: LeituraComportamental;
  cidadela: CidadelaDerivada;
}

export function montarProfileJson({ rawMedias, contexto }: MontarProfileParams): MontarProfileResult {
  // 1. Normalizar médias
  const medias = normalizarMedias(rawMedias);

  // 2. Calcular leitura comportamental (motor único)
  const leitura = calcularLeitura(rawMedias, contexto);

  // 3. Derivar CidaDELA
  const cidadela = derivarCidadela(rawMedias, leitura.profile.tensao_central);

  // 4. Calcular risco
  const risco = calcularRiscoConductao(medias);

  // 5. Montar JSON final
  const profileJson: ProfileJsonFinal = {
    input: {
      porta_do_possivel: medias.porta_do_possivel,
      torre_interna: medias.torre_interna,
      campo_do_outro: medias.campo_do_outro,
      voz_no_mundo: medias.voz_no_mundo,
      porta_do_abalo: medias.porta_do_abalo,
    },

    derivacao: {
      porta_inicial: cidadela.porta_inicial,
      porta_inicial_nome: cidadela.porta_inicial_nome,
      torre_dominante: cidadela.torre_dominante,
      clima_cidadela: cidadela.clima_cidade,
      tensao_central: leitura.profile.tensao_central,
      direcao_clinica: leitura.profile.estilo_conducao,
      risco_conducao: risco,
      ritmo_recomendado: leitura.profile.ritmo_ideal,
      evitar: leitura.saida_terapeuta.o_que_evitar,
      priorizar: leitura.saida_terapeuta.o_que_priorizar,
      distritos: {
        estrutura: classificarDistrito(medias.torre_interna),
        expressao: classificarDistrito(medias.voz_no_mundo),
        vinculos: classificarDistrito(medias.campo_do_outro),
        travessia: classificarDistrito(medias.porta_do_possivel),
        abalo: classificarDistrito(medias.porta_do_abalo),
      },
    },

    leitura_clinica: {
      eixo_dominante: cidadela.porta_inicial_nome,
      tensao_central_texto: TEXTOS_TENSAO_CLINICA[leitura.profile.tensao_central] || 'Tensão em avaliação.',
      estrategia_predominante: leitura.profile.estrategia_defesa,
      risco_texto: TEXTOS_RISCO[risco],
      direcao_texto: leitura.profile.estilo_conducao,
      ritmo_texto: TEXTOS_RITMO[leitura.profile.ritmo_ideal] || TEXTOS_RITMO.medio,
      porta_inicial_texto: cidadela.porta_inicial_nome,
      torre_dominante_texto: cidadela.torre_dominante,
      clima_texto: cidadela.clima_cidade,
      observacao_etica: OBSERVACAO_ETICA[risco],
    },

    leitura_simbolica: {
      forca_que_sustenta: leitura.saida_cliente.forca_principal,
      tensao_que_pede_escuta: leitura.saida_cliente.tensao_central,
      movimento_necessario: MOVIMENTO_POR_RITMO[leitura.profile.ritmo_ideal] || MOVIMENTO_POR_RITMO.medio,
      convite_inicial: leitura.saida_cliente.convite_inicial,
      frase_semente: FRASES_SEMENTE[leitura.profile.tensao_central] || 'O mapa se revela a quem caminha.',
    },

    cidadela: {
      porta_inicial: cidadela.porta_inicial,
      torre_dominante: cidadela.torre_dominante,
      clima_cidade: cidadela.clima_cidade,
      distritos_acesos: cidadela.distritos_acesos,
      indice_equilibrio: cidadela.indice_equilibrio,
    },

    // Derivados do mesmo motor — sem lógica paralela
    oracula_inicial: leitura.oracula_inicial,
    intensidade_oracular: leitura.intensidade_oracular,
  };

  return { profileJson, leitura, cidadela };
}
