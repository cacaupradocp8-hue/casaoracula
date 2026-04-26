import { Link } from 'react-router-dom';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, ArrowRight, BookOpen, Loader2 } from 'lucide-react';
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
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => (window as any).Admin_SetActiveTab?.('clube')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <SectionHeader
          title="Central de Ciclos"
          subtitle="Gerencie estações, estradas e livros ativos"
          icon={<BookOpen className="w-5 h-5" />}
        />
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
        <div className="space-y-3">
          {estacoes.map((e) => (
            <div key={e.id} onClick={() => (window as any).Admin_SetActiveTab?.(`central-estacao-${e.id}`)} className="group block cursor-pointer">
              <Card className="hover:border-gold/40 hover:shadow-md transition-all">
                <CardContent className="p-4 flex items-center gap-4">
                  {e.livro_capa_url ? (
                    <img src={e.livro_capa_url} alt="" className="w-12 h-16 object-cover rounded shrink-0" />
                  ) : (
                    <div className="w-12 h-16 bg-muted/50 rounded flex items-center justify-center shrink-0">
                      <BookOpen className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-semibold text-foreground truncate">{e.titulo}</h3>
                      <Badge variant={e.ativa ? 'default' : 'secondary'} className="text-[10px]">
                        {e.ativa ? 'Ativa' : 'Inativa'}
                      </Badge>
                      {e.publicada && (
                        <Badge variant="outline" className="text-[10px]">Publicada</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {e.livro_titulo}{e.livro_autor ? ` — ${e.livro_autor}` : ''}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}