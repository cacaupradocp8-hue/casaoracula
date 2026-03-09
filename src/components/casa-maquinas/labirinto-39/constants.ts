export type EstadoPorta = 'aberta' | 'fechada' | 'trancada' | null;

export interface Porta {
  emocao: string;
  grupo: string;
  estado: EstadoPorta;
}

export interface GrupoEmocional {
  nome: string;
  cor: string;
  emocoes: string[];
}

export const GRUPOS: GrupoEmocional[] = [
  { nome: 'Energia', cor: '#C9A24A', emocoes: ['Raiva', 'Paixão', 'Entusiasmo', 'Coragem', 'Força'] },
  { nome: 'Abertura', cor: '#6EBF8B', emocoes: ['Alegria', 'Esperança', 'Amor', 'Confiança', 'Gratidão'] },
  { nome: 'Repouso', cor: '#7BA7C9', emocoes: ['Paz', 'Serenidade', 'Aceitação', 'Contentamento', 'Segurança'] },
  { nome: 'Reflexão', cor: '#9B8EC4', emocoes: ['Curiosidade', 'Contemplação', 'Introspecção', 'Sabedoria', 'Compreensão'] },
  { nome: 'Vulnerabilidade', cor: '#D4756B', emocoes: ['Medo', 'Tristeza', 'Dor', 'Desespero', 'Desamparo'] },
  { nome: 'Confusão', cor: '#C4A87B', emocoes: ['Confusão', 'Ambiguidade', 'Incerteza', 'Perplexidade', 'Desorientação'] },
  { nome: 'Rejeição', cor: '#B06B8F', emocoes: ['Vergonha', 'Culpa', 'Humilhação', 'Rejeição', 'Inadequação'] },
  { nome: 'Proteção', cor: '#7B8C6E', emocoes: ['Ciúme', 'Inveja', 'Ressentimento', 'Amargura', 'Desconfiança'] },
];

export function buildInitialPortas(): Porta[] {
  return GRUPOS.flatMap(g =>
    g.emocoes.map(e => ({ emocao: e, grupo: g.nome, estado: null as EstadoPorta }))
  );
}

export function calcStats(portas: Porta[]) {
  const mapped = portas.filter(p => p.estado !== null);
  const abertas = portas.filter(p => p.estado === 'aberta');
  const fechadas = portas.filter(p => p.estado === 'fechada');
  const trancadas = portas.filter(p => p.estado === 'trancada');

  const byGrupo = GRUPOS.map(g => {
    const gPortas = portas.filter(p => p.grupo === g.nome);
    return {
      nome: g.nome,
      cor: g.cor,
      abertas: gPortas.filter(p => p.estado === 'aberta').length,
      fechadas: gPortas.filter(p => p.estado === 'fechada').length,
      trancadas: gPortas.filter(p => p.estado === 'trancada').length,
      total: gPortas.length,
    };
  });

  const maisAcessivel = [...byGrupo].sort((a, b) => b.abertas - a.abertas)[0];
  const menosAcessivel = [...byGrupo].sort((a, b) => a.abertas - b.abertas)[0];

  return {
    mapped: mapped.length,
    abertas: abertas.length,
    fechadas: fechadas.length,
    trancadas: trancadas.length,
    byGrupo,
    maisAcessivel,
    menosAcessivel,
  };
}
