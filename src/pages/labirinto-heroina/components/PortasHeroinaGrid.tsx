import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PortaHeroinaCard } from "./PortaHeroinaCard";

const MAX_PORTAS = 14;

export function PortasHeroinaGrid() {
  const [savingPortaId, setSavingPortaId] = useState<string | null>(null);

  const { data: portas, isLoading } = useQuery({
    queryKey: ["labirinto-portas-heroina"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("labirinto_portas")
        .select("id, numero, nome, subtitulo, imagem_url, campo_pede, pergunta_chave, cena_narrativa, eixo_psiquico, symbolic_focus")
        .eq("ativa", true)
        .order("ordem")
        .limit(MAX_PORTAS);

      if (error) throw error;
      return data;
    },
  });

  const handleSaveToMap = async (portaId: string, resposta: string) => {
    setSavingPortaId(portaId);
    try {
      // TODO: Save to mapa/registro when integration is ready
      toast.success("Reflexão salva no Mapa!", { icon: "🗺️" });
    } catch (error) {
      console.error("Error saving:", error);
      toast.error("Erro ao salvar. Tente novamente.");
    } finally {
      setSavingPortaId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  if (!portas || portas.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-8 text-center text-muted-foreground">
          <p>Nenhuma porta configurada ainda.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Introduction */}
      <Card className="border-gold/30 bg-gradient-to-r from-gold/5 to-transparent">
        <CardContent className="p-6">
          <h3 className="font-display text-xl text-gold mb-2">
            As 14 Portas da Heroína
          </h3>
          <p className="text-muted-foreground text-sm">
            Cada porta é uma unidade integrada de travessia simbólica. 
            Explore com presença — leia, reflita, registre e salve no seu Mapa.
          </p>
        </CardContent>
      </Card>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {portas.map((porta) => (
          <PortaHeroinaCard
            key={porta.id}
            porta={porta}
            onSaveToMap={handleSaveToMap}
            isSaving={savingPortaId === porta.id}
          />
        ))}
      </div>
    </div>
  );
}
