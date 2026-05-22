import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LockedContentModal } from '@/components/shared/LockedContentModal';
import { useAuth } from '@/contexts/AuthContext';
import { Lock, BookOpen, Compass, Sparkles, ChevronRight, Loader2 } from 'lucide-react';
import { canAccessFeature, PortalType, normalizePortalType } from '@/types/portal';
import { motion } from 'framer-motion';

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

export default function BibliotecaRituaisTab() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [lockedModalOpen, setLockedModalOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['biblioteca-rituais'],
    queryFn: async () => {
      // Fetch families
      const { data: familiesData, error: familiesError } = await supabase
        .from('travessia_familias')
        .select('*')
        .eq('ativa', true)
        .order('ordem');

      if (familiesError) throw familiesError;

      // Fetch items
      const { data: itemsData, error: itemsError } = await supabase
        .from('travessia_library_items')
        .select('id, slug, titulo_ritual, subtitulo, categoria, quando_chamada, capa_url, portal_minimo, ordem, familia_id')
        .eq('publicado', true)
        .order('ordem');

      if (itemsError) throw itemsError;

      return {
        families: (familiesData || []) as TravessiaFamily[],
        items: (itemsData || []) as TravessiaLibraryItem[]
      };
    },
    staleTime: 5 * 60 * 1000,
  });

  const canAccessItem = (portalMinimo: string): boolean => {
    if (!user) return false;
    return canAccessFeature(user.portal, normalizePortalType(portalMinimo as any));
  };

  const FERRAMENTA_ROUTES: Record<string, string> = {
    'cartografia-da-torre': '/ferramentas/cartografia-torre',
    'cartografia-torre': '/ferramentas/cartografia-torre',
  };

  const handleItemClick = (item: TravessiaLibraryItem) => {
    if (!canAccessItem(item.portal_minimo)) {
      setLockedModalOpen(true);
      return;
    }

    const ferramentaRoute = FERRAMENTA_ROUTES[item.slug];
    if (ferramentaRoute) {
      navigate(ferramentaRoute);
      return;
    }

    navigate(`/biblioteca-das-travessias/${item.slug}`);
  };

  const getItemsByFamily = (familyId: string, familyName: string, items: TravessiaLibraryItem[]) => {
    return items.filter(item => 
      item.familia_id === familyId || 
      (item.familia_id === null && item.categoria === familyName)
    );
  };

  const portalLabels: Record<PortalType, string> = {
    visitante: 'Visitante',
    aluna: 'Aluna',
    oracula: 'Orácula',
    assinante: 'Assinante',
    admin: 'Guardiã',
    mentorada: 'Aluna',
    aluna_formacao: 'Aluna',
    pre_iniciada: 'Aluna',
    iniciada: 'Orácula',
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const families = data?.families || [];
  const items = data?.items || [];

  return (
    <div className="space-y-10">
      {/* Manifesto Block */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-gradient-to-br from-card/80 to-card/40 border-gold/30 overflow-hidden relative">
          <div className="absolute inset-0 pattern-geometric opacity-30" />
          <CardContent className="p-8 relative">
            <div className="flex flex-col md:flex-row items-start gap-6">
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
      </motion.div>

      {/* Symbolic Families */}
      {families.map((family) => {
        const familyItems = getItemsByFamily(family.id, family.nome, items);
        
        if (familyItems.length === 0) return null;

        return (
          <section key={family.id} className="space-y-6">
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
                            {portalLabels[item.portal_minimo as PortalType] || item.portal_minimo}
                          </Badge>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {item.quando_chamada}
                      </p>

                      <div className="pt-2">
                        {isLocked ? (
                          <Button variant="outline" size="sm" className="w-full opacity-70">
                            <Lock className="h-3 w-3 mr-2" />
                            Disponível após {portalLabels[item.portal_minimo as PortalType] || item.portal_minimo}
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

      <LockedContentModal
        open={lockedModalOpen}
        onOpenChange={setLockedModalOpen}
        title="Travessia Guardada"
        description="Esta passagem requer um nível de acesso maior. Complete sua jornada para desbloquear este conteúdo."
      />
    </div>
  );
}