import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface RadiestesiaConfig {
  intro_pedagogica?: {
    titulo: string;
    texto: string;
    ativo: boolean;
  };
  secao_clinica?: {
    titulo: string;
    descricao: string;
    ativo: boolean;
  };
  secao_oracular?: {
    titulo: string;
    descricao: string;
    ativo: boolean;
  };
  secao_estudo?: {
    titulo: string;
    descricao: string;
    ativo: boolean;
  };
  amplificador_destaque?: {
    titulo: string;
    descricao: string;
    uso_recomendado: string;
    contexto_simbolico: string;
    ativo: boolean;
  };
}

export interface Grafico {
  id: string;
  nome: string;
  slug: string | null;
  autor: string | null;
  origem: string;
  categoria: string;
  tipo_leitura: string;
  tipo_acao: string | null;
  para_que_serve: string | null;
  quando_usar: string | null;
  quando_nao_usar: string | null;
  como_usar: string | null;
  erro_iniciante: string | null;
  nivel_intensidade: string | null;
  observacao_etica: string | null;
  observacoes_simbolicas: string | null;
  imagem_url: string | null;
  combinacoes: string[];
  ordem: number;
  ativo: boolean;
  // Campos da loja
  link_loja: string | null;
  imagem_fisica_url: string | null;
  disponivel_loja: boolean;
}

export interface Cristal {
  id: string;
  nome: string;
  explicacao_simbolica: string | null;
  quando_usar: string | null;
  quando_evitar: string | null;
  alerta_excesso: string | null;
  campos: string[];
  estados: string[];
  graficos_associados: string[];
  link_externo: string | null;
  imagem_url: string | null;
  ordem: number;
  ativo: boolean;
}

export function useRadiestesiaConfig() {
  const [config, setConfig] = useState<RadiestesiaConfig>({});
  const [graficos, setGraficos] = useState<Grafico[]>([]);
  const [cristais, setCristais] = useState<Cristal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchConfig = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("radiestesia_config")
        .select("*");

      if (error) throw error;

      const configMap: RadiestesiaConfig = {};
      data?.forEach((item: any) => {
        configMap[item.chave as keyof RadiestesiaConfig] = item.valor;
      });

      setConfig(configMap);
    } catch (error) {
      console.error("Error fetching radiestesia config:", error);
    }
  }, []);

  const fetchGraficos = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("radiestesia_graficos")
        .select("*")
        .order("ordem", { ascending: true });

      if (error) throw error;
      setGraficos(data || []);
    } catch (error) {
      console.error("Error fetching graficos:", error);
    }
  }, []);

  const fetchCristais = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("radiestesia_cristais")
        .select("*")
        .order("ordem", { ascending: true });

      if (error) throw error;
      setCristais(data || []);
    } catch (error) {
      console.error("Error fetching cristais:", error);
    }
  }, []);

  useEffect(() => {
    const loadAll = async () => {
      setIsLoading(true);
      await Promise.all([fetchConfig(), fetchGraficos(), fetchCristais()]);
      setIsLoading(false);
    };
    loadAll();
  }, [fetchConfig, fetchGraficos, fetchCristais]);

  return {
    config,
    graficos,
    cristais,
    isLoading,
    refetch: () => Promise.all([fetchConfig(), fetchGraficos(), fetchCristais()]),
  };
}
