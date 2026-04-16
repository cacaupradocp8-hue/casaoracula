import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, ChevronDown, Headphones, Loader2 } from 'lucide-react';

interface Semana {
  id: string;
  ciclo_id: string;
  semana_numero: number;
  data_inicio: string;
  data_fim: string | null;
  podcast_titulo: string | null;
  podcast_descricao: string | null;
  podcast_audio_url: string | null;
  podcast_externo_url: string | null;
  carta_nome: string | null;
  pergunta_contemplativa: string | null;
  pratica_titulo: string | null;
  pratica_descricao: string | null;
  pratica_guia_url: string | null;
  ativo: boolean;
}

interface Props {
  estacaoId: string;
}

export function SemanasTab({ estacaoId }: Props) {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingSemana, setEditingSemana] = useState<Semana | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    semana_numero: 1,
    data_inicio: '',
    podcast_titulo: '',
    podcast_descricao: '',
    podcast_audio_url: '',
    pratica_titulo: '',
    pratica_descricao: '',
    pergunta_contemplativa: '',
  });

  // Filtra exclusivamente por estacao_id (eixo principal da Central de Jornadas)
  const { data: semanas = [], isLoading } = useQuery({
    queryKey: ['admin-semanas-estacao', estacaoId],
    queryFn: async () => {
      const { data } = await (supabase as any)
        .from('clube_conteudo_semanal')
        .select('*')
        .eq('estacao_id', estacaoId)
        .order('semana_numero', { ascending: true });
      return (data || []) as Semana[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: typeof form & { id?: string }) => {
      const payload: any = {
        estacao_id: estacaoId,
        semana_numero: data.semana_numero,
        data_inicio: data.data_inicio || new Date().toISOString().split('T')[0],
        podcast_titulo: data.podcast_titulo || null,
        podcast_descricao: data.podcast_descricao || null,
        podcast_audio_url: data.podcast_audio_url || null,
        pratica_titulo: data.pratica_titulo || null,
        pratica_descricao: data.pratica_descricao || null,
        pergunta_contemplativa: data.pergunta_contemplativa || null,
        ativo: true,
      };
      if (data.id) {
        const { error } = await (supabase as any).from('clube_conteudo_semanal').update(payload).eq('id', data.id);
        if (error) throw error;
      } else {
        const { error } = await (supabase as any).from('clube_conteudo_semanal').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-semanas-estacao', estacaoId] });
      setDialogOpen(false);
      toast({ title: 'Semana atualizada' });
    },
    onError: (err: Error) => {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' });
    },
  });

  const openEdit = (s: Semana) => {
    setEditingSemana(s);
    setForm({
      semana_numero: s.semana_numero,
      data_inicio: s.data_inicio,
      podcast_titulo: s.podcast_titulo || '',
      podcast_descricao: s.podcast_descricao || '',
      podcast_audio_url: s.podcast_audio_url || '',
      pratica_titulo: s.pratica_titulo || '',
      pratica_descricao: s.pratica_descricao || '',
      pergunta_contemplativa: s.pergunta_contemplativa || '',
    });
    setDialogOpen(true);
  };

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Conteúdo semanal — áudio, prática e pergunta contemplativa
      </p>

      {semanas.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center text-muted-foreground text-sm">
            Nenhuma semana cadastrada. Use o Gerador Semanal para criar conteúdo.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {semanas.map((s) => (
            <Collapsible key={s.id} open={expandedId === s.id} onOpenChange={(open) => setExpandedId(open ? s.id : null)}>
              <Card className="hover:border-gold/20 transition-colors">
                <CollapsibleTrigger asChild>
                  <CardContent className="p-4 flex items-center gap-3 cursor-pointer">
                    <Badge variant="outline" className="text-[10px] shrink-0">
                      Sem. {s.semana_numero}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-foreground truncate block">
                        {s.podcast_titulo || `Semana ${s.semana_numero}`}
                      </span>
                      <span className="text-xs text-muted-foreground">{s.data_inicio}</span>
                    </div>
                    {s.podcast_audio_url && <Headphones className="w-3.5 h-3.5 text-primary shrink-0" />}
                    <Badge variant={s.ativo ? 'default' : 'secondary'} className="text-[10px]">
                      {s.ativo ? 'Ativa' : 'Inativa'}
                    </Badge>
                    <ChevronDown className="w-4 h-4 text-muted-foreground transition-transform" />
                  </CardContent>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="px-4 pb-4 space-y-3 border-t border-border/50 pt-3">
                    {s.podcast_descricao && (
                      <div>
                        <span className="text-[10px] uppercase text-muted-foreground font-medium">Áudio</span>
                        <p className="text-xs text-foreground mt-0.5">{s.podcast_descricao}</p>
                      </div>
                    )}
                    {s.pratica_titulo && (
                      <div>
                        <span className="text-[10px] uppercase text-muted-foreground font-medium">Prática</span>
                        <p className="text-xs text-foreground mt-0.5">{s.pratica_titulo}</p>
                      </div>
                    )}
                    {s.pergunta_contemplativa && (
                      <div>
                        <span className="text-[10px] uppercase text-muted-foreground font-medium">Pergunta</span>
                        <p className="text-xs text-foreground mt-0.5 italic">{s.pergunta_contemplativa}</p>
                      </div>
                    )}
                    <Button variant="outline" size="sm" className="text-xs" onClick={() => openEdit(s)}>
                      <Pencil className="w-3 h-3 mr-1" /> Editar semana
                    </Button>
                  </div>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar Semana {form.semana_numero}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Nº da Semana</label>
                <Input type="number" value={form.semana_numero} onChange={(e) => setForm({ ...form, semana_numero: parseInt(e.target.value) || 1 })} />
              </div>
              <div>
                <label className="text-sm font-medium">Data início</label>
                <Input type="date" value={form.data_inicio} onChange={(e) => setForm({ ...form, data_inicio: e.target.value })} />
              </div>
            </div>

            <div className="p-3 rounded-lg bg-muted/30 space-y-3">
              <span className="text-xs font-semibold uppercase text-muted-foreground">🎧 Áudio da Semana</span>
              <Input value={form.podcast_titulo} onChange={(e) => setForm({ ...form, podcast_titulo: e.target.value })} placeholder="Título do áudio" />
              <Textarea value={form.podcast_descricao} onChange={(e) => setForm({ ...form, podcast_descricao: e.target.value })} placeholder="Descrição" rows={2} />
              <Input value={form.podcast_audio_url} onChange={(e) => setForm({ ...form, podcast_audio_url: e.target.value })} placeholder="URL do áudio" />
            </div>

            <div className="p-3 rounded-lg bg-muted/30 space-y-3">
              <span className="text-xs font-semibold uppercase text-muted-foreground">🧘 Prática</span>
              <Input value={form.pratica_titulo} onChange={(e) => setForm({ ...form, pratica_titulo: e.target.value })} placeholder="Título da prática" />
              <Textarea value={form.pratica_descricao} onChange={(e) => setForm({ ...form, pratica_descricao: e.target.value })} placeholder="Descrição da prática" rows={2} />
            </div>

            <div>
              <label className="text-sm font-medium">Pergunta contemplativa</label>
              <Textarea value={form.pergunta_contemplativa} onChange={(e) => setForm({ ...form, pergunta_contemplativa: e.target.value })} rows={2} />
            </div>

            <Button
              className="w-full"
              disabled={saveMutation.isPending}
              onClick={() => saveMutation.mutate({ ...form, id: editingSemana?.id })}
            >
              {saveMutation.isPending ? 'Salvando...' : 'Atualizar Semana'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
