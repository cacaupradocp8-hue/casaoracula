import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, ChevronRight, Sun, Sparkles } from 'lucide-react';
import { EstacaoPassos } from './EstacaoPassos';

export function EstacoesPassosManager() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: estacoes, isLoading } = useQuery({
    queryKey: ['admin-clube-estacoes-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_estacoes')
        .select('*, passos:clube_rota_itens(count)')
        .order('numero', { ascending: true, nullsFirst: false })
        .order('ordem', { ascending: true });
      if (error) throw error;
      return data || [];
    },
  });

  const selected = estacoes?.find(e => e.id === selectedId);

  if (selected) {
    return <EstacaoPassos estacao={selected} onBack={() => setSelectedId(null)} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-display text-foreground">Estações & Passos da Rota</h2>
        <p className="text-sm text-muted-foreground">
          Cada estação contém uma sequência de passos. A aluna percorre um passo por vez.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
      ) : !estacoes?.length ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <Sun className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              Nenhuma estação criada. Use a aba <strong>Estações Oraculares</strong> para criar primeiro.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {estacoes.map((e: any) => {
            const totalPassos = e.passos?.[0]?.count ?? 0;
            return (
              <Card
                key={e.id}
                className="cursor-pointer hover:border-primary/40 transition-colors"
                onClick={() => setSelectedId(e.id)}
              >
                <CardContent className="flex items-center gap-4 py-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-mono shrink-0">
                    {e.numero ?? '—'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm">{e.titulo}</span>
                      {e.fase_lunar && (
                        <Badge variant="outline" className="text-[10px]">{e.fase_lunar}</Badge>
                      )}
                      {e.publicada
                        ? <Badge className="text-[10px] bg-primary/20 text-primary">Publicada</Badge>
                        : <Badge variant="outline" className="text-[10px]">Rascunho</Badge>}
                    </div>
                    {e.subtitulo && <p className="text-xs text-muted-foreground truncate mt-0.5">{e.subtitulo}</p>}
                    <p className="text-[10px] text-muted-foreground/70 mt-1 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> {totalPassos} passo{totalPassos !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
