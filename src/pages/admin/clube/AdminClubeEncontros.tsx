import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Calendar, Video } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function AdminClubeEncontros() {
  const [selectedCiclo, setSelectedCiclo] = useState<string | null>(null);

  const { data: ciclos } = useQuery({
    queryKey: ['admin-clube-ciclos-select'],
    queryFn: async () => {
      const { data } = await supabase
        .from('clube_livro_ciclos')
        .select('id, titulo, autor_livro')
        .order('ordem');
      return data || [];
    },
  });

  const { data: encontros, isLoading } = useQuery({
    queryKey: ['admin-clube-encontros', selectedCiclo],
    queryFn: async () => {
      if (!selectedCiclo) return [];
      const { data } = await (supabase as any)
        .from('clube_livro_encontros')
        .select('*')
        .eq('ciclo_id', selectedCiclo)
        .order('data_encontro', { ascending: true });
      return data || [];
    },
    enabled: !!selectedCiclo,
  });

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/admin/clube-livro">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <SectionHeader
            title="Encontros"
            subtitle="Encontros ao vivo, replays e links"
            icon={<Calendar className="w-5 h-5" />}
          />
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Filtrar por Ciclo</Label>
            <Select value={selectedCiclo || ''} onValueChange={v => setSelectedCiclo(v || null)}>
              <SelectTrigger className="w-full sm:w-80">
                <SelectValue placeholder="Selecione um ciclo..." />
              </SelectTrigger>
              <SelectContent>
                {ciclos?.map((c: any) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.titulo} {c.autor_livro ? `— ${c.autor_livro}` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {!selectedCiclo ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              <Video className="w-8 h-8 mx-auto mb-3 opacity-40" />
              Selecione um ciclo para ver os encontros.
            </div>
          ) : isLoading ? (
            <div className="animate-pulse h-20 bg-muted rounded" />
          ) : encontros && encontros.length > 0 ? (
            <div className="space-y-2">
              {encontros.map((e: any) => (
                <Card key={e.id}>
                  <CardContent className="p-4 flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{e.titulo}</p>
                      {e.data_encontro && (
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(e.data_encontro), "dd MMM yyyy 'às' HH:mm", { locale: ptBR })}
                        </p>
                      )}
                    </div>
                    <Badge variant={e.ativo ? 'default' : 'secondary'} className="text-[10px]">
                      {e.ativo ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground text-sm">
              Nenhum encontro cadastrado para este ciclo.
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
