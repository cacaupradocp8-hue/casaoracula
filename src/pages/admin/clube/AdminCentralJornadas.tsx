import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, BookOpen, Loader2, Eye, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EstacaoV3 {
  id: string;
  title: string;
  subtitle: string;
  display_order: number;
  status: string;
  route?: {
    title: string;
    id: string;
    cover_image_url: string | null;
  };
}

interface RotaV3 {
  id: string;
  title: string;
}

export default function AdminCentralJornadas() {
  const navigate = useNavigate();
  
  const { data: rotas = [], isLoading: rotasLoading } = useQuery({
    queryKey: ['admin-rotas-v3-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_v3_routes')
        .select('*')
        .order('id', { ascending: true });
      if (error) throw error;
      return (data || []) as RotaV3[];
    },
  });

  const { data: estacoes = [], isLoading: estacioesLoading } = useQuery({
    queryKey: ['admin-estacoes-v3-com-rotas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_v3_stations')
        .select(`
          *,
          route:clube_v3_routes(id, title, cover_image_url)
        `)
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data as EstacaoV3[];
    },
  });

  const isLoading = rotasLoading || estacioesLoading;

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-primary/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => {
              if ((window as any).Admin_SetActiveTab) {
                (window as any).Admin_SetActiveTab('clube');
              }
              navigate('/admin/clube');
            }}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-2xl font-serif text-foreground">Rotas & Estações (v3)</h2>
          </div>
          <p className="text-sm text-muted-foreground ml-10">Gerencie a sequência e visibilidade de cada estação</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      ) : rotas.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center text-muted-foreground">
            Nenhuma rota encontrada no sistema v3.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-12">
          {rotas.map((rota) => {
            const rotaEstacoes = estacoes.filter(e => e.route?.id === rota.id);
            return (
              <div key={rota.id} className="space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-primary/10">
                  <BookOpen className="w-5 h-5 text-gold" />
                  <h3 className="text-lg font-serif text-foreground">{rota.title}</h3>
                  <Badge variant="outline" className="text-[9px]">{rotaEstacoes.length} estação{rotaEstacoes.length !== 1 ? 's' : ''}</Badge>
                </div>

                {rotaEstacoes.length === 0 ? (
                  <Card className="border-dashed bg-muted/20">
                    <CardContent className="py-8 text-center text-muted-foreground text-sm">
                      Nenhuma estação nesta rota.
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {rotaEstacoes.map((estacao) => (
                      <Card key={estacao.id} className="overflow-hidden hover:border-gold/40 hover:shadow-lg transition-all border-primary/5 bg-card/50">
                        <CardContent className="p-5 flex gap-5">
                          <div className="w-24 h-36 shrink-0 bg-muted rounded-lg overflow-hidden border border-primary/5 shadow-sm">
                            {estacao.route?.cover_image_url ? (
                              <img src={estacao.route.cover_image_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <BookOpen className="w-6 h-6 text-muted-foreground/30" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className="text-[10px] font-mono font-bold text-gold uppercase tracking-widest">Estação {estacao.display_order}</span>
                                {estacao.status === 'published' && <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[9px] h-4">Publicada</Badge>}
                                {estacao.status === 'draft' && <Badge variant="secondary" className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[9px] h-4">Rascunho</Badge>}
                              </div>
                              <h3 className="text-lg font-serif text-foreground truncate group-hover:text-gold transition-colors">{estacao.title}</h3>
                              <p className="text-xs text-muted-foreground italic truncate mt-1">
                                {estacao.subtitle || 'Sem subtítulo'}
                              </p>
                            </div>
                            
                            <div className="flex items-center justify-between mt-4 gap-2">
                              <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold flex-1">
                                Operacional
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="border-primary/10 hover:bg-primary/5 gap-1.5 h-8 text-xs"
                                  onClick={() => navigate(`/admin/clube/central/${estacao.id}`)}
                                >
                                  <Settings className="w-3.5 h-3.5" />
                                  Editar
                                </Button>
                                <Button 
                                  size="sm"
                                  variant="ghost"
                                  className="gap-1.5 h-8 text-xs text-muted-foreground hover:text-gold"
                                  onClick={() => navigate('/clube')}
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  Ver
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
