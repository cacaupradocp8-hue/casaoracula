import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useProfessionalStatus } from '@/hooks/useProfessionalStatus';
import { AppLayout } from '@/components/layout/AppLayout';
import { MobilePageShell } from '@/components/shared/MobilePageShell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { canAccessFeature, PortalType } from '@/types/portal';
import { supabase } from '@/integrations/supabase/client';
import { 
  Compass, 
  Moon, 
  BookOpen, 
  Shield, 
  Lock, 
  ArrowRight,
  Sparkles,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCopy } from '@/hooks/useCopy';

const ICON_MAP: Record<string, typeof Compass> = {
  Compass,
  Moon,
  BookOpen,
  Shield,
  Sparkles,
};

const COLOR_MAP: Record<string, string> = {
  amber: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
  purple: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
  gold: 'text-gold bg-gold/10 border-gold/20',
  emerald: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
  rose: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
  blue: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
};

interface Travessia {
  id: string;
  number: number;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  icone: string;
  cor_acento: string;
  temas: string[];
  portal_minimo: PortalType;
  requer_profissional: boolean;
  ativa: boolean;
  ordem: number;
}

export default function Travessias() {
  const { user } = useAuth();
  const { isProfessional, isLoading: isLoadingProfessional } = useProfessionalStatus();
  const navigate = useNavigate();
  const { getCopyByKey } = useCopy();

  const { data: travessias, isLoading } = useQuery({
    queryKey: ['travessias-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('travessias')
        .select('*')
        .order('ordem', { ascending: true });

      if (error) throw error;
      return data as Travessia[];
    },
  });

  if (!user) return null;

  const isAdmin = user.portal === 'admin';

  const canAccessTravessia = (travessia: Travessia) => {
    if (isAdmin) return true;
    
    const hasPortalAccess = canAccessFeature(user.portal, travessia.portal_minimo);
    const hasProfessionalAccess = !travessia.requer_profissional || isProfessional;
    return hasPortalAccess && hasProfessionalAccess;
  };

  const handleTravessiaClick = (travessia: Travessia) => {
    if (!canAccessTravessia(travessia)) {
      return;
    }
    navigate(`/travessia/${travessia.slug}`);
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gold" />
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <MobilePageShell
        badge="Formação"
        title="As Travessias"
        subtitle="O caminho iniciático da Casa ORÁCULA"
        collapsibles={[
          {
            title: "O que são as Travessias?",
            children: "Travessias são jornadas de formação simbólica organizadas em sequência. Cada uma aprofunda um território da psique — do limiar ao interior, do inconsciente ao posicionamento clínico.",
          },
          {
            title: "Como usar",
            children: "Acesse cada Travessia em ordem. Algumas exigem confirmação profissional. Faça as aulas no seu ritmo e marque como concluída ao terminar.",
          },
        ]}
      >
        <div className="pb-20">

          {/* Professional Notice */}
          {!isLoadingProfessional && !isProfessional && !isAdmin && (
            <Card className="mb-6 border-amber-500/20 bg-amber-500/5">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Confirmação profissional pendente</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Algumas travessias requerem confirmação profissional para acesso completo.
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
            {travessias?.map((travessia) => {
              const Icon = ICON_MAP[travessia.icone] || Compass;
              const colorClass = COLOR_MAP[travessia.cor_acento] || COLOR_MAP.gold;
              const isAccessible = canAccessTravessia(travessia);
              const needsProfessional = travessia.requer_profissional && !isProfessional && !isAdmin;

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
                    {travessia.subtitle && (
                      <CardDescription className="text-sm">{travessia.subtitle}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {travessia.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{travessia.description}</p>
                    )}
                    
                    {travessia.temas && travessia.temas.length > 0 && (
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
                    )}

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

          {(!travessias || travessias.length === 0) && (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center">
                <Compass className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-muted-foreground">Nenhuma travessia disponível</p>
              </CardContent>
            </Card>
          )}
        </div>
      </MobilePageShell>
    </AppLayout>
  );
}
