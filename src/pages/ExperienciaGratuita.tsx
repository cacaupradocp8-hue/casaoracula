import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronRight, Circle, Loader2, Compass, Brain, Route, BookOpen, Users } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface StepStatus {
  quiz: 'pendente' | 'andamento' | 'concluido';
  big5: 'pendente' | 'andamento' | 'concluido';
  travessia: 'pendente' | 'andamento' | 'concluido';
  aula: 'pendente' | 'andamento' | 'concluido';
  clube: 'pendente' | 'andamento' | 'concluido';
}

const STEPS = [
  {
    key: 'quiz' as const,
    num: 1,
    title: 'Descubra sua Voz',
    subtitle: 'Quiz da Voz',
    description: 'Responda ao Quiz da Voz e comece a escutar o que já sabe sobre si.',
    route: '/quiz/descubra-seu-eixo',
    icon: Compass,
    accent: 'gold',
  },
  {
    key: 'big5' as const,
    num: 2,
    title: 'Mapeie seus Territórios',
    subtitle: 'Big5 Oracular',
    description: 'Cinco forças simbólicas revelam como você habita o mundo.',
    route: '/ferramenta/big5-simbolico',
    icon: Brain,
    accent: 'purple',
  },
  {
    key: 'travessia' as const,
    num: 3,
    title: 'Viva a Travessia Zero',
    subtitle: '7 dias de prática',
    description: 'Sete dias para habitar a Casa. Sem pressa. Sem performance.',
    route: '/travessias',
    icon: Route,
    accent: 'emerald',
  },
  {
    key: 'aula' as const,
    num: 4,
    title: 'Habitar a Casa',
    subtitle: 'Aula inaugural',
    description: 'O que significa estar aqui — uma aula sobre presença e método.',
    route: '/cursos',
    icon: BookOpen,
    accent: 'blue',
  },
  {
    key: 'clube' as const,
    num: 5,
    title: 'Entre no Clube',
    subtitle: 'Clube de Leitura Oracular',
    description: 'Leitura vira competência. Portal vira prática. Continue a jornada.',
    route: '/clube-livro',
    icon: Users,
    accent: 'amber',
  },
];

const accentStyles: Record<string, { ring: string; glow: string; icon: string; line: string }> = {
  gold: {
    ring: 'border-gold/40 shadow-[0_0_20px_-6px_hsl(var(--gold)/0.3)]',
    glow: 'bg-gold/10',
    icon: 'text-gold',
    line: 'from-gold/40 to-gold/5',
  },
  purple: {
    ring: 'border-purple-400/30 shadow-[0_0_20px_-6px_rgba(168,85,247,0.2)]',
    glow: 'bg-purple-500/10',
    icon: 'text-purple-400',
    line: 'from-purple-400/30 to-purple-400/5',
  },
  emerald: {
    ring: 'border-emerald-400/30 shadow-[0_0_20px_-6px_rgba(52,211,153,0.2)]',
    glow: 'bg-emerald-500/10',
    icon: 'text-emerald-400',
    line: 'from-emerald-400/30 to-emerald-400/5',
  },
  blue: {
    ring: 'border-blue-400/30 shadow-[0_0_20px_-6px_rgba(96,165,250,0.2)]',
    glow: 'bg-blue-500/10',
    icon: 'text-blue-400',
    line: 'from-blue-400/30 to-blue-400/5',
  },
  amber: {
    ring: 'border-amber-400/30 shadow-[0_0_20px_-6px_rgba(251,191,36,0.2)]',
    glow: 'bg-amber-500/10',
    icon: 'text-amber-400',
    line: 'from-amber-400/30 to-amber-400/5',
  },
};

export default function ExperienciaGratuita() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState<StepStatus>({
    quiz: 'pendente',
    big5: 'pendente',
    travessia: 'pendente',
    aula: 'pendente',
    clube: 'pendente',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProgress = async () => {
      if (!user) { setLoading(false); return; }
      try {
        const [{ data: quizData }, { data: big5Data }] = await Promise.all([
          supabase.from('big5_registros').select('id').eq('user_id', user.id).limit(1),
          supabase.from('big5_symbolic_registros').select('id').eq('user_id', user.id).limit(1),
        ]);
        setStatus({
          quiz: quizData && quizData.length > 0 ? 'concluido' : 'pendente',
          big5: big5Data && big5Data.length > 0 ? 'concluido' : 'pendente',
          travessia: 'pendente',
          aula: 'pendente',
          clube: 'pendente',
        });
      } catch (e) {
        console.error('Error loading progress:', e);
      } finally {
        setLoading(false);
      }
    };
    loadProgress();
  }, [user]);

  const getActionLabel = (s: string) => {
    if (s === 'concluido') return 'Revisitar';
    if (s === 'andamento') return 'Continuar';
    return 'Iniciar';
  };

  return (
    <AppLayout>
      <div className="min-h-screen relative">
        {/* Ambient background */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gold/[0.04] blur-[120px]" />
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-background to-transparent" />
        </div>

        <div className="container mx-auto px-4 py-12 md:py-20 max-w-2xl relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/20 bg-gold/[0.05] mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              <span className="text-xs tracking-[0.2em] uppercase text-gold/80 font-medium">
                Experiência Gratuita
              </span>
            </div>

            <h1 className="font-display text-3xl md:text-5xl text-foreground mb-4 leading-tight">
              Seu caminho começa
              <br />
              <span className="text-gold">aqui.</span>
            </h1>
            <p className="text-muted-foreground/70 max-w-md mx-auto leading-relaxed">
              Cinco etapas. Sem pressa. Cada passo revela algo sobre quem você já é.
            </p>
          </motion.div>

          {/* Steps */}
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-6 h-6 text-gold animate-spin" />
            </div>
          ) : (
            <div className="space-y-4">
              {STEPS.map((step, idx) => {
                const stepStatus = status[step.key];
                const styles = accentStyles[step.accent];
                const isDone = stepStatus === 'concluido';
                const Icon = step.icon;

                return (
                  <motion.div
                    key={step.key}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + idx * 0.1, duration: 0.6 }}
                  >
                    <button
                      onClick={() => navigate(step.route)}
                      className={cn(
                        'w-full text-left group relative rounded-2xl border bg-card/40 backdrop-blur-sm p-5 md:p-6 transition-all duration-500',
                        'hover:bg-card/60 hover:scale-[1.01]',
                        isDone
                          ? 'border-emerald-500/20 bg-emerald-500/[0.03]'
                          : styles.ring,
                      )}
                    >
                      <div className="flex items-start gap-4 md:gap-5">
                        {/* Icon */}
                        <div className={cn(
                          'relative flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center border transition-all duration-500',
                          isDone
                            ? 'bg-emerald-500/10 border-emerald-500/20'
                            : `${styles.glow} border-white/[0.06]`,
                        )}>
                          {isDone ? (
                            <Check className="w-5 h-5 md:w-6 md:h-6 text-emerald-400" />
                          ) : (
                            <Icon className={cn('w-5 h-5 md:w-6 md:h-6 transition-colors', styles.icon)} />
                          )}
                          {/* Step number badge */}
                          <div className={cn(
                            'absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold',
                            isDone
                              ? 'bg-emerald-500 text-background'
                              : 'bg-card border border-white/10 text-muted-foreground',
                          )}>
                            {step.num}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className={cn(
                              'text-[10px] tracking-[0.15em] uppercase font-medium',
                              isDone ? 'text-emerald-400/60' : 'text-muted-foreground/40',
                            )}>
                              {step.subtitle}
                            </span>
                          </div>
                          <h3 className={cn(
                            'font-display text-base md:text-lg font-semibold mb-1 transition-colors',
                            isDone ? 'text-emerald-300/80' : 'text-foreground group-hover:text-gold/90',
                          )}>
                            {step.title}
                          </h3>
                          <p className="text-sm text-muted-foreground/60 leading-relaxed">
                            {step.description}
                          </p>
                        </div>

                        {/* Action */}
                        <div className="flex-shrink-0 self-center">
                          <div className={cn(
                            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300',
                            isDone
                              ? 'text-emerald-400/70 bg-emerald-500/10'
                              : 'text-gold/70 bg-gold/[0.06] group-hover:bg-gold/10 group-hover:text-gold',
                          )}>
                            {getActionLabel(stepStatus)}
                            <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                          </div>
                        </div>
                      </div>

                      {/* Connecting line to next step */}
                      {idx < STEPS.length - 1 && (
                        <div className={cn(
                          'absolute left-[2.35rem] md:left-[2.65rem] -bottom-4 w-px h-4 bg-gradient-to-b',
                          isDone ? 'from-emerald-500/20 to-emerald-500/5' : styles.line,
                        )} />
                      )}
                    </button>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Bottom message */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="text-center text-muted-foreground/30 text-xs mt-12 tracking-wide"
          >
            Sem pressa. Sem compromisso. Apenas presença.
          </motion.p>
        </div>
      </div>
    </AppLayout>
  );
}
