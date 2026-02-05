// ============================================
// GUARDIÃ DO JARDIM — FRASES PRÉ-DEFINIDAS
// ============================================
// IA contida que sustenta o campo sem interpretar
// NUNCA edite essas frases para torná-las mais "acolhedoras" ou "personalizadas"
// A contenção É o cuidado.

export type GuardiaMomento = 
  | 'entrada'
  | 'check_in'
  | 'escrita_longa'
  | 'prazo_proximo'
  | 'fechamento'
  | 'jardim_fechado';

export interface GuardiaFrase {
  momento: GuardiaMomento;
  texto: string;
  icone: string;
}

// FRASES IMUTÁVEIS — Não adicione variações, não personalize
export const GUARDIA_FRASES: Record<GuardiaMomento, GuardiaFrase> = {
  entrada: {
    momento: 'entrada',
    texto: 'Este espaço existe para sustentar um gesto simples. Se algo ficar intenso, leve para a sessão.',
    icone: '🌿',
  },
  check_in: {
    momento: 'check_in',
    texto: 'Lembrete gentil: observe o gesto combinado. Nada precisa ser resolvido agora.',
    icone: '🕯️',
  },
  escrita_longa: {
    momento: 'escrita_longa',
    texto: 'Este campo é breve por intenção. O essencial já é suficiente.',
    icone: '✨',
  },
  prazo_proximo: {
    momento: 'prazo_proximo',
    texto: 'O Jardim se aproxima do fechamento. Repare no que foi possível sustentar.',
    icone: '🌙',
  },
  fechamento: {
    momento: 'fechamento',
    texto: 'O Jardim se fecha aqui. O que permanece segue com você para a próxima sessão.',
    icone: '🌸',
  },
  jardim_fechado: {
    momento: 'jardim_fechado',
    texto: 'Este Jardim está fechado. O gesto segue com você.',
    icone: '🔒',
  },
};

// Limites éticos para campos de texto (em caracteres)
export const GUARDIA_LIMITES = {
  chegada_vivo: 240,
  chegada_corpo: 100,
  integracao_observar: 300,
  gesto_descricao: 200,
  gesto_prazo_texto: 50,
  observacao_percebi: 180,
  fechamento_levo: 200,
  fechamento_deixo: 200,
} as const;

// Threshold para aviso de "escrita longa" (% do limite)
export const ESCRITA_LONGA_THRESHOLD = 0.85;

// Função helper para verificar se está próximo do prazo
export function isPrazoProximo(prazoDate: string | null): boolean {
  if (!prazoDate) return false;
  const prazo = new Date(prazoDate);
  const agora = new Date();
  const diffDias = Math.ceil((prazo.getTime() - agora.getTime()) / (1000 * 60 * 60 * 24));
  return diffDias >= 0 && diffDias <= 2; // 2 dias ou menos
}

// Função helper para verificar se jardim está expirado
export function isJardimExpirado(prazoDate: string | null): boolean {
  if (!prazoDate) return false;
  const prazo = new Date(prazoDate);
  return prazo < new Date();
}
