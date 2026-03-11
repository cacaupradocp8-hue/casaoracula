// ============================================
// JORNADA — Roteamento por perfil
// ============================================

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Moon, Sparkles, ArrowRight, BookOpen, Compass, Wrench, Flower2, Library
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { supabase } from '@/integrations/supabase/client';
import { VisitorHomePage } from '@/components/visitor/VisitorHomePage';
import { ClubeHomePage } from '@/components/clube-livro/ClubeHomePage';
import { HomeFormacaoSections } from '@/components/home/HomeFormacaoSections';
import { HomeTerapeutaSections } from '@/components/home/HomeTerapeutaSections';
import { ExplorarCasaSection } from '@/components/home/ExplorarCasaSection';
import { useJornadaData } from '@/hooks/useJornadaData';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { canAccessFeature } from '@/types/portal';
import mandalaHome from '@/assets/mandala-home.jpg';

// ════════════════════════════════════════════════════════════════════════════
// TIPOS & MAPEAMENTOS
// ════════════════════════════════════════════════════════════════════════════

type GrauAtual = 'iniciacao' | 'profundizacao' | 'integracao';

interface PortalInfo { nome: string; subtitulo: string; }

const PORTAIS_INFO: Record<string, PortalInfo> = {
  visitante: { nome: 'Portal Zero', subtitulo: 'O Limiar' },
  aluna: { nome: 'Portal I', subtitulo: 'Mapa da Psique' },
  assinante: { nome: 'Portal II', subtitulo: 'Campo Simbólico' },
  oracula: { nome: 'Portal III', subtitulo: 'A Prática Viva' },
  admin: { nome: 'Portal da Guardiã', subtitulo: 'Transmissão' },
};

const GRAUS_LABEL: Record<GrauAtual, string> = {
  iniciacao: 'Iniciação',
  profundizacao: 'Profundização',
  integracao: 'Integração',
};

const FRASES_POR_GRAU: Record<GrauAtual, string[]> = {
  iniciacao: [
    "A jornada começa quando você escolhe olhar para dentro.",
    "Cada ferramenta que você toca abre uma porta em si mesma.",
    "Permita-se não saber. O mistério é o convite."
  ],
  profundizacao: [
    "Você está aprendendo a habitar o que antes apenas visitava.",
    "A prática revela o que a teoria apenas nomeia.",
    "O campo se aprofunda quando você retorna com presença."
  ],
  integracao: [
    "O que foi fragmento agora busca reunião.",
    "Integrar é trazer para o corpo o que a mente compreendeu.",
    "Você não está terminando. Está completando um ciclo."
  ]
};

function getFraseOraculo(grau: GrauAtual): string {
  const frases = FRASES_POR_GRAU[grau];
  const weekNumber = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  return frases[weekNumber % frases.length];
}

function getPortalInfo(portal: string): PortalInfo {
  return PORTAIS_INFO[portal] || PORTAIS_INFO.visitante;
}

// Quick navigation for aluna/formação
const quickLinks = [
  { label: 'Formação', icon: BookOpen, path: '/oracula', color: 'text-primary' },
  { label: 'Travessias', icon: Compass, path: '/biblioteca-travessias', color: 'text-accent' },
  { label: 'Ferramentas', icon: Wrench, path: '/ferramentas', color: 'text-primary' },
  { label: 'Biblioteca', icon: Library, path: '/minha-biblioteca', color: 'text-primary' },
  { label: 'Oráculos', icon: Sparkles, path: '/oraculos', color: 'text-primary' },
  { label: 'Jardim', icon: Flower2, path: '/jardim-da-psique', color: 'text-primary' },
];

// ════════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ════════════════════════════════════════════════════════════════════════════

export default function Jornada() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [grau, setGrau] = useState<GrauAtual>('iniciacao');
  const [proximoGesto, setProximoGesto] = useState({ texto: 'Continuar sua formação', rota: '/oracula' });
  
  const { fraseSelo } = useJornadaData(user && user.portal !== 'visitante' ? 'iniciada' : null, user?.id);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      setLoading(true);
      
      try {
        const { data: jardimRecords } = await supabase
          .from('jardim_psique_registros')
          .select('id')
          .eq('user_id', user.id)
          .limit(10);

        const { data: formationProgress } = await supabase
          .from('v_formation_progress')
          .select('completed_travessias, completed_rituals')
          .eq('user_id', user.id)
          .limit(1);
        
        const jardimCount = jardimRecords?.length || 0;
        const travessiasCount = Number(formationProgress?.[0]?.completed_travessias) || 0;
        const rituaisCount = Number(formationProgress?.[0]?.completed_rituals) || 0;
        const progressTotal = travessiasCount + rituaisCount;
        
        if (progressTotal >= 10 && jardimCount >= 5) {
          setGrau('integracao');
        } else if (progressTotal >= 3 || jardimCount >= 3) {
          setGrau('profundizacao');
        } else {
          setGrau('iniciacao');
        }

        if (jardimCount === 0) {
          setProximoGesto({ texto: 'Escrever no Jardim da Psiquê', rota: '/jardim-da-psique' });
        } else if (progressTotal === 0) {
          setProximoGesto({ texto: 'Iniciar uma travessia', rota: '/travessias' });
        } else {
          setProximoGesto({ texto: 'Continuar sua formação', rota: '/oracula' });
        }
      } catch (error) {
        console.error('Erro ao carregar dados da jornada:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  // ═══ VISITANTE → VisitorHomePage ═══
  if (!user || user.portal === 'visitante') {
    return <VisitorHomePage />;
  }

  // ═══ ASSINANTE → ClubeHomePage ═══
  const isAssinante = user.portal === 'assinante';
  const isAluna = canAccessFeature(user.portal, 'aluna');
  if (isAssinante && !canAccessFeature(user.portal, 'oracula')) {
    return <ClubeHomePage />;
  }

  // ═══ ALUNA / ORÁCULA / ADMIN → Jornada completa ═══
  const portalInfo = getPortalInfo(user.portal || 'visitante');
  const fraseOraculo = fraseSelo || getFraseOraculo(grau);
  const welcomeName = user?.name?.split(' ')[0] || 'Aluna';

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-[80vh] flex items-center justify-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full border border-primary/20 flex items-center justify-center">
              <Moon className="w-8 h-8 text-primary/30 animate-pulse" />
            </div>
            <p className="text-muted-foreground/50 text-sm font-display italic">Escutando o campo...</p>
          </motion.div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="relative">
        {/* ═══ HERO SECTION ═══ */}
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.12, scale: 1 }}
              transition={{ duration: 2, ease: 'easeOut' }}
              className="w-[500px] h-[500px] md:w-[650px] md:h-[650px]"
            >
              <img src={mandalaHome} alt="" className="w-full h-full object-contain animate-ritual-breathe" />
            </motion.div>
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />

          <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-xs uppercase tracking-[0.3em] text-primary/60 mb-4"
            >
              {portalInfo.subtitulo}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.7 }}
              className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-3 leading-tight"
            >
              Bem-vinda, <span className="text-gold-gradient">{welcomeName}</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex items-center justify-center gap-3 mb-8"
            >
              <span className="h-px w-12 bg-primary/30" />
              <span className="text-sm text-primary/70 font-display">{portalInfo.nome}</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/5 border border-primary/15 text-xs text-foreground/60">
                <Sparkles className="w-3 h-3 text-primary/50" />
                {GRAUS_LABEL[grau]}
              </span>
              <span className="h-px w-12 bg-primary/30" />
            </motion.div>

            <motion.blockquote
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-foreground/60 italic leading-relaxed text-lg md:text-xl font-display max-w-md mx-auto mb-10"
            >
              "{fraseOraculo}"
            </motion.blockquote>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              <Button
                variant="gold"
                size="xl"
                onClick={() => navigate(proximoGesto.rota)}
                className="gap-2 px-8 py-6 text-lg shadow-gold"
              >
                {proximoGesto.texto}
                <ArrowRight className="w-5 h-5" />
              </Button>
            </motion.div>
          </div>
        </section>

        {/* ═══ QUICK NAVIGATION ═══ */}
        <section className="relative px-4 pb-16 -mt-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {quickLinks.map((link, i) => {
                  const Icon = link.icon;
                  return (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 + i * 0.05, duration: 0.4 }}
                    >
                      <Card
                        className="glass border-border/30 hover:border-primary/30 transition-all duration-300 cursor-pointer group hover:shadow-lg"
                        onClick={() => navigate(link.path)}
                      >
                        <CardContent className="p-4 text-center">
                          <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/25 transition-all">
                            <Icon className={`w-5 h-5 ${link.color} opacity-70 group-hover:opacity-100 transition-opacity`} />
                          </div>
                          <p className="text-xs font-medium text-foreground/70 group-hover:text-foreground transition-colors">
                            {link.label}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══ SEÇÕES POR ESTÁGIO ═══ */}
        {canAccessFeature(user.portal, 'oracula') && user.id && (
          <HomeTerapeutaSections userId={user.id} />
        )}
        {canAccessFeature(user.portal, 'aluna') && user.id && (
          <HomeFormacaoSections userId={user.id} />
        )}

        <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

        {/* ═══ EXPLORAR A CASA ═══ */}
        <ExplorarCasaSection />
      </div>
    </AppLayout>
  );
}
