import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Home,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types and interfaces
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

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setLoading(true);
      
      try {
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
      <div className="container mx-auto px-4 py-8 pb-20 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/jornada" className="hover:text-foreground transition-colors flex items-center gap-1">
            <Home className="w-3 h-3" />
            Casa
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">Formação</span>
        </nav>

        {/* Hero header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-gold/40" />
            <Compass className="w-5 h-5 text-gold" />
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-gold/40" />
          </div>

          <h1 className="font-display text-3xl md:text-4xl text-foreground tracking-wide font-light">
            Bem-vinda à Casa Orácula
          </h1>
          <p className="text-muted-foreground text-sm max-w-lg mx-auto leading-relaxed">
            Aqui se aprende a sustentar campo, antes de guiar o da outra.
          </p>

          <div className="h-px w-24 mx-auto bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        </motion.div>

        {/* Primary CTA — Formação */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-10"
        >
          <Button 
            variant="gold" 
            size="lg" 
            className="w-full gap-3 shadow-[0_0_30px_-5px_hsl(var(--gold)/0.2)]"
            onClick={() => navigate('/oracula')}
          >
            <GraduationCap className="w-5 h-5" />
            Conhecer a Formação
          </Button>
        </motion.div>

        {/* Espaços Formativos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-10"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border/50 to-transparent" />
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground/60 font-medium">
              Espaços Formativos
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border/50 to-transparent" />
          </div>

          <Card 
            className="cursor-pointer group border-border/20 hover:border-gold/30 hover:shadow-[0_8px_40px_-12px_hsl(var(--gold)/0.12)] transition-all duration-500"
            onClick={() => navigate('/ferramentas-metodo')}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center shrink-0 border border-gold/15">
                  <Compass className="w-7 h-7 text-gold" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-lg group-hover:text-gold transition-colors tracking-wide">
                    Ferramentas do Método Orácula
                  </h3>
                  <p className="text-sm text-muted-foreground/70 mt-0.5">
                    Labirinto das 39 Portas • Torre Viva™ • Cartografia das Torres
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground/40 group-hover:text-gold group-hover:translate-x-1 transition-all shrink-0" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Salas Section */}
        {config.mostrar_salas_estudo && salas.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border/50 to-transparent" />
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground/60 font-medium flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-gold/40" />
                {config.titulo_salas_estudo}
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border/50 to-transparent" />
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {salas.map((sala, i) => {
                const isAccessible = canAccessSala(sala);

                return (
                  <motion.div
                    key={sala.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 + i * 0.05 }}
                  >
                    <Card
                      className={cn(
                        "group transition-all duration-500 cursor-pointer relative overflow-hidden",
                        isAccessible && "hover:border-gold/30 hover:shadow-[0_4px_20px_-8px_hsl(var(--gold)/0.12)]",
                        !isAccessible && "opacity-50"
                      )}
                      onClick={() => handleSalaClick(sala)}
                    >
                      {/* Top accent for accessible */}
                      {isAccessible && (
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      )}
                      
                      <CardContent className="p-5">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border",
                              isAccessible 
                                ? "bg-gradient-to-br from-gold/15 to-transparent text-gold border-gold/15" 
                                : "bg-muted/50 text-muted-foreground border-border/30"
                            )}
                          >
                            {isAccessible ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3
                              className={cn(
                                "font-display text-sm tracking-wide truncate",
                                isAccessible && "group-hover:text-gold transition-colors duration-300"
                              )}
                            >
                              {sala.nome_exibicao}
                            </h3>
                            <p className="text-[10px] text-muted-foreground/50 mt-0.5 font-mono tracking-wider uppercase">
                              {sala.nivel_minimo.replace("NIVEL_", "Nível ")}
                            </p>
                          </div>
                          {isAccessible && (
                            <ArrowRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-gold transition-all group-hover:translate-x-1 shrink-0" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Dialogs */}
        <Dialog open={showBlockedDialog} onOpenChange={setShowBlockedDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 font-display">
                <Lock className="w-5 h-5 text-muted-foreground" />
                Sala Bloqueada
              </DialogTitle>
              <DialogDescription className="pt-4 leading-relaxed">
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

        <Dialog
          open={!!selectedSala && !showBlockedDialog}
          onOpenChange={(open) => !open && setSelectedSala(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 font-display">
                <Unlock className="w-5 h-5 text-gold" />
                {selectedSala?.nome_exibicao}
              </DialogTitle>
              <DialogDescription className="pt-4 leading-relaxed">
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
