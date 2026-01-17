import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { canAccessFeature, PortalType } from '@/types/portal';
import {
  Home,
  Sparkles,
  Users,
  GraduationCap,
  Library,
  Lock,
  CheckCircle2,
  MapPin,
  ArrowRight,
  Bot,
  BookOpen,
  Brain,
  Target,
  Compass,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface JourneyStep {
  id: string;
  title: string;
  description: string;
  icon: typeof Home;
  items: {
    label: string;
    path: string;
    icon: typeof Home;
    minPortal: PortalType;
    requiresMatricula?: 'mentoria' | 'formacao';
  }[];
  minPortal: PortalType;
}

const journeySteps: JourneyStep[] = [
  {
    id: 'chegada',
    title: 'Chegada',
    description: 'Seu ponto de partida na Casa ORÁCULA',
    icon: Home,
    minPortal: 'visitante',
    items: [
      { label: 'Dashboard', path: '/dashboard', icon: Home, minPortal: 'visitante' },
      { label: 'Explorar Salas', path: '/salas', icon: Compass, minPortal: 'visitante' },
    ],
  },
  {
    id: 'organizacao',
    title: 'Organização Interna',
    description: 'Ferramentas para autoconhecimento e prática',
    icon: Brain,
    minPortal: 'pre_iniciada',
    items: [
      { label: 'Big5 Simbólico', path: '/ferramentas/big5', icon: Brain, minPortal: 'pre_iniciada' },
      { label: 'Eneagrama', path: '/ferramentas/eneagrama', icon: Target, minPortal: 'pre_iniciada' },
      { label: 'Oráculos', path: '/ferramentas/mapa-oracula', icon: Sparkles, minPortal: 'pre_iniciada' },
      { label: 'Agentes IA', path: '/agentes', icon: Bot, minPortal: 'pre_iniciada' },
    ],
  },
  {
    id: 'pratica',
    title: 'Prática Profissional',
    description: 'Gerencie clientes e estude casos reais',
    icon: Users,
    minPortal: 'pre_iniciada',
    items: [
      { label: 'Minhas Clientes', path: '/minhas-clientes', icon: Users, minPortal: 'pre_iniciada' },
      { label: 'Casos de Estudo', path: '/casos', icon: BookOpen, minPortal: 'pre_iniciada' },
    ],
  },
  {
    id: 'formacao',
    title: 'Formação',
    description: 'Aprofunde sua jornada com mentoria e formação',
    icon: GraduationCap,
    minPortal: 'pre_iniciada',
    items: [
      { label: 'Mentoria ORÁCULA', path: '/mentoria', icon: Compass, minPortal: 'iniciada', requiresMatricula: 'mentoria' },
      { label: 'Formação ORÁCULA', path: '/formacao', icon: GraduationCap, minPortal: 'pre_iniciada', requiresMatricula: 'formacao' },
    ],
  },
  {
    id: 'integracao',
    title: 'Integração',
    description: 'Acesse a biblioteca completa e conteúdos avançados',
    icon: Library,
    minPortal: 'pre_iniciada',
    items: [
      { label: 'Biblioteca', path: '/biblioteca', icon: Library, minPortal: 'pre_iniciada' },
      { label: 'Áudios', path: '/audios', icon: Sparkles, minPortal: 'pre_iniciada' },
    ],
  },
];

export default function Jornada() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hasMentoriaAccess, setHasMentoriaAccess] = useState(false);
  const [hasFormacaoAccess, setHasFormacaoAccess] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Check matriculas
  useEffect(() => {
    const checkMatriculas = async () => {
      if (!user) return;

      if (user.portal === 'admin') {
        setHasMentoriaAccess(true);
        setHasFormacaoAccess(true);
        return;
      }

      try {
        const { data: matriculas } = await supabase
          .from('matriculas')
          .select('curso_id')
          .eq('user_id', user.id)
          .eq('ativa', true);

        if (matriculas) {
          const cursoIds = matriculas.map(m => m.curso_id);
          setHasMentoriaAccess(cursoIds.includes('mentoria_oracula') || cursoIds.includes('mentoria'));
          setHasFormacaoAccess(cursoIds.includes('formacao_oracula') || cursoIds.includes('formacao'));
        }
      } catch (error) {
        console.error('Error checking matriculas:', error);
      }
    };

    checkMatriculas();
  }, [user]);

  // Determine current step based on user access
  useEffect(() => {
    if (!user) return;

    // Find the highest unlocked step
    let highestUnlocked = 0;
    
    for (let i = 0; i < journeySteps.length; i++) {
      const step = journeySteps[i];
      if (canAccessStep(step)) {
        highestUnlocked = i;
      }
    }

    setCurrentStepIndex(highestUnlocked);
  }, [user, hasMentoriaAccess, hasFormacaoAccess]);

  const canAccessStep = (step: JourneyStep): boolean => {
    if (!user) return false;
    return canAccessFeature(user.portal, step.minPortal);
  };

  const canAccessItem = (item: JourneyStep['items'][0]): boolean => {
    if (!user) return false;
    if (!canAccessFeature(user.portal, item.minPortal)) return false;
    
    if (item.requiresMatricula === 'mentoria') return hasMentoriaAccess;
    if (item.requiresMatricula === 'formacao') return hasFormacaoAccess;
    
    return true;
  };

  const getStepStatus = (index: number): 'completed' | 'current' | 'locked' => {
    if (index < currentStepIndex) return 'completed';
    if (index === currentStepIndex) return 'current';
    return 'locked';
  };

  const getNextRecommendedStep = (): JourneyStep['items'][0] | null => {
    const currentStep = journeySteps[currentStepIndex];
    if (!currentStep) return null;

    // Find first accessible item in current step that user might not have explored
    for (const item of currentStep.items) {
      if (canAccessItem(item)) {
        return item;
      }
    }

    // If all current step items are done, suggest next step
    if (currentStepIndex < journeySteps.length - 1) {
      const nextStep = journeySteps[currentStepIndex + 1];
      if (canAccessStep(nextStep)) {
        for (const item of nextStep.items) {
          if (canAccessItem(item)) {
            return item;
          }
        }
      }
    }

    return null;
  };

  const nextRecommended = getNextRecommendedStep();

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20">
        <SectionHeader
          title="Minha Jornada"
          subtitle="Sua travessia pela Casa ORÁCULA"
        />

        {/* Current Position Banner */}
        <Card className="mb-8 border-gold/30 bg-gold/5">
          <CardContent className="py-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Você está na etapa</p>
                  <h3 className="text-xl font-display text-gold">
                    {journeySteps[currentStepIndex]?.title || 'Chegada'}
                  </h3>
                </div>
              </div>
              
              {nextRecommended && (
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-muted-foreground">Próximo passo recomendado</p>
                    <p className="text-sm font-medium">{nextRecommended.label}</p>
                  </div>
                  <Button 
                    onClick={() => navigate(nextRecommended.path)}
                    className="gap-2"
                  >
                    <span className="hidden sm:inline">Continuar</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Journey Timeline */}
        <div className="space-y-6">
          {journeySteps.map((step, index) => {
            const StepIcon = step.icon;
            const status = getStepStatus(index);
            const isAccessible = canAccessStep(step);

            return (
              <div key={step.id} className="relative">
                {/* Connector Line */}
                {index < journeySteps.length - 1 && (
                  <div 
                    className={cn(
                      "absolute left-6 top-20 w-0.5 h-full -z-10",
                      status === 'completed' ? 'bg-gold/50' : 'bg-border'
                    )}
                  />
                )}

                <Card 
                  className={cn(
                    "transition-all duration-300",
                    status === 'current' && 'border-gold/50 shadow-lg shadow-gold/10',
                    status === 'locked' && 'opacity-60',
                    status === 'completed' && 'border-gold/30'
                  )}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start gap-4">
                      {/* Step Number/Icon */}
                      <div 
                        className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
                          status === 'completed' && 'bg-gold/20 text-gold',
                          status === 'current' && 'bg-gold text-background',
                          status === 'locked' && 'bg-muted text-muted-foreground'
                        )}
                      >
                        {status === 'completed' ? (
                          <CheckCircle2 className="w-6 h-6" />
                        ) : status === 'locked' ? (
                          <Lock className="w-5 h-5" />
                        ) : (
                          <StepIcon className="w-6 h-6" />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <CardTitle className="text-lg">
                            {step.title}
                          </CardTitle>
                          {status === 'current' && (
                            <Badge variant="outline" className="border-gold text-gold text-xs">
                              Você está aqui
                            </Badge>
                          )}
                          {status === 'locked' && (
                            <Badge variant="secondary" className="text-xs">
                              Bloqueado
                            </Badge>
                          )}
                        </div>
                        <CardDescription>
                          {step.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 ml-16">
                      {step.items.map((item) => {
                        const ItemIcon = item.icon;
                        const itemAccessible = canAccessItem(item);

                        return (
                          <Button
                            key={item.path}
                            variant={itemAccessible ? "outline" : "ghost"}
                            className={cn(
                              "justify-start gap-3 h-auto py-3",
                              !itemAccessible && 'opacity-50 cursor-not-allowed',
                              itemAccessible && 'hover:border-gold/50 hover:bg-gold/5'
                            )}
                            onClick={() => itemAccessible && navigate(item.path)}
                            disabled={!itemAccessible}
                          >
                            {itemAccessible ? (
                              <ItemIcon className="w-4 h-4 text-gold" />
                            ) : (
                              <Lock className="w-4 h-4" />
                            )}
                            <span className="text-sm">{item.label}</span>
                          </Button>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Footer CTA */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Quer desbloquear mais etapas da sua jornada?
          </p>
          <Button 
            variant="outline" 
            onClick={() => navigate('/planos')}
            className="border-gold/50 hover:bg-gold/10"
          >
            Ver Planos Disponíveis
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
