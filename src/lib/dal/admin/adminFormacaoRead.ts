import { supabase } from "@/integrations/supabase/client";

export interface ModuloFormativo {
  id: string;
  nome_modulo: string;
  tipo_modulo: string;
  descricao_curta: string | null;
  imagem_capa: string | null;
  ordem_exibicao: number;
  nivel_acesso: string;
  status_publicacao: string;
  destaque_vitrine: boolean;
  rota_destino: string | null;
  created_at: string;
  updated_at: string;
}

export interface RouteOption {
  value: string;
  label: string;
  group: string;
}

/**
 * Lista todos os módulos formativos para o Admin, ordenados por exibição.
 */
export async function listAdminModulosFormativos(): Promise<ModuloFormativo[]> {
  const { data, error } = await supabase
    .from("modulos_formativos")
    .select("*")
    .order("ordem_exibicao", { ascending: true });

  if (error) throw error;
  return data as ModuloFormativo[];
}

/**
 * Busca as configurações de banner do app_settings para o Admin.
 */
export async function getAdminBannerSettings(keys: string[]): Promise<Record<string, string>> {
  const { data, error } = await supabase
    .from("app_settings")
    .select("key, value")
    .in("key", keys);

  if (error) throw error;
  
  const map: Record<string, string> = {};
  data?.forEach((s) => (map[s.key] = s.value));
  return map;
}

/**
 * Consolida opções de rota (salas, cursos, ferramentas) para seletores no Admin.
 */
export async function getAvailableAdminRouteOptions(): Promise<RouteOption[]> {
  const [coursesRes, salasRes, toolsRes] = await Promise.all([
    supabase.from("courses").select("id, titulo, publicado").order("titulo"),
    supabase.from("salas").select("id, nome_exibicao, ativa").order("nome_exibicao"),
    supabase.from("sala_ferramentas").select("id, ferramenta_nome, rota, ativa, slug").order("ferramenta_nome"),
  ]);

  const options: RouteOption[] = [];

  // Salas
  salasRes.data?.forEach((s) => {
    options.push({
      value: `/sala/${s.id}`,
      label: `${s.nome_exibicao}${s.ativa ? "" : " (inativa)"}`,
      group: "Salas",
    });
  });

  // Cursos
  coursesRes.data?.forEach((c) => {
    options.push({
      value: `/curso/${c.id}`,
      label: `${c.titulo}${c.publicado ? "" : " (rascunho)"}`,
      group: "Cursos",
    });
  });

  // Ferramentas
  toolsRes.data?.forEach((t) => {
    const route = t.rota || (t.slug ? `/ferramenta/${t.slug}` : null);
    if (route) {
      options.push({
        value: route,
        label: `${t.ferramenta_nome}${t.ativa ? "" : " (inativa)"}`,
        group: "Ferramentas",
      });
    }
  });

  return options;
}
