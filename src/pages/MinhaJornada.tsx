import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  DoorOpen, BookOpen, GraduationCap, Wrench, Cog, Users, Sparkles,
  ArrowRight, Check, Circle, Loader2, ChevronRight,
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useEffectivePortal } from '@/hooks/useEffectivePortal';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { canAccessFeature } from '@/types/portal';

type StageStatus = 'nao_iniciado' | 'em_jornada' | 'concluido';

interface Stage {
  key: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  route: string;
}

const STAGES: Stage[] = [
  {
    key: 'sala-visitas',
    title: 'Sala de Visitas',
    description: 'Primeiro contato com a Casa Orácula. Aqui acontecem o Quiz da Voz e a Travessia inicial.',
    icon: DoorOpen,
    route: '/experiencia-gratuita',
  },
  {
    key: 'clube',
    title: 'Clube de Leitura Oracular',
    description: 'Espaço de estudo simbólico através de livros e reflexões junguianas.',
    icon: BookOpen,
    route: '/clube-livro',
  },
  {
    key: 'formacao',
    title: 'Formação no Método',
    description: 'Programa de formação profissional no Método Orácula.',
    icon: GraduationCap,
    route: '/cursos',
  },
  {
    key: 'treinamento',
    title: 'Sala de Treinamento',
    description: 'Ambiente de prática com estudos de caso e simulações.',
    icon: Wrench,
    route: '/sala-de-treinamento',
  },
  {
    key: 'casa-maquinas',
    title: 'Casa das Máquinas',
    description: 'SaaS profissional para condução de sessões terapêuticas.',
    icon: Cog,
    route: '/casa-das-maquinas',
  },
  {
    key: 'comunidade',
    title: 'Comunidade',
    description: 'Rede de facilitadoras e espaço de trocas profissionais.',
    icon: Users,
    route: '/comunidade',
  },
  {
    key: 'especializacao',
    title: 'Portais de Especialização',
    description: 'Caminhos avançados de aprofundamento e maestria.',
    icon: Sparkles,
    route: '/portais-especializacao',
  },
];

function getButtonLabel(status: StageStatus) {
  if (status === 'concluido') return 'Acessar';
  if (status === 'em_jornada') return 'Continuar';
  return 'Explorar';
}

export default function MinhaJornada() {
  const { user } = useAuth();
  const { effectivePortal } = useEffectivePortal();
  const navigate = useNavigate();
  const [statuses, setStatuses] = useState<Record<string, StageStatus>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const detect = async () => {
      if (!user) { setLoading(false); return; }

      const portal = effectivePortal;
      const isOracula = canAccessFeature(portal, 'oracula');
      const isAluna = canAccessFeature(portal, 'aluna');
      const isAssinante = canAccessFeature(portal, 'assinante');

      // Check quiz completion
      let quizDone = false;
      try {
        const { data } = await supabase
          .from('big5_registros')
          .select('id')
          .eq('user_id', user.id)
          .limit(1);
        quizDone = (data && data.length > 0);
      } catch {}

      // Check clients (SaaS usage)
      let hasClients = false;
      if (isOracula) {
        try {
          const { count } = await supabase
            .from('clientes')
            .select('id', { count: 'exact', head: true })
            .eq('terapeuta_id', user.id);
          hasClients = (count || 0) > 0;
        } catch {}
      }

      // Check community participation
      let hasCommunity = false;
      try {
        const { count } = await supabase
          .from('community_posts')
          .select('id', { count: 'exact', head: true })
          .eq('autor_id', user.id);
        hasCommunity = (count || 0) > 0;
      } catch {}

      // Build statuses
      const s: Record<string, StageStatus> = {
        'sala-visitas': quizDone ? 'concluido' : 'em_jornada',
        'clube': isAssinante ? 'em_jornada' : quizDone ? 'nao_iniciado' : 'nao_iniciado',
        'formacao': isAluna ? 'em_jornada' : 'nao_iniciado',
        'treinamento': isAluna ? 'em_jornada' : 'nao_iniciado',
        'casa-maquinas': isOracula ? (hasClients ? 'em_jornada' : 'em_jornada') : 'nao_iniciado',
        'comunidade': hasCommunity ? 'em_jornada' : (isAssinante ? 'nao_iniciado' : 'nao_iniciado'),
        'especializacao': isOracula ? 'nao_iniciado' : 'nao_iniciado',
      };

      // Mark completed stages for higher portals
      if (isAssinante) s['sala-visitas'] = 'concluido';
      if (isAluna) { s['sala-visitas'] = 'concluido'; s['clube'] = 'concluido'; }
      if (isOracula) { s['sala-visitas'] = 'concluido'; s['clube'] = 'concluido'; s['formacao'] = 'concluido'; s['treinamento'] = 'concluido'; }

      setStatuses(s);
      setLoading(false);
    };

    detect();
  }, [user, effectivePortal]);

  // Determine next step suggestion
  const getNextStep = (): Stage | null => {
    const order = ['sala-visitas', 'clube', 'formacao', 'treinamento', 'casa-maquinas', 'comunidade', 'especializacao'];
    for (const key of order) {
      if (statuses[key] === 'nao_iniciado') {
        return STAGES.find(s => s.key === key) || null;
      }
    }
    return null;
  };

  const nextStep = !loading ? getNextStep() : null;

  const fade = (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay },
  });

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-10 max-w-2xl">
        {/* Header */}
        <motion.div {...fade()} className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.25em] text-primary/60 mb-3">Mapa pessoal</p>
          <h1 className="font-display text-3xl md:text-4xl text-foreground mb-3">
            Minha Jornada na Casa Orácula
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
            Veja onde você está, os caminhos que já percorreu e o que vem a seguir.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        ) : (
          <>
            {/* Journey map */}
            <div className="relative space-y-4 mb-12">
              {/* Vertical connector */}
              <div className="absolute left-6 top-8 bottom-8 w-px bg-gradient-to-b from-primary/20 via-primary/10 to-transparent" />

              {STAGES.map((stage, idx) => {
                const status = statuses[stage.key] || 'nao_iniciado';
                const Icon = stage.icon;
                const isCurrent = status === 'em_jornada';

                return (
                  <motion.div key={stage.key} {...fade(0.1 + idx * 0.08)}>
                    <Card
                      className={cn(
                        'border transition-all duration-300 cursor-pointer group',
                        status === 'concluido' && 'border-emerald-500/20 bg-emerald-500/5',
                        isCurrent && 'border-primary/30 bg-primary/5 shadow-md',
                        status === 'nao_iniciado' && 'border-border/20 bg-card/40 opacity-70',
                      )}
                      onClick={() => navigate(stage.route)}
                    >
                      <CardContent className="p-5">
                        <div className="flex items-start gap-4">
                          {/* Status indicator */}
                          <div className="relative z-10">
                            <div className={cn(
                              'w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all',
                              status === 'concluido' && 'bg-emerald-500/10 border-emerald-500/30',
                              isCurrent && 'bg-primary/10 border-primary/30 ring-2 ring-primary/10',
                              status === 'nao_iniciado' && 'bg-card border-border/30',
                            )}>
                              {status === 'concluido' ? (
                                <Check className="w-5 h-5 text-emerald-400" />
                              ) : isCurrent ? (
                                <Icon className="w-5 h-5 text-primary" />
                              ) : (
                                <Circle className="w-5 h-5 text-muted-foreground/30" />
                              )}
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={cn(
                                'text-xs font-medium uppercase tracking-wider',
                                status === 'concluido' && 'text-emerald-400',
                                isCurrent && 'text-primary',
                                status === 'nao_iniciado' && 'text-muted-foreground/50',
                              )}>
                                {status === 'concluido' ? '✓ Concluído' : isCurrent ? '◉ Em jornada' : '○ Não iniciado'}
                              </span>
                            </div>
                            <h3 className="font-display text-lg text-foreground mb-1">{stage.title}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed mb-3">{stage.description}</p>
                            <Button
                              variant={isCurrent ? 'gold' : status === 'concluido' ? 'outline' : 'ghost'}
                              size="sm"
                              className={cn(
                                'gap-2',
                                status === 'concluido' && 'border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10',
                              )}
                            >
                              {getButtonLabel(status)}
                              <ChevronRight className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Next step suggestion */}
            {nextStep && (
              <motion.div {...fade(0.8)}>
                <div className="rounded-2xl border border-primary/15 bg-primary/5 p-6 md:p-8 text-center space-y-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-primary/60">Seu próximo passo na Casa</p>
                  <h2 className="font-display text-xl text-foreground">{nextStep.title}</h2>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">{nextStep.description}</p>
                  <Button
                    variant="gold"
                    size="lg"
                    onClick={() => navigate(nextStep.route)}
                    className="gap-2 px-8"
                  >
                    {getButtonLabel('nao_iniciado')}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}
