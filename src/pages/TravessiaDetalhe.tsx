import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProfessionalStatus } from '@/hooks/useProfessionalStatus';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { canAccessFeature, PortalType } from '@/types/portal';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { 
  Compass, 
  Moon, 
  BookOpen, 
  Shield, 
  Lock, 
  ArrowLeft,
  ArrowRight,
  Sparkles,
  DoorOpen,
  Waves,
  Castle,
  Wand2,
  ClipboardList,
  Brain,
  Users,
  Heart,
  Home,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  Compass,
  Moon,
  BookOpen,
  Shield,
  Sparkles,
  DoorOpen,
  Waves,
  Castle,
  Wand2,
  Heart,
};

const COLOR_MAP: Record<string, { bg: string; border: string; icon: string; text: string }> = {
  amber: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    icon: 'bg-amber-500/20 text-amber-400',
    text: 'text-amber-400',
  },
  purple: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    icon: 'bg-purple-500/20 text-purple-400',
    text: 'text-purple-400',
  },
  gold: {
    bg: 'bg-gold/10',
    border: 'border-gold/20',
    icon: 'bg-gold/20 text-gold',
    text: 'text-gold',
  },
  emerald: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    icon: 'bg-emerald-500/20 text-emerald-400',
    text: 'text-emerald-400',
  },
  rose: {
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20',
    icon: 'bg-rose-500/20 text-rose-400',
    text: 'text-rose-400',
  },
  blue: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    icon: 'bg-blue-500/20 text-blue-400',
    text: 'text-blue-400',
  },
};

interface Travessia {
  id: string;
  number: number;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  closing_ritual: string | null;
  icone: string;
  cor_acento: string;
  temas: string[];
  portal_minimo: PortalType;
  requer_profissional: boolean;
  ativa: boolean;
  ordem: number;
}

// Conteúdo exclusivo de cada Travessia
interface TravessiaItem {
  title: string;
  description: string;
  route: string;
  icon: LucideIcon;
}

interface TravessiaSection {
  title: string;
  description: string;
  items: TravessiaItem[];
}

// Mapeamento de quais famílias aparecem em cada travessia
const TRAVESSIA_FAMILIAS_MAP: Record<string, string[]> = {
  'travessia-zero-o-limiar-da-casa': [], // Travessia 0 - Visitantes
  'mundo-sem-simbolos': [], // Travessia 1 - Fundamentos
  'mulher-alma-antiga': ['e76ee4f5-3694-4a93-be7a-a9f84b9c312a'], // Identidade Feminina
  'codigo-narrativas': [
    '88b4d98f-677b-4229-a05d-75bd04583e32', // Ruptura & Desorganização
    '35e6a963-ce42-42da-835e-fdec06e5bc0c', // Corpo
  ],
  'guardia-caminho': [
    '88b4d98f-677b-4229-a05d-75bd04583e32', // Ruptura & Desorganização
    '35e6a963-ce42-42da-835e-fdec06e5bc0c', // Corpo
    'e76ee4f5-3694-4a93-be7a-a9f84b9c312a', // Identidade Feminina
  ],
};

const TRAVESSIA_CONTEUDO: Record<string, TravessiaSection[]> = {
  // TRAVESSIA ZERO - Conteúdo para visitantes
  'travessia-zero-o-limiar-da-casa': [
    {
      title: 'Onde estou antes de tentar mudar?',
      description: '7 dias para mapear seu ponto de partida',
      items: [
        { title: 'Dia 1 — O Silêncio', description: 'O que acontece quando paro de buscar resposta?', route: '#dia1', icon: Moon },
        { title: 'Dia 2 — O Mapa', description: 'Onde realmente estou neste momento?', route: '#dia2', icon: Compass },
        { title: 'Dia 3 — O Eco', description: 'O que repito sem perceber?', route: '#dia3', icon: Waves },
        { title: 'Dia 4 — A Pausa', description: 'O que emerge quando não há pressa?', route: '#dia4', icon: Heart },
        { title: 'Dia 5 — O Corpo', description: 'Onde meu corpo guarda tensão?', route: '#dia5', icon: Sparkles },
        { title: 'Dia 6 — O Limiar', description: 'O que preciso soltar para atravessar?', route: '#dia6', icon: DoorOpen },
        { title: 'Dia 7 — A Decisão', description: 'Estou pronta para habitar?', route: '#dia7', icon: Castle },
      ],
    },
  ],
  'mundo-sem-simbolos': [
    {
      title: 'Fundamentos Éticos',
      description: 'A base do caminho iniciático',
      items: [
        { title: 'Biblioteca das Travessias', description: 'Famílias simbólicas e ferramentas integradas', route: '/biblioteca-das-travessias', icon: BookOpen },
        { title: 'Cursos Disponíveis', description: 'Formação estruturada e guiada', route: '/cursos', icon: Sparkles },
      ],
    },
  ],
  'mulher-alma-antiga': [
    {
      title: 'A Tríade do Método Orácula',
      description: 'Fundamentos conceituais da cartografia clínica',
      items: [
        { title: 'As Portas', description: 'Onde a psique está operando agora', route: '/metodo/portas', icon: DoorOpen },
        { title: 'Os Campos Psíquicos', description: 'Como sustentar cada campo', route: '/metodo/campos-psiquicos', icon: Waves },
        { title: 'As Torres', description: 'Por que a psique se organizou assim', route: '/metodo/torres', icon: Castle },
      ],
    },
    {
      title: 'Recursos Complementares',
      description: 'Conteúdos de apoio à formação',
      items: [
        { title: 'Síntese da Tríade', description: 'Visão integrada do método', route: '/metodo/triade', icon: Compass },
        { title: 'Biblioteca de Contos', description: 'Narrativas simbólicas em texto e áudio', route: '/biblioteca', icon: BookOpen },
      ],
    },
  ],
  'codigo-narrativas': [
    {
      title: 'Ferramentas de Escuta',
      description: 'Instrumentos para prática profissional',
      items: [
        { title: 'Labirinto das 39 Portas', description: 'Protocolo formativo de leitura psíquica', route: '/labirinto', icon: DoorOpen },
        { title: 'SYNTHEIA — O Templo', description: 'Inteligência operacional de apoio à profissional', route: '/syntheia', icon: Wand2 },
        { title: 'Radiestesia Oracular', description: 'Leitura em 5 camadas de escuta profissional', route: '/radiestesia', icon: Waves },
      ],
    },
    {
      title: 'Sala de Trabalho',
      description: 'Espaço de prática clínica',
      items: [
        { title: 'Sala de Sessão', description: 'Condução estruturada com casos e grupos', route: '/session-room', icon: ClipboardList },
        { title: 'Mapas Integrados', description: 'Big5 + Eneagrama + Arquétipos', route: '/ferramentas', icon: Brain },
      ],
    },
  ],
  'guardia-caminho': [
    {
      title: 'Ferramentas Avançadas',
      description: 'Recursos exclusivos para facilitadoras certificadas',
      items: [
        { title: 'Torre Viva™', description: 'Leitura de estrutura psíquica e sobrevivência', route: '/ferramentas/torre-viva', icon: Castle },
        { title: 'Biblioteca de Casos', description: 'Vinhetas clínicas para treino de postura', route: '/biblioteca-casos', icon: BookOpen },
        { title: 'Cartografia da Torre', description: 'Mapeamento das 39 portas e 5 famílias', route: '/ferramentas/cartografia-torre', icon: Compass },
      ],
    },
    {
      title: 'Condução e Supervisão',
      description: 'Trabalho com grupos e iniciação simbólica',
      items: [
        { title: 'Sala da Orácula', description: 'Espaço sagrado da facilitadora certificada', route: '/casa', icon: Heart },
        { title: 'Mentoria Oracular', description: 'Supervisão e aprofundamento', route: '/mentoria-oracular', icon: Users },
      ],
    },
  ],
};

interface TravessiaFamilia {
  id: string;
  nome: string;
  descricao: string;
  icone: string;
  ordem: number;
  ativa: boolean;
}

interface TravessiaLibraryItem {
  id: string;
  titulo_ritual: string;
  subtitulo: string | null;
  slug: string;
  categoria: string | null;
  familia_id: string | null;
  quando_chamada: string | null;
  o_que_sustenta: string | null;
  como_atravessar: string | null;
  portal_minimo: string | null;
  publicado: boolean;
  ordem: number;
}

export default function TravessiaDetalhe() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isProfessional, isLoading: isLoadingProfessional } = useProfessionalStatus();

  // Fetch travessia from database
  const { data: travessia, isLoading: isLoadingTravessia } = useQuery({
    queryKey: ['travessia-detail', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('travessias')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      return data as Travessia;
    },
    enabled: !!slug,
  });

  // Fetch all travessias for navigation
  const { data: allTravessias = [] } = useQuery({
    queryKey: ['travessias-all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('travessias')
        .select('*')
        .order('ordem', { ascending: true });

      if (error) throw error;
      return data as Travessia[];
    },
  });

  // Fetch famílias simbólicas
  const { data: familias = [], isLoading: isLoadingFamilias } = useQuery({
    queryKey: ['travessia-familias', slug],
    queryFn: async () => {
      const familiaIds = TRAVESSIA_FAMILIAS_MAP[slug || ''] || [];
      if (familiaIds.length === 0) return [];
      
      const { data, error } = await supabase
        .from('travessia_familias')
        .select('*')
        .eq('ativa', true)
        .in('id', familiaIds)
        .order('ordem');
      
      if (error) throw error;
      return (data || []) as TravessiaFamilia[];
    },
    enabled: !!slug && !!user,
  });

  // Fetch library items
  const { data: libraryItems = [], isLoading: isLoadingItems } = useQuery({
    queryKey: ['travessia-library-items', slug],
    queryFn: async () => {
      const familiaIds = TRAVESSIA_FAMILIAS_MAP[slug || ''] || [];
      
      const { data, error } = await supabase
        .from('travessia_library_items')
        .select('*')
        .eq('publicado', true)
        .order('ordem');
      
      if (error) throw error;
      
      return (data || []).filter((item: TravessiaLibraryItem) => 
        familiaIds.includes(item.familia_id || '')
      ) as TravessiaLibraryItem[];
    },
    enabled: !!slug && !!user,
  });

  if (!user || !slug) return null;

  if (isLoadingTravessia) {
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

  if (!travessia) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8">
          <p className="text-muted-foreground">Travessia não encontrada.</p>
          <Button variant="ghost" onClick={() => navigate('/travessias')} className="mt-4">
            Voltar às Travessias
          </Button>
        </div>
      </AppLayout>
    );
  }

  const isAdmin = user.portal === 'admin';
  const Icon = ICON_MAP[travessia.icone] || Compass;
  const colors = COLOR_MAP[travessia.cor_acento] || COLOR_MAP.gold;
  const sections = TRAVESSIA_CONTEUDO[slug] || [];

  // Admin has full access
  const hasPortalAccess = isAdmin || canAccessFeature(user.portal, travessia.portal_minimo);
  const hasProfessionalAccess = isAdmin || !travessia.requer_profissional || isProfessional;
  const hasFullAccess = hasPortalAccess && hasProfessionalAccess;

  // Navigate between travessias
  const currentIndex = allTravessias.findIndex(t => t.slug === slug);
  const prevTravessia = currentIndex > 0 ? allTravessias[currentIndex - 1] : null;
  const nextTravessia = currentIndex < allTravessias.length - 1 ? allTravessias[currentIndex + 1] : null;

  const canAccessNextTravessia = nextTravessia 
    ? isAdmin || (canAccessFeature(user.portal, nextTravessia.portal_minimo) && (!nextTravessia.requer_profissional || isProfessional))
    : false;

  // Group library items by familia
  const itemsByFamilia = libraryItems.reduce((acc, item) => {
    const key = item.familia_id || 'other';
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, TravessiaLibraryItem[]>);

  const isLoadingData = isLoadingFamilias || isLoadingItems;

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20 max-w-5xl">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/jornada" className="hover:text-foreground transition-colors flex items-center gap-1">
            <Home className="w-3 h-3" />
            Casa
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/travessias" className="hover:text-foreground transition-colors">
            Travessias
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">Travessia {travessia.number}</span>
        </nav>

        {/* Header */}
        <div className={cn("rounded-2xl p-8 mb-8", colors.bg, "border", colors.border)}>
          <div className="flex items-start gap-6">
            <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center shrink-0", colors.icon)}>
              <Icon className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <Badge variant="outline" className="mb-3">Travessia {travessia.number}</Badge>
              <h1 className={cn("font-display text-3xl font-bold mb-2", colors.text)}>
                {travessia.title}
              </h1>
              {travessia.subtitle && (
                <p className="text-lg text-muted-foreground mb-4">{travessia.subtitle}</p>
              )}
              {travessia.description && (
                <p className="text-foreground/80 leading-relaxed">{travessia.description}</p>
              )}
              
              {travessia.temas && travessia.temas.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {travessia.temas.map((tema) => (
                    <span
                      key={tema}
                      className="text-xs px-3 py-1 bg-secondary/50 rounded-full text-muted-foreground"
                    >
                      {tema}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Access Warning */}
        {!hasFullAccess && (
          <Card className="mb-8 bg-amber-500/5 border-amber-500/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Acesso restrito</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {!hasPortalAccess 
                      ? `Esta travessia requer o portal ${travessia.portal_minimo}.`
                      : 'Esta travessia requer confirmação profissional.'}
                  </p>
                  {!hasProfessionalAccess && (
                    <Button 
                      variant="link" 
                      className="px-0 h-auto text-gold"
                      onClick={() => navigate('/confirmar-profissional')}
                    >
                      Fazer confirmação profissional →
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Content Sections */}
        {hasFullAccess && (
          <div className="space-y-10">
            {sections.map((section, sectionIndex) => (
              <section key={sectionIndex}>
                <div className="mb-6">
                  <h2 className="font-display text-xl font-semibold text-foreground mb-1">
                    {section.title}
                  </h2>
                  <p className="text-sm text-muted-foreground">{section.description}</p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {section.items.map((item, itemIndex) => {
                    const ItemIcon = item.icon;
                    const isClickable = !item.route.startsWith('#'); // Travessia Zero items não são clicáveis
                    
                    return (
                      <Card
                        key={itemIndex}
                        className={cn(
                          "transition-all duration-300",
                          isClickable && "group cursor-pointer hover:shadow-lg hover:border-gold/40",
                          !isClickable && "bg-card/50"
                        )}
                        onClick={() => isClickable && navigate(item.route)}
                      >
                        <CardHeader className="pb-2">
                          <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", colors.icon)}>
                            <ItemIcon className="w-5 h-5" />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <CardTitle className={cn(
                            "text-base mb-1",
                            isClickable && "group-hover:text-gold transition-colors"
                          )}>
                            {item.title}
                          </CardTitle>
                          <CardDescription className="text-sm line-clamp-2">
                            {item.description}
                          </CardDescription>
                          {isClickable && (
                            <div className="flex items-center justify-end mt-3">
                              <ArrowRight className="w-4 h-4 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-gold" />
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </section>
            ))}

            {/* Famílias Simbólicas Section - from database */}
            {familias.length > 0 && (
              <section className="pt-6 border-t border-border/50">
                <div className="mb-6">
                  <h2 className="font-display text-xl font-semibold text-foreground mb-1">
                    Famílias Simbólicas
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Travessias temáticas para acompanhamento profundo
                  </p>
                </div>

                {isLoadingData ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="space-y-8">
                    {familias.map((familia) => {
                      const FamiliaIcon = ICON_MAP[familia.icone] || Sparkles;
                      const familiaItems = itemsByFamilia[familia.id] || [];
                      
                      return (
                        <div key={familia.id} className="space-y-4">
                          <div className="flex items-start gap-4">
                            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", colors.icon)}>
                              <FamiliaIcon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium text-foreground">{familia.nome}</h3>
                              <p className="text-sm text-muted-foreground mt-1">{familia.descricao}</p>
                            </div>
                          </div>

                          {familiaItems.length > 0 ? (
                            <div className="grid sm:grid-cols-2 gap-4 ml-14">
                              {familiaItems.map((item) => (
                                <Card
                                  key={item.id}
                                  className={cn(
                                    "group cursor-pointer transition-all duration-300",
                                    "hover:shadow-lg hover:border-gold/40"
                                  )}
                                  onClick={() => navigate(`/biblioteca-das-travessias/${item.slug}`)}
                                >
                                  <CardContent className="p-4">
                                    <CardTitle className="text-base mb-1 group-hover:text-gold transition-colors">
                                      {item.titulo_ritual}
                                    </CardTitle>
                                    <CardDescription className="text-sm line-clamp-2">
                                      {item.subtitulo || item.quando_chamada}
                                    </CardDescription>
                                    <div className="flex items-center justify-end mt-3">
                                      <ArrowRight className="w-4 h-4 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-gold" />
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          ) : (
                            <div className="ml-14">
                              <p className="text-sm text-muted-foreground/60 italic">
                                Conteúdos em desenvolvimento...
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            )}
          </div>
        )}

        {/* Navigation Between Travessias */}
        <div className="flex items-center justify-between mt-12 pt-8 border-t border-border/50">
          {prevTravessia ? (
            <Button
              variant="ghost"
              className="gap-2"
              onClick={() => navigate(`/travessia/${prevTravessia.slug}`)}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Travessia {prevTravessia.number}</span>
              <span className="sm:hidden">Anterior</span>
            </Button>
          ) : (
            <Button
              variant="ghost"
              className="gap-2"
              onClick={() => navigate('/travessias')}
            >
              <ArrowLeft className="w-4 h-4" />
              Todas as Travessias
            </Button>
          )}

          {nextTravessia && (
            <Button
              variant={canAccessNextTravessia ? "default" : "ghost"}
              className={cn("gap-2", !canAccessNextTravessia && "opacity-50")}
              onClick={() => canAccessNextTravessia && navigate(`/travessia/${nextTravessia.slug}`)}
              disabled={!canAccessNextTravessia}
            >
              <span className="hidden sm:inline">Travessia {nextTravessia.number}</span>
              <span className="sm:hidden">Próxima</span>
              {canAccessNextTravessia ? (
                <ArrowRight className="w-4 h-4" />
              ) : (
                <Lock className="w-4 h-4" />
              )}
            </Button>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
