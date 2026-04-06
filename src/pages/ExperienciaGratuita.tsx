import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Circle, Loader2, Sparkles, Mic, Route, Map, BookOpen, GraduationCap } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useCopy } from '@/hooks/useCopy';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

type StepKey = 'quiz' | 'resultado' | 'cartografia' | 'travessia';
type StepStatus = 'pendente' | 'concluido';

const STEPS: { key: StepKey; num: number; title: string; description: string; route: string; icon: React.ComponentType<{ className?: string }> }[] = [
  {
    key: 'quiz',
    num: 1,
    title: 'Quiz da Voz',
    description: 'Descubra sua voz de condução e seu eixo simbólico.',
    route: '/quiz/descubra-seu-eixo',
    icon: Mic,
  },
  {
    key: 'resultado',
    num: 2,
    title: 'Seu Resultado',
    description: 'Receba seu mapa simbólico pessoal e entenda seu momento.',
    route: '/quiz/descubra-seu-eixo',
    icon: Sparkles,
  },
  {
    key: 'cartografia',
    num: 3,
    title: 'Cartografia Psíquica Orácula',
    description: 'Ao entrar na Casa, revele o mapa da sua CidaDELA Interior — seu GPS simbólico.',
    route: '/planos',
    icon: Map,
  },
  {
    key: 'travessia',
    num: 4,
    title: 'Travessia 00',
    description: 'Sete dias de escuta guiada para habitar a Casa antes de transformá-la.',
    route: '/travessia/travessia-zero-o-limiar-da-casa',
    icon: Route,
  },
];

export default function ExperienciaGratuita() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getCopyByKey } = useCopy();

  const [status, setStatus] = useState<Record<StepKey, StepStatus>>({
    quiz: 'pendente',
    resultado: 'pendente',
    cartografia: 'pendente',
    travessia: 'pendente',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProgress = async () => {
      if (!user) { setLoading(false); return; }
      try {
        const [{ data: quizData }, { data: cartoData }] = await Promise.all([
          supabase.from('big5_registros').select('id').eq('user_id', user.id).limit(1),
          supabase.from('cartografia_psiquica').select('id').eq('user_id', user.id).limit(1) as any,
        ]);

        const quizDone = quizData && quizData.length > 0;
        const cartoDone = cartoData && cartoData.length > 0;

        setStatus({
          quiz: quizDone ? 'concluido' : 'pendente',
          resultado: quizDone ? 'concluido' : 'pendente',
          cartografia: cartoDone ? 'concluido' : 'pendente',
          travessia: 'pendente',
        });
      } catch (e) {
        console.error('Error loading progress:', e);
      } finally {
        setLoading(false);
      }
    };
    loadProgress();
  }, [user]);

  // Find the next pending step
  const nextStep = STEPS.find(s => status[s.key] === 'pendente');

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-10 max-w-2xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <p className="text-xs uppercase tracking-[0.25em] text-primary/60 mb-3">Sua jornada começa aqui</p>
          <h1 className="font-display text-3xl md:text-4xl text-foreground mb-3">
            Experiência Gratuita
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
            Quatro passos para escutar sua voz, entender seu momento e escolher seu caminho na Casa Orácula.
          </p>
        </motion.div>

        {/* Steps */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        ) : (
          <div className="relative space-y-4">
            {/* Vertical line */}
            <div className="absolute left-6 top-8 bottom-8 w-px bg-gradient-to-b from-primary/20 via-primary/10 to-transparent" />

            {STEPS.map((step, idx) => {
              const stepStatus = status[step.key];
              const isNext = nextStep?.key === step.key;
              const Icon = step.icon;

              return (
                <motion.div
                  key={step.key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + idx * 0.12, duration: 0.5 }}
                >
                  <Card
                    className={cn(
                      'border transition-all duration-300 cursor-pointer group',
                      stepStatus === 'concluido'
                        ? 'border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/30'
                        : isNext
                          ? 'border-primary/30 bg-primary/5 hover:border-primary/40 shadow-md'
                          : 'border-border/20 bg-card/40 hover:border-border/40',
                    )}
                    onClick={() => navigate(step.route)}
                  >
                    <CardContent className="p-5 md:p-6">
                      <div className="flex items-start gap-4">
                        {/* Step number circle */}
                        <div className="relative z-10">
                          <div
                            className={cn(
                              'w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all',
                              stepStatus === 'concluido'
                                ? 'bg-emerald-500/10 border-emerald-500/30'
                                : isNext
                                  ? 'bg-primary/10 border-primary/30'
                                  : 'bg-card border-border/30',
                            )}
                          >
                            {stepStatus === 'concluido' ? (
                              <Check className="w-5 h-5 text-emerald-400" />
                            ) : (
                              <Icon className={cn(
                                'w-5 h-5',
                                isNext ? 'text-primary' : 'text-muted-foreground/50',
                              )} />
                            )}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={cn(
                              'text-xs font-medium uppercase tracking-wider',
                              stepStatus === 'concluido' ? 'text-emerald-400' : isNext ? 'text-primary' : 'text-muted-foreground/50',
                            )}>
                              Passo {step.num}
                            </span>
                            {stepStatus === 'concluido' && (
                              <span className="text-xs text-emerald-400/70">✓ Concluído</span>
                            )}
                          </div>
                          <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                            {step.title}
                          </h3>
                          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                            {step.description}
                          </p>

                          {isNext && (
                            <Button variant="gold" size="sm" className="gap-2">
                              Começar
                              <ArrowRight className="w-4 h-4" />
                            </Button>
                          )}
                          {stepStatus === 'concluido' && (
                            <Button variant="outline" size="sm" className="gap-2 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10">
                              Revisitar
                              <ArrowRight className="w-4 h-4" />
                            </Button>
                          )}
                          {!isNext && stepStatus === 'pendente' && (
                            <span className="text-xs text-muted-foreground/40 italic">
                              Complete o passo anterior para desbloquear
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* CTA final — Convite ao Clube */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mt-12"
        >
          <div className="rounded-2xl border border-primary/10 bg-card/30 backdrop-blur-sm p-8 text-center space-y-4">
            <p className="text-xs uppercase tracking-[0.2em] text-primary/50">Após a travessia</p>
            <h2 className="font-display text-xl text-foreground">
              {getCopyByKey('convite_clube_titulo', 'Continue sua jornada no Clube do Livro')}
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              {getCopyByKey('convite_clube_descricao',
                'Sistema de leitura como intervenção psíquica guiada — inclui a Cartografia da Cidadela e travessias semanais.'
              )}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="gold"
                size="lg"
                onClick={() => navigate('/planos')}
                className="gap-2 px-8"
              >
                <BookOpen className="w-4 h-4" />
                Clube do Livro
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/oracula')}
                className="gap-2 px-8"
              >
                <GraduationCap className="w-4 h-4" />
                Formação Orácula
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}
