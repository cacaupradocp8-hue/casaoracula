import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Leaf } from "lucide-react";
import { ResponsiveContainer } from "@/components/ui/ResponsiveContainer";

interface JardimEntry {
  id: string;
  content: string | null;
  emocao: string | null;
  padrao_detectado: string | null;
  movimento: string | null;
  created_at: string;
}

export default function JardimHeroina() {
  const { user } = useAuth();
  const [jardimId, setJardimId] = useState<string | null>(null);
  const [therapistId, setTherapistId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [entries, setEntries] = useState<JardimEntry[]>([]);

  const [aconteceu, setAconteceu] = useState("");
  const [senti, setSenti] = useState("");
  const [repetiu, setRepetiu] = useState("");
  const [diferente, setDiferente] = useState("");

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: jardim } = await supabase
        .from("co_jardins")
        .select("id, therapist_user_id")
        .eq("client_user_id", user.id)
        .eq("status", "active")
        .maybeSingle();

      if (jardim) {
        setJardimId(jardim.id);
        setTherapistId(jardim.therapist_user_id);
        const { data: list } = await supabase
          .from("co_jardim_entries")
          .select("id, content, emocao, padrao_detectado, movimento, created_at")
          .eq("client_user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(10);
        setEntries((list as JardimEntry[]) || []);
      }
      setLoading(false);
    })();
  }, [user]);

  const handleSave = async () => {
    if (!user || !jardimId || !therapistId) {
      toast.error("Seu jardim ainda não foi aberto. Fale com sua facilitadora.");
      return;
    }
    if (!aconteceu.trim() && !senti.trim() && !repetiu.trim() && !diferente.trim()) {
      toast.error("Escreva ao menos um campo antes de guardar.");
      return;
    }

    setSaving(true);
    try {
      const content = [
        aconteceu.trim() && `**O que aconteceu**\n${aconteceu.trim()}`,
        senti.trim() && `**O que senti**\n${senti.trim()}`,
        repetiu.trim() && `**O que se repetiu**\n${repetiu.trim()}`,
        diferente.trim() && `**O que foi diferente**\n${diferente.trim()}`,
      ]
        .filter(Boolean)
        .join("\n\n");

      const { data: inserted, error } = await supabase
        .from("co_jardim_entries")
        .insert({
          jardim_id: jardimId,
          client_user_id: user.id,
          therapist_user_id: therapistId,
          created_by: user.id,
          entry_type: "reflexao",
          content,
          analisado_ia: false,
        })
        .select("id")
        .single();

      if (error) throw error;

      // Fire-and-forget detector call
      supabase.functions
        .invoke("syntheia-detectores", {
          body: {
            client_user_id: user.id,
            texto: content,
            contexto: "jardim",
          },
        })
        .then(async () => {
          await supabase
            .from("co_jardim_entries")
            .update({ analisado_ia: true })
            .eq("id", inserted.id);
        })
        .catch(() => {});

      toast.success("Guardado no seu jardim.");
      setAconteceu("");
      setSenti("");
      setRepetiu("");
      setDiferente("");

      const { data: list } = await supabase
        .from("co_jardim_entries")
        .select("id, content, emocao, padrao_detectado, movimento, created_at")
        .eq("client_user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);
      setEntries((list as JardimEntry[]) || []);
    } catch (e: any) {
      toast.error(e.message || "Não foi possível guardar.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!jardimId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <div className="max-w-md text-center space-y-4">
          <Leaf className="h-10 w-10 mx-auto text-muted-foreground" />
          <h1 className="font-serif text-2xl text-foreground">Seu jardim ainda não foi aberto</h1>
          <p className="text-muted-foreground text-sm">
            Sua facilitadora abrirá este espaço para você quando for o tempo.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ResponsiveContainer className="py-12 md:py-16">
        <header className="mb-12 text-center">
          <Leaf className="h-8 w-8 mx-auto text-primary mb-4 opacity-70" />
          <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-3">
            Jardim da Heroína
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto">
            Um lugar para guardar o que atravessa você. Escreva apenas o que pedir para ser dito.
          </p>
        </header>

        <Card className="p-6 md:p-8 space-y-6 border-border/50 bg-card/50 backdrop-blur">
          <div className="space-y-2">
            <Label htmlFor="aconteceu" className="text-sm font-normal text-foreground/80">
              O que aconteceu
            </Label>
            <Textarea
              id="aconteceu"
              value={aconteceu}
              onChange={(e) => setAconteceu(e.target.value)}
              placeholder="..."
              rows={3}
              className="resize-none border-border/40 focus-visible:ring-1"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="senti" className="text-sm font-normal text-foreground/80">
              O que senti
            </Label>
            <Textarea
              id="senti"
              value={senti}
              onChange={(e) => setSenti(e.target.value)}
              placeholder="..."
              rows={3}
              className="resize-none border-border/40 focus-visible:ring-1"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="repetiu" className="text-sm font-normal text-foreground/80">
              O que se repetiu
            </Label>
            <Textarea
              id="repetiu"
              value={repetiu}
              onChange={(e) => setRepetiu(e.target.value)}
              placeholder="..."
              rows={2}
              className="resize-none border-border/40 focus-visible:ring-1"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="diferente" className="text-sm font-normal text-foreground/80">
              O que foi diferente
            </Label>
            <Textarea
              id="diferente"
              value={diferente}
              onChange={(e) => setDiferente(e.target.value)}
              placeholder="..."
              rows={2}
              className="resize-none border-border/40 focus-visible:ring-1"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="rounded-full px-8 min-h-[44px]"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Guardar no jardim"}
            </Button>
          </div>
        </Card>

        {entries.length > 0 && (
          <section className="mt-16">
            <h2 className="font-serif text-lg text-foreground/70 mb-6 text-center">
              Sementes guardadas
            </h2>
            <div className="space-y-3">
              {entries.map((e) => (
                <Card key={e.id} className="p-5 border-border/30 bg-card/30">
                  <p className="text-xs text-muted-foreground mb-2">
                    {new Date(e.created_at).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                    })}
                  </p>
                  <p className="text-sm text-foreground/80 whitespace-pre-wrap line-clamp-4">
                    {e.content}
                  </p>
                </Card>
              ))}
            </div>
          </section>
        )}
      </ResponsiveContainer>
    </div>
  );
}
