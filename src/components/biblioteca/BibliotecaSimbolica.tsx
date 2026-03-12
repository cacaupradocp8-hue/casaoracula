import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Library, Search, Heart, BookOpen, Sparkles, MessageCircle, Scroll, Globe, Info, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

type SymbolicItemType = 'conto' | 'arquetipo' | 'pergunta' | 'ritual';

interface SymbolicItem {
  id: string;
  type: SymbolicItemType;
  title: string;
  content: string;
  tags: string[];
  origem_cultural: string | null;
  observacoes_leitura: string | null;
}

const typeConfig: Record<SymbolicItemType, { label: string; icon: React.ReactNode; color: string }> = {
  conto: { label: 'Conto de Poder', icon: <BookOpen className="w-4 h-4" />, color: 'bg-burgundy/20 text-burgundy-light' },
  arquetipo: { label: 'Arquétipo', icon: <Sparkles className="w-4 h-4" />, color: 'bg-gold/20 text-gold' },
  pergunta: { label: 'Pergunta Impossível', icon: <MessageCircle className="w-4 h-4" />, color: 'bg-sage/20 text-sage-light' },
  ritual: { label: 'Ritual Narrativo', icon: <Scroll className="w-4 h-4" />, color: 'bg-accent/40 text-accent-foreground' },
};

export default function BibliotecaSimbolica() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<SymbolicItemType | 'all'>('all');
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('biblioteca-favorites');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['library-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('library_items')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as SymbolicItem[];
    },
  });

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      localStorage.setItem('biblioteca-favorites', JSON.stringify([...next]));
      return next;
    });
  };

  const filteredItems = items.filter(item => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch && (selectedType === 'all' || item.type === selectedType);
  });

  return (
    <div className="space-y-6">
      <div className="glass rounded-xl p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Buscar por título, conteúdo ou tag..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
        </div>
      </div>

      <Tabs value={selectedType} onValueChange={(v) => setSelectedType(v as SymbolicItemType | 'all')} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="conto" className="gap-1"><BookOpen className="w-3 h-3" /><span className="hidden sm:inline">Contos</span></TabsTrigger>
          <TabsTrigger value="arquetipo" className="gap-1"><Sparkles className="w-3 h-3" /><span className="hidden sm:inline">Arquétipos</span></TabsTrigger>
          <TabsTrigger value="pergunta" className="gap-1"><MessageCircle className="w-3 h-3" /><span className="hidden sm:inline">Perguntas</span></TabsTrigger>
          <TabsTrigger value="ritual" className="gap-1"><Scroll className="w-3 h-3" /><span className="hidden sm:inline">Rituais</span></TabsTrigger>
        </TabsList>

        <TabsContent value={selectedType} className="mt-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : filteredItems.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Library className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">{items.length === 0 ? 'Nenhum item cadastrado ainda' : 'Nenhum item encontrado'}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredItems.map((item) => {
                const config = typeConfig[item.type];
                const isFavorite = favorites.has(item.id);
                const isExpanded = expandedId === item.id;

                return (
                  <Card key={item.id} className="group hover:shadow-gold transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className={cn('p-2 rounded-lg', config.color)}>{config.icon}</div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-xs text-muted-foreground uppercase tracking-wide">{config.label}</p>
                              {item.origem_cultural && (
                                <Badge variant="outline" className="text-xs gap-1"><Globe className="w-3 h-3" />{item.origem_cultural}</Badge>
                              )}
                            </div>
                            <CardTitle className="text-lg font-display">{item.title}</CardTitle>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => toggleFavorite(item.id)} className="flex-shrink-0">
                          <Heart className={cn('w-5 h-5 transition-colors', isFavorite ? 'fill-gold text-gold' : 'text-muted-foreground')} />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4">{item.content}</p>
                      {item.observacoes_leitura && (
                        <Collapsible open={isExpanded} onOpenChange={() => setExpandedId(isExpanded ? null : item.id)}>
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm" className="gap-2 mb-3 text-muted-foreground hover:text-foreground">
                              <Info className="w-4 h-4" />Observações de Leitura
                              <ChevronRight className={cn('w-4 h-4 transition-transform', isExpanded && 'rotate-90')} />
                            </Button>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <div className="bg-muted/50 rounded-lg p-4 mb-3 text-sm text-muted-foreground italic border-l-2 border-gold/50">{item.observacoes_leitura}</div>
                          </CollapsibleContent>
                        </Collapsible>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {item.tags?.map((tag) => (<Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
