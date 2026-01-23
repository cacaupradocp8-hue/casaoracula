import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { canAccessFeature } from '@/types/portal';
import { 
  Compass, 
  MapPin, 
  Building2, 
  Castle, 
  ArrowRight, 
  ArrowLeft,
  Lock,
  ChevronRight,
  Home,
  BookOpen,
  Shield,
  Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FerramentaCard {
  id: string;
  titulo: string;
  subtitulo: string;
  descricao: string;
  icon: typeof MapPin;
  cor: string;
  bgCor: string;
  rota: string;
  minPortal: 'visitante' | 'mentorada' | 'aluna_formacao' | 'assinante' | 'oracula' | 'admin';
  destaques: string[];
}

const FERRAMENTAS: FerramentaCard[] = [
  {
    id: 'labirinto',
    titulo: 'Labirinto das 39 Portas',
    subtitulo: 'Protocolo de leitura simbólica',
    descricao: 'Navegue pelas 39 Portas que mapeiam os momentos psíquicos fundamentais. Cada porta é um espelho do movimento interior.',
    icon: MapPin,
    cor: 'text-amber-400',
    bgCor: 'bg-amber-500/20',
    rota: '/labirinto',
    minPortal: 'aluna_formacao',
    destaques: [
      'Leitura em 5 camadas',
      'Protocolo estruturado',
      'Áudio-guias por porta',
    ],
  },
  {
    id: 'torre-viva',
    titulo: 'Torre Viva™',
    subtitulo: 'Estruturas de sobrevivência',
    descricao: 'Identifique as 7 Torres de defesa que organizam a psique. Ferramenta de reconhecimento guiado para uso em sessão.',
    icon: Castle,
    cor: 'text-rose-400',
    bgCor: 'bg-rose-500/20',
    rota: '/ferramentas/torre-viva',
    minPortal: 'oracula',
    destaques: [
      '7 estruturas de defesa',
      'Guia de condução ética',
      'Integração com casos',
    ],
  },
  {
    id: 'cartografia',
    titulo: 'Cartografia das Torres',
    subtitulo: 'Mapeamento das famílias',
    descricao: 'Explore as 5 Famílias de Torres e suas dinâmicas. Mapa visual das estruturas de sobrevivência e seus padrões.',
    icon: Building2,
    cor: 'text-indigo-400',
    bgCor: 'bg-indigo-500/20',
    rota: '/ferramentas/cartografia-torre',
    minPortal: 'aluna_formacao',
    destaques: [
      '5 famílias mapeadas',
      'Padrões relacionais',
      'Visualização integrada',
    ],
  },
];

export default function FerramentasMetodoHub() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const canAccessFerramenta = (minPortal: FerramentaCard['minPortal']) => {
    if (!user) return false;
    return canAccessFeature(user.portal, minPortal);
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20 max-w-5xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/jornada')}
          className="gap-2 text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar à Casa
        </Button>

        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/jornada" className="hover:text-foreground transition-colors flex items-center gap-1">
            <Home className="w-3 h-3" />
            Casa
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">Ferramentas do Método</span>
        </nav>

        <SectionHeader
          title="Ferramentas do Método Orácula"
          subtitle="Instrumentos práticos para leitura simbólica e condução clínica"
          icon={<Compass className="w-5 h-5" />}
          className="mb-8"
        />

        {/* Intro Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="border-gold/30 bg-gradient-to-br from-gold/5 to-transparent">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center shrink-0">
                  <Layers className="w-6 h-6 text-gold" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-display text-lg text-foreground">A Tríade do Método</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    O Método Orácula opera em três dimensões: as <strong>Portas</strong> mostram <em>onde</em> a psique está, 
                    os <strong>Campos Psíquicos</strong> indicam <em>como</em> sustentar, e as <strong>Torres</strong> revelam 
                    <em> por que</em> ela se organizou assim. Estas ferramentas são os instrumentos práticos dessa tríade.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Ferramentas Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {FERRAMENTAS.map((ferramenta, index) => {
            const Icon = ferramenta.icon;
            const hasAccess = canAccessFerramenta(ferramenta.minPortal);
            
            return (
              <motion.div
                key={ferramenta.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className={cn(
                    "h-full cursor-pointer group transition-all duration-300 overflow-hidden",
                    hasAccess 
                      ? "hover:border-gold/50 hover:shadow-lg" 
                      : "opacity-75"
                  )}
                  onClick={() => hasAccess ? navigate(ferramenta.rota) : null}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center",
                        ferramenta.bgCor
                      )}>
                        <Icon className={cn("w-7 h-7", ferramenta.cor)} />
                      </div>
                      {!hasAccess && (
                        <Badge variant="secondary" className="gap-1">
                          <Lock className="w-3 h-3" />
                          {ferramenta.minPortal === 'oracula' ? 'Orácula' : 'Em Formação'}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className={cn(
                      "text-xl font-display transition-colors",
                      hasAccess && `group-hover:${ferramenta.cor.replace('text-', '')}`
                    )}>
                      {ferramenta.titulo}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {ferramenta.subtitulo}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {ferramenta.descricao}
                    </p>
                    
                    <div className="space-y-2 pt-2">
                      {ferramenta.destaques.map((destaque, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className={cn("w-1.5 h-1.5 rounded-full", ferramenta.bgCor.replace('/20', ''))} />
                          <span>{destaque}</span>
                        </div>
                      ))}
                    </div>

                    {hasAccess && (
                      <div className="flex items-center justify-end pt-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className={cn("gap-1", ferramenta.cor, `hover:${ferramenta.cor}`)}
                        >
                          Acessar
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Conteúdo Formativo */}
        <Separator className="my-10" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-lg font-display text-foreground mb-6 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-muted-foreground" />
            Base Conceitual
          </h2>

          <div className="grid gap-4 md:grid-cols-3">
            <Card 
              className="cursor-pointer hover:border-amber-500/50 hover:shadow-md transition-all group"
              onClick={() => navigate('/metodo/as-portas')}
            >
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-sm group-hover:text-amber-400 transition-colors">
                      As Portas
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Onde a psique está
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-amber-400 transition-all" />
                </div>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:border-emerald-500/50 hover:shadow-md transition-all group"
              onClick={() => navigate('/metodo/os-campos-psiquicos')}
            >
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-sm group-hover:text-emerald-400 transition-colors">
                      Os Campos Psíquicos
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Como sustentar
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-emerald-400 transition-all" />
                </div>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:border-rose-500/50 hover:shadow-md transition-all group"
              onClick={() => navigate('/metodo/as-torres')}
            >
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-rose-500/20 flex items-center justify-center">
                    <Castle className="w-5 h-5 text-rose-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-sm group-hover:text-rose-400 transition-colors">
                      As Torres
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Por que se organizou assim
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-rose-400 transition-all" />
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}
