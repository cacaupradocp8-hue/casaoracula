import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { canAccessFeature } from '@/types/portal';
import { useAccessExpiration } from '@/hooks/useAccessExpiration';
import { useNarroterapiaAutorizacao } from '@/hooks/useNarroterapiaAutorizacao';
import { RitualGatekeeper } from '@/components/narroterapia';
import { BookOpen, BookOpenCheck, Headphones, Home, ChevronRight, Lock, Info, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AreaCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  requiresCertification: boolean;
  badge?: string;
}

const AREAS: AreaCard[] = [
  {
    id: 'biblioteca-contos',
    title: 'Acervo Simbólico de Referência',
    description: 'Contos clássicos para estudo simbólico. Não clínico.',
    icon: <BookOpen className="w-6 h-6" />,
    path: '/narroterapia/biblioteca-contos',
    requiresCertification: false,
    badge: 'Estudo',
  },
  {
    id: 'biblioteca-clinica',
    title: 'Câmara de Narração Oracular™',
    description: '12 contos oficiais organizados por Porta Psíquica. Uso clínico autorizado.',
    icon: <BookOpenCheck className="w-6 h-6" />,
    path: '/narroterapia/clinica',
    requiresCertification: true,
    badge: 'Clínica',
  },
  {
    id: 'audios-narracao',
    title: 'Ofício da Voz Oracular™',
    description: 'Treino da Narração Padrão Oracular™. Voz neutra, sem indução.',
    icon: <Headphones className="w-6 h-6" />,
    path: '/narroterapia/audios',
    requiresCertification: true,
    badge: 'Treino',
  },
];

export default function NarroterapiaHub() {
  const { user } = useAuth();
  const { isExpired } = useAccessExpiration();
  const { temAcessoCompleto, isLoading, seloAtivo, isAdmin } = useNarroterapiaAutorizacao();
  
  // Check if user is certified (aluna_formacao+)
  const isCertified = user && canAccessFeature(user.portal, 'aluna_formacao') && !isExpired;

  const canAccessArea = (area: AreaCard) => {
    if (!area.requiresCertification) return true;
    return isCertified || isAdmin;
  };

  // Se não tem acesso completo (não passou pelo ritual), mostra o gatekeeper
  if (!isLoading && !temAcessoCompleto) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8 pb-20 max-w-4xl">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link to="/jornada" className="hover:text-foreground transition-colors flex items-center gap-1">
              <Home className="w-3 h-3" />
              Casa
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground">Narroterapia Oracular™</span>
          </nav>

          <SectionHeader
            title="Narroterapia Oracular™"
            subtitle="Infraestrutura ética e clínica do método."
            icon={<BookOpen className="w-5 h-5" />}
            className="mb-6"
          />

          <RitualGatekeeper />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/jornada" className="hover:text-foreground transition-colors flex items-center gap-1">
            <Home className="w-3 h-3" />
            Casa
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">Narroterapia Oracular™</span>
        </nav>

        <SectionHeader
          title="Narroterapia Oracular™"
          subtitle="Infraestrutura ética e clínica do método. Não é biblioteca de consumo."
          icon={<BookOpen className="w-5 h-5" />}
          className="mb-6"
        />

        {/* Selo de Autorização */}
        {seloAtivo && (
          <div className="mb-6 flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/30 rounded-lg">
              <Sparkles className="w-4 h-4 text-gold" />
              <span className="text-xs uppercase tracking-widest text-gold">
                Facilitadora Autorizada
              </span>
            </div>
          </div>
        )}

        {/* Institutional Notice */}
        <Alert className="mb-8 border-border/50 bg-muted/30">
          <Info className="w-4 h-4 text-muted-foreground" />
          <AlertDescription className="text-muted-foreground text-sm">
            Este espaço é parte de uma formação profissional e funciona como infraestrutura ética do método.
          </AlertDescription>
        </Alert>

        {/* Areas Grid */}
        <div className="grid gap-6">
          {AREAS.map((area) => {
            const hasAccess = canAccessArea(area);
            
            return (
              <Link
                key={area.id}
                to={hasAccess ? area.path : '#'}
                className={cn(
                  'block transition-all',
                  !hasAccess && 'cursor-not-allowed'
                )}
                onClick={(e) => !hasAccess && e.preventDefault()}
              >
                <Card className={cn(
                  'group transition-all hover:shadow-md',
                  hasAccess ? 'hover:border-gold/50' : 'opacity-60'
                )}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          'p-3 rounded-xl',
                          hasAccess 
                            ? 'bg-gold/10 text-gold' 
                            : 'bg-muted text-muted-foreground'
                        )}>
                          {hasAccess ? area.icon : <Lock className="w-6 h-6" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <CardTitle className="text-lg font-display">
                              {area.title}
                            </CardTitle>
                            {area.badge && (
                              <Badge 
                                variant={hasAccess ? 'secondary' : 'outline'}
                                className="text-xs"
                              >
                                {area.badge}
                              </Badge>
                            )}
                          </div>
                          <CardDescription className="text-sm">
                            {area.description}
                          </CardDescription>
                        </div>
                      </div>
                      
                      {!hasAccess && (
                        <Badge variant="outline" className="shrink-0 text-xs border-amber-500/50 text-amber-200">
                          Certificadas
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  
                  {!hasAccess && (
                    <CardContent className="pt-0">
                      <p className="text-xs text-muted-foreground">
                        A Narroterapia Oracular™ exige certificação ativa.
                      </p>
                    </CardContent>
                  )}
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
