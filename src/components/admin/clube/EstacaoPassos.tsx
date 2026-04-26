import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft, Plus, Pencil, Trash2, ArrowUp, ArrowDown,
  Loader2, Eye, EyeOff, Sparkles,
} from 'lucide-react';
import { PassoEditor } from './PassoEditor';
import { toast } from 'sonner';

const TIPO_LABEL: Record<string, { label: string; color: string }> = {
  portal: { label: 'Portal', color: 'bg-violet-500/10 text-violet-600 border-violet-500/30' },
  escuta: { label: 'Escuta', color: 'bg-blue-500/10 text-blue-600 border-blue-500/30' },
  aplicacao: { label: 'Aplicação', color: 'bg-amber-500/10 text-amber-600 border-amber-500/30' },
  registro: { label: 'Registro', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30' },
  integracao: { label: 'Integração', color: 'bg-rose-500/10 text-rose-600 border-rose-500/30' },
};

interface Props {
  estacao: any;
  onBack: () => void;
}

export function EstacaoPassos({ estacao, onBack }: Props) {
  const qc = useQueryClient();
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);

  const { data: passos, isLoading } = useQuery({
    queryKey: ['admin-clube-passos', estacao.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_rota_itens')
        .select('*')
        .eq('estacao_id', estacao.id)
        .order('ordem');
      if (error) throw error;
      return data || [];
    },
  });

  const reorder = useMutation({
    mutationFn: async ({ id, novaOrdem }: { id: string; novaOrdem: number }) => {
      const { error } = await supabase
        .from('clube_rota_itens')
        .update({ ordem: novaOrdem })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-clube-passos', estacao.id] }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('clube_rota_itens').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Passo removido');
      qc.invalidateQueries({ queryKey: ['admin-clube-passos', estacao.id] });
    },
  });

  const togglePublicado = useMutation({
    mutationFn: async ({ id, publicado }: { id: string; publicado: boolean }) => {
      const { error } = await supabase
        .from('clube_rota_itens')
        .update({ publicado })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-clube-passos', estacao.id] }),
  });

  const move = (idx: number, dir: -1 | 1) => {
    if (!passos) return;
    const target = passos[idx + dir];
    const current = passos[idx];
    if (!target || !current) return;
    reorder.mutate({ id: current.id, novaOrdem: target.ordem });
    reorder.mutate({ id: target.id, novaOrdem: current.ordem });
  };

  const proximaOrdem = (passos?.length || 0) + 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            Estação {estacao.numero ?? '—'} {estacao.fase_lunar && `· ${estacao.fase_lunar}`}
          </p>
          <h2 className="text-xl font-display text-foreground truncate">{estacao.titulo}</h2>
          {estacao.subtitulo && (
            <p className="text-sm text-muted-foreground truncate">{estacao.subtitulo}</p>
          )}
        </div>
        <Button size="sm" onClick={() => { setEditing(null); setEditorOpen(true); }} className="gap-1.5">
          <Plus className="w-4 h-4" /> Novo Passo
        </Button>
      </div>

      {/* Lista de passos */}
      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
      ) : !passos?.length ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center space-y-3">
            <Sparkles className="w-8 h-8 text-muted-foreground mx-auto" />
            <p className="text-sm text-muted-foreground">Nenhum passo nesta rota ainda</p>
            <Button variant="outline" size="sm" onClick={() => { setEditing(null); setEditorOpen(true); }}>
              Criar primeiro passo
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {passos.map((p: any, idx: number) => {
            const tipo = TIPO_LABEL[p.tipo_passo || p.tipo] || { label: p.tipo_passo || '—', color: '' };
            const impactos = Array.isArray(p.impacto_cidadela) ? p.impacto_cidadela : [];
            return (
              <Card key={p.id} className={p.publicado ? 'border-border' : 'border-dashed border-border/50'}>
                <CardContent className="flex items-center gap-3 py-3 pl-3 pr-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-mono shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className={`text-[10px] ${tipo.color}`}>
                        {tipo.label}
                      </Badge>
                      <span className="font-medium text-sm truncate">{p.titulo}</span>
                      {p.icone && <span className="text-sm">{p.icone}</span>}
                    </div>
                    {p.subtitulo && <p className="text-xs text-muted-foreground truncate mt-0.5">{p.subtitulo}</p>}
                    {impactos.length > 0 && (
                      <p className="text-[10px] text-muted-foreground/70 mt-1">
                        ↪ {impactos.map((i: any) => `${i.distrito} +${i.intensidade}`).join(' · ')}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-0.5 shrink-0">
                    <Button variant="ghost" size="icon" className="h-7 w-7"
                      onClick={() => move(idx, -1)} disabled={idx === 0}>
                      <ArrowUp className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7"
                      onClick={() => move(idx, 1)} disabled={idx === passos.length - 1}>
                      <ArrowDown className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7"
                      onClick={() => togglePublicado.mutate({ id: p.id, publicado: !p.publicado })}>
                      {p.publicado
                        ? <Eye className="w-3.5 h-3.5 text-primary" />
                        : <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7"
                      onClick={() => { setEditing(p); setEditorOpen(true); }}>
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7"
                      onClick={() => { if (confirm('Remover este passo?')) remove.mutate(p.id); }}>
                      <Trash2 className="w-3.5 h-3.5 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <PassoEditor
        estacaoId={estacao.id}
        passo={editing}
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        proximaOrdem={editing ? editing.ordem : proximaOrdem}
      />
    </div>
  );
}
