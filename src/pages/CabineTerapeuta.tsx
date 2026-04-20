import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, AlertTriangle, Users, Activity, Shield, ArrowRight } from "lucide-react";
import { refreshMapaVivo } from "@/lib/co/mapaVivo";
import { Link } from "react-router-dom";

interface Cliente {
  id: string;
  nome: string;
  client_user_id: string | null;
}

interface Detector {
  id: string;
  detector_tipo: "estagnacao" | "dissociacao" | "evitacao" | "fusao";
  intensidade: "baixa" | "media" | "alta";
  origem: string;
  descricao: string | null;
  created_at: string;
}

interface MapaVivo {
  eixo_movimento: string;
  presenca_emocional: string;
  eixo_confronto: string;
  regulacao: string;
  updated_at: string;
}

const TIPO_INTERVENCAO = [
  { key: "ruptura", label: "Pergunta de ruptura" },
  { key: "limite", label: "Limite" },
  { key: "grounding", label: "Grounding" },
  { key: "redirecionamento", label: "Redirecionamento" },
] as const;

const TIPO_LABEL: Record<string, string> = {
  estagnacao: "Estagnação",
  dissociacao: "Dissociação",
  evitacao: "Evitação",
  fusao: "Fusão emocional",
};

const INTENSIDADE_COLOR: Record<string, string> = {
  baixa: "bg-muted text-muted-foreground",
  media: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  alta: "bg-destructive/15 text-destructive",
};

export default function CabineTerapeuta() {
  const { user } = useAuth();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [selected, setSelected] = useState<Cliente | null>(null);
  const [detectores, setDetectores] = useState<Detector[]>([]);
  const [mapa, setMapa] = useState<MapaVivo | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [dialogTipo, setDialogTipo] = useState<string | null>(null);
  const [intDescricao, setIntDescricao] = useState("");
  const [intDeslocamento, setIntDeslocamento] = useState(false);
  const [savingInt, setSavingInt] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("clientes")
        .select("id, nome, client_user_id")
        .eq("terapeuta_id", user.id)
        .eq("status", "ativo")
        .order("nome");
      const list = (data || []).filter((c) => c.client_user_id) as Cliente[];
      setClientes(list);
      if (list.length > 0) setSelected(list[0]);
      setLoading(false);
    })();
  }, [user]);

  const loadDetail = async (clientUserId: string) => {
    setLoadingDetail(true);
    const [{ data: dets }, { data: m }] = await Promise.all([
      supabase
        .from("co_detectores_eventos")
        .select("id, detector_tipo, intensidade, origem, descricao, created_at")
        .eq("client_user_id", clientUserId)
        .order("created_at", { ascending: false })
        .limit(15),
      supabase
        .from("co_mapa_vivo")
        .select("eixo_movimento, presenca_emocional, eixo_confronto, regulacao, updated_at")
        .eq("client_user_id", clientUserId)
        .maybeSingle(),
    ]);
    setDetectores((dets as Detector[]) || []);
    setMapa((m as MapaVivo) || null);
    setLoadingDetail(false);
  };

  useEffect(() => {
    if (selected?.client_user_id) loadDetail(selected.client_user_id);
  }, [selected]);

  const alertasAtivos = useMemo(() => {
    const recent = detectores.slice(0, 10);
    const tipos = new Map<string, Detector>();
    for (const d of recent) {
      const existing = tipos.get(d.detector_tipo);
      if (!existing || (d.intensidade === "alta" && existing.intensidade !== "alta")) {
        tipos.set(d.detector_tipo, d);
      }
    }
    return Array.from(tipos.values());
  }, [detectores]);

  const handleRegistrarIntervencao = async () => {
    if (!user || !selected?.client_user_id || !dialogTipo) return;
    setSavingInt(true);
    try {
      const { error } = await supabase.from("co_intervencoes").insert({
        therapist_user_id: user.id,
        client_user_id: selected.client_user_id,
        tipo: dialogTipo,
        descricao: intDescricao.trim() || null,
        houve_deslocamento: intDeslocamento,
      });
      if (error) throw error;

      await refreshMapaVivo(selected.client_user_id);
      await loadDetail(selected.client_user_id);

      toast.success("Intervenção registrada.");
      setDialogTipo(null);
      setIntDescricao("");
      setIntDeslocamento(false);
    } catch (e: any) {
      toast.error(e.message || "Não foi possível registrar.");
    } finally {
      setSavingInt(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl md:text-3xl text-foreground">Cabine da Terapeuta</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Estado clínico vivo dos seus campos.
            </p>
          </div>
          <Button variant="outline" asChild size="sm">
            <Link to="/mapa-vivo">
              Ver Mapa Vivo <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_300px] gap-4">
          {/* ESQUERDA — clientes */}
          <Card className="p-4 h-fit lg:sticky lg:top-4">
            <div className="flex items-center gap-2 mb-3 text-sm font-medium text-foreground/80">
              <Users className="h-4 w-4" /> Clientes
            </div>
            <ScrollArea className="h-[60vh]">
              <div className="space-y-1 pr-2">
                {clientes.length === 0 && (
                  <p className="text-xs text-muted-foreground p-2">
                    Nenhuma cliente vinculada com acesso ativo.
                  </p>
                )}
                {clientes.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelected(c)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      selected?.id === c.id
                        ? "bg-primary/10 text-foreground font-medium"
                        : "hover:bg-muted text-foreground/70"
                    }`}
                  >
                    {c.nome}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </Card>

          {/* CENTRO — estado atual */}
          <Card className="p-6 min-h-[400px]">
            {!selected ? (
              <p className="text-sm text-muted-foreground">Selecione uma cliente.</p>
            ) : loadingDetail ? (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            ) : (
              <>
                <div className="mb-6">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                    Cliente
                  </p>
                  <h2 className="font-serif text-xl text-foreground">{selected.nome}</h2>
                </div>

                <section className="mb-6">
                  <div className="flex items-center gap-2 mb-3 text-sm font-medium">
                    <Activity className="h-4 w-4" /> Estado do campo
                  </div>
                  {mapa ? (
                    <div className="grid grid-cols-2 gap-3">
                      <EstadoCell label="Movimento" value={mapa.eixo_movimento} />
                      <EstadoCell label="Presença emocional" value={mapa.presenca_emocional} />
                      <EstadoCell label="Confronto" value={mapa.eixo_confronto} />
                      <EstadoCell label="Regulação" value={mapa.regulacao} />
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      Mapa ainda não derivado. Será gerado após o primeiro detector.
                    </p>
                  )}
                </section>

                <section>
                  <h3 className="text-sm font-medium mb-3">Sugestões de intervenção</h3>
                  <div className="flex flex-wrap gap-2">
                    {TIPO_INTERVENCAO.map((t) => (
                      <Button
                        key={t.key}
                        variant="outline"
                        size="sm"
                        onClick={() => setDialogTipo(t.key)}
                        className="rounded-full"
                      >
                        {t.label}
                      </Button>
                    ))}
                  </div>
                </section>

                {detectores.length > 0 && (
                  <section className="mt-8">
                    <h3 className="text-sm font-medium mb-3 text-foreground/70">
                      Eventos recentes
                    </h3>
                    <div className="space-y-2">
                      {detectores.slice(0, 6).map((d) => (
                        <div
                          key={d.id}
                          className="flex items-start gap-3 text-sm border-b border-border/30 pb-2"
                        >
                          <Badge
                            variant="secondary"
                            className={`${INTENSIDADE_COLOR[d.intensidade]} border-0 text-xs`}
                          >
                            {TIPO_LABEL[d.detector_tipo]}
                          </Badge>
                          <div className="flex-1 min-w-0">
                            <p className="text-foreground/70 truncate">
                              {d.descricao || `via ${d.origem}`}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(d.created_at).toLocaleString("pt-BR")}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}
          </Card>

          {/* DIREITA — alertas */}
          <Card className="p-4 h-fit">
            <div className="flex items-center gap-2 mb-3 text-sm font-medium text-foreground/80">
              <Shield className="h-4 w-4" /> Alertas inteligentes
            </div>
            {alertasAtivos.length === 0 ? (
              <p className="text-xs text-muted-foreground p-2">
                Sem padrões detectados recentemente.
              </p>
            ) : (
              <div className="space-y-3">
                {alertasAtivos.map((a) => (
                  <div
                    key={a.id}
                    className="border border-border/40 rounded-md p-3 space-y-1"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                        <span className="text-sm font-medium">
                          {TIPO_LABEL[a.detector_tipo]}
                        </span>
                      </div>
                      <Badge
                        variant="secondary"
                        className={`${INTENSIDADE_COLOR[a.intensidade]} border-0 text-[10px] uppercase`}
                      >
                        {a.intensidade}
                      </Badge>
                    </div>
                    {a.descricao && (
                      <p className="text-xs text-muted-foreground line-clamp-2">{a.descricao}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Dialog intervenção */}
      <Dialog open={!!dialogTipo} onOpenChange={(o) => !o && setDialogTipo(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Registrar intervenção:{" "}
              {TIPO_INTERVENCAO.find((t) => t.key === dialogTipo)?.label}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-normal text-foreground/80">Descrição (opcional)</label>
              <Textarea
                value={intDescricao}
                onChange={(e) => setIntDescricao(e.target.value)}
                rows={3}
                placeholder="O que foi feito, como foi recebido..."
              />
            </div>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={intDeslocamento}
                onChange={(e) => setIntDeslocamento(e.target.checked)}
                className="rounded border-border"
              />
              Houve deslocamento perceptível na cliente
            </label>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialogTipo(null)}>
              Cancelar
            </Button>
            <Button onClick={handleRegistrarIntervencao} disabled={savingInt}>
              {savingInt ? <Loader2 className="h-4 w-4 animate-spin" /> : "Registrar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function EstadoCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-border/40 rounded-md p-3">
      <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className="text-sm font-medium text-foreground capitalize mt-1">{value}</p>
    </div>
  );
}
