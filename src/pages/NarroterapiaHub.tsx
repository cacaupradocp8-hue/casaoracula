import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { canAccessFeature } from '@/types/portal';
import { useAccessExpiration } from '@/hooks/useAccessExpiration';
import { BookOpen, BookOpenCheck, Headphones, Home, ChevronRight, Lock } from 'lucide-react';
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
    title: 'Biblioteca de Contos',
    description: 'Contos clássicos e simbólicos para estudo. Acesso aberto a todas as usuárias.',
    icon: <BookOpen className="w-6 h-6" />,
    path: '/narroterapia/biblioteca-contos',
    requiresCertification: false,
    badge: 'Estudo',
  },
  {
    id: 'biblioteca-clinica',
    title: 'Biblioteca de Narroterapia Oracular™',
    description: '12 contos clínicos oficiais com orientações de uso terapêutico.',
    icon: <BookOpenCheck className="w-6 h-6" />,
    path: '/narroterapia/clinica',
    requiresCertification: true,
    badge: 'Clínica',
  },
  {
    id: 'audios-narracao',
    title: 'Áudios – Narração Padrão Oracular™',
    description: 'Áudios de treino para facilitadoras certificadas.',
    icon: <Headphones className="w-6 h-6" />,
    path: '/narroterapia/audios',
    requiresCertification: true,
    badge: 'Treino',
  },
];

export default function NarroterapiaHub() {
  const { user } = useAuth();
  const { isExpired } = useAccessExpiration();
  
  // Check if user is certified (aluna_formacao+)
  const isCertified = user && canAccessFeature(user.portal, 'aluna_formacao') && !isExpired;
  const isAdmin = user?.portal === 'admin';

  const canAccessArea = (area: AreaCard) => {
    if (!area.requiresCertification) return true;
    return isCertified || isAdmin;
  };

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
          subtitle="Espaço de contos, narrativas clínicas e treino de narração"
          icon={<BookOpen className="w-5 h-5" />}
          className="mb-8"
        />

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
                        Disponível para usuárias com certificação ativa (Formação Orácula).
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
