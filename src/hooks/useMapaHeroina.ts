import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface MapaFase {
  id: string;
  fase_id: string;
  registrado_em: string;
  ativa: boolean;
  fase: {
    nome: string;
    icone: string;
  } | null;
}

export interface MapaArquetipo {
  id: string;
  arquetipo_id: string;
  polaridade_percebida: string | null;
  registrado_em: string;
  arquetipo: {
    nome: string;
    icone: string;
    descricao_luz?: string;
    descricao_sombra?: string;
  } | null;
}

export interface MapaCenario {
  id: string;
  metafora_id: string;
  anotacao_livre: string | null;
  registrado_em: string;
  metafora: {
    nome: string;
    icone: string;
    texto_evocativo?: string;
  } | null;
}

export interface MapaRitual {
  id: string;
  ritual_id: string;
  reflexao: string | null;
  completado_em: string | null;
  ritual: {
    nome: string;
    icone: string;
    descricao?: string;
  } | null;
}

export interface MapaHeroinaData {
  faseAtiva: MapaFase | null;
  ultimoArquetipo: MapaArquetipo | null;
  ultimoCenario: MapaCenario | null;
  ultimoRitual: MapaRitual | null;
  totalFases: number;
  totalArquetipos: number;
  totalCenarios: number;
  totalRituais: number;
  historicoFases: MapaFase[];
  historicoArquetipos: MapaArquetipo[];
  historicoCenarios: MapaCenario[];
  historicoRituais: MapaRitual[];
}

export function useMapaHeroina() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["mapa-heroina-completo", user?.id],
    queryFn: async (): Promise<MapaHeroinaData> => {
      if (!user?.id) {
        return {
          faseAtiva: null,
          ultimoArquetipo: null,
          ultimoCenario: null,
          ultimoRitual: null,
          totalFases: 0,
          totalArquetipos: 0,
          totalCenarios: 0,
          totalRituais: 0,
          historicoFases: [],
          historicoArquetipos: [],
          historicoCenarios: [],
          historicoRituais: [],
        };
      }

      // Fetch all data in parallel
      const [fasesRes, arquetiposRes, cenariosRes, rituaisRes] = await Promise.all([
        supabase
          .from("heroina_fase_ativa")
          .select("*, labirinto_fases(nome, icone)")
          .eq("user_id", user.id)
          .order("registrado_em", { ascending: false }),
        supabase
          .from("heroina_arquetipo_registros")
          .select("*, labirinto_arquetipos(nome, icone, descricao_luz, descricao_sombra)")
          .eq("user_id", user.id)
          .order("registrado_em", { ascending: false }),
        supabase
          .from("heroina_cenario_registros")
          .select("*, labirinto_metaforas(nome, icone, texto_evocativo)")
          .eq("user_id", user.id)
          .order("registrado_em", { ascending: false }),
        supabase
          .from("heroina_ritual_registros")
          .select("*, labirinto_rituais(nome, icone, descricao)")
          .eq("user_id", user.id)
          .order("completado_em", { ascending: false }),
      ]);

      const fases = (fasesRes.data || []).map((f) => ({
        id: f.id,
        fase_id: f.fase_id,
        registrado_em: f.registrado_em,
        ativa: f.ativa,
        fase: f.labirinto_fases,
      })) as MapaFase[];

      const arquetipos = (arquetiposRes.data || []).map((a) => ({
        id: a.id,
        arquetipo_id: a.arquetipo_id,
        polaridade_percebida: a.polaridade_percebida,
        registrado_em: a.registrado_em,
        arquetipo: a.labirinto_arquetipos,
      })) as MapaArquetipo[];

      const cenarios = (cenariosRes.data || []).map((c) => ({
        id: c.id,
        metafora_id: c.metafora_id,
        anotacao_livre: c.anotacao_livre,
        registrado_em: c.registrado_em,
        metafora: c.labirinto_metaforas,
      })) as MapaCenario[];

      const rituais = (rituaisRes.data || []).map((r) => ({
        id: r.id,
        ritual_id: r.ritual_id,
        reflexao: r.reflexao,
        completado_em: r.completado_em,
        ritual: r.labirinto_rituais,
      })) as MapaRitual[];

      const faseAtiva = fases.find((f) => f.ativa) || null;

      return {
        faseAtiva,
        ultimoArquetipo: arquetipos[0] || null,
        ultimoCenario: cenarios[0] || null,
        ultimoRitual: rituais[0] || null,
        totalFases: fases.length,
        totalArquetipos: arquetipos.length,
        totalCenarios: cenarios.length,
        totalRituais: rituais.length,
        historicoFases: fases,
        historicoArquetipos: arquetipos,
        historicoCenarios: cenarios,
        historicoRituais: rituais,
      };
    },
    enabled: !!user?.id,
  });
}
