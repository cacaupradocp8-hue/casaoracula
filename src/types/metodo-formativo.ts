// ============================================
// MÉTODO FORMATIVO DA CASA ORÁCULA
// Template padrão para Módulos e Aulas
// Estrutura fixa e replicável com campos separados
// ============================================

// BLOCO 1 — METADADOS
export interface BlocoMetadados {
  jornada: string;
  nome_portal_aula: string;
  habilidade_desenvolvida: string;
  competencia_profissional: string;
}

// BLOCO 2 — SENTIDO DA JORNADA
export interface BlocoSentidoJornada {
  texto: string; // máx 6-8 linhas, contextualização simbólica
}

// BLOCO 3 — ESSÊNCIA 80/20
export interface BlocoEssencia8020 {
  nucleo_vivo: string;
  tensao_central: string;
  verdades_praticas: [string, string, string]; // exatamente 3
  frase_guia: string;
}

// BLOCO 4 — RAIZ PSÍQUICA
export interface BlocoRaizPsiquica {
  arquetipo_ativado: string;
  movimento_psiquico: string;
  imagem_organizadora: string;
}

// BLOCO 5 — APLICAÇÃO PROFISSIONAL
export interface AplicacaoAula {
  conceito: string;
  exercicio_pratico: string;
  pergunta_final: string;
}

export interface AplicacaoSessao {
  tema_recorrente: string;
  pergunta_acesso: string;
  cuidado_etico: string;
}

export interface AplicacaoCirculo {
  imagem_abertura: string;
  convite_acao: string;
}

export interface BlocoAplicacaoProfissional {
  aula: AplicacaoAula;
  sessao: AplicacaoSessao;
  circulo: AplicacaoCirculo;
}

// BLOCO 6 — APLICAÇÃO PESSOAL
export interface BlocoAplicacaoPessoal {
  pergunta_auto_observacao: string;
  padrao_a_observar: string;
  gesto_concreto_semana: string;
}

// BLOCO 7 — PRÁTICA DE AUTOEFICÁCIA
export interface BlocoAutoeficacia {
  nome_pratica: string;
  passos: [string, string, string]; // 3 passos numerados
  indicador_eficacia: string;
}

// BLOCO 8 — REGISTRO ÉTICO
export interface BlocoRegistroEtico {
  orientacao_jardim_psique: string;
  orientacao_jardim_oficio: string;
}

// CAMPO SEPARADO — Roteiro de Aula (Vídeo/Áudio)
export interface RoteiroAula {
  roteiro: string; // geração narrativa independente
}

// ============================================
// TEMPLATE COMPLETO DO MÉTODO FORMATIVO
// ============================================
export interface MetodoFormativoTemplate {
  // Bloco 1
  metadados: BlocoMetadados;
  // Bloco 2
  sentido_jornada: BlocoSentidoJornada;
  // Bloco 3
  essencia_80_20: BlocoEssencia8020;
  // Bloco 4
  raiz_psiquica: BlocoRaizPsiquica;
  // Bloco 5
  aplicacao_profissional: BlocoAplicacaoProfissional;
  // Bloco 6
  aplicacao_pessoal: BlocoAplicacaoPessoal;
  // Bloco 7
  autoeficacia: BlocoAutoeficacia;
  // Bloco 8
  registro_etico: BlocoRegistroEtico;
  // Campo separado
  roteiro_aula: RoteiroAula;
}

// ============================================
// FACTORY — Template vazio para novos conteúdos
// ============================================
export const criarTemplateVazio = (): MetodoFormativoTemplate => ({
  metadados: {
    jornada: '',
    nome_portal_aula: '',
    habilidade_desenvolvida: '',
    competencia_profissional: '',
  },
  sentido_jornada: {
    texto: '',
  },
  essencia_80_20: {
    nucleo_vivo: '',
    tensao_central: '',
    verdades_praticas: ['', '', ''],
    frase_guia: '',
  },
  raiz_psiquica: {
    arquetipo_ativado: '',
    movimento_psiquico: '',
    imagem_organizadora: '',
  },
  aplicacao_profissional: {
    aula: {
      conceito: '',
      exercicio_pratico: '',
      pergunta_final: '',
    },
    sessao: {
      tema_recorrente: '',
      pergunta_acesso: '',
      cuidado_etico: '',
    },
    circulo: {
      imagem_abertura: '',
      convite_acao: '',
    },
  },
  aplicacao_pessoal: {
    pergunta_auto_observacao: '',
    padrao_a_observar: '',
    gesto_concreto_semana: '',
  },
  autoeficacia: {
    nome_pratica: '',
    passos: ['', '', ''],
    indicador_eficacia: '',
  },
  registro_etico: {
    orientacao_jardim_psique: '',
    orientacao_jardim_oficio: '',
  },
  roteiro_aula: {
    roteiro: '',
  },
});

// ============================================
// LABELS — Para exibição no frontend
// ============================================
export const BLOCO_LABELS = {
  metadados: 'Metadados',
  sentido_jornada: 'Sentido da Jornada',
  essencia_80_20: 'Essência 80/20',
  raiz_psiquica: 'Raiz Psíquica',
  aplicacao_profissional: 'Aplicação Profissional',
  aplicacao_pessoal: 'Aplicação Pessoal',
  autoeficacia: 'Prática de Autoeficácia',
  registro_etico: 'Registro Ético',
  roteiro_aula: 'Roteiro de Aula (Vídeo/Áudio)',
} as const;

export const BLOCO_ICONS = {
  metadados: 'FileText',
  sentido_jornada: 'Compass',
  essencia_80_20: 'Target',
  raiz_psiquica: 'Brain',
  aplicacao_profissional: 'Briefcase',
  aplicacao_pessoal: 'Heart',
  autoeficacia: 'Zap',
  registro_etico: 'Shield',
  roteiro_aula: 'Video',
} as const;
