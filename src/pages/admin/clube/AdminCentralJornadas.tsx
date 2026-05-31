import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, BookOpen, Loader2, Eye, Settings, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EstacaoV3 {
  id: string;
  titulo: string;
  subtitulo: string;
  numero: number;
  publicada: boolean;
  ativa: boolean;
  livro_titulo: string;
  livro_capa_url: string | null;
  banner_url: string | null;
}

export default function AdminCentralJornadas() {
  const navigate = useNavigate();
  
  const { data: estacoes = [], isLoading } = useQuery({
    queryKey: ['admin-estacoes-v3-clube-estacoes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_estacoes')
        .select('*')
        .order('numero', { ascending: true });
      if (error) throw error;
      return (data || []) as EstacaoV3[];
    },
  });

  const rotasMap = estacoes.reduce((acc, estacao) => {
    const rotaKey = estacao.livro_titulo || 'Outras Rotas';
    if (!acc[rotaKey]) {
      acc[rotaKey] = {
        title: rotaKey,
        estacoes: []
      };
    }
    acc[rotaKey].estacoes.push(estacao);
    return acc;
  }, {} as Record<string, { title: string, estacoes: EstacaoV3[] }>);

  const rotas = Object.values(rotasMap);

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-primary/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => {
              if ((window as any).Admin_SetActiveTab) {
                (window as any).Admin_SetActiveTab('central-casa');
              }
              navigate('/admin');
            }}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-2xl font-serif text-foreground">Rotas da Casa</h2>
          </div>
          <p className="text-sm text-muted-foreground ml-10">
            Estrutura de jornadas e estações da Casa Orácula
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      ) : estacoes.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center text-muted-foreground">
            Nenhuma rota encontrada no sistema v3.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-12">
          {rotas.map((rota, idx) => {
            const rotaEstacoes = rota.estacoes;
            return (
              <div key={idx} className="space-y-4">
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
                            {estacao.banner_url || estacao.livro_capa_url ? (
                              <img src={estacao.banner_url || estacao.livro_capa_url || ''} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <BookOpen className="w-6 h-6 text-muted-foreground/30" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className="text-[10px] font-mono font-bold text-gold uppercase tracking-widest">Estação {estacao.numero}</span>
                                {estacao.ativa && <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-[9px] h-4">Ativa</Badge>}
                                {estacao.publicada && <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[9px] h-4">Publicada</Badge>}
                                {!estacao.publicada && <Badge variant="secondary" className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[9px] h-4">Rascunho</Badge>}
                              </div>
                              <h3 className="text-lg font-serif text-foreground truncate group-hover:text-gold transition-colors">{estacao.titulo}</h3>
                              <p className="text-xs text-muted-foreground italic truncate mt-1">
                                {estacao.subtitulo || 'Sem subtítulo'}
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
