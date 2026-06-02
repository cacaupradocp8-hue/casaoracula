/**
 * Perfil Estrutural Orácula™ & Cartografia Psíquica Orácula™
 * Definições de contratos e tipos para as duas camadas da arquitetura.
 */

export type NivelDistrito = 'alto' | 'medio' | 'baixo';
export type NivelAtencao = 'baixo' | 'moderado' | 'alto';

// ==========================================
// CAMADA 1: PERFIL ESTRUTURAL ORÁCULA™
// ==========================================
// Objetivo: Compreender como a pessoa tende a funcionar (o "motor" estável).

export interface PerfilEstruturalOracula {
  /** "Como esta pessoa costuma habitar o mundo?" */
  pergunta_ancora_estrutural: string;
  
  /** Clima base derivado do perfil psicológico */
  clima_estrutural: string;
  
  /** Distritos que compõem a natureza estável da pessoa */
  distritos_naturais: string[];
  
  /** Torre que representa a estratégia central de funcionamento */
  torre_dominante: string;
  
  /** Índice de harmonia entre os eixos do Big Five Oracular */
  indice_equilibrio: number;
}

// ==========================================
// CAMADA 2: CARTOGRAFIA PSÍQUICA ORÁCULA™
// ==========================================
// Objetivo: Compreender onde a pessoa está habitando agora (estado atual).

export interface CartografiaPsiquicaOracula {
  /** "Em que distrito da sua cidade você está habitando agora?" */
  pergunta_ancora_estado: string;
  
  /** Distritos com alta carga de energia no momento atual (Cidadela Viva) */
  distritos_vivos: string[];

  
  /** Distritos que estão sem energia ou evitados no momento */
  distritos_negligenciados: string[] | null;
  
  /** O movimento psicológico que está dominando o estado atual */
  movimento_dominante: string | null;
  
  /** A travessia sugerida para o momento presente */
  travessia_sugerida: string | null;
  
  /** A ferramenta da Cidadela para iniciar o trabalho agora */
  ferramenta_inicial_sugerida: string | null;
}

// Re-exporting legacy names for backward compatibility during transition
/** @deprecated Usar PerfilEstruturalOracula.distritos_naturais */
export type LegacyDistritosAcesos = string[];
/** @deprecated Usar CartografiaPsiquicaOracula.distritos_vivos */
export type LegacyDistritosAtivos = string[];

export type { NivelDistrito as LegacyNivelDistrito, NivelAtencao as LegacyNivelAtencao };
