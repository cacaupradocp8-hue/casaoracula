import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, GripVertical, Loader2, Sparkles, Map, Info } from 'lucide-react';

interface Props {
  estacaoId: string;
}

export function EntradaTab({ estacaoId }: Props) {
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: estacao, isLoading } = useQuery({
    queryKey: ['admin-estacao-entrada', estacaoId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_estacoes')
        .select('*')
        .eq('id', estacaoId)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: any) => {
      const { error } = await supabase
        .from('clube_estacoes')
        .update(payload)
        .eq('id', estacaoId);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-estacao-entrada', estacaoId] });
      toast({ title: 'Configurações de Entrada salvas' });
    },
    onError: (err: Error) => {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' });
    },
  });

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 flex gap-3 items-start">
        <Info className="w-4 h-4 text-primary mt-0.5" />
        <div className="text-xs text-muted-foreground leading-relaxed">
          A <strong>Entrada</strong> é o primeiro contato da aluna com a estação. 
          Aqui você define o Quiz que guiará a voz da leitora e o Mapa da Cidadela que será construído.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quiz da Voz */}
        <Card className="border-gold/20">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-gold" />
              <h3 className="font-semibold text-foreground">Camada 1A: Quiz da Voz</h3>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium uppercase text-muted-foreground">ID do Quiz (Quiz da Voz)</label>
                <Input 
                  value={estacao?.quiz_id || ''} 
                  onChange={(e) => updateMutation.mutate({ quiz_id: e.target.value })}
                  placeholder="UUID do Quiz..."
                  className="mt-1"
                />
                <p className="text-[10px] text-muted-foreground mt-1 italic">
                  Vincule um quiz do tipo 'voz' criado no Gerenciador de Quizzes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mapa da Cidadela */}
        <Card className="border-emerald-500/20">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Map className="w-5 h-5 text-emerald-500" />
              <h3 className="font-semibold text-foreground">Camada 1B: Mapa da Cidadela</h3>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium uppercase text-muted-foreground">ID da Cartografia (Mapa)</label>
                <Input 
                  value={estacao?.cartografia_id || ''} 
                  onChange={(e) => updateMutation.mutate({ cartografia_id: e.target.value })}
                  placeholder="UUID da Cartografia..."
                  className="mt-1"
                />
                <p className="text-[10px] text-muted-foreground mt-1 italic">
                  Vincule um mapa base para esta estação.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button variant="outline" size="sm" asChild>
          <a href="/admin/quizzes" target="_blank">Gerenciar Quizzes</a>
        </Button>
      </div>
    </div>
  );
}
