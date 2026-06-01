import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Compass, Plus, ArrowRight, Eye, BookOpen, Sparkles, Zap, Settings2, Book
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

function getObraFromItem(item: any) {
  const metadata = (item?.metadata || {}) as Record<string, unknown>;
  const livro_titulo = typeof metadata.livro_titulo === 'string' ? metadata.livro_titulo.trim() : '';
  return livro_titulo || null;
}

export default function AdminCentralCasa() {
  const navigate = useNavigate();

  const { data: dbData } = useQuery({
    queryKey: ['admin-central-casa-v4'],
    queryFn: async () => {
      const { data: estacoes } = await supabase
        .from('clube_estacoes')
        .select('id, titulo, numero, livro_titulo, publicada')
        .order('numero', { ascending: true });
        
      const { data: items } = await supabase
        .from('clube_rota_itens')
        .select('estacao_id, rota_custom, tipo, metadata')
        .not('rota_custom', 'is', null);

      return { estacoes: estacoes || [], items: items || [] };
    }
  });

  const { estacoes, items } = dbData || { estacoes: [], items: [] };

  const handleSetTab = (tab: string) => {
    if ((window as any).Admin_SetActiveTab) {
      (window as any).Admin_SetActiveTab(tab);
    } else {
      navigate(`/admin?tab=${tab}`);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-primary/10">
        <div className="space-y-3">
          <Badge variant="outline" className="text-gold border-gold/30 bg-gold/5 px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-bold">
            Guardiã da Casa
          </Badge>
          <h1 className="text-4xl md:text-6xl font-serif text-foreground tracking-tight">
            Central da <span className="text-gold italic">Casa Orácula</span>
          </h1>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-primary/20 hover:bg-primary/5 text-muted-foreground gap-2" onClick={() => navigate('/')}>
            <Eye className="w-4 h-4" /> Visão da Aluna
          </Button>
          <Button className="bg-gold hover:bg-gold/80 text-black font-semibold gap-2" onClick={() => navigate('/admin/clube/ciclos')}>
            <Plus className="w-4 h-4" /> Nova Estação
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <Compass className="w-6 h-6 text-gold" />
              <h2 className="text-2xl font-serif text-foreground">Rotas da Casa</h2>
            </div>
            <Button variant="ghost" size="sm" className="text-gold hover:text-gold hover:bg-gold/10 gap-2" onClick={() => handleSetTab('central-rotas')}>
              Ver todas as rotas <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {(() => {
            const obraToRota = new Map<string, string>();
            const grupos = new Map<string, { rota: string; estacoes: any[]; principalObra: string }>();

            // 1) Identificar Obras vinculadas a Rotas via items
            items.forEach((i: any) => {
              if (i.tipo === 'obra_marker' && i.rota_custom) {
                const obra = getObraFromItem(i);
                if (obra) obraToRota.set(obra, i.rota_custom);
              }
            });

            // 2) Agrupar Estações Reais
            estacoes.forEach((e: any) => {
              const obra = e.livro_titulo || 'Sem Obra';
              if (obra.startsWith('SISTEMA_ROTAS:')) return;

              const rota = obraToRota.get(obra) || (obra.includes('Mulheres que Correm com os Lobos') ? 'Rota dos Lobos' : null);
              if (!rota) return;
              
              if (!grupos.has(rota)) {
                grupos.set(rota, { rota, estacoes: [], principalObra: obra });
              }
              if (e.numero > 0) {
                grupos.get(rota)!.estacoes.push(e);
              }
            });

            // 3) Adicionar Rotas que só têm Obra-base (sem estações ainda)
            items.forEach((i: any) => {
              if (i.tipo === 'obra_marker' && i.rota_custom && !grupos.has(i.rota_custom)) {
                const obra = getObraFromItem(i);
                if (obra) {
                  grupos.set(i.rota_custom, { rota: i.rota_custom, estacoes: [], principalObra: obra });
                }
              }
            });

            const rotas = Array.from(grupos.values());

            if (rotas.length === 0) {
              return <div className="p-8 text-center text-muted-foreground border border-dashed rounded-xl">Nenhuma rota mapeada.</div>;
            }

            return (
              <div className="grid grid-cols-1 gap-4">
                {rotas.map(g => {
                  const total = g.estacoes.length;
                  const publicadas = g.estacoes.filter((e: any) => e.publicada).length;
                  return (
                    <Card key={g.rota} className="bg-card/60 border-primary/10 backdrop-blur-xl">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex gap-4">
                            <div className="p-3 rounded-2xl bg-gold/10 text-gold"><Sparkles className="w-6 h-6" /></div>
                            <div>
                              <h3 className="text-xl font-serif text-foreground">{g.rota}</h3>
                              <p className="text-xs text-muted-foreground mt-1">Obra principal: {g.principalObra}</p>
                              <p className="text-xs text-muted-foreground">{total} estação(ões) · {publicadas} publicada(s)</p>
                            </div>
                          </div>
                          <Badge className={publicadas > 0 ? 'bg-gold text-black' : 'bg-muted text-muted-foreground'}>
                            {publicadas > 0 ? 'Ativa' : 'Rascunho'}
                          </Badge>
                        </div>
                        <div className="flex gap-2 mt-6 pt-6 border-t border-primary/5">
                          <Button size="sm" className="bg-gold text-black font-bold gap-2" onClick={() => navigate('/admin/rotas')}>
                            <Zap className="w-4 h-4" /> Gerenciar Rota
                          </Button>
                          <Button size="sm" variant="outline" className="border-primary/20 gap-2" onClick={() => navigate(`/admin/clube/ciclos?obra=${encodeURIComponent(g.principalObra)}`)}>
                            <Settings2 className="w-4 h-4" /> Gerir Estações
                          </Button>

                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
