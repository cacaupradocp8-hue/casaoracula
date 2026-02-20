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
  GraduationCap, Compass, ArrowRight, Lock, Unlock, Loader2,
  Sparkles, Home, ChevronRight,
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
  NIVEL_0: 0, NIVEL_1: 1, NIVEL_2: 2, NIVEL_3: 3,
};

const PORTAL_TO_NIVEL: Record<string, NivelSala> = {
  visitante: "NIVEL_0", mentorada: "NIVEL_1", aluna_formacao: "NIVEL_1",
  assinante: "NIVEL_2", oracula: "NIVEL_2", admin: "NIVEL_3",
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
        const [salasRes, configRes, matriculasRes] = await Promise.all([
          supabase.from("salas").select("*").eq("ativa", true).order("ordem"),
          supabase.from("formacao_area_config").select("*").limit(1).maybeSingle(),
          isAdmin ? Promise.resolve({ data: null }) : supabase.from('matriculas').select('curso_id').eq('user_id', user.id).eq('ativa', true)
        ]);

        if (salasRes.data) setSalas(salasRes.data as Sala[]);
        if (configRes.data) {
          setConfig({
            ...defaultConfig, ...configRes.data,
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
      <div className="container mx-auto px-4 py-12 pb-24 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-10">
          <Link to="/jornada" className="hover:text-foreground transition-colors flex items-center gap-1">
            <Home className="w-3 h-3" /> Casa
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">Formação</span>
        </nav>

        {/* Grand hero header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16 space-y-6 relative"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] rounded-full bg-gold/5 blur-[80px] pointer-events-none" />

          <div className="flex items-center justify-center gap-4 relative">
            <div className="h-px w-14 bg-gradient-to-r from-transparent to-gold/50" />
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center border border-gold/20">
              <Compass className="w-6 h-6 text-gold" />
            </div>
            <div className="h-px w-14 bg-gradient-to-l from-transparent to-gold/50" />
          </div>

          <h1 className="font-display text-4xl md:text-5xl text-foreground tracking-wide font-light">
            Bem-vinda à Casa Orácula
          </h1>
          <p className="text-foreground/60 text-base max-w-lg mx-auto leading-relaxed font-body">
            Aqui se aprende a sustentar campo, antes de guiar o da outra.
          </p>

          <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        </motion.div>

        {/* Primary CTA — Formação */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-14"
        >
          <Button 
            variant="gold" 
            size="lg" 
            className="w-full gap-3 text-base py-7 rounded-xl shadow-[0_0_50px_-10px_hsl(var(--gold)/0.3)]"
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
          transition={{ delay: 0.3 }}
          className="mb-14"
        >
          <div className="flex items-center gap-5 mb-8">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
            <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground/50 font-medium">
              Espaços Formativos
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
          </div>

          <Card 
            className="cursor-pointer group border-border/10 hover:border-gold/25 hover:shadow-[0_12px_50px_-16px_hsl(var(--gold)/0.15)] transition-all duration-700 rounded-2xl bg-card/80"
            onClick={() => navigate('/ferramentas-metodo')}
          >
            <CardContent className="p-7 md:p-8">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center shrink-0 border border-gold/15">
                  <Compass className="w-8 h-8 text-gold" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-xl md:text-2xl group-hover:text-gold transition-colors duration-500 tracking-wide">
                    Ferramentas do Método Orácula
                  </h3>
                  <p className="text-sm text-foreground/50 mt-1.5 font-body">
                    Labirinto das 39 Portas • Torre Viva™ • Cartografia das Torres
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground/30 group-hover:text-gold group-hover:translate-x-2 transition-all duration-500 shrink-0" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Salas Section */}
        {config.mostrar_salas_estudo && salas.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-5 mb-8">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/15 to-transparent" />
              <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground/50 font-medium flex items-center gap-2.5">
                <Sparkles className="w-3.5 h-3.5 text-gold/40" />
                {config.titulo_salas_estudo}
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/15 to-transparent" />
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {salas.map((sala, i) => {
                const isAccessible = canAccessSala(sala);

                return (
                  <motion.div
                    key={sala.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 + i * 0.06 }}
                  >
                    <Card
                      className={cn(
                        "group transition-all duration-700 cursor-pointer relative overflow-hidden rounded-2xl",
                        isAccessible && "hover:border-gold/25 hover:shadow-[0_8px_40px_-12px_hsl(var(--gold)/0.15)] border-border/10 bg-card/80",
                        !isAccessible && "opacity-40 border-border/5 bg-card/40"
                      )}
                      onClick={() => handleSalaClick(sala)}
                    >
                      {/* Ambient hover glow */}
                      {isAccessible && (
                        <div className="absolute inset-0 bg-gradient-to-br from-gold/0 to-gold/0 group-hover:from-gold/5 group-hover:to-transparent transition-all duration-700 pointer-events-none" />
                      )}
                      
                      <CardContent className="p-6 relative">
                        <div className="flex items-center gap-4">
                          <div
                            className={cn(
                              "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-500",
                              isAccessible 
                                ? "bg-gradient-to-br from-gold/15 to-gold/5 text-gold border-gold/15 group-hover:border-gold/30 group-hover:shadow-[0_0_20px_-6px_hsl(var(--gold)/0.2)]" 
                                : "bg-muted/30 text-muted-foreground/40 border-border/20"
                            )}
                          >
                            {isAccessible ? <Unlock className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3
                              className={cn(
                                "font-display text-base tracking-wide truncate",
                                isAccessible && "group-hover:text-gold transition-colors duration-500"
                              )}
                            >
                              {sala.nome_exibicao}
                            </h3>
                            <p className="text-[11px] text-muted-foreground/40 mt-1 font-mono tracking-widest uppercase">
                              {sala.nivel_minimo.replace("NIVEL_", "Nível ")}
                            </p>
                          </div>
                          {isAccessible && (
                            <ArrowRight className="w-4 h-4 text-muted-foreground/20 group-hover:text-gold group-hover:translate-x-1 transition-all duration-500 shrink-0" />
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
              <Button variant="outline" onClick={() => setShowBlockedDialog(false)}>Entendi</Button>
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
