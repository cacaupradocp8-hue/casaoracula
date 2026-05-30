
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, ArrowRight, BookOpen, Loader2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EstacaoV3 {
  id: string;
  title: string;
  subtitle: string;
  display_order: number;
  status: string;
  route?: {
    title: string;
    cover_image_url: string | null;
  };
}

export default function AdminCentralJornadas() {
  const navigate = useNavigate();
  const { data: estacoes = [], isLoading } = useQuery({
    queryKey: ['admin-central-estacoes-v3'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_v3_stations')
        .select(`
          *,
          route:clube_v3_routes(title, cover_image_url)
        `)
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data as EstacaoV3[];
    },
  });

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
            <h2 className="text-2xl font-serif text-foreground">Central de Rotas & Estações (v3)</h2>
          </div>
          <p className="text-sm text-muted-foreground ml-10">Gerencie a sequência temporal e as obras ativas do Clube</p>
        </div>
        <Button className="bg-gold hover:bg-gold/80 text-black font-semibold gap-2" onClick={() => {
          // Instead of navigating to hub, we should probably have a "New Station" dialog here
          // but for now let's navigate to where one can create it
          navigate('/admin/clube');
        }}>
          <Plus className="w-4 h-4" />
          Nova Estação
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      ) : estacoes.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center text-muted-foreground">
            Nenhuma estação cadastrada no sistema v3.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {estacoes.map((e) => (
            <div 
              key={e.id} 
              onClick={() => navigate(`/admin/clube/central/${e.id}`)} 
              className="group block cursor-pointer"
            >
              <Card className="h-full hover:border-gold/40 hover:shadow-lg transition-all border-primary/5 bg-card/50">
                <CardContent className="p-5 flex gap-5">
                  <div className="w-20 h-28 shrink-0 bg-muted rounded-lg overflow-hidden border border-primary/5 shadow-sm group-hover:scale-105 transition-transform duration-500">
                    {e.route?.cover_image_url ? (
                      <img src={e.route.cover_image_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-[10px] font-mono font-bold text-gold uppercase tracking-widest">Estação {e.display_order}</span>
                        {e.status === 'published' && <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[9px] h-4">Publicada</Badge>}
                      </div>
                      <h3 className="text-xl font-serif text-foreground truncate group-hover:text-gold transition-colors">{e.title}</h3>
                      <p className="text-xs text-muted-foreground italic truncate mt-1">
                        {e.route?.title} — {e.subtitle}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                       <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold flex items-center gap-1">
                         Gerenciar Conteúdos <ArrowRight className="w-3 h-3" />
                       </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
