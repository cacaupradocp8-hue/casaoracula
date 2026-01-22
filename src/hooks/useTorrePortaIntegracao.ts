import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Tipos de Torre
export type TorreId = 'controle' | 'performance' | 'silencio' | 'cuidado' | 'adaptacao' | 'espiritualizacao' | 'forca';

export interface TorrePortaRelacao {
  id: string;
  porta_id: string;
  torre_id: TorreId;
  frequencia: 'muito_frequente' | 'comum' | 'ocasional';
  risco_conducao: string | null;
  ajuste_com_torre: string | null;
  ordem: number;
  created_at: string;
}

export interface TorreCasoClinico {
  id: string;
  torre_id: TorreId;
  porta_ativa_nome: string;
  cena: string;
  leitura_sem_torre: string;
  leitura_com_torre: string;
  resultado: string;
  ativa: boolean;
  created_at: string;
  updated_at: string;
}

// Metadata das Torres para UI
export const TORRE_METADATA: Record<TorreId, { nome: string; cor: string; icone: string }> = {
  controle: { nome: "Torre do Controle", cor: "from-slate-600 to-slate-800", icone: "Shield" },
  performance: { nome: "Torre da Performance", cor: "from-amber-500 to-orange-600", icone: "Star" },
  silencio: { nome: "Torre do Silêncio", cor: "from-indigo-600 to-purple-800", icone: "Moon" },
  cuidado: { nome: "Torre do Cuidado", cor: "from-rose-500 to-pink-600", icone: "Heart" },
  adaptacao: { nome: "Torre da Adaptação", cor: "from-teal-500 to-cyan-600", icone: "Waves" },
  espiritualizacao: { nome: "Torre da Espiritualização", cor: "from-violet-500 to-purple-600", icone: "Sparkles" },
  forca: { nome: "Torre da Força", cor: "from-red-600 to-orange-700", icone: "Flame" },
};

/**
 * Busca Torres associadas a uma Porta específica
 */
export function useTorresPorPorta(portaId: string | undefined) {
  return useQuery({
    queryKey: ["torre-porta-relacao", portaId],
    queryFn: async () => {
      if (!portaId) return [];
      
      const { data, error } = await supabase
        .from("torre_porta_relacao")
        .select("*")
        .eq("porta_id", portaId)
        .order("ordem");
      
      if (error) throw error;
      return data as TorrePortaRelacao[];
    },
    enabled: !!portaId,
  });
}

/**
 * Busca Caso-Clínico Modelo de uma Torre específica
 */
export function useCasoClinico(torreId: TorreId | undefined) {
  return useQuery({
    queryKey: ["torre-caso-clinico", torreId],
    queryFn: async () => {
      if (!torreId) return null;
      
      const { data, error } = await supabase
        .from("torre_casos_clinicos")
        .select("*")
        .eq("torre_id", torreId)
        .eq("ativa", true)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
      }
      return data as TorreCasoClinico;
    },
    enabled: !!torreId,
  });
}

/**
 * Busca todos os Casos-Clínicos Modelo
 */
export function useCasosClinicosAll() {
  return useQuery({
    queryKey: ["torre-casos-clinicos-all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("torre_casos_clinicos")
        .select("*")
        .order("torre_id");
      
      if (error) throw error;
      return data as TorreCasoClinico[];
    },
  });
}

/**
 * Busca todas as relações Torre-Porta (para admin)
 */
export function useTorrePortaRelacoesAll() {
  return useQuery({
    queryKey: ["torre-porta-relacoes-all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("torre_porta_relacao")
        .select("*")
        .order("porta_id");
      
      if (error) throw error;
      return data as TorrePortaRelacao[];
    },
  });
}
