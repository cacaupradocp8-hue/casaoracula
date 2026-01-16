import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfessionalStatus } from "@/hooks/useProfessionalStatus";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PortalBadge } from "@/components/shared/PortalBadge";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { getPortal } from "@/types/portal";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DoorOpen, ArrowRight, Lock, Unlock, Check, Sparkles, AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useCopy } from "@/hooks/useCopy";

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

export default function Dashboard() {
  const { user } = useAuth();
  const { isProfessional, isLoading: isLoadingProfessional } = useProfessionalStatus();
  const navigate = useNavigate();
  const { getCopyByKey } = useCopy();

  const [salas, setSalas] = useState<Sala[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ estados do modal
  const [selectedSala, setSelectedSala] = useState<Sala | null>(null);
  const [showBlockedDialog, setShowBlockedDialog] = useState(false);

  const userNivel = user?.portal ? PORTAL_TO_NIVEL[user.portal] : "NIVEL_0";
  const userNivelNum = NIVEL_HIERARCHY[userNivel];

  useEffect(() => {
    const fetchSalas = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from("salas").select("*").eq("ativa", true).order("ordem");

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

  if (!user) return null;

  const portal = getPortal(user.portal);

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20">
        {/* Welcome Section */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-light text-foreground mb-2">
                Bem-vinda, <span className="text-gold-gradient font-semibold">{user.name}</span>
              </h1>
              <p className="text-muted-foreground">{getCopyByKey('dashboard_mensagem', 'Você não entrou para consumir conteúdo — entrou para atravessar.')}</p>
            </div>
            <PortalBadge portal={user.portal} size="lg" showName />
          </div>

          {/* Portal Info Card */}
          <Card className="bg-mystical border-gold/20">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="flex-1">
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">{portal.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{portal.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {portal.features.slice(0, 4).map((feature, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 text-xs bg-secondary/50 px-2 py-1 rounded-full"
                      >
                        <Check className="w-3 h-3 text-gold" />
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Professional Notice */}
        {!isLoadingProfessional && !isProfessional && user.portal !== "visitante" && (
          <Card className="mb-8 bg-amber-500/5 border-amber-500/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Confirmação profissional pendente</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    A Sala de Sessão, Mapas e ferramentas avançadas requerem confirmação profissional.
                  </p>
                  <Button
                    variant="link"
                    className="px-0 h-auto text-gold"
                    onClick={() => navigate("/confirmar-profissional")}
                  >
                    Fazer confirmação profissional →
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tríade Quote */}
        <div className="mb-12 text-center">
          <blockquote className="font-display text-xl md:text-2xl italic text-foreground/80 max-w-2xl mx-auto">
            "{getCopyByKey('triade_completa', 'Ego organiza a experiência • Neuroplasticidade sustenta o processo • A Alma orienta a travessia')}"
          </blockquote>
          <p className="text-sm text-muted-foreground mt-2">{getCopyByKey('triade_assinatura', '— Tríade Metodológica ORÁCULA')}</p>
        </div>

        {/* Salas Grid */}
        <SectionHeader
          title="Salas da Casa ORÁCULA"
          subtitle="Explore as salas de acordo com seu nível na jornada"
          icon={<DoorOpen className="w-5 h-5" />}
          className="mb-6"
        />

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gold" />
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {salas.map((sala) => {
              const isAccessible = canAccessSala(sala);

              return (
                <Card
                  key={sala.id}
                  className={cn(
                    "group transition-all duration-300 cursor-pointer",
                    isAccessible && "hover:shadow-gold",
                    !isAccessible && "opacity-60",
                  )}
                  onClick={() => handleSalaClick(sala)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center",
                          isAccessible ? "bg-gold/20 text-gold" : "bg-muted text-muted-foreground",
                        )}
                      >
                        {isAccessible ? <Unlock className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
                      </div>
                      <span
                        className={cn(
                          "text-xs px-2 py-1 rounded-full",
                          isAccessible ? "bg-gold/20 text-gold" : "bg-muted text-muted-foreground",
                        )}
                      >
                        {sala.nivel_minimo.replace("NIVEL_", "Nível ")}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardTitle
                      className={cn("text-lg mb-1", isAccessible && "group-hover:text-gold transition-colors")}
                    >
                      {sala.nome_exibicao}
                    </CardTitle>
                    <CardDescription className="text-sm line-clamp-2">
                      {isAccessible ? sala.texto_entrada : "Sala bloqueada"}
                    </CardDescription>
                    {isAccessible && (
                      <div className="flex items-center justify-end mt-3">
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-gold transition-all group-hover:translate-x-1" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Visitor Message */}
        {user.portal === "visitante" && (
          <Card className="bg-secondary/30 border-border/50">
            <CardContent className="p-8 text-center">
              <Sparkles className="w-12 h-12 mx-auto mb-4 text-gold" />
              <h3 className="font-display text-2xl font-semibold text-foreground mb-3">
                Você está no Portal da Buscadora
              </h3>
              <p className="text-muted-foreground max-w-lg mx-auto mb-6">
                As ferramentas profissionais são liberadas após a confirmação da sua atuação. Por enquanto, explore as
                salas do Nível 0.
              </p>
              <Button onClick={() => navigate("/confirmar-profissional")}>Fazer confirmação profissional</Button>
            </CardContent>
          </Card>
        )}

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
        <Dialog open={!!selectedSala && !showBlockedDialog} onOpenChange={(open) => !open && setSelectedSala(null)}>
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
