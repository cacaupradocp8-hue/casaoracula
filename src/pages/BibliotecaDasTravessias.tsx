import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LockedContentModal } from '@/components/shared/LockedContentModal';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Lock, BookOpen, Compass, Sparkles } from 'lucide-react';
import { canAccessFeature, PortalType } from '@/types/portal';

interface TravessiaLibraryItem {
  id: string;
  slug: string;
  titulo_ritual: string;
  subtitulo: string | null;
  categoria: string;
  quando_chamada: string;
  capa_url: string | null;
  portal_minimo: PortalType;
  ordem: number;
}

export default function BibliotecaDasTravessias() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [items, setItems] = useState<TravessiaLibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lockedModalOpen, setLockedModalOpen] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('travessia_library_items')
        .select('id, slug, titulo_ritual, subtitulo, categoria, quando_chamada, capa_url, portal_minimo, ordem')
        .eq('publicado', true)
        .order('categoria')
        .order('ordem');

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching biblioteca items:', error);
    } finally {
      setLoading(false);
    }
  };

  const canAccessItem = (portalMinimo: PortalType): boolean => {
    if (!user) return false;
    return canAccessFeature(user.portal, portalMinimo);
  };

  const handleItemClick = (item: TravessiaLibraryItem) => {
    if (canAccessItem(item.portal_minimo)) {
      navigate(`/biblioteca-das-travessias/${item.slug}`);
    } else {
      setLockedModalOpen(true);
    }
  };

  // Group items by category
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.categoria]) {
      acc[item.categoria] = [];
    }
    acc[item.categoria].push(item);
    return acc;
  }, {} as Record<string, TravessiaLibraryItem[]>);

  const portalLabels: Record<PortalType, string> = {
    visitante: 'Visitante',
    pre_iniciada: 'Pré-Iniciada',
    iniciada: 'Iniciada',
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
      <div className="container mx-auto px-4 py-8 space-y-8">
        <SectionHeader
          title="Biblioteca das Travessias"
          subtitle="Um espaço de leitura, reconhecimento e escolha — onde compreendemos qual campo sustenta o que está sendo vivido"
          icon={<BookOpen className="h-8 w-8 text-primary" />}
        />

        {/* Introduction */}
        <Card className="bg-card/50 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Compass className="h-6 w-6 text-primary shrink-0 mt-1" />
              <div className="space-y-2">
                <p className="text-foreground/90">
                  Esta não é uma biblioteca de técnicas. É uma biblioteca de <em>passagens</em>.
                </p>
                <p className="text-muted-foreground text-sm">
                  Cada ferramenta aqui foi nomeada não pelo que faz, mas pelo campo que sustenta.
                  Antes de escolher, leia. Antes de aplicar, reconheça.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Categories and Items */}
        {Object.entries(groupedItems).map(([categoria, categoryItems]) => (
          <section key={categoria} className="space-y-4">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-primary/70" />
              <h2 className="text-xl font-semibold text-foreground">{categoria}</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categoryItems.map((item) => {
                const isLocked = !canAccessItem(item.portal_minimo);

                return (
                  <Card
                    key={item.id}
                    className={`group cursor-pointer transition-all duration-300 hover:shadow-lg ${
                      isLocked 
                        ? 'opacity-75 border-muted' 
                        : 'hover:border-primary/40'
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
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
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
                          <Button variant="ghost" size="sm" className="w-full group-hover:bg-primary/10">
                            Conhecer esta travessia
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        ))}

        {items.length === 0 && (
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
