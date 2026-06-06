/**
 * Motor de Derivação Automática do PERFIL ESTRUTURAL ORÁCULA™
 * Gera a configuração base da CidadELA a partir das médias estáveis (Big Five).

 * Pergunta Âncora: "Como esta pessoa costuma habitar o mundo?"
 * Zero escolha subjetiva — 100% determinístico.
 */

import { normalizarMedias, type MediasFatores } from './leituraComportamental';

// ─── Tipos ───

export interface CidadelaDerivada {
  porta_inicial: string;
  porta_inicial_nome: string;
  torre_dominante: string;
  clima_cidadela: string;
  distritos_acesos: string[];
  cor_derivada: string;
  cor_hex: string;
  atmosfera_derivada: string[];
  simbolo_derivado: string;
  simbolo_icon: string;
  indice_equilibrio: number;
  // Novos campos de estado vibracional
  territorio_dominante?: string;
  territorio_tensao?: string;
  territorio_adormecido?: string;
}

// ─── Mapeamento eixo → distritos ───

const EIXO_DISTRITOS: Record<keyof MediasFatores, string[]> = {
  porta_do_possivel: ['portao_chegada', 'portal_renascimento'],
  torre_interna: ['torres', 'conselho_interior'],
  campo_do_outro: ['espelho_vinculos', 'bosque_arquetipos'],
  voz_no_mundo: ['forja', 'praca_integracao'],
  porta_do_abalo: ['praca_abalo', 'labirinto', 'casa_sonhos'],
};

// ─── Mapeamento eixo → porta de trabalho ───

const EIXO_PORTA: Record<keyof MediasFatores, { key: string; nome: string }> = {
  porta_do_possivel: { key: 'porta_do_possivel', nome: 'Porta do Possível' },
  torre_interna: { key: 'torre_interna', nome: 'Torre Interna' },
  campo_do_outro: { key: 'campo_do_outro', nome: 'Campo do Outro' },
  voz_no_mundo: { key: 'voz_no_mundo', nome: 'Voz no Mundo' },
  porta_do_abalo: { key: 'porta_do_abalo', nome: 'Porta do Abalo' },
};

// ─── Mapeamento eixo dominante → cor ───

const EIXO_COR: Record<keyof MediasFatores, { nome: string; hex: string }> = {
  torre_interna: { nome: 'Prata', hex: '#A8B2BD' },
  porta_do_possivel: { nome: 'Ouro', hex: '#C9A24A' },
  campo_do_outro: { nome: 'Rosa', hex: '#B07A8A' },
  voz_no_mundo: { nome: 'Vermelho', hex: '#9E3B3B' },
  porta_do_abalo: { nome: 'Roxo', hex: '#6B3B7A' },
};

// ─── Mapeamento eixo dominante → símbolo ───

const EIXO_SIMBOLO: Record<keyof MediasFatores, { nome: string; icon: string }> = {
  torre_interna: { nome: 'Escudo', icon: '🛡️' },
  porta_do_possivel: { nome: 'Chave', icon: '🗝️' },
  campo_do_outro: { nome: 'Espelho', icon: '🪞' },
  voz_no_mundo: { nome: 'Fogo', icon: '🔥' },
  porta_do_abalo: { nome: 'Labirinto', icon: '🌀' },
};

// ─── Clima da cidade ───

function derivarClima(tensao: string, abaloMedia: number): string {
  const abaloAlto = abaloMedia >= 3.5;
  const abaloMedio = abaloMedia >= 2.5;

  if (tensao === 'controle vs colapso') return abaloAlto ? 'Tempestuosa' : 'Atmosfera densa';
  if (tensao === 'estrutura vs expressão') return abaloAlto ? 'Nebulosa e contida' : 'Organizada mas silenciosa';
  if (tensao === 'pertencimento vs autonomia') return abaloAlto ? 'Instável e carente' : 'Flutuante';
  if (tensao === 'expansão vs segurança') return abaloMedio ? 'Inquieta' : 'Viva e cautelosa';
  if (tensao === 'expressão vs aceitação') return abaloAlto ? 'Sufocada' : 'Vibrante mas insegura';
  return abaloAlto ? 'Em transição' : 'Atmosfera em revelação';
}

// ─── Atmosfera derivada ───

function derivarAtmosfera(medias: MediasFatores): string[] {
  const atm: string[] = [];
  const { torre_interna, porta_do_possivel, campo_do_outro, voz_no_mundo, porta_do_abalo } = medias;

  if (torre_interna >= 3.5) atm.push('Organizada');
  else if (torre_interna <= 2.5) atm.push('Caótica');

  if (porta_do_abalo >= 3.5) atm.push('Agitada');
  else if (porta_do_abalo <= 2.5) atm.push('Calma');

  if (porta_do_possivel >= 3.5) atm.push('Esperançosa');
  else if (porta_do_possivel <= 2.0) atm.push('Fechada');

  if (voz_no_mundo >= 3.5) atm.push('Viva');
  else if (voz_no_mundo <= 2.5) atm.push('Estática');

  if (campo_do_outro >= 3.5 && porta_do_abalo <= 2.5) atm.push('Segura');
  if (campo_do_outro <= 2.0) atm.push('Fria');

  // Limitar a 4
  return atm.slice(0, 4);
}

// ─── Torre dominante ───

function derivarTorreDominante(medias: MediasFatores): string {
  const { torre_interna, voz_no_mundo, campo_do_outro, porta_do_abalo } = medias;

  // Combinação: torre alta + voz alta = torre da expressão
  if (torre_interna >= 3.5 && voz_no_mundo >= 3.5) return 'Torre da Expressão Estruturada';
  // Torre alta + campo alto = torre do vínculo
  if (torre_interna >= 3.5 && campo_do_outro >= 3.5) return 'Torre do Vínculo Protegido';
  // Torre alta + abalo alto = torre da vigilância
  if (torre_interna >= 3.5 && porta_do_abalo >= 3.5) return 'Torre da Vigilância';
  // Abalo alto + campo alto = torre da fusão
  if (porta_do_abalo >= 3.5 && campo_do_outro >= 3.5) return 'Torre da Fusão';
  // Voz alta + campo alto = torre da presença
  if (voz_no_mundo >= 3.5 && campo_do_outro >= 3.5) return 'Torre da Presença Relacional';
  // Torre alta solo
  if (torre_interna >= 3.5) return 'Torre do Controle';
  // Voz alta solo
  if (voz_no_mundo >= 3.5) return 'Torre da Voz';
  // Campo alto solo
  if (campo_do_outro >= 3.5) return 'Torre do Outro';
  // Abalo alto solo
  if (porta_do_abalo >= 3.5) return 'Torre do Abalo';
  // Fallback
  return 'Torre em revelação';
}

// ─── Distritos acesos ───

function derivarDistritosAcesos(medias: MediasFatores): string[] {
  const acesos: string[] = [];
  const entries = Object.entries(medias) as [keyof MediasFatores, number][];

  for (const [eixo, valor] of entries) {
    if (valor >= 3.0) {
      const distritos = EIXO_DISTRITOS[eixo];
      if (valor >= 4.0) {
        acesos.push(...distritos); // Todos acesos
      } else {
        acesos.push(distritos[0]); // Só o principal
      }
    }
  }

  return [...new Set(acesos)];
}

// ─── Índice de equilíbrio ───

function calcularIndiceEquilibrio(medias: MediasFatores): number {
  const valores = Object.values(medias);
  const media = valores.reduce((a, b) => a + b, 0) / valores.length;
  const variancia = valores.reduce((sum, v) => sum + Math.pow(v - media, 2), 0) / valores.length;
  const desvio = Math.sqrt(variancia);

  // Equilíbrio = alto quando os eixos são equilibrados (baixo desvio)
  // Normalizar: desvio max possível é ~2 (1 a 5 scale), equilibrio 0-100
  const equilibrio = Math.round(Math.max(0, Math.min(100, (1 - desvio / 2) * 100)));
  return equilibrio;
}

// ─── Função principal ───

export function derivarCidadela(
  rawMedias: Record<string, any>,
  tensaoCentral: string
): CidadelaDerivada {
  const medias = normalizarMedias(rawMedias);

  // Lógica de Territórios Vibracionais baseada nas respostas de escolha forçada
  const counts: Record<string, number> = {};
  Object.values(rawMedias).forEach(v => {
    if (typeof v === 'string') counts[v] = (counts[v] || 0) + 1;
  });

  const sortedTerritories = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const dominante = sortedTerritories[0]?.[0];
  
  // Tensão: Busca o segundo território com mais votos, ou um território de abalo se houver
  const tensao = sortedTerritories.length > 1 ? sortedTerritories[1]?.[0] : (counts['praca_abalo'] || counts['labirinto'] ? (counts['praca_abalo'] > (counts['labirinto'] || 0) ? 'praca_abalo' : 'labirinto') : undefined);
  
  // Adormecido: Um território oficial que não teve NENHUM voto
  const OFICIAIS = ['portao_chegada', 'torres', 'portas', 'labirinto', 'conselho_interior', 'bosque_arquetipos', 'casa_matriz', 'casa_sonhos', 'espelho_vinculos', 'praca_abalo', 'forja', 'portal_renascimento'];
  const adormecido = OFICIAIS.find(t => !counts[t]) || OFICIAIS[Math.floor(Math.random() * OFICIAIS.length)];

  // Porta inicial = eixo com maior média
  const entries = Object.entries(medias) as [keyof MediasFatores, number][];
  const [eixoDominante] = entries.sort((a, b) => b[1] - a[1])[0];
  const porta = EIXO_PORTA[eixoDominante];
  const cor = EIXO_COR[eixoDominante];
  const simbolo = EIXO_SIMBOLO[eixoDominante];

  return {
    porta_inicial: dominante || porta.key,
    porta_inicial_nome: dominante ? dominante.replace(/_/g, ' ') : porta.nome,
    torre_dominante: derivarTorreDominante(medias),
    clima_cidadela: derivarClima(tensaoCentral, medias.porta_do_abalo),
    distritos_acesos: derivarDistritosAcesos(medias),
    cor_derivada: cor.nome,
    cor_hex: cor.hex,
    atmosfera_derivada: derivarAtmosfera(medias),
    simbolo_derivado: simbolo.nome,
    simbolo_icon: simbolo.icon,
    indice_equilibrio: calcularIndiceEquilibrio(medias),
    territorio_dominante: dominante,
    territorio_tensao: tensao,
    territorio_adormecido: adormecido
  };
}
