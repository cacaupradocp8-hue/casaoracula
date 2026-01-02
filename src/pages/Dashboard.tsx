import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PortalBadge } from '@/components/shared/PortalBadge';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { getPortal, canAccessFeature, PortalType } from '@/types/portal';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Compass,
  Library,
  FolderOpen,
  Sparkles,
  ArrowRight,
  Lock,
  Check,
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  
  if (!user) return null;

  const portal = getPortal(user.portal);

  const quickActions: { title: string; description: string; icon: typeof BookOpen; path: string; minPortal: PortalType }[] = [
    {
      title: 'Portais',
      description: 'Formação simbólica em 4 jornadas',
      icon: BookOpen,
      path: '/travessias',
      minPortal: 'pre_iniciada',
    },
    {
      title: 'Leitura em 5 Camadas',
      description: 'Ferramenta central do método',
      icon: Compass,
      path: '/metodo',
      minPortal: 'pre_iniciada',
    },
    {
      title: 'Biblioteca Simbólica',
      description: 'Contos, arquétipos e rituais',
      icon: Library,
      path: '/biblioteca',
      minPortal: 'pre_iniciada',
    },
    {
      title: 'Meus Casos',
      description: 'Gestão de casos clínicos',
      icon: FolderOpen,
      path: '/casos',
      minPortal: 'pre_iniciada',
    },
    {
      title: 'Leitura Oracular',
      description: 'Portal de supervisão profunda',
      icon: Sparkles,
      path: '/leitura-oracular',
      minPortal: 'iniciada',
    },
  ];

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
                A Casa ORÁCULA te recebe para mais uma jornada.
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
                    {portal.features.map((feature, idx) => (
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
                {portal.caseLimit !== 'unlimited' && (
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Limite de Casos</p>
                    <p className="text-2xl font-display font-bold text-gold">
                      {portal.caseLimit}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tríade Quote */}
        <div className="mb-12 text-center">
          <blockquote className="font-display text-xl md:text-2xl italic text-foreground/80 max-w-2xl mx-auto">
            "Ego escolhe • Neuroplasticidade sustenta • Alma dá sentido"
          </blockquote>
          <p className="text-sm text-muted-foreground mt-2">— Tríade Metodológica ORÁCULA</p>
        </div>

        {/* Quick Actions */}
        <SectionHeader 
          title="Ferramentas da Casa" 
          subtitle="Acesse as áreas disponíveis no seu Portal"
          className="mb-6"
        />
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            const hasAccess = canAccessFeature(user.portal, action.minPortal);
            
            return (
              <Card 
                key={action.path}
                className={`group transition-all duration-300 ${
                  hasAccess 
                    ? 'hover:shadow-gold cursor-pointer' 
                    : 'opacity-60'
                }`}
              >
                {hasAccess ? (
                  <Link to={action.path} className="block h-full">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center text-gold group-hover:bg-gold/20 transition-colors">
                          <Icon className="w-5 h-5" />
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-gold transition-colors" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardTitle className="text-lg mb-1">{action.title}</CardTitle>
                      <CardDescription>{action.description}</CardDescription>
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
                      <CardTitle className="text-lg mb-1 text-muted-foreground">{action.title}</CardTitle>
                      <CardDescription>
                        Disponível a partir do Portal {action.minPortal}
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
          <Card className="mt-12 bg-secondary/30 border-border/50">
            <CardContent className="p-8 text-center">
              <Sparkles className="w-12 h-12 mx-auto mb-4 text-gold" />
              <h3 className="font-display text-2xl font-semibold text-foreground mb-3">
                Você está no Portal da Buscadora
              </h3>
              <p className="text-muted-foreground max-w-lg mx-auto mb-6">
                As ferramentas profissionais são liberadas após a Pré-Iniciação. 
                Por enquanto, explore os conteúdos simbólicos e as perguntas-oráculo 
                que preparamos para você.
              </p>
              <p className="text-xs text-muted-foreground">
                O acesso aos próximos Portais é liberado manualmente pela Guardiã.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
