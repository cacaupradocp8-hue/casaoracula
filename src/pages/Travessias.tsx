import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProfessionalStatus } from '@/hooks/useProfessionalStatus';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TRAVESSIAS_DATA } from '@/types/travessia';
import { canAccessFeature } from '@/types/portal';
import { 
  Compass, 
  Moon, 
  BookOpen, 
  Shield, 
  Lock, 
  ArrowRight,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCopy } from '@/hooks/useCopy';

const ICON_MAP: Record<string, typeof Compass> = {
  Compass,
  Moon,
  BookOpen,
  Shield,
};

const COLOR_MAP: Record<string, string> = {
  amber: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
  purple: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
  gold: 'text-gold bg-gold/10 border-gold/20',
  emerald: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
};

export default function Travessias() {
  const { user } = useAuth();
  const { isProfessional, isLoading: isLoadingProfessional } = useProfessionalStatus();
  const navigate = useNavigate();
  const { getCopyByKey } = useCopy();

  if (!user) return null;

  const canAccessTravessia = (travessia: typeof TRAVESSIAS_DATA[0]) => {
    const hasPortalAccess = canAccessFeature(user.portal, travessia.minPortal);
    const hasProfessionalAccess = !travessia.requiresProfessional || isProfessional;
    return hasPortalAccess && hasProfessionalAccess;
  };

  const handleTravessiaClick = (travessia: typeof TRAVESSIAS_DATA[0]) => {
    if (!canAccessTravessia(travessia)) {
      return;
    }
    navigate(`/travessia/${travessia.slug}`);
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20">
        <SectionHeader
          title="As 4 Travessias"
          subtitle="O caminho iniciático da Casa ORÁCULA"
          className="mb-8"
        />

        {/* Professional Notice */}
        {!isLoadingProfessional && !isProfessional && (
          <Card className="mb-8 bg-amber-500/5 border-amber-500/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Confirmação profissional pendente</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    A Travessia 3 (Código das Narrativas) e 4 (Guardiã do Caminho) requerem confirmação profissional.
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

        <div className="grid md:grid-cols-2 gap-6">
          {TRAVESSIAS_DATA.map((travessia) => {
            const Icon = ICON_MAP[travessia.icone] || Compass;
            const colorClass = COLOR_MAP[travessia.corAcento] || COLOR_MAP.gold;
            const isAccessible = canAccessTravessia(travessia);
            const needsProfessional = travessia.requiresProfessional && !isProfessional;

            return (
              <Card
                key={travessia.id}
                className={cn(
                  'group transition-all duration-300 overflow-hidden',
                  isAccessible && 'hover:shadow-lg cursor-pointer hover:border-gold/40',
                  !isAccessible && 'opacity-70'
                )}
                onClick={() => handleTravessiaClick(travessia)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center border', colorClass)}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        Travessia {travessia.number}
                      </Badge>
                      {!isAccessible && <Lock className="w-4 h-4 text-muted-foreground" />}
                    </div>
                  </div>
                  <CardTitle className="font-display text-xl mt-3">{travessia.title}</CardTitle>
                  <CardDescription className="text-sm">{travessia.subtitle}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{travessia.description}</p>
                  
                  <div className="flex flex-wrap gap-1.5">
                    {travessia.temas.map((tema) => (
                      <span
                        key={tema}
                        className="text-xs px-2 py-0.5 bg-secondary/50 rounded-full text-muted-foreground"
                      >
                        {tema}
                      </span>
                    ))}
                  </div>

                  {needsProfessional && (
                    <div className="flex items-center gap-2 text-xs text-amber-500">
                      <Sparkles className="w-3 h-3" />
                      <span>Requer confirmação profissional</span>
                    </div>
                  )}

                  {isAccessible && (
                    <div className="flex justify-end pt-2">
                      <Button variant="ghost" size="sm" className="gap-2 group-hover:text-gold">
                        {getCopyByKey('btn_atravessar', 'Atravessar')}
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
