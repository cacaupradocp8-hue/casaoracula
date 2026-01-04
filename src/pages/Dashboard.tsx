import { useAuth } from '@/contexts/AuthContext';
import { useProfessionalStatus } from '@/hooks/useProfessionalStatus';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PortalBadge } from '@/components/shared/PortalBadge';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { getPortal, canAccessFeature } from '@/types/portal';
import { TRAVESSIAS_DATA } from '@/types/travessia';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  Moon,
  BookOpen,
  Shield,
  ArrowRight,
  Lock,
  Check,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const ICON_MAP: Record<string, typeof Compass> = {
  Compass,
  Moon,
  BookOpen,
  Shield,
};

const COLOR_MAP: Record<string, string> = {
  amber: 'text-amber-500 bg-amber-500/10',
  purple: 'text-purple-500 bg-purple-500/10',
  gold: 'text-gold bg-gold/10',
  emerald: 'text-emerald-500 bg-emerald-500/10',
};

export default function Dashboard() {
  const { user } = useAuth();
  const { isProfessional, isLoading: isLoadingProfessional } = useProfessionalStatus();
  const navigate = useNavigate();
  
  if (!user) return null;

  const portal = getPortal(user.portal);

  const canAccessTravessia = (travessia: typeof TRAVESSIAS_DATA[0]) => {
    const hasPortalAccess = canAccessFeature(user.portal, travessia.minPortal);
    const hasProfessionalAccess = !travessia.requiresProfessional || isProfessional;
    return hasPortalAccess && hasProfessionalAccess;
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20">
        {/* Welcome Section */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-light text-foreground mb-2">
                Bem-vinda, <span className="text-gold-gradient font-semibold">{user.name}</span>
              </h1>
              <p className="text-muted-foreground">
                A Casa ORÁCULA te recebe para mais uma jornada iniciática.
              </p>
            </div>
            <PortalBadge portal={user.portal} size="lg" showName />
          </div>

          {/* Portal Info Card */}
          <Card className="bg-mystical border-gold/20">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="flex-1">
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    {portal.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {portal.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {portal.features.slice(0, 4).map((feature, idx) => (
                      <span 
                        key={idx}
                        className="inline-flex items-center gap-1 text-xs bg-secondary/50 px-2 py-1 rounded-full"
                      >
                        <Check className="w-3 h-3 text-gold" />
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Professional Notice */}
        {!isLoadingProfessional && !isProfessional && user.portal !== 'visitante' && (
          <Card className="mb-8 bg-amber-500/5 border-amber-500/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Confirmação profissional pendente</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    A Sala de Sessão, Mapas e ferramentas avançadas requerem confirmação profissional.
                  </p>
                  <Button 
                    variant="link" 
                    className="px-0 h-auto text-gold"
                    onClick={() => navigate('/confirmar-profissional')}
                  >
                    Fazer confirmação profissional →
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tríade Quote */}
        <div className="mb-12 text-center">
          <blockquote className="font-display text-xl md:text-2xl italic text-foreground/80 max-w-2xl mx-auto">
            "Ego escolhe • Neuroplasticidade sustenta • Alma dá sentido"
          </blockquote>
          <p className="text-sm text-muted-foreground mt-2">— Tríade Metodológica ORÁCULA</p>
        </div>

        {/* 4 Travessias */}
        <SectionHeader 
          title="As 4 Travessias" 
          subtitle="O caminho iniciático para profissionais"
          className="mb-6"
        />
        
        <div className="grid sm:grid-cols-2 gap-4 mb-12">
          {TRAVESSIAS_DATA.map((travessia) => {
            const Icon = ICON_MAP[travessia.icone] || Compass;
            const colorClass = COLOR_MAP[travessia.corAcento] || COLOR_MAP.gold;
            const isAccessible = canAccessTravessia(travessia);
            
            return (
              <Card 
                key={travessia.id}
                className={cn(
                  'group transition-all duration-300',
                  isAccessible && 'hover:shadow-gold cursor-pointer',
                  !isAccessible && 'opacity-60'
                )}
              >
                {isAccessible ? (
                  <Link to={`/travessia/${travessia.slug}`} className="block h-full">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', colorClass)}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-xs text-muted-foreground">Travessia {travessia.number}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardTitle className="text-lg mb-1 group-hover:text-gold transition-colors">
                        {travessia.title}
                      </CardTitle>
                      <CardDescription className="text-sm">{travessia.subtitle}</CardDescription>
                      <div className="flex items-center justify-end mt-3">
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-gold transition-all group-hover:translate-x-1" />
                      </div>
                    </CardContent>
                  </Link>
                ) : (
                  <div className="h-full">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                          <Icon className="w-5 h-5" />
                        </div>
                        <Lock className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardTitle className="text-lg mb-1 text-muted-foreground">{travessia.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {travessia.requiresProfessional && !isProfessional 
                          ? 'Requer confirmação profissional' 
                          : `Disponível a partir do Portal ${travessia.minPortal}`
                        }
                      </CardDescription>
                    </CardContent>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Visitor Message */}
        {user.portal === 'visitante' && (
          <Card className="bg-secondary/30 border-border/50">
            <CardContent className="p-8 text-center">
              <Sparkles className="w-12 h-12 mx-auto mb-4 text-gold" />
              <h3 className="font-display text-2xl font-semibold text-foreground mb-3">
                Você está no Portal da Buscadora
              </h3>
              <p className="text-muted-foreground max-w-lg mx-auto mb-6">
                As ferramentas profissionais são liberadas após a confirmação da sua atuação. 
                Por enquanto, explore a Travessia 1 — O Mundo sem Símbolos.
              </p>
              <Button onClick={() => navigate('/confirmar-profissional')}>
                Fazer confirmação profissional
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
