import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
  Star,
  Home,
  ChevronRight,
  MapPin,
  Building2
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

interface FormacaoAreaConfig {
  mentoria_banner_url: string | null;
  mentoria_titulo: string;
  mentoria_subtitulo: string;
  mentoria_descricao: string;
  mentoria_itens: string[];
  mentoria_ativa: boolean;
  formacao_banner_url: string | null;
  formacao_titulo: string;
  formacao_subtitulo: string;
  formacao_descricao: string;
  formacao_itens: string[];
  formacao_ativa: boolean;
  mostrar_salas_estudo: boolean;
  titulo_salas_estudo: string;
}

const defaultConfig: FormacaoAreaConfig = {
  mentoria_banner_url: null,
  mentoria_titulo: 'Mentoria Orácula',
  mentoria_subtitulo: 'Jornada pessoal simbólica',
  mentoria_descricao: 'Sua jornada pessoal de autoconhecimento e transformação interior.',
  mentoria_itens: ['Jornada pessoal de autodescoberta', 'Práticas simbólicas guiadas', 'Sem aplicação profissional'],
  mentoria_ativa: true,
  formacao_banner_url: null,
  formacao_titulo: 'Formação Orácula',
  formacao_subtitulo: 'Capacitação profissional',
  formacao_descricao: 'Formação completa para se tornar uma facilitadora do método ORÁCULA.',
  formacao_itens: ['Currículo estruturado', 'Ensino do método', 'Certificação profissional'],
  formacao_ativa: true,
  mostrar_salas_estudo: true,
  titulo_salas_estudo: 'Salas de Estudo',
};

const NIVEL_HIERARCHY: Record<NivelSala, number> = {
  NIVEL_0: 0,
  NIVEL_1: 1,
  NIVEL_2: 2,
  NIVEL_3: 3,
};

const PORTAL_TO_NIVEL: Record<string, NivelSala> = {
  visitante: "NIVEL_0",
  mentorada: "NIVEL_1",
  aluna_formacao: "NIVEL_1",
  assinante: "NIVEL_2",
  oracula: "NIVEL_2",
  admin: "NIVEL_3",
};

export default function SalasList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [salas, setSalas] = useState<Sala[]>([]);
  const [loading, setLoading] = useState(true);
  const [matriculas, setMatriculas] = useState<MatriculaInfo>({ hasMentoria: false, hasFormacao: false });
  const [config, setConfig] = useState<FormacaoAreaConfig>(defaultConfig);
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
        // Fetch salas, matriculas and config in parallel
        const [salasRes, configRes, matriculasRes] = await Promise.all([
          supabase.from("salas").select("*").eq("ativa", true).order("ordem"),
          supabase.from("formacao_area_config").select("*").limit(1).maybeSingle(),
          isAdmin ? Promise.resolve({ data: null }) : supabase.from('matriculas').select('curso_id').eq('user_id', user.id).eq('ativa', true)
        ]);

        if (salasRes.data) {
          setSalas(salasRes.data as Sala[]);
        }

        if (configRes.data) {
          setConfig({
            ...defaultConfig,
            ...configRes.data,
            mentoria_itens: configRes.data.mentoria_itens || defaultConfig.mentoria_itens,
            formacao_itens: configRes.data.formacao_itens || defaultConfig.formacao_itens,
          });
        }

        if (isAdmin) {
          setMatriculas({ hasMentoria: true, hasFormacao: true });
        } else if (matriculasRes.data) {
          const cursoIds = matriculasRes.data.map((m: { curso_id: string }) => m.curso_id);
          setMatriculas({
            hasMentoria: cursoIds.some((id: string) => id.includes('mentoria')),
            hasFormacao: cursoIds.some((id: string) => id.includes('formacao'))
          });
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
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/jornada" className="hover:text-foreground transition-colors flex items-center gap-1">
            <Home className="w-3 h-3" />
            Casa
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">Formação</span>
        </nav>

        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <Card className="border-gold/20 bg-gradient-to-br from-card via-card to-gold/5 overflow-hidden">
            <CardContent className="p-8 md:p-12">
              <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center mb-6">
                  <Building2 className="w-8 h-8 text-gold" />
                </div>
                
                {/* Title */}
                <h1 className="text-2xl md:text-3xl font-display text-foreground mb-6">
                  Bem-vinda à Casa Orácula
                </h1>
                
                {/* Body Text */}
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Aqui não se improvisa condução.
                    <br />
                    Aqui se aprende a sustentar campo, antes de guiar o da outra.
                  </p>
                  
                  <p className="text-foreground/80">
                    A Casa Orácula é um sistema profissional para terapeutas, mentoras e educadoras do feminino que desejam organização, clareza e ética na prática simbólica.
                  </p>
                  
                  <p className="text-sm italic text-muted-foreground/80 pt-2">
                    Você não precisa saber tudo agora.
                    <br />
                    Precisa apenas saber onde está.
                  </p>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 justify-center mt-8">
                  <Button 
                    variant="gold" 
                    onClick={() => navigate('/oracula')}
                    className="gap-2"
                  >
                    <GraduationCap className="w-4 h-4" />
                    Conhecer a Formação
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/planos')}
                    className="gap-2"
                  >
                    <MapPin className="w-4 h-4" />
                    Ver Planos
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Espaços Formativos Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Separator className="mb-8" />
          
          <h2 className="text-lg font-display text-foreground mb-6 flex items-center gap-2">
            <Compass className="w-5 h-5 text-gold" />
            Espaços Formativos
          </h2>

          <div className="grid gap-4 mb-8">
            {/* Ferramentas do Método - Hub Unificado */}
            <Card 
              className="cursor-pointer hover:border-gold/50 hover:shadow-lg transition-all group"
              onClick={() => navigate('/ferramentas-metodo')}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gold/20 flex items-center justify-center shrink-0">
                    <Compass className="w-7 h-7 text-gold" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-lg group-hover:text-gold transition-colors">
                      Ferramentas do Método Orácula
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Labirinto das 39 Portas • Torre Viva™ • Cartografia das Torres
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-gold group-hover:translate-x-1 transition-all shrink-0" />
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Salas Section - Only show if configured and has salas */}
        {config.mostrar_salas_estudo && salas.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Separator className="mb-8" />
            
            <h2 className="text-lg font-display text-foreground mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-muted-foreground" />
              {config.titulo_salas_estudo}
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
