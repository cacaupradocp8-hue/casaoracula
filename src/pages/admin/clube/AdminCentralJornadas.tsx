import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, ArrowRight, BookOpen, Loader2 } from 'lucide-react';

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
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/admin/clube">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <SectionHeader
            title="Central de Jornadas"
            subtitle="Gerencie estações, estradas, semanas e aplicação"
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
              <Link key={e.id} to={`/admin/clube/central/${e.id}`} className="group block">
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
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
