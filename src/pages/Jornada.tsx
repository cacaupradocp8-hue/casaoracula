import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Compass, 
  ArrowRight,
  DoorOpen,
  Home as HomeIcon,
  ChevronRight,
  Sparkles,
  BookOpen,
  Users,
  GraduationCap,
  Lock,
  Crown,
  Layers
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { useOnboarding } from '@/hooks/useOnboarding';
import { PortalType, canAccessFeature } from '@/types/portal';
import { VisitorHomePage } from '@/components/visitor/VisitorHomePage';

// ════════════════════════════════════════════════════════════════════════════
// TIPOS E CONFIGURAÇÕES
// ════════════════════════════════════════════════════════════════════════════

type UserState = 'visitante' | 'aluna' | 'assinante' | 'oracula' | 'admin';

interface StateConfig {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
}

interface PrimaryAction {
  label: string;
  route: string;
  icon: React.ElementType;
}

interface FuturePath {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  requiredLevel: PortalType;
  route: string;
}

const STATE_CONFIGS: Record<UserState, StateConfig> = {
  visitante: {
    title: 'Visitante',
    description: 'Você está na porta de entrada da Casa. Antes de avançar, é preciso atravessar a Sala da Visitante.',
    icon: DoorOpen,
    color: 'text-gold',
    bgColor: 'bg-gold/10',
    borderColor: 'border-gold/30',
  },
  aluna: {
    title: 'Aluna',
    description: 'Você está em jornada formativa. O foco agora é travessia e aprendizado do método.',
    icon: GraduationCap,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
  },
  assinante: {
    title: 'Assinante',
    description: 'Você acessa as ferramentas vivas do Método ORÁCULA.',
    icon: Sparkles,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
  },
  oracula: {
    title: 'Orácula',
    description: 'Você completou a formação e integra o Círculo da Casa.',
    icon: Crown,
    color: 'text-gold',
    bgColor: 'bg-gold/10',
    borderColor: 'border-gold/30',
  },
  admin: {
    title: 'Administradora',
    description: 'Você tem acesso completo a todos os recursos da Casa.',
    icon: Layers,
    color: 'text-gold',
    bgColor: 'bg-gold/10',
    borderColor: 'border-gold/30',
  },
};

const PRIMARY_ACTIONS: Record<UserState, PrimaryAction> = {
  visitante: {
    label: 'Entrar na Sala da Visitante',
    route: '/sala-da-visitante',
    icon: DoorOpen,
  },
  aluna: {
    label: 'Acessar Sala das Alunas',
    route: '/salas',
    icon: GraduationCap,
  },
  assinante: {
    label: 'Acessar Ferramentas do Método',
    route: '/ferramentas',
    icon: Sparkles,
  },
  oracula: {
    label: 'Acessar Ferramentas do Método',
    route: '/ferramentas',
    icon: Crown,
  },
  admin: {
    label: 'Acessar Painel Administrativo',
    route: '/admin',
    icon: Layers,
  },
};

const FUTURE_PATHS: FuturePath[] = [
  {
    id: 'aluna',
    title: 'Sala das Alunas',
    description: 'Formação completa no Método ORÁCULA com acompanhamento.',
    icon: GraduationCap,
    requiredLevel: 'aluna',
    route: '/salas',
  },
  {
    id: 'oracula',
    title: 'Círculo da Orácula',
    description: 'Espaço exclusivo para profissionais formadas e certificadas.',
    icon: Crown,
    requiredLevel: 'oracula',
    route: '/casa/circulo',
  },
  {
    id: 'assinante',
    title: 'Ferramentas do Método',
    description: 'Acesso contínuo às ferramentas simbólicas vivas da Casa.',
    icon: Sparkles,
    requiredLevel: 'assinante',
    route: '/ferramentas',
  },
];

// ════════════════════════════════════════════════════════════════════════════
// COMPONENTES
// ════════════════════════════════════════════════════════════════════════════

function StateIndicator({ state }: { state: UserState }) {
  const config = STATE_CONFIGS[state];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-xl border p-6",
        config.bgColor,
        config.borderColor
      )}
    >
      <div className="flex items-start gap-4">
        <div className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
          config.bgColor
        )}>
          <Icon className={cn("w-6 h-6", config.color)} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Seu ponto atual na Casa
            </span>
          </div>
          <h2 className={cn("text-xl font-display mb-2", config.color)}>
            {config.title}
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {config.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function PrimaryActionCard({ state }: { state: UserState }) {
  const navigate = useNavigate();
  const action = PRIMARY_ACTIONS[state];
  const Icon = action.icon;
  const config = STATE_CONFIGS[state];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card 
        className={cn(
          "relative overflow-hidden cursor-pointer transition-all duration-300",
          "bg-gradient-to-br from-gold/5 via-card to-card",
          "border-2 border-gold/40 hover:border-gold/60",
          "hover:shadow-lg hover:shadow-gold/10"
        )}
        onClick={() => navigate(action.route)}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />
        
        <CardContent className="p-8">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center">
              <Icon className="w-8 h-8 text-gold" />
            </div>
            
            <div>
              <span className="text-xs font-medium text-gold uppercase tracking-wider mb-2 block">
                Sua porta ativa
              </span>
              <h3 className="text-xl font-display text-foreground mb-4">
                {action.label}
              </h3>
            </div>
            
            <Button 
              size="lg"
              className="bg-gold hover:bg-gold/90 text-background rounded-full px-8 gap-2"
            >
              Atravessar
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function FuturePathCard({ path, hasAccess }: { path: FuturePath; hasAccess: boolean }) {
  const navigate = useNavigate();
  const Icon = path.icon;

  if (hasAccess) {
    // If user has access, don't show as future path (it's already accessible)
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card 
        className={cn(
          "relative overflow-hidden transition-all duration-300",
          "bg-card/30 border-border/30",
          "opacity-60"
        )}
      >
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-muted/30 flex items-center justify-center shrink-0">
              <Icon className="w-5 h-5 text-muted-foreground" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-muted-foreground">
                  {path.title}
                </h4>
                <Lock className="w-3 h-3 text-muted-foreground/50" />
              </div>
              <p className="text-xs text-muted-foreground/70 leading-relaxed">
                {path.description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ResourcesQuickAccess({ userState }: { userState: UserState }) {
  const navigate = useNavigate();
  
  // Only show for users with some level of access
  if (userState === 'visitante') return null;

  const resources = [
    { label: 'Biblioteca', route: '/biblioteca', icon: BookOpen },
    { label: 'Oráculos', route: '/oraculos', icon: Sparkles },
    { label: 'Áudios', route: '/audios', icon: Compass },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="mt-8"
    >
      <h3 className="text-sm font-medium text-muted-foreground mb-3 text-center">
        Recursos disponíveis
      </h3>
      <div className="flex flex-wrap justify-center gap-2">
        {resources.map((resource) => {
          const Icon = resource.icon;
          return (
            <Button
              key={resource.route}
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground gap-2"
              onClick={() => navigate(resource.route)}
            >
              <Icon className="w-4 h-4" />
              {resource.label}
            </Button>
          );
        })}
      </div>
    </motion.div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ════════════════════════════════════════════════════════════════════════════

export default function Jornada() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { onboardingCompleted } = useOnboarding();
  const [loading, setLoading] = useState(true);
  const [userState, setUserState] = useState<UserState>('visitante');
  const [hasMatriculas, setHasMatriculas] = useState({
    mentoria: false,
    formacao: false,
  });
  const [hasSubscription, setHasSubscription] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;
      
      setLoading(true);
      
      try {
        // Fetch active matriculas
        const { data: matriculasData } = await supabase
          .from('matriculas')
          .select('curso_id')
          .eq('user_id', user.id)
          .eq('ativa', true);

        const hasMentoria = matriculasData?.some(m => m.curso_id.includes('mentoria')) || false;
        const hasFormacao = matriculasData?.some(m => m.curso_id.includes('formacao')) || false;
        
        setHasMatriculas({ mentoria: hasMentoria, formacao: hasFormacao });

        // Fetch subscription status
        const { data: profile } = await supabase
          .from('profiles')
          .select('subscription_status')
          .eq('id', user.id)
          .maybeSingle();

        const isSubscribed = profile?.subscription_status === 'active' || profile?.subscription_status === 'trialing';
        setHasSubscription(isSubscribed);

        // Determine user state based on portal and access
        let state: UserState = 'visitante';
        
        if (user.portal === 'admin') {
          state = 'admin';
        } else if (user.portal === 'oracula') {
          state = 'oracula';
        } else if (hasFormacao || hasMentoria || user.portal === 'aluna') {
          state = 'aluna';
        } else if (isSubscribed || user.portal === 'assinante') {
          state = 'assinante';
        } else if (!onboardingCompleted) {
          state = 'visitante';
        } else {
          // Completed onboarding but no matricula/subscription
          state = 'visitante';
        }
        
        setUserState(state);
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user, onboardingCompleted]);

  // Filter future paths that user doesn't have access to
  const futurePaths = FUTURE_PATHS.filter(path => {
    const hasAccess = canAccessFeature(user?.portal || 'visitante', path.requiredLevel);
    return !hasAccess; // Only show paths user CAN'T access yet
  });

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="animate-pulse text-gold font-display text-xl">
            Carregando seu caminho...
          </div>
        </div>
      </AppLayout>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // VISITANTE: Tela específica sem menu, apenas porta gratuita
  // ═══════════════════════════════════════════════════════════════════════════
  if (userState === 'visitante') {
    return <VisitorHomePage />;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // USUÁRIAS COM ACESSO: Interface completa com AppLayout
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/dashboard" className="hover:text-foreground transition-colors flex items-center gap-1">
            <HomeIcon className="w-3 h-3" />
            Casa
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">Meu Caminho</span>
        </div>

        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-display text-foreground mb-2">
            Meu Caminho
          </h1>
          <p className="text-muted-foreground text-sm">
            Sua orientação pessoal na Casa ORÁCULA
          </p>
        </motion.div>

        <div className="space-y-6">
          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* BLOCO 1: ESTADO ATUAL */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          <StateIndicator state={userState} />

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* BLOCO 2: PORTA ATIVA (AÇÃO PRINCIPAL) */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          <PrimaryActionCard state={userState} />

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* BLOCO 3: CAMINHOS FUTUROS (ESMAECIDOS) */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          {futurePaths.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="pt-6"
            >
              <div className="text-center mb-4">
                <span className="text-xs font-medium text-muted-foreground/70 uppercase tracking-wider">
                  Caminhos que se abrem adiante
                </span>
              </div>
              
              <div className="space-y-3">
                {futurePaths.map((path, index) => (
                  <motion.div
                    key={path.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <FuturePathCard 
                      path={path} 
                      hasAccess={canAccessFeature(user?.portal || 'visitante', path.requiredLevel)}
                    />
                  </motion.div>
                ))}
              </div>

              {/* CTA to explore plans */}
              <div className="text-center mt-6">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-gold gap-2"
                  onClick={() => navigate('/planos')}
                >
                  Conhecer os caminhos formativos
                  <ArrowRight className="w-3 h-3" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* BLOCO 4: RECURSOS RÁPIDOS */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          <ResourcesQuickAccess userState={userState} />
        </div>
      </div>
    </AppLayout>
  );
}
