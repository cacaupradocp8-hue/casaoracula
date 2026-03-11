import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Sparkles, Heart, Shield, Compass, Moon, Eye, Users, ClipboardList, Library, BookOpen, Music, Wrench } from "lucide-react";
import { useCopy } from "@/hooks/useCopy";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Navigate } from "react-router-dom";
import { canAccessFeature } from "@/types/portal";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getCopyByKey } = useCopy();
  const [isProfessionalVerified, setIsProfessionalVerified] = useState(false);

  const welcomeName = user?.name?.split(' ')[0] || 'Visitante';
  const isProfessionalLevel = user && canAccessFeature(user.portal, 'aluna');

  // Route members (non-visitor, non-admin) to member dashboard
  const isMember = user && user.portal !== 'visitante' && user.portal !== 'admin';

  useEffect(() => {
    console.info('[boot-debug][dashboard] render do dashboard', {
      userId: user?.id ?? null,
      portal: user?.portal ?? null,
    });
  }, [user?.id, user?.portal]);

  useEffect(() => {
    const checkProfessionalStatus = async () => {
      if (!user) {
        setIsProfessionalVerified(false);
        return;
      }

      if (user.portal === 'admin') {
        setIsProfessionalVerified(true);
        return;
      }

      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_professional_verified, role')
          .eq('id', user.id)
          .single();

        if (profile) {
          setIsProfessionalVerified(profile.is_professional_verified === true || profile.role === 'terapeuta');
        }
      } catch (error) {
        console.error('[boot-debug][dashboard] falha ao carregar status profissional', error);
      }
    };

    checkProfessionalStatus();
  }, [user]);

  // Redirect members to their dashboard after hooks
  if (isMember) {
    return <Navigate to="/dashboard-membro" replace />;
  }

  const showProfessionalShortcuts = isProfessionalLevel && isProfessionalVerified;

  return (
    <AppLayout>
      <div className="container mx-auto px-5 md:px-6 py-8 pb-20 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 border border-gold/20 mb-6">
            <Moon className="w-8 h-8 text-gold" />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-3 leading-[1.2] tracking-tight">
            Bem-vinda, <span className="text-gold">{welcomeName}</span>
          </h1>
          <p className="text-foreground/50 text-base md:text-lg max-w-xl mx-auto leading-[1.7]">
            {getCopyByKey('dashboard_mensagem', 'Você não entrou para consumir conteúdo — entrou para atravessar.')}
          </p>
        </motion.div>

        {/* Manifesto */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <Card className="glass border-gold/15 mb-10">
            <CardContent className="p-7 md:p-8 text-center">
              <Sparkles className="w-5 h-5 text-gold/60 mx-auto mb-4" />
              <p className="text-foreground/70 leading-[1.8] italic text-base md:text-lg mb-4 font-display">
                "A Casa ORÁCULA não é um curso.
              </p>
              <p className="text-foreground/60 leading-[1.8] text-sm md:text-base tracking-[0.01em]">
                É um espaço de formação simbólica, clínica e ética para mulheres que conduzem outras mulheres.
                Aqui, a técnica não substitui a escuta. O símbolo não é ornamento — é linguagem.
                E o portal não é metáfora — é prática."
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* O Que É / O Que Não É */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid md:grid-cols-2 gap-5 mb-10"
        >
          <Card className="glass border-emerald-500/15">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground">O que é</h3>
              </div>
              <ul className="space-y-3">
                {[
                  "Um espaço de sustentação simbólica para quem conduz processos",
                  "Um método clínico-narrativo com estrutura e linguagem próprias",
                  "Um lugar para pensar melhor — não para receber respostas prontas",
                  "Uma formação ética, técnica e simbólica integrada"
                ].map((text, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="text-emerald-400/70 mt-1.5 text-xs">●</span>
                    <span className="text-foreground/60 text-sm leading-[1.7]">{text}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="glass border-rose-500/15">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-rose-400" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground">O que não é</h3>
              </div>
              <ul className="space-y-3">
                {[
                  "Um curso de autoconhecimento ou desenvolvimento pessoal",
                  "Um oráculo que dá conselhos ou interpretações pessoais",
                  "Uma terapia ou substituto de acompanhamento clínico",
                  "Um espaço de consumo de conteúdo ou entretenimento simbólico"
                ].map((text, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="text-rose-400/70 mt-1.5 text-xs">●</span>
                    <span className="text-foreground/60 text-sm leading-[1.7]">{text}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Ethical Positioning */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="glass border-gold/15 mb-10">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-gold" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground">Posicionamento Ético</h3>
              </div>
              <p className="text-foreground/60 leading-[1.8] mb-3 text-sm md:text-base tracking-[0.01em]">
                As ferramentas e conteúdos desta Casa foram criados para apoiar a profissional em sua prática — 
                não para substituir seu julgamento clínico ou sua escuta singular. 
              </p>
              <p className="text-foreground/60 leading-[1.8] text-sm md:text-base tracking-[0.01em]">
                Nenhuma IA, nenhum modelo, nenhum protocolo aqui se propõe a conduzir. 
                <span className="text-gold font-medium"> Quem conduz é você.</span> 
                {" "}A Casa oferece estrutura, linguagem e espelhos simbólicos para que você pense melhor sobre sua condução.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tríade */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="glass border-purple-500/15">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <Compass className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground">Tríade Metodológica</h3>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  { label: "Ego", sub: "organiza a experiência" },
                  { label: "Neuroplasticidade", sub: "sustenta o processo" },
                  { label: "Alma", sub: "orienta a travessia" },
                ].map(item => (
                  <div key={item.label} className="p-4 rounded-xl bg-background/40 border border-border/20">
                    <p className="text-sm text-purple-300/80 font-display font-semibold mb-1">{item.label}</p>
                    <p className="text-xs text-foreground/40 leading-relaxed">{item.sub}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Professional Shortcuts */}
        {showProfessionalShortcuts && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="mt-10">
            <h3 className="text-xs font-medium text-foreground/30 uppercase tracking-[0.2em] mb-4 text-center">
              Área Profissional
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { icon: Users, label: "Clientes", sub: "Gerencie suas clientes", route: "/minhas-clientes" },
                { icon: ClipboardList, label: "Sala de Sessão", sub: "Conduza seus atendimentos", route: "/session-room" },
              ].map(item => (
                <Card key={item.route} className="glass border-gold/15 cursor-pointer hover:border-gold/30 transition-all duration-300" onClick={() => navigate(item.route)}>
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
                      <item.icon className="w-6 h-6 text-gold" />
                    </div>
                    <div>
                      <p className="font-display text-base font-semibold text-foreground">{item.label}</p>
                      <p className="text-sm text-foreground/40">{item.sub}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* Recursos */}
        {user && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mt-10">
            <h3 className="text-xs font-medium text-foreground/30 uppercase tracking-[0.2em] mb-4 text-center">
              Recursos Disponíveis
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon: Library, label: "Biblioteca", route: "/biblioteca" },
                { icon: BookOpen, label: "Cursos", route: "/cursos" },
                { icon: Sparkles, label: "Oráculos", route: "/oraculos" },
                { icon: Music, label: "Áudios", route: "/audios" },
              ].map(item => (
                <Card key={item.route} className="glass border-border/20 cursor-pointer hover:border-gold/20 transition-all duration-300" onClick={() => navigate(item.route)}>
                  <CardContent className="p-4 text-center">
                    <item.icon className="w-5 h-5 text-foreground/30 mx-auto mb-2" />
                    <p className="text-sm font-medium text-foreground/70">{item.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center text-foreground/30 text-sm mt-10 leading-relaxed"
        >
          Use o menu para navegar pela Casa. Cada espaço foi desenhado para um propósito.
        </motion.p>
      </div>
    </AppLayout>
  );
}
