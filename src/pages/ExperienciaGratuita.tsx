import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronRight, Circle, Loader2 } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
    title: 'Descubra seu Eixo',
    description: 'Responda ao Quiz da Voz e comece a se escutar.',
    route: '/salas/big5',
  },
  {
    key: 'big5' as const,
    num: 2,
    title: 'Entenda sua Estrutura',
    description: 'Mapeie seus cinco territórios com o Big5 Simbólico.',
    route: '/ferramenta/big5-simbolico',
  },
  {
    key: 'travessia' as const,
    num: 3,
    title: 'Viva a Travessia',
    description: 'Sete dias de prática guiada para habitar a Casa.',
    route: '/travessias',
  },
  {
    key: 'aula' as const,
    num: 4,
    title: 'Aula: Habitar a Casa',
    description: 'Uma aula sobre o que significa estar aqui.',
    route: '/cursos',
  },
  {
    key: 'clube' as const,
    num: 5,
    title: 'Convite para o Clube',
    description: 'Conheça o Clube de Leitura Simbólica e continue.',
    route: '/clube-livro',
  },
];

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
        // Check quiz completion
        const { data: quizData } = await supabase
          .from('big5_registros')
          .select('id')
          .eq('user_id', user.id)
          .limit(1);
        
        // Check big5 symbolic
        const { data: big5Data } = await supabase
          .from('big5_symbolic_registros')
          .select('id')
          .eq('user_id', user.id)
          .limit(1);

        const newStatus: StepStatus = {
          quiz: quizData && quizData.length > 0 ? 'concluido' : 'pendente',
          big5: big5Data && big5Data.length > 0 ? 'concluido' : 'pendente',
          travessia: 'pendente',
          aula: 'pendente',
          clube: 'pendente',
        };

        setStatus(newStatus);
      } catch (e) {
        console.error('Error loading progress:', e);
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, [user]);

  const getStatusIcon = (s: string) => {
    if (s === 'concluido') return <Check className="w-5 h-5 text-emerald-400" />;
    if (s === 'andamento') return <Loader2 className="w-5 h-5 text-primary animate-spin" />;
    return <Circle className="w-5 h-5 text-muted-foreground/30" />;
  };

  const getStatusLabel = (s: string) => {
    if (s === 'concluido') return 'Concluído';
    if (s === 'andamento') return 'Em andamento';
    return 'Não iniciado';
  };

  const getActionLabel = (s: string) => {
    if (s === 'concluido') return 'Revisitar';
    if (s === 'andamento') return 'Continuar';
    return 'Começar';
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-10 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="font-display text-3xl md:text-4xl text-foreground mb-2">
            Experiência Gratuita
          </h1>
          <p className="text-muted-foreground">
            Siga o caminho abaixo, uma etapa por vez.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        ) : (
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-6 bottom-6 w-px bg-primary/10" />

            <div className="space-y-4">
              {STEPS.map((step, idx) => {
                const stepStatus = status[step.key];
                return (
                  <motion.div
                    key={step.key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card className={cn(
                      'border-primary/10 transition-all duration-300',
                      stepStatus === 'concluido' && 'border-emerald-500/20 bg-emerald-500/5',
                    )}>
                      <CardContent className="p-5 md:p-6">
                        <div className="flex items-start gap-4">
                          {/* Step number + status */}
                          <div className="relative z-10 flex flex-col items-center gap-1">
                            <div className={cn(
                              'w-12 h-12 rounded-full flex items-center justify-center text-lg font-display font-bold border-2',
                              stepStatus === 'concluido'
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                : 'bg-card border-primary/15 text-muted-foreground',
                            )}>
                              {step.num}
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-display text-lg font-semibold text-foreground">
                                {step.title}
                              </h3>
                              {getStatusIcon(stepStatus)}
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                              {step.description}
                            </p>
                            <div className="flex items-center gap-3">
                              <Button
                                variant={stepStatus === 'concluido' ? 'outline' : 'gold'}
                                size="sm"
                                onClick={() => navigate(step.route)}
                                className="gap-2"
                              >
                                {getActionLabel(stepStatus)}
                                <ChevronRight className="w-4 h-4" />
                              </Button>
                              <span className="text-xs text-muted-foreground/60">
                                {getStatusLabel(stepStatus)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
