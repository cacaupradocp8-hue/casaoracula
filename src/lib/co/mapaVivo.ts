import { supabase } from "@/integrations/supabase/client";

type DetectorTipo = "estagnacao" | "dissociacao" | "evitacao" | "fusao";
type Intensidade = "baixa" | "media" | "alta";

/**
 * Deriva e persiste o estado do co_mapa_vivo a partir dos detectores e intervenções
 * recentes do cliente. Idempotente — pode ser chamado após cada novo detector ou
 * intervenção.
 */
export async function refreshMapaVivo(clientUserId: string) {
  const { data: detectores } = await supabase
    .from("co_detectores_eventos")
    .select("detector_tipo, intensidade, created_at")
    .eq("client_user_id", clientUserId)
    .order("created_at", { ascending: false })
    .limit(20);

  const { data: intervencoes } = await supabase
    .from("co_intervencoes")
    .select("tipo, houve_deslocamento, created_at")
    .eq("client_user_id", clientUserId)
    .order("created_at", { ascending: false })
    .limit(20);

  const dets = (detectores || []) as Array<{
    detector_tipo: DetectorTipo;
    intensidade: Intensidade;
  }>;
  const ints = (intervencoes || []) as Array<{
    tipo: string;
    houve_deslocamento: boolean;
  }>;

  const count = (t: DetectorTipo) => dets.filter((d) => d.detector_tipo === t).length;
  const hasHigh = (t: DetectorTipo) =>
    dets.some((d) => d.detector_tipo === t && d.intensidade === "alta");

  const deslocamentos = ints.filter((i) => i.houve_deslocamento).length;
  const totalInts = ints.length;

  // Eixo movimento
  let eixo_movimento: "estagnacao" | "oscilacao" | "deslocamento" = "estagnacao";
  if (deslocamentos >= 2) eixo_movimento = "deslocamento";
  else if (deslocamentos === 1 || count("estagnacao") <= 1) eixo_movimento = "oscilacao";
  else if (count("estagnacao") >= 3 || hasHigh("estagnacao")) eixo_movimento = "estagnacao";

  // Presença emocional
  let presenca_emocional: "baixa" | "parcial" | "integrada" = "parcial";
  if (hasHigh("dissociacao") || count("dissociacao") >= 3) presenca_emocional = "baixa";
  else if (deslocamentos >= 2 && count("dissociacao") === 0) presenca_emocional = "integrada";

  // Eixo confronto
  let eixo_confronto: "evita" | "oscila" | "sustenta" = "oscila";
  if (hasHigh("evitacao") || count("evitacao") >= 3) eixo_confronto = "evita";
  else if (deslocamentos >= 2) eixo_confronto = "sustenta";

  // Regulação
  let regulacao: "desorganizada" | "instavel" | "regulada" = "instavel";
  if (hasHigh("fusao") || count("fusao") >= 3) regulacao = "desorganizada";
  else if (totalInts >= 2 && deslocamentos / Math.max(totalInts, 1) >= 0.5)
    regulacao = "regulada";

  await supabase
    .from("co_mapa_vivo")
    .upsert(
      {
        client_user_id: clientUserId,
        eixo_movimento,
        presenca_emocional,
        eixo_confronto,
        regulacao,
      },
      { onConflict: "client_user_id" }
    );

  return { eixo_movimento, presenca_emocional, eixo_confronto, regulacao };
}
