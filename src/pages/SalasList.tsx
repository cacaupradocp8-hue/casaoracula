import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { 
  GraduationCap, 
  Compass, 
  ArrowRight, 
  Lock, 
  Unlock, 
  Loader2,
  Sparkles,
  BookOpen,
  Users,
  Heart,
  Moon,
  Star
} from "lucide-react";
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

interface MatriculaInfo {
  hasMentoria: boolean;
  hasFormacao: boolean;
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
  const [matriculas, setMatriculas] = useState<MatriculaInfo>({ hasMentoria: false, hasFormacao: false });
  const [selectedSala, setSelectedSala] = useState<Sala | null>(null);
  const [showBlockedDialog, setShowBlockedDialog] = useState(false);

  const userNivel = user?.portal ? PORTAL_TO_NIVEL[user.portal] : "NIVEL_0";
  const userNivelNum = NIVEL_HIERARCHY[userNivel];
  const isAdmin = user?.portal === 'admin';

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setLoading(true);
      
      try {
        // Fetch salas
        const { data: salasData } = await supabase
          .from("salas")
          .select("*")
          .eq("ativa", true)
          .order("ordem");

        if (salasData) {
          setSalas(salasData as Sala[]);
        }

        // Check matriculas for access
        if (isAdmin) {
          setMatriculas({ hasMentoria: true, hasFormacao: true });
        } else {
          const { data: matriculasData } = await supabase
            .from('matriculas')
            .select('curso_id')
            .eq('user_id', user.id)
            .eq('ativa', true);

          if (matriculasData) {
            const cursoIds = matriculasData.map(m => m.curso_id);
            setMatriculas({
              hasMentoria: cursoIds.some(id => id.includes('mentoria')),
              hasFormacao: cursoIds.some(id => id.includes('formacao'))
            });
          }
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, isAdmin]);

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
      <div className="container mx-auto px-4 py-8 pb-20 max-w-5xl">
        <SectionHeader
          title="Formação"
          subtitle="Escolha seu caminho de desenvolvimento"
          icon={<GraduationCap className="w-5 h-5" />}
          className="mb-10"
        />

        {/* Two Main Paths */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* MENTORIA ORÁCULA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card 
              className={cn(
                "h-full border-2 transition-all duration-300 cursor-pointer group",
                matriculas.hasMentoria 
                  ? "border-purple-500/50 bg-purple-500/5 hover:border-purple-500 hover:bg-purple-500/10" 
                  : "border-border/50 bg-card/50 hover:border-purple-500/30"
              )}
              onClick={() => matriculas.hasMentoria ? navigate('/mentoria-oracular') : navigate('/planos')}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-purple-500/20 flex items-center justify-center">
                    <Moon className="w-7 h-7 text-purple-400" />
                  </div>
                  {matriculas.hasMentoria ? (
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                      <Unlock className="w-3 h-3 mr-1" /> Ativo
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <Lock className="w-3 h-3 mr-1" /> Requer Matrícula
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-xl font-display text-foreground group-hover:text-purple-400 transition-colors">
                  Mentoria Orácula
                </CardTitle>
                <CardDescription className="text-base">
                  Jornada simbólica pessoal
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Um caminho de autoconhecimento profundo através da linguagem simbólica. 
                  Aqui você atravessa seus próprios processos, sem foco em aplicação profissional.
                </p>
                
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Heart className="w-4 h-4 text-purple-400" />
                    <span>Jornada pessoal de transformação</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>Práticas simbólicas individuais</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Compass className="w-4 h-4 text-purple-400" />
                    <span>Acompanhamento e orientação</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="bg-purple-500/10 rounded-lg p-3 border border-purple-500/20">
                  <p className="text-xs text-purple-300 italic">
                    "A Mentoria é o espaço onde você se torna a própria cliente — 
                    onde a travessia pessoal acontece antes de qualquer aplicação."
                  </p>
                </div>

                <div className="flex items-center justify-end pt-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-1 text-purple-400 hover:text-purple-300"
                  >
                    {matriculas.hasMentoria ? 'Acessar' : 'Ver planos'}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* FORMAÇÃO ORÁCULA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card 
              className={cn(
                "h-full border-2 transition-all duration-300 cursor-pointer group",
                matriculas.hasFormacao 
                  ? "border-gold/50 bg-gold/5 hover:border-gold hover:bg-gold/10" 
                  : "border-border/50 bg-card/50 hover:border-gold/30"
              )}
              onClick={() => matriculas.hasFormacao ? navigate('/formacao-oracula') : navigate('/planos')}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gold/20 flex items-center justify-center">
                    <Star className="w-7 h-7 text-gold" />
                  </div>
                  {matriculas.hasFormacao ? (
                    <Badge className="bg-gold/20 text-gold border-gold/30">
                      <Unlock className="w-3 h-3 mr-1" /> Ativo
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <Lock className="w-3 h-3 mr-1" /> Requer Matrícula
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-xl font-display text-foreground group-hover:text-gold transition-colors">
                  Formação Orácula
                </CardTitle>
                <CardDescription className="text-base">
                  Treinamento profissional estruturado
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  O caminho para quem deseja conduzir processos simbólicos com outras pessoas. 
                  Aqui você aprende o método, as ferramentas e a ética da prática oracular.
                </p>
                
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BookOpen className="w-4 h-4 text-gold" />
                    <span>Currículo estruturado e progressivo</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <GraduationCap className="w-4 h-4 text-gold" />
                    <span>Ensino do método completo</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4 text-gold" />
                    <span>Ferramentas para aplicação com clientes</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="bg-gold/10 rounded-lg p-3 border border-gold/20">
                  <p className="text-xs text-gold italic">
                    "A Formação prepara você para sustentar travessias alheias — 
                    com estrutura, linguagem e cuidado simbólico."
                  </p>
                </div>

                <div className="flex items-center justify-end pt-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-1 text-gold hover:text-gold/80"
                  >
                    {matriculas.hasFormacao ? 'Acessar' : 'Ver planos'}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Salas Section - Only show if there are salas */}
        {salas.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Separator className="mb-8" />
            
            <h2 className="text-lg font-display text-foreground mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-muted-foreground" />
              Salas de Estudo
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                            isAccessible ? "bg-gold/20 text-gold" : "bg-muted text-muted-foreground"
                          )}
                        >
                          {isAccessible ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3
                            className={cn(
                              "font-medium text-sm truncate",
                              isAccessible && "group-hover:text-gold transition-colors"
                            )}
                          >
                            {sala.nome_exibicao}
                          </h3>
                          <p className="text-xs text-muted-foreground truncate">
                            {sala.nivel_minimo.replace("NIVEL_", "Nível ")}
                          </p>
                        </div>
                        {isAccessible && (
                          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-gold transition-all group-hover:translate-x-1 shrink-0" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </motion.div>
        )}

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
