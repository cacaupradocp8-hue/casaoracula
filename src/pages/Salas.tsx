import { AppLayout } from "@/components/layout/AppLayout";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { DoorOpen, Lock, Unlock, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

type NivelSala = "NIVEL_0" | "NIVEL_1" | "NIVEL_2" | "NIVEL_3";
type PortalType = "visitante" | "pre_iniciada" | "iniciada" | "admin";

interface Sala {
  id: string;
  nivel_minimo: NivelSala;
  nome_exibicao: string;
  texto_entrada: string;
  texto_bloqueio: string;
  ativa: boolean;
  ordem: number;
}

interface PortalSala {
  portal_type: PortalType;
  sala_id: string;
}

const PORTAL_LABELS: Record<PortalType, string> = {
  visitante: "Visitante",
  pre_iniciada: "Pré-Iniciada",
  iniciada: "Iniciada ORÁCULA",
  admin: "Admin",
};

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

export default function Salas() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [salas, setSalas] = useState<Sala[]>([]);
  const [portalSalas, setPortalSalas] = useState<PortalSala[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedSala, setSelectedSala] = useState<Sala | null>(null);
  const [showBlockedDialog, setShowBlockedDialog] = useState(false);

  const userNivel = user?.portal ? PORTAL_TO_NIVEL[user.portal] : "NIVEL_0";
  const userNivelNum = NIVEL_HIERARCHY[userNivel];

  const canAccessSala = (sala: Sala): boolean => {
    const salaMinNivel = NIVEL_HIERARCHY[sala.nivel_minimo];
    return userNivelNum >= salaMinNivel;
  };

  const getPortaisForSala = (salaId: string): PortalType[] => {
    return portalSalas.filter((ps) => ps.sala_id === salaId).map((ps) => ps.portal_type);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [salasRes, portalSalasRes] = await Promise.all([
          supabase.from("salas").select("*").eq("ativa", true).order("ordem"),
          supabase.from("portal_salas").select("portal_type, sala_id"),
        ]);

        if (salasRes.error) {
          toast.error("Erro ao carregar salas");
          console.error(salasRes.error);
        } else {
          setSalas((salasRes.data as Sala[]) || []);
        }

        if (portalSalasRes.error) {
          console.error(portalSalasRes.error);
        } else {
          setPortalSalas((portalSalasRes.data as PortalSala[]) || []);
        }
      } catch (e) {
        console.error(e);
        toast.error("Erro inesperado ao carregar salas");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

        {/* Salas por nível */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
          {salas.map((sala) => {
            const isAccessible = canAccessSala(sala);
            return (
              <Card
                key={sala.id}
                className={`glass transition-all cursor-pointer ${
                  isAccessible
                    ? "hover:border-gold/50 hover:shadow-gold/10 hover:shadow-lg"
                    : "opacity-60 hover:opacity-80"
                }`}
                onClick={() => handleSalaClick(sala)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        isAccessible ? "bg-gold/20 text-gold" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {isAccessible ? <Unlock className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        isAccessible ? "bg-gold/20 text-gold" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {sala.nivel_minimo.replace("NIVEL_", "Nível ")}
                    </span>
                  </div>
                  <CardTitle className="text-lg">{sala.nome_exibicao}</CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {isAccessible ? sala.texto_entrada : "Sala bloqueada"}
                  </p>

                  {/* Portais associados (labels de plano) */}
                  {getPortaisForSala(sala.id).length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {getPortaisForSala(sala.id).map((portal) => (
                        <span key={portal} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                          {PORTAL_LABELS[portal]}
                        </span>
                      ))}
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
              <DialogDescription className="pt-4">{selectedSala?.texto_bloqueio}</DialogDescription>
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
          open={selectedSala !== null && !showBlockedDialog && canAccessSala(selectedSala!)}
          onOpenChange={(open) => !open && setSelectedSala(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Unlock className="w-5 h-5 text-gold" />
                {selectedSala?.nome_exibicao}
              </DialogTitle>
              <DialogDescription className="pt-4">{selectedSala?.texto_entrada}</DialogDescription>
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
