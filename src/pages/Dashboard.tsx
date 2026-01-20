import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Sparkles, Heart, Shield, Compass, Moon, Eye, Users, ClipboardList } from "lucide-react";
import { useCopy } from "@/hooks/useCopy";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { canAccessFeature } from "@/types/portal";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getCopyByKey } = useCopy();
  const [isProfessionalVerified, setIsProfessionalVerified] = useState(false);

  const welcomeName = user?.name?.split(' ')[0] || 'Visitante';
  const isProfessionalLevel = user && canAccessFeature(user.portal, 'pre_iniciada');

  // Check professional verification status
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
          setIsProfessionalVerified(
            profile.is_professional_verified === true || 
            profile.role === 'terapeuta'
          );
        }
      } catch (error) {
        console.error('Error checking professional status:', error);
      }
    };

    checkProfessionalStatus();
  }, [user]);

  const showProfessionalShortcuts = isProfessionalLevel && isProfessionalVerified;


  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20 max-w-4xl">
        {/* Header - Symbolic Welcome */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 border border-gold/30 mb-6">
            <Moon className="w-8 h-8 text-gold" />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-light text-foreground mb-3">
            Bem-vinda, <span className="text-gold-gradient font-semibold">{welcomeName}</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            {getCopyByKey('dashboard_mensagem', 'Você não entrou para consumir conteúdo — entrou para atravessar.')}
          </p>
        </motion.div>

        {/* Manifesto Card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card className="glass border-gold/20 mb-10">
            <CardContent className="p-8 text-center">
              <Sparkles className="w-6 h-6 text-gold mx-auto mb-4" />
              <p className="text-foreground/90 leading-relaxed italic text-lg mb-4">
                "A Casa ORÁCULA não é um curso.
              </p>
              <p className="text-foreground/80 leading-relaxed">
                É um espaço de formação simbólica, clínica e ética para mulheres que conduzem outras mulheres.
                Aqui, a técnica não substitui a escuta. O símbolo não é ornamento — é linguagem.
                E o portal não é metáfora — é prática."
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* What This Is / What This Is Not */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="grid md:grid-cols-2 gap-6 mb-10"
        >
          {/* O Que É */}
          <Card className="glass border-emerald-500/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground">O que é</h3>
              </div>
              <ul className="space-y-3 text-foreground/80 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">•</span>
                  <span>Um espaço de sustentação simbólica para quem conduz processos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">•</span>
                  <span>Um método clínico-narrativo com estrutura e linguagem próprias</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">•</span>
                  <span>Um lugar para pensar melhor — não para receber respostas prontas</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">•</span>
                  <span>Uma formação ética, técnica e simbólica integrada</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* O Que Não É */}
          <Card className="glass border-rose-500/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-rose-400" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground">O que não é</h3>
              </div>
              <ul className="space-y-3 text-foreground/80 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 mt-1">•</span>
                  <span>Um curso de autoconhecimento ou desenvolvimento pessoal</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 mt-1">•</span>
                  <span>Um oráculo que dá conselhos ou interpretações pessoais</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 mt-1">•</span>
                  <span>Uma terapia ou substituto de acompanhamento clínico</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 mt-1">•</span>
                  <span>Um espaço de consumo de conteúdo ou entretenimento simbólico</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Ethical Positioning */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Card className="glass border-gold/20 mb-10">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-gold" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground">Posicionamento Ético</h3>
              </div>
              <p className="text-foreground/80 leading-relaxed mb-4">
                As ferramentas e conteúdos desta Casa foram criados para apoiar a profissional em sua prática — 
                não para substituir seu julgamento clínico ou sua escuta singular. 
              </p>
              <p className="text-foreground/80 leading-relaxed">
                Nenhuma IA, nenhum modelo, nenhum protocolo aqui se propõe a conduzir. 
                <span className="text-gold font-medium"> Quem conduz é você.</span> 
                A Casa oferece estrutura, linguagem e espelhos simbólicos para que você pense melhor sobre sua condução.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tríade Metodológica */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Card className="glass border-purple-500/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <Compass className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground">Tríade Metodológica</h3>
              </div>
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div className="p-4 rounded-lg bg-background/50">
                  <p className="text-sm text-purple-300 font-medium mb-1">Ego</p>
                  <p className="text-xs text-muted-foreground">organiza a experiência</p>
                </div>
                <div className="p-4 rounded-lg bg-background/50">
                  <p className="text-sm text-purple-300 font-medium mb-1">Neuroplasticidade</p>
                  <p className="text-xs text-muted-foreground">sustenta o processo</p>
                </div>
                <div className="p-4 rounded-lg bg-background/50">
                  <p className="text-sm text-purple-300 font-medium mb-1">Alma</p>
                  <p className="text-xs text-muted-foreground">orienta a travessia</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Professional Shortcuts - Only for verified professionals */}
        {showProfessionalShortcuts && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="mt-10"
          >
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4 text-center">
              Área Profissional
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Card 
                className="glass border-gold/20 cursor-pointer hover:border-gold/40 transition-colors"
                onClick={() => navigate('/minhas-clientes')}
              >
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <p className="font-display text-lg font-semibold text-foreground">Clientes</p>
                    <p className="text-sm text-muted-foreground">Gerencie suas clientes</p>
                  </div>
                </CardContent>
              </Card>
              <Card 
                className="glass border-gold/20 cursor-pointer hover:border-gold/40 transition-colors"
                onClick={() => navigate('/session-room')}
              >
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
                    <ClipboardList className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <p className="font-display text-lg font-semibold text-foreground">Sala de Sessão</p>
                    <p className="text-sm text-muted-foreground">Conduza seus atendimentos</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        {/* Footer Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center text-muted-foreground text-sm mt-10"
        >
          Use o menu para navegar pela Casa. Cada espaço foi desenhado para um propósito.
        </motion.p>
      </div>
    </AppLayout>
  );
}
