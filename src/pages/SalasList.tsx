import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { DoorOpen, ArrowRight, Lock, Unlock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type NivelSala = "NIVEL_0" | "NIVEL_1" | "NIVEL_2" | "NIVEL_3";

interface Sala {
  id: string;
  nivel_minimo: NivelSala;
  nome_exibicao: string;
  texto_entrada: string;
  texto_bloqueio: string;
  ordem: number;
}

const NIVEL_HIERARCHY: Record<NivelSala, number> = {
  NIVEL_0: 0,
  NIVEL_1: 1,
  NIVEL_2: 2,
  NIVEL_3: 3,
};

const PORTAL_TO_NIVEL: Record<string, NivelSala> = {
  visitante: "NIVEL_0",
  pre_iniciada: "NIVEL_1",
  iniciada: "NIVEL_2",
  admin: "NIVEL_3",
};

export default function SalasList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [salas, setSalas] = useState<Sala[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSala, setSelectedSala] = useState<Sala | null>(null);
  const [showBlockedDialog, setShowBlockedDialog] = useState(false);

  const userNivel = user?.portal ? PORTAL_TO_NIVEL[user.portal] : "NIVEL_0";
  const userNivelNum = NIVEL_HIERARCHY[userNivel];

  useEffect(() => {
    const fetchSalas = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("salas")
          .select("*")
          .eq("ativa", true)
          .order("ordem");

        if (error) {
          console.error("Error fetching salas:", error);
        } else {
          setSalas((data || []) as Sala[]);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalas();
  }, []);

  const canAccessSala = (sala: Sala): boolean => {
    const salaMinNivel = NIVEL_HIERARCHY[sala.nivel_minimo];
    return userNivelNum >= salaMinNivel;
  };

  const handleSalaClick = (sala: Sala) => {
    if (canAccessSala(sala)) {
      setSelectedSala(sala);
      setShowBlockedDialog(false);
    } else {
      setSelectedSala(sala);
      setShowBlockedDialog(true);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20">
        <SectionHeader
          title="Salas da Casa ORÁCULA"
          subtitle="Explore as salas de acordo com seu nível na jornada"
          icon={<DoorOpen className="w-5 h-5" />}
          className="mb-8"
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {salas.map((sala) => {
            const isAccessible = canAccessSala(sala);

            return (
              <Card
                key={sala.id}
                className={cn(
                  "group transition-all duration-300 cursor-pointer",
                  isAccessible && "hover:shadow-gold hover:border-gold/30",
                  !isAccessible && "opacity-60"
                )}
                onClick={() => handleSalaClick(sala)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center",
                        isAccessible ? "bg-gold/20 text-gold" : "bg-muted text-muted-foreground"
                      )}
                    >
                      {isAccessible ? <Unlock className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
                    </div>
                    <span
                      className={cn(
                        "text-xs px-2 py-1 rounded-full",
                        isAccessible ? "bg-gold/20 text-gold" : "bg-muted text-muted-foreground"
                      )}
                    >
                      {sala.nivel_minimo.replace("NIVEL_", "Nível ")}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle
                    className={cn(
                      "text-lg mb-2",
                      isAccessible && "group-hover:text-gold transition-colors"
                    )}
                  >
                    {sala.nome_exibicao}
                  </CardTitle>
                  <CardDescription className="text-sm line-clamp-2">
                    {isAccessible ? sala.texto_entrada : "Sala bloqueada"}
                  </CardDescription>
                  {isAccessible && (
                    <div className="flex items-center justify-end mt-4">
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-gold transition-all group-hover:translate-x-1" />
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Dialog para sala bloqueada */}
        <Dialog open={showBlockedDialog} onOpenChange={setShowBlockedDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-muted-foreground" />
                Sala Bloqueada
              </DialogTitle>
              <DialogDescription className="pt-4">
                {selectedSala?.texto_bloqueio}
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end pt-4">
              <Button variant="outline" onClick={() => setShowBlockedDialog(false)}>
                Entendi
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialog para sala desbloqueada */}
        <Dialog
          open={!!selectedSala && !showBlockedDialog}
          onOpenChange={(open) => !open && setSelectedSala(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Unlock className="w-5 h-5 text-gold" />
                {selectedSala?.nome_exibicao}
              </DialogTitle>
              <DialogDescription className="pt-4">
                {selectedSala?.texto_entrada}
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end pt-4">
              <Button
                variant="gold"
                onClick={() => {
                  if (!selectedSala) return;
                  const id = selectedSala.id;
                  setSelectedSala(null);
                  navigate(`/salas/${id}`);
                }}
              >
                Explorar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
