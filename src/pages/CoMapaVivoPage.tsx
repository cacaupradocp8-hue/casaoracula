import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Loader2, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Cliente {
  id: string;
  nome: string;
  client_user_id: string;
}

interface MapaRow {
  client_user_id: string;
  eixo_movimento: string;
  presenca_emocional: string;
  eixo_confronto: string;
  regulacao: string;
  updated_at: string;
}

interface Snapshot {
  date: string;
  detectores: number;
  intervencoes: number;
  deslocamentos: number;
}

const VALUE_COLOR: Record<string, string> = {
  estagnacao: "text-destructive",
  oscilacao: "text-amber-600 dark:text-amber-400",
  deslocamento: "text-emerald-600 dark:text-emerald-400",
  baixa: "text-destructive",
  parcial: "text-amber-600 dark:text-amber-400",
  integrada: "text-emerald-600 dark:text-emerald-400",
  evita: "text-destructive",
  oscila: "text-amber-600 dark:text-amber-400",
  sustenta: "text-emerald-600 dark:text-emerald-400",
  desorganizada: "text-destructive",
  instavel: "text-amber-600 dark:text-amber-400",
  regulada: "text-emerald-600 dark:text-emerald-400",
};

export default function CoMapaVivoPage() {
  const { user } = useAuth();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [mapas, setMapas] = useState<Record<string, MapaRow>>({});
  const [selected, setSelected] = useState<Cliente | null>(null);
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: cls } = await supabase
        .from("clientes")
        .select("id, nome, client_user_id")
        .eq("terapeuta_id", user.id)
        .eq("status", "ativo")
        .not("client_user_id", "is", null)
        .order("nome");
      const list = (cls || []) as Cliente[];
      setClientes(list);

      if (list.length > 0) {
        const ids = list.map((c) => c.client_user_id);
        const { data: ms } = await supabase
          .from("co_mapa_vivo")
          .select("client_user_id, eixo_movimento, presenca_emocional, eixo_confronto, regulacao, updated_at")
          .in("client_user_id", ids);
        const map: Record<string, MapaRow> = {};
        (ms || []).forEach((m: any) => (map[m.client_user_id] = m));
        setMapas(map);
        setSelected(list[0]);
      }
      setLoading(false);
    })();
  }, [user]);

  useEffect(() => {
    if (!selected) return;
    (async () => {
      const since = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();
      const [{ data: dets }, { data: ints }] = await Promise.all([
        supabase
          .from("co_detectores_eventos")
          .select("created_at")
          .eq("client_user_id", selected.client_user_id)
          .gte("created_at", since),
        supabase
          .from("co_intervencoes")
          .select("created_at, houve_deslocamento")
          .eq("client_user_id", selected.client_user_id)
          .gte("created_at", since),
      ]);

      const byDay = new Map<string, Snapshot>();
      const ensure = (d: string) => {
        if (!byDay.has(d))
          byDay.set(d, { date: d, detectores: 0, intervencoes: 0, deslocamentos: 0 });
        return byDay.get(d)!;
      };
      (dets || []).forEach((r: any) => {
        const d = new Date(r.created_at).toISOString().slice(0, 10);
        ensure(d).detectores++;
      });
      (ints || []).forEach((r: any) => {
        const d = new Date(r.created_at).toISOString().slice(0, 10);
        const s = ensure(d);
        s.intervencoes++;
        if (r.houve_deslocamento) s.deslocamentos++;
      });
      setSnapshots(Array.from(byDay.values()).sort((a, b) => a.date.localeCompare(b.date)));
    })();
  }, [selected]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const m = selected ? mapas[selected.client_user_id] : null;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <header className="mb-8">
          <h1 className="font-serif text-3xl text-foreground flex items-center gap-3">
            <Activity className="h-6 w-6 text-primary" /> Mapa Vivo
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Evolução longitudinal do campo terapêutico de cada cliente.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
          <Card className="p-3 h-fit">
            <div className="space-y-1">
              {clientes.length === 0 && (
                <p className="text-xs text-muted-foreground p-2">Nenhuma cliente vinculada.</p>
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
          </Card>

          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="font-serif text-xl text-foreground mb-4">
                {selected?.nome || "—"}
              </h2>
              {m ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Eixo label="Movimento" value={m.eixo_movimento} />
                  <Eixo label="Presença emocional" value={m.presenca_emocional} />
                  <Eixo label="Confronto" value={m.eixo_confronto} />
                  <Eixo label="Regulação" value={m.regulacao} />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  Mapa ainda não derivado para esta cliente.
                </p>
              )}
              {m && (
                <p className="text-xs text-muted-foreground mt-4">
                  Atualizado em {new Date(m.updated_at).toLocaleString("pt-BR")}
                </p>
              )}
            </Card>

            <Card className="p-6">
              <h3 className="text-sm font-medium mb-4 text-foreground/80">
                Evolução nos últimos 14 dias
              </h3>
              {snapshots.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">Sem registros recentes.</p>
              ) : (
                <div className="space-y-2">
                  {snapshots.map((s) => (
                    <div
                      key={s.date}
                      className="flex items-center justify-between border-b border-border/30 pb-2 text-sm"
                    >
                      <span className="text-foreground/70">
                        {new Date(s.date).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "short",
                        })}
                      </span>
                      <div className="flex items-center gap-2">
                        {s.detectores > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {s.detectores} detector{s.detectores > 1 ? "es" : ""}
                          </Badge>
                        )}
                        {s.intervencoes > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {s.intervencoes} interv.
                          </Badge>
                        )}
                        {s.deslocamentos > 0 && (
                          <Badge className="text-xs bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-0">
                            {s.deslocamentos} deslocamento{s.deslocamentos > 1 ? "s" : ""}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function Eixo({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-border/40 rounded-md p-4">
      <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className={`text-base font-medium capitalize mt-2 ${VALUE_COLOR[value] || ""}`}>
        {value}
      </p>
    </div>
  );
}
