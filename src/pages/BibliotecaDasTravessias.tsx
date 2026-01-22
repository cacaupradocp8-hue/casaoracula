import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LockedContentModal } from '@/components/shared/LockedContentModal';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Lock, BookOpen, Compass, Sparkles, ChevronRight } from 'lucide-react';
import { canAccessFeature, PortalType, normalizePortalType } from '@/types/portal';

interface TravessiaFamily {
  id: string;
  nome: string;
  descricao: string | null;
  icone: string | null;
  ordem: number;
}

interface TravessiaLibraryItem {
  id: string;
  slug: string;
  titulo_ritual: string;
  subtitulo: string | null;
  categoria: string;
  quando_chamada: string;
  capa_url: string | null;
  portal_minimo: string;
  ordem: number;
  familia_id: string | null;
}

export default function BibliotecaDasTravessias() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [families, setFamilies] = useState<TravessiaFamily[]>([]);
  const [items, setItems] = useState<TravessiaLibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lockedModalOpen, setLockedModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch families
      const { data: familiesData, error: familiesError } = await supabase
        .from('travessia_familias')
        .select('*')
        .eq('ativa', true)
        .order('ordem');

      if (familiesError) throw familiesError;
      setFamilies(familiesData || []);

      // Fetch items
      const { data: itemsData, error: itemsError } = await supabase
        .from('travessia_library_items')
        .select('id, slug, titulo_ritual, subtitulo, categoria, quando_chamada, capa_url, portal_minimo, ordem, familia_id')
        .eq('publicado', true)
        .order('ordem');

      if (itemsError) throw itemsError;
      setItems(itemsData || []);
    } catch (error) {
      console.error('Error fetching biblioteca data:', error);
    } finally {
      setLoading(false);
    }
  };

  const canAccessItem = (portalMinimo: string): boolean => {
    if (!user) return false;
    return canAccessFeature(user.portal, normalizePortalType(portalMinimo as any));
  };

  // Mapeamento de itens da biblioteca que são ferramentas com rotas próprias
  const FERRAMENTA_ROUTES: Record<string, string> = {
    'cartografia-da-torre': '/ferramentas/cartografia-torre',
    'cartografia-torre': '/ferramentas/cartografia-torre',
    // Adicionar outras ferramentas conforme necessário
  };

  const handleItemClick = (item: TravessiaLibraryItem) => {
    if (!canAccessItem(item.portal_minimo)) {
      setLockedModalOpen(true);
      return;
    }

    // Verifica se o item é uma ferramenta com rota própria
    const ferramentaRoute = FERRAMENTA_ROUTES[item.slug];
    if (ferramentaRoute) {
      navigate(ferramentaRoute);
      return;
    }

    // Rota padrão da biblioteca
    navigate(`/biblioteca-das-travessias/${item.slug}`);
  };

  // Group items by familia_id or categoria as fallback
  const getItemsByFamily = (familyId: string, familyName: string) => {
    return items.filter(item => 
      item.familia_id === familyId || 
      (item.familia_id === null && item.categoria === familyName)
    );
  };

  const portalLabels: Record<PortalType, string> = {
    visitante: 'Visitante',
    mentorada: 'Mentorada',
    aluna_formacao: 'Aluna Formação',
    assinante: 'Assinante',
    oracula: 'Orácula',
    admin: 'Guardiã'
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-pulse text-muted-foreground">Carregando...</div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 space-y-10">
        {/* Header */}
        <SectionHeader
          title="Biblioteca das Travessias"
          subtitle="Ferramentas para sustentar o que não cabe em protocolos"
          icon={<BookOpen className="h-8 w-8 text-gold" />}
        />

        {/* Manifesto Block */}
        <Card className="bg-gradient-to-br from-card/80 to-card/40 border-gold/30 overflow-hidden relative">
          <div className="absolute inset-0 pattern-geometric opacity-30" />
          <CardContent className="p-8 relative">
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
                <Compass className="h-6 w-6 text-gold" />
              </div>
              <div className="space-y-4">
                <blockquote className="text-xl font-display text-foreground/90 italic border-l-2 border-gold/50 pl-4">
                  "Onde o imprevisível encontra forma, símbolo e cuidado."
                </blockquote>
                <p className="text-muted-foreground leading-relaxed">
                  Esta não é uma biblioteca de técnicas. É uma biblioteca de <em>passagens</em>.
                  Cada ferramenta aqui foi nomeada não pelo que faz, mas pelo campo que sustenta.
                  Antes de escolher, leia. Antes de aplicar, reconheça.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Symbolic Families */}
        {families.map((family) => {
          const familyItems = getItemsByFamily(family.id, family.nome);
          
          return (
            <section key={family.id} className="space-y-6">
              {/* Family Header */}
              <Card className="bg-card/30 border-gold/20">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-5 w-5 text-gold" />
                    <CardTitle className="font-display text-xl text-foreground">
                      {family.nome}
                    </CardTitle>
                  </div>
                  {family.descricao && (
                    <CardDescription className="text-muted-foreground/80 mt-2 leading-relaxed">
                      {family.descricao}
                    </CardDescription>
                  )}
                </CardHeader>
              </Card>

              {/* Tools in this Family */}
              {familyItems.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {familyItems.map((item) => {
                    const isLocked = !canAccessItem(item.portal_minimo);

                    return (
                      <Card
                        key={item.id}
                        className={`group cursor-pointer transition-all duration-300 hover:shadow-lg ${
                          isLocked 
                            ? 'opacity-75 border-muted' 
                            : 'hover:border-gold/40 hover:shadow-gold/10'
                        }`}
                        onClick={() => handleItemClick(item)}
                      >
                        {/* Cover Image */}
                        {item.capa_url && (
                          <div className="relative h-40 overflow-hidden rounded-t-lg">
                            <img
                              src={item.capa_url}
                              alt={item.titulo_ritual}
                              className={`w-full h-full object-cover transition-transform duration-300 ${
                                isLocked ? 'filter blur-sm' : 'group-hover:scale-105'
                              }`}
                            />
                            {isLocked && (
                              <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                                <Lock className="h-8 w-8 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                        )}

                        <CardContent className="p-4 space-y-3">
                          {/* Header */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="space-y-1">
                              <h3 className="font-semibold text-foreground group-hover:text-gold transition-colors">
                                {item.titulo_ritual}
                              </h3>
                              {item.subtitulo && (
                                <p className="text-sm text-muted-foreground italic">
                                  {item.subtitulo}
                                </p>
                              )}
                            </div>
                            {isLocked && (
                              <Badge variant="outline" className="shrink-0 text-xs">
                                {portalLabels[item.portal_minimo]}
                              </Badge>
                            )}
                          </div>

                          {/* Quando é chamada - truncated */}
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {item.quando_chamada}
                          </p>

                          {/* Action */}
                          <div className="pt-2">
                            {isLocked ? (
                              <Button variant="outline" size="sm" className="w-full opacity-70">
                                <Lock className="h-3 w-3 mr-2" />
                                Disponível após {portalLabels[item.portal_minimo]}
                              </Button>
                            ) : (
                              <Button variant="ghost" size="sm" className="w-full group-hover:bg-gold/10 group-hover:text-gold">
                                Conhecer esta travessia
                                <ChevronRight className="h-4 w-4 ml-1" />
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <Card className="p-6 text-center border-dashed">
                  <p className="text-muted-foreground text-sm">
                    Nenhuma ferramenta publicada nesta família ainda.
                  </p>
                </Card>
              )}
            </section>
          );
        })}

        {/* Fallback for items without family */}
        {items.filter(item => !item.familia_id && !families.some(f => f.nome === item.categoria)).length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-xl font-semibold text-foreground">Outras Travessias</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {items
                .filter(item => !item.familia_id && !families.some(f => f.nome === item.categoria))
                .map((item) => {
                  const isLocked = !canAccessItem(item.portal_minimo);

                  return (
                    <Card
                      key={item.id}
                      className={`group cursor-pointer transition-all duration-300 hover:shadow-lg ${
                        isLocked 
                          ? 'opacity-75 border-muted' 
                          : 'hover:border-gold/40'
                      }`}
                      onClick={() => handleItemClick(item)}
                    >
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1">
                            <h3 className="font-semibold text-foreground group-hover:text-gold transition-colors">
                              {item.titulo_ritual}
                            </h3>
                            {item.subtitulo && (
                              <p className="text-sm text-muted-foreground italic">
                                {item.subtitulo}
                              </p>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {item.quando_chamada}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
          </section>
        )}

        {families.length === 0 && items.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">
              Nenhuma travessia disponível no momento.
            </p>
          </Card>
        )}
      </div>

      <LockedContentModal
        open={lockedModalOpen}
        onOpenChange={setLockedModalOpen}
        title="Travessia Guardada"
        description="Esta passagem requer um nível de acesso maior. Complete sua jornada para desbloquear este conteúdo."
      />
    </AppLayout>
  );
}
