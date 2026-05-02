import { Link } from 'react-router-dom';
// import { SectionHeader } from '@/components/shared/SectionHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, ArrowRight, BookOpen, Loader2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Estacao {
  id: string;
  titulo: string;
  subtitulo: string;
  numero: number;
  livro_titulo: string;
  livro_autor: string | null;
  livro_capa_url: string | null;
  ativa: boolean | null;
  publicada: boolean | null;
}

export default function AdminCentralJornadas() {
  const navigate = useNavigate();
  const { data: estacoes = [], isLoading } = useQuery({
    queryKey: ['admin-central-estacoes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_estacoes')
        .select('id, titulo, subtitulo, numero, livro_titulo, livro_autor, livro_capa_url, ativa, publicada')
        .order('ordem', { ascending: true });
      if (error) throw error;
      return data as Estacao[];
    },
  });

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-primary/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => {
              (window as any).Admin_SetActiveTab?.('clube');
              navigate('/admin/clube');
            }}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-2xl font-serif text-foreground">Central de Ciclos & Estações</h2>
          </div>
          <p className="text-sm text-muted-foreground ml-10">Gerencie a sequência temporal e as obras ativas do Clube</p>
        </div>
        <Button className="bg-gold hover:bg-gold/80 text-black font-semibold gap-2" onClick={() => navigate('/admin/clube?tab=clube-premium-editor')}>
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
            Nenhuma estação cadastrada. Crie uma estação primeiro.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {estacoes.map((e) => (
            <div 
              key={e.id} 
              onClick={() => {
                (window as any).Admin_SetActiveTab?.(`central-estacao-${e.id}`);
                navigate(`/admin/clube/central/${e.id}`);
              }} 
              className="group block cursor-pointer"
            >
              <Card className="h-full hover:border-gold/40 hover:shadow-lg transition-all border-primary/5 bg-card/50">
                <CardContent className="p-5 flex gap-5">
                  <div className="w-20 h-28 shrink-0 bg-muted rounded-lg overflow-hidden border border-primary/5 shadow-sm group-hover:scale-105 transition-transform duration-500">
                    {e.livro_capa_url ? (
                      <img src={e.livro_capa_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-[10px] font-mono font-bold text-gold uppercase tracking-widest">Estação {e.numero}</span>
                        {e.ativa && <Badge className="bg-gold text-black text-[9px] h-4">Ativa</Badge>}
                        {e.publicada && <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[9px] h-4">Publicada</Badge>}
                      </div>
                      <h3 className="text-xl font-serif text-foreground truncate group-hover:text-gold transition-colors">{e.titulo}</h3>
                      <p className="text-xs text-muted-foreground italic truncate mt-1">
                        {e.livro_titulo} {e.livro_autor ? `— ${e.livro_autor}` : ''}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                       <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold flex items-center gap-1">
                         Gestão de Rota <ArrowRight className="w-3 h-3" />
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